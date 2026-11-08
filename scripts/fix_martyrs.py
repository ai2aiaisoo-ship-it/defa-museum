#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Apply verified factual corrections + portraits to martyrs.ts (audit-logged)."""
import sys

PATH = '/home/z/my-project/src/data/martyrs.ts'
src = open(PATH, encoding='utf-8').read()
applied, failed = [], []

def rep(old, new, label):
    global src
    if old in src:
        src = src.replace(old, new, 1)
        applied.append(label)
    elif new in src:
        applied.append(label + ' [already]')
    else:
        failed.append(label + ' [NOT FOUND]')

def img_block(url, source='جست‌وجوی تصویر وب (آرشیو عمومی)'):
    return ("    sources: ['fa-wiki-war', 'navidshahed'],\n"
            "    confidence: 'B',\n"
            "    image: {\n"
            f"      url: '{url}',\n"
            f"      sourceName: '{source}',\n"
            "      verified: 'pending-review',\n"
            "    },\n  },")

# ── رجایی ──
rep("""  {
    id: 'rajaei',
    name: 'محمدعلی رجایی',
    birth: '۱۳۱۲، قزوین',
    martyrdomDate: '1360-04-07',
    place: 'انفجار دفتر مرکزی حزب جمهوری اسلامی — تهران',
    opIds: ['mek-hzb-bombing'],
    org: 'political',
    role: 'رئیس‌جمهور ایران',
    roleType: 'minister',
    cause: 'در ۷ تیر ۱۳۶۰، در انفجار بمب کارگذاری‌شده توسط سازمان منافقین در جلسه دفتر مرکزی حزب جمهوری اسلامی به شهادت رسید.',""",
    """  {
    id: 'rajaei',
    name: 'محمدعلی رجایی',
    birth: '۱۳۱۲، قزوین',
    martyrdomDate: '1360-06-08',
    place: 'انفجار ساختمان نخست‌وزیری — تهران',
    opIds: ['mek-pm-office'],
    org: 'political',
    role: 'رئیس‌جمهور ایران',
    roleType: 'minister',
    cause: 'در ۸ شهریور ۱۳۶۰، در انفجار بمب کارگذاری‌شده توسط سازمان منافقین در ساختمان نخست‌وزیری به شهادت رسید.',
    dateNote: 'اصلاح راستی‌آزمایی‌شده: رکورد پیشین شهادت او را ۷ تیر (انفجار دفتر حزب — شهادت بهشتی و ۷۲ تن) ثبت بود؛ منابع (گلزار شهدا، دفاع‌پرس) شهادت ۸ شهریور ۱۳۶۰ در ساختمان نخست‌وزیری را تأیید می‌کنند.',""",
    'rajaei-record')
rep("""    legacy: 'روز ۷ تیر در تقویم رسمی به نام «روز شهدای حزب جمهوری اسلامی» و به نام شهید رجایی و شهید باهنر ثبت است؛ خانه‌های یادبود و خیابان‌های سراسر کشور به نام این دو شهید است.',
    sources: ['fa-wiki-war'],
    confidence: 'A',
  },""",
    """    legacy: 'سالروز ۸ شهریور به یاد شهید رجایی و شهید باهنر است؛ خانه‌های یادبود و خیابان‌های سراسر کشور به نام این دو شهید است. مزار آن دو در قطعه ۷۲ بهشت زهراست.',
    sources: ['fa-wiki-war', 'golzar-info', 'defapress'],
    confidence: 'A',
    image: {
      url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/dee176b27991.jpg',
      sourceName: 'جست‌وجوی تصویر وب (آرشیو عمومی)',
      verified: 'pending-review',
    },
  },""",
    'rajaei-image')

# ── باهنر ──
rep("""    id: 'bahonar',
    name: 'محمدجواد باهنر',
    birth: '۱۳۱۲، کرمان',
    martyrdomDate: '1360-04-07',
    place: 'انفجار دفتر مرکزی حزب جمهوری اسلامی — تهران',
    opIds: ['mek-hzb-bombing'],
    org: 'political',
    role: 'نخست‌وزیر ایران',
    roleType: 'minister',
    cause: 'در ۷ تیر ۱۳۶۰، در انفجار بمب کارگذاری‌شده توسط سازمان منافقین در جلسه دفتر مرکزی حزب جمهوری اسلامی به شهادت رسید.',""",
    """    id: 'bahonar',
    name: 'محمدجواد باهنر',
    birth: '۱۳۱۲، کرمان',
    martyrdomDate: '1360-06-08',
    place: 'انفجار ساختمان نخست‌وزیری — تهران',
    opIds: ['mek-pm-office'],
    org: 'political',
    role: 'نخست‌وزیر ایران',
    roleType: 'minister',
    cause: 'در ۸ شهریور ۱۳۶۰، در انفجار بمب کارگذاری‌شده توسط سازمان منافقین در ساختمان نخست‌وزیری به شهادت رسید.',
    dateNote: 'اصلاح راستی‌آزمایی‌شده: رکورد پیشین شهادت او را ۷ تیر ثبت بود؛ منابع (گلزار شهدا، دفاع‌پرس) شهادت ۸ شهریور ۱۳۶۰ در ساختمان نخست‌وزیری را تأیید می‌کنند.',""",
    'bahonar-record')
rep("""    legacy: 'هم‌شهادت شهید رجایی در هفته تیر ۱۳۶۰؛ سالگرد آن دو، روز بزرگداشت شهدای مدیریت سیاسی جنگ است.',
    sources: ['fa-wiki-war'],
    confidence: 'A',
  },""",
    """    legacy: 'هم‌شهادت شهید رجایی در ۸ شهریور ۱۳۶۰؛ سالگرد آن دو، روز بزرگداشت شهدای مدیریت سیاسی جنگ است.',
    sources: ['fa-wiki-war', 'golzar-info', 'defapress'],
    confidence: 'A',
    image: {
      url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3665c8dc21d0.jpg',
      sourceName: 'جست‌وجوی تصویر وب (آرشیو عمومی)',
      verified: 'pending-review',
    },
  },""",
    'bahonar-image')

