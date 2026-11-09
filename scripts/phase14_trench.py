#!/usr/bin/env python3
# ─── فاز ۱۴ / کار ۳ — پردازش عکس سنگر آپلودی کارفرما ───
# ورودی: upload/…سنگر-PNG-4.jpg  (گونی‌شن + آسمان گرادیانی + نشان‌آب FARSGRAPHIC)
# خروجی:
#   public/images/defa/sandbag-arc.png   — قوس خاکریز با پس‌زمینه شفاف (ادغام با زمینه)
#   public/images/defa/sandbag-strip.png — نوار قابل‌تکرار افقی برای نوار خاکریز
# مراحل: برش نشان‌آب → سگمنتاژ آسمان (فلود-فیل از بالا با آستانه روشنایی/اشباع) →
#         فدر لبه‌ها → آلفای محو پایین برای ادغام کامل با زمینه → نوار تکرارشونده آینه‌ای
import numpy as np
from PIL import Image, ImageFilter

SRC = 'upload/دانلود-رایگان-مجموعه-تصاویر-سنگر-PNG-4.jpg'
OUT_ARC = 'public/images/defa/sandbag-arc.png'
OUT_STRIP = 'public/images/defa/sandbag-strip.png'

im = Image.open(SRC).convert('RGB')
W, H = im.size
a = np.asarray(im).astype(np.float32) / 255.0

# ─── گام ۱: یافتن و برش نوار نشان‌آب پایین (ردیف‌های عمدتاً سفید از پایین) ───
rowwhite = (a.min(axis=2) > 0.80).mean(axis=1)
cut = H - 1
while cut > int(H * 0.6) and rowwhite[cut] > 0.30:
    cut -= 1
cut = min(cut + 2, H - 1)
print(f'watermark band removed: rows {cut+1}..{H} (kept 0..{cut})')

# ─── گام ۲: برش حاشیه برای حذف گوشه‌های گرد سفید ───
mx, my = int(W * 0.015), int(H * 0.012)
im2 = im.crop((mx, my, W - mx, cut))
a = np.asarray(im2).astype(np.float32) / 255.0
W2, H2 = im2.size

# ─── گام ۳: ماسک «آسمان‌گونه» (روشن و کم‌اشباع) + فلود-فیل از لبه بالا ───
V = a.max(axis=2)
S = np.where(V > 0, (V - a.min(axis=2)) / np.maximum(V, 1e-6), 0)
skylike = (V > 0.66) & (S < 0.46)

mask = np.zeros((H2, W2), dtype=bool)
mask[0, :] = skylike[0, :]
mask[-1, :] = skylike[-1, :]  # پایین نوار برش‌خورده (زیر نشان‌آب) سفید است
mask[:, 0] = skylike[:, 0]
mask[:, -1] = skylike[:, -1]

# گسترش فلود-فیل: دیلاتیشن محدود به پیکسل‌های آسمان‌گونه (حداکثر ~H2 گام)
for _ in range(H2 + 10):
    grown = mask.copy()
    grown[1:, :] |= mask[:-1, :]
    grown[:-1, :] |= mask[1:, :]
    grown[:, 1:] |= mask[:, :-1]
    grown[:, :-1] |= mask[:, 1:]
    grown &= skylike
    if (grown == mask).all():
        break
    mask = grown
print('sky mask coverage:', round(float(mask.mean()) * 100, 1), '%')

alpha = np.where(mask, 0.0, 1.0).astype(np.float32)

# ─── گام ۴: پاکسازی حبابیِ کوچک (نویز آلفا) ───
am = Image.fromarray((alpha * 255).astype(np.uint8))
am = am.filter(ImageFilter.MedianFilter(5))
alpha = np.asarray(am).astype(np.float32) / 255.0

# ─── گام ۵: فدر لبه (بلور آلفا) برای ادغام نرم با زمینه ───
am = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.6))
alpha = np.asarray(am).astype(np.float32) / 255.0

# ─── گام ۶: آلفای محو در لبه پایین — خاک سرخ در زمینه فرو می‌رود ───
rows = np.arange(H2, dtype=np.float32)
cov = alpha.mean(axis=1)  # پوشش هر ردیف برای یافتن بدنه خاکریز
body = np.where(cov > 0.25)[0]
top_wall = int(body[0]) if len(body) else int(H2 * 0.5)
fade_from = top_wall + int((H2 - top_wall) * 0.55)
fade = np.clip((H2 - rows) / max(H2 - fade_from, 1), 0, 1) ** 1.25
fade[rows < fade_from] = 1.0
alpha *= fade[:, None]
print(f'wall top row: {top_wall}, fade starts at {fade_from} of {H2}')

# ─── خروجی ۱: قوس خاکریز شفاف ───
out = np.dstack([(a * 255).astype(np.uint8), (alpha * 255).astype(np.uint8)])
arc = Image.fromarray(out, 'RGBA')
arc.save(OUT_ARC)
print('saved', OUT_ARC, arc.size)

# ─── خروجی ۲: نوار تکرارشونده — برش بدنه دیوار + تکرار آینه‌ای بدون درز ───
band_h = min(int((H2 - top_wall) * 0.62), H2 - top_wall - 4)
band = out[top_wall:top_wall + band_h]
strip = np.concatenate([band, band[:, ::-1]], axis=1)
Image.fromarray(strip, 'RGBA').save(OUT_STRIP)
print('saved', OUT_STRIP, (strip.shape[1], strip.shape[0]))
