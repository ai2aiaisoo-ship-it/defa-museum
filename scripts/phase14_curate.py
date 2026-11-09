#!/usr/bin/env python3
# ─── فاز ۱۴ / کار ۵ — کیوریت نهایی عکس‌های عملیات + برش پرتره‌های رهبران ───
import json, os, subprocess, shutil
from PIL import Image

BASE = 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt'
OPS = 'public/images/ops'

def dl(hash_or_url, out):
    url = hash_or_url if hash_or_url.startswith('http') else f'{BASE}/{hash_or_url}'
    subprocess.run(['curl', '-s', '-L', '-o', out, '--max-time', '60', url], check=False)
    return os.path.exists(out) and os.path.getsize(out) > 5000

def items(slug):
    d = json.load(open(f'scripts/imgsearch/{slug}.json'))
    return d if isinstance(d, list) else d.get('results') or d.get('data') or []

# ─── ۱) حذف ردشده‌ها (سینمایی/اشتباه موضوعی/اسکرین‌شات شبکه‌های اجتماعی/کلاژ) ───
rejects = ['ops/ramadan-61/3.jpg', 'ops/kheibar/1.jpg', 'ops/badr-63/2.jpg', 'ops/badr-63/3.jpg',
           'ops/karbala-4/1.jpg', 'ops/karbala-5/3.jpg', 'ops/mersad/1.jpg']
for r in rejects:
    p = os.path.join(OPS, r.replace('ops/', ''))
    if os.path.exists(p): os.remove(p); print('reject', r)

# انتقال عکس کلی شهدا به پوشه درست
if os.path.isdir(f'{OPS}/__martyrs__'):
    shutil.rmtree(f'{OPS}/martyrs-general', ignore_errors=True)
    os.rename(f'{OPS}/__martyrs__', f'{OPS}/martyrs-general')
    for f in os.listdir(f'{OPS}/martyrs-general'): print('martyrs-general/', f)

# ─── ۲) دریافت افزودنی‌ها (نتیجه‌های آرشیوی با نشان‌آب مطبوعاتی = سند اصالت) ───
extra = [
    ('fath-ol-mobin', 1, items('op-fathmobin')[0]),        # رزمندگان مقابل پرچم — ایرنا
    ('bayt-almoghaddas', 1, items('op-baytalmoghaddas')[2]),  # اهلاه‌های پیروزی — ایرنا
    ('bayt-almoghaddas', 2, items('op-baytalmoghaddas')[3]),  # دیوار خوش‌نویسی — نوید شاهد
    ('bayt-almoghaddas', 3, items('op-baytalmoghaddas')[4]),  # ویرانه‌ها و پرچم — میزان
    ('valfajr-8', 2, items('op-valfajr8')[0]),             # رزمندگان با پرتره‌ها در دود — ایرنا
    ('valfajr-8', 3, items('op-valfajr8')[1]),             # برافراشتن پرچم روی خاکریز — ایرنا
]
for opid, n, it in extra:
    out = f'{OPS}/{opid}/{n}.jpg'
    os.makedirs(os.path.dirname(out), exist_ok=True)
    ok = dl(it['original_url'], out)
    print('extra', opid, n, 'ok' if ok else 'FAIL', it['original_url'][-20:])

# ─── ۳) شماره‌گذاری مجدد پوشه‌ها ───
final = {}
for opid in sorted(os.listdir(OPS)):
    d = f'{OPS}/{opid}'
    if not os.path.isdir(d): continue
    files = sorted([f for f in os.listdir(d) if f[0].isdigit()], key=lambda f: int(f.split('.')[0]))
    keep = [f for f in files if os.path.getsize(f'{d}/{f}') > 5000]
    for i, f in enumerate(keep, 1):
        if f != f'{i}.jpg':
            os.rename(f'{d}/{f}', f'{d}/{i}.jpg')
    for f in os.listdir(d):
        if not f[0].isdigit(): os.remove(f'{d}/{f}')
    final[opid] = [f'{i}.jpg' for i in range(1, len(keep) + 1)]
    print(opid, '→', final[opid])

# ─── ۴) برش پرتره‌های رهبران (صورت‌محور) ───
# امام خمینی — پرتره تذهیب 5600×8000؛ صورت در یک‌سوم بالایی، خوش‌نویسی پایین حذف می‌شود
im = Image.open('/tmp/leaders/khomeini2-6.jpg')
w, h = im.size
box = (int(w*0.10), int(h*0.035), int(w*0.90), int(h*0.585))
im.crop(box).resize((760, int((box[3]-box[1]) * 760 / (box[2]-box[0]))), Image.LANCZOS).convert('RGB').save('public/images/defa/khomeini-portrait.jpg', quality=90)
print('khomeini-portrait saved')

