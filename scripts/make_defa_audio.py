"""ساخت قطعه صوتی محیطی بی‌کلام به سبک موسیقی متن «خاک سرخ» (دفاع مقدس)
Karplus-Strong plucked strings (سنتور/تار-مانند) + درون‌مایه بم (drone) + ضرب ملایم
خروجی: public/audio/defa-ambient.wav (۱۲۰ ثانیه، مونو، 22050Hz)
"""
import numpy as np
import wave

SR = 22050
DUR = 120.0
N = int(SR * DUR)
rng = np.random.default_rng(1361)

buf = np.zeros(N, dtype=np.float64)

# ─── ۱) درون‌مایه بم: D2 + D3 با مدولاسیون آرام ───
t = np.arange(N) / SR
drone1 = 0.16 * np.sin(2 * np.pi * 73.42 * t) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.05 * t + 1.0))
drone2 = 0.10 * np.sin(2 * np.pi * 146.83 * t + 0.5) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.033 * t))
drone3 = 0.05 * np.sin(2 * np.pi * 110.0 * t) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.07 * t + 2.0))
buf += drone1 + drone2 + drone3

def karplus_strong(freq, dur, decay=0.996, blend=0.5):
    """سنتز زه‌ای با الگوریتم کارپلاس-استرانگ"""
    n = int(SR * dur)
    period = int(SR / freq)
    out = np.zeros(n)
    ring = rng.uniform(-1, 1, period)
    for i in range(n):
        out[i] = ring[i % period]
        ring[i % period] = decay * (0.5 * (ring[i % period] + ring[(i + 1) % period]))
    env = np.exp(-np.linspace(0, 5, n))
    return blend * out * env

def soft_drum(dur=0.5, f0=70.0):
    n = int(SR * dur)
    tt = np.arange(n) / SR
    return 0.5 * np.sin(2 * np.pi * f0 * tt * np.exp(-tt * 2)) * np.exp(-tt * 9)

# ─── ۲) گام شور/بایاتی روی D (مینور هارمونیک ایرانی) ───
SCALE = {  # فرکانس نتها (D4 مبنا)
    'D4': 293.66, 'Eb4': 311.13, 'F4': 349.23, 'G4': 392.00,
    'A4': 440.00, 'Bb4': 466.16, 'C5': 523.25, 'D5': 587.33,
}
# ملودی آهسته و سوزناک (دست‌ساز، ریتم آزاد — حال‌وهوای دفاع مقدس)
MELODY = [
    ('D4', 0.0, 2.2), ('F4', 2.6, 1.6), ('G4', 4.4, 2.0), ('F4', 6.8, 1.2),
    ('Eb4', 8.2, 2.4), ('D4', 11.0, 3.0),
    ('A4', 14.4, 2.0), ('G4', 16.8, 1.4), ('F4', 18.4, 1.8), ('G4', 20.6, 2.2),
    ('F4', 23.2, 1.2), ('Eb4', 24.6, 2.0), ('D4', 27.0, 3.2),
    ('D5', 30.6, 2.4), ('C5', 33.4, 1.4), ('Bb4', 35.0, 2.0), ('A4', 37.4, 2.4),
    ('G4', 40.2, 1.6), ('F4', 42.0, 2.0), ('Eb4', 44.4, 1.6), ('D4', 46.2, 3.6),
    ('F4', 50.2, 2.0), ('A4', 52.6, 1.8), ('Bb4', 54.6, 2.2), ('A4', 57.2, 1.4),
    ('G4', 58.8, 2.0), ('F4', 61.0, 2.4), ('D4', 63.8, 3.8),
    ('A4', 68.0, 2.2), ('D5', 70.6, 2.6), ('C5', 73.6, 1.6), ('Bb4', 75.4, 2.0),
    ('A4', 77.8, 2.2), ('G4', 80.4, 1.8), ('F4', 82.4, 2.2), ('Eb4', 85.0, 2.0),
    ('D4', 87.4, 4.0),
    ('F4', 92.0, 2.0), ('G4', 94.4, 1.8), ('A4', 96.6, 2.2), ('Bb4', 99.2, 2.0),
    ('A4', 101.6, 1.6), ('G4', 103.4, 2.0), ('F4', 105.8, 2.4), ('Eb4', 108.6, 2.2),
    ('D4', 111.2, 6.0),
]
for note, start, dur in MELODY:
    i0 = int(start * SR)
    seg = karplus_strong(SCALE[note], min(dur + 1.5, DUR - start), decay=0.9965)
    i1 = min(i0 + len(seg), N)
    # پن ملایم استریو‌نما (تنوع دامنه)
    gain = 0.30 + 0.12 * rng.random()
    buf[i0:i1] += gain * seg[: i1 - i0]
    # هارمونی درخشان (اکتاو بالاتر با دامنه کم)
    seg2 = karplus_strong(SCALE[note] * 2, min(dur * 0.8 + 0.8, DUR - start), decay=0.994)
    i1b = min(i0 + len(seg2), N)
    buf[i0:i1b] += 0.10 * seg2[: i1b - i0]

# ─── ۳) ضرب ملایم (تَمبک‌نما هر ۲.۴ ثانیه) ───
for beat in np.arange(2.4, DUR - 1, 2.4):
    i0 = int(beat * SR)
    d = soft_drum()
    i1 = min(i0 + len(d), N)
    buf[i0:i1] += 0.20 * d[: i1 - i0]
    if rng.random() < 0.35:  # ریتم کوبه‌ای دوم سبک
        j0 = i0 + int(0.75 * SR)
        j1 = min(j0 + len(d) // 2, N)
        buf[j0:j1] += 0.10 * (d[: j1 - j0] * 0.5)

# ─── ۴) فید و نرمال‌سازی ───
fade_in = int(3.0 * SR)
fade_out = int(6.0 * SR)
buf[:fade_in] *= np.linspace(0, 1, fade_in)
buf[-fade_out:] *= np.linspace(1, 0, fade_out)
peak = np.max(np.abs(buf))
buf = buf / peak * 0.72

pcm = (buf * 32767).astype(np.int16)
with wave.open('/home/z/my-project/public/audio/defa-ambient.wav', 'wb') as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())

print('OK — duration:', DUR, 'sec | peak:', round(float(peak), 3))
