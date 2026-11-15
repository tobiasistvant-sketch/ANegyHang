'use strict';
const assert = require('node:assert/strict');
const State = require('../js/state.js');

// Small independent data fixture keeps progression tests separate from prose/UI.
const content = {
  stories: [{ id: 'wallet', choices: ['A', 'B', 'C', 'D'].map(id => ({ id })),
    endings: Object.fromEntries(['A', 'B', 'C', 'D'].map(id => [id, { title: 'Befejezés ' + id }])) }],
  voices: ['desire', 'others', 'fear', 'conscience'].map(id => ({ id })),
  influences: ['desire', 'others', 'fear', 'conscience', 'mixed'].map(id => ({ id })),
  finalReflections: ['same', 'different', 'uncertain'].map(id => ({ id }))
};
const action = (state, type, value) => State.transition(state, { type, value }, content);
const next = state => action(state, 'NEXT');
function toInitial() { return next(action(State.createState(), 'START')); }
function toFinal(initial) {
  let state = next(action(toInitial(), 'SELECT_INITIAL', initial));
  for (let i = 0; i < 4; i++) {
    assert.equal(state.step, 'voices');
    assert.equal(state.voiceIndex, i);
    state = next(state);
  }
  assert.equal(state.step, 'final');
  return state;
}
function toBiblical(initial = 'A', final = 'A') {
  const continuation = next(action(toFinal(initial), 'SELECT_FINAL', final));
  assert.equal(continuation.step, 'continuation', 'A második döntést közvetlenül a folytatás követi.');
  const biblical = next(continuation);
  assert.equal(biblical.step, 'biblical');
  return biblical;
}
function memoryStorage(initial) {
  const values = new Map(initial === undefined ? [] : [[State.STORAGE_KEY, initial]]);
  return { getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)), removeItem: key => values.delete(key) };
}

let state = State.createState();
assert.equal(State.VERSION, 3);
assert.equal(State.STORAGE_KEY, 'a_negy_hang_session_v1');
assert.deepEqual(State.STEPS, ['start', 'situation', 'initial', 'voices', 'final', 'continuation', 'biblical']);
assert.equal(new Set(State.STEPS).size, 7);
assert.equal(state.completed, false);
assert.equal(state.decisionChanged, null);
assert.ok(State.validate(state, content));
assert.deepEqual(next(state), state);
assert.equal(action(state, 'SELECT_FINAL', 'A').finalChoice, null);
state = toInitial();
assert.equal(next(state).step, 'initial');
assert.equal(action(state, 'SELECT_INITIAL', 'X').initialChoice, null);
assert.equal(action(state, 'SELECT_INITIAL', null).initialChoice, null);
state = toFinal('A');
assert.equal(next(state).step, 'final');
assert.equal(state.initialChoice, 'A');
assert.equal(action(state, 'SELECT_INITIAL', 'B').initialChoice, 'A');
assert.equal(action(state, 'SELECT_FINAL', 'X').finalChoice, null);
state = action(state, 'SELECT_FINAL', 'D');
assert.equal(state.decisionChanged, true);
state = action(state, 'SELECT_FINAL', 'A');
assert.equal(state.decisionChanged, false, 'A második döntési oldalon újraválasztva frissül az egyezés.');
state = next(state);
assert.equal(state.step, 'continuation');
assert.equal(action(state, 'SELECT_FINAL', 'D').finalChoice, 'A');
state = next(state);
assert.deepEqual(next(state), state, 'A NEXT nem nyit újabb reflexiós oldalt.');
assert.equal(action(state, 'FINISH').completed, true, 'A lezáráshoz nem kell újabb válasz.');
console.log('✓ Kötelező döntések és hét fő képernyő; a második döntés után nincs köztes kérdés.');