# رهبری — عکس رسمی 1200×800؛ صورت در سمت راست کادر
im = Image.open('/tmp/leaders/khamenei2-1.jpg')
w, h = im.size
cw = 640
cx, cy = int(w*0.66), int(h*0.46)
box = (max(0, cx-cw//2), max(0, cy-cw//2), min(w, cx+cw//2), min(h, cy+cw//2))
im.crop(box).resize((760, 760), Image.LANCZOS).convert('RGB').save('public/images/defa/khamenei-portrait.jpg', quality=90)
print('khamenei-portrait saved')

# ─── ۵) مانیفست نهایی برای شناسنامه رسانه ───
META = {
 'fath-ol-mobin': [
   ('رزمندگان فتح‌المبین در جشن پیروزی با پرچم ایران — بامزه کرمانشاه', 'ایرنا (خبرگزاری جمهوری اسلامی)', 'B'),
   ('پشتیبانی و آماده‌سازی رزمندگان پیش از عملیات فتح‌المبین', 'خبرگزاری دفاع مقدس (دفاپرس)', 'B'),
   ('رزمندگان پیش از آفند فتح‌المبین در کنار پرچم ایران', 'ایرنا (آرشیو مطبوعاتی)', 'B'),
 ],
 'bayt-almoghaddas': [
   ('رزمندگان آزادی‌ساز خرمشهر با نشان پیروزی', 'ایرنا (آرشیو مطبوعاتی)', 'B'),
   ('رزمندگان در آستانه عملیات بیت‌المقدس مقابل دیوار خوش‌نویسی‌شده', 'نوید شاهد (بنیاد حفظ آثار)', 'B'),
   ('مردم در ویرانه‌های خرمشهر آزادشده با پرچم ایران', 'خبرگزاری میزان (بازنشر آرشیو ایرنا)', 'B'),
 ],
 'ramadan-61': [
   ('غواصان و نیروهای تهاجم دریایی عملیات رمضان', 'ایمنا (مؤسسه مطالعات و پژوهش‌های خبری)', 'B'),
   ('صفحه اول روزنامه اطلاعات در روزگار عملیات رمضان — سند مطبوعاتی', 'روزنامه اطلاعات (بازنشر خبرگزاری دفاع مقدس)', 'C'),
 ],
 'kheibar': [
   ('عبور رزمندگان با قایق از هور الهویزه در عملیات خیبر', 'همشهری آنلاین (آرشیو جنگ)', 'B'),
   ('قایق‌رانی رزمندگان در هور — عملیات خیبر', 'اندیشه ناب', 'C'),
 ],
 'badr-63': [
   ('حرکت رزمندگان روی پل شناور در هورالدلمج — عملیات بدر', 'ایمنا (مؤسسه مطالعات و پژوهش‌های خبری)', 'B'),
 ],
 'valfajr-8': [
   ('رزمندگان در جشن آزادسازی فاو در گل‌وگل جبهه', 'همشهری آنلاین (آرشیو جنگ)', 'B'),
   ('رزمندگان والفجر ۸ با پرتره‌های شهدا در دود نبرد', 'ایرنا (آرشیو مطبوعاتی)', 'B'),
   ('برافراشتن پرچم ایران روی خاکریز فاو', 'ایرنا (آرشیو مطبوعاتی)', 'B'),
 ],
 'karbala-4': [
   ('گروه رزمندگان پیش از عملیات کربلای ۴ در جوار نخلستان‌های جنوب', 'گردان حضرت علی‌اکبر (آرشیو محلی)', 'C'),
   ('رزمندگان کربلای ۴ کنار خودرو پشتیبانی در منطقه عملیاتی', 'بوشهرپورت (آرشیو محلی)', 'C'),
 ],
 'karbala-5': [
   ('رزمندگان کربلای ۵ کنار قایق‌ها و جعبه‌های مهمات در ساحل نصار', 'خبرگزاری دفاع مقدس (دفاپرس)', 'B'),
   ('تجهیز رزمندگان در عملیات کربلای ۵ — تصویر آرشیو خبری', 'رادیو فردا (آرشیو خبری)', 'C'),
 ],
 'mersad': [
   ('نیروهای عملیاتی مرصاد در بالگرد در مسیر منطقه غرب', 'هم‌نوا (آژانس خبری)', 'C'),
   ('رزمندگان مرصاد پس از پیروزی در منطقه عملیاتی غرب', 'همشهری آنلاین (آرشیو جنگ)', 'B'),
 ],
 'martyrs-general': [
   ('گفت‌وگوی خبرنگار با رزمنده سربندبسته در جبهه — چهره‌های جنگ', 'خبرگزاری دفاع مقدس (دفاپرس)', 'B'),
 ],
}
out = {}
for opid, files in final.items():
    meta = META.get(opid, [])
    out[opid] = []
    for i, f in enumerate(files):
        m = meta[i] if i < len(meta) else ('تصویر آرشیوی مرتبط', 'منبع وب (در انتظار هویت‌سنجی)', 'C')
        out[opid].append({'file': f, 'title': m[0], 'sourceName': m[1], 'confidence': m[2]})
json.dump(out, open('scripts/phase14-photos-final.json', 'w'), ensure_ascii=False, indent=1)
print('final manifest saved')

# ─── ۶) ورق تماس برای بازبینی بصری همه تصاویر نهایی ───
from PIL import ImageDraw
cell, pad = 210, 26
rows = []
for opid, files in final.items():
    for f in files:
        rows.append((opid, f))
cols = 5
W = cols * cell
H = (len(rows) + cols - 1) // cols * (cell + pad) + pad
sheet = Image.new('RGB', (W, H), (22, 22, 22))
dr = ImageDraw.Draw(sheet)
for idx, (opid, f) in enumerate(rows):
    im = Image.open(f'{OPS}/{opid}/{f}').convert('RGB')
    im.thumbnail((cell - 8, cell - 26))
    x, y = (idx % cols) * cell, (idx // cols) * (cell + pad) + pad
    sheet.paste(im, (x + 4, y + 22))
    dr.text((x + 4, y + 4), f'{opid}/{f}', fill=(120, 230, 160))
sheet.save('/tmp/ops_sheet.jpg', quality=82)
print('contact sheet:', len(rows), 'photos')
