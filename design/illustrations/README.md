# A Négy hang – illusztrációk, v0.2.1

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

Nincs felirat, logó vagy erkölcsi minősítés a képeken. A négy út nem feleltethető meg automatikusan a négy hangnak. A B hirdetés szövege, köztük a gyógyszerekre félretett pénz említése, külön HTML-ben marad. A C képen nincs olvasható személyes vagy banki adat. A D jelenet nem dönti el, mit tesz majd a járókelő.

## Források és webes változatok

A fenti `sources/` útvonalak a jóváhagyott jelenetek aktív eredetijeit tartalmazzák, a javított nyitóképet is beleértve. A korábbi aktív források a Git-előzményből érhetők el. A külön megőrzött [stílusminta](wallet-opening-sample.png) és a B jelenet valamennyi változata változatlan. A [generálási leírások](sources/provenance.json) rögzítik a referenciákat és a képek eredetét; a javítások jóváhagyási anyaga és generált eredetijei a [review-archívumban](review-v0.2.0/README.md) maradnak. A képeket az `image_gen` eszköz készítette.

A játék az `assets/illustrations/` mappából tölt, külső képszolgáltatás nélkül. Minden jelenethez 1280 × 720 képpontos, pontosan 16:9 arányú PNG és 85-ös minőségbeállítású WebP tartozik. Az eredeti képekből csak méret-, képarány- és formátumoptimalizálással készültek a webes változatok.

Újra-előállítás ImageMagick 7-tel a repository gyökeréből:

```sh
bash scripts/prepare-illustrations.sh
```

Ez fejlesztői művelet; a statikus játék használatához nem szükséges ImageMagick vagy fordítás. A WebP betöltési hibája helyi PNG-re váltást indít. Ha egyik változat sem elérhető, csak a képkeret tűnik el; a történet végigjátszható marad. Az alternatív szövegek és a képméretek központi helye a `js/illustrations.js`.

A bibliai reflexió, a közös tanítás és a személyes összegzés továbbra is szövegközpontú. A tananyag, a hangok párbeszédei és a döntési mechanizmus nem változott.