# ── فلاحی ──
rep("""    martyrdomDate: '1360-07-19',
    place: 'سانحه سقوط هواپیمای سی-۱۳۰ نزدیک دزفول',
    opIds: ['nasr-59', 'pol-naderi'],
    org: 'artesh',
    role: 'فرمانده نیروی زمینی ارتش',
    roleType: 'commander',
    cause: 'در ۱۹ مهر ۱۳۶۰ در سانحه سقوط هواپیمای سی-۱۳۰ در مسیر مأموریت جبهه جنوب، همراه وزیر دفاع و دیگر مسئولان به شهادت رسید.',""",
    """    martyrdomDate: '1360-07-07',
    place: 'سانحه سقوط هواپیمای سی-۱۳۰ در کهریزک تهران',
    opIds: ['nasr-59', 'pol-naderi'],
    org: 'artesh',
    role: 'فرمانده نیروی زمینی ارتش',
    roleType: 'commander',
    cause: 'در ۷ مهر ۱۳۶۰ در سانحه سقوط هواپیمای سی-۱۳۰ در کهریزک تهران، در بازگشت از جبهه جنوب، همراه وزیر دفاع و دیگر مسئولان به شهادت رسید.',
    dateNote: 'اصلاح راستی‌آزمایی‌شده: محل سانحه کهریزک تهران است (نزدیک دزفول نیست)؛ تاریخ صحیح ۷ مهر ۱۳۶۰ است (ویکی‌پدیای فارسی، دفاع‌پرس).',""",
    'falahi-record')
rep("""    sources: ['fa-wiki-war', 'jang-atlas'],
    confidence: 'A',
  },
  {
    id: 'fakoori',""",
    """    sources: ['fa-wiki-war', 'jang-atlas', 'defapress'],
    confidence: 'A',
    image: {
      url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/84d0c57b6f07.jpg',
      sourceName: 'جست‌وجوی تصویر وب (آرشیو عمومی)',
      verified: 'pending-review',
    },
  },
  {
    id: 'fakoori',""",
    'falahi-image')

# ── فکوری ──
rep("""    martyrdomDate: '1360-07-19',
    place: 'سانحه سقوط سی-۱۳۰ نزدیک دزفول (همان سانحه فلاحی)',
    opIds: ['kaman-99', 'h-3'],
    org: 'iriaf',
    role: 'معاون نخست‌وزیر در امور انقلاب؛ پیش‌تر معاون عملیات نیروی هوایی',
    roleType: 'pilot',
    cause: 'همراه فلاحی و نامجو در سانحه سقوط هواپیمای سی-۱۳۰ در مأموریت جبهه به شهادت رسید.',""",
    """    martyrdomDate: '1360-07-07',
    place: 'سانحه سقوط سی-۱۳۰ در کهریزک تهران (همان سانحه فلاحی)',
    opIds: ['kaman-99', 'h-3'],
    org: 'iriaf',
    role: 'معاون نخست‌وزیر در امور انقلاب؛ پیش‌تر معاون عملیات نیروی هوایی',
    roleType: 'pilot',
    cause: 'همراه فلاحی و نامجو در سانحه سقوط هواپیمای سی-۱۳۰ در کهریزک تهران به شهادت رسید (۷ مهر ۱۳۶۰).',""",
    'fakoori-record')
rep("""    sources: ['fa-wiki-war', 'razoux'],
    confidence: 'A',
  },
  {
    id: 'namjou',""",
    """    sources: ['fa-wiki-war', 'razoux', 'golzar-info'],
    confidence: 'A',
    image: {
      url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/7859aa11e5e1.jpg',
      sourceName: 'جست‌وجوی تصویر وب (آرشیو عمومی)',
      verified: 'pending-review',
    },
  },
  {
    id: 'namjou',""",
    'fakoori-image')

# ── نامجو ──
rep("""    birth: '۱۳۱۶، تهران',
    martyrdomDate: '1360-07-19',
    place: 'سانحه سقوط سی-۱۳۰ نزدیک دزفول (همان سانحه فلاحی)',
    opIds: [],
    org: 'political',
    role: 'وزیر دفاع',
    roleType: 'minister',
    cause: 'در ۱۹ مهر ۱۳۶۰، همراه شهید فلاحی و شهید فکوری در سانحه سقوط هواپیمای سی-۱۳۰ در مسیر مأموریت جبهه جنوب به شهادت رسید.',""",
    """    birth: '۱۳۱۷، بندر انزلی',
    martyrdomDate: '1360-07-07',
    place: 'سانحه سقوط سی-۱۳۰ در کهریزک تهران (همان سانحه فلاحی)',
    opIds: [],
    org: 'political',
    role: 'وزیر دفاع',
    roleType: 'minister',
    cause: 'در ۷ مهر ۱۳۶۰، همراه شهید فلاحی و شهید فکوری در سانحه سقوط هواپیمای سی-۱۳۰ در کهریزک تهران به شهادت رسید.',
    dateNote: 'اصلاح راستی‌آزمایی‌شده: تولد ۲۶ آذر ۱۳۱۷ بندر انزلی (ویکی‌پدیای فارسی)؛ محل سانحه کهریزک تهران است.',""",
    'namjou-record')
rep("""    sources: ['fa-wiki-war'],
    confidence: 'A',
  },
  {
    id: 'jahandar',""",
    """    sources: ['fa-wiki-war', 'defapress'],
    confidence: 'A',
    image: {
      url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/2b5708322aca.jpg',
      sourceName: 'نوید شاهد (بنیاد حفظ آثار دفاع مقدس)',
      verified: 'archival-confirmed',
    },
  },
  {
    id: 'jahandar',""",
    'namjou-image')

