'use strict';
const assert = require('node:assert/strict');
const State = require('../js/state.js');
const letters = ['A', 'B', 'C', 'D'];
const voices = ['desire', 'others', 'fear', 'conscience'];
// Independent fixture: story prose and illustrations do not define progression.
const content = {
  stories: ['wallet', 'teacher'].map(id => ({ id, voices: voices.map(id => ({ id })),
    choices: letters.map(id => ({ id })), endings: Object.fromEntries(letters.map(letter => [letter, { title: id + ':' + letter }])) })),
  voices: voices.map(id => ({ id })),
  influences: [...voices, 'mixed'].map(id => ({ id })),
  finalReflections: ['same', 'different', 'uncertain'].map(id => ({ id }))
};
const action = (state, type, value) => State.transition(state, { type, value }, content);
const next = state => action(state, 'NEXT');
const progress = state => State.getProgress(state);
const clone = value => JSON.parse(JSON.stringify(value));
const select = (state, storyId) => action(action(state, 'CHOOSE_STORY'), 'SELECT_STORY', storyId);
function toInitial(storyId = 'wallet') { return next(action(State.createState(storyId), 'START')); }
function toFinal(first, storyId = 'wallet') {
  let state = next(action(toInitial(storyId), 'SELECT_INITIAL', first));
  for (let i = 0; i < 4; i++) {
    assert.equal(progress(state).step, 'voices'); assert.equal(progress(state).voiceIndex, i);
    state = next(state);
  }
  assert.equal(progress(state).step, 'final');
  return state;
}
function toBiblical(first = 'A', second = 'A', storyId = 'wallet') {
  const continuation = next(action(toFinal(first, storyId), 'SELECT_FINAL', second));
  assert.equal(progress(continuation).step, 'continuation');
  return next(continuation);
}
function playSelected(state, first, second) {
  state = next(action(state, 'START'));
  state = next(action(state, 'SELECT_INITIAL', first));
  for (let i = 0; i < 4; i++) state = next(state);
  state = next(action(state, 'SELECT_FINAL', second));
  return action(next(state), 'FINISH');
}
function memoryStorage(initial) {
  const values = new Map(initial === undefined ? [] : [[State.STORAGE_KEY, initial]]);
  return { getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)), removeItem: key => values.delete(key) };
}

let state = State.createState();
assert.equal(State.VERSION, 4);
assert.equal(State.STORAGE_KEY, 'a_negy_hang_session_v1');
assert.deepEqual(State.STEPS, ['start', 'situation', 'initial', 'voices', 'final', 'continuation', 'biblical']);
assert.equal(new Set(State.STEPS).size, 7);
assert.ok(State.validate(state, content));
assert.equal(state.selectingStory, true);
assert.deepEqual(Object.keys(state.stories), ['wallet']);
assert.deepEqual(next(state), state);
assert.equal(progress(action(state, 'SELECT_FINAL', 'A')).finalChoice, null);
assert.deepEqual(action(state, 'SELECT_STORY', 'missing'), state);
state = toInitial();
assert.equal(progress(next(state)).step, 'initial');
assert.equal(progress(action(state, 'SELECT_INITIAL', 'X')).initialChoice, null);
assert.equal(progress(action(state, 'SELECT_INITIAL', null)).initialChoice, null);
assert.deepEqual(action(state, 'SELECT_STORY', 'teacher'), state, 'Történet csak a választóoldalon váltható.');
state = toFinal('A');
assert.equal(progress(next(state)).step, 'final');
assert.equal(progress(action(state, 'SELECT_INITIAL', 'B')).initialChoice, 'A');
assert.equal(progress(action(state, 'SELECT_FINAL', 'X')).finalChoice, null);
state = action(state, 'SELECT_FINAL', 'D'); assert.equal(progress(state).decisionChanged, true);
state = action(state, 'SELECT_FINAL', 'A'); assert.equal(progress(state).decisionChanged, false);
state = next(state); assert.equal(progress(state).step, 'continuation');
assert.equal(progress(action(state, 'SELECT_FINAL', 'D')).finalChoice, 'A');
state = next(state); assert.equal(progress(state).step, 'biblical');
assert.deepEqual(next(state), state, 'Nincs újabb kötelező oldal.');
assert.equal(progress(action(state, 'FINISH')).completed, true);
console.log('✓ Hét fő képernyő, kötelező döntések és közvetlen történetfolytatás mindkét történethez.');

