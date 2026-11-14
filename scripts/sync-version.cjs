'use strict';

// package.json is the only source of the application version. This file only
// writes static metadata; the published game needs no Node.js or network call.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const { version } = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version)) {
  throw new Error('A package.json version mezője MAJOR.MINOR.PATCH formátumú legyen.');
}
const target = path.join(root, 'js/version.js');
const source = `/* GENERATED from package.json by scripts/sync-version.cjs. Do not edit. */
(function (root, factory) {
  'use strict';
  const metadata = factory();
  if (typeof module === 'object' && module.exports) module.exports = metadata;
  else root.NegyHangVersion = metadata;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  return Object.freeze({ version: ${JSON.stringify(version)} });
});
`;
if (process.argv.includes('--check')) {
  if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== source) {
    console.error('A verzióadat elavult. Futtasd: npm run version:sync');
    process.exitCode = 1;
  }
} else {
  fs.writeFileSync(target, source);
  console.log(`Verzióadat frissítve: v${version}`);
}
