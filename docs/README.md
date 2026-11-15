# Jóváhagyott szövegkönyvek

- [A megtalált pénztárca](ANegyHang_9_kepernyos_lektoralt_szovegkonyv.docx): az első történet lektorált szövegkönyve.
- [Az igazságtalan tanár](ANegyHang_2_tortenet_jovahagyott_forgatokonyv.docx): a második történet jóváhagyott forgatókönyve.

Mindkét Word-fájl eredeti, változatlan forrás. A történetek, választások, hangok, részletes befejezések és bibliai magyarázatok ezekből származnak. A szerkesztői megjegyzések fejlesztési utasítások, nem kerülnek a diákok elé.

Az első dokumentum kilencképernyős címét és tartalmát nem írtuk át. A `v0.3.1` külön jóváhagyott szerkezeti döntése felülírja a korábbi 6. és 9. képernyő használatát: a befolyásoló kérdés kimarad, a személyes reflexió pedig a későbbi, hat történet utáni közös lezáráshoz marad fenn. A `v0.4.0` mindkét történetet ugyanebben a hét fő képernyőből álló rendszerben jeleníti meg.

A második dokumentum szövegéhez képest két kifejezetten jóváhagyott javítás szerepel az alkalmazásban:

1. Az A válasz mindkét döntési képernyőn a „nézze át újra a dolgozatomat” változatot használja.
2. A B bibliai magyarázatában az „A kilencedik parancsolatról szóló tanítás, a másik ember…” mondatból kikerült a fölösleges vessző.

A `scripts/read-approved-script.py` közvetlenül a DOCX-ek OOXML-bekezdéseit olvassa. A `tests/script-fidelity.test.js` és `tests/teacher-script-fidelity.test.js` a forrásokhoz ellenőrzi a teljes tananyagot, a fenti jóváhagyott eltérések figyelembevételével.
