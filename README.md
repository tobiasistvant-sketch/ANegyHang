# A NÉGY HANG – Ki irányítja a döntéseidet?

Magyar nyelvű, interaktív keresztyén döntéstörténet XI. osztályos, 16–18 éves református vallásórás diákoknak.

Önálló repository: [tobiasistvant-sketch/ANegyHang](https://github.com/tobiasistvant-sketch/ANegyHang).

A prototípus **egyetlen teljes történetet** tartalmaz: **A megtalált pénztárca**. A tervezett további öt helyzethez nem tartalmaz helykitöltőket.

## Indítás

Az alkalmazás HTML/CSS/JavaScript-alapú, nincs fordítás, szerveroldali szolgáltatás vagy futásidejű csomagfüggőség. A repository gyökeréből például:

```sh
python3 -m http.server 8000
```

Ezután a saját böngésződben nyisd meg a helyi szerver 8000-es portját (`http://localhost:8000`). A helyben tárolt betűkészletekhez sincs szükség külső szolgáltatásra.

## GitHub Pages

A nyilvános repositoryban a **Settings → Pages → Build and deployment** résznél:

1. Source: **Deploy from a branch**.
2. Branch: **main**, mappa: **/ (root)**.
3. **Save**.

A GitHub a sikeres publikálás után megjeleníti az oldal címét. A projekt gyökérében lévő `.nojekyll` jelzi, hogy közvetlen statikus kiszolgálásra készült. A fejlesztés nem igényel automatikus külső telepítést.

## A működő folyamat

- Nyitólap és az élethelyzet bemutatása.
- Első, ösztönös döntés a négy megadott válasz közül.
- Vágy, Többiek, Félelem és Lelkiismeret: négy, sorrendben megjelenő, egyenként továbbkattintható megszólalás.
- Második döntés ugyanazokból a lehetőségekből, az első döntés megmutatásával.
- A leginkább befolyásoló hang vagy a saját, több szempontú mérlegelés kiválasztása.
- Négy különböző történetfolytatás, kizárólag a **második döntés** alapján.
- Választáshoz kapcsolódó bibliai tanítás és kérdés. A pénz megtartásánál Zákeus története és a jóvátétel lehetősége is megjelenik.
- Közös tanítás a lelkiismeretről: tévedhetőség, vizsgálat a Szentírás fényében, változás, bocsánatkérés és jóvátétel.
- Záró reflexió, opcionális saját gondolat és személyes összesítő kártya.
- Megerősítéshez kötött újrakezdés.

Nincs erkölcsi pontszám, rangsor vagy a döntés megváltoztatásáért járó jutalom. A négy hang azonos súlyú vizuális karaktert kap. A pénztárca otthagyását nem azonosítja az alkalmazás a pénz eltulajdonításával. A lelkiismeretet nem tekinti automatikusan Isten közvetlen, tévedhetetlen hangjának.

## Állapot és adatkezelés

A haladás csak a saját böngészőlap `sessionStorage` tárolójába kerül, az `a_negy_hang_session_v1` kulcs alá. Frissítés után folytatható, a munkamenet a lap bezárásához kötődik. Nem kér nevet, e-mailt vagy regisztrációt, nem hoz létre tanulói azonosítót, és nem küld választ külső szolgáltatáshoz. Nincs analitika vagy távoli API.

A tárolás tiltása vagy betelt tárhely esetén a játék memóriában tovább használható, az újratöltéssel kapcsolatos korlátot jelzi. Sérült mentésnél biztonságosan új munkamenetet indít. A szabad szöveg kizárólag `value` és `textContent` útján kerül a felületre. Újrakezdéskor csak a saját játékállapota törlődik, más alkalmazások tárolókulcsaihoz nem nyúl.

A közös eszközt a következő tanuló előtt az **Újrakezdés** művelettel lehet alapállapotba hozni. A böngésző saját lap-helyreállítási funkciója egy korábban bezárt munkamenetet is visszaállíthat.

## Fájlok

- `index.html`: fejléc, folyamatjelző, képernyőhely és natív megerősítő párbeszédablak.
- `css/styles.css`: a tananyagcsaládhoz illeszkedő megjelenés, mobilnézetek és fókuszjelzések.
- `js/content.js`: a történet, hangok, befejezések, bibliai tanítások és reflexiós kérdések.
- `js/state.js`: tiszta állapotgép, érvényességi feltételek, mentés és helyreállítás.
- `js/app.js`: a felület és eseményei; a szöveges tananyag adatból származik.
- `assets/`: saját SVG-jel és helyi, licencelt betűkészletek.
- `tests/`: állapot-, tananyag- és böngészőtesztek.
- `playwright.config.cjs`, `package.json`, `package-lock.json`: reprodukálható fejlesztői tesztkörnyezet.
- `.github/workflows/checks.yml`: automatikus tesztelés; nem publikálja az alkalmazást.

## Tesztelés

Node.js 20 vagy újabb és Python 3 szükséges a fejlesztői tesztekhez:

```sh
npm ci
npm test
npx playwright install chromium
npm run test:browser
```

A felhőkörnyezetben a konfiguráció felismeri a meglévő `/usr/bin/chromium` böngészőt; ott a külön böngészőtelepítés kihagyható. Másik Chromium a `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` változóval választható.

Az állapotteszt 240 teljes utat ellenőriz (16 első/második döntéspár × 5 befolyás × 3 reflexió), továbbá a kötelező választásokat, a négy hang sorrendjét, újratöltést, sérült/tiltott tárolást és az újrakezdést. A tananyagteszt védi az eredeti párbeszédeket és a lényeges teológiai megkülönböztetéseket. A Playwright asztali és mobilméreten vizsgálja mind a négy befejezést, a szöveges válasz megőrzését, a HTML-szerű bemenet biztonságát, a billentyűzetet és a párbeszédablakot.

## Arculati és tartalmi alap

Elsődleges vizuális referencia: **Digitális lelkiismeret**. A sötétkék fejléc, meleg törtfehér háttér, türkiz részletek, lekerekített fehér kártyák és a Plus Jakarta Sans / Space Grotesk betűk ugyanahhoz a családhoz kapcsolják. Az Időzseton szakaszjelzője és a DiákÉletkerék reflexiós kártyái is referenciául szolgáltak. A meglévő projektek fájljaihoz ez a projekt nem kapcsolódik; önállóan fut.

A kék elsődleges gomb sötétített változata a fehér szöveg olvashatóságát szolgálja. A helyi betűkészletek forrása, változata, ellenőrzőösszege és licence az `assets/fonts/` mappában található.

A történet és a tanítás alapja a fejlesztési feladatban megadott magyar szöveg. Az igehelyekhez adott magyarázatok összefoglalások, nem szó szerinti bibliai idézetek. A külön idézett parancsolat („Ne lopj!” – 2Mózes 20,15) és a közös tanítás kiemelése („de mindent vizsgáljatok meg: a jót tartsátok meg” – 1Thesszalonika 5,21, részlet) a RÚF 2014 szövegét követi. Az 1Thesszalonika-idézet a felhasználó által megadott részlet; [forrása a Bible.com-on](https://www.bible.com/hu/bible/920/1TH.5.21.R%C3%9AF).

## Későbbi fejlesztés

- A további öt történet tartalmi kidolgozása és ellenőrzése.
- A történetválasztás és a hat történetet összekapcsoló döntési térkép.
- Valós tanulói/tanári próba, további böngészők és segítő technológiák vizsgálata.

Az állapotgép történetazonosítóval dolgozik. Egy következő történet a `stories` tömb azonos sémájú elemével, négy befejezéssel és a hozzá tartozó tesztekkel bővíthető; a történetválasztó és a közös térkép külön későbbi feladat. Jelenleg kizárólag a pénztárcás történet szerepel a játékban.
