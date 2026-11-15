/* A Négy hang — pure progression and anonymous, local session state. */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.NegyHangState = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const VERSION = 4;
  const STORAGE_KEY = 'a_negy_hang_session_v1';
  const STEPS = Object.freeze([
    'start', 'situation', 'initial', 'voices', 'final', 'continuation', 'biblical'
  ]);
  const LEGACY_STEPS = Object.freeze([
    'start', 'situation', 'initial', 'voices', 'final', 'influence',
    'continuation', 'biblical', 'teaching', 'reflection', 'summary'
  ]);
  const NINE_SCREEN_STEPS = Object.freeze(LEGACY_STEPS.filter(step => step !== 'teaching' && step !== 'summary'));
  const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);

  function createProgress(storyId) {
    return {
      storyId, step: 'start', voiceIndex: 0, initialChoice: null,
      finalChoice: null, decisionChanged: null, completed: false
    };
  }

  function createState(storyId = 'wallet') {
    return { version: VERSION, storyId, selectingStory: true, stories: { [storyId]: createProgress(storyId) } };
  }

  function storyFor(storyId, content) {
    return content && Array.isArray(content.stories)
      ? content.stories.find(story => story.id === storyId) || null : null;
  }

  function defaultStoryId(content) {
    return content && Array.isArray(content.stories) && content.stories.length ? content.stories[0].id : 'wallet';
  }

  function ids(items) {
    return new Set(Array.isArray(items) ? items.map(item => item.id) : []);
  }

  function voicesFor(story, content) {
    return Array.isArray(story.voices) ? story.voices : content.voices;
  }

  function getProgress(state) {
    return object(state) && object(state.stories) && Object.hasOwn(state.stories, state.storyId)
      ? state.stories[state.storyId] : null;
  }

  function copyProgress(progress) {
    return {
      storyId: progress.storyId, step: progress.step, voiceIndex: progress.voiceIndex,
      initialChoice: progress.initialChoice, finalChoice: progress.finalChoice,
      decisionChanged: progress.decisionChanged, completed: progress.completed
    };
  }

  /** Validate stage ordering before accepting either current or legacy answers. */
  function validPhase(candidate, content, steps, finalRequired = 'continuation') {
    if (!object(candidate) || !steps.includes(candidate.step) || typeof candidate.storyId !== 'string') return false;
    const story = storyFor(candidate.storyId, content);
    if (!story || !Array.isArray(story.choices)) return false;
    const voices = voicesFor(story, content);
    if (!Array.isArray(voices) || !voices.length) return false;
    const lastVoice = voices.length - 1, index = steps.indexOf(candidate.step);
    if (!Number.isInteger(candidate.voiceIndex) || candidate.voiceIndex < 0 || candidate.voiceIndex > lastVoice ||
        (index < steps.indexOf('voices') && candidate.voiceIndex !== 0) ||
        (index > steps.indexOf('voices') && candidate.voiceIndex !== lastVoice)) return false;
    const choices = ids(story.choices);
    const fieldValid = (value, earliest, required) => {
      if (index < steps.indexOf(earliest)) return value === null;
      if (index >= steps.indexOf(required)) return choices.has(value);
      return value === null || choices.has(value);
    };
    return fieldValid(candidate.initialChoice, 'initial', 'voices') && fieldValid(candidate.finalChoice, 'final', finalRequired);
  }

  function normalizeProgress(candidate, content, storyId) {
    if (!validPhase(candidate, content, STEPS) || candidate.storyId !== storyId ||
        typeof candidate.completed !== 'boolean' ||
        candidate.decisionChanged !== (candidate.finalChoice === null ? null : candidate.initialChoice !== candidate.finalChoice) ||
        (candidate.completed && candidate.step !== 'biblical')) return null;
    return copyProgress(candidate);
  }

  /** Return only known story records and explicit public fields. Never mutate the input. */
  function normalize(candidate, content) {
    if (!object(candidate) || candidate.version !== VERSION || typeof candidate.storyId !== 'string' ||
        !storyFor(candidate.storyId, content) || typeof candidate.selectingStory !== 'boolean' ||
        !object(candidate.stories) || !Object.hasOwn(candidate.stories, candidate.storyId)) return null;
    const entries = [];
    for (const [storyId, progress] of Object.entries(candidate.stories)) {
      const clean = normalizeProgress(progress, content, storyId);
      if (!clean) return null;
      entries.push([storyId, clean]);
    }
    const stories = Object.fromEntries(entries);
    if (!candidate.selectingStory && stories[candidate.storyId].step === 'start') return null;
    return { version: VERSION, storyId: candidate.storyId, selectingStory: candidate.selectingStory, stories };
  }

  function validLegacy(candidate, content) {
    if (!object(candidate) || ![1, 2, 3].includes(candidate.version)) return false;
    if (candidate.version === 3) return normalizeProgress(candidate, content, candidate.storyId) !== null;
    const steps = candidate.version === 1 ? LEGACY_STEPS : NINE_SCREEN_STEPS;
    if (!validPhase(candidate, content, steps, 'influence')) return false;
    const index = steps.indexOf(candidate.step);
    const fieldValid = (value, validIds, earliest, required) => {
      if (index < steps.indexOf(earliest)) return value === null;
      if (required && index >= steps.indexOf(required)) return validIds.has(value);
      return value === null || validIds.has(value);
    };
    const reflections = ids(content.finalReflections);
    return typeof candidate.takeaway === 'string' &&
      fieldValid(candidate.influence, ids(content.influences), 'influence', 'continuation') &&
      fieldValid(candidate.reflection, reflections, 'reflection', candidate.version === 1 ? 'summary' : null) &&
      (index >= steps.indexOf('reflection') || candidate.takeaway === '') &&
      (candidate.version === 1 || (typeof candidate.completed === 'boolean' &&
        (!candidate.completed || (candidate.step === 'reflection' && reflections.has(candidate.reflection)))));
  }

  function migrateLegacy(candidate, content) {
    if (!validLegacy(candidate, content)) return null;
    const step = candidate.step === 'influence' ? 'continuation'
      : ['teaching', 'reflection', 'summary'].includes(candidate.step) ? 'biblical' : candidate.step;
    const progress = {
      storyId: candidate.storyId, step, voiceIndex: candidate.voiceIndex,
      initialChoice: candidate.initialChoice, finalChoice: candidate.finalChoice,
      decisionChanged: candidate.finalChoice === null ? null : candidate.initialChoice !== candidate.finalChoice,
      completed: candidate.version === 1 ? candidate.step === 'summary' : candidate.completed
    };
    return normalize({ version: VERSION, storyId: candidate.storyId, selectingStory: step === 'start',
      stories: { [candidate.storyId]: progress } }, content);
  }

  function validate(state, content) {
    return normalize(state, content) !== null;
  }

  /** Story selection changes the view; each story keeps its own independent progress. */
  function transition(state, action, content) {
    const next = normalize(state, content) || createState(defaultStoryId(content));
    if (!action || typeof action.type !== 'string') return next;
    if (action.type === 'CHOOSE_STORY') {
      next.selectingStory = true;
      return next;
    }
    if (action.type === 'SELECT_STORY' && next.selectingStory && storyFor(action.value, content)) {
      next.storyId = action.value;
      if (!Object.hasOwn(next.stories, action.value)) next.stories[action.value] = createProgress(action.value);
      return next;
    }
    if (action.type === 'RESTART') {
      next.stories[next.storyId] = createProgress(next.storyId);
      next.selectingStory = true;
      return next;
    }
    const progress = getProgress(next);
    if (action.type === 'START' && next.selectingStory) {
      next.selectingStory = false;
      if (progress.step === 'start') progress.step = 'situation';
      return next;
    }
    if (next.selectingStory || progress.completed) return next;
    const story = storyFor(next.storyId, content), choices = ids(story.choices);
    if (action.type === 'SELECT_INITIAL' && progress.step === 'initial' && choices.has(action.value)) {
      progress.initialChoice = action.value;
    } else if (action.type === 'SELECT_FINAL' && progress.step === 'final' && choices.has(action.value)) {
      progress.finalChoice = action.value;
      progress.decisionChanged = progress.initialChoice !== action.value;
    } else if (action.type === 'FINISH' && progress.step === 'biblical') {
      progress.completed = true;
    } else if (action.type === 'NEXT') {
      switch (progress.step) {
        case 'situation': progress.step = 'initial'; break;
        case 'initial': if (progress.initialChoice) progress.step = 'voices'; break;
        case 'voices':
          if (progress.voiceIndex + 1 < voicesFor(story, content).length) progress.voiceIndex++;
          else progress.step = 'final';
          break;
        case 'final': if (progress.finalChoice) progress.step = 'continuation'; break;
        case 'continuation': progress.step = 'biblical'; break;
        default: break;
      }
    }
    return next;
  }

  function getEnding(state, content) {
    const story = storyFor(state && state.storyId, content), progress = getProgress(state);
    return story && story.endings && progress && Object.hasOwn(story.endings, progress.finalChoice)
      ? story.endings[progress.finalChoice] : null;
  }

  function save(storage, state) {
    try {
      if (!storage || typeof storage.setItem !== 'function') return false;
      storage.setItem(STORAGE_KEY, JSON.stringify({
        version: state.version, storyId: state.storyId, selectingStory: state.selectingStory,
        stories: Object.fromEntries(Object.entries(state.stories).map(([storyId, progress]) => [storyId, copyProgress(progress)]))
      }));
      return true;
    } catch (_) { return false; }
  }

  function load(storage, content) {
    let raw;
    try {
      if (!storage || typeof storage.getItem !== 'function') throw new Error('No local storage');
      raw = storage.getItem(STORAGE_KEY);
    } catch (_) {
      return { state: createState(defaultStoryId(content)), recovered: false, storageAvailable: false };
    }
    let state = null;
    if (raw !== null) {
      try {
        const candidate = JSON.parse(raw);
        state = candidate && [1, 2, 3].includes(candidate.version) ? migrateLegacy(candidate, content) : normalize(candidate, content);
      } catch (_) { /* recover below */ }
    }
    const recovered = raw !== null && !state;
    state = state || createState(defaultStoryId(content));
    return { state, recovered, storageAvailable: save(storage, state) };
  }

  /** Content is required to preserve and validate other stories before resetting one. */
  function reset(storage, storyId = 'wallet', content) {
    if (!storyFor(storyId, content)) return false;
    let state = load(storage, content).state;
    state = transition(state, { type: 'CHOOSE_STORY' }, content);
    state = transition(state, { type: 'SELECT_STORY', value: storyId }, content);
    state = transition(state, { type: 'RESTART' }, content);
    save(storage, state);
    return state;
  }

  return Object.freeze({ VERSION, STORAGE_KEY, STEPS, createState, getProgress, normalize, validate, transition, getEnding, save, load, reset });
});
