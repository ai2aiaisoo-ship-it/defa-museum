#!/usr/bin/env python3
# ─── فهرست پرونده‌های آرامگاه + دانلود تصاویر مزار و ساخت شیت‌های بازبینی کارشناسی ───
import re, os, json, urllib.request, concurrent.futures

BASE = '/home/z/my-project'
src = open(f'{BASE}/src/data/martyr-memories.ts', encoding='utf-8').read()
IMG = 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt'

blocks = re.findall(r"\{\s*martyrId: '([^']+)'[\s\S]*?(?=\n  \{|\n\])", src)
rows = []
for b in re.split(r"(?=\n  \{\n    martyrId)", src)[1:]:
    mm = re.search(r"martyrId: '([^']+)'", b)
    if not mm:
        continue
    mid = mm.group(1)
    cem = re.search(r"cemetery: '([^']+)'", b)
    city = re.search(r"city: '([^']+)'", b)
    det = re.search(r"detail: '([^']+)'", b)
    ph = re.search(r"IMG\}/([^`']+)", b)
    cap = re.search(r"caption: '([^']+)'", b)
    rows.append({
        'id': mid,
        'cemetery': cem.group(1) if cem else '',
        'city': city.group(1) if city else '',
        'detail': (det.group(1)[:60] if det else ''),
        'photo': ph.group(1) if ph else '',
        'caption': (cap.group(1)[:80] if cap else ''),
    })
for r in rows:
    print(f"{r['id']:<14} | {r['cemetery']:<30} | {r['city']:<20} | {r['detail']:<50} | {r['photo']}")
print(f"total burials: {len(rows)}, with photo: {sum(1 for r in rows if r['photo'])}")

json.dump(rows, open(f'{BASE}/scripts/burials_index.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

# ── دانلود تصاویر ──
os.makedirs('/tmp/review', exist_ok=True)
urls = [r for r in rows if r['photo']]

def dl(r):
    dst = f"/tmp/review/{r['id']}__{r['photo']}"
    if os.path.exists(dst) and os.path.getsize(dst) > 5000:
        return r['id'], 'cached'
    try:
        req = urllib.request.Request(f"{IMG}/{r['photo']}", headers={'User-Agent': 'Mozilla/5.0'})
        data = urllib.request.urlopen(req, timeout=30).read()
        open(dst, 'wb').write(data)
        return r['id'], f"{len(data)//1024}KB"
    except Exception as e:
        return r['id'], f'ERR {e}'

with concurrent.futures.ThreadPoolExecutor(8) as ex:
    for mid, st in ex.map(dl, urls):
        print(f"downloaded {mid}: {st}")
