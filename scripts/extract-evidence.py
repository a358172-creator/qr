#!/usr/bin/env python3
"""Extract the supplied DOCX artwork and literal captions, without digitising data.

Only EMF drawing coordinates are exported for an accessible selection overlay.
They are never converted to means, SEM, concentrations or p-values.
"""
from pathlib import Path
from zipfile import ZipFile
from xml.etree import ElementTree as ET
import hashlib
import json
import struct
import argparse
import os
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'assets/graficas.docx'
DESTINATION = ROOT / 'public/evidence'
NS = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
EXPOSURES = ['control', 'feso4', 'quin', '3np']
ASSAYS = [('dcfda', ['PN3', 'PN5', 'PN9', 'PN12', 'PN30']),
          ('tbars', ['PN3', 'PN5', 'PN9', 'PN12', 'PN30']),
          ('mtt', ['PN5', 'PN9', 'PN12', 'PN30'])]


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def inspect_emf(data, ages):
    left, top, right, bottom = struct.unpack_from('<4i', data, 8)
    width, height = right - left + 1, bottom - top + 1
    texts, rectangles, offset = [], [], 0
    while offset + 8 <= len(data):
        record, size = struct.unpack_from('<2I', data, offset)
        if size < 8 or offset + size > len(data):
            raise ValueError('Invalid EMF record length')
        if record == 84:  # EMR_EXTTEXTOUTW: the literal text embedded in Word.
            x, y = struct.unpack_from('<2i', data, offset + 36)
            count, string_offset = struct.unpack_from('<2I', data, offset + 44)
            text = data[offset + string_offset:offset + string_offset + 2 * count].decode('utf-16-le')
            texts.append({'text': text, 'x': x, 'y': y})
        if record == 86:  # EMR_POLYGON16: the supplied filled bar rectangles.
            x0, y0, x1, y1 = struct.unpack_from('<4i', data, offset + 8)
            # Legend swatches are six drawing units high; bars end at the axis.
            if y1 > height * .8 and y1 - y0 > 12 and x1 - x0 < 30:
                rectangles.append([x0, y0, x1, y1])
        offset += size
    rectangles.sort(key=lambda rect: rect[0])
    if len(rectangles) != len(ages) * len(EXPOSURES):
        raise ValueError('Unexpected number of bar drawing regions; inspect the source')
    regions = {}
    for index, rect in enumerate(rectangles):
        x0, y0, x1, y1 = rect
        age, exposure = ages[index // 4], EXPOSURES[index % 4]
        regions.setdefault(age, {})[exposure] = {
            'x': (x0 - left) / width, 'y': (y0 - top) / height,
            'width': (x1 - x0 + 1) / width, 'height': (y1 - y0 + 1) / height,
        }
    return {'width': width, 'height': height, 'texts': texts, 'regions': regions}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--convert', action='store_true', help='Convert EMFs with the optional local emf2svg cache')
    args = parser.parse_args()
    DESTINATION.mkdir(parents=True, exist_ok=True)
    manifest = {'source': 'assets/graficas.docx', 'sourceSha256': sha256(SOURCE.read_bytes()),
                'numericWorkbookPresent': False, 'meansAndSemAvailable': False, 'figures': []}
    with ZipFile(SOURCE) as package:
        document = ET.fromstring(package.read('word/document.xml'))
        paragraphs = [''.join(text.text or '' for text in paragraph.findall('.//w:t', NS))
                      for paragraph in document.findall('.//w:p', NS)]
        captions = [paragraph for paragraph in paragraphs if paragraph.startswith('Figura ')]
        if len(captions) != 3:
            raise ValueError('Expected the three original figure captions')
        for index, (assay, ages) in enumerate(ASSAYS, start=1):
            member = f'word/media/image{index}.emf'
            data = package.read(member)
            original = f'figure-{index}-{assay}.emf'
            (DESTINATION / original).write_bytes(data)
            manifest['figures'].append({
                'assay': assay, 'figure': index, 'docxMember': member,
                'originalFile': original, 'svgFile': f'figure-{index}-{assay}.svg',
                'sha256': sha256(data), 'caption': captions[index - 1], 'ages': ages,
                **inspect_emf(data, ages),
            })
    if args.convert:
        cache = ROOT / 'node_modules/.cache/neurovista-emf/root'
        converter = cache / 'usr/bin/emf2svg-conv'
        environment = {**os.environ, 'LD_LIBRARY_PATH': str(cache / 'usr/lib/x86_64-linux-gnu')}
        for figure in manifest['figures']:
            output = DESTINATION / figure['svgFile']
            subprocess.run([str(converter), '-i', str(DESTINATION / figure['originalFile']), '-o', str(output)], env=environment, check=True)
            svg = output.read_text(encoding='utf-8')
            # Symbol encodes Greek mu as a private-use glyph. Its Unicode
            # equivalent preserves the printed unit on systems without Symbol.
            svg = re.sub(r'<text\b[^>]*font-family="Symbol"[^>]*>.*?</text>',
                         lambda match: match[0].replace('font-family="Symbol"', 'font-family="Arial, sans-serif"').replace('\uf06d', 'μ'), svg, flags=re.S)
            # An explicit viewport keeps every axis, legend and mark available
            # when the browser scales the original drawing on narrow displays.
            svg = re.sub(r'(<svg\b[^>]* width="([\d.]+)" height="([\d.]+)")',
                         lambda match: match[1] + f' viewBox="0 0 {match[2]} {match[3]}"', svg, count=1)
            output.write_text(svg, encoding='utf-8')
        manifest['conversion'] = {'tool': 'emf2svg 1.1.0', 'normalizations': ['Explicit SVG viewBox', 'Symbol U+F06D to Unicode Greek mu, preserving its position'], 'experimentalValuesReconstructed': False}
    text = json.dumps(manifest, ensure_ascii=False, indent=2) + '\n'
    (DESTINATION / 'provenance.json').write_text(text, encoding='utf-8')
    (DESTINATION / 'original-captions.txt').write_text('\n\n'.join(captions) + '\n', encoding='utf-8')
    # The module contains source metadata only; the authored scientific layer
    # lives separately in data.js and is never overwritten by this script.
    module = ROOT / 'src/evidence/figure-source.js'
    module.parent.mkdir(parents=True, exist_ok=True)
    module.write_text('// Generated by scripts/extract-evidence.py; no reconstructed experimental values.\n'
                      'export const figureSource = ' + text.rstrip() + ';\n', encoding='utf-8')
    print(f'Extracted {len(captions)} unchanged EMFs and literal captions; no numeric values inferred.')


if __name__ == '__main__':
    main()
