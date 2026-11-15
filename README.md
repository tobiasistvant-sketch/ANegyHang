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

## Verziójelzés

Az alkalmazás verziójának egyetlen központi forrása a `package.json` **`version`** mezője, `MAJOR.MINOR.PATCH` formátumban. A kezdőképernyőn és minden képernyő láblécében ugyanaz a diszkrét `v…` jelzés szerepel.

A következő kiadáshoz például:

```sh
npm version patch --no-git-tag-version
npm test
```

Az npm `version` életciklus-parancsa automatikusan létrehozza a böngésző által közvetlenül betöltött `js/version.js` metaadatát. Ha a `package.json`-t kézzel módosítod, futtasd az `npm run version:sync` parancsot, és az npm lockfile verzióadatait is tartsd szinkronban. A generált fájlt ne szerkeszd kézzel; a `package.json`, `package-lock.json` és `js/version.js` fájlokat együtt commitold. Az `npm test` előellenőrzése megáll, ha a böngészős metaadat elavult. A játék futás közben nem kér verzióadatot külső szolgáltatástól, és nem igényel fordítást vagy Node.js-t.

A GitHub Pages a `main` ág gyökerében lévő, commitolt fájlokat publikálja. Az új verziójelzés a megfelelő commit sikeres Pages-közzététele után jelenik meg; pusztán egy helyi verziófrissítés még nem módosítja az élő oldalt. Commitazonosító szándékosan nem szerepel a felületen: a jelenlegi, ágból történő statikus közzététel mellett egy kézzel beírt hash nem igazolná megbízhatóan a ténylegesen kiszolgált kiadást. Ehhez később ellenőrzött kiadási metaadatot előállító publikálási folyamat szükséges.

## A kilenc fő képernyő – v0.3.0

A jóváhagyott tartalmi alap a [lektorált Word-szövegkönyv](docs/ANegyHang_9_kepernyos_lektoralt_szovegkonyv.docx). A dokumentum változatlanul megmarad a `docs` mappában; a szerkesztői és fejlesztési megjegyzései megvalósítási utasítások, nem tanulói szövegek.

1. Kezdőoldal.
2. A történet.
3. Első döntés.
4. A négy hang: négy egymás utáni, külön léptethető nézőpont, egyetlen fő szakaszon belül.
5. Második döntés, az elsővel azonos válaszlehetőségekkel és az első választás megmutatásával.
6. Befolyásoló tényező.
7. A végső döntéshez tartozó négy történetfolytatás egyike.
8. A választott ág bibliai reflexiója és a közös 8/K tanítás ugyanazon az oldalon. A rövid magyarázat látható; a teljes további magyarázat akadálymentes **Bővebben / Kevesebb** gombbal nyitható és csukható. Az igehely, a továbbgondolási kérdés és a közös tanítás mindig látható.
9. Személyes reflexió és lezárás: a két döntés, a változtatás és a befolyásoló tényező egyszer szerepel; ezután a három reflexiós lehetőség és az opcionális szövegmező következik. A **Befejeztem a történetet** menti és lezárja a választást, majd ugyanitt jelenik meg: **A történet végére értél.** Nincs külön összegző képernyő. A lezárt válaszok olvashatók, az újrajátszás továbbra is elérhető.

Nincs erkölcsi pontszám, rangsor vagy a döntés megváltoztatásáért járó jutalom. A négy hang azonos súlyú vizuális karaktert kap. A pénztárca otthagyását nem azonosítja az alkalmazás a pénz eltulajdonításával. A lelkiismeretet nem tekinti automatikusan Isten közvetlen, tévedhetetlen hangjának.

## Állapot és adatkezelés

A haladás csak a saját böngészőlap `sessionStorage` tárolójába kerül, az `a_negy_hang_session_v1` kulcs alá. Frissítés után folytatható, a munkamenet a lap bezárásához kötődik. Nem kér nevet, e-mailt vagy regisztrációt, nem hoz létre tanulói azonosítót, és nem küld választ külső szolgáltatáshoz. Nincs analitika vagy távoli API.

