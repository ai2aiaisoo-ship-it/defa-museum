#!/usr/bin/env python3
# ─── ممیزی کارشناسی تصاویر مزار: تطبیق هر عکس استفاده‌شده در app با کپشن واقعی نتیجه جست‌وجو ───
import json, glob, re, os

BASE = '/home/z/my-project'

# ۱) نقشه‌ی هش تصویر ← کپشن/منبع از همه mz-*.json
cap = {}
for f in glob.glob(f'{BASE}/scripts/imgsearch/mz-*.json'):
    try:
        d = json.load(open(f))
        for it in d.get('results', []):
            u = it.get('original_url', '')
            h = u.rsplit('/', 1)[-1]
            cap[h] = {'file': os.path.basename(f), 'caption': it.get('caption', ''), 'source': it.get('source', '')}
    except Exception as e:
        print('ERR', f, e)

# ۲) عکس‌های استفاده‌شده در martyr-memories.ts
src = open(f'{BASE}/src/data/martyr-memories.ts', encoding='utf-8').read()
used = re.findall(r"martyrId: '([^']+)'[\s\S]*?photo: \{ url: `\$\{IMG\}/([^`]+)`", src)

print(f"{'martyrId':<14} {'hash':<20} result-file      caption (first 170 chars)")
print('-' * 160)
for mid, h in used:
    info = cap.get(h)
    if info:
        print(f"{mid:<14} {h:<20} {info['file']:<16} {info['caption'][:170]}")
    else:
        print(f"{mid:<14} {h:<20} {'*** NOT FOUND IN SEARCH RESULTS ***':<16}")
print()
# ۳) هش‌های تکراری (یک عکس برای چند شهید)
from collections import Counter
c = Counter(h for _, h in used)
print('Duplicated photo hashes:', {k: v for k, v in c.items() if v > 1})
