/* A Négy hang — pure progression and anonymous, local session state. */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.NegyHangState = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const VERSION = 1;
  const STORAGE_KEY = 'a_negy_hang_session_v1';
  const STEPS = Object.freeze([
    'start', 'situation', 'initial', 'voices', 'final', 'influence',
    'continuation', 'biblical', 'teaching', 'reflection', 'summary'
  ]);

  function createState(storyId = 'wallet') {
    return {
      version: VERSION,
      storyId,
      step: 'start',
      voiceIndex: 0,
      initialChoice: null,
      finalChoice: null,
      influence: null,
      reflection: null,
      takeaway: ''
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
    if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate) ||
        candidate.version !== VERSION || !STEPS.includes(candidate.step) ||
        typeof candidate.storyId !== 'string' || typeof candidate.takeaway !== 'string') return null;
    const story = storyFor(candidate.storyId, content);
    if (!story || !Array.isArray(story.choices) || !Array.isArray(content.voices) || !content.voices.length) return null;
    const choices = ids(story.choices);
    const influences = ids(content.influences);
    const reflections = ids(content.finalReflections);
    const lastVoice = content.voices.length - 1;
    const index = STEPS.indexOf(candidate.step);

    if (!Number.isInteger(candidate.voiceIndex) || candidate.voiceIndex < 0 || candidate.voiceIndex > lastVoice) return null;
    if (index < STEPS.indexOf('voices') && candidate.voiceIndex !== 0) return null;
    if (index > STEPS.indexOf('voices') && candidate.voiceIndex !== lastVoice) return null;

    const fieldValid = (value, validIds, earliest, required) => {
      if (index < STEPS.indexOf(earliest)) return value === null;
      if (index >= STEPS.indexOf(required)) return validIds.has(value);
      return value === null || validIds.has(value);
    };
    if (!fieldValid(candidate.initialChoice, choices, 'initial', 'voices') ||
        !fieldValid(candidate.finalChoice, choices, 'final', 'influence') ||
        !fieldValid(candidate.influence, influences, 'influence', 'continuation') ||
        !fieldValid(candidate.reflection, reflections, 'reflection', 'summary') ||
        (index < STEPS.indexOf('reflection') && candidate.takeaway !== '')) return null;

    return {
      version: VERSION,
      storyId: candidate.storyId,
      step: candidate.step,
      voiceIndex: candidate.voiceIndex,
      initialChoice: candidate.initialChoice,
      finalChoice: candidate.finalChoice,
      influence: candidate.influence,
      reflection: candidate.reflection,
      takeaway: candidate.takeaway
    };
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
    } else if (action.type === 'SELECT_INFLUENCE' && current.step === 'influence' && ids(content.influences).has(action.value)) {
      next.influence = action.value;
    } else if (action.type === 'SELECT_REFLECTION' && current.step === 'reflection' && ids(content.finalReflections).has(action.value)) {
      next.reflection = action.value;
    } else if (action.type === 'SET_TAKEAWAY' && current.step === 'reflection' && typeof action.value === 'string') {
      next.takeaway = action.value;
    } else if (action.type === 'NEXT') {
      switch (current.step) {
        case 'situation': next.step = 'initial'; break;
        case 'initial': if (current.initialChoice) next.step = 'voices'; break;
        case 'voices':
          if (current.voiceIndex + 1 < content.voices.length) next.voiceIndex++;
          else next.step = 'final';
          break;
        case 'final': if (current.finalChoice) next.step = 'influence'; break;
        case 'influence': if (current.influence) next.step = 'continuation'; break;
        case 'continuation': next.step = 'biblical'; break;
        case 'biblical': next.step = 'teaching'; break;
        case 'teaching': next.step = 'reflection'; break;
        case 'reflection': if (current.reflection) next.step = 'summary'; break;
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
        finalChoice: state.finalChoice, influence: state.influence,
        reflection: state.reflection, takeaway: state.takeaway
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
      try { state = normalize(JSON.parse(raw), content); } catch (_) { /* recover below */ }
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
