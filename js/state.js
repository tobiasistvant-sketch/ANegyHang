/* A Négy hang — pure progression and anonymous, local session state. */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.NegyHangState = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const VERSION = 3;
  const STORAGE_KEY = 'a_negy_hang_session_v1';
  const STEPS = Object.freeze([
    'start', 'situation', 'initial', 'voices', 'final', 'continuation', 'biblical'
  ]);
  const LEGACY_STEPS = Object.freeze([
    'start', 'situation', 'initial', 'voices', 'final', 'influence',
    'continuation', 'biblical', 'teaching', 'reflection', 'summary'
  ]);
  const NINE_SCREEN_STEPS = Object.freeze(LEGACY_STEPS.filter(step => step !== 'teaching' && step !== 'summary'));

  function createState(storyId = 'wallet') {
    return {
      version: VERSION,
      storyId,
      step: 'start',
      voiceIndex: 0,
      initialChoice: null,
      finalChoice: null,
      decisionChanged: null,
      completed: false
    };
  }

  function storyFor(storyId, content) {
    return content && Array.isArray(content.stories)
      ? content.stories.find(story => story.id === storyId) || null
      : null;
  }

  function defaultStoryId(content) {
    return content && Array.isArray(content.stories) && content.stories.length
      ? content.stories[0].id : 'wallet';
  }

  function ids(items) {
    return new Set(Array.isArray(items) ? items.map(item => item.id) : []);
  }

  /** Return a whitelisted state, or null for an incompatible/corrupt save. */
  function normalize(candidate, content) {
    if (!validProgress(candidate, content, VERSION, STEPS) || typeof candidate.completed !== 'boolean' ||
        candidate.decisionChanged !== (candidate.finalChoice === null ? null : candidate.initialChoice !== candidate.finalChoice) ||
        (candidate.completed && candidate.step !== 'biblical')) return null;
    return {
      version: VERSION,
      storyId: candidate.storyId,
      step: candidate.step,
      voiceIndex: candidate.voiceIndex,
      initialChoice: candidate.initialChoice,
      finalChoice: candidate.finalChoice,
      decisionChanged: candidate.decisionChanged,
      completed: candidate.completed
    };
  }

  function validProgress(candidate, content, version, steps) {
    if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate) ||
        candidate.version !== version || !steps.includes(candidate.step) ||
        typeof candidate.storyId !== 'string') return false;
    const story = storyFor(candidate.storyId, content);
    if (!story || !Array.isArray(story.choices) || !Array.isArray(content.voices) || !content.voices.length) return false;
    const choices = ids(story.choices);
    const lastVoice = content.voices.length - 1;
    const index = steps.indexOf(candidate.step);

    if (!Number.isInteger(candidate.voiceIndex) || candidate.voiceIndex < 0 || candidate.voiceIndex > lastVoice) return false;
    if (index < steps.indexOf('voices') && candidate.voiceIndex !== 0) return false;
    if (index > steps.indexOf('voices') && candidate.voiceIndex !== lastVoice) return false;

    const fieldValid = (value, validIds, earliest, required) => {
      if (index < steps.indexOf(earliest)) return value === null;
      if (required && index >= steps.indexOf(required)) return validIds.has(value);
      return value === null || validIds.has(value);
    };
    if (!fieldValid(candidate.initialChoice, choices, 'initial', 'voices') ||
        !fieldValid(candidate.finalChoice, choices, 'final', version === VERSION ? 'continuation' : 'influence')) return false;
    if (version === VERSION) return true;

    // Check removed answers against the original progression before migration.
    const reflections = ids(content.finalReflections);
    return typeof candidate.takeaway === 'string' &&
      fieldValid(candidate.influence, ids(content.influences), 'influence', 'continuation') &&
      fieldValid(candidate.reflection, reflections, 'reflection', version === 1 ? 'summary' : null) &&
      (index >= steps.indexOf('reflection') || candidate.takeaway === '') &&
      (version === 1 || (typeof candidate.completed === 'boolean' &&
        (!candidate.completed || (candidate.step === 'reflection' && reflections.has(candidate.reflection)))));
  }

  /** Validate the full old progression before converting any removed step. */
  function migrateLegacy(candidate, content) {
    const steps = candidate.version === 1 ? LEGACY_STEPS : NINE_SCREEN_STEPS;
    if (!validProgress(candidate, content, candidate.version, steps)) return null;
    const step = candidate.step === 'influence' ? 'continuation'
      : ['teaching', 'reflection', 'summary'].includes(candidate.step) ? 'biblical' : candidate.step;
    return normalize({
      version: VERSION,
      storyId: candidate.storyId,
      step,
      voiceIndex: candidate.voiceIndex,
      initialChoice: candidate.initialChoice,
      finalChoice: candidate.finalChoice,
      decisionChanged: candidate.finalChoice === null ? null : candidate.initialChoice !== candidate.finalChoice,
      completed: candidate.version === 1 ? candidate.step === 'summary' : candidate.completed
    }, content);
  }

  function validate(state, content) {
    return normalize(state, content) !== null;
  }

  /** No action changes the input object; decisions lock after their own step. */
  function transition(state, action, content) {
    const current = normalize(state, content) || createState(defaultStoryId(content));
    const next = { ...current };
    if (!action || typeof action.type !== 'string') return next;
    if (action.type === 'RESTART') return createState(current.storyId);
    if (current.completed) return next;
    if (action.type === 'START' && current.step === 'start') {
      next.step = 'situation';
      return next;
    }

    const story = storyFor(current.storyId, content);
    if (!story) return next;
    const choices = ids(story.choices);
    if (action.type === 'SELECT_INITIAL' && current.step === 'initial' && choices.has(action.value)) {
      next.initialChoice = action.value;
    } else if (action.type === 'SELECT_FINAL' && current.step === 'final' && choices.has(action.value)) {
      next.finalChoice = action.value;
      next.decisionChanged = current.initialChoice !== action.value;
    } else if (action.type === 'FINISH' && current.step === 'biblical') {
      next.completed = true;
    } else if (action.type === 'NEXT') {
      switch (current.step) {
        case 'situation': next.step = 'initial'; break;
        case 'initial': if (current.initialChoice) next.step = 'voices'; break;
        case 'voices':
          if (current.voiceIndex + 1 < content.voices.length) next.voiceIndex++;
          else next.step = 'final';
          break;
        case 'final': if (current.finalChoice) next.step = 'continuation'; break;
        case 'continuation': next.step = 'biblical'; break;
        default: break;
      }
    }
    return next;
  }

  function getEnding(state, content) {
    const story = storyFor(state && state.storyId, content);
    return story && story.endings && state.finalChoice
      ? story.endings[state.finalChoice] || null : null;
  }

  function save(storage, state) {
    try {
      if (!storage || typeof storage.setItem !== 'function') return false;
      storage.setItem(STORAGE_KEY, JSON.stringify({
        version: state.version, storyId: state.storyId, step: state.step,
        voiceIndex: state.voiceIndex, initialChoice: state.initialChoice,
        finalChoice: state.finalChoice, decisionChanged: state.decisionChanged,
        completed: state.completed
      }));
      return true;
    } catch (_) {
      return false;
    }
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
        state = candidate && (candidate.version === 1 || candidate.version === 2)
          ? migrateLegacy(candidate, content) : normalize(candidate, content);
      } catch (_) { /* recover below */ }
    }
    const recovered = raw !== null && !state;
    state = state || createState(defaultStoryId(content));
    return { state, recovered, storageAvailable: save(storage, state) };
  }

  function reset(storage, storyId = 'wallet') {
    const state = createState(storyId);
    try { if (storage && typeof storage.removeItem === 'function') storage.removeItem(STORAGE_KEY); } catch (_) { /* save still attempted */ }
    save(storage, state);
    return state;
  }

  return Object.freeze({ VERSION, STORAGE_KEY, STEPS, createState, normalize, validate, transition, getEnding, save, load, reset });
});