let journeys = 0;
for (const first of ['A', 'B', 'C', 'D']) for (const second of ['A', 'B', 'C', 'D']) {
  state = toBiblical(first, second);
  assert.equal(state.completed, false);
  assert.deepEqual(next(state), state);
  state = action(state, 'FINISH');
  assert.equal(state.step, 'biblical');
  assert.equal(state.completed, true);
  assert.equal(state.initialChoice, first);
  assert.equal(state.finalChoice, second);
  assert.equal(state.decisionChanged, first !== second);
  assert.equal(state.storyId, 'wallet');
  assert.equal(State.getEnding(state, content).title, 'Befejezés ' + second);
  assert.ok(State.validate(state, content));
  assert.deepEqual(next(state), state);
  assert.deepEqual(action(state, 'FINISH'), state);
  for (const removed of ['influence', 'reflection', 'takeaway', 'score', 'points']) assert.equal(removed in state, false);
  journeys++;
}
assert.equal(journeys, 16);
console.log('✓ Mind a 16 döntéspár őrzi a két döntést, az eltérésüket, a történetazonosítót és a befejezés állapotát.');

state = State.createState();
const checkpoints = [state];
for (const command of [
  { type: 'START' }, { type: 'NEXT' }, { type: 'SELECT_INITIAL', value: 'B' }, { type: 'NEXT' },
  { type: 'NEXT' }, { type: 'NEXT' }, { type: 'NEXT' }, { type: 'NEXT' },
  { type: 'SELECT_FINAL', value: 'A' }, { type: 'NEXT' }, { type: 'NEXT' }, { type: 'FINISH' }
]) {
  const previous = { ...state }, old = state;
  state = State.transition(state, command, content);
  assert.notEqual(state, old);
  assert.deepEqual(old, previous);
  checkpoints.push(state);
}
for (const checkpoint of checkpoints) {
  const storage = memoryStorage();
  assert.equal(State.save(storage, checkpoint), true);
  const loaded = State.load(storage, content);
  assert.equal(loaded.recovered, false);
  assert.equal(loaded.storageAvailable, true);
  assert.deepEqual(loaded.state, checkpoint);
  if (checkpoint.step !== 'biblical') assert.deepEqual(action(checkpoint, 'FINISH'), checkpoint);
  for (const type of ['SELECT_INFLUENCE', 'SELECT_REFLECTION', 'SET_TAKEAWAY']) {
    assert.deepEqual(action(checkpoint, type, 'unused'), checkpoint);
  }
}
assert.deepEqual([...new Set(checkpoints.map(checkpoint => checkpoint.step))], State.STEPS);
console.log('✓ Minden képernyő és hang újratölthető; megszűnt válaszmezők nem írhatók.');

const validCompleted = { ...state };
const corrupt = [
  '', '{', 'null', 'true', '[]', '"szöveg"', JSON.stringify({ version: State.VERSION, step: 'biblical' }),
  ...[
    { version: 0 }, { version: 999 }, { version: '3' }, { storyId: 'missing' }, { step: 'missing' },
    ...['influence', 'reflection', 'summary', 'teaching'].map(step => ({ step })),
    ...[4, -1, 1.5].map(voiceIndex => ({ voiceIndex })),
    { initialChoice: null }, { initialChoice: 'X' }, { finalChoice: null }, { finalChoice: 'toString' },
    ...[undefined, null, false, 'true'].map(decisionChanged => ({ decisionChanged })),
    ...[undefined, null, 0, 1, 'true', {}].map(completed => ({ completed }))
  ].map(change => JSON.stringify({ ...validCompleted, ...change })),
  ...Object.keys(validCompleted).map(key => { const missing = { ...validCompleted }; delete missing[key]; return JSON.stringify(missing); }),
  ...[
    { ...State.createState(), initialChoice: 'A' },
    { ...State.createState(), finalChoice: 'B', decisionChanged: true },
    { ...State.createState(), voiceIndex: 1 }, { ...State.createState(), decisionChanged: false },
    { ...State.createState(), completed: true }, { ...toFinal('B'), completed: true },
    { ...next(action(toFinal('A'), 'SELECT_FINAL', 'B')), completed: true }
  ].map(candidate => JSON.stringify(candidate))
];
for (const raw of corrupt) {
  const storage = memoryStorage(raw), result = State.load(storage, content);
  assert.equal(result.recovered, true, raw);
  assert.equal(result.storageAvailable, true);
  assert.deepEqual(result.state, State.createState());
  assert.deepEqual(JSON.parse(storage.getItem(State.STORAGE_KEY)), State.createState());
}
const extraStorage = memoryStorage(JSON.stringify({ ...validCompleted, ignoredField: 'kiszűrendő', influence: 'fear', reflection: 'same', takeaway: 'Régi mező.' }));
assert.deepEqual(State.load(extraStorage, content).state, validCompleted);
assert.deepEqual(JSON.parse(extraStorage.getItem(State.STORAGE_KEY)), validCompleted);
console.log('✓ Hibás és ellentmondásos mentések biztonságos helyreállítása; csak a szükséges döntésadatok tárolása.');

