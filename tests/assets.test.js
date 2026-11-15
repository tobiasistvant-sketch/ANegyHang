'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const illustrations = require('../js/illustrations.js');

function pngSize(bytes) {
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(bytes.toString('ascii', 12, 16), 'IHDR');
  return [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];
}

function webpSize(bytes) {
  assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
  assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
  assert.equal(bytes.readUInt32LE(4) + 8, bytes.length);
  for (let offset = 12; offset + 8 <= bytes.length;) {
    const kind = bytes.toString('ascii', offset, offset + 4);
    const length = bytes.readUInt32LE(offset + 4);
    const data = offset + 8;
    assert.ok(data + length <= bytes.length, 'A WebP-adatblokk teljes.');
    if (kind === 'VP8 ') {
      assert.equal(bytes.subarray(data + 3, data + 6).toString('hex'), '9d012a');
      return [bytes.readUInt16LE(data + 6) & 0x3fff, bytes.readUInt16LE(data + 8) & 0x3fff];
    }
    if (kind === 'VP8L') {
      assert.equal(bytes[data], 0x2f);
      const packed = bytes.readUInt32LE(data + 1);
      return [(packed & 0x3fff) + 1, ((packed >>> 14) & 0x3fff) + 1];
    }
    if (kind === 'VP8X') return [bytes.readUIntLE(data + 4, 3) + 1, bytes.readUIntLE(data + 7, 3) + 1];
    offset = data + length + (length % 2);
  }
  assert.fail('Hiányzik a WebP képméretét tartalmazó adatblokk.');
}

test('Mind a tizenhárom jóváhagyott jelenethez létezik megfelelő PNG és WebP', () => {
  assert.equal(Object.keys(illustrations).length, 13);
  for (const [id, image] of Object.entries(illustrations)) {
    assert.equal(image.png, `assets/illustrations/${id}.png`);
    assert.equal(image.webp, `assets/illustrations/${id}.webp`);
    assert.equal(image.width, 1280);
    assert.equal(image.height, 720);
    assert.ok(image.alt.length > 30, id + ' magyar alternatív szöveg');
    for (const [format, readSize] of [['png', pngSize], ['webp', webpSize]]) {
      const bytes = fs.readFileSync(path.resolve(__dirname, '..', image[format]));
      assert.deepEqual(readSize(bytes), [1280, 720], `${id}.${format}`);
    }
  }
});