let journeys = 0;
for (const storyId of ['wallet', 'teacher']) for (const first of letters) for (const second of letters) {
  state = toBiblical(first, second, storyId);
  assert.equal(progress(state).completed, false);
  assert.deepEqual(next(state), state);
  state = action(state, 'FINISH');
  assert.deepEqual(progress(state), { storyId, step: 'biblical', voiceIndex: 3,
    initialChoice: first, finalChoice: second, decisionChanged: first !== second, completed: true });
  assert.equal(State.getEnding(state, content).title, storyId + ':' + second);
  assert.ok(State.validate(state, content));
  assert.deepEqual(next(state), state);
  assert.deepEqual(action(state, 'FINISH'), state);
  for (const removed of ['influence', 'reflection', 'takeaway', 'score', 'points']) assert.equal(removed in progress(state), false);
  journeys++;
}
assert.equal(journeys, 32);
assert.equal(State.getEnding(State.createState(), content), null);
assert.equal(State.getProgress(null), null);
console.log('✓ Mind a 32 döntéspár a megfelelő történet és második döntés szerinti befejezést adja.');

state = playSelected(State.createState(), 'A', 'B');
const walletDone = clone(progress(state));
state = select(state, 'teacher');
assert.equal(state.storyId, 'teacher'); assert.equal(state.selectingStory, true);
assert.deepEqual(state.stories.wallet, walletDone);
assert.deepEqual(Object.keys(state.stories), ['wallet', 'teacher']);
state = playSelected(state, 'C', 'D');
const teacherDone = clone(progress(state));
assert.deepEqual(state.stories.wallet, walletDone);
assert.equal(teacherDone.finalChoice, 'D');
const twoCompleted = clone(state);
const picker = action(state, 'CHOOSE_STORY');
assert.equal(picker.selectingStory, true);
assert.deepEqual(picker.stories, state.stories);
assert.deepEqual(next(picker), picker);
assert.deepEqual(action(picker, 'FINISH'), picker);
assert.deepEqual(action(picker, 'SELECT_INITIAL', 'A'), picker);
state = action(picker, 'START');
assert.equal(state.selectingStory, false);
assert.deepEqual(progress(state), teacherDone, 'A lezárt történet megtekintése nem indít új játékot.');
state = action(state, 'RESTART');
assert.equal(state.selectingStory, true);
assert.deepEqual(progress(state), State.createState('teacher').stories.teacher);
assert.deepEqual(state.stories.wallet, walletDone, 'Az újrajátszás csak a kiválasztott történetet törli.');
state = action(select(state, 'wallet'), 'START');
assert.deepEqual(progress(state), walletDone);
assert.deepEqual(action(state, 'SELECT_FINAL', 'D'), state);
// A half-finished story survives changing the selected story and a storage reload.
state = toFinal('D');
const inProgressWallet = clone(progress(state));
state = select(state, 'teacher'); state = action(state, 'START');
state = next(state); state = action(state, 'SELECT_INITIAL', 'B');
const inProgressTeacher = clone(progress(state));
state = select(state, 'wallet');
const switchingStorage = memoryStorage(); State.save(switchingStorage, state);
state = State.load(switchingStorage, content).state;
state = action(state, 'START');
assert.deepEqual(progress(state), inProgressWallet);
assert.deepEqual(state.stories.teacher, inProgressTeacher);
console.log('✓ Befejezett és félbehagyott történetek váltása, folytatása és célzott újrajátszása nem keveri a döntéseket.');

const checkpoints = [];
for (const storyId of ['wallet', 'teacher']) {
  state = State.createState(storyId); checkpoints.push(state);
  for (const command of [
    { type: 'START' }, { type: 'NEXT' }, { type: 'SELECT_INITIAL', value: 'B' }, { type: 'NEXT' },
    { type: 'NEXT' }, { type: 'NEXT' }, { type: 'NEXT' }, { type: 'NEXT' },
    { type: 'SELECT_FINAL', value: 'A' }, { type: 'NEXT' }, { type: 'NEXT' }, { type: 'FINISH' }
  ]) {
    const before = clone(state), old = state;
    state = State.transition(state, command, content);
    assert.notEqual(state, old); assert.deepEqual(old, before);
    checkpoints.push(state);
  }
}
checkpoints.push(twoCompleted, select(twoCompleted, 'wallet'), select(toFinal('A'), 'teacher'));
for (const checkpoint of checkpoints) {
  const storage = memoryStorage(); assert.equal(State.save(storage, checkpoint), true);
  const loaded = State.load(storage, content);
  assert.equal(loaded.recovered, false); assert.equal(loaded.storageAvailable, true);
  assert.deepEqual(loaded.state, checkpoint);
  if (checkpoint.selectingStory || progress(checkpoint).step !== 'biblical') assert.deepEqual(action(checkpoint, 'FINISH'), checkpoint);
  for (const type of ['SELECT_INFLUENCE', 'SELECT_REFLECTION', 'SET_TAKEAWAY']) assert.deepEqual(action(checkpoint, type, 'unused'), checkpoint);
}
assert.deepEqual([...new Set(checkpoints.map(checkpoint => progress(checkpoint).step))], State.STEPS);
console.log('✓ Mindkét történet minden szakasza, hangja és választóoldala újratölthető; az állapotátmenetek nem módosítják a bemenetet.');