const legacySteps = ['start', 'situation', 'initial', 'voices', 'final', 'influence', 'continuation', 'biblical', 'teaching', 'reflection', 'summary'];
const nineScreenSteps = legacySteps.filter(step => step !== 'teaching' && step !== 'summary');
function legacyStateAt(version, step, changes = {}) {
  const steps = version === 1 ? legacySteps : nineScreenSteps, index = steps.indexOf(step);
  return {
    version, storyId: 'wallet', step, voiceIndex: index <= steps.indexOf('voices') ? 0 : 3,
    initialChoice: index > steps.indexOf('initial') ? 'B' : null,
    finalChoice: index > steps.indexOf('final') ? 'D' : null,
    influence: index > steps.indexOf('influence') ? 'fear' : null,
    reflection: step === 'summary' ? 'different' : null,
    takeaway: step === 'summary' ? '<b>Korábbi személyes gondolat.</b>' : '',
    ...(version === 2 ? { completed: false } : {}), ...changes
  };
}
let migrations = 0;
for (const version of [1, 2]) {
  const steps = version === 1 ? legacySteps : nineScreenSteps;
  const legacyCheckpoints = [
    ...steps.map(step => legacyStateAt(version, step)),
    ...[1, 2, 3].map(voiceIndex => legacyStateAt(version, 'voices', { voiceIndex })),
    legacyStateAt(version, 'initial', { initialChoice: 'C' }), legacyStateAt(version, 'final', { finalChoice: 'A' }),
    legacyStateAt(version, 'influence', { influence: 'mixed' }),
    legacyStateAt(version, 'reflection', { takeaway: 'Még nincs választás.' }),
    legacyStateAt(version, 'reflection', { reflection: 'uncertain', takeaway: 'Korábbi személyes gondolat.' }),
    legacyStateAt(version, 'reflection', { initialChoice: 'D', finalChoice: 'D' }),
    ...(version === 2 ? [legacyStateAt(version, 'reflection', { completed: true, reflection: 'different', takeaway: 'Lezárt.' })] : [])
  ];
  for (const legacy of legacyCheckpoints) {
    const expected = {
      version: State.VERSION, storyId: legacy.storyId,
      step: legacy.step === 'influence' ? 'continuation' : ['teaching', 'reflection', 'summary'].includes(legacy.step) ? 'biblical' : legacy.step,
      voiceIndex: legacy.voiceIndex, initialChoice: legacy.initialChoice, finalChoice: legacy.finalChoice,
      decisionChanged: legacy.finalChoice === null ? null : legacy.initialChoice !== legacy.finalChoice,
      completed: version === 1 ? legacy.step === 'summary' : legacy.completed
    };
    const storage = memoryStorage(JSON.stringify({ ...legacy, ignoredField: 'kiszűrendő' }));
    storage.setItem('other-app-session', 'változatlan');
    const migrated = State.load(storage, content);
    assert.equal(migrated.recovered, false, `${version}:${legacy.step}`);
    assert.equal(migrated.storageAvailable, true);
    assert.deepEqual(migrated.state, expected, `${version}:${legacy.step}`);
    assert.deepEqual(JSON.parse(storage.getItem(State.STORAGE_KEY)), expected);
    assert.deepEqual(State.load(storage, content).state, expected);
    assert.equal(storage.getItem('other-app-session'), 'változatlan');
    assert.ok(State.validate(migrated.state, content));
    assert.equal(State.normalize(legacy, content), null);
    migrations++;
  }
}
assert.equal(migrations, 39);
for (const version of [1, 2]) {
  const full = legacyStateAt(version, version === 1 ? 'summary' : 'reflection', { reflection: 'same', ...(version === 2 ? { completed: true } : {}) });
  const invalidLegacy = [
    ...[
      { storyId: 'missing' }, { step: 'unknown' }, ...[-1, 4, 2, 0.5].map(voiceIndex => ({ voiceIndex })),
      { initialChoice: null }, { initialChoice: 'X' }, { finalChoice: null }, { finalChoice: 'toString' },
      { influence: null }, { influence: 'unknown' }, { reflection: 'unknown' }, { takeaway: null }, { takeaway: {} }
    ].map(change => ({ ...full, ...change })),
    ...Object.keys(full).map(key => { const missing = { ...full }; delete missing[key]; return missing; }),
    legacyStateAt(version, 'start', { initialChoice: 'A' }), legacyStateAt(version, 'start', { voiceIndex: 1 }),
    legacyStateAt(version, 'initial', { finalChoice: 'A' }), legacyStateAt(version, 'voices', { initialChoice: null }),
    legacyStateAt(version, 'voices', { finalChoice: 'A' }), legacyStateAt(version, 'final', { influence: 'fear' }),
    legacyStateAt(version, 'influence', { finalChoice: null }), legacyStateAt(version, 'continuation', { influence: null }),
    legacyStateAt(version, 'biblical', { reflection: 'same' }), legacyStateAt(version, 'biblical', { takeaway: 'Túl korai.' }),
    legacyStateAt(version, 'reflection', { reflection: 'wrong' }), legacyStateAt(version, 'reflection', { voiceIndex: 0 }),
    { ...full, version: String(version) },
    ...(version === 1 ? [{ ...full, reflection: null }] : [
      { ...full, completed: 'true' }, { ...full, completed: true, reflection: null },
      legacyStateAt(2, 'biblical', { completed: true }), { ...full, step: 'teaching' }, { ...full, step: 'summary' }
    ])
  ];
  for (const legacy of invalidLegacy) {
    const storage = memoryStorage(JSON.stringify(legacy)), loaded = State.load(storage, content);
    assert.equal(loaded.recovered, true, JSON.stringify(legacy));
    assert.deepEqual(loaded.state, State.createState());
    assert.deepEqual(JSON.parse(storage.getItem(State.STORAGE_KEY)), State.createState());
  }
}
console.log('✓ 39 érvényes régi v1/v2 állapot migrálódik döntésvesztés nélkül; a megszüntetett oldalak biztonságosan átirányítanak.');