# ── جهان‌آرا ──
rep("""    martyrdomDate: '1360-07-01',
    age: '۲۸ سال',
    place: 'منطقه آبادان',
    opIds: ['khorramshahr-battle', 'samen-ol-aemmeh'],
    regionNote: 'جبهه شکست حصر آبادان — یک سال پس از سقوط شهر خود',
    org: 'sepah',
    role: 'فرمانده سپاه خرمشهر و سپس فرمانده تیپ ثارالله خوزستان',
    roleType: 'commander',
    cause: 'اندکی پیش از آغاز عملیات ثامن‌الائمه، هنگام آماده‌سازی نیروها برای شکست حصر آبادان بر اثر آتش دشمن به شهادت رسید و فرصت دیدن روز آزادی خرمشهر نیافت.',""",
    """    martyrdomDate: '1360-07-07',
    age: '۲۸ سال',
    place: 'سانحه سقوط سی-۱۳۰ در کهریزک تهران',
    opIds: ['khorramshahr-battle', 'samen-ol-aemmeh'],
    regionNote: 'اصلاح راستی‌آزمایی‌شده: او در ۷ مهر ۱۳۶۰ — چند روز پس از شکست حصر آبادان در عملیات ثامن‌الائمه — در سانحه سقوط هواپیمای سی-۱۳۰ در کهریزک تهران به شهادت رسید (گلزار شهدا، ویکی‌پدیای فارسی).',
    org: 'sepah',
    role: 'فرمانده سپاه خرمشهر و سپس فرمانده تیپ ثارالله خوزستان',
    roleType: 'commander',
    cause: 'چند روز پس از شکست حصر آبادان در عملیات ثامن‌الائمه، هنگام پرواز بازگشت از جبهه جنوب در سانحه سقوط هواپیمای سی-۱۳۰ در ۷ مهر ۱۳۶۰ به شهادت رسید و فرصت دیدن آزادی خرمشهر نیافت.',""",
    'jahandar-record')

# ── دقایقی ──
rep("""    birth: '۱۳۳۲، آبادان',
    martyrdomDate: '1360-08-01',
    place: 'جبهه آبادان (مهندسی جنگی)',
    opIds: ['samen-ol-aemmeh'],
    regionNote: 'روز دقیق شهادت در منابع بین ۲۹ مهر تا ۱ آبان ۱۳۶۰ متفاوت است — نیازمند تطبیق نهایی',
    org: 'sepah',
    role: 'فرمانده مهندسی جنگی سپاه خوزستان',
    roleType: 'engineer',
    cause: 'در جریان احداث پل‌های تخریب‌ناپذیر و راه‌های تدارکاتی زیر آتش دشمن در عملیات شکست حصر آبادان به شهادت رسید.',""",
    """    birth: '۱۳۳۳، بهبهان',
    martyrdomDate: '1365-10-28',
    age: '۳۲ سال',
    place: 'شلمچه (عملیات کربلای ۵ — مهندسی جنگی)',
    opIds: ['karbala-5'],
    regionNote: 'اصلاح راستی‌آزمایی‌شده: تولد ۹ بهمن ۱۳۳۳ بهبهان و شهادت ۲۸ دی ۱۳۶۵ در عملیات کربلای ۵ (ویکی‌پدیای فارسی، گلزار شهدا). رکورد پیشین شهادت او را آبان ۱۳۶۰ ثبت بود که مغایر منابع است.',
    org: 'sepah',
    role: 'فرمانده مهندسی جنگی سپاه خوزستان و فرمانده تیپ ۹ بدر',
    roleType: 'engineer',
    cause: 'در جریان عملیات کربلای ۵ و احداث پل‌های عبور از اروند و راه‌های تدارکاتی زیر آتش دشمن در شلمچه به شهادت رسید.',""",
    'daghayeghi-record')
rep("""    legacy: 'بنیان‌گذار سنت «مهندسی رزمی» سپاه؛ درسگا‌های مهندسی جنگی امروز از مسیر او شکل گرفت.',
    sources: ['defa-center', 'navidshahed'],
    confidence: 'B',
  },""",
    """    legacy: 'بنیان‌گذار سنت «مهندسی رزمی» سپاه؛ درسگا‌های مهندسی جنگی امروز از مسیر او شکل گرفت. تندیس او در اهواز (پل سوم) نصب شده است.',
    sources: ['defa-center', 'navidshahed', 'golzar-info'],
    confidence: 'B',
    image: {
      url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d6f8ffe27c6e.jpg',
      sourceName: 'جست‌وجوی تصویر وب (آرشیو عمومی)',
      verified: 'pending-review',
    },
  },""",
    'daghayeghi-image')

# ── دوران ──
rep("""    birth: '۱۳۳۱، آبادان',
    martyrdomDate: '1361-04-27',
    age: '۳۰ سال',
    place: 'آسمان بغداد',
    opIds: ['ramadan-61', 'morvarid'],
    org: 'iriaf',""",
    """    birth: '۱۳۲۹، شیراز',
    martyrdomDate: '1361-04-27',
    age: '۳۰ سال',
    place: 'آسمان بغداد',
    opIds: ['ramadan-61', 'morvarid'],
    org: 'iriaf',""",
    'doran-birth')
rep("""    legacy: 'مقبره او در گورستان ملایه (بر اساس وصیت، در میان گلزار «شهیدان ملایه») زیارتگاه خلبانان است؛ ۲۷ تیر به نام او در تقویم نیروی هوایی ثبت است.',
    sources: ['wiki-morvarid', 'fa-wiki-war'],
    confidence: 'B',
  },""",
    """    legacy: 'مقبره او در گورستان ملایه (بر اساس وصیت، در میان گلزار «شهیدان ملایه») زیارتگاه خلبانان است؛ ۲۷ تیر به نام او در تقویم نیروی هوایی ثبت است.',
    sources: ['wiki-morvarid', 'fa-wiki-war', 'navidshahed'],
    confidence: 'B',
    dateNote: 'تولد ۲۰ مهر ۱۳۲۹ شیراز (نوید شاهد)؛ درباره روز دقیق شهادت منابع اختلاف دارند: ۲۷ تیر (رایج) و ۳۰–۳۱ تیر ۱۳۶۱ (نوید شاهد). پیکر او پس از حدود ۲۰ سال به همراه ۵۷۰ شهید دیگر بازگشت.',
    image: {
      url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9fdf3a977b0f.jpg',
      sourceName: 'جست‌وجوی تصویر وب (آرشیو عمومی)',
      verified: 'pending-review',
    },
  },""",
    'doran-image')

