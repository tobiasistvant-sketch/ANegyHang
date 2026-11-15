# A Négy hang – illusztrációk, v0.4.0

## A második történet hat jóváhagyott képe

**Az igazságtalan tanár** történet hat eredeti PNG-jét a felhasználó készítette el a ChatGPT-ben, egyenként jóváhagyta, és feltöltötte a `main` ágra. A `v0.4.0` ezeket építi be; új képgenerálás, rajzolás vagy kompozíciómódosítás nem történt. Az eredetik byte szerint változatlanul megmaradnak a `sources/` mappában.

| Webes PNG és azonos nevű WebP | Képernyő | Jóváhagyott eredeti |
| --- | --- | --- |
| [hero-teacher-paths.png](../../assets/illustrations/hero-teacher-paths.png) | A második történet kezdőképe | [Forrás](sources/hero-teacher-paths.png) |
| [teacher-scene-opening.png](../../assets/illustrations/teacher-scene-opening.png) | Történetbemutató és első döntés; a hangkártyák visszafogott háttere | [Forrás](sources/teacher-scene-opening.png) |
| [teacher-ending-private-talk.png](../../assets/illustrations/teacher-ending-private-talk.png) | A: négyszemközti beszélgetés | [Forrás](sources/teacher-ending-private-talk.png) |
| [teacher-ending-argument.png](../../assets/illustrations/teacher-ending-argument.png) | B: vita az osztály előtt | [Forrás](sources/teacher-ending-argument.png) |
| [teacher-ending-silence.png](../../assets/illustrations/teacher-ending-silence.png) | C: csendben maradás | [Forrás](sources/teacher-ending-silence.png) |
| [teacher-ending-homeroom-help.png](../../assets/illustrations/teacher-ending-homeroom-help.png) | D: segítség az osztályfőnöktől | [Forrás](sources/teacher-ending-homeroom-help.png) |

Az eredetik mérete 1670–1672 × 941 képpont. A webes változatok 1280 × 720 képpontosak, PNG és 85-ös minőségű WebP formátumban. Az arányos, teljes képet megtartó átméretezés után a néhány pixelnyi oldalsó különbséget meleg törtfehér háttér tölti ki. Nincs vágás vagy nyújtás: a jóváhagyott képen látható szereplők, a diák keze és a piros 5-ös megmaradnak. A képen szereplő jegyet a feldolgozás nem írja át; a történetben bekövetkező jegyváltozást a jóváhagyott szöveg mondja el.

Csak e hat webes képpár újra-előállítása, a pénztárcás történet fájljainak érintése nélkül:

```sh
bash scripts/prepare-illustrations.sh hero-teacher-paths teacher-scene-opening teacher-ending-private-talk teacher-ending-argument teacher-ending-silence teacher-ending-homeroom-help
```

A szkript ellenőrzi a megadott képazonosítókat; argumentum nélkül mind a tizenhárom jelenetet feldolgozza. Az új történethez nem készült külön kép a négy hangról. A meglévő hangkártyákhoz a jóváhagyott nyitókép használható visszafogott háttérként. A `js/illustrations.js` tartalmazza a tizenhárom jelenet elérési útját, magyar alternatív szövegét és méretét. A WebP → PNG visszaváltás és a két formátum hibája melletti végigjátszhatóság a közös felület működése.

## A pénztárcás történet megőrzött képei

A jóváhagyott `wallet-opening-sample.png` határozza meg a jelenetcsomag festett stílusát, és változatlan stílusreferenciaként megmarad. A `v0.2.1` a felhasználó által elfogadott hat javítást építi be a hét jelenetből álló csomagba; az elfogadott B kép eredeti és webes változatai byte szerint változatlanok. A [review-v0.2.0](review-v0.2.0/README.md) mappa a jóváhagyás és a javítások forrásarchívuma.