const validCompleted = clone(twoCompleted);
const mutateActive = changes => ({ ...clone(validCompleted), stories: { ...clone(validCompleted.stories),
  teacher: { ...clone(validCompleted.stories.teacher), ...changes } } });
const corrupt = [
  '', '{', 'null', 'true', '[]', '"szöveg"',
  ...[{ version: 0 }, { version: 999 }, { version: '4' }, { storyId: 'missing' }, { storyId: 'toString' },
    { selectingStory: undefined }, { selectingStory: null }, { selectingStory: 0 }, { selectingStory: 'true' },
    { stories: null }, { stories: [] }, { stories: {} }, { stories: { wallet: validCompleted.stories.wallet } },
    { stories: { ...validCompleted.stories, missing: validCompleted.stories.wallet } }
  ].map(changes => JSON.stringify({ ...clone(validCompleted), ...changes })),
  ...[{ storyId: 'wallet' }, { step: 'missing' }, ...['start', 'influence', 'reflection', 'summary', 'teaching'].map(step => ({ step })),
    ...[4, -1, 1.5, 0].map(voiceIndex => ({ voiceIndex })),
    { initialChoice: null }, { initialChoice: 'X' }, { finalChoice: null }, { finalChoice: 'toString' },
    ...[undefined, null, false, 'true'].map(decisionChanged => ({ decisionChanged })),
    ...[undefined, null, 0, 1, 'true', {}].map(completed => ({ completed }))
  ].map(changes => JSON.stringify(mutateActive(changes))),
  ...Object.keys(validCompleted).map(key => { const missing = clone(validCompleted); delete missing[key]; return JSON.stringify(missing); }),
  ...Object.keys(validCompleted.stories.teacher).map(key => { const missing = clone(validCompleted); delete missing.stories.teacher[key]; return JSON.stringify(missing); }),
  JSON.stringify({ ...State.createState(), selectingStory: false }),
  JSON.stringify({ ...clone(validCompleted), stories: { ...clone(validCompleted.stories), wallet: { ...walletDone, decisionChanged: false } } }),
  ...[{ initialChoice: 'A' }, { finalChoice: 'B', decisionChanged: true }, { voiceIndex: 1 },
    { decisionChanged: false }, { completed: true }].map(changes => JSON.stringify({ ...State.createState(),
      stories: { wallet: { ...State.createState().stories.wallet, ...changes } } }))
];
for (const raw of corrupt) {
  const storage = memoryStorage(raw); storage.setItem('other-app-session', 'változatlan');
  const loaded = State.load(storage, content);
  assert.equal(loaded.recovered, true, raw); assert.equal(loaded.storageAvailable, true);
  assert.deepEqual(loaded.state, State.createState());
  assert.deepEqual(JSON.parse(storage.getItem(State.STORAGE_KEY)), State.createState());
  assert.equal(storage.getItem('other-app-session'), 'változatlan');
}
const withExtras = clone(validCompleted);
withExtras.ignoredField = 'kiszűrendő'; withExtras.takeaway = 'Régi globális mező.';
for (const saved of Object.values(withExtras.stories)) Object.assign(saved, { ignoredField: 'kiszűrendő', influence: 'fear', reflection: 'same', takeaway: 'Régi mező.' });
const extraStorage = memoryStorage(JSON.stringify(withExtras));
assert.deepEqual(State.load(extraStorage, content).state, validCompleted);
assert.deepEqual(JSON.parse(extraStorage.getItem(State.STORAGE_KEY)), validCompleted);
console.log('✓ Hibás és ellentmondásos többtörténetes mentések biztonságos helyreállítása; kizárólag az engedélyezett döntésmezők tárolása.');

