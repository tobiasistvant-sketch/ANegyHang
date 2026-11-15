#!/usr/bin/env python3
"""Read the approved manuscript without third-party DOCX dependencies.

Paragraph numbers are one-based OOXML paragraph positions, including any empty
paragraphs. Editorial paragraphs are returned for auditing, never for rendering.
The approved file has no tables, text boxes, tracked revisions or note text;
fail rather than silently omitting any of those if the manuscript changes.
"""

import hashlib
import json
from pathlib import Path
import sys
from zipfile import ZipFile
import xml.etree.ElementTree as ET

NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
W = "{" + NS["w"] + "}"


def read_script(path):
    path = Path(path)
    with ZipFile(path) as archive:
        document = ET.fromstring(archive.read("word/document.xml"))
        for feature in ("tbl", "txbxContent", "ins", "del"):
            if document.find(".//w:" + feature, NS) is not None:
                raise ValueError("A szövegkönyv külön ellenőrzést igénylő elemet tartalmaz: " + feature)
        for filename in ("word/footnotes.xml", "word/endnotes.xml", "word/comments.xml"):
            if filename in archive.namelist():
                extra = ET.fromstring(archive.read(filename))
                if any((node.text or "").strip() for node in extra.findall(".//w:t", NS)):
                    raise ValueError("A szövegkönyv külön ellenőrzendő megjegyzésszöveget tartalmaz: " + filename)
        paragraphs = {}
        for number, paragraph in enumerate(document.findall(".//w:p", NS), 1):
            parts = []
            for node in paragraph.iter():
                if node.tag == W + "t":
                    parts.append(node.text or "")
                elif node.tag == W + "tab":
                    parts.append("\t")
                elif node.tag == W + "br":
                    parts.append("\n")
            paragraphs[str(number)] = "".join(parts).strip()
    return {"sha256": hashlib.sha256(path.read_bytes()).hexdigest(), "paragraphs": paragraphs}


if __name__ == "__main__":
    default = Path(__file__).resolve().parents[1] / "docs/ANegyHang_9_kepernyos_lektoralt_szovegkonyv.docx"
    print(json.dumps(read_script(sys.argv[1] if len(sys.argv) > 1 else default), ensure_ascii=False))
