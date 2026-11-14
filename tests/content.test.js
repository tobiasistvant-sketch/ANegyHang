'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const content = require('../js/content.js');

test('Egyetlen teljes történet, négy eredeti lehetőség és négy befejezés', () => {
  assert.equal(content.stories.length, 1);
  const story = content.stories[0];
  assert.equal(story.id, 'wallet');
  assert.equal(story.title, 'A megtalált pénztárca');
  assert.deepEqual(story.choices.map(choice => choice.id), ['A', 'B', 'C', 'D']);
  assert.deepEqual(Object.keys(story.endings), ['A', 'B', 'C', 'D']);
  assert.ok(story.intro.join(' ').includes('500 lej, egy személyi igazolvány és két bankkártya'));
  assert.ok(story.choices.every(choice => typeof choice.text === 'string' && choice.text.length > 5));
  for (const ending of Object.values(story.endings)) {
    assert.ok(ending.paragraphs.length >= 2);
    for (const field of ['teaching', 'question']) assert.ok(ending[field].length > 20);
    assert.ok(ending.scripture.reference);
  }
});

test('Az előírt hangok sorrendje és a teljes megszólalások megmaradnak', () => {
  assert.deepEqual(content.voices.map(voice => voice.id), ['desire', 'others', 'fear', 'conscience']);
  const speeches = [
    'Gondolj bele! Végre megvehetnéd azt a fejhallgatót, amire olyan régóta vágysz! Mindig másoknak van szerencséjük. Most egyszer neked is összejött valami. Miért mondanál le róla?',
    'Ugyan már! Szerinted hányan adnák vissza ezt a pénzt? Ha elmondanád a haveroknak, biztos kinevetnének, hogy ilyen lehetőséget elszalasztottál. Ne légy már ennyire naiv!',
    'Biztos, hogy jó ötlet belekeveredni ebbe? Mi van, ha kamera figyeli a megállót? Mi van, ha valaki azt hiszi, te loptad el? Lehet, hogy akkor is bajba kerülsz, ha segíteni akarsz.',
    'Állj meg egy pillanatra! Ez a pénz valaki másé. Lehet, hogy neki ugyanannyira szüksége van rá, mint neked. Mit éreznél, ha te veszítetted volna el? És vajon attól lesz helyes egy döntés, hogy senki sem látja?'
  ];
  assert.deepEqual(content.voices.map(voice => voice.speech), speeches);
  assert.equal(content.influences.length, 5);
  assert.equal(content.finalReflections.length, 3);
});

test('Pontos igehelyek, jóvátétel, és az otthagyás különbsége az eltulajdonítástól', () => {
  const endings = content.stories[0].endings;
  assert.equal(endings.A.scripture.reference, 'Máté 7,12');
  assert.equal(endings.B.scripture.reference, '2Mózes 20,15');
  assert.equal(endings.C.scripture.reference, '2Mózes 20,15');
  assert.equal(endings.D.scripture.reference, 'Lukács 10,25–37');
  assert.equal(endings.B.additionalScriptures[0].reference, 'Lukács 19,1–10');
  assert.match(endings.B.additionalScriptures[0].label, /Zákeus/);
  assert.match(endings.D.scripture.explanation, /nem azonosítjuk a pénz eltulajdonításával/);
  assert.match(endings.A.paragraphs.join(' '), /Jutalmat nem kapsz/);
});

test('A közös tanítás a tévedhetőséget, a Szentírást és a változás lehetőségét hangsúlyozza', () => {
  const teaching = content.commonTeaching;
  assert.match(teaching.paragraphs.join(' '), /nem tévedhetetlen/);
  assert.match(teaching.paragraphs.join(' '), /Szentírás fényében/);
  assert.equal(teaching.scripture.reference, 'Róma 2,15');
  assert.match(teaching.scripture.explanation, /nem azonosítjuk automatikusan Isten közvetlen, tévedhetetlen hangjával/);
  for (const phrase of ['változásra', 'bocsánatkérésre', 'jóvátételre']) assert.ok(teaching.closing.includes(phrase));
  assert.equal(teaching.highlight, 'Nem minden jóleső döntés helyes, és nem minden helyes döntés könnyű.');
  assert.ok(!Object.keys(content).some(key => /score|points|ranking/i.test(key)));
});
