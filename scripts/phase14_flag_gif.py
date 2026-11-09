#!/usr/bin/env python3
# ─── فاز ۱۴ / کار ۴ — تولید گیف پرچم موج‌دار ایران از PNG یک‌پارچه پرچم ───
# ورودی: /tmp/flag-flat.png (رندر sharp از flag-iran.svg — نشان الله یک‌پارچه)
# خروجی: public/images/flag-wave.gif — ۲۶ فریم موج پارچه با سایه‌روشن چین‌ها، حلقه بی‌پایان
import numpy as np
from PIL import Image

SRC = '/tmp/flag-flat.png'
OUT = 'public/images/flag-wave.gif'
N = 26

flat = Image.open(SRC).convert('RGB')
W, H = flat.size
base = np.asarray(flat).astype(np.float32)
X, Y = np.meshgrid(np.arange(W, dtype=np.float32), np.arange(H, dtype=np.float32))
u = X / (W - 1)  # ۰=سمت میله (ثابت) … ۱=سمت آزاد پارچه

frames = []
for t in range(N):
    ph = 2 * np.pi * t / N
    # جابه‌جایی افقی (فشرده‌شدن پارچه) + عمودی (موج) — دامنه با فاصله از میله بیشتر می‌شود
    k1, k2 = 1.15, 2.3
    xs = X - 14.0 * u * np.sin(2 * np.pi * k1 * u - ph) - 5.0 * u * np.sin(2 * np.pi * k2 * u - 1.6 * ph)
    ys = Y + 11.0 * u * np.sin(2 * np.pi * k1 * u - ph) + 4.5 * u * np.sin(2 * np.pi * k2 * u - 1.6 * ph)
    xs = np.clip(xs, 0, W - 1.001)
    ys = np.clip(ys, 0, H - 1.001)
    x0 = np.floor(xs).astype(int); y0 = np.floor(ys).astype(int)
    x1 = np.minimum(x0 + 1, W - 1); y1 = np.minimum(y0 + 1, H - 1)
    fx = (xs - x0)[:, :, None]; fy = (ys - y0)[:, :, None]
    f = (base[y0, x0] * (1 - fx) * (1 - fy) + base[y0, x1] * fx * (1 - fy) +
         base[y1, x0] * (1 - fx) * fy + base[y1, x1] * fx * fy)
    # سایه‌روشن چین‌ها بر اساس شیب موج
    shade = 1.0 + 0.13 * u * np.cos(2 * np.pi * k1 * u - ph) + 0.05 * u * np.cos(2 * np.pi * k2 * u - 1.6 * ph)
    f = np.clip(f * shade[:, :, None], 0, 255).astype(np.uint8)
    fr = Image.fromarray(f).convert('P', palette=Image.ADAPTIVE, colors=192)
    frames.append(fr)

frames[0].save(OUT, save_all=True, append_images=frames[1:], duration=110, loop=0, optimize=True)
print('saved', OUT, 'frames:', len(frames), f'size: {W}x{H}')