A tárolás tiltása vagy betelt tárhely esetén a játék memóriában tovább használható, az újratöltéssel kapcsolatos korlátot jelzi. Sérült mentésnél biztonságosan új munkamenetet indít. A szabad szöveg szövegként, a mező `value` tulajdonságán keresztül kerül a felületre, nem HTML-ként. Újrakezdéskor csak a saját játékállapota törlődik, más alkalmazások tárolókulcsaihoz nem nyúl.

A mentési séma a `v0.3.0` kiadásban 2-es változatra frissül, a tárolókulcs megváltoztatása nélkül. Az érvényes korábbi mentések döntései és reflexiói megmaradnak: a régi közös tanítás a 8. oldalra kerül, a korábbi végső összegzés pedig lezárt 9. oldalként áll helyre. A lezárásig a reflexió szerkeszthető, utána a lezárási jelzés és a mentett válasz ugyanazon az oldalon marad.

A közös eszközt a következő tanuló előtt az **Újrakezdés** művelettel lehet alapállapotba hozni. A böngésző saját lap-helyreállítási funkciója egy korábban bezárt munkamenetet is visszaállíthat.

## Fájlok

- `index.html`: fejléc, folyamatjelző, képernyőhely és natív megerősítő párbeszédablak.
- `css/styles.css`: a tananyagcsaládhoz illeszkedő megjelenés, mobilnézetek és fókuszjelzések.
- `js/content.js`: a történet, hangok, befejezések, bibliai tanítások és reflexiós kérdések.
- `js/state.js`: tiszta állapotgép, érvényességi feltételek, mentés és helyreállítás.
- `js/app.js`: a felület és eseményei; a szöveges tananyag adatból származik.
- `js/illustrations.js`: a hét helyi jelenetkép elérési útja, mérete és magyar alternatív szövege.
- `js/version.js`: a központi verzióból generált statikus metaadat; `scripts/sync-version.cjs`: generálás és ellenőrzés.
- `assets/`: saját SVG-jel és helyi, licencelt betűkészletek.
- `docs/ANegyHang_9_kepernyos_lektoralt_szovegkonyv.docx`: a jóváhagyott szövegkönyv, változatlan eredeti fájl.
- `scripts/read-approved-script.py`: a DOCX megbízható, Python-stdlib alapú kiolvasása a forráshűségteszthez.
- `tests/`: állapot-, tananyag-, DOCX-forráshűség- és böngészőtesztek.
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

Az állapotteszt 240 teljes utat ellenőriz (16 első/második döntéspár × 5 befolyás × 3 reflexió), továbbá a kötelező választásokat, a négy hang sorrendjét, a helyben történő lezárást, az írásvédett lezárt állapotot, a régi mentések migrációját és az újrakezdést. A forráshűségteszt közvetlenül az eredeti DOCX bekezdéseivel hasonlítja össze a történetet, a hangokat és valamennyi rövid/teljes bibliai magyarázatot. Ehhez a Python 3 beépített ZIP/XML-kezelője elég, külön csomag nem kell. A Playwright asztali és mobilméreten vizsgálja mind a négy ágat, a lenyitást és csukást, a közös tanítást, a 9. oldalon maradó lezárást, az újratöltést, a biztonságos szövegkezelést, a billentyűzetet és a képhibák melletti végigjátszást.

## Arculati és tartalmi alap

Elsődleges vizuális referencia: **Digitális lelkiismeret**. A sötétkék fejléc, meleg törtfehér háttér, türkiz részletek, lekerekített fehér kártyák és a Plus Jakarta Sans / Space Grotesk betűk ugyanahhoz a családhoz kapcsolják. Az Időzseton szakaszjelzője és a DiákÉletkerék reflexiós kártyái is referenciául szolgáltak. A meglévő projektek fájljaihoz ez a projekt nem kapcsolódik; önállóan fut.