const legacySteps = ['start', 'situation', 'initial', 'voices', 'final', 'influence', 'continuation', 'biblical', 'teaching', 'reflection', 'summary'];
const nineScreenSteps = legacySteps.filter(step => step !== 'teaching' && step !== 'summary');
function legacyStateAt(version, step, changes = {}) {
  const steps = version === 1 ? legacySteps : nineScreenSteps, index = steps.indexOf(step);
  return { version, storyId: 'wallet', step, voiceIndex: index <= steps.indexOf('voices') ? 0 : 3,
    initialChoice: index > steps.indexOf('initial') ? 'B' : null,
    finalChoice: index > steps.indexOf('final') ? 'D' : null,
    influence: index > steps.indexOf('influence') ? 'fear' : null,
    reflection: step === 'summary' ? 'different' : null,
    takeaway: step === 'summary' ? '<b>Korábbi személyes gondolat.</b>' : '',
    ...(version === 2 ? { completed: false } : {}), ...changes };
}
let migrations = 0;
function checkMigration(legacy) {
  const step = legacy.step === 'influence' ? 'continuation' : ['teaching', 'reflection', 'summary'].includes(legacy.step) ? 'biblical' : legacy.step;
  const expected = { version: 4, storyId: legacy.storyId, selectingStory: step === 'start', stories: {
    [legacy.storyId]: { storyId: legacy.storyId, step, voiceIndex: legacy.voiceIndex,
      initialChoice: legacy.initialChoice, finalChoice: legacy.finalChoice,
      decisionChanged: legacy.finalChoice === null ? null : legacy.initialChoice !== legacy.finalChoice,
      completed: legacy.version === 1 ? legacy.step === 'summary' : legacy.completed }
  } };
  const storage = memoryStorage(JSON.stringify({ ...legacy, ignoredField: 'kiszűrendő' }));
  storage.setItem('other-app-session', 'változatlan');
  const loaded = State.load(storage, content);
  assert.equal(loaded.recovered, false, JSON.stringify(legacy)); assert.equal(loaded.storageAvailable, true);
  assert.deepEqual(loaded.state, expected); assert.deepEqual(JSON.parse(storage.getItem(State.STORAGE_KEY)), expected);
  assert.deepEqual(State.load(storage, content).state, expected);
  assert.equal(storage.getItem('other-app-session'), 'változatlan'); assert.ok(State.validate(loaded.state, content));
  assert.equal(State.normalize(legacy, content), null); migrations++;
}
for (const version of [1, 2]) {
  const steps = version === 1 ? legacySteps : nineScreenSteps;
  for (const legacy of [
    ...steps.map(step => legacyStateAt(version, step)),
    ...[1, 2, 3].map(voiceIndex => legacyStateAt(version, 'voices', { voiceIndex })),
    legacyStateAt(version, 'initial', { initialChoice: 'C' }), legacyStateAt(version, 'final', { finalChoice: 'A' }),
    legacyStateAt(version, 'influence', { influence: 'mixed' }),
    legacyStateAt(version, 'reflection', { takeaway: 'Még nincs választás.' }),
    legacyStateAt(version, 'reflection', { reflection: 'uncertain', takeaway: 'Korábbi személyes gondolat.' }),
    legacyStateAt(version, 'reflection', { initialChoice: 'D', finalChoice: 'D' }),
    ...(version === 2 ? [legacyStateAt(2, 'reflection', { completed: true, reflection: 'different' })] : [])
  ]) checkMigration(legacy);
}
// v0.3.1: selected but unconfirmed decisions, all voice checkpoints and completion.
const v3Checkpoints = checkpoints.filter(checkpoint => Object.keys(checkpoint.stories).length === 1 && checkpoint.storyId === 'wallet')
  .map(checkpoint => ({ version: 3, ...clone(progress(checkpoint)) }));