| Webes PNG | Képernyő | Aktív eredeti |
| --- | --- | --- |
| [hero-four-paths.png](../../assets/illustrations/hero-four-paths.png) | Általános kezdőoldal, négyfelé ágazó út | [Forrás](sources/hero-four-paths.png) |
| [wallet-scene-opening.png](../../assets/illustrations/wallet-scene-opening.png) | Történetbemutató és első döntés | [Forrás](sources/wallet-scene-opening.png) |
| [wallet-scene-voices.png](../../assets/illustrations/wallet-scene-voices.png) | A négy hang közös, visszafogott háttere | [Forrás](sources/wallet-scene-voices.png) |
| [wallet-ending-return-full.png](../../assets/illustrations/wallet-ending-return-full.png) | A: a teljes pénztárca átadása | [Forrás](sources/wallet-ending-return-full.png) |
| [wallet-ending-keep-money.png](../../assets/illustrations/wallet-ending-keep-money.png) | B: hirdetés és az új fejhallgató | [Forrás](sources/wallet-ending-keep-money.png) |
| [wallet-ending-return-documents.png](../../assets/illustrations/wallet-ending-return-documents.png) | C: a pénztárca átadása a benne lévő igazolvánnyal és két bankkártyával | [Forrás](sources/wallet-ending-return-documents.png) |
| [wallet-ending-walk-away.png](../../assets/illustrations/wallet-ending-walk-away.png) | D: visszanézés a lehajoló járókelőre | [Forrás](sources/wallet-ending-walk-away.png) |

## Grafikai folytonosság

A képek stilizált, digitálisan festett jelenetek, finom textúrákkal, meleg természetes fénnyel, sötétkék, türkiz, barna és törtfehér árnyalatokkal. A buszmegállós képek ugyanazt a helyszínt és barna bőrpénztárcát követik. Az A és C ügyintézési jelenete ugyanazt a pultot használja. A főszereplő nézőpontja első személyű, arca és személyazonossága nem jelenik meg.

A `v0.2.1` megőrzi a korábbi hero-jelöltet, a nyitóképen jobban megmutatja a buszt, a négy hang hátterén pedig ugyanazt a buszt visszafogottabban jeleníti meg. Az A és C jelenetben fiatalos kéz és felismerhető rendőrségi recepció szerepel. A C jelenetben a kissé nyitott pénztárcát adják át, benne a kártyákkal; a D jelenet pénztárcája kisebb, természetes méretű.

A pénztárcás jeleneteken nincs hozzáadott felirat vagy erkölcsi minősítés. A négy út nem feleltethető meg automatikusan a négy hangnak. A B hirdetés szövege, köztük a gyógyszerekre félretett pénz említése, külön HTML-ben marad. A C képen nincs olvasható személyes vagy banki adat. A D jelenet nem dönti el, mit tesz majd a járókelő.

## Források és webes változatok

A fenti `sources/` útvonalak a jóváhagyott jelenetek aktív eredetijeit tartalmazzák, a javított nyitóképet is beleértve. A korábbi aktív források a Git-előzményből érhetők el. A külön megőrzött [stílusminta](wallet-opening-sample.png) és a B jelenet valamennyi változata változatlan. A [generálási leírások](sources/provenance.json) rögzítik a referenciákat és a képek eredetét; a javítások jóváhagyási anyaga és generált eredetijei a [review-archívumban](review-v0.2.0/README.md) maradnak. A pénztárcás történet képeit az `image_gen` eszköz készítette.

A játék az `assets/illustrations/` mappából tölt, külső képszolgáltatás nélkül. Minden jelenethez 1280 × 720 képpontos, pontosan 16:9 arányú PNG és 85-ös minőségbeállítású WebP tartozik. Az eredeti képekből csak méret-, képarány- és formátumoptimalizálással készültek a webes változatok.

Újra-előállítás ImageMagick 7-tel a repository gyökeréből:

```sh
bash scripts/prepare-illustrations.sh
```

Ez fejlesztői művelet; a statikus játék használatához nem szükséges ImageMagick vagy fordítás. A WebP betöltési hibája helyi PNG-re váltást indít. Ha egyik változat sem elérhető, csak a képkeret tűnik el; a történet végigjátszható marad. Az alternatív szövegek és a képméretek központi helye a `js/illustrations.js`.

A bibliai reflexió és a közös tanítás mindkét történetben szövegközpontú. A pénztárcás történet tananyaga, hangszövegei és döntési mechanizmusa változatlan; a tanáros történet saját szövegekkel használja ugyanezt a hétképernyős rendszert.