A kék elsődleges gomb sötétített változata a fehér szöveg olvashatóságát szolgálja. A helyi betűkészletek forrása, változata, ellenőrzőösszege és licence az `assets/fonts/` mappában található.

A történet, a hangok, a bibliai magyarázatok és a közös tanítás szövegét a jóváhagyott kilencképernyős Word-szövegkönyv adja. A rövid és a lenyitható teljes magyarázatok önálló ágonként, változatlan megfogalmazással szerepelnek. A szó szerinti igerészletek pontos hivatkozással és RÚF 2014-jelöléssel különülnek el a magyarázó szövegtől. A `v0.2.2`-ben jóváhagyott képek és a tananyagcsalád arculata változatlan maradt.

## Javítófrissítés – v0.2.2

A `v0.2.2` a GitHubra már feltöltött, felhasználó által jóváhagyott négy új befejezésképet használja: `wallet-ending-return-full`, `wallet-ending-keep-money`, `wallet-ending-return-documents` és `wallet-ending-walk-away`. Az eredeti PNG-k, valamint a játék PNG- és WebP-változatai a meglévő útvonalakon maradtak; nem történt új képgenerálás vagy ismételt képfeltöltés. A C befejezés második bekezdése pontosítja, hogy az iratok visszaadása segítség, de az 500 lejt a játékos megtartotta és elköltötte. A többi történetszöveg és a döntési mechanizmus változatlan.

## Korábbi illusztrációs javítások – v0.2.1

A `v0.2.0` változatban elkészült hét jelenetből a `v0.2.1` hat felhasználó által jóváhagyott grafikai javítást épít be. A kezdőoldal a korábban bemutatott, négyfelé ágazó utat mutató jelöltet használja. A nyitóképen jobban látszik a busz, a négy hang visszafogott hátterén ugyanez a busz szerepel. Az A és C befejezésben fiatalos kéz és felismerhető rendőrségi helyszín látható; a C képen a pénztárcát adják át a benne lévő igazolvánnyal és két bankkártyával. A D képen a pénztárca kisebb, természetes méretű. Az elfogadott B kép minden változata és az eredeti stílusminta változatlan marad. A bibliai és személyes reflexiók szövegközpontúak maradtak. A B befejezés hirdetése továbbra is olvasható HTML-szöveg, nem a kép része.

A helyi `assets/illustrations/` mappában minden jelenethez 1280 × 720 képpontos (16:9) PNG és optimalizált WebP tartozik. A böngésző WebP-t használ, hiba esetén PNG-re vált. Ha egyik kép sem töltődik be, a képkeret eltűnik, a történet és a vezérlők továbbra is működnek. Nincs külső képszolgáltatás.

Az aktív eredeti PNG-ket a `design/illustrations/sources/` mappa, a jelenetek listáját és a generálási leírásokat a [grafikai dokumentáció](design/illustrations/README.md) őrzi. Az eredeti `wallet-opening-sample.png` külön, változatlan stílusreferencia; a javított nyitókép aktív eredetije a `sources/wallet-scene-opening.png`. A [jóváhagyási és forrásarchívum](design/illustrations/review-v0.2.0/README.md) megőrzi a felhasználó által elfogadott hat javítást. A webes változatok újra-előállítása ImageMagick 7-tel: `bash scripts/prepare-illustrations.sh`. Ez csak fejlesztői képméret- és formátumoptimalizálás; a játék futtatásához nem szükséges.

## Későbbi fejlesztés

- A további öt történet tartalmi kidolgozása és ellenőrzése.
- A történetválasztás és a hat történetet összekapcsoló döntési térkép.
- Valós tanulói/tanári próba, további böngészők és segítő technológiák vizsgálata.

Az állapotgép történetazonosítóval dolgozik. Egy következő történet a `stories` tömb azonos sémájú elemével, négy befejezéssel és a hozzá tartozó tesztekkel bővíthető; a történetválasztó és a közös térkép külön későbbi feladat. Jelenleg kizárólag a pénztárcás történet szerepel a játékban.
