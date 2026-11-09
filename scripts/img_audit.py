#!/usr/bin/env python3
# ─── ممیزی کامل تصاویر برنامه «یادواره شهدای دفاع مقدس» ───
# ۱) همه URLهای تصویر در فایل‌های داده استخراج می‌شود
# ۲) هر URL با درخواست HTTP تست می‌شود
# ۳) فایل‌های محلی public بررسی می‌شوند
import re, subprocess, os, sys, json

ROOT = '/home/z/my-project'
SRC = os.path.join(ROOT, 'src/data')
PUB = os.path.join(ROOT, 'public')

url_re = re.compile(r'https?://[^\s\'"`,)]+')
local_re = re.compile(r'/images/[A-Za-z0-9_\-./]+\.(?:jpg|jpeg|png|webp|gif|svg|JPG|JPEG|PNG)')

files = [f for f in os.listdir(SRC) if f.endswith(('.ts', '.tsx'))]
ext_urls = {}   # url -> [file:line]
local_refs = {} # path -> [file:line]

for f in files:
    p = os.path.join(SRC, f)
    with open(p, encoding='utf-8') as fh:
        for i, line in enumerate(fh, 1):
            for m in url_re.finditer(line):
                u = m.group(0).rstrip('\\').rstrip('\'",')
                if any(ext in u for ext in ('.jpg', '.jpeg', '.png', '.webp', '.gif')):
                    ext_urls.setdefault(u, []).append(f'{f}:{i}')
            for m in local_re.finditer(line):
                local_refs.setdefault(m.group(0), []).append(f'{f}:{i}')

# components too
comp_dir = os.path.join(ROOT, 'src/components')
for dirpath, _, fns in os.walk(comp_dir):
    for fn in fns:
        if not fn.endswith('.tsx'): continue
        p = os.path.join(dirpath, fn)
        rel = os.path.relpath(p, SRC)
        with open(p, encoding='utf-8') as fh:
            for i, line in enumerate(fh, 1):
                for m in local_re.finditer(line):
                    local_refs.setdefault(m.group(0), []).append(f'../components/{rel}:{i}')

print(f'=== {len(ext_urls)} external image URLs, {len(local_refs)} local image refs ===')
print('\n--- EXTERNAL URL TESTS ---')
broken_ext = []
for u in sorted(ext_urls):
    r = subprocess.run(['curl', '-s', '-o', '/dev/null', '-w', '%{http_code} %{size_download} %{content_type}',
                        '--max-time', '25', '-L', u], capture_output=True, text=True)
    code = r.stdout.split()[0] if r.stdout else 'ERR'
    size = r.stdout.split()[1] if len(r.stdout.split()) > 1 else '?'
    ok = code == '200'
    if not ok: broken_ext.append(u)
    flag = 'OK ' if ok else 'FAIL'
    print(f'[{flag}] {code:>3} {size:>8}B  {u[:100]}  <- {ext_urls[u][0]}')

print('\n--- LOCAL FILE CHECKS ---')
broken_local = []
for path in sorted(local_refs):
    fs = os.path.join(PUB, path.lstrip('/'))
    ok = os.path.exists(fs) and os.path.getsize(fs) > 500
    if not ok: broken_local.append(path)
    print(f'[{"OK " if ok else "FAIL"}] {path}  <- {local_refs[path][0]}')

# unused local images
print('\n--- LOCAL FILES NOT REFERENCED ---')
pub_files = []
for dirpath, _, fns in os.walk(os.path.join(PUB, 'images')):
    for fn in fns:
        pub_files.append('/' + os.path.relpath(os.path.join(dirpath, fn), PUB).replace('\\', '/'))
for pf in pub_files:
    if pf not in local_refs:
        print(f'[UNUSED] {pf} ({os.path.getsize(os.path.join(PUB, pf.lstrip("/")))}B)')

print(f'\n=== SUMMARY: {len(broken_ext)} broken external, {len(broken_local)} broken local ===')
json.dump({'broken_ext': broken_ext, 'broken_local': broken_local,
           'all_ext': list(ext_urls), 'all_local': list(local_refs)},
          open(os.path.join(ROOT, 'scripts', 'img-audit-result.json'), 'w'), indent=1)
