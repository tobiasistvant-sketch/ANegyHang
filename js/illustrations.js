/* Local scene metadata; story text and decision state live in their own files. */
(function (root, factory) {
  'use strict';
  const scenes = factory();
  if (typeof module === 'object' && module.exports) module.exports = scenes;
  else root.NegyHangIllustrations = scenes;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const descriptions = {
    'hero-four-paths': 'Egy parkosított városi út négy, különböző irányba vezető gyalogos ösvényre ágazik.',
    'wallet-scene-opening': 'Barna bőrpénztárca hever a buszmegálló padja mellett, miközben egy busz közeledik az úton.',
    'wallet-scene-voices': 'Ugyanaz a buszmegálló, barna pénztárca és közeledő busz, visszafogottabb, nyugodt kompozícióban.',
    'wallet-ending-return-full': 'Fiatal diák keze a barna pénztárcát nyújtja át egy rendőrnek a rendőrségi recepción.',
    'wallet-ending-keep-money': 'A buszmegállóban egy pénztárcát ábrázoló hirdetést nézel; az előtérben az új fejhallgató látszik.',
    'wallet-ending-return-documents': 'A kissé nyitott barna pénztárcát adod át a rendőrnek, benne az igazolvánnyal és két bankkártyával.',
    'wallet-ending-walk-away': 'Néhány lépésről visszanézve egy járókelőt látsz lehajolni a pad mellett heverő pénztárcához.'
  };
  return Object.freeze(Object.fromEntries(Object.entries(descriptions).map(([id, alt]) => [id, Object.freeze({
    png: `assets/illustrations/${id}.png`,
    webp: `assets/illustrations/${id}.webp`,
    width: 1280,
    height: 720,
    alt
  })])));
});
