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
  state = next(next(next(state)));
  assert.equal(state.step, 'reflection');
  return state;
}
function memoryStorage(initial) {
  const values = new Map(initial === undefined ? [] : [[State.STORAGE_KEY, initial]]);
  return { getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)), removeItem: key => values.delete(key) };
}

let state = State.createState();
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
console.log('✓ Kötelező választások, helyes lépéssorrend és lezárt döntések.');

let journeys = 0;
for (const first of ['A', 'B', 'C', 'D']) {
  for (const second of ['A', 'B', 'C', 'D']) {
    for (const influence of content.influences) {
      for (const reflection of content.finalReflections) {
        state = toReflection(first, second, influence.id);
        state = action(state, 'SELECT_REFLECTION', reflection.id);
        state = action(state, 'SET_TAKEAWAY', 'Árvíztűrő tükörfúrógép.');
        state = next(state);
        assert.equal(state.step, 'summary');
        assert.equal(state.initialChoice, first);
        assert.equal(state.finalChoice, second);
        assert.equal(state.influence, influence.id);
        assert.equal(state.reflection, reflection.id);
        assert.equal(State.getEnding(state, content).title, 'Befejezés ' + second);
        assert.ok(State.validate(state, content));
        assert.deepEqual(next(state), state);
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
  { type: 'NEXT' }, { type: 'NEXT' }, { type: 'NEXT' },
  { type: 'SET_TAKEAWAY', value: '<img src=x onerror=alert(1)>\nŐszinte gondolat.' },
  { type: 'SELECT_REFLECTION', value: 'uncertain' }, { type: 'NEXT' }
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
}
assert.ok(state.takeaway.includes('<img'));
assert.deepEqual([...new Set(checkpoints.map(checkpoint => checkpoint.step))], State.STEPS);
console.log('✓ Minden képernyő és minden hang újratöltés után folytatható; ékezetes és HTML-szerű szöveg adatként marad meg.');

const validSummary = { ...state };
const corrupt = [
  '', '{', 'null', 'true', '[]', '"szöveg"',
  JSON.stringify({ version: State.VERSION, step: 'summary' }),
  ...[
    { version: 999 }, { storyId: 'missing' }, { step: 'missing' }, { voiceIndex: 4 },
    { voiceIndex: -1 }, { voiceIndex: 1.5 }, { initialChoice: null }, { initialChoice: 'X' },
    { finalChoice: null }, { finalChoice: 'toString' }, { influence: null }, { influence: 'unknown' },
    { reflection: null }, { reflection: 'unknown' }, { takeaway: {} }
  ].map(change => JSON.stringify({ ...validSummary, ...change })),
  JSON.stringify({ ...State.createState(), initialChoice: 'A' }),
  JSON.stringify({ ...State.createState(), finalChoice: 'B' }),
  JSON.stringify({ ...State.createState(), voiceIndex: 1 }),
  JSON.stringify({ ...State.createState(), takeaway: 'Túl korai állapot' })
];
for (const raw of corrupt) {
  const storage = memoryStorage(raw);
  const result = State.load(storage, content);
  assert.equal(result.recovered, true, raw);
  assert.equal(result.storageAvailable, true);
  assert.deepEqual(result.state, State.createState());
  assert.deepEqual(JSON.parse(storage.getItem(State.STORAGE_KEY)), State.createState());
}
const extra = State.load(memoryStorage(JSON.stringify({ ...validSummary, ignoredField: 'nem kerül mentésre' })), content);
assert.equal('ignoredField' in extra.state, false);
console.log('✓ Sérült/verzióhibás/invariánsokat sértő mentések biztonságos helyreállítása; ismeretlen mezők kiszűrése.');

const absent = State.load(null, content);
assert.equal(absent.storageAvailable, false);
assert.equal(absent.recovered, false);
const forbidden = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
assert.equal(State.load(forbidden, content).storageAvailable, false);
const full = { getItem: () => JSON.stringify(validSummary), setItem() { throw new Error('QuotaExceeded'); } };
const readable = State.load(full, content);
assert.equal(readable.storageAvailable, false);
assert.deepEqual(readable.state, validSummary);
assert.equal(State.save(full, validSummary), false);
assert.equal(State.save(null, validSummary), false);
console.log('✓ Tiltott és betelt helyi tároló mellett is használható, memóriában folytatható állapot.');

const storage = memoryStorage(JSON.stringify(validSummary));
const edited = action(validSummary, 'EDIT_REFLECTION');
assert.equal(edited.step, 'reflection');
assert.equal(edited.takeaway, validSummary.takeaway);
const revised = next(action(action(edited, 'SELECT_REFLECTION', 'different'), 'SET_TAKEAWAY', 'Másik gondolat.'));
assert.equal(revised.step, 'summary');
assert.equal(revised.initialChoice, validSummary.initialChoice);
assert.equal(revised.finalChoice, validSummary.finalChoice);
const reset = State.reset(storage);
assert.deepEqual(reset, State.createState());
assert.deepEqual(State.load(storage, content).state, State.createState());
assert.deepEqual(action(validSummary, 'RESTART'), State.createState());
assert.deepEqual(action(validSummary, 'UNKNOWN'), validSummary);
assert.deepEqual(State.transition(validSummary, null, content), validSummary);
console.log('✓ Reflexió javítása és teljes újrakezdés a döntések visszamenőleges átírása nélkül.');

const expanded = { ...content, stories: [...content.stories, { ...content.stories[0], id: 'future-story' }] };
const future = State.createState('future-story');
assert.ok(State.validate(future, expanded));
assert.equal(State.transition(future, { type: 'START' }, expanded).storyId, 'future-story');
assert.equal(State.load(memoryStorage(JSON.stringify(future)), expanded).state.storyId, 'future-story');
console.log('✓ A történetazonosító adatalapú: később hozzáadható történet az állapotgép átírása nélkül.');
console.log('ALL STATE TESTS PASSED.');
