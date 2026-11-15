/*
 * A NÉGY HANG – a jóváhagyott, lektorált kilencképernyős szövegkönyv.
 * Forrás: docs/ANegyHang_9_kepernyos_lektoralt_szovegkonyv.docx.
 * A szerkesztői és fejlesztési megjegyzések nem tanulói szövegek.
 */
(function (root, factory) {
  'use strict';
  const content = factory();
  if (typeof module === 'object' && module.exports) module.exports = content;
  else root.NegyHangContent = content;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  return {
    "title": "A NÉGY HANG",
    "subtitle": "Ki irányítja a döntéseidet?",
    "voices": [
      {
        "id": "desire",
        "name": "VÁGY",
        "label": "Vágy",
        "description": "Lelkes, lendületes",
        "color": "#975B36",
        "icon": "flame",
        "speech": "Gondolj bele! Végre megvehetnéd azt a fejhallgatót, amire olyan régóta vágysz! Mindig másoknak van szerencséjük. Most végre neked is összejött valami. Miért mondanál le róla?"
      },
      {
        "id": "others",
        "name": "TÖBBIEK",
        "label": "Többiek",
        "description": "Magabiztos, a közösség véleményére hivatkozik",
        "color": "#795878",
        "icon": "users",
        "speech": "Ugyan már! Szerinted hányan adnák vissza ezt a pénzt? Ha elmondanád a többieknek, biztos kiröhögnének, hogy ilyen lehetőséget elszalasztottál. Ne légy már ennyire naiv!"
      },
      {
        "id": "fear",
        "name": "FÉLELEM",
        "label": "Félelem",
        "description": "Aggódó, óvatos",
        "color": "#456581",
        "icon": "shield",
        "speech": "Biztos, hogy jó ötlet belekeveredni ebbe? Mi van, ha kamera figyeli a megállót? Mi van, ha valaki azt hiszi, te loptad el? TEDD VISSZA! Maradj ki belőle!\n\nTégy úgy, mintha nem is láttad volna!"
      },
      {
        "id": "conscience",
        "name": "LELKIISMERET",
        "label": "Lelkiismeret",
        "description": "Nyugodt, elgondolkodtató",
        "color": "#287D84",
        "icon": "compass",
        "speech": "Állj meg egy pillanatra! Ez a pénz valaki másé. Lehet, hogy neked is nagy szükséged lenne rá, de a pénz akkor sem a tiéd. Mit éreznél, ha te veszítetted volna el?"
      }
    ],
    "voicesClosing": "Négy hang. Négy különböző szempont. A döntést azonban továbbra is neked kell meghoznod.",
    "influenceQuestion": "Melyik hang befolyásolt leginkább?",
    "influences": [
      {
        "id": "desire",
        "text": "Vágy"
      },
      {
        "id": "others",
        "text": "Többiek"
      },
      {
        "id": "fear",
        "text": "Félelem"
      },
      {
        "id": "conscience",
        "text": "Lelkiismeret"
      },
      {
        "id": "mixed",
        "text": "Több szempont együtt vagy saját mérlegelésem."
      }
    ],
    "stories": [
      {
        "id": "wallet",
        "title": "A megtalált pénztárca",
        "intro": [
          "Hazafelé tartasz az iskolából. A buszmegálló padja mellett észreveszel egy barna pénztárcát.",
          "Felveszed és kinyitod. Találsz benne 500 lejt, egy személyi igazolványt és két bankkártyát.",
          "Körbenézel és senkit nem látsz a közelben.",
          "Eszedbe jut, hogy már hetek óta gyűjtesz egy új fejhallgatóra. Ebből a pénzből végre megvehetnéd.",
          "Közben meglátod, hogy a busz már érkezik. Másodperceid vannak a döntésre."
        ],
        "question": "Mit teszel?",
        "choices": [
          {
            "id": "A",
            "text": "Megpróbálom visszajuttatni a teljes pénztárcát a tulajdonosának (leadom a talált pénztárcát a rendőrségen vagy egy közeli ABC-ben)."
          },
          {
            "id": "B",
            "text": "Megtartom a pénzt."
          },
          {
            "id": "C",
            "text": "A pénzt megtartom, de az iratokat és a bankkártyákat visszajuttatom (leadom a rendőrségen vagy egy közeli ABC kasszásánál hagyom)."
          },
          {
            "id": "D",
            "text": "Visszateszem oda, ahol találtam, és továbbmegyek."
          }
        ],
        "endings": {
          "A": {
            "title": "A teljes pénztárca visszaadása",
            "paragraphs": [
              "A pénztárcát az 500 lejjel, a személyi igazolvánnyal és a két bankkártyával együtt leadod a rendőrségen. Átvételi elismervényt kapsz.",
              "A rendőr megdicsér, de jutalmat nem kapsz. A fejhallgatót, amire nagyon régóta vágysz, most sem tudod megvenni."
            ],
            "teaching": "A becsületesség nem üzlet. A helyes döntés nem jár jutalommal.",
            "scripture": {
              "reference": "Máté 7,12",
              "label": "Az aranyszabály",
              "quote": "Amit csak szeretnétek, hogy az emberek tegyenek veletek, mindenben ugyanúgy tegyetek ti is velük, mert ezt tanítja a törvény és a próféták.",
              "translation": "RÚF 2014",
              "short": [
                "Jézus aranyszabálya nem csupán arra tanít, hogy ne ártsunk másoknak, hanem arra is, hogy tevékenyen tegyünk jót velük.",
                "Amikor megtalálod a pénztárcát, könnyen előtérbe kerülhetnek a saját vágyaid: mire lenne elég az 500 lej, mit vásárolhatnál belőle? Jézus tanítása azonban arra hív, hogy egy pillanatra helyezkedj a másik ember helyébe. Mit éreznél, ha te veszítenéd el a pénzedet és az irataidat? Mit remélnél attól, aki megtalálja őket?"
              ],
              "more": [
                "A pénztárca tulajdonosa akkor is a felebarátod, ha nem ismered őt. A vele szembeni felelősséged nem attól függ, hogy kapsz-e jutalmat, megdicsérnek-e, vagy bárki látja-e a cselekedetedet.",
                "A lelkiismereted segíthet felismerni, mi a helyes, de fontos, hogy az indítékaidat is megvizsgáld a Szentírás fényében. A pénztárca visszaadása így nem pusztán egy szabály betartása, hanem a másik ember iránti tisztelet és felelősségvállalás kifejezése."
              ]
            },
            "question": "Miért adtad vissza a pénztárcát? A lelkiismereted vezetett, a következményektől féltél, vagy jutalmat reméltél?"
          },
          "B": {
            "title": "A pénz megtartása",
            "paragraphs": [
              "Kiveszed az 500 lejt, a pénztárcát eldobod, és megveszed a régóta vágyott fejhallgatót.",
              "Néhány nappal később egy hirdetésre leszel figyelmes a buszmegállóban.",
              "ELVESZETT PÉNZTÁRCA",
              "»Egy barna pénztárcát keresek, benne az irataimmal és 500 lejjel. A pénzt édesanyám gyógyszereire tettem félre. A héten kellene kiváltanom őket. Kérem, aki megtalálta, jelentkezzen!«",
              "A hirdetés alján ugyanaz a név szerepel, amelyet a személyi igazolványon láttál.",
              "A hirdetés olvasása közben akaratlanul is megszorítod a frissen vett fejhallgatódat. A pénzt már elköltötted."
            ],
            "teaching": "Attól, hogy senki sem látott, a pénz még nem lett a tiéd. A lelkiismeret nem azonos a lebukástól való félelemmel.",
            "scripture": {
              "reference": "2Mózes 20,15",
              "label": "„Tízparancsolat”",
              "quote": "Ne lopj!",
              "translation": "RÚF 2014",
              "short": [
                "A „Ne lopj!” parancsolat arra tanít, hogy tiszteljük a másik ember tulajdonát, munkáját és mindazt, ami számára értéket képvisel. Attól, hogy találsz valamit, az még nem válik a tiéddé. A pénztárcában lévő 500 lej akkor is a tulajdonosé marad, ha senki sem látta, hogy felvetted, és senki sem kér számon érte."
              ],
              "more": [
                "Amikor megtartod a pénzt, elsősorban a saját vágyadra gondolsz: végre megveheted a régóta áhított fejhallgatót. Később azonban megtudod, hogy a tulajdonos édesanyja gyógyszereire gyűjtötte az összeget. Ekkor szembesülsz azzal, hogy a döntésed nemcsak rólad szól, hanem egy másik ember életére is hatással van. Ami számodra váratlan szerencsének tűnt, az valaki más számára komoly veszteség.",
                "A lelkiismeret és a lebukástól való félelem között fontos különbség van. A félelem azt kérdezi: „Mi lesz, ha kiderül, amit tettem?” A lelkiismeret viszont arra késztethet, hogy megvizsgáld: „Helyes volt-e, amit tettem, akkor is, ha soha senki nem tudja meg?”",
                "Isten parancsolata nem csupán tilt, hanem segít felismerni, hogyan élhetünk felelősen egymás mellett. Ha pedig rosszul döntöttünk, a történetnek nem feltétlenül kell itt véget érnie. A hiba felismerése lehetőséget ad a bocsánatkérésre, a jóvátételre és a változásra. A keresztyén ember számára a lelkiismeret felismerése nem a reménytelen bűntudatba, hanem az Isten kegyelmében bízó felelősségvállalás felé vezethet."
              ]
            },
            "question": "Ha biztosan tudnád, hogy soha senki nem fogja megtudni, mit tettél, akkor is helytelennek tartanád a döntésedet? És ha már elköltötted a pénzt, hogyan próbálhatnád jóvátenni?"
          },
          "C": {
            "title": "Csak az iratok visszaadása",
            "paragraphs": [
              "Az 500 lejt megtartod és elköltöd, a barna pénztárcát pedig a benne maradt személyi igazolvánnyal és két bankkártyával együtt leadod a rendőrségen.",
              "Azzal próbálod megnyugtatni magad, hogy legalább valami jót is tettél. Az iratok visszaadása valóban segítség a tulajdonosnak, de attól még az 500 lejt megtartottad és elköltötted."
            ],
            "teaching": "Egy helyes cselekedet nem teszi automatikusan helyessé a másikat. A lelkiismeretet önigazolással is elhallgattathatjuk.",
            "scripture": {
              "reference": "2Mózes 20,15",
              "label": "Tízparancsolat",
              "quote": "Ne lopj!",
              "translation": "RÚF 2014",
              "short": [
                "A „Ne lopj!” parancsolat nemcsak arra tanít, hogy tiszteljük a másik ember tulajdonát, hanem arra is, hogy őszintén vizsgáljuk meg saját döntéseinket és azok indítékait.",
                "Ebben a történetben két különböző dolgot tettél. Egyrészt visszaadtad az iratokat és a bankkártyákat, amivel valóban segítettél a tulajdonosnak. Másrészt megtartottad és elköltötted az 500 lejt, amely nem a tiéd volt. Az egyik cselekedet helyessége azonban nem teszi semmissé a másik helytelenségét."
              ],
              "more": [
                "Az ember hajlamos arra, hogy saját hibáit megmagyarázza vagy kisebbítse. Talán így gondolkodsz: „Legalább az iratokat visszaadtam. Más még ennyit sem tett volna!” Ez az önigazolás egyik formája lehet. Ahelyett, hogy szembenéznél a teljes döntéseddel, annak egyetlen pozitív részére összpontosítasz.",
                "A lelkiismeret azonban nem azért fontos, hogy mindenáron megnyugtasson bennünket. Arra is figyelmeztethet, ha valamit helytelenül tettünk. Ugyanakkor a lelkiismeret nem tévedhetetlen: saját vágyainkkal és magyarázatainkkal el is hallgattathatjuk. Ezért fontos, hogy döntéseinket Isten Igéjének fényében vizsgáljuk meg, ne csupán az alapján, hogy sikerült-e megnyugtatnunk önmagunkat.",
                "A keresztyén erkölcs nem azt tanítja, hogy hibáink után már nincs lehetőségünk változtatni. Isten kegyelme arra is bátorít, hogy felismerjük a helytelent, vállaljuk érte a felelősséget, és lehetőségünk szerint jóvátegyük. Az őszinte szembenézés nem a reménytelen bűntudat, hanem a változás kezdete lehet.",
                "A valódi kérdés tehát nem az, hogy tettél-e valami jót, hanem az, hogy hajlandó vagy-e a döntésed egészével őszintén szembenézni."
              ]
            },
            "question": "Az iratok visszaadása valódi segítség volt, vagy arra is szolgált, hogy megnyugtasd a lelkiismeretedet?"
          },
          "D": {
            "title": "A pénztárca otthagyása",
            "paragraphs": [
              "Otthagyod a pénztárcát, és elindulsz. Még látod, hogy egy másik járókelő felveszi.",
              "Nem tudod, mit fog tenni: visszajuttatja-e a tulajdonosnak, vagy megtartja. A pénztárca további sorsát már nem ismered."
            ],
            "teaching": "A felelősség néha nemcsak azt jelenti, hogy nem ártunk, hanem azt is, hogy lehetőségünk szerint segítünk.",
            "scripture": {
              "reference": "Lukács 10,31–32",
              "label": "Az irgalmas samaritánus",
              "quote": "Történetesen egy pap ment azon az úton lefelé, de amikor meglátta, elkerülte. Hasonlóképpen egy lévita is odaért arra a helyre, de amikor meglátta, ő is elkerülte.",
              "translation": "RÚF 2014",
              "short": [
                "Jézus az irgalmas samaritánus példázatában arra tanít, hogy a felebaráti szeretet nem merül ki abban, hogy nem ártunk másoknak. A szeretet azt is jelenti, hogy észrevesszük a segítségre szoruló embert, és lehetőségeink szerint teszünk érte valamit. A pénztárca otthagyása nem azonos a lopással, de felveti a segítségnyújtás felelősségét."
              ],
              "more": [
                "A példázatban egy embert rablók támadnak meg, kifosztják és megsebesítik. Egy pap és egy lévita is elhalad mellette, de egyikük sem áll meg segíteni. Végül egy samaritánus, aki idegennek számított a zsidók szemében, odalép hozzá, ellátja a sebeit, és gondoskodik róla. Jézus ezzel arra mutat rá, hogy nem az számít, ki tartozik a mi közösségünkhöz, hanem az, hogyan viszonyulunk ahhoz, akinek szüksége van ránk.",
                "A pénztárcás történetben nem loptál el semmit. Visszatetted a pénztárcát oda, ahol találtad, és továbbmentél. Ez lényeges különbség a pénz eltulajdonításához képest. Mégis érdemes feltenned a kérdést: megtettél-e mindent, amit ebben a helyzetben észszerűen megtehettél volna?",
                "Talán siettél a buszhoz, féltél a félreértésektől, vagy egyszerűen úgy gondoltad, hogy a pénztárca nem a te felelősséged. Ezek érthető szempontok lehetnek. De vajon mi történik akkor, ha mindenki úgy gondolkodik, hogy majd valaki más segít?",
                "A felebaráti szeretet nem azt jelenti, hogy minden helyzetben neked kell mindent megoldanod, vagy szükségtelen kockázatot kell vállalnod. Néha egy apró, felelősségteljes lépés is sokat jelenthet. Ebben az esetben például megpróbálhattad volna biztonságos módon visszajuttatni a pénztárcát a tulajdonosához, vagy leadni a rendőrségen.",
                "A lelkiismeret arra is ösztönözhet, hogy ne csupán azt vizsgáld, tettél-e valami rosszat, hanem azt is, volt-e lehetőséged valami jót tenni, amit végül elmulasztottál. A keresztyén felelősség nem pusztán a rossz elkerülését jelenti, hanem a másik ember iránti figyelmet és cselekvő szeretetet is.",
                "A kérdés tehát nem egyszerűen az, hogy ártottál-e valakinek, hanem az is, hogy észrevetted-e a lehetőséget a segítségnyújtásra."
              ]
            },
            "question": "Van különbség aközött, hogy nem ártasz valakinek, és aközött, hogy lehetőséged szerint segítesz neki?"
          }
        }
      }
    ],
    "commonTeaching": {
      "title": "Mit tanít a lelkiismeret?",
      "subtitle": "A lelkiismeret mint belső iránytű",
      "paragraphs": [
        "A lelkiismeret az ember belső erkölcsi érzéke, amely segít különbséget tenni jó és rossz között. Döntéseink előtt figyelmeztethet, utólag pedig ráébreszthet hibáinkra. Pál apostol szerint a lelkiismeret tanúskodik az emberben az erkölcsi törvényről (Róma 2,15).",
        "A lelkiismeret azonban nem tévedhetetlen. Befolyásolhatják vágyaink, félelmeink, neveltetésünk és környezetünk elvárásai. Ezért a keresztyén ember számára fontos, hogy döntéseit ne csupán saját érzései, hanem Isten Igéje alapján is megvizsgálja.",
        "A lelkiismeretünk által felismert hiba nemcsak bűntudatot ébreszthet, hanem változásra is ösztönözhet. Isten kegyelmében bízva lehetőségünk van a bűnbánatra, a megbocsátás keresésére és a jóvátételre."
      ],
      "highlight": "de mindent vizsgáljatok meg: a jót tartsátok meg",
      "highlightReference": "1Thesszalonika 5,21 – RÚF 2014, részlet"
    },
    "reflectionQuestion": "Most, hogy a következményt és a bibliai tanítást is megismerted, mit gondolsz a döntésedről?",
    "finalReflections": [
      {
        "id": "same",
        "text": "Továbbra is ugyanígy döntenék."
      },
      {
        "id": "different",
        "text": "Most már másként döntenék."
      },
      {
        "id": "uncertain",
        "text": "Nem tudom biztosan. Elgondolkodtatott."
      }
    ],
    "takeawayQuestion": "Mi az az egy gondolat, amelyet ebből a történetből magaddal viszel?",
    "finishLabel": "Befejeztem a történetet",
    "completionMessage": "A történet végére értél.",
    "replayLabel": "Újrajátszom a történetet"
  };
});
