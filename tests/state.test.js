'use strict';
const assert = require('node:assert/strict');
const State = require('../js/state.js');

// Deliberately small data fixture tests the engine independently of prose/UI.
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
  for (let voice = 0; voice < 4; voice++) {
    assert.equal(state.step, 'voices');
    assert.equal(state.voiceIndex, voice);
    state = next(state);
  }
  assert.equal(state.step, 'final');
  return state;
}
function toReflection(initial = 'A', final = 'A', influence = 'mixed') {
  let state = next(action(toFinal(initial), 'SELECT_FINAL', final));
  state = next(action(state, 'SELECT_INFLUENCE', influence));
  assert.equal(state.step, 'continuation');
  state = next(next(state));
  assert.equal(state.step, 'reflection');
  return state;
}
function memoryStorage(initial) {
  const values = new Map(initial === undefined ? [] : [[State.STORAGE_KEY, initial]]);
  return { getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)), removeItem: key => values.delete(key) };
}

let state = State.createState();
assert.equal(State.VERSION, 2);
assert.equal(State.STORAGE_KEY, 'a_negy_hang_session_v1');
assert.deepEqual(State.STEPS, ['start', 'situation', 'initial', 'voices', 'final', 'influence', 'continuation', 'biblical', 'reflection']);
assert.equal(new Set(State.STEPS).size, 9);
assert.equal(state.completed, false);
assert.ok(State.validate(state, content));
assert.deepEqual(next(state), state, 'A nyitóképernyőről csak az indítás léptet.');
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
state = next(action(state, 'SELECT_FINAL', 'D'));
assert.equal(next(state).step, 'influence');
assert.equal(action(state, 'SELECT_INFLUENCE', 'unknown').influence, null);
assert.equal(action(state, 'SELECT_FINAL', 'A').finalChoice, 'D');
state = toReflection();
assert.equal(next(state).step, 'reflection');
assert.equal(action(state, 'SELECT_REFLECTION', 'wrong').reflection, null);
assert.deepEqual(action(state, 'FINISH'), state, 'Reflexiós választás nélkül nincs lezárás.');
state = action(state, 'SELECT_REFLECTION', 'same');
assert.deepEqual(next(state), state, 'A NEXT a kiválasztott reflexiót sem zárja le.');
const optionalTakeaway = action(state, 'FINISH');
assert.equal(optionalTakeaway.completed, true);
assert.equal(optionalTakeaway.step, 'reflection');
assert.equal(optionalTakeaway.takeaway, '', 'A szabad szöveg lezáráskor is opcionális.');
console.log('✓ Kötelező választások, helyes lépéssorrend és lezárt döntések.');

let journeys = 0;
for (const first of ['A', 'B', 'C', 'D']) {
  for (const second of ['A', 'B', 'C', 'D']) {
    for (const influence of content.influences) {
      for (const reflection of content.finalReflections) {
        state = toReflection(first, second, influence.id);
        state = action(state, 'SELECT_REFLECTION', reflection.id);
        state = action(state, 'SET_TAKEAWAY', 'Árvíztűrő tükörfúrógép.');
        assert.equal(next(state).completed, false);
        state = action(state, 'FINISH');
        assert.equal(state.step, 'reflection');
        assert.equal(state.completed, true);
        assert.equal(state.initialChoice, first);
        assert.equal(state.finalChoice, second);
        assert.equal(state.influence, influence.id);
        assert.equal(state.reflection, reflection.id);
        assert.equal(State.getEnding(state, content).title, 'Befejezés ' + second);
        assert.ok(State.validate(state, content));
        assert.deepEqual(next(state), state);
        assert.deepEqual(action(state, 'FINISH'), state);
        assert.equal('score' in state, false);
        assert.equal('points' in state, false);
        journeys++;
      }
    }
  }
}
assert.equal(journeys, 240);
console.log('✓ 240 végigjátszás: 16 döntéspár × 5 befolyás × 3 reflexió, a második döntés szerinti befejezés.');

state = State.createState();
const checkpoints = [state];
for (const command of [
  { type: 'START' }, { type: 'NEXT' }, { type: 'SELECT_INITIAL', value: 'B' }, { type: 'NEXT' },
  { type: 'NEXT' }, { type: 'NEXT' }, { type: 'NEXT' }, { type: 'NEXT' },
  { type: 'SELECT_FINAL', value: 'A' }, { type: 'NEXT' },
  { type: 'SELECT_INFLUENCE', value: 'fear' }, { type: 'NEXT' },
  { type: 'NEXT' }, { type: 'NEXT' },
  { type: 'SET_TAKEAWAY', value: '<img src=x onerror=alert(1)>\nŐszinte gondolat.' },
  { type: 'SELECT_REFLECTION', value: 'uncertain' }, { type: 'FINISH' }
]) {
  const previous = { ...state };
  const old = state;
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
  if (checkpoint.step !== 'reflection') {
    assert.deepEqual(action(checkpoint, 'FINISH'), checkpoint, 'Csak reflexiós szakaszban lehet lezárni.');
  }
}
assert.ok(state.takeaway.includes('<img'));
assert.deepEqual([...new Set(checkpoints.map(checkpoint => checkpoint.step))], State.STEPS);
console.log('✓ Minden képernyő és minden hang újratöltés után folytatható; ékezetes és HTML-szerű szöveg adatként marad meg.');

