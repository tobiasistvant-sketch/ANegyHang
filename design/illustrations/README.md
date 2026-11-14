# A Négy hang – illusztrációk, v0.2.0

A jóváhagyott `wallet-opening-sample.png` határozza meg a jelenetcsomag festett stílusát. A nyitójelenet közvetlenül ebből készült; a hat új kép ugyanennek a grafikai világnak a folytatása. Mind a hét illusztráció be van építve a játékba.

| Webes PNG | Képernyő | Megőrzött eredeti |
| --- | --- | --- |
| [hero-four-paths.png](../../assets/illustrations/hero-four-paths.png) | Általános kezdőoldal, négyfelé ágazó út | [Forrás](sources/hero-four-paths.png) |
| [wallet-scene-opening.png](../../assets/illustrations/wallet-scene-opening.png) | Történetbemutató és első döntés | [Jóváhagyott nyitókép](wallet-opening-sample.png) |
| [wallet-scene-voices.png](../../assets/illustrations/wallet-scene-voices.png) | A négy hang közös, visszafogott háttere | [Forrás](sources/wallet-scene-voices.png) |
| [wallet-ending-return-full.png](../../assets/illustrations/wallet-ending-return-full.png) | A: a teljes pénztárca átadása | [Forrás](sources/wallet-ending-return-full.png) |
| [wallet-ending-keep-money.png](../../assets/illustrations/wallet-ending-keep-money.png) | B: hirdetés és az új fejhallgató | [Forrás](sources/wallet-ending-keep-money.png) |
| [wallet-ending-return-documents.png](../../assets/illustrations/wallet-ending-return-documents.png) | C: az igazolvány és két bankkártya átadása | [Forrás](sources/wallet-ending-return-documents.png) |
| [wallet-ending-walk-away.png](../../assets/illustrations/wallet-ending-walk-away.png) | D: visszanézés a lehajoló járókelőre | [Forrás](sources/wallet-ending-walk-away.png) |

## Grafikai folytonosság

A képek stilizált, digitálisan festett jelenetek, finom textúrákkal, meleg természetes fénnyel, sötétkék, türkiz, barna és törtfehér árnyalatokkal. A buszmegállós képek ugyanazt a helyszínt és barna bőrpénztárcát követik. Az A és C ügyintézési jelenete ugyanazt a pultot használja. A főszereplő nézőpontja első személyű, arca és személyazonossága nem jelenik meg.

Nincs felirat, logó vagy erkölcsi minősítés a képeken. A négy út nem feleltethető meg automatikusan a négy hangnak. A B hirdetés szövege, köztük a gyógyszerekre félretett pénz említése, külön HTML-ben marad. A C képen nincs olvasható személyes vagy banki adat. A D jelenet nem dönti el, mit tesz majd a járókelő.

## Források és webes változatok

Az eredeti PNG-k változatlanul megmaradnak a fenti útvonalakon. A [generálási leírások](sources/provenance.json) rögzítik a referenciaképeket és a hat új képhez használt leírást. A képeket az `image_gen` eszköz készítette.

A játék az `assets/illustrations/` mappából tölt, külső képszolgáltatás nélkül. Minden jelenethez 1280 × 720 képpontos, pontosan 16:9 arányú PNG és 85-ös minőségbeállítású WebP tartozik. Az eredeti képekből csak méret-, képarány- és formátumoptimalizálással készültek a webes változatok.

Újra-előállítás ImageMagick 7-tel a repository gyökeréből:

```sh
bash scripts/prepare-illustrations.sh
```

Ez fejlesztői művelet; a statikus játék használatához nem szükséges ImageMagick vagy fordítás. A WebP betöltési hibája helyi PNG-re váltást indít. Ha egyik változat sem elérhető, csak a képkeret tűnik el; a történet végigjátszható marad. Az alternatív szövegek és a képméretek központi helye a `js/illustrations.js`.

A bibliai reflexió, a közös tanítás és a személyes összegzés továbbra is szövegközpontú. A tananyag, a hangok párbeszédei és a döntési mechanizmus nem változott.
