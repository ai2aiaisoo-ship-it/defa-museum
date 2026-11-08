#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""1) Add 'mek-pm-office' operation record; 2) register new sources."""
import sys

# ── operations-c.ts ──
P1 = '/home/z/my-project/src/data/operations-c.ts'
s = open(P1, encoding='utf-8').read()
if "id: 'mek-pm-office'" not in s:
    anchor = "    id: 'mek-hzb-bombing',"
    new_op = """    id: 'mek-pm-office',
    faName: 'بمب‌گذاری در ساختمان نخست‌وزیری (۸ شهریور ۱۳۶۰)',
    enName: 'Prime Minister Office Bombing (8 Shahrivar 1981)',
    side: 'mek',
    kind: 'special',
    scale: 'limited',
    fronts: ['cities'],
    faStart: '1360-06-08',
    year: 1360,
    region: 'تهران — ساختمان نخست‌وزیری',
    regionEn: 'Tehran',
    center: { lat: 35.69, lng: 51.40, label: 'تهران' },
    commanders: [],
    objectives: 'ترور مقامات اجرایی ارشد کشور در اوج دوران ترور.',
    background: 'در ۸ شهریور ۱۳۶۰ انفجار بمبی در جلسه هیئت دولت در ساختمان نخست‌وزیری رخ داد؛ شهید محمدعلی رجایی (رئیس‌جمهور) و شهید محمدجواد باهنر (نخست‌وزیر) به شهادت رسیدند. مسئولیت انفجار به سازمان منافقین نسبت داده شده است.',
    course: ['۸ شهریور ۱۳۶۰: انفجار در جلسه هیئت دولت؛ شهادت رئیس‌جمهور و نخست‌وزیر.'],
    outcome: 'خلأ هم‌زمان در دو بالای قوه اجرایی؛ ادامه و تشدید برخورد با سازمان منافقین.',
    result: 'clear_victory',
    analysis: 'این رویداد اوج «دوران ترور» در سال نخست جنگ است: مبارزه مسلحانه سازمان با حکومت در دل جنگ خارجی، جبهه امنیتی را به جبهه نظامی اضافه کرد. در فهرست رویدادهای جنگ، این انفجار در کنار بمب‌گذاری ۷ تیر (دفتر حزب جمهوری اسلامی — شهادت بهشتی و ۷۲ تن) ثبت شده است.',
    faEnd: '1360-06-08',
    casualties: [],
"""
    if anchor in s:
        s = s.replace(anchor, new_op + anchor, 1)
        open(P1, 'w', encoding='utf-8').write(s)
        print('✓ mek-pm-office operation added')
    else:
        print('✗ anchor not found in operations-c.ts'); sys.exit(1)
else:
    print('[skip] mek-pm-office already present')

# ── sources.ts ──
P2 = '/home/z/my-project/src/data/sources.ts'
s2 = open(P2, encoding='utf-8').read()
need = {
  'golzar-info': """  {
    id: 'golzar-info',
    faTitle: 'پایگاه اطلاع‌رسانی فرهنگ ایثار و شهادت («گلزار شهدا») — پرونده رسمی شهدا و اطلاعات مزار',
    type: 'official',
    year: 'تا ۱۴۰۴',
    url: 'https://www.golzar.info',
    reliability: 'B',
    note: 'پرونده‌های رسمی شهدا شامل شرح شهادت و اطلاعات دقیق مزار (قطعه/ردیف/شماره)؛ مبنای داده‌های آرامگاهی تالار «خاطرات شهدا و آرامگاه‌ها».',
  },
""",
  'irdc-archives': """  {
    id: 'irdc-archives',
    faTitle: 'مرکز اسناد انقلاب اسلامی و دفاع مقدس — سرویس خاطرات و پژوهش',
    type: 'archive',
    year: 'تا ۱۴۰۴',
    url: 'https://irdc.ir',
    reliability: 'B',
    note: 'خاطرات مستند شهیدان (خرازی، نامجو و…) و اسناد تاریخی؛ مکمل مستقل مرکز اسناد دفاع مقدس.',
  },
""",
  'defapress': """  {
    id: 'defapress',
    faTitle: 'خبرگزاری دفاع‌پرس — پرونده‌ها و گزارش‌های شهدای دفاع مقدس',
    type: 'media',
    year: 'تا ۱۴۰۴',
    url: 'https://defapress.ir',
    reliability: 'B',
    note: 'گزارش‌های روایی و پرونده شهدا (مزار شهیدان رجایی و باهنر، خاطرات شهیدان باکری و یاغچیان و…).',
  },
""",
}
added = []
for sid, block in need.items():
    if f"id: '{sid}'" in s2:
        continue
    idx = s2.rfind('\n]\n')
    if idx < 0:
        print('✗ array end not found'); sys.exit(1)
    s2 = s2[:idx] + '\n' + block + s2[idx:]
    added.append(sid)
open(P2, 'w', encoding='utf-8').write(s2)
print('✓ sources added:', added if added else '[none — already present]')