const validCompleted = { ...state };
const corrupt = [
  '', '{', 'null', 'true', '[]', '"szöveg"',
  JSON.stringify({ version: State.VERSION, step: 'reflection' }),
  ...[
    { version: 0 }, { version: 3 }, { version: 999 }, { version: '2' },
    { storyId: 'missing' }, { step: 'missing' }, { step: 'summary' }, { step: 'teaching' }, { voiceIndex: 4 },
    { voiceIndex: -1 }, { voiceIndex: 1.5 }, { initialChoice: null }, { initialChoice: 'X' },
    { finalChoice: null }, { finalChoice: 'toString' }, { influence: null }, { influence: 'unknown' },
    { reflection: null }, { reflection: 'unknown' }, { takeaway: {} },
    { completed: undefined }, { completed: null }, { completed: 0 }, { completed: 1 }, { completed: 'true' }, { completed: {} }
  ].map(change => JSON.stringify({ ...validCompleted, ...change })),
  JSON.stringify({ ...State.createState(), initialChoice: 'A' }),
  JSON.stringify({ ...State.createState(), finalChoice: 'B' }),
  JSON.stringify({ ...State.createState(), voiceIndex: 1 }),
  JSON.stringify({ ...State.createState(), takeaway: 'Túl korai állapot' }),
  JSON.stringify({ ...State.createState(), completed: true }),
  JSON.stringify({ ...toFinal('B'), completed: true }),
  JSON.stringify({ ...toReflection(), completed: true })
];
for (const raw of corrupt) {
  const storage = memoryStorage(raw);
  const result = State.load(storage, content);
  assert.equal(result.recovered, true, raw);
  assert.equal(result.storageAvailable, true);
  assert.deepEqual(result.state, State.createState());
  assert.deepEqual(JSON.parse(storage.getItem(State.STORAGE_KEY)), State.createState());
}
const extra = State.load(memoryStorage(JSON.stringify({ ...validCompleted, ignoredField: 'nem kerül mentésre' })), content);
assert.equal('ignoredField' in extra.state, false);
console.log('✓ Sérült/verzióhibás/invariánsokat sértő mentések biztonságos helyreállítása; ismeretlen mezők kiszűrése.');

