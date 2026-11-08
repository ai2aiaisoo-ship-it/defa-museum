"""تولید روایت‌های شنیداری تجربه‌نگاری — صدای مصنوعی فارسی به سبک آوینی‌وار
Voice: fa-IR-FaridNeural (male Persian) | rate −18% | pitch −4Hz  (آهسته و سترگ)
ورودی: src/data/narration-scripts.json
خروجی: public/audio/narrations/{expId}.mp3 + src/data/narration-manifest.json (مدت‌زمان واقعی با ffprobe)
"""
import asyncio
import json
import os
import subprocess

import edge_tts

ROOT = '/home/z/my-project'
SRC = os.path.join(ROOT, 'src/data/narration-scripts.json')
OUT = os.path.join(ROOT, 'public/audio/narrations')
MANIFEST = os.path.join(ROOT, 'src/data/narration-manifest.json')
VOICE = 'fa-IR-FaridNeural'
RATE = '-18%'
PITCH = '-4Hz'
CONC = 3


async def gen_one(sem: asyncio.Semaphore, exp_id: str, text: str) -> dict:
    async with sem:
        mp3 = os.path.join(OUT, f'{exp_id}.mp3')
        try:
            tts = edge_tts.Communicate(text, VOICE, rate=RATE, pitch=PITCH)
            await tts.save(mp3)
            dur = subprocess.run(
                ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp3],
                capture_output=True, text=True).stdout.strip()
            sec = round(float(dur), 1) if dur else 0.0
            size = os.path.getsize(mp3)
            if size < 5000 or sec < 5:
                return {'error': f'suspicious output ({size}B, {sec}s)'}
            print(f'OK  {exp_id}  {sec:>6}s  {size}B')
            return {'sec': sec, 'bytes': size}
        except Exception as e:  # noqa: BLE001
            print(f'FAIL {exp_id}: {e}')
            return {'error': str(e)}


async def main() -> None:
    with open(SRC, encoding='utf-8') as f:
        scripts: dict = json.load(f)
    os.makedirs(OUT, exist_ok=True)
    sem = asyncio.Semaphore(CONC)
    results = await asyncio.gather(*(gen_one(sem, k, v) for k, v in scripts.items()))
    manifest = dict(zip(scripts.keys(), results))
    with open(MANIFEST, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=1)
    ok = [k for k, v in manifest.items() if 'sec' in v]
    bad = [k for k, v in manifest.items() if 'sec' not in v]
    total = sum(v.get('sec', 0) for v in manifest.values() if 'sec' in v)
    print(f'DONE {len(ok)}/{len(scripts)} | total {round(total/60, 1)} min')
    if bad:
        print('FAILED:', bad)


if __name__ == '__main__':
    asyncio.run(main())