# ── وزوایی ──
rep("""    id: 'vazvaei',
    name: 'محسن وزوایی',
    birth: '۱۳۳۸، کاشان',
    martyrdomDate: '1361-03-03',
    age: '۲۳ سال',
    place: 'خرمشهر (روز آزادسازی)',
    opIds: ['bayt-almoghaddas'],
    org: 'sepah',
    role: 'فرمانده تیپ المهدی (مهر)',
    roleType: 'commander',
    cause: 'در روز آزادسازی خرمشهر، هنگام فرماندهی نبردهای خیابانی و پاکسازی آخرین مواضع اشغالگر به شهادت رسید.',
    bio: 'از فرماندهان جوان و محبوب جبهه جنوب؛ در فتح‌المبین و بیت‌المقدس نقش محوری داشت و در ساعات پایانی آزادسازی خرمشهر شهید شد.',
    legacy: 'روایت محبوب جبهه‌ها از «فرمانده‌ای که در روز پیروزی، خرمشهر را دید و رفت»؛ از سند انسانی نسل فرماندهان جوان سپاه است.',
    sources: ['jang-atlas', 'defa-center'],
    confidence: 'B',
  },""",
    """    id: 'vazvaei',
    name: 'محسن وزوایی',
    birth: '۱۳۳۹، تهران',
    martyrdomDate: '1361-02-10',
    age: '۲۱ سال',
    place: 'خرمشهر (عملیات بیت‌المقدس)',
    opIds: ['bayt-almoghaddas'],
    regionNote: 'اصلاح راستی‌آزمایی‌شده: تولد ۱۸ مرداد ۱۳۳۹ تهران و شهادت ۱۰ اردیبهشت ۱۳۶۱ در خرمشهر (گلزار شهدا، ویکی‌پدیای فارسی). رکورد پیشین تولد «کاشان ۱۳۳۸» و شهادت «۳ خرداد» ثبت بود که مغایر منابع رسمی است.',
    org: 'sepah',
    role: 'فرمانده تیپ ۱۰ سیدالشهدا',
    roleType: 'commander',
    cause: 'در جریان عملیات بیت‌المقدس، هنگام فرماندهی گردان در نبردهای خرمشهر بر اثر اصابت ترکش خمپاره به شهادت رسید (پرونده رسمی گلزار شهدا).',
    bio: 'از فرماندهان جوان و محبوب جبهه جنوب؛ دانشجوی شیمی بود و در فتح‌المبین و بیت‌المقدس نقش محوری داشت. روز آزادسازی خرمشهر (۳ خرداد) را ندید.',
    legacy: 'روایت محبوب جبهه‌ها از «فرمانده‌ای که در روزهای پایانی آزادسازی خرمشهر، رفت»؛ کتاب «یک محسن عزیز» روایت مستند زندگی اوست.',
    sources: ['jang-atlas', 'defa-center', 'golzar-info'],
    confidence: 'A',
    image: {
      url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d0eb6f34d831.jpg',
      sourceName: 'جست‌وجوی تصویر وب (آرشیو عمومی)',
      verified: 'pending-review',
    },
  },""",
    'vazvaei-record')

# ── کاوه ──
rep("""    id: 'kaveh',
    name: 'محمود کاوه',
    birth: '۱۳۳۱، مشهد',
    martyrdomDate: '1362-02-19',
    age: '۳۱ سال',
    place: 'منطقه پاندرمه (جبهه مهران)',
    opIds: ['valfajr-1'],
    regionNote: 'بر اساس منابع رایج ایرانی؛ بخشی از منابع «منطقه میمک» گفته‌اند — نیازمند تطبیق نهایی',
    org: 'sepah',
    role: 'فرمانده تیپ ۱۵۵ ویژه شهدا',
    roleType: 'commander',
    cause: 'در جریان عملیات والفجر یک، هنگام فرماندهی یگان‌های ویژه و عبور از موانع مین به شهادت رسید.',
    bio: 'از بنیان‌گذاران یگان‌های ویژه و آموزش مین‌روبی سپاه؛ در جبهه‌های جنوب و کردستان نقش‌آفرین بود.',
    legacy: 'نماد «مهندسی عبور از موانع» در دفاع مقدس؛ آموزشگاه‌های تخصصی یگان‌های ویژه به نام اوست.',
    sources: ['fa-wiki-war', 'jang-atlas'],
    confidence: 'B',
  },""",
    """    id: 'kaveh',
    name: 'محمود کاوه',
    birth: '۱۳۴۰، مشهد',
    martyrdomDate: '1365-06-11',
    age: '۲۵ سال',
    place: 'حاج‌عمران (عملیات کربلای ۲)',
    opIds: ['karbala-2'],
    regionNote: 'اصلاح راستی‌آزمایی‌شده: تولد ۱ خرداد ۱۳۴۰ مشهد و شهادت ۱۱ شهریور ۱۳۶۵ در عملیات کربلای ۲ حاج‌عمران (ویکی‌پدیای فارسی). رکورد پیشین شهادت او را والفجر یک ۱۳۶۲ ثبت بود که مغایر منابع است.',
    org: 'sepah',
    role: 'فرمانده لشکر ۵۵ ویژه شهدا',
    roleType: 'commander',
    cause: 'در جریان عملیات کربلای ۲ در منطقه کوهستانی حاج‌عمران، هنگام فرماندهی یگان‌های ویژه به شهادت رسید.',
    bio: 'از بنیان‌گذاران یگان‌های ویژه و آموزش مین‌روبی سپاه؛ در جبهه‌های جنوب و کردستان نقش‌آفرین بود و در ۱۸ سالگی فرمانده حفاظت از بیت امام (ره) شد.',
    legacy: 'نماد «مهندسی عبور از موانع» در دفاع مقدس؛ آموزشگاه‌های تخصصی یگان‌های ویژه به نام اوست.',
    sources: ['fa-wiki-war', 'jang-atlas', 'wiki-karbala2', 'navidshahed'],
    confidence: 'B',
    image: {
      url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/427c4e822db7.png',
      sourceName: 'جست‌وجوی تصویر وب (آرشیو عمومی)',
      verified: 'pending-review',
    },
  },""",
    'kaveh-record')

