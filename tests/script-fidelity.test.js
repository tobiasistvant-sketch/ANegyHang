'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const content = require('../js/content.js');

// Read the approved DOCX itself, not a second copy of the manuscript. These
// one-based OOXML paragraph positions also identify each editorial source block.
const root = path.resolve(__dirname, '..');
const source = JSON.parse(execFileSync('python3', [
  path.join(root, 'scripts/read-approved-script.py'),
  path.join(root, 'docs/ANegyHang_9_kepernyos_lektoralt_szovegkonyv.docx')
], { encoding: 'utf8' }));
const paragraph = number => {
  assert.equal(typeof source.paragraphs[number], 'string', `DOCX paragraph ${number}`);
  return source.paragraphs[number];
};
const paragraphs = numbers => numbers.map(paragraph);
const unquote = text => text.startsWith('„') && text.endsWith('”') ? text.slice(1, -1) : text;
const verse = number => {
  const text = paragraph(number);
  const split = text.lastIndexOf(' – ');
  assert.ok(split > 0, `DOCX scripture ${number}`);
  return { quote: unquote(text.slice(0, split)), reference: text.slice(split + 3) };
};
const story = content.stories.find(item => item.id === 'wallet');

test('A bevezetés, döntések és teljes hangszövegek a jóváhagyott Wordet követik', () => {
  assert.equal(content.title, paragraph(9));
  assert.equal(content.subtitle, paragraph(11));
  assert.equal(story.title, paragraph(32));
  assert.deepEqual(story.intro, paragraphs([34, 35, 36, 37, 38]));
  assert.equal(story.question, paragraph(40));
  const decisions = [58, 59, 60, 61].map(number => paragraph(number).replace(/^[A-D]\s+/, ''));
  const repeated = [111, 112, 113, 114].map(number => paragraph(number).replace(/^[A-D]\s+/, ''));
  assert.deepEqual(decisions, repeated, 'A két döntési képernyő forrásszövege egyezik.');
  assert.deepEqual(story.choices.map(choice => choice.text), decisions);
  const labels = paragraph(23).split(' · ');
  const descriptions = [76, 81, 86, 92];
  const speeches = [[78], [83], [88, 89], [94]];
  for (const [index, voice] of content.voices.entries()) {
    assert.equal(voice.label, labels[index]);
    assert.equal(story.voices[index].id, voice.id);
    assert.equal(story.voices[index].description, paragraph(descriptions[index]));
    assert.equal(story.voices[index].speech, unquote(paragraphs(speeches[index]).join('\n\n')));
  }
  assert.equal(story.voicesClosing, paragraph(96));
  assert.equal(content.influenceQuestion, paragraph(123));
  assert.deepEqual(content.influences.map(item => item.text), paragraphs([127, 128, 129, 130, 131]));
});

test('Mind a négy folytatás és teljes bibliai magyarázat szó szerint a Wordből származik', () => {
  const blocks = {
    A: { title: 140, prose: [142, 143], teaching: 174, verse: 176, label: 178, short: [181, 182], more: [184, 185], question: 187 },
    B: { title: 146, prose: [148, 149, 150, 151, 152, 153], teaching: 190, verse: 192, label: 194, short: [196], more: [198, 199, 200], question: 202 },
    C: { title: 156, prose: [158, 159], teaching: 205, verse: 207, label: 209, short: [211, 212], more: [214, 215, 216, 217], question: 219 },
    D: { title: 162, prose: [164, 165], teaching: 222, verse: 224, label: 226, short: [228], more: [230, 231, 232, 233, 234, 235], question: 237 }
  };
  for (const [letter, block] of Object.entries(blocks)) {
    const ending = story.endings[letter];
    assert.equal(ending.title, paragraph(block.title).replace(/^7\/[A-D]\. Lehetséges folytatás – /, ''));
    assert.deepEqual(ending.paragraphs, paragraphs(block.prose), letter + ' continuation');
    assert.equal(ending.teaching, paragraph(block.teaching), letter + ' ethical teaching');
    assert.equal(ending.scripture.quote, verse(block.verse).quote, letter + ' quote');
    assert.equal(ending.scripture.reference, verse(block.verse).reference, letter + ' scripture');
    assert.equal(ending.scripture.label, paragraph(block.label), letter + ' label');
    assert.deepEqual(ending.scripture.short, paragraphs(block.short), letter + ' always-visible explanation');
    assert.deepEqual(ending.scripture.more, paragraphs(block.more), letter + ' full expanded explanation');
    assert.equal(ending.question, paragraph(block.question), letter + ' personal question');
  }
});

test('A közös 8/K tanítás és a későbbre félretett reflexiós forrásszöveg változatlan', () => {
  const common = story.commonTeaching;
  assert.equal(common.title, paragraph(241));
  assert.equal(common.subtitle, paragraph(243));
  assert.deepEqual(common.paragraphs, paragraphs([244, 245, 246]));
  assert.equal(common.highlight, verse(248).quote);
  assert.equal(common.highlightReference, verse(248).reference + ' – RÚF 2014, részlet');
  assert.equal(content.reflectionQuestion, paragraph(262));
  assert.deepEqual(content.finalReflections.map(item => item.text), [264, 265, 266].map(number => paragraph(number).replace(/^\d+\.\s*/, '')));
  assert.equal(content.takeawayQuestion, paragraph(268));
  assert.equal(content.finishLabel, paragraph(272));
  // The v0.3.1 structural instruction overrides the old manuscript's ending.
  assert.equal(story.completionMessage, 'Az első történet végére értél.');
  assert.ok(paragraph(273).includes('„' + content.replayLabel + '”'));
});

test('A dokumentum szerkesztői megjegyzései nem tanulói tartalmak', () => {
  const renderedData = JSON.stringify(content);
  for (const label of ['SZERKESZTŐI MEGJEGYZÉS', 'FEJLESZTÉSI MEGJEGYZÉS', 'MEGVALÓSÍTÁSI MEGJEGYZÉS', 'Szerkesztett munkaváltozat', 'GITHUB']) {
    assert.ok(!renderedData.includes(label), label);
  }
});
