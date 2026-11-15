'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const content = require('../js/content.js');
const root = path.resolve(__dirname, '..');
const source = JSON.parse(execFileSync('python3', [
  path.join(root, 'scripts/read-approved-script.py'),
  path.join(root, 'docs/ANegyHang_2_tortenet_jovahagyott_forgatokonyv.docx')
], { encoding: 'utf8' }));
const paragraph = number => {
  assert.equal(typeof source.paragraphs[number], 'string', `Teacher DOCX paragraph ${number}`);
  return source.paragraphs[number];
};
const paragraphs = numbers => numbers.map(paragraph);
const range = (first, last) => Array.from({ length: last - first + 1 }, (_, i) => first + i);
const unquote = text => {
  assert.ok(text.startsWith('„') && text.endsWith('”'), text);
  return text.slice(1, -1);
};
const verse = number => {
  const text = paragraph(number).replace(/^Igei tanítás: /, '');
  const split = text.lastIndexOf(' - ');
  assert.ok(split > 0, `Teacher DOCX scripture ${number}`);
  return { quote: unquote(text.slice(0, split)), reference: text.slice(split + 3) };
};
const story = content.stories.find(item => item.id === 'teacher');

test('A tanáros történet kezdete és mindkét döntése pontosan a jóváhagyott Wordből származik', () => {
  assert.equal(story.title.toLocaleUpperCase('hu'), paragraph(7));
  assert.deepEqual(story.start.intro, paragraphs([8, 9]));
  assert.equal(story.start.button, paragraph(10).replace(/^Gomb: /, ''));
  assert.deepEqual(story.intro, paragraphs(range(12, 15)));
  assert.equal(story.question, paragraph(16));
  const choices = paragraphs(range(18, 21)).map(text => text.replace(/^[A-D]\. /, ''));
  const repeated = paragraphs(range(49, 52)).map(text => text.replace(/^[A-D]\. /, ''));
  // This is the first of the user's two expressly authorized copy corrections.
  repeated[0] = repeated[0].replace('nézzük át újra a dolgozatomat', 'nézze át újra a dolgozatomat');
  assert.deepEqual(choices, repeated);
  assert.deepEqual(story.choices.map(choice => choice.text), choices);
  assert.equal(story.initialButton, paragraph(22).replace(/^Gomb: /, ''));
  assert.deepEqual(story.finalIntro, paragraphs([45, 46]));
  assert.equal(story.finalQuestion, paragraph(47));
  assert.equal(story.finalButton, paragraph(53).replace(/^Gomb: /, ''));
});

test('A második történet mind a négy hangja teljes, saját szöveget mond', () => {
  const names = [25, 29, 34, 39];
  const descriptions = [26, 30, 35, 40];
  const speeches = [[27, 28], [31, 32, 33], [36, 37, 38], [41, 42]];
  for (let i = 0; i < content.voices.length; i++) {
    assert.equal(content.voices[i].name, paragraph(names[i]).replace(/^\d+\. /, ''));
    assert.equal(story.voices[i].id, content.voices[i].id);
    assert.equal(story.voices[i].description, paragraph(descriptions[i]));
    assert.equal(story.voices[i].speech, unquote(paragraphs(speeches[i]).join('\n\n')));
  }
  assert.equal(story.voicesClosing, paragraph(43).replace(/^Zárómondat: /, ''));
});

test('A négy részletes befejezés és az Utolsó gondolat rövidítés nélkül szerepel', () => {
  const blocks = {
    A: { title: 56, first: 57, last: 73, thought: 74 },
    B: { title: 75, first: 76, last: 88, thought: 89 },
    C: { title: 90, first: 91, last: 98, thought: 99 },
    D: { title: 100, first: 101, last: 114, thought: 115 }
  };
  for (const [letter, block] of Object.entries(blocks)) {
    const ending = story.endings[letter];
    assert.equal(ending.title, paragraph(block.title).replace(/^[A-D] VÁLASZTÁS – /, ''));
    assert.deepEqual(ending.paragraphs, paragraphs(range(block.first, block.last)), letter + ' complete prose');
    assert.equal(ending.lastThought, paragraph(block.thought).replace(/^UTOLSÓ GONDOLAT\s+/, ''), letter + ' final thought');
  }
});

test('A tanáros történet valamennyi bibliai magyarázata és a 7/K tanítás forráshű', () => {
  const blocks = {
    A: { verse: 119, label: 120, short: [122, 123], more: [125, 126, 127, 128], question: 130 },
    B: { verse: 132, label: 133, short: [136, 137], more: [139, 140, 141, 142], question: 144 },
    C: { verse: 146, label: 147, short: [149, 150], more: [152, 153, 154, 155], question: 157 },
    D: { verse: 159, label: 160, short: [162, 163], more: [165, 166, 167, 168], question: 170 }
  };
  for (const [letter, block] of Object.entries(blocks)) {
    const ending = story.endings[letter];
    assert.equal(ending.scripture.quote, verse(block.verse).quote, letter + ' scripture quote');
    assert.equal(ending.scripture.reference, verse(block.verse).reference, letter + ' scripture reference');
    assert.equal(ending.scripture.label, paragraph(block.label).replace(/^Megnevezés: /, ''), letter + ' title');
    assert.deepEqual(ending.scripture.short, paragraphs(block.short), letter + ' visible explanation');
    const more = paragraphs(block.more);
    // The second authorized correction removes only the redundant comma.
    if (letter === 'B') more[1] = more[1].replace('A kilencedik parancsolatról szóló tanítás, a másik ember', 'A kilencedik parancsolatról szóló tanítás a másik ember');
    assert.deepEqual(ending.scripture.more, more, letter + ' complete expanded explanation');
    assert.equal(ending.question, paragraph(block.question), letter + ' personal question');
  }
  const common = story.commonTeaching;
  assert.equal(common.title, paragraph(172));
  assert.deepEqual(common.paragraphs, paragraphs(range(174, 177)));
  assert.equal(common.highlight, verse(173).quote);
  assert.equal(common.highlightReference, verse(173).reference + ' – RÚF 2014, részlet');
  assert.equal(content.finishLabel, paragraph(178).replace(/^Gomb: /, ''));
  assert.equal(story.completionMessage, paragraph(179).replace(/^Visszajelzés: /, ''));
  assert.equal(content.replayLabel, paragraph(180).replace(/^Újrajátszás: /, ''));
  const all = JSON.stringify(story);
  for (const marker of ['Szerkesztői megjegyzés', 'TARTALMILAG KIDOLGOZOTT SZERKESZTŐI VÁLTOZAT', 'RÖVID MAGYARÁZAT –', 'BŐVEBBEN – LENYITHATÓ', 'A négy lehetőség pontosan ugyanaz']) {
    assert.ok(!all.includes(marker), marker);
  }
});