for (const legacy of v3Checkpoints) checkMigration(legacy);
assert.equal(migrations, 52);
for (const version of [1, 2, 3]) {
  const full = version === 3 ? { version: 3, ...walletDone } : legacyStateAt(version,
    version === 1 ? 'summary' : 'reflection', { reflection: 'same', ...(version === 2 ? { completed: true } : {}) });
  const invalid = [
    ...[{ storyId: 'missing' }, { step: 'unknown' }, ...[-1, 4, 2, 0.5].map(voiceIndex => ({ voiceIndex })),
      { initialChoice: null }, { initialChoice: 'X' }, { finalChoice: null }, { finalChoice: 'toString' },
      { version: String(version) }].map(changes => ({ ...full, ...changes })),
    ...Object.keys(full).map(key => { const missing = { ...full }; delete missing[key]; return missing; })
  ];
  if (version === 3) invalid.push(
    { ...full, decisionChanged: false }, { ...full, decisionChanged: undefined }, { ...full, completed: 'true' },
    { ...full, step: 'continuation', completed: true }, { ...full, step: 'influence' },
    { version: 3, ...State.createState().stories.wallet, initialChoice: 'A' }
  );
  else invalid.push(
    ...[{ influence: null }, { influence: 'unknown' }, { reflection: 'unknown' }, { takeaway: null }, { takeaway: {} }].map(changes => ({ ...full, ...changes })),
    legacyStateAt(version, 'start', { initialChoice: 'A' }), legacyStateAt(version, 'start', { voiceIndex: 1 }),
    legacyStateAt(version, 'initial', { finalChoice: 'A' }), legacyStateAt(version, 'voices', { initialChoice: null }),
    legacyStateAt(version, 'voices', { finalChoice: 'A' }), legacyStateAt(version, 'final', { influence: 'fear' }),
    legacyStateAt(version, 'influence', { finalChoice: null }), legacyStateAt(version, 'continuation', { influence: null }),
    legacyStateAt(version, 'biblical', { reflection: 'same' }), legacyStateAt(version, 'biblical', { takeaway: 'Túl korai.' }),
    legacyStateAt(version, 'reflection', { voiceIndex: 0 }),
    ...(version === 1 ? [{ ...full, reflection: null }] : [
      { ...full, completed: 'true' }, { ...full, completed: true, reflection: null },
      legacyStateAt(2, 'biblical', { completed: true }), { ...full, step: 'teaching' }, { ...full, step: 'summary' }
    ])
  );
  for (const legacy of invalid) {
    const loaded = State.load(memoryStorage(JSON.stringify(legacy)), content);
    assert.equal(loaded.recovered, true, JSON.stringify(legacy)); assert.deepEqual(loaded.state, State.createState());
  }
}
console.log('✓ 52 érvényes v1/v2/v3 mentési állapot átállítása döntésvesztés nélkül; hibás régi állapotok elutasítása.');

assert.equal(State.load(null, content).storageAvailable, false);
assert.equal(State.load(null, content).recovered, false);
const forbidden = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
assert.equal(State.load(forbidden, content).storageAvailable, false);
const full = { getItem: () => JSON.stringify(validCompleted), setItem() { throw new Error('QuotaExceeded'); } };
assert.deepEqual(State.load(full, content).state, validCompleted);
assert.equal(State.load(full, content).storageAvailable, false);
assert.equal(State.save(full, validCompleted), false); assert.equal(State.save(null, validCompleted), false);
for (const command of [
  { type: 'START' }, { type: 'NEXT' }, { type: 'FINISH' }, { type: 'SELECT_INITIAL', value: 'D' }, { type: 'SELECT_FINAL', value: 'D' },
  { type: 'SELECT_INFLUENCE', value: 'mixed' }, { type: 'SELECT_REFLECTION', value: 'same' }, { type: 'SET_TAKEAWAY', value: 'Nem írható át.' }
]) assert.deepEqual(State.transition(validCompleted, command, content), validCompleted);
const storage = memoryStorage(JSON.stringify(validCompleted)); storage.setItem('other-app-session', 'változatlan');
const beforeUnsafeReset = storage.getItem(State.STORAGE_KEY);
assert.equal(State.reset(storage), false, 'Tartalmi séma nélkül nem törlünk más történeteket.');
assert.equal(storage.getItem(State.STORAGE_KEY), beforeUnsafeReset);
assert.equal(State.reset(storage, 'missing', content), false);
const resetTeacher = State.reset(storage, 'teacher', content);
assert.deepEqual(resetTeacher.stories.wallet, walletDone);
assert.deepEqual(resetTeacher.stories.teacher, State.createState('teacher').stories.teacher);
assert.deepEqual(State.load(storage, content).state, resetTeacher);
assert.equal(storage.getItem('other-app-session'), 'változatlan');
assert.deepEqual(action(validCompleted, 'UNKNOWN'), validCompleted);
assert.deepEqual(State.transition(validCompleted, null, content), validCompleted);
console.log('✓ Tárolóhiba mellett is működik; az újrakezdés nem törli a másik történetet vagy más alkalmazások tárolóját.');

const expanded = { ...content, stories: [...content.stories, { ...content.stories[0], id: 'future-story' }] };
const future = State.createState('future-story');
assert.ok(State.validate(future, expanded));
assert.equal(State.transition(future, { type: 'START' }, expanded).storyId, 'future-story');
assert.equal(State.load(memoryStorage(JSON.stringify(future)), expanded).state.storyId, 'future-story');
console.log('✓ A történetazonosítók és a történetenkénti hangok adatalapúak, további történet nem igényel új állapotgépet.');
console.log('ALL STATE TESTS PASSED.');