assert.equal(State.load(null, content).storageAvailable, false);
assert.equal(State.load(null, content).recovered, false);
const forbidden = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
assert.equal(State.load(forbidden, content).storageAvailable, false);
const full = { getItem: () => JSON.stringify(validCompleted), setItem() { throw new Error('QuotaExceeded'); } };
const readable = State.load(full, content);
assert.equal(readable.storageAvailable, false);
assert.deepEqual(readable.state, validCompleted);
assert.equal(State.save(full, validCompleted), false);
assert.equal(State.save(null, validCompleted), false);
for (const command of [
  { type: 'START' }, { type: 'NEXT' }, { type: 'FINISH' }, { type: 'SELECT_INITIAL', value: 'D' }, { type: 'SELECT_FINAL', value: 'D' },
  { type: 'SELECT_INFLUENCE', value: 'mixed' }, { type: 'SELECT_REFLECTION', value: 'same' }, { type: 'SET_TAKEAWAY', value: 'Nem írható át.' }
]) assert.deepEqual(State.transition(validCompleted, command, content), validCompleted);
const storage = memoryStorage(JSON.stringify(validCompleted));
storage.setItem('other-app-session', 'változatlan');
assert.deepEqual(State.reset(storage), State.createState());
assert.deepEqual(State.load(storage, content).state, State.createState());
assert.equal(storage.getItem('other-app-session'), 'változatlan');
assert.deepEqual(action(validCompleted, 'RESTART'), State.createState());
assert.deepEqual(action(validCompleted, 'UNKNOWN'), validCompleted);
assert.deepEqual(State.transition(validCompleted, null, content), validCompleted);
console.log('✓ Tárolóhiba mellett is működik; az újrakezdés csak a saját döntéseket és lezárást törli.');

const expanded = { ...content, stories: [...content.stories, { ...content.stories[0], id: 'future-story' }] };
const future = State.createState('future-story');
assert.ok(State.validate(future, expanded));
assert.equal(State.transition(future, { type: 'START' }, expanded).storyId, 'future-story');
assert.equal(State.load(memoryStorage(JSON.stringify(future)), expanded).state.storyId, 'future-story');
console.log('✓ A történetazonosító adatalapú marad.');
console.log('ALL STATE TESTS PASSED.');