const legacySteps = ['start', 'situation', 'initial', 'voices', 'final', 'influence', 'continuation', 'biblical', 'teaching', 'reflection', 'summary'];
function legacyStateAt(step, changes = {}) {
  const index = legacySteps.indexOf(step);
  return {
    version: 1,
    storyId: 'wallet',
    step,
    voiceIndex: index <= legacySteps.indexOf('voices') ? 0 : 3,
    initialChoice: index > legacySteps.indexOf('initial') ? 'B' : null,
    finalChoice: index > legacySteps.indexOf('final') ? 'D' : null,
    influence: index > legacySteps.indexOf('influence') ? 'fear' : null,
    reflection: step === 'summary' ? 'different' : null,
    takeaway: step === 'summary' ? '<b>Megőrzött gondolat.</b>\nÁrvíztűrő.' : '',
    ...changes
  };
}
const legacyCheckpoints = [
  ...legacySteps.map(step => legacyStateAt(step)),
  ...[1, 2, 3].map(voiceIndex => legacyStateAt('voices', { voiceIndex })),
  legacyStateAt('initial', { initialChoice: 'C' }),
  legacyStateAt('final', { finalChoice: 'A' }),
  legacyStateAt('influence', { influence: 'mixed' }),
  legacyStateAt('reflection', { takeaway: 'Még nincs választás.' }),
  legacyStateAt('reflection', { reflection: 'uncertain', takeaway: 'Folytatható gondolat.' })
];
for (const legacy of legacyCheckpoints) {
  const expected = {
    ...legacy,
    version: State.VERSION,
    step: legacy.step === 'teaching' ? 'biblical' : legacy.step === 'summary' ? 'reflection' : legacy.step,
    completed: legacy.step === 'summary'
  };
  const storage = memoryStorage(JSON.stringify({ ...legacy, completed: !expected.completed, ignoredField: 'kiszűrendő' }));
  storage.setItem('other-app-session', 'változatlan');
  const migrated = State.load(storage, content);
  assert.equal(migrated.recovered, false, legacy.step);
  assert.equal(migrated.storageAvailable, true);
  assert.deepEqual(migrated.state, expected, legacy.step);
  assert.deepEqual(JSON.parse(storage.getItem(State.STORAGE_KEY)), expected);
  assert.deepEqual(State.load(storage, content).state, expected);
  assert.equal(storage.getItem('other-app-session'), 'változatlan');
  assert.ok(State.validate(migrated.state, content));
  assert.equal(State.normalize(legacy, content), null, 'A publikus normalizáló csak v2-t fogad; a migráció betöltéskor történik.');
}
const legacySummary = legacyStateAt('summary');
const invalidLegacy = [
  ...[
    { storyId: 'missing' }, { step: 'unknown' }, { voiceIndex: -1 }, { voiceIndex: 4 }, { voiceIndex: 2 }, { voiceIndex: 0.5 },
    { initialChoice: null }, { initialChoice: 'X' }, { finalChoice: null }, { finalChoice: 'toString' },
    { influence: null }, { influence: 'unknown' }, { reflection: null }, { reflection: 'unknown' }, { takeaway: null }, { takeaway: {} }
  ].map(change => ({ ...legacySummary, ...change })),
  ...Object.keys(legacySummary).map(key => {
    const missingField = { ...legacySummary };
    delete missingField[key];
    return missingField;
  }),
  legacyStateAt('start', { initialChoice: 'A' }),
  legacyStateAt('start', { voiceIndex: 1 }),
  legacyStateAt('initial', { finalChoice: 'A' }),
  legacyStateAt('voices', { initialChoice: null }),
  legacyStateAt('voices', { finalChoice: 'A' }),
  legacyStateAt('final', { influence: 'fear' }),
  legacyStateAt('influence', { finalChoice: null }),
  legacyStateAt('continuation', { influence: null }),
  legacyStateAt('biblical', { reflection: 'same' }),
  legacyStateAt('teaching', { reflection: 'same' }),
  legacyStateAt('teaching', { takeaway: 'A régi tanításnál túl korai.' }),
  legacyStateAt('reflection', { reflection: 'wrong' }),
  legacyStateAt('reflection', { voiceIndex: 0 }),
  { ...legacySummary, version: '1' },
  { ...legacySummary, version: 999 }
];
for (const legacy of invalidLegacy) {
  const storage = memoryStorage(JSON.stringify({ ...legacy, completed: true }));
  const loaded = State.load(storage, content);
  assert.equal(loaded.recovered, true, JSON.stringify(legacy));
  assert.deepEqual(loaded.state, State.createState());
  assert.deepEqual(JSON.parse(storage.getItem(State.STORAGE_KEY)), State.createState());
}
console.log('✓ Minden érvényes v1-szakasz és hang megőrzött döntésekkel migrálódik; sérült régi állapot nem zárható le.');

const absent = State.load(null, content);
assert.equal(absent.storageAvailable, false);
assert.equal(absent.recovered, false);
const forbidden = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
assert.equal(State.load(forbidden, content).storageAvailable, false);
const full = { getItem: () => JSON.stringify(validCompleted), setItem() { throw new Error('QuotaExceeded'); } };
const readable = State.load(full, content);
assert.equal(readable.storageAvailable, false);
assert.deepEqual(readable.state, validCompleted);
assert.equal(State.save(full, validCompleted), false);
assert.equal(State.save(null, validCompleted), false);
console.log('✓ Tiltott és betelt helyi tároló mellett is használható, memóriában folytatható állapot.');

for (const command of [
  { type: 'START' }, { type: 'NEXT' }, { type: 'FINISH' },
  { type: 'SELECT_INITIAL', value: 'D' }, { type: 'SELECT_FINAL', value: 'D' },
  { type: 'SELECT_INFLUENCE', value: 'mixed' }, { type: 'SELECT_REFLECTION', value: 'same' },
  { type: 'SET_TAKEAWAY', value: 'Lezárás után nem írható át.' }
]) {
  assert.deepEqual(State.transition(validCompleted, command, content), validCompleted);
}
const storage = memoryStorage(JSON.stringify(validCompleted));
storage.setItem('other-app-session', 'változatlan');
const reset = State.reset(storage);
assert.deepEqual(reset, State.createState());
assert.deepEqual(State.load(storage, content).state, State.createState());
assert.equal(storage.getItem('other-app-session'), 'változatlan');
assert.deepEqual(action(validCompleted, 'RESTART'), State.createState());
assert.deepEqual(action(validCompleted, 'UNKNOWN'), validCompleted);
assert.deepEqual(State.transition(validCompleted, null, content), validCompleted);
console.log('✓ Teljes újrakezdés a döntések visszamenőleges átírása nélkül.');

const expanded = { ...content, stories: [...content.stories, { ...content.stories[0], id: 'future-story' }] };
const future = State.createState('future-story');
assert.ok(State.validate(future, expanded));
assert.equal(State.transition(future, { type: 'START' }, expanded).storyId, 'future-story');
assert.equal(State.load(memoryStorage(JSON.stringify(future)), expanded).state.storyId, 'future-story');
console.log('✓ A történetazonosító adatalapú: később hozzáadható történet az állapotgép átírása nélkül.');
console.log('ALL STATE TESTS PASSED.');
