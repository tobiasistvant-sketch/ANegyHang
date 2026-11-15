# A NÉGY HANG – Ki irányítja a döntéseidet?

Magyar nyelvű, interaktív keresztyén döntéstörténet XI. osztályos, 16–18 éves református vallásórás diákoknak.

Önálló repository: [tobiasistvant-sketch/ANegyHang](https://github.com/tobiasistvant-sketch/ANegyHang).

A `v0.4.0` **két teljes, választható történetet** tartalmaz: **A megtalált pénztárca** (`wallet`) és **Az igazságtalan tanár** (`teacher`). A történetválasztás a kezdőoldalon történik, saját kezdőképpel és bemutatással. A tervezett további négy helyzethez nincs helykitöltő.

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

## Két történet, hét fő képernyő – v0.4.0

A jóváhagyott tartalmi források a [pénztárcás történet lektorált szövegkönyve](docs/ANegyHang_9_kepernyos_lektoralt_szovegkonyv.docx) és [a tanáros történet jóváhagyott forgatókönyve](docs/ANegyHang_2_tortenet_jovahagyott_forgatokonyv.docx). Mindkét eredeti Word-fájl változatlanul megmarad a `docs` mappában. A szerkesztői és fejlesztési megjegyzések megvalósítási utasítások, nem tanulói szövegek.

A `v0.3.1` jóváhagyott szerkezeti módosítása továbbra is felülírja a pénztárcás szövegkönyv korábbi 6. és 9. képernyőjének használatát. A külön befolyásoló kérdés kimarad, a személyes reflexiót pedig a későbbi, hat történet utáni közös lezáráshoz tartjuk fenn. Ez a közös reflexió és döntéstérkép még nincs megvalósítva. A történetszövegek, döntési lehetőségek, négy hang és bibliai magyarázatok változatlanok.

1. Kezdőoldal, történetválasztással és a kiválasztott történet saját bemutatásával.
2. A történet.
3. Első döntés.
4. A négy hang: négy egymás utáni, külön léptethető nézőpont, egyetlen fő szakaszon belül.
5. Második döntés, az elsővel azonos válaszlehetőségekkel és az első választás megmutatásával.
6. A végső döntéshez tartozó négy történetfolytatás egyike, közvetlenül a második döntés megerősítése után.
7. A választott ág bibliai reflexiója és a történet saját közös tanítása ugyanazon az oldalon. A rövid magyarázat látható; a teljes további magyarázat akadálymentes **Bővebben / Kevesebb** gombbal nyitható és csukható. Az igehely, a továbbgondolási kérdés és a közös tanítás mindig látható. A **Befejeztem a történetet** gomb elmenti a lezárás állapotát, majd ugyanitt jelenik meg az **Az első történet végére értél.**, illetve **A második történet végére értél.** visszajelzés. Ezután elérhető az **Újrajátszom a történetet** és a **Másik történetet választok** lehetőség. Nincs újabb kérdéssor, szövegmező, döntés-összehasonlítás vagy külön összegző képernyő.

A pénztárcás történet közös tanítása a **Mit tanít a lelkiismeret?** (a forrásban 8/K); a tanárosé **Az igazság és a szeretet együtt** (7/K, Efézus 4,15). A tanáros történet részletes befejezései és az **Utolsó gondolat** kérdése a történetfolytatásban, válaszmező nélkül szerepelnek. A szövegkönyvhöz képest csak két jóváhagyott szerkesztési javítás történt: az A válasz mindkét döntésnél a „nézze át újra a dolgozatomat” megfogalmazást használja, és a B bibliai magyarázatából kikerült a „tanítás, a másik ember” fölösleges vesszője.

Nincs erkölcsi pontszám, rangsor vagy a döntés megváltoztatásáért járó jutalom. A négy hang azonos súlyú vizuális karaktert kap. A pénztárca otthagyását nem azonosítja az alkalmazás a pénz eltulajdonításával. A lelkiismeretet nem tekinti automatikusan Isten közvetlen, tévedhetetlen hangjának.

## Állapot és adatkezelés

A haladás csak a saját böngészőlap `sessionStorage` tárolójába kerül, az `a_negy_hang_session_v1` kulcs alá. Frissítés után folytatható, a munkamenet a lap bezárásához kötődik. Nem kér nevet, e-mailt vagy regisztrációt, nem hoz létre tanulói azonosítót, és nem küld választ külső szolgáltatáshoz. Nincs analitika vagy távoli API.

A tárolás tiltása vagy betelt tárhely esetén a játék memóriában tovább használható, az újratöltéssel kapcsolatos korlátot jelzi. Sérült mentésnél biztonságosan új munkamenetet indít. Újrakezdéskor csak a kiválasztott történet aktuális játéka törlődik; a másik történet mentése és más alkalmazások tárolókulcsai megmaradnak.

A mentési séma a `v0.4.0` kiadásban 4-es változatra frissül, a tárolókulcs megváltoztatása nélkül. A gyökérállapot a séma verzióját, az aktív `storyId` értékét, a kezdőoldali választás állapotát (`selectingStory`) és a `stories` objektumot tartalmazza. Ebben történetazonosító szerint külön bejegyzés őrzi az aktuális szakaszt és hangot, az első és második döntést, azok különbözőségét (`decisionChanged`), valamint a lezárás állapotát. A különbözőség a második döntés kiválasztásáig `null`, utána a két döntés összehasonlításának logikai értéke.

A történetváltás és az újratöltés nem törli a másik történet korábbi döntéseit. A kiválasztott történet folytatható, a befejezett játékmenet az adott történet újrajátszásáig lezárt marad. Az **Újrajátszom a történetet** csak az aktív történetet állítja alaphelyzetbe.

Az érvényes korábbi, 1-es, 2-es és 3-as sémájú mentéseket ellenőrzés után átvesszük a megfelelő történet bejegyzésébe, megőrizve a két döntést, a haladást és a befejezés állapotát. A régi megszüntetett befolyásoló képernyőről közvetlenül a történetfolytatáshoz, a régi közös tanításról, személyes reflexióról és összegzésről a 7. képernyőhöz kerül a játékos. A megszüntetett befolyásoló választást, háromválaszos reflexiót és szabad szöveget az új séma nem tárolja és nem kéri be újra.

Közös eszközön új tanuló előtt új böngészőlapos munkamenetet kell kezdeni, hogy a korábbi tanuló egyik történethez tartozó döntései se maradjanak meg. Az **Újrakezdés** csak az éppen kiválasztott történetet törli. A böngésző saját lap-helyreállítási funkciója egy korábban bezárt munkamenetet is visszaállíthat.

## Fájlok

- `index.html`: fejléc, folyamatjelző, képernyőhely és natív megerősítő párbeszédablak.
- `css/styles.css`: a tananyagcsaládhoz illeszkedő megjelenés, mobilnézetek és fókuszjelzések.
- `js/content.js`: a két történet teljes tananyaga és képi hozzárendelései. A hangok neve, ikonja és színe közös; megszólalásuk, leírásuk és a közös tanítás történethez kötött.
- `js/state.js`: tiszta állapotgép, érvényességi feltételek, mentés és helyreállítás.
- `js/app.js`: a felület és eseményei; a szöveges tananyag adatból származik.
- `js/illustrations.js`: a tizenhárom helyi jelenetkép elérési útja, mérete és magyar alternatív szövege.
- `js/version.js`: a központi verzióból generált statikus metaadat; `scripts/sync-version.cjs`: generálás és ellenőrzés.
- `assets/`: saját SVG-jel és helyi, licencelt betűkészletek.
- `docs/ANegyHang_9_kepernyos_lektoralt_szovegkonyv.docx`: a pénztárcás történet jóváhagyott szövegkönyve, változatlan eredeti fájl.
- `docs/ANegyHang_2_tortenet_jovahagyott_forgatokonyv.docx`: a tanáros történet jóváhagyott forgatókönyve, változatlan eredeti fájl.
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

Az állapotteszt 32 teljes utat ellenőriz (2 történet × 4 első döntés × 4 második döntés), továbbá a kötelező választásokat, a négy hang sorrendjét, a második döntés utáni közvetlen történetfolytatást, a helyben történő lezárást, a lezárt állapot védelmét, a régi mentések migrációját, a történetváltáskor megmaradó döntéseket és a csak kiválasztott történetre ható újrakezdést. A forráshűségteszt közvetlenül az eredeti DOCX bekezdéseivel hasonlítja össze mindkét történetet, a történethez kötött hangokat és valamennyi rövid/teljes bibliai magyarázatot. Ehhez a Python 3 beépített ZIP/XML-kezelője elég, külön csomag nem kell. A Playwright asztali és mobilméreten vizsgálja mind a nyolc ágat, a történetválasztást és -váltást, a hétszakaszos navigációt, a lenyitást és csukást, a közös tanítást, a 7. oldalon maradó lezárást, az újratöltést, a billentyűzetet és a képhibák melletti végigjátszást.

## Arculati és tartalmi alap

Elsődleges vizuális referencia: **Digitális lelkiismeret**. A sötétkék fejléc, meleg törtfehér háttér, türkiz részletek, lekerekített fehér kártyák és a Plus Jakarta Sans / Space Grotesk betűk ugyanahhoz a családhoz kapcsolják. Az Időzseton szakaszjelzője és a DiákÉletkerék reflexiós kártyái is referenciául szolgáltak. A meglévő projektek fájljaihoz ez a projekt nem kapcsolódik; önállóan fut.

A kék elsődleges gomb sötétített változata a fehér szöveg olvashatóságát szolgálja. A helyi betűkészletek forrása, változata, ellenőrzőösszege és licence az `assets/fonts/` mappában található.

A történetek, hangok, bibliai magyarázatok és közös tanítások szövegét a két jóváhagyott Word-szövegkönyv adja. A rövid és a lenyitható teljes magyarázatok önálló ágonként, változatlan megfogalmazással szerepelnek. A szó szerinti igerészletek pontos hivatkozással és RÚF 2014-jelöléssel különülnek el a magyarázó szövegtől. A `v0.2.2`-ben jóváhagyott képek és a tananyagcsalád arculata változatlan maradt.

## A második történet képei – v0.4.0

A tanáros történet hat új, felhasználó által készített és külön jóváhagyott eredeti PNG-je a `design/illustrations/sources/` mappában marad változatlanul. Ezekből az `assets/illustrations/` mappába 1280 × 720 képpontos PNG- és optimalizált WebP-változat készült: `hero-teacher-paths`, `teacher-scene-opening`, `teacher-ending-private-talk`, `teacher-ending-argument`, `teacher-ending-silence` és `teacher-ending-homeroom-help`. Nem történt új képgenerálás. A négy hang szakasza a jóváhagyott nyitóképet használja visszafogott háttérként; külön hangillusztráció nem készült. Az első történet hét képe és hozzárendelése változatlan. A feldolgozás részleteit és a forrásokat a [grafikai dokumentáció](design/illustrations/README.md) rögzíti.

## Javítófrissítés – v0.2.2

A `v0.2.2` a GitHubra már feltöltött, felhasználó által jóváhagyott négy új befejezésképet használja: `wallet-ending-return-full`, `wallet-ending-keep-money`, `wallet-ending-return-documents` és `wallet-ending-walk-away`. Az eredeti PNG-k, valamint a játék PNG- és WebP-változatai a meglévő útvonalakon maradtak; nem történt új képgenerálás vagy ismételt képfeltöltés. A C befejezés második bekezdése pontosítja, hogy az iratok visszaadása segítség, de az 500 lejt a játékos megtartotta és elköltötte. A többi történetszöveg és a döntési mechanizmus változatlan.

## Korábbi illusztrációs javítások – v0.2.1

A `v0.2.0` változatban elkészült hét jelenetből a `v0.2.1` hat felhasználó által jóváhagyott grafikai javítást épít be. A kezdőoldal a korábban bemutatott, négyfelé ágazó utat mutató jelöltet használja. A nyitóképen jobban látszik a busz, a négy hang visszafogott hátterén ugyanez a busz szerepel. Az A és C befejezésben fiatalos kéz és felismerhető rendőrségi helyszín látható; a C képen a pénztárcát adják át a benne lévő igazolvánnyal és két bankkártyával. A D képen a pénztárca kisebb, természetes méretű. Az elfogadott B kép minden változata és az eredeti stílusminta változatlan marad. A bibliai és személyes reflexiók szövegközpontúak maradtak. A B befejezés hirdetése továbbra is olvasható HTML-szöveg, nem a kép része.

A helyi `assets/illustrations/` mappában minden jelenethez 1280 × 720 képpontos (16:9) PNG és optimalizált WebP tartozik. A böngésző WebP-t használ, hiba esetén PNG-re vált. Ha egyik kép sem töltődik be, a képkeret eltűnik, a történet és a vezérlők továbbra is működnek. Nincs külső képszolgáltatás.

Az aktív eredeti PNG-ket a `design/illustrations/sources/` mappa, a jelenetek listáját és a generálási leírásokat a [grafikai dokumentáció](design/illustrations/README.md) őrzi. Az eredeti `wallet-opening-sample.png` külön, változatlan stílusreferencia; a javított nyitókép aktív eredetije a `sources/wallet-scene-opening.png`. A [jóváhagyási és forrásarchívum](design/illustrations/review-v0.2.0/README.md) megőrzi a felhasználó által elfogadott hat javítást. A webes változatok újra-előállítása ImageMagick 7-tel: `bash scripts/prepare-illustrations.sh`. Ez csak fejlesztői képméret- és formátumoptimalizálás; a játék futtatásához nem szükséges.

## Későbbi fejlesztés

- A további négy történet tartalmi kidolgozása és ellenőrzése.
- A hatodik történet utáni közös személyes reflexió és döntési térkép.
- Valós tanulói/tanári próba, további böngészők és segítő technológiák vizsgálata.

Az állapotgép történetazonosítóval dolgozik. Egy következő történet a `stories` tömb azonos sémájú elemével vehető fel: saját `start` bemutatás, `intro`, `choices`, `voices`, `voicesClosing`, `endings`, `commonTeaching`, `images` és `completionMessage` adatokkal. Az opcionális második döntési bevezető és az `Utolsó gondolat` is tartalmi adat. A képelérési utak a `js/illustrations.js` metaadatával és a megfelelő tesztekkel egészítendők ki. Új történethez nem kell a teljes játékmenetet újraírni. A hat történet utáni közös döntéstérkép külön későbbi feladat; jelenleg csak a két teljes történet érhető el.
