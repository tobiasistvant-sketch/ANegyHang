'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { version } = require('../package.json');
const lock = require('../package-lock.json');

test('A statikus böngészős verzió és az npm-metaadat a központi verziót követi', () => {
  assert.match(version, /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/);
  const metadata = require('../js/version.js');
  assert.equal(metadata.version, version);
  assert.ok(Object.isFrozen(metadata));
  assert.equal(lock.version, version);
  assert.equal(lock.packages[''].version, version);
  const browser = {};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../js/version.js'), 'utf8'), browser);
  assert.equal(browser.NegyHangVersion.version, version);
  assert.deepEqual(Object.keys(browser.NegyHangVersion), ['version']);
});
