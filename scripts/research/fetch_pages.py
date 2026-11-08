#!/usr/bin/env python3
"""Fetch memoir pages of martyrs and extract clean Persian text."""
import re, subprocess, os, json

PAGES = {
  'kharazi-irdc': 'https://irdc.ir/fa/news/10033/چند-خاطره-از-شهید-حسین-خرازی',
  'bakri-navid': 'https://navideshahed.com/fa/news/588433/۲۰-خاطره-کوتاه-و-خواندنی-از-شهیدان-باکری',
  'doran-navid': 'https://navideshahed.com/fa/news/395238/14-خاطره-کوتاه-و-خواندنی-از-خلبانی-که-داوطلب-شهادت-بود',
  'babaei-navid': 'https://navideshahed.com/fa/news/434801/10-خاطره-از-شهید-عباس-بابایی-که-نخوانده-اید',
  'bagheri-aviny': 'https://old.aviny.com/rahiyan_noor/revaiat-eshgh/khatere/08.aspx',
  'hemmet-irna': 'https://www.irna.ir/news/84672989/تلخ-ترین-خاطره-زندگی-شهید-همت-چه-بود',
  'hemmet-javan': 'https://www.javanonline.ir/fa/news/419468/مزار-شهید-همت-کجاست-عکس',
  'chamran-vip': 'https://navideshahed.com/fa/vip/135396',
  'jahanara-vip': 'https://navideshahed.com/fa/vip/187624',
  'yaghchian-vip': 'https://navideshahed.com/fa/vip/30343',
  'redanipour-olgo': 'https://olgoirani.com/content/1044/زندگی-نامه-و-وصیت-نامه-شهید-مصطفی-ردانی-پور',
  'vazvaei-golzar': 'https://www.golzar.info/21007/شهید-محسن-وزوایی',
  'bakri100-defapress': 'https://defapress.ir/fa/news/118737/100-خاطره-از-شهید-مهدی-باکری',
  'bagheri100-javan': 'https://www.javanonline.ir/fa/news/1134300/۱۰۰-خاطره-از-حسن-باکری',
}

UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'
os.makedirs('/home/z/my-project/scripts/research/pages', exist_ok=True)

def clean(html):
    html = re.sub(r'<script[\s\S]*?</script>|<style[\s\S]*?</style>|<nav[\s\S]*?</nav>|<footer[\s\S]*?</footer>|<header[\s\S]*?</header>', ' ', html)
    text = re.sub(r'<[^>]+>', ' ', html)
    text = re.sub(r'&[a-z]+;', ' ', text)
    text = re.sub(r'[«»"“”\u200c]', lambda m: m.group(0), text)
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n\s*\n+', '\n', text)
    return text.strip()

for key, url in PAGES.items():
    out = f'/home/z/my-project/scripts/research/pages/{key}.txt'
    if os.path.exists(out) and os.path.getsize(out) > 500:
        print(f'[skip] {key}'); continue
    try:
        r = subprocess.run(['curl', '-sL', '--max-time', '40', '-A', UA, url],
                           capture_output=True, timeout=45)
        html = r.stdout.decode('utf-8', errors='ignore')
        text = clean(html)
        open(out, 'w').write(text)
        print(f'[ok] {key}: {len(text)} chars')
    except Exception as e:
        print(f'[fail] {key}: {e}')
