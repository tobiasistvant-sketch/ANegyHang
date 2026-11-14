/*
 * A NÉGY HANG – a feladathoz megadott tananyag adatai.
 * Egyetlen teljes történet; további történetek később ugyanebbe a sémába illeszthetők.
 * Az igehelyekhez tartozó magyarázatok nem szó szerinti bibliai idézetek.
 */
(function (root, factory) {
  'use strict';
  const content = factory();
  if (typeof module === 'object' && module.exports) module.exports = content;
  else root.NegyHangContent = content;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  return {
    title: 'A NÉGY HANG',
    subtitle: 'Ki irányítja a döntéseidet?',
    voices: [
      {
        id: 'desire',
        name: 'VÁGY',
        label: 'Vágy',
        description: 'Lelkes, lendületes',
        color: '#975B36',
        icon: 'flame',
        speech: 'Gondolj bele! Végre megvehetnéd azt a fejhallgatót, amire olyan régóta vágysz! Mindig másoknak van szerencséjük. Most egyszer neked is összejött valami. Miért mondanál le róla?'
      },
      {
        id: 'others',
        name: 'TÖBBIEK',
        label: 'Többiek',
        description: 'Magabiztos, a közösség véleményére hivatkozik',
        color: '#795878',
        icon: 'users',
        speech: 'Ugyan már! Szerinted hányan adnák vissza ezt a pénzt? Ha elmondanád a haveroknak, biztos kinevetnének, hogy ilyen lehetőséget elszalasztottál. Ne légy már ennyire naiv!'
      },
      {
        id: 'fear',
        name: 'FÉLELEM',
        label: 'Félelem',
        description: 'Aggódó, óvatos',
        color: '#456581',
        icon: 'shield',
        speech: 'Biztos, hogy jó ötlet belekeveredni ebbe? Mi van, ha kamera figyeli a megállót? Mi van, ha valaki azt hiszi, te loptad el? Lehet, hogy akkor is bajba kerülsz, ha segíteni akarsz.'
      },
      {
        id: 'conscience',
        name: 'LELKIISMERET',
        label: 'Lelkiismeret',
        description: 'Nyugodt, elgondolkodtató',
        color: '#287D84',
        icon: 'compass',
        speech: 'Állj meg egy pillanatra! Ez a pénz valaki másé. Lehet, hogy neki ugyanannyira szüksége van rá, mint neked. Mit éreznél, ha te veszítetted volna el? És vajon attól lesz helyes egy döntés, hogy senki sem látja?'
      }
    ],
    voicesClosing: 'Négy hang. Négy különböző szempont. A döntést azonban továbbra is neked kell meghoznod.',
    influenceQuestion: 'Melyik hang befolyásolt leginkább?',
    influences: [
      { id: 'desire', text: 'Vágy' },
      { id: 'others', text: 'Többiek' },
      { id: 'fear', text: 'Félelem' },
      { id: 'conscience', text: 'Lelkiismeret' },
      { id: 'mixed', text: 'Több szempont együtt vagy saját mérlegelésem.' }
    ],
    stories: [
      {
        id: 'wallet',
        title: 'A megtalált pénztárca',
        intro: [
          'Hazafelé tartasz az iskolából. A buszmegálló padja mellett észreveszel egy barna pénztárcát.',
          'Felveszed és kinyitod. Benne 500 lej, egy személyi igazolvány és két bankkártya van.',
          'Körbenézel. Senki nincs a közelben.',
          'Eszedbe jut, hogy már hetek óta gyűjtesz egy új fejhallgatóra. Ebből a pénzből végre megvehetnéd.',
          'A buszod néhány perc múlva érkezik.'
        ],
        question: 'Mit teszel?',
        choices: [
          { id: 'A', text: 'Megpróbálom visszajuttatni a teljes pénztárcát a tulajdonosának.' },
          { id: 'B', text: 'Megtartom a pénzt.' },
          { id: 'C', text: 'A pénzt megtartom, de az iratokat és a bankkártyákat visszajuttatom.' },
          { id: 'D', text: 'Nem nyúlok hozzá többet. Otthagyom ott, ahol találtam.' }
        ],
        endings: {
          A: {
            title: 'A teljes pénztárca visszaadása',
            paragraphs: [
              'A pénztárcát az 500 lejjel, a személyi igazolvánnyal és a két bankkártyával együtt leadod a rendőrségen. Átvételi elismervényt kapsz.',
              'Jutalmat nem kapsz. A fejhallgatót most sem tudod azonnal megvenni. A döntésed értékét azonban nem az dönti el, hogy kapsz-e érte valamit.'
            ],
            teaching: 'A becsületesség nem üzlet. A helyes döntés nem feltétlenül jár jutalommal.',
            scripture: {
              reference: 'Máté 7,12',
              label: 'Az aranyszabály',
              explanation: 'Az aranyszabály arra hív, hogy a másik emberrel úgy bánj, ahogyan szeretnéd, hogy veled bánjanak. A döntésedet a pénztárca tulajdonosának helyzetéből is megvizsgálhatod.'
            },
            additionalScriptures: [],
            question: 'Miért adtad vissza a pénztárcát? A lelkiismereted vezetett, a következményektől féltél, vagy jutalmat reméltél?'
          },
          B: {
            title: 'A pénz megtartása',
            paragraphs: [
              'Kiveszed az 500 lejt, a pénztárcát eldobod, és megveszed a régóta vágyott fejhallgatót.',
              'Napokkal később hirdetést látsz egy elveszett pénztárcáról. A leírás alapján felismered, hogy azt találtad meg. A tulajdonosnak nagy szüksége lenne a pénzre.'
            ],
            teaching: 'Attól, hogy senki sem látott, a pénz még nem lett a tiéd. A lelkiismeret nem azonos a lebukástól való félelemmel.',
            scripture: {
              reference: '2Mózes 20,15',
              label: '„Ne lopj!”',
              explanation: 'A parancsolat a másik ember tulajdonának tiszteletére hív. A titokban megtartott pénz sem válik attól a tiéddé, hogy senki sem kér számon.'
            },
            additionalScriptures: [
              {
                reference: 'Lukács 19,1–10',
                label: 'Zákeus és a jóvátétel',
                explanation: 'Zákeus történetében a változás a jóvátétel szándékában is megmutatkozik. A felismert hiba után is felteheted a kérdést: mit tudnál helyrehozni?'
              }
            ],
            question: 'Ha senki sem von felelősségre, akkor is helytelen marad, amit tettél? Mit tehetnél a jóvátétel érdekében?'
          },
          C: {
            title: 'Csak az iratok visszaadása',
            paragraphs: [
              'Az 500 lejt megtartod, de a személyi igazolványt és a bankkártyákat leadod, hogy visszakerülhessenek a tulajdonosukhoz.',
              'Azzal próbálod megnyugtatni magad, hogy legalább valami jót is tettél. Az iratok visszaadása mellett azonban ott marad a kérdés: mi történt a másik ember pénzével?'
            ],
            teaching: 'Egy helyes cselekedet nem teszi automatikusan helyessé a másikat. A lelkiismeretet önigazolással is elhallgattathatjuk.',
            scripture: {
              reference: '2Mózes 20,15',
              label: 'A másik ember tulajdonának tisztelete',
              explanation: 'Az iratok visszaadása segítség lehet, de ettől a megtartott pénz még nem válik a tiéddé. A két cselekedetet külön is meg kell vizsgálnod.'
            },
            additionalScriptures: [],
            question: 'Az iratok visszaadása valódi segítség volt, vagy arra is szolgált, hogy megnyugtasd a lelkiismeretedet?'
          },
          D: {
            title: 'A pénztárca otthagyása',
            paragraphs: [
              'Otthagyod a pénztárcát, és elindulsz. Még látod, hogy egy másik járókelő felveszi.',
              'Nem tudod, mit fog tenni: visszajuttatja-e a tulajdonosnak, vagy megtartja. A pénztárca további sorsát már nem ismered.'
            ],
            teaching: 'A felelősség néha nemcsak azt jelenti, hogy nem ártunk, hanem azt is, hogy lehetőségünk szerint segítünk.',
            scripture: {
              reference: 'Lukács 10,25–37',
              label: 'Az irgalmas samaritánus',
              explanation: 'Az irgalmas samaritánus története a segítségnyújtás lehetőségére irányítja a figyelmet. A pénztárca otthagyását itt nem azonosítjuk a pénz eltulajdonításával: azt vizsgáljuk, hogyan segíthettél volna lehetőségeid szerint.'
            },
            additionalScriptures: [],
            question: 'Van különbség aközött, hogy nem ártasz valakinek, és aközött, hogy lehetőséged szerint segítesz neki?'
          }
        }
      }
    ],
    commonTeaching: {
      title: 'Mit tanít a lelkiismeret?',
      paragraphs: [
        'A lelkiismeret belső erkölcsi jelzőrendszer, amely figyelmeztethet a jó és rossz közötti különbségre.',
        'A döntés előtt mérlegelésre késztethet, a döntés után pedig segíthet felismerni a hibákat és a jóvátétel szükségességét.',
        'A lelkiismeret azonban nem tévedhetetlen. Befolyásolhatja a neveltetés, a közösség, a félelem és az önigazolás is.',
        'A református keresztyén tanítás szerint döntéseinket a Szentírás fényében kell megvizsgálnunk.'
      ],
      scripture: {
        reference: 'Róma 2,15',
        label: 'A lelkiismeret tanúskodása',
        explanation: 'Róma 2,15 a lelkiismeret tanúskodásához kapcsolódó igehely. A lelkiismeretet nem azonosítjuk automatikusan Isten közvetlen, tévedhetetlen hangjával.'
      },
      highlight: 'Nem minden jóleső döntés helyes, és nem minden helyes döntés könnyű.',
      closing: 'A keresztyén válasz nem pusztán a bűntudat. Isten kegyelmében bízva lehetőség nyílik a változásra, a bocsánatkérésre és a jóvátételre is.'
    },
    reflectionQuestion: 'Most, hogy a következményt és a bibliai tanítást is megismerted, mit gondolsz a döntésedről?',
    finalReflections: [
      { id: 'same', text: 'Továbbra is ugyanígy döntenék.' },
      { id: 'different', text: 'Most már másként döntenék.' },
      { id: 'uncertain', text: 'Nem tudom biztosan. Elgondolkodtatott.' }
    ],
    takeawayQuestion: 'Mi az az egy gondolat, amelyet ebből a történetből magaddal viszel?'
  };
});