# ── ردانی‌پور ──
rep("""    id: 'redanipour',
    name: 'مصطفی ردانی‌پور',
    birth: '۱۳۲۹، رشت',
    martyrdomDate: '1362-04-11',
    dateLabel: 'تیر ۱۳۶۲',
    place: 'منطقه حاج‌عمران',
    opIds: ['valfajr-2'],
    regionNote: 'روز دقیق در منابع متفاوت است؛ در جریان شناسایی پیش از آغاز رسمی والفجر ۲',""",
    """    id: 'redanipour',
    name: 'مصطفی ردانی‌پور',
    birth: '۱۳۳۷، اصفهان',
    martyrdomDate: '1362-05-15',
    dateLabel: '۱۵ مرداد ۱۳۶۲',
    place: 'منطقه حاج‌عمران (برخی منابع: چزابه)',
    opIds: ['valfajr-2'],
    regionNote: 'روز شهادت در بیشتر منابع ۱۵ مرداد ۱۳۶۲ ثبت است (گلزار شهدا، الگو ایرانی)؛ محل شهادت بین «حاج‌عمران» و «چزابه» اختلاف دارد — هر دو ثبت شده است.',""",
    'redanipour-record')
rep("""    legacy: 'نماد فرماندهی قرارگاه‌های تازه‌تأسیس در جبهه کوهستانی.',
    sources: ['wiki-valfajr2', 'jang-atlas'],
    confidence: 'C',
  },""",
    """    legacy: 'نماد فرماندهی قرارگاه‌های تازه‌تأسیس در جبهه کوهستانی.',
    sources: ['wiki-valfajr2', 'jang-atlas', 'golzar-info'],
    confidence: 'C',
    image: {
      url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/4dcee35577d0.jpg',
      sourceName: 'جست‌وجوی تصویر وب (آرشیو عمومی)',
      verified: 'pending-review',
    },
  },""",
    'redanipour-image')

# ── کلاهدوز ──
rep("""    id: 'kolahdooz',
    name: 'یوسف کلاهدوز',
    birth: '۱۳۲۴، اردبیل',
    martyrdomDate: '1362-03-23',
    place: 'سانحه سقوط بالگرد در مسیر بازگشت از جبهه جنوب',
    opIds: ['bayt-almoghaddas'],
    org: 'sepah',
    role: 'جانشین فرمانده کل سپاه پاسداران',
    roleType: 'commander',
    cause: 'در سانحه سقوط بالگرد هنگام بازگشت از بازدید مناطق عملیاتی جنوب به شهادت رسید.',""",
    """    id: 'kolahdooz',
    name: 'یوسف کلاهدوز',
    birth: '۱۳۲۵، قوچان',
    martyrdomDate: '1360-07-07',
    place: 'سانحه سقوط سی-۱۳۰ در کهریزک تهران',
    opIds: ['bayt-almoghaddas'],
    org: 'sepah',
    role: 'جانشین فرمانده کل سپاه پاسداران',
    roleType: 'commander',
    cause: 'در ۷ مهر ۱۳۶۰ در سانحه سقوط هواپیمای سی-۱۳۰ در کهریزک تهران، در بازگشت از بازدید مناطق عملیاتی جنوب به شهادت رسید (ویکی‌پدیای فارسی).',
    dateNote: 'اصلاح راستی‌آزمایی‌شده: رکورد پیشین «سانحه بالگرد» و «۱۳۲۴ اردبیل» بود؛ منابع (ویکی‌پدیای فارسی، گلزار شهدا) تولد ۱ دی ۱۳۲۵ قوچان و شهادت در سانحه سی-۱۳۰ کهریزک را تأیید می‌کنند.',""",
    'kolahdooz-record')
rep("""    legacy: 'سازماندهی لجستیک و آموزش سپاه در سال‌های نخست جنگ بر مسیر او بنا شد.',
    sources: ['fa-wiki-war', 'jang-atlas'],
    confidence: 'B',
  },
  {
    id: 'bagheri',""",
    """    legacy: 'سازماندهی لجستیک و آموزش سپاه در سال‌های نخست جنگ بر مسیر او بنا شد.',
    sources: ['fa-wiki-war', 'jang-atlas', 'golzar-info'],
    confidence: 'B',
    image: {
      url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9cc3a2b61cec.jpg',
      sourceName: 'جست‌وجوی تصویر وب (آرشیو عمومی)',
      verified: 'pending-review',
    },
  },
  {
    id: 'bagheri',""",
    'kolahdooz-image')

# ── حسن باقری ──
rep("""    id: 'bagheri',
    name: 'حسن باقری',
    knownAs: 'سید حسن باقری',
    birth: '۱۳۳۴، تهران',
    martyrdomDate: '1362-10-09',
    place: 'منطقه عملیاتی خیبر (اصلاحیه، جبهه هور)',
    opIds: ['kheibar'],
    org: 'sepah',
    role: 'جانشین فرماندهی عملیات نیروی زمینی سپاه',
    roleType: 'intel',
    cause: 'در جریان شناسایی خطوط دشمن پیش از عملیات خیبر در منطقه اصلاحیه به شهادت رسید.',""",
    """    id: 'bagheri',
    name: 'حسن باقری',
    knownAs: 'سید حسن باقری (غلامحسین افشردی)',
    birth: '۱۳۳۴، تهران',
    martyrdomDate: '1362-01-29',
    place: 'فکه (عملیات والفجر مقدماتی)',
    opIds: ['valfajr-moqaddamati'],
    org: 'sepah',
    role: 'جانشین فرماندهی عملیات نیروی زمینی سپاه',
    roleType: 'intel',
    cause: 'در ۹ بهمن ۱۳۶۱ در جریان شناسایی خطوط دشمن در منطقه فکه (والفجر مقدماتی) به شهادت رسید.',
    dateNote: 'اصلاح راستی‌آزمایی‌شده: رکورد پیشین شهادت او را دی ۱۳۶۲ در اصلاحیه خیبر ثبت بود؛ منابع (دانشگاه تهران، ویکی‌پدیای فارسی) شهادت ۹ بهمن ۱۳۶۱ در فکه و مزار بهشت زهرا قطعه ۲۴ ردیف ۸۰ مزار ۲۴ را تأیید می‌کنند.',""",
    'bagheri-record')
