# ANegyHang – jóváhagyott illusztrációs javítások archívuma

Állapot: a felhasználó a hat bemutatott javítást elfogadta; ezek a **v0.2.1** kiadásba beépültek. Ez a mappa a jóváhagyás és a javítások forrásarchívuma. Kiinduló alkalmazás: **v0.2.0**, commit `35f926b`. A közzététel eredményét ez az archívum nem igazolja.

A korábban mentett hero-képjelölt és annak eredeti generált PNG-je megmaradt, egyik sem készült újra. Öt további jelölt készült el a hibajegyzék alapján.

| Kép | Állapot és javítás |
| --- | --- |
| [hero-four-paths.png](hero-four-paths.png) | A korábban elkészült jelölt változtatás nélkül megőrizve és újra bemutatva. |
| [wallet-scene-opening.png](wallet-scene-opening.png) | Jobban felismerhető, a megálló felé közeledő busz; a helyszín és a pénztárca megőrizve. |
| [wallet-scene-voices.png](wallet-scene-voices.png) | Ugyanaz a busz a közös, visszafogottabb háttéren. A korábbi változat látható úttestéről hiányzott, ezért volt indokolt a célzott korrekció. |
| [wallet-ending-return-full.png](wallet-ending-return-full.png) | Fiatalos diákkezet ábrázoló átadás felismerhető rendőrségi recepción, természetes méretű teljes pénztárcával. |
| `wallet-ending-keep-money.png` | Elfogadott B kép: nincs új jelölt, az eredeti és a webes fájlok változatlanok. |
| [wallet-ending-return-documents.png](wallet-ending-return-documents.png) | Az A-val egyező rendőrségi helyszínen a kissé nyitott pénztárcát adják át, benne az igazolvánnyal és két bankkártyával. Nincs külön átadott kártyacsomag. |
| [wallet-ending-walk-away.png](wallet-ending-walk-away.png) | A pénztárca kisebb, a kézhez, cipőhöz és járdakőhöz arányos, hétköznapi méretű. |

## Mentés és jóváhagyás

A fenti hat jóváhagyott PNG pontosan 1280 × 720 képpont (16:9). Mindegyik fájl visszaolvasása és PNG-ellenőrzése sikeres. A [mentési és jóváhagyási jegyzék](manifest.json) rögzíti a SHA-256 ellenőrzőösszegeket és a kiinduló commitot. A generált eredetik az itteni `sources/` mappában maradnak; az öt új kép mellett külön JSON őrzi a referenciákat és a javítási leírást.

A `v0.2.1` az itt őrzött hat jóváhagyott PNG-t használja webes PNG-ként, és ezekből készülnek a WebP-változatok. Az aktív generált eredetik a szülőmappa `sources/` könyvtárában találhatók, beleértve a javított `wallet-scene-opening.png` fájlt. A korábbi aktív források a Git-előzményből érhetők el. Az elfogadott B kép minden változata és az eredeti `../wallet-opening-sample.png` stílusminta byte szerint változatlan marad.

A jelöltek előkészítésekor képi ellenőrzés és fájlintegritás-vizsgálat történt; a játék automatizált tesztjei akkor nem futottak újra. A beépítés utáni automatizált ellenőrzések eredményét a `manifest.json` ellenőrzési része rögzíti. A közzététel állapotát a GitHub Pages kiadási folyamata igazolja.
