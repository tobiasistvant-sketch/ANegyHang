'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const content = require('../js/content.js');
const wallet = content.stories.find(story => story.id === 'wallet');
const teacher = content.stories.find(story => story.id === 'teacher');

test('Két teljes történet, történetenként négy közös döntési lehetőség és négy önálló befejezés', () => {
  assert.deepEqual(content.stories.map(story => story.id), ['wallet', 'teacher']);
  assert.equal(wallet.title, 'A megtalált pénztárca');
  assert.equal(teacher.title, 'Az igazságtalan tanár');
  for (const story of content.stories) {
    assert.deepEqual(story.choices.map(choice => choice.id), ['A', 'B', 'C', 'D']);
    assert.deepEqual(Object.keys(story.endings), ['A', 'B', 'C', 'D']);
    assert.ok(story.start.intro.length);
    assert.ok(story.start.button);
    assert.ok(story.images.hero && story.images.opening && story.images.voices);
    for (const [letter, ending] of Object.entries(story.endings)) {
      assert.ok(ending.paragraphs.length >= 2);
      assert.ok(ending.question.length > 20);
      assert.ok(ending.scripture.reference);
      assert.ok(ending.scripture.quote);
      assert.ok(ending.scripture.short.length > 0);
      assert.ok(ending.scripture.more.length > 0);
      assert.equal(ending.scripture.translation, 'RÚF 2014');
      assert.equal('explanation' in ending.scripture, false);
      assert.equal('additionalScriptures' in ending, false);
      assert.ok(story.images.endings[letter]);
    }
    assert.equal(new Set(Object.values(story.endings).map(ending => ending.question)).size, 4);
  }
  assert.match(wallet.intro.join(' '), /500 lejt, egy személyi igazolványt és két bankkártyát/);
  assert.equal(wallet.choices.find(choice => choice.id === 'D').text, 'Visszateszem oda, ahol találtam, és továbbmegyek.');
  assert.equal(new Set(Object.values(wallet.endings).map(ending => ending.teaching)).size, 4);
  assert.deepEqual(wallet.endings.B.noticeRange, [2, 4]);
});

test('Egységes négy hang külön történethez tartozó teljes megszólalásokkal', () => {
  const ids = ['desire', 'others', 'fear', 'conscience'];
  assert.deepEqual(content.voices.map(voice => voice.id), ids);
  for (const voice of content.voices) {
    assert.ok(voice.color && voice.icon && voice.name && voice.label);
    assert.equal('speech' in voice, false);
    assert.equal('description' in voice, false);
  }
  for (const story of content.stories) {
    assert.deepEqual(story.voices.map(voice => voice.id), ids);
    for (const voice of story.voices) {
      assert.ok(voice.speech.length > 100);
      assert.ok(voice.description.length > 10);
    }
    assert.ok(story.voicesClosing);
  }
  assert.match(wallet.voices.find(voice => voice.id === 'fear').speech, /TEDD VISSZA! Maradj ki belőle!\n\nTégy úgy, mintha nem is láttad volna!/);
  for (let i = 0; i < 4; i++) assert.notEqual(wallet.voices[i].speech, teacher.voices[i].speech);
  assert.equal('voicesClosing' in content, false);
  assert.equal(content.influences.length, 5); // Only for validating legacy saves.
  assert.equal(content.finalReflections.length, 3);
});

test('A pénztárcás történet bibliai és erkölcsi hangsúlyai változatlanok', () => {
  const endings = wallet.endings;
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

test('A tanáros történet négy önálló következménye és igehelye nem keveredik', () => {
  const endings = teacher.endings;
  assert.deepEqual(Object.values(endings).map(ending => ending.scripture.reference), ['Példabeszédek 15,1', 'Jakab 1,19–20', '2Timóteus 1,7', 'Máté 5,9']);
  assert.match(endings.A.paragraphs.join(' '), /elegendő a 6-oshoz/);
  assert.match(endings.D.paragraphs.join(' '), /A jegyedet 6-osra javítja/);
  assert.match(endings.B.paragraphs.join(' '), /az ügy még nincs rendezve/);
  assert.match(endings.C.paragraphs.join(' '), /A jegyed viszont 5-ös marad/);
  assert.match(teacher.choices[0].text, /nézze át újra a dolgozatomat/);
  assert.ok(!endings.B.scripture.more[1].includes('tanítás, a másik ember'));
  for (const ending of Object.values(endings)) {
    assert.ok(ending.lastThought.endsWith('?'));
    assert.equal('teaching' in ending, false, 'No unapproved summary sentence is invented.');
    assert.ok(!ending.paragraphs.some(paragraph => paragraph.startsWith('UTOLSÓ GONDOLAT')));
  }
});

test('A közös tanítás és a semleges lezárás is történetenként különbözik', () => {
  const teaching = wallet.commonTeaching;
  assert.equal(teaching.title, 'Mit tanít a lelkiismeret?');
  assert.equal(teaching.subtitle, 'A lelkiismeret mint belső iránytű');
  assert.equal(teaching.paragraphs.length, 3);
  assert.match(teaching.paragraphs.join(' '), /Róma 2,15/);
  assert.match(teaching.paragraphs.join(' '), /nem tévedhetetlen/);
  assert.match(teaching.paragraphs.join(' '), /Isten Igéje/);
  for (const phrase of ['bűnbánatra', 'megbocsátás keresésére', 'jóvátételre']) assert.ok(teaching.paragraphs.join(' ').includes(phrase));
  assert.equal(teaching.highlight, 'de mindent vizsgáljatok meg: a jót tartsátok meg');
  assert.equal(teaching.highlightReference, '1Thesszalonika 5,21 – RÚF 2014, részlet');
  assert.equal(teacher.commonTeaching.title, 'Az igazság és a szeretet együtt');
  assert.equal(teacher.commonTeaching.paragraphs.length, 4);
  assert.equal(teacher.commonTeaching.highlightReference, 'Efézus 4,15 – RÚF 2014, részlet');
  assert.equal(content.finishLabel, 'Befejeztem a történetet');
  assert.equal(wallet.completionMessage, 'Az első történet végére értél.');
  assert.equal(teacher.completionMessage, 'A második történet végére értél.');
  assert.equal(content.replayLabel, 'Újrajátszom a történetet');
  assert.equal('commonTeaching' in content, false);
  assert.equal('completionMessage' in content, false);
  assert.ok(!Object.keys(content).some(key => /score|points|ranking/i.test(key)));
});