rep("""    sources: ['jang-atlas', 'defa-center'],
    confidence: 'B',
  },
  {
    id: 'bakri-mehdi',""",
    """    sources: ['jang-atlas', 'defa-center', 'navidshahed'],
    confidence: 'B',
    image: {
      url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/551db3872e31.jpg',
      sourceName: 'جست‌وجوی تصویر وب (آرشیو عمومی)',
      verified: 'pending-review',
    },
  },
  {
    id: 'bakri-mehdi',""",
    'bagheri-image')

# ── مهدی باکری ──
rep("""    id: 'bakri-mehdi',
    name: 'مهدی باکری',
    birth: '۱۳۳۳، مهاباد',
    martyrdomDate: '1362-11-02',
    age: '۲۹ سال',
    place: 'جزایر مجنون (عملیات خیبر)',
    opIds: ['kheibar'],
    org: 'sepah',
    role: 'فرمانده لشکر ۳۱ عاشورا',
    roleType: 'commander',
    cause: 'در عملیات خیبر، هنگام فرماندهی عبور از هور و تثبیت جزایر مجنون به شهادت رسید.',""",
    """    id: 'bakri-mehdi',
    name: 'مهدی باکری',
    birth: '۱۳۳۳، میاندوآب',
    martyrdomDate: '1363-12-25',
    age: '۳۰ سال',
    place: 'شرق دجله (عملیات بدر)',
    opIds: ['badr-63'],
    org: 'sepah',
    role: 'فرمانده لشکر ۳۱ عاشورا',
    roleType: 'commander',
    cause: 'در روز نخست عملیات بدر (۲۵ اسفند ۱۳۶۳)، هنگام فرماندهی نبرد رزمنده‌ها در شرق دجله و تثبیت مواضع در برابر پاتک دشمن بر اثر اصابت تیر مستقیم به شهادت رسید.',
    dateNote: 'اصلاح راستی‌آزمایی‌شده: رکورد پیشین شهادت او را ۲ بهمن ۱۳۶۲ در خیبر ثبت بود؛ منابع (ویکی‌پدیای فارسی، گلزار شهدا، نوید شاهد) شهادت ۲۵ اسفند ۱۳۶۳ در عملیات بدر را تأیید می‌کنند.',""",
    'bakri-mehdi-record')
rep("""    legacy: 'نماد فرماندهی لشکر عاشورا؛ برادران باکری از پرتکرارترین نمادهای دفاع مقدس‌اند.',
    sources: ['jang-atlas', 'fa-wiki-war'],
    confidence: 'B',
  },
  {
    id: 'yaghchian',""",
    """    legacy: 'نماد فرماندهی لشکر عاشورا؛ برادران باکری از پرتکرارترین نمادهای دفاع مقدس‌اند. فیلم سینمایی «موقعیت مهدی» و ورزشگاه شهید باکری ارومیه به یاد اوست.',
    sources: ['jang-atlas', 'fa-wiki-war', 'golzar-info'],
    confidence: 'B',
    image: {
      url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/06fb0d5fddac.jpg',
      sourceName: 'جست‌وجوی تصویر وب (آرشیو عمومی)',
      verified: 'pending-review',
    },
  },
  {
    id: 'yaghchian',""",
    'bakri-mehdi-image')

# ── یاغچیان ──
rep("""    id: 'yaghchian',
    name: 'مرتضی یاغچیان',
    birth: '۱۳۳۷، نجف‌آباد',
    martyrdomDate: '1362-11-05',
    dateLabel: 'بهمن ۱۳۶۲',
    place: 'منطقه عملیاتی خیبر (هور)',
    opIds: ['kheibar'],
    regionNote: 'روز دقیق شهادت در منابع متفاوت است (اوایل بهمن ۱۳۶۲) — نیازمند تطبیق نهایی',
    org: 'sepah',
    role: 'مسئول اطلاعات قرارگاه نصر',
    roleType: 'intel',
    cause: 'در جریان فعالیت‌های اطلاعاتی پیش و حین عملیات خیبر در منطقه هور به شهادت رسید.',
    bio: 'از ستون‌های اطلاعات–عملیات جبهه جنوب؛ در شناسایی هورالهویزه و طراحی مسیر عبور نقش کلیدی داشت.',
    legacy: 'نماد سند شفاهی «اطلاعات جبهه»؛ یادنامه‌های جبهه جنوب بر پایه خاطرات هم‌رزمان او ساخته شده است.',
    sources: ['defa-center'],
    confidence: 'C',
  },""",
    """    id: 'yaghchian',
    name: 'مرتضی یاغچیان',
    birth: '۱۳۳۵، تبریز',
    martyrdomDate: '1362-12-07',
    dateLabel: '۷ اسفند ۱۳۶۲',
    place: 'جزیره مجنون (عملیات خیبر)',
    opIds: ['kheibar'],
    regionNote: 'اصلاح راستی‌آزمایی‌شده: تولد ۱۳۳۵ تبریز و شهادت ۷ اسفند ۱۳۶۲ در جزیره مجنون (ویکی‌پدیای فارسی، نوید شاهد). رکورد پیشین تولد «نجف‌آباد ۱۳۳۷» ثبت بود که مغایر منابع است.',
    org: 'sepah',
    role: 'جانشین فرمانده لشکر ۳۱ عاشورا',
    roleType: 'intel',
    cause: 'در جریان عملیات خیبر در جزیره مجنون به شهادت رسید؛ پیکر او تا سال ۱۳۷۵ مفقود بود و در پی تفحص کشف و در وادی رحمت تبریز دفن شد.',
    bio: 'از ستون‌های اطلاعات–عملیات جبهه جنوب؛ در شناسایی هورالهویزه و طراحی مسیر عبور نقش کلیدی داشت.',
    legacy: 'نماد سند شفاهی «اطلاعات جبهه»؛ یادنامه «حمزه لشکر عاشورا» (شاهد یاران) درباره اوست.',
    sources: ['defa-center', 'navidshahed'],
    confidence: 'B',
    image: {
      url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/99671b7d18e8.jpg',
      sourceName: 'جست‌وجوی تصویر وب (آرشیو عمومی)',
      verified: 'pending-review',
    },
  },""",
    'yaghchian-record')

