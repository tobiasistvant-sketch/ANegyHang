'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const content = require('../js/content.js');

test('Egyetlen teljes történet, négy közös döntési lehetőség és négy önálló befejezés', () => {
  assert.equal(content.stories.length, 1);
  const story = content.stories[0];
  assert.equal(story.id, 'wallet');
  assert.equal(story.title, 'A megtalált pénztárca');
  assert.deepEqual(story.choices.map(choice => choice.id), ['A', 'B', 'C', 'D']);
  assert.deepEqual(Object.keys(story.endings), ['A', 'B', 'C', 'D']);
  assert.match(story.intro.join(' '), /500 lejt, egy személyi igazolványt és két bankkártyát/);
  assert.equal(story.choices.find(choice => choice.id === 'D').text, 'Visszateszem oda, ahol találtam, és továbbmegyek.');
  for (const ending of Object.values(story.endings)) {
    assert.ok(ending.paragraphs.length >= 2);
    assert.ok(ending.teaching.length > 20);
    assert.ok(ending.question.length > 20);
    assert.ok(ending.scripture.reference);
    assert.ok(ending.scripture.quote);
    assert.ok(ending.scripture.short.length > 0);
    assert.ok(ending.scripture.more.length > 0);
    assert.equal(ending.scripture.translation, 'RÚF 2014');
    assert.equal('explanation' in ending.scripture, false);
    assert.equal('additionalScriptures' in ending, false);
  }
  assert.equal(new Set(Object.values(story.endings).map(ending => ending.teaching)).size, 4);
  assert.equal(new Set(Object.values(story.endings).map(ending => ending.question)).size, 4);
});

test('A négy hang külön nézőpont marad, a lektorált megszólalások teljesek', () => {
  assert.deepEqual(content.voices.map(voice => voice.id), ['desire', 'others', 'fear', 'conscience']);
  for (const voice of content.voices) {
    assert.ok(voice.speech.length > 100);
    assert.ok(voice.description.length > 10);
    assert.ok(voice.color && voice.icon);
  }
  assert.match(content.voices.find(voice => voice.id === 'fear').speech, /TEDD VISSZA! Maradj ki belőle!\n\nTégy úgy, mintha nem is láttad volna!/);
  assert.equal(content.influences.length, 5);
  assert.equal(content.finalReflections.length, 3);
});

test('A bibliai értelmezések külön erkölcsi hangsúlyt és megfelelő igehelyet kapnak', () => {
  const endings = content.stories[0].endings;
  assert.equal(endings.A.scripture.reference, 'Máté 7,12');
  assert.equal(endings.B.scripture.reference, '2Mózes 20,15');
  assert.equal(endings.C.scripture.reference, '2Mózes 20,15');
  assert.equal(endings.D.scripture.reference, 'Lukács 10,31–32');
  assert.equal(endings.B.scripture.quote, 'Ne lopj!');
  assert.equal(endings.C.scripture.quote, 'Ne lopj!');
  assert.match(endings.A.paragraphs.join(' '), /jutalmat nem kapsz/);
  assert.match(endings.B.scripture.more.join(' '), /jóvátételre és a változásra/);
  assert.match(endings.C.scripture.more.join(' '), /önigazolás/);
  assert.match(endings.D.scripture.short.join(' '), /otthagyása nem azonos a lopással/);
  assert.match(endings.D.scripture.more.join(' '), /nem loptál el semmit/);
});

test('A közös tanítás rövid, látható egység és a lezárás semleges', () => {
  const teaching = content.commonTeaching;
  assert.equal(teaching.title, 'Mit tanít a lelkiismeret?');
  assert.equal(teaching.subtitle, 'A lelkiismeret mint belső iránytű');
  assert.equal(teaching.paragraphs.length, 3);
  assert.match(teaching.paragraphs.join(' '), /Róma 2,15/);
  assert.match(teaching.paragraphs.join(' '), /nem tévedhetetlen/);
  assert.match(teaching.paragraphs.join(' '), /Isten Igéje/);
  for (const phrase of ['bűnbánatra', 'megbocsátás keresésére', 'jóvátételre']) assert.ok(teaching.paragraphs.join(' ').includes(phrase));
  assert.equal(teaching.highlight, 'de mindent vizsgáljatok meg: a jót tartsátok meg');
  assert.equal(teaching.highlightReference, '1Thesszalonika 5,21 – RÚF 2014, részlet');
  assert.equal('scripture' in teaching, false);
  assert.equal('closing' in teaching, false);
  assert.equal(content.finishLabel, 'Befejeztem a történetet');
  assert.equal(content.completionMessage, 'A történet végére értél.');
  assert.equal(content.replayLabel, 'Újrajátszom a történetet');
  assert.ok(!Object.keys(content).some(key => /score|points|ranking/i.test(key)));
});
