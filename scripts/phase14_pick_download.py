#!/usr/bin/env python3
# ─── فاز ۱۴ / کار ۵ — گزینش و دانلود محلی عکس‌های آرشیوی عملیات‌ها + پرتره رهبران ───
# ورودی: scripts/imgsearch/{ld-*,op-*}.json  |  خروجی: public/images/ops/<slug>/N.jpg + manifest
# قاعده: حذف نتایج آبستنه/استوک/تبلیغاتی؛ ذخیره کپشن و منبع هر تصویر برای شناسنامه رسانه
import json, os, re, subprocess, sys

BASE = 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt'
OPS = {
    'op-fathmobin': ('fath-ol-mobin', 'عملیات فتح‌المبین'),
    'op-baytalmoghaddas': ('bayt-almoghaddas', 'عملیات بیت‌المقدس و آزادسازی خرمشهر'),
    'op-ramadan': ('ramadan-61', 'عملیات رمضان'),
    'op-kheibar': ('kheibar', 'عملیات خیبر'),
    'op-badr': ('badr-63', 'عملیات بدر'),
    'op-valfajr8': ('valfajr-8', 'عملیات والفجر ۸ و آزادسازی فاو'),
    'op-karbala4': ('karbala-4', 'عملیات کربلای ۴'),
    'op-karbala5': ('karbala-5', 'عملیات کربلای ۵'),
    'op-mersad': ('mersad', 'عملیات مرصاد'),
    'op-martyrs': ('__martyrs__', 'چهره‌های شهدای دفاع مقدس'),
}
BAD = re.compile(r'shutterstock|getty|alamy|dreamstime|123rf|sign up|watermark|stock photo|advertisement|advert|logo|poster for sale|contributor', re.I)

def load(slug):
    try:
        d = json.load(open(f'scripts/imgsearch/{slug}.json'))
        items = d if isinstance(d, list) else d.get('results') or d.get('data') or []
        return items
    except Exception:
        return []

def px(v):
    try: return int(str(v).replace('px', ''))
    except Exception: return 0

def download(url, out):
    subprocess.run(['curl', '-s', '-L', '-o', out, '--max-time', '40', url], check=False)
    return os.path.exists(out) and os.path.getsize(out) > 8000

manifest = {}
for slug, (opid, fa) in OPS.items():
    items = load(slug)
    good = []
    for it in items:
        cap = (it.get('caption') or '').strip()
        src = (it.get('source') or '').strip()
        if BAD.search(cap) or BAD.search(src):
            continue
        w, h = px(it.get('original_width')), px(it.get('original_height'))
        if w and w < 420:
            continue
        good.append(it)
    if slug.startswith('ld-'):
        keep = good[:2]
    else:
        keep = good[:3]
    folder = 'defa' if slug.startswith('ld-') else f'ops/{opid}'
    dest = f'public/images/{folder}'
    os.makedirs(dest, exist_ok=True)
    manifest[slug] = {'opId': opid, 'fa': fa, 'files': []}
    for i, it in enumerate(keep, 1):
        url = it.get('original_url')
        ext = '.jpg'
        out = f'{dest}/{i}{ext}'
        ok = download(url, out)
        manifest[slug]['files'].append({
            'n': i, 'url': url, 'ok': ok, 'size': os.path.getsize(out) if ok else 0,
            'caption': (it.get('caption') or '')[:180], 'source': it.get('source') or '',
            'w': px(it.get('original_width')), 'h': px(it.get('original_height')),
        })
        print(f'[{ "ok " if ok else "FAIL" }] {slug}#{i} — {manifest[slug]["files"][-1]["caption"][:90]} | src={it.get("source") or "?"}')

json.dump(manifest, open('scripts/phase14-photos.json', 'w'), ensure_ascii=False, indent=1)
print('\nmanifest saved: scripts/phase14-photos.json')