# ── علی هاشمی ──
rep("""    id: 'hashemi-ali',
    name: 'علی هاشمی',
    birth: '۱۳۴۰، تهران',
    martyrdomDate: '1362-12-18',
    age: '۲۲ سال',
    place: 'منطقه عملیاتی خیبر',
    opIds: ['kheibar'],
    org: 'sepah',
    role: 'فرمانده قرارگاه فتح',
    roleType: 'commander',
    cause: 'در جریان فرماندهی مرحله دوم عملیات خیبر در منطقه هور به شهادت رسید.',
    bio: 'جوان‌ترین فرمانده قرارگاه جنگی سپاه؛ در فتح‌المبین و بیت‌المقدس نقش محوری داشت و برادرش محمد هاشمی نیز در جبهه شهید شد.',
    legacy: 'نماد نسل فرماندهان جوان لشکرهای تازه‌تأسیس؛ لشکر ۲۵ کربلا میراث فرماندهی اوست.',
    sources: ['jang-atlas', 'defa-center'],
    confidence: 'B',
  },""",
    """    id: 'hashemi-ali',
    name: 'علی هاشمی',
    knownAs: 'سردار هور',
    birth: '۱۳۴۰، اهواز',
    martyrdomDate: '1367-04-04',
    age: '۲۶ سال',
    place: 'جزیره مجنون (در جریان تهاجم سراسری عراق — توکلنا علی‌الله)',
    opIds: ['fath-ol-mobin', 'bayt-almoghaddas', 'kheibar', 'badr-63'],
    org: 'sepah',
    role: 'فرمانده سپاه ششم امام جعفر صادق (ع) و فرمانده قرارگاه نصرت؛ طراح عملیات خیبر و بدر',
    roleType: 'commander',
    cause: 'در ۴ تیر ۱۳۶۷، پس از اطمینان از تخلیه نیروها از جزیره مجنون، هنگام ترک مقر فرماندهی هدف موشک هلی‌کوپترهای ارتش عراق قرار گرفت و به شهادت رسید.',
    dateNote: 'اصلاح راستی‌آزمایی‌شده: رکورد پیشین شهادت او را ۱۸ دی ۱۳۶۲ در خیبر ثبت بود؛ منابع (ویکی‌پدیای فارسی، تابناک، دفاع‌پرس) شهادت ۴ تیر ۱۳۶۷ در مجنون و بازگشت پیکر پس از ۲۲ سال (۱۳۸۹) و دفن در اهواز را تأیید می‌کنند.',
    bio: 'فرمانده تیپ ۳۷ نور در حمیدیه؛ با رهاسازی آب کانال سلمان به کرخه‌کور از پیشروی عراق به اهواز جلوگیری کرد. بنیان‌گذار سپاه بستان و هویزه و طراح عملیات‌های هور (خیبر و بدر).',
    legacy: 'نماد «دلاور هور» و فریب عملیاتی؛ کتاب «هوری» درباره زندگی اوست.',
    sources: ['jang-atlas', 'defa-center', 'navidshahed'],
    confidence: 'B',
    image: {
      url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6f6bf04d88ed.jpg',
      sourceName: 'جست‌وجوی تصویر وب (آرشیو عمومی)',
      verified: 'pending-review',
    },
  },""",
    'hashemi-ali-record')

# ── همت ──
rep("""    id: 'hammet',
    name: 'محمدابراهیم همت',
    birth: '۱۳۳۷، شاهرود',
    martyrdomDate: '1362-12-24',
    age: '۲۶ سال',""",
    """    id: 'hammet',
    name: 'محمدابراهیم همت',
    birth: '۱۳۳۴، شهرضا',
    martyrdomDate: '1362-12-24',
    age: '۲۸ سال',""",
    'hammet-birth')
rep("""    cause: 'در عملیات خیبر، هنگام فرماندهی دفاع از جزایر مجنون در برابر پاتک‌های شیمیایی دشمن به شهادت رسید.',
    bio: 'فرمانده محبوب لشکر ۲۷؛ پیش‌تر در مروارید به‌عنوان فرمانده میدانی دریایی حاضر بود و در طریق‌القدس و خیبر نقش محوری داشت.',
    legacy: 'نماد فرماندهی «رزمنده–مدرس»؛ فصل‌های کتاب «گنجشک و ققنوس» و خاطرات هم‌رزمانش، سند انسانی جبهه هور است.',
    sources: ['jang-atlas', 'defa-center'],
    confidence: 'B',
  },
  {
    id: 'bakri-hamid',""",
    """    cause: 'در عملیات خیبر، هنگام فرماندهی دفاع از جزایر مجنون در برابر پاتک‌های شیمیایی دشمن به شهادت رسید.',
    bio: 'فرمانده محبوب لشکر ۲۷؛ پیش‌تر در مروارید به‌عنوان فرمانده میدانی دریایی حاضر بود و در طریق‌القدس و خیبر نقش محوری داشت.',
    legacy: 'نماد فرماندهی «رزمنده–مدرس»؛ فصل‌های کتاب «گنجشک و ققنوس» و خاطرات هم‌رزمانش، سند انسانی جبهه هور است.',
    sources: ['jang-atlas', 'defa-center', 'navidshahed'],
    confidence: 'B',
    dateNote: 'اصلاح راستی‌آزمایی‌شده: تولد ۱۲ فروردین ۱۳۳۴ شهرضا (روزنامه جوان — رکورد پیشین «شاهرود ۱۳۳۷» بود)؛ درباره روز دقیق شهادت منابع ۱۷ تا ۲۴ اسفند ۱۳۶۲ را ثبت کرده‌اند (ایسنا: ۱۷ اسفند) — تاریخ رایج حفظ و مغایرت ثبت شده است.',
    image: {
      url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b4042b6be416.jpg',
      sourceName: 'جست‌وجوی تصویر وب (آرشیو عمومی)',
      verified: 'pending-review',
    },
  },
  {
    id: 'bakri-hamid',""",
    'hammet-image')

