/*
 * A NÉGY HANG – jóváhagyott történetek, közös hétképernyős játékmenet.
 * Források: docs/ANegyHang_9_kepernyos_lektoralt_szovegkonyv.docx és
 * docs/ANegyHang_2_tortenet_jovahagyott_forgatokonyv.docx.
 * A szerkesztői és fejlesztési megjegyzések nem tanulói szövegek.
 * A v0.3.1 szerkezeti döntése szerint a korábbi 6. és 9. képernyő nem jelenik meg.
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
        "color": "#975B36",
        "icon": "flame"
      },
      {
        "id": "others",
        "name": "TÖBBIEK",
        "label": "Többiek",
        "color": "#795878",
        "icon": "users"
      },
      {
        "id": "fear",
        "name": "FÉLELEM",
        "label": "Félelem",
        "color": "#456581",
        "icon": "shield"
      },
      {
        "id": "conscience",
        "name": "LELKIISMERET",
        "label": "Lelkiismeret",
        "color": "#287D84",
        "icon": "compass"
      }
    ],
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
            "question": "Ha biztosan tudnád, hogy soha senki nem fogja megtudni, mit tettél, akkor is helytelennek tartanád a döntésedet? És ha már elköltötted a pénzt, hogyan próbálhatnád jóvátenni?",
            "noticeLabel": "A buszmegállóban olvasott hirdetés",
            "noticeRange": [
              2,
              4
            ]
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
        },
        "voices": [
          {
            "id": "desire",
            "description": "Lelkes, lendületes",
            "speech": "Gondolj bele! Végre megvehetnéd azt a fejhallgatót, amire olyan régóta vágysz! Mindig másoknak van szerencséjük. Most végre neked is összejött valami. Miért mondanál le róla?"
          },
          {
            "id": "others",
            "description": "Magabiztos, a közösség véleményére hivatkozik",
            "speech": "Ugyan már! Szerinted hányan adnák vissza ezt a pénzt? Ha elmondanád a többieknek, biztos kiröhögnének, hogy ilyen lehetőséget elszalasztottál. Ne légy már ennyire naiv!"
          },
          {
            "id": "fear",
            "description": "Aggódó, óvatos",
            "speech": "Biztos, hogy jó ötlet belekeveredni ebbe? Mi van, ha kamera figyeli a megállót? Mi van, ha valaki azt hiszi, te loptad el? TEDD VISSZA! Maradj ki belőle!\n\nTégy úgy, mintha nem is láttad volna!"
          },
          {
            "id": "conscience",
            "description": "Nyugodt, elgondolkodtató",
            "speech": "Állj meg egy pillanatra! Ez a pénz valaki másé. Lehet, hogy neked is nagy szükséged lenne rá, de a pénz akkor sem a tiéd. Mit éreznél, ha te veszítetted volna el?"
          }
        ],
        "voicesClosing": "Négy hang. Négy különböző szempont. A döntést azonban továbbra is neked kell meghoznod.",
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
        "completionMessage": "Az első történet végére értél.",
        "start": {
          "intro": [
            "Először az első megérzésedre hallgatsz. Aztán négy nézőpontot ismersz meg. A végső döntést te hozod meg."
          ],
          "button": "Kezdjük a történetet"
        },
        "images": {
          "hero": "wallet-scene-opening",
          "opening": "wallet-scene-opening",
          "voices": "wallet-scene-voices",
          "endings": {
            "A": "wallet-ending-return-full",
            "B": "wallet-ending-keep-money",
            "C": "wallet-ending-return-documents",
            "D": "wallet-ending-walk-away"
          }
        },
        "context": {
          "eyebrow": "Hazafelé · A buszmegálló",
          "emphasis": "500 lej",
          "facts": [
            "500 lej a pénztárcában",
            "Személyi igazolvány és két bankkártya",
            "Pillanatokon belül a busz érkezik"
          ]
        }
      },
      {
        "id": "teacher",
        "title": "Az igazságtalan tanár",
        "start": {
          "intro": [
            "Egy rossz jegy. Egy igazságtalannak érzett helyzet. Egyetlen pillanat, amikor el kell döntened, hogyan reagálsz.",
            "Vajon lehet egyszerre határozottnak és tisztelettudónak lenni?"
          ],
          "button": "Kezdődjön a történet!"
        },
        "intro": [
          "Csütörtök van. A tanár kiosztja a múlt heti dolgozatokat. Amikor megkapod a sajátodat, csalódottan nézed az eredményt: 5-ös. Sokat készültél, és arra számítottál, hogy ennél jobb jegyet kapsz. Újra átnézed a feladatokat. Az egyiknél észreveszed, hogy a tanár nem adott pontot a megoldásodra, pedig a számításod több lépése helyesnek tűnik. A melletted ülő osztálytársad dolgozatán hasonló megoldást látsz, amelyért ő kapott pontot. Felemeled a kezed, és megkérdezed, miért nem kaptál legalább részpontszámot.",
          "A tanár azonban türelmetlenül válaszol:",
          "– Most ne kezdjünk el minden ponton vitatkozni! Ha többet tanultál volna, jobb jegyet kaptál volna.",
          "Néhány osztálytársad elneveti magát. Érzed, hogy elvörösödsz. Egyszerre vagy dühös és megalázott. A tanár közben már a következő feladatról beszél. Az óra hamarosan véget ér."
        ],
        "question": "Mit teszel?",
        "choices": [
          {
            "id": "A",
            "text": "Óra után négyszemközt megkérem a tanárt, hogy nézze át újra a dolgozatomat."
          },
          {
            "id": "B",
            "text": "Az egész osztály előtt hangosan számonkérem, hogy miért bánik velem igazságtalanul."
          },
          {
            "id": "C",
            "text": "Nem szólok többet. Inkább elfogadom a jegyet, hogy ne legyen további kellemetlenségem."
          },
          {
            "id": "D",
            "text": "Az osztályfőnökhöz fordulok a dolgozatommal, és segítséget kérek az ügy tisztázásához."
          }
        ],
        "voices": [
          {
            "id": "desire",
            "description": "Indulatos, sértett hangon.",
            "speech": "Ezt nem hagyhatod annyiban! Egy csomót tanultál, és most mindenki előtt megalázott. Legalább egyszer mutasd meg neki, hogy nem tehet meg veled akármit!\n\nNem elég a jobb jegy. Azt akarod, hogy mindenki lássa: neked volt igazad!"
          },
          {
            "id": "others",
            "description": "Magabiztosan, a társak véleményére hivatkozva.",
            "speech": "Láttad, hogy kinevettek? Ha most csendben maradsz, mindenki azt fogja gondolni, hogy meg sem mered védeni magad.\n\nDe vigyázz! Ha túl messzire mész, holnap már arról fognak beszélni, hogy összevesztél a tanárral.\n\nGondold meg, mit fognak szólni a többiek!"
          },
          {
            "id": "fear",
            "description": "Aggódva, óvatosan.",
            "speech": "Mi van, ha csak még rosszabb lesz? A tanár egész évben tanít téged. Még sokszor kell felelned nála.\n\nMi lesz, ha megjegyzi, hogy problémáztál? Lehet, hogy legközelebb még szigorúbban osztályoz.\n\nEgyetlen jegyért tényleg megéri kockáztatni? Inkább hagyd az egészet!"
          },
          {
            "id": "conscience",
            "description": "Nyugodtan, elgondolkodtatva.",
            "speech": "Az, hogy a tanár idősebb nálad, még nem jelenti azt, hogy nem tévedhet. Jogod van megérteni, miért kaptad ezt a jegyet. De az is számít, hogyan állsz ki az igazadért.\n\nBiztosan hibás a javítás? Mivel tudnád alátámasztani? Hogyan tudnád tisztázni a helyzetet úgy, hogy közben a saját és a tanárod méltóságát is tiszteletben tartod? És ha egyedül nem sikerül, kitől kérhetnél segítséget?"
          }
        ],
        "voicesClosing": "Négy hang. Négy különböző szempont. A döntést azonban továbbra is neked kell meghoznod.",
        "initialButton": "Meghoztam az első döntésemet",
        "finalIntro": [
          "Most már meghallgattad a négy hangot.",
          "A tanóra hamarosan véget ér. A döntésednek következménye lesz, nemcsak a jegyedre, hanem a tanároddal való kapcsolatodra is."
        ],
        "finalQuestion": "Mit választasz most?",
        "finalButton": "Ezt választom",
        "endings": {
          "A": {
            "title": "A NÉGYSZEMKÖZTI BESZÉLGETÉS",
            "paragraphs": [
              "Az óra véget ér. Megvárod, amíg az osztálytársaid kimennek a teremből. A tanár már a táskájába pakol, amikor odalépsz hozzá.",
              "– Tanár úr, szeretnék kérdezni valamit a dolgozatommal kapcsolatban.",
              "A tanár rád néz.",
              "– Most már tényleg nincs sok időm. Mi a probléma?",
              "Megmutatod azt a feladatot, amelynél szerinted nem kaptad meg a megfelelő pontszámot.",
              "– Nem azt mondom, hogy minden megoldásom hibátlan – kezded. – Csak szeretném megérteni, miért kaptam erre nulla pontot. A megoldás első része szerintem helyes.",
              "A tanár felsóhajt, de kezébe veszi a dolgozatot. Egy ideig csendben nézi.",
              "– Hm. Itt valóban helyes az eljárás eleje. A végeredmény viszont hibás.",
              "Előveszi a javítási útmutatót, és még egyszer összeveti a megoldásodat a pontozással.",
              "– Erre az egy pontra jogosult vagy. Ezt nem vettem észre.",
              "Beírja a hiányzó pontot. Az összpontszámod így már elegendő a 6-oshoz.",
              "Megköszönöd.",
              "Mielőtt elmennél, még hozzáteszed:",
              "– Az is rosszul esett, amit az óra közben mondott. Tényleg készültem a dolgozatra.",
              "A tanár néhány másodpercig hallgat.",
              "– Sok dolgozatot javítottam, lehet, hogy türelmetlen voltam. De legközelebb inkább óra végén beszéljük meg az ilyesmit.",
              "Nem kér egyértelműen bocsánatot. Nem is lesz egyik pillanatról a másikra barátságosabb. Kilépsz a teremből a kijavított dolgozattal. Megkaptad a hiányzó pontot. De közben azt is megtapasztaltad, hogy még egy nyugodt beszélgetés sem feltétlenül old fel minden feszültséget."
            ],
            "lastThought": "Vajon akkor is megérte volna kiállnod az igazadért, ha a tanár végül nem változtatja meg a jegyedet?",
            "scripture": {
              "reference": "Példabeszédek 15,1",
              "label": "A higgadt válasz",
              "quote": "A higgadt válasz elhárítja az indulatot, de a bántó beszéd haragot támaszt.",
              "translation": "RÚF 2014",
              "short": [
                "Óra után nyugodtan odaléptél a tanárhoz, és megmutattad, melyik feladat javítását tartod vitathatónak. Nem mondtál le az igazadról, mégsem a nyilvános megszégyenítést választottad.",
                "A példabeszéd arra tanít, hogy szavaink hangneme hatással lehet a konfliktus alakulására. A higgadtság nem meghunyászkodás, és nem is biztosíték arra, hogy a másik ember igazat ad nekünk. A döntésed értékét ezért nem önmagában az dönti el, hogy végül 6-osra javították a jegyedet."
              ],
              "more": [
                "A helyes cselekedethez helyes cél, indíték és eszköz is szükséges. Ebben a helyzetben a célod az lehetett, hogy igazságos pontozást kapj. Az eszközöd a személyes, tárgyszerű beszélgetés volt. De az indítékodat is érdemes megvizsgálnod: elsősorban a dolgozat értékelését szeretted volna tisztázni, vagy azt akartad, hogy a tanár belássa, megalázott téged?",
                "A kilencedik parancsolat magyarázata nemcsak a hazugságot tiltja, hanem az igazság szeretetére, a nyílt és őszinte beszédre is bátorít. Azt is hangsúlyozza, hogy óvakodjunk a másik emberről alkotott könnyelmű ítélettől. Te ezért nem azzal kezdted, hogy a tanárod szándékosan igazságtalan, hanem megmutattad a konkrét feladatot, és magyarázatot kértél.",
                "A tanárnak ugyanakkor saját felelőssége van. Neki kell tisztességesen javítania, megmagyaráznia az értékelést, és tisztelettel bánnia a diákjaival. Attól, hogy te kulturáltan szóltál, az órai megalázó megjegyzése még nem vált helyessé. Az sem a te hibád lenne, ha egy udvarias kérésre sem kapnál méltányos választ.",
                "A végén megkaptad az elmaradt pontot, de a feszültség nem tűnt el teljesen. Ez emlékeztet arra, hogy az igazságos rendezés és a kapcsolat helyreállása nem mindig történik meg egyszerre. A lelkiismereted nemcsak abban segíthet, hogy megszólalj, hanem abban is, hogy később őszintén végiggondold a saját szándékaidat."
              ]
            },
            "question": "Ha a tanár végül nem változtatta volna meg a jegyedet, akkor is értékesnek tartanád, hogy nyugodtan és tárgyszerűen kiálltál az igazadért?"
          },
          "B": {
            "title": "AMIKOR ELSZABADULNAK AZ INDULATOK",
            "paragraphs": [
              "A tanár a következő feladatot kezdi magyarázni, de te már nem tudsz figyelni. Még mindig a füledben cseng a megjegyzése, és az osztálytársaid nevetése. Hirtelen felállsz.",
              "– Ez nem igazságos! – mondod hangosan. – Miért kapok rosszabb jegyet ugyanarra a megoldásra, mint mások?",
              "A tanár félbeszakítja a magyarázatot.",
              "– Ülj le! Ezt nem így kell megbeszélni.",
              "De most már nem akarsz leállni.",
              "– Persze, mert magának mindig igaza van! Még akkor is, amikor hibázik!",
              "A teremben teljes csend lesz. Néhány osztálytársad elismerően néz rád. Mások zavartan figyelik a jelenetet. A tanár arca megfeszül.",
              "– Ezzel a hangnemmel nem vagyok hajlandó beszélgetni. Óra után maradsz, és megbeszéljük a viselkedésedet. Végül leülsz, de még mindig remegsz az idegességtől. A következő szünetben két osztálytársad odalép hozzád.",
              "– Hát, ezt jól megmondtad neki! – nevet az egyik.",
              "A másik viszont halkan megjegyzi:",
              "– Szerintem tényleg rosszul javította a feladatodat. De most már mindenki azon vitatkozik, hogyan beszéltél vele, nem azon, hogy jogos-e a pontod.",
              "Ez a mondat egész nap nem hagy nyugodni. Délután újra megnézed a dolgozatodat. A kifogásolt megoldás továbbra is ugyanúgy ott van. Lehet, hogy valóban járt volna érte pont. De az ügy még nincs rendezve, és a tanárral való konfliktus is súlyosabbá vált. A tanár igazságtalan megjegyzése nem vált elfogadhatóvá attól, hogy te is elveszítetted a türelmedet. A te indulatos válaszod pedig nem bizonyítja, hogy a dolgozatod javítása helyes volt.",
              "Most két különböző problémával kellene foglalkozni: a pontozás igazságosságával és azzal, ahogyan egymással beszéltetek."
            ],
            "lastThought": "Ha igazad van valamiben, akkor minden eszköz megengedett az igazad megvédésére?",
            "scripture": {
              "reference": "Jakab 1,19–20",
              "label": "Hallgatás, beszéd és harag",
              "quote": "Tanuljátok meg tehát, szeretett testvéreim: legyen minden ember gyors a hallásra, késedelmes a szólásra, késedelmes a haragra, mert az ember haragja nem szolgálja Isten igazságát.",
              "translation": "RÚF 2014",
              "short": [
                "Jogosan érezhetted megalázónak a tanár szavait. A harag önmagában nem bizonyítja, hogy rossz ember vagy, és nem teszi semmissé a dolgozatoddal kapcsolatos kifogásodat.",
                "Jakab azonban arra figyelmeztet, hogy a harag könnyen átveheti az irányítást a szavaink fölött. Amikor hangosan visszaszóltál, a vita figyelme a dolgozat javításáról a konfliktusra terelődött. Attól, hogy igazad lehet a pontozásban, még nem válik minden eszköz helyessé."
              ],
              "more": [
                "Jakab levelében a hallásra való készség, a megfontolt beszéd és a harag fékezése összetartozik. A keresztyén önuralom nem azt jelenti, hogy elfojtunk minden sérelmet, hanem azt, hogy nem engedjük: a sértettségünk helyettünk döntsön. A tanár megjegyzése fájhatott, és ezt ki is lehet mondani. A kérdés az, hogy ezzel tisztázni vagy visszavágni akartál-e.",
                "A kilencedik parancsolatról szóló tanítás a másik ember jó hírét, becsületét és az igazmondást is védi. Ha igazságtalanság ért, nem kell azt letagadnod. De a sértő vagy általánosító kijelentések könnyen elhomályosítják a tényszerű kifogásodat. A „rosszul javította ezt a feladatot” ellenőrizhető állítás. Az, hogy „neki mindig igaza van, és soha nem tisztességes”, már sokkal több, mint amit az adott helyzetből biztosan tudhatsz.",
                "A történetben két erkölcsi kérdést kell különválasztani. Az első: valóban hibás volt-e a javítás, és méltányosan beszélt-e veled a tanár? A második: hogyan reagáltál te a sérelemre? A te indulatos beszéded nem menti fel a tanárt az esetleges hibája alól. Ugyanakkor a tanár hibája sem tesz minden visszaszólást helyessé.",
                "Ha később belátod, hogy a hangnemed bántó volt, azért kérhetsz bocsánatot anélkül, hogy visszavonnád a dolgozattal kapcsolatos jogos kérdésedet. A jóvátétel és az igazság tisztázása nem egymás ellentétei. A keresztyén etika nem tévedhetetlen szereplőket keres, hanem olyan embereket, akik vállalják a tetteikért a felelősséget, és készek változtatni."
              ]
            },
            "question": "Tudnál-e bocsánatot kérni az indulatos hangnemedért úgy, hogy közben továbbra is kéred a dolgozatod igazságos újraértékelését?"
          },
          "C": {
            "title": "A CSEND ÁRA",
            "paragraphs": [
              "Lenézel a dolgozatodra. Egy pillanatra arra gondolsz, hogy újra jelentkezel, de eszedbe jutnak a tanár szavai és az osztálytársaid nevetése. Inkább összehajtod a lapot, és beteszed a táskádba.",
              "„Csak egy jegy” – mondod magadnak.",
              "Az óra végén az egyik osztálytársad odafordul hozzád.",
              "– Te, szerintem tényleg járna neked még egy pont. Meg fogod kérdezni?",
              "Megrázod a fejed.",
              "– Nem. Nem akarok ebből még nagyobb ügyet.",
              "A következő napokban a tanár ugyanúgy viselkedik veled, mint korábban. Nem szól hozzád rosszindulatúan, és nem is történik újabb kellemetlenség. A jegyed viszont 5-ös marad. Egy délután otthon újra előveszed a dolgozatot. A kifogásolt megoldásnál még mindig ott a piros nulla. Talán a tanárnak volt valamilyen szempontja, amelyet nem értettél. Talán tényleg elnézte a részpontszámot. Nem tudod. Az bosszant leginkább, hogy végül meg sem próbáltad tisztázni.",
              "Ugyanakkor azt is tudod, miért maradtál csendben: féltél attól, hogy újra megszégyenítenek, vagy a következő alkalommal is kellemetlenség ér. A hallgatásod megvédett egy újabb, azonnali konfliktustól. De a kérdés, amely miatt jelentkeztél, megválaszolatlan maradt."
            ],
            "lastThought": "Amikor a békesség kedvéért hallgatunk, vajon mindig valódi békességet teremtünk – vagy néha csak elkerüljük a nehéz beszélgetést?",
            "scripture": {
              "reference": "2Timóteus 1,7",
              "label": "Erő, szeretet és józanság",
              "quote": "Mert nem a félelem lelkét adta nekünk Isten, hanem az erő, a szeretet és a józanság lelkét.",
              "translation": "RÚF 2014",
              "short": [
                "Az órán hallgattál, mert féltél egy újabb megszégyenítéstől vagy attól, hogy a tanár később rosszabbul bánik veled. Ez érthető: a tanár és a diák között valódi hatalmi különbség van. Nem minden hallgatás gyávaság; néha az önvédelem része.",
                "Pál az erő, a szeretet és a józanság lelkéről ír Timóteusnak. Ez nem azt jelenti, hogy egy diáknak mindenáron, egyedül kell szembeszállnia egy tekintélyszeméllyel. Inkább arra hív, hogy a félelem mellett a józan mérlegelésnek és a felelősségteljes cselekvésnek is helyet adjunk."
              ],
              "more": [
                "Pál apostol eredetileg Timóteust bátorítja abban, hogy ne szégyellje Krisztusról szóló bizonyságtételét. Az ige tehát nem iskolai jegyvitáról szól. Mégis adhat szempontot ehhez a helyzethez: a bátorság nem feltétlenül hangos és látványos. Sokszor abból áll, hogy a félelmeinket komolyan véve, átgondoljuk, milyen biztonságos, tisztességes lehetőségünk maradt.",
                "A lelkiismeret egy belső jelzőrendszerként működik, amely segíthet felismerni a jót és a rosszat. De a lelkiismeret működése összetett, és a túlzott bűntudat akár béníthatja is az embert. Ezért a döntésed után nem az a cél, hogy megbélyegezd magadat: „gyáva voltam”. Inkább az, hogy megértsd, mitől féltél, és milyen lehetőségek között kellett választanod.",
                "Talán ezen az órán tényleg az volt a legbiztonságosabb, hogy nem folytattad a vitát. A hallgatás azonban nem feltétlenül végleges lemondás az igazad tisztázásáról. Később megkeresheted a tanárt egy nyugodtabb időpontban, megmutathatod a dolgozatot, vagy segítséget kérhetsz az osztályfőnöködtől és egy megbízható felnőttől.",
                "Az is fontos, hogy a tanár felelőssége nem hárítható át rád. A tisztességes értékelés és a megalázástól mentes légkör megteremtése elsősorban a felnőtt pedagógus feladata. A keresztyén bátorság ebben a helyzetben nem vakmerőség, hanem az erő, a szeretet és a józanság együttes keresése."
              ]
            },
            "question": "Mi lenne az a következő, számodra biztonságos lépés, amellyel mégis tisztázhatnád a dolgozatodat?"
          },
          "D": {
            "title": "SEGÍTSÉGET KÉRSZ",
            "paragraphs": [
              "Az óra végén nem mész oda újra a tanárhoz. Ehelyett felkeresed az osztályfőnöködet. Megmutatod neki a dolgozatodat, és elmondod, mi történt.",
              "– Nem szeretném, ha ebből veszekedés lenne – teszed hozzá. – Csak azt szeretném tudni, jogosan kaptam-e ezt a jegyet.",
              "Az osztályfőnök figyelmesen meghallgat.",
              "– Értem, hogy rosszul esett, ahogyan beszélt veled – mondja. – De nézzük meg külön a dolgozatot és azt, ami az órán történt.",
              "Először arra kér, hogy mutasd meg pontosan, melyik feladattal van problémád. Másnap egyeztet egy rövid megbeszélést közted és a szaktanár között. Amikor beléptek a terembe, a szaktanár láthatóan meglepődik.",
              "– Ezt miért kellett az osztályfőnökhöz vinni? Velem is megbeszélhetted volna.",
              "Egy pillanatra megbánod, hogy segítséget kértél. Az osztályfőnök azonban nyugodtan válaszol:",
              "– Azért vagyunk itt, hogy tisztázzuk a helyzetet. Nézzük meg először a feladatot. A szaktanár előveszi a javítási útmutatót. Hosszabban átnézi a megoldásodat, majd bólint.",
              "– A módszer első része helyes. Itt valóban jár még egy pont.",
              "A jegyedet 6-osra javítja.",
              "Ezután az osztályfőnök finoman visszatér arra, ami az órán történt.",
              "– Az is fontos, hogy a diákok merjenek kérdezni a javításról. És az is, hogy ezt tisztelettel tegyék.",
              "A szaktanár elismeri, hogy türelmetlenül válaszolt, de hozzáteszi, hogy jobban örült volna, ha először négyszemközt keresed meg. A beszélgetés végén nem érzitek magatokat teljesen felszabadultnak. A következő órán a tanár kissé tartózkodóbb veled. Ugyanakkor már nem kell azon töprengened, hogy jogos volt-e a kifogásod. Amikor kilépsz a teremből, az osztályfőnök még odafordul hozzád:",
              "– Segítséget kérni nem szégyen. Csak arra figyelj, hogy mindig az ügy megoldását keresd, ne valaki megbüntetését."
            ],
            "lastThought": "Ha egy igazságtalan helyzetet egyedül nem tudunk megoldani, gyengeség vagy felelősségteljes döntés segítséget kérni?",
            "scripture": {
              "reference": "Máté 5,9",
              "label": "A békességteremtés",
              "quote": "Boldogok, akik békét teremtenek, mert ők Isten fiainak neveztetnek.",
              "translation": "RÚF 2014",
              "short": [
                "Úgy döntöttél, hogy az osztályfőnök segítségével keresel megoldást. Nem akartad megbüntettetni a tanárt: azt szeretted volna, hogy valaki segítsen tárgyilagosan tisztázni az ügyet.",
                "Jézus a békességteremtőket mondja boldognak. A békesség azonban nem egyenlő azzal, hogy minden konfliktust eltakarunk. Néha éppen az segíti a rendezést, ha egy harmadik, megbízható ember közvetít a felek között."
              ],
              "more": [
                "A Hegyi beszéd boldogmondásai Jézus tanítványainak életét formáló útmutatások. A békességteremtés nem passzív szemlélődés, hanem cselekvő törekvés a kapcsolatok rendezésére. Nem ír elő minden vitára egyetlen megoldási eljárást, de arra ösztönöz, hogy a másik ember legyőzése helyett az igazságos rendezést keressük.",
                "A társadalmi igazságtalanságokkal szembeni felelős fellépés is a keresztyén ember feladata. Ugyanakkor a kilencedik parancsolat figyelmeztet a könnyelmű ítélkezésre és a másik jó hírének megsértésére. Ezért döntő a különbség aközött, hogy tényszerűen elmondod, mi történt, vagy bizonyíték nélkül azzal vádolod a tanárt, hogy szándékosan árt neked.",
                "Az osztályfőnökhöz fordulás nem szükségképpen árulkodás vagy támadás. Segítséget kérni akkor is helyénvaló lehet, ha előbb nem tudtál vagy nem mertél négyszemközt beszélni a tanárral. A felnőttek feladata, hogy az ilyen kérdéseket méltányosan, a diákot nem megszégyenítve vizsgálják meg.",
                "A történetben a jegyed megváltozott, de a kapcsolat kissé feszültté vált. Ez azt is megmutatja, hogy az igazságos eredmény nem jelenti automatikusan a teljes kiengesztelődést. A békességteremtés néha időt és további beszélgetést kíván. A lelkiismeret kérdése itt is az, hogy miért kértél segítséget: a helyzet rendezéséért, vagy azért, hogy valaki a tanárt is megszégyenítse?"
              ]
            },
            "question": "Honnan tudhatod, hogy segítséget kérsz az igazságos rendezéshez, és nem azért keresel szövetségest, hogy visszavágj valakinek?"
          }
        },
        "commonTeaching": {
          "title": "Az igazság és a szeretet együtt",
        "highlightFirst": true,
          "paragraphs": [
            "Egy igazságtalannak érzett helyzetben több kérdés is felmerül: valóban igazam van? Mi alapján tudhatom? Mi a célom azzal, hogy megszólalok? És milyen eszközt választok? A keresztyén etika szerint nemcsak a célunkat, hanem az indítékainkat és a cselekvésünk módját is mérlegelnünk kell.",
            "A kilencedik parancsolat nem csupán a hazugságtól óv. Arra is tanít, hogy szeretettel ragaszkodjunk az igazsághoz, kerüljük a rágalmazást és a felelőtlen ítélkezést, ugyanakkor merjünk őszintén beszélni és kiállni a helyes ügy mellett. A tisztelet nem jelenti, hogy a tanár tévedhetetlen; a jogos önvédelem pedig nem jogosít fel a másik ember megalázására.",
            "A lelkiismeretünk segíthet észrevenni a feszültséget az indulataink, félelmeink és értékeink között. Nem tévedhetetlen, ezért fontos az önvizsgálat, Isten Igéje és a józan tanácskérés. Néha négyszemközt beszélünk, néha segítséget kérünk, és néha időre van szükségünk. A döntésünk felelősségét nem a jegyünk változása vagy mások tapsa méri.",
            "Ha hibázunk, nem kell a hibánál megállnunk. Lehetőség van a bocsánatkérésre, a jóvátételre és az újrakezdésre. A keresztyén ember nem azért törekszik az igazságra és a szeretetre, mert mindig hibátlan, hanem mert Isten kegyelme formálhatja a döntéseit és a kapcsolatait."
          ],
          "highlight": "hanem az igazsághoz ragaszkodva növekedjünk fel szeretetben",
          "highlightReference": "Efézus 4,15 – RÚF 2014, részlet"
        },
        "completionMessage": "A második történet végére értél.",
        "images": {
          "hero": "hero-teacher-paths",
          "opening": "teacher-scene-opening",
          "voices": "teacher-scene-opening",
          "endings": {
            "A": "teacher-ending-private-talk",
            "B": "teacher-ending-argument",
            "C": "teacher-ending-silence",
            "D": "teacher-ending-homeroom-help"
          }
        }
      }
    ],
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
    "replayLabel": "Újrajátszom a történetet"
  };
});