# ── حمید باکری ──
rep("""    cause: 'در عملیات خیبر، در نبرد جزیره بوارین هنگام جانشینی فرماندهی یگان به شهادت رسید؛ برادر بزرگ‌ترش مهدی یک ماه پیش‌تر در همین عملیات شهید شده بود.',""",
    """    cause: 'در عملیات خیبر، در نبرد جزیره بوارین هنگام جانشینی فرماندهی یگان به شهادت رسید؛ برادر بزرگ‌ترش مهدی بیش از یک ماه بعد در عملیات بدر شهید شد.',""",
    'bakri-hamid-cause')
rep("""    sources: ['jang-atlas', 'defa-center'],
    confidence: 'B',
  },
  {
    id: 'kharrazi',""",
    """    sources: ['jang-atlas', 'defa-center', 'navidshahed'],
    confidence: 'B',
    dateNote: 'برخی منابع تا مدت‌ها پیکر او را مفقودالاثر ثبت کرده بودند؛ نوید شاهد محل دفن او را گلزار شهدا باغ‌رضوان ارومیه ثبت کرده است.',
    image: {
      url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/11dbc016dbed.jpg',
      sourceName: 'جست‌وجوی تصویر وب (آرشیو عمومی)',
      verified: 'pending-review',
    },
  },
  {
    id: 'kharrazi',""",
    'bakri-hamid-image')

# ── خرازی ──
rep("""    id: 'kharrazi',
    name: 'حسین خرازی',
    birth: '۱۳۳۶، تهران',
    martyrdomDate: '1365-12-25',
    age: '۲۹ سال',
    place: 'شلمچه (کربلای ۵)',
    opIds: ['kheibar', 'valfajr-8', 'karbala-5'],
    regionNote: '۲۱ اسفند در شلمچه زخمی شد و در ۲۵ اسفند بر اثر جراحات به شهادت رسید (بر پایه منابع رایج ایرانی؛ برخی منابع ۲۴ اسفند گفته‌اند)',""",
    """    id: 'kharrazi',
    name: 'حسین خرازی',
    birth: '۱۳۳۶، اصفهان',
    martyrdomDate: '1365-12-25',
    age: '۲۹ سال',
    place: 'شلمچه (کربلای ۵)',
    opIds: ['kheibar', 'valfajr-8', 'karbala-5'],
    regionNote: 'اصلاح راستی‌آزمایی‌شده: تولد ۱ دی ۱۳۳۶ اصفهان (مرکز اسناد انقلاب اسلامی). درباره روز شهادت منابع اختلاف دارند: ویکی‌پدیای فارسی ۸ اسفند ۱۳۶۵ و منابع ایرانی رایج ۲۱ اسفند (زخمی شدن) و ۲۵ اسفند (شهادت) را ثبت کرده‌اند — هر دو ثبت شده است.',""",
    'kharrazi-record')
rep("""    confidence: 'B',
    quote: 'از این کوله‌بار که در راه خدا مانده غمگین نیستم.',
  },
  {
    id: 'babaei',""",
    """    confidence: 'B',
    image: {
      url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1d1e7b70cc80.jpg',
      sourceName: 'جست‌وجوی تصویر وب (آرشیو عمومی)',
      verified: 'pending-review',
    },
    quote: 'از این کوله‌بار که در راه خدا مانده غمگین نیستم.',
  },
  {
    id: 'babaei',""",
    'kharrazi-image')

# ── بابایی ──
rep("""    role: 'فرمانده پایگاه هوایی تبریز',
    roleType: 'pilot',
    cause: 'در ۱۵ مرداد ۱۳۶۶ در حادثه سقوط هواپیما در پرواز عملیاتی به شهادت رسید.',""",
    """    role: 'فرمانده نیروی هوایی ارتش (۱۳۶۲–۱۳۶۶)',
    roleType: 'pilot',
    cause: 'در ۱۵ مرداد ۱۳۶۶ در حادثه سقوط هواپیما در پرواز عملیاتی به شهادت رسید.',
    dateNote: 'اصلاح راستی‌آزمایی‌شده: مسئولیت او بر پایه ویکی‌پدیای فارسی «فرماندهی نیروی هوایی ارتش از ۱۳۶۲ تا ۱۳۶۶» است (نوید شاهد: معاون عملیات نیروی هوایی)؛ رکورد پیشین «فرمانده پایگاه تبریز» ثبت بود.',""",
    'babaei-role')
rep("""    legacy: 'نماد آشتی ارتش نو و انقلاب؛ زندگی‌نامه «پرواز تا آسمان‌ها» از پرخواننده‌ترین سندهای شفاهی نیروی هوایی است.',
    sources: ['fa-wiki-war', 'navidshahed'],
    confidence: 'B',
  },
]""",
    """    legacy: 'نماد آشتی ارتش نو و انقلاب؛ زندگی‌نامه «پرواز تا آسمان‌ها» از پرخواننده‌ترین سندهای شفاهی نیروی هوایی است.',
    sources: ['fa-wiki-war', 'navidshahed'],
    confidence: 'B',
    image: {
      url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b4c389ec81c4.jpg',
      sourceName: 'جست‌وجوی تصویر وب (آرشیو عمومی)',
      verified: 'pending-review',
    },
  },
]""",
    'babaei-image')

# ── jahandar image fix (change pending source to same pattern) ──
rep("""    sources: ['fa-wiki-war', 'jang-atlas', 'navidshahed'],
    confidence: 'A',
    image: {
      url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3fb8a77bc6f0.jpg',""",
    """    sources: ['fa-wiki-war', 'jang-atlas', 'navidshahed'],
    confidence: 'A',
    image: {
      url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3fb8a77bc6f0.jpg',""",
    'jahandar-image-keep')

open(PATH, 'w', encoding='utf-8').write(src)
print(f'APPLIED ({len(applied)}):')
for a in applied: print('  ✓', a)
if failed:
    print(f'FAILED ({len(failed)}):')
    for f in failed: print('  ✗', f)
    sys.exit(1)
print('ALL OK')
