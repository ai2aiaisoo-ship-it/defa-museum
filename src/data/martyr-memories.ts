// ─── «خاطرات شهدا و آرامگاه‌ها» — تالار مستقل روایت و آرامگاه شهدای جنگ تحمیلی ───
// سیاست راستی‌آزمایی موزه:
// ۱) هر خاطره/روایت فقط از منابع اینترنتی بازِ مشخص و با URL اصلی ثبت می‌شود.
// ۲) متن‌ها عین جملات منبع (verbatim) یا خلاصه توصیفی صریح‌اند؛ نوع هر مدخل مشخص است.
// ۳) جایی که سند خاطره مستقل قابل‌ارجاع یافت نشد، به‌جای نقل نامعین، مدخل «شفاف‌سازی موزه» ثبت شده است.
// ۴) عکس‌های مزار از جست‌وجوی وب باز جمع‌آوری شده و همه از «مرور تصویری آرشیو موزه» گذشته‌اند
//    (کارتابل پیش‌مرور: src/data/grave-reviews.ts)؛ مرور نام‌دار کارشناس می‌تواند نتیجه را بازبینی کند؛
//    در مواردی که عکس مزار اختصاصی در دسترس نیست، صریحاً گفته می‌شود و تنها تصویر کلی گلزار با برچسب «تصویر زمینه» می‌آید.

import type { Confidence } from './types'

export type MemoryKind = 'memoir' | 'will' | 'book' | 'narration' | 'museum-note'

export const MEMORY_KIND_LABELS: Record<MemoryKind, string> = {
  memoir: 'خاطره',
  will: 'وصیت',
  book: 'منبع کتابی',
  narration: 'روایت / شرح شهادت',
  'museum-note': 'شفاف‌سازی موزه',
}

export interface MartyrMemory {
  id: string
  martyrId: string
  kind: MemoryKind
  /** راوی یا منبعِ روایت */
  narrator?: string
  text: string
  /** آیا متن، نقل مستقیم منبع است */
  verbatim: boolean
  sourceName: string
  sourceUrl?: string
  confidence: Confidence
}

export interface GravePhoto {
  url: string
  sourceName: string
  /** توضیح صادقانه درباره چیستی تصویر */
  caption: string
  verified: 'archival-confirmed' | 'pending-review'
  /**
   * نوع صادقانه تصویر — جلوگیری از «آدرس‌دهی غلط هویتی»:
   * grave: سنگ مزار/آرامگاهِ به‌نسبت این شهید (برچسب «مزار» فقط همین‌جا مجاز است)
   * memorial: یادمان/یادبودِ مرتبط (نه سنگ مزار اختصاصی)
   * context: تصویر زمینه (نمای گلزار، آرک یادمان، اینفوگرافیک سانحه)
   */
  photoKind?: 'grave' | 'memorial' | 'context'
  /** فایل محلی تصویر پس از بومی‌سازی (برای شفافیت منبع) — URL اصلی جست‌وجو در کپشن ثبت است */
  localFile?: boolean
}

export interface MartyrBurial {
  martyrId: string
  cemetery: string
  city: string
  detail?: string
  photo?: GravePhoto
  note?: string
  confidence: Confidence
  sourceName: string
  sourceUrl?: string
}

export const IMG = '/images/mazar'

/** برچسب کوتاه صادقانه هر نوع تصویر — در کارتابل و نوار مزار استفاده می‌شود */
export const PHOTO_KIND_LABELS: Record<NonNullable<GravePhoto['photoKind']>, string> = {
  grave: 'سنگ مزار',
  memorial: 'یادمان / یادبود',
  context: 'تصویر زمینه',
}

export const MARTYR_BURIALS: MartyrBurial[] = [
  {
    martyrId: 'chamran',
    cemetery: 'بهشت زهرا (س)',
    city: 'تهران',
    detail: 'قطعه ۲۴، ردیف ۷۷، مزار ۲۴ مکرر',
    photo: { url: `${IMG}/d0df7b1b6213.jpeg`, sourceName: 'جست‌وجوی تصویر وب — بومی‌سازی‌شده در آرشیو موزه', caption: 'نمایی از گلزار شهدای دفاع مقدس؛ عکس اختصاصی مزار در آرشیو باز در دسترس نیست', verified: 'pending-review', photoKind: 'context', localFile: true },
    note: 'اطلاعات دقیق قطعه و ردیف از پرونده رسمی شهید در پایگاه نوید شاهد ثبت است.',
    confidence: 'A',
    sourceName: 'نوید شاهد — پرونده شهید چمران',
    sourceUrl: 'https://navideshahed.com/fa/vip/135396',
  },
  {
    martyrId: 'rajaei',
    cemetery: 'بهشت زهرا (س)',
    city: 'تهران',
    detail: 'قطعه ۷۲ (جنب یادمان شهدای هفتم تیر)',
    photo: { url: `${IMG}/bceb0d266f84.jpg`, sourceName: 'خبرگزاری مهر — بومی‌سازی‌شده در آرشیو موزه', caption: 'آرک یادمان شهدای هفتم تیر (تصویر زمینه؛ جوار مزار شهیدان رجایی و باهنر در قطعه ۷۲) — مزار اختصاصی در آرشیو باز در دسترس نیست', verified: 'pending-review', photoKind: 'context', localFile: true },
    note: 'بر پایه گزارش دفاع‌پرس، مزار شهیدان رجایی و باهنر در قطعه ۷۲ بهشت زهراست؛ تصویر نمایش‌داده‌شده یادمان نزدیک مزار است، نه سنگ مزار اختصاصی.',
    confidence: 'B',
    sourceName: 'خبرگزاری دفاع‌پرس — «مزار شهیدان رجایی و باهنر گلباران شد»',
    sourceUrl: 'https://defapress.ir/fa/news/359883',
  },
  {
    martyrId: 'bahonar',
    cemetery: 'بهشت زهرا (س)',
    city: 'تهران',
    detail: 'قطعه ۷۲ (هم‌آرامگاه شهید رجایی)',
    photo: { url: `${IMG}/bceb0d266f84.jpg`, sourceName: 'خبرگزاری مهر — بومی‌سازی‌شده در آرشیو موزه', caption: 'آرک یادمان شهدای هفتم تیر (تصویر زمینه؛ هم‌آرامگاه شهیدان رجایی و باهنر در قطعه ۷۲) — مزار اختصاصی در آرشیو باز در دسترس نیست', verified: 'pending-review', photoKind: 'context', localFile: true },
    confidence: 'B',
    sourceName: 'خبرگزاری دفاع‌پرس — «مزار شهیدان رجایی و باهنر گلباران شد»',
    sourceUrl: 'https://defapress.ir/fa/news/359883',
  },
  {
    martyrId: 'falahi',
    cemetery: 'بهشت زهرا (س)',
    city: 'تهران',
    detail: 'قطعه ۲۴ — در جوار مزار آیت‌الله طالقانی',
    photo: { url: `${IMG}/c78f2dadf4ee.jpg`, sourceName: 'جست‌وجوی تصویر وب — بومی‌سازی‌شده در آرشیو موزه', caption: 'اینفوگرافیک مستند سانحه سی‌۱۳۰ (۷ مهر ۱۳۶۰) که شهادت فلاحی، فکوری، نامجو، کلاهدوز و جهان‌آرا در آن رخ داد — اسناد تصویری مزار اختصاصی هنوز از آرشیو رسمی استخراج نشده است', verified: 'pending-review', photoKind: 'context', localFile: true },
    note: 'ویکی‌پدیای فارسی آرامگاه فلاحی را قطعه ۲۴ بهشت زهرا ثبت کرده است.',
    confidence: 'B',
    sourceName: 'ویکی‌پدیای فارسی — ولی‌الله فلاحی / دفاع‌پرس',
    sourceUrl: 'https://fa.wikipedia.org/wiki/ولی‌الله_فلاحی',
  },
  {
    martyrId: 'fakoori',
    cemetery: 'بهشت زهرا (س)',
    city: 'تهران',
    detail: 'قطعه ۲۴ — هم‌آرامگاه شهدای سانحه ۷ مهر ۱۳۶۰',
    photo: { url: `${IMG}/c78f2dadf4ee.jpg`, sourceName: 'پایگاه گلزار شهدا — بومی‌سازی‌شده در آرشیو موزه', caption: 'اینفوگرافیک مستند سانحه سی‌۱۳۰ کهریزک (۷ مهر ۱۳۶۰) — تصویر سند سانحه است، نه عکس مزار اختصاصی', verified: 'pending-review', photoKind: 'context', localFile: true },
    confidence: 'B',
    sourceName: 'پایگاه گلزار شهدا (فرهنگ ایثار و شهادت) — پرونده جواد فکوری',
    sourceUrl: 'https://www.golzar.info/19440',
  },
  {
    martyrId: 'namjou',
    cemetery: 'بهشت زهرا (س)',
    city: 'تهران',
    detail: 'قطعه ۲۴ — هم‌آرامگاه شهدای سانحه ۷ مهر ۱۳۶۰',
    photo: { url: `${IMG}/c78f2dadf4ee.jpg`, sourceName: 'دفاع‌پرس — بومی‌سازی‌شده در آرشیو موزه', caption: 'اینفوگرافیک مستند سانحه سی‌۱۳۰ کهریزک (۷ مهر ۱۳۶۰) — تصویر سند سانحه است، نه عکس مزار اختصاصی', verified: 'pending-review', photoKind: 'context', localFile: true },
    note: 'ویکی‌پدیای فارسی: مدفن «قطعه ۲۴، بهشت زهرا، تهران».',
    confidence: 'B',
    sourceName: 'ویکی‌پدیای فارسی — سید موسی نامجو / دفاع‌پرس',
    sourceUrl: 'https://defapress.ir/fa/news/617207',
  },
  {
    martyrId: 'jahandar',
    cemetery: 'بهشت زهرا (س)',
    city: 'تهران',
    detail: 'قطعه ۲۴، ردیف ۹۸، مزار ۴۴',
    photo: { url: `${IMG}/831aef135f72.jpeg`, sourceName: 'دفاع‌پرس — بومی‌سازی‌شده در آرشیو موزه', caption: 'سنگ مزار نقش‌پرچم شهید جهان‌آرا (تأیید در پیش‌مرور آرشیو)', verified: 'pending-review', photoKind: 'grave', localFile: true },
    note: 'درباره مزار نقش‌پرچم شهید جهان‌آرا گزارش تصویری دفاع‌پرس منتشر شده است.',
    confidence: 'B',
    sourceName: 'نوید شاهد — پرونده شهید جهان‌آرا / دفاع‌پرس',
    sourceUrl: 'https://navideshahed.com/fa/vip/187624',
  },
  {
    martyrId: 'daghayeghi',
    cemetery: 'گلزار شهدای امیدیه',
    city: 'امیدیه، خوزستان',
    detail: 'گلزار شهدا؛ یادبودی نیز در قطعه ۲۴ بهشت زهرا (جنب شهدای ۷۲ تن) رونمایی شده است',
    photo: { url: `${IMG}/135289c1f9f1.jpg`, sourceName: 'ویکی‌پدیای فارسی — بومی‌سازی‌شده در آرشیو موزه', caption: 'سنگ مزار شهید دقایقی با نقش پرتره و نام درج‌شده (تأیید در پیش‌مرور آرشیو)', verified: 'pending-review', photoKind: 'grave', localFile: true },
    note: 'ویکی‌پدیای فارسی: «وی در گلزار شهدای امیدیه در استان خوزستان دفن گردید»؛ مراسم رونمایی مزار یادبود در اردیبهشت ۱۴۰۴ برگزار شد.',
    confidence: 'B',
    sourceName: 'ویکی‌پدیای فارسی — اسماعیل دقایقی / نوید شاهد',
    sourceUrl: 'https://fa.wikipedia.org/wiki/اسماعیل_دقایقی',
  },
  {
    martyrId: 'doran',
    cemetery: 'گورستان ملایه',
    city: 'آبادان',
    detail: 'بر اساس وصیت، در میان گلزار شهیدان ملایه آبادان',
    note: 'پیکر او پس از حدود ۲۰ سال به همراه ۵۷۰ شهید دیگر به میهن بازگشت (نوید شاهد) و بر اساس وصیتش در گلزار شهیدان ملایه آرام گرفت. عکس اختصاصی مزار در آرشیو باز در دسترس نیست.',
    confidence: 'B',
    sourceName: 'نوید شاهد — «۱۴ خاطره کوتاه از خلبانی که داوطلب شهادت بود» / ویکی‌پدیای فارسی — عباس دوران',
    sourceUrl: 'https://navideshahed.com/fa/news/395238/',
  },
  {
    martyrId: 'vazvaei',
    cemetery: 'بهشت زهرا (س)',
    city: 'تهران',
    detail: 'قطعه ۲۶، ردیف ۴۴، مزار ۴۶',
    photo: { url: `${IMG}/c8bba0c5aa8d.jpeg`, sourceName: 'پایگاه گلزار شهدا — بومی‌سازی‌شده در آرشیو موزه', caption: 'سنگ مزار شهید وزوایی با پرتره، همخوان با نشانه‌گر قطعه ۲۶/ردیف ۴۴/مزار ۴۶ (تأیید در پیش‌مرور آرشیو)', verified: 'pending-review', photoKind: 'grave', localFile: true },
    confidence: 'A',
    sourceName: 'پایگاه گلزار شهدا — پرونده محسن وزوایی',
    sourceUrl: 'https://www.golzar.info/21007',
  },
  {
    martyrId: 'kaveh',
    cemetery: 'گلزار شهدای مشهد (بهشت رضا)',
    city: 'مشهد',
    detail: 'قطعه شهدا؛ پیکر او به پیشنهاد خودش و با موافقت خانواده، در میان بسیجی‌ها و رزمنده‌ها دفن شد',
    photo: { url: `${IMG}/0acd17ee7aab.jpg`, sourceName: 'جست‌وجوی تصویر وب — بومی‌سازی‌شده در آرشیو موزه', caption: 'پوستر یادبود شهید محمود کاوه در بهشت رضا مشهد — تصویر زمینه یادمان، نه سنگ مزار', verified: 'pending-review', photoKind: 'context', localFile: true },
    note: 'روایت پیشنهاد محل دفن و شفاف‌سازی درباره عدم تدفین در حرم رضوی از منابع خبری منتشرشده است.',
    confidence: 'B',
    sourceName: 'پایگاه گلزار شهدا / خبرگزاری‌ها — پرونده محمود کاوه',
    sourceUrl: 'https://fa.wikipedia.org/wiki/محمود_کاوه',
  },
  {
    martyrId: 'redanipour',
    cemetery: 'گلستان شهدا (تخت فولاد) — یادبود',
    city: 'اصفهان',
    detail: 'وضعیت پیکر: مفقودالاثر؛ یادبود او در گلستان شهدا اصفهان ثبت است',
    photo: { url: `${IMG}/6faa1f7b5c3e.jpg`, sourceName: 'جست‌وجوی تصویر وب — بومی‌سازی‌شده در آرشیو موزه', caption: 'گلستان شهدای اصفهان — یادمان شهید ردانی‌پور (پیکر مفقودالاثر؛ سنگ اختصاصی در کار نیست)', verified: 'pending-review', photoKind: 'memorial', localFile: true },
    note: 'پایگاه گلزار شهدا وضعیت پیکر او را «جاویدالاثر» و محل یادبود را گلزارشهدای اصفهان ثبت کرده است؛ برخی منابع شهادت او را در چزابه و برخی در حاج‌عمران نوشته‌اند.',
    confidence: 'C',
    sourceName: 'پایگاه گلزار شهدا — پرونده مصطفی ردانی‌پور',
    sourceUrl: 'https://www.golzar.info/316136',
  },
  {
    martyrId: 'bagheri',
    cemetery: 'بهشت زهرا (س)',
    city: 'تهران',
    detail: 'قطعه ۲۴، ردیف ۸۰، مزار ۲۴',
    photo: { url: `${IMG}/8261128077b6.jpg`, sourceName: 'پایگاه خبری دانشگاه تهران — بومی‌سازی‌شده در آرشیو موزه', caption: 'تصویر سنگ مزار یافت‌شده در جست‌وجو که در مرور کارشناسی مغایر پرونده شهید تشخیص داده شد و از نمایش مزار خارج شد (در کارتابل خاکستری‌نمایی شده است)', verified: 'pending-review', photoKind: 'context', localFile: true },
    confidence: 'B',
    sourceName: 'پایگاه خبری دانشگاه تهران — پرونده شهید غلامحسین افشردی (حسن باقری)',
    sourceUrl: 'https://news.ut.ac.ir/fa/page/8289',
  },
  {
    martyrId: 'bakri-mehdi',
    cemetery: 'گلزار شهدای دفاع مقدس ارومیه',
    city: 'ارومیه',
    detail: 'آرامگاه سردار شهید باکری (قطعه دو)',
    photo: { url: `${IMG}/f693c80fd09f.jpeg`, sourceName: 'خبرگزاری بریش — بومی‌سازی‌شده در آرشیو موزه', caption: 'سنگ مزار با نقش پرتره در گلزار شهدا ارومیه (نیازمند تأیید نهایی هویت‌سنجی تصویر)', verified: 'pending-review', photoKind: 'grave', localFile: true },
    note: 'برادر بزرگ‌ترش حمید باکری نیز در گلزار شهدا ارومیه (باغ‌رضوان) آرام دارد.',
    confidence: 'B',
    sourceName: 'پایگاه گلزار شهدا / گزارش‌های خبری — پرونده مهدی باکری',
    sourceUrl: 'https://www.golzar.info/316089',
  },
  {
    martyrId: 'bakri-hamid',
    cemetery: 'گلزار شهدا باغ‌رضوان',
    city: 'ارومیه',
    detail: 'گلزار شهدا؛ برخی منابع تا مدت‌ها او را مفقودالاثر ثبت کرده بودند',
    photo: { url: `${IMG}/5689e4de2f8d.jpg`, sourceName: 'نوید شاهد — بومی‌سازی‌شده در آرشیو موزه', caption: 'مزار با نقش پرتره در گلزار شهدا باغ‌رضوان ارومیه (نیازمند تأیید نهایی هویت‌سنجی تصویر)', verified: 'pending-review', photoKind: 'grave', localFile: true },
    confidence: 'B',
    sourceName: 'نوید شاهد — پرونده شهید حمید باکری',
    sourceUrl: 'https://navideshahed.com/fa/vip/19444',
  },
  {
    martyrId: 'yaghchian',
    cemetery: 'آرامستان وادی رحمت',
    city: 'تبریز',
    detail: 'پیکر او پس از عملیات خیبر در جزیره مجنون جا ماند و تا سال ۱۳۷۵ مفقودالاثر بود؛ در همان سال در پی تفحص کشف و در وادی رحمت تبریز دفن شد',
    note: 'عکس اختصاصی مزار در آرشیو باز در دسترس نیست.',
    confidence: 'A',
    sourceName: 'ویکی‌پدیای فارسی — مرتضی یاغچیان / نوید شاهد',
    sourceUrl: 'https://fa.wikipedia.org/wiki/مرتضی_یاغچیان',
  },
  {
    martyrId: 'hashemi-ali',
    cemetery: 'اهواز — یادمان شهدای قرارگاه نصرت (بهشت آباد)',
    city: 'اهواز',
    detail: 'پیکر او ۲۲ سال مفقود بود و در سال ۱۳۸۹ نزدیک محل استقرار قرارگاه ششم کشف و در اهواز به خاک سپرده شد',
    photo: { url: `${IMG}/903bde676a95.jpeg`, sourceName: 'جست‌وجوی تصویر وب — بومی‌سازی‌شده در آرشیو موزه', caption: 'آرامگاه شهید با پرتره و گل‌برگ (نیازمند تأیید نهایی هویت‌سنجی تصویر)', verified: 'pending-review', photoKind: 'grave', localFile: true },
    confidence: 'A',
    sourceName: 'ویکی‌پدیای فارسی — علی هاشمی (نظامی) / تابناک',
    sourceUrl: 'https://fa.wikipedia.org/wiki/علی_هاشمی_(نظامی)',
  },
  {
    martyrId: 'hammet',
    cemetery: 'گلزار شهدای شهرضا — جوار امامزاده شهرضا (ع)',
    city: 'شهرضا، اصفهان',
    detail: 'برخلاف تصور رایج، مزار اصلی او در بهشت زهرا نیست؛ در شهرضا در میان شهدای شهر دفن شده است. سنگ یادبودی نیز به نام او در قطعه ۲۴ بهشت زهرا کنار دو فرمانده دیگر لشکر ۲۷ نصب است',
    photo: { url: `${IMG}/1b7158abf2b8.jpeg`, sourceName: 'روزنامه جوان — بومی‌سازی‌شده در آرشیو موزه', caption: 'مزار سنگی با پرتره در گلزار شهدا شهرضا (نیازمند تأیید نهایی هویت‌سنجی تصویر)', verified: 'pending-review', photoKind: 'grave', localFile: true },
    confidence: 'B',
    sourceName: 'روزنامه جوان — «مزار شهید همت کجاست؟ + عکس»',
    sourceUrl: 'https://www.javanonline.ir/fa/news/419468',
  },
  {
    martyrId: 'kharrazi',
    cemetery: 'گلستان شهدای اصفهان — قطعه شهدای کربلای ۵ (فرماندهان)',
    city: 'اصفهان',
    detail: 'منتهی‌الیه شمال‌غربی گلستان شهدا؛ در طرفین مزار او، قبور احمد کاظمی و محمدرضا زاهدی است',
    photo: { url: `${IMG}/f1ccdbae747a.jpg`, sourceName: 'ویکی‌پدیای فارسی — بومی‌سازی‌شده در آرشیو موزه', caption: 'سنگ مزار با گل نرگس — نام «حاج حسین خرازی» روی صندوق مرمرین (تأیید در پیش‌مرور آرشیو)', verified: 'pending-review', photoKind: 'grave', localFile: true },
    confidence: 'B',
    sourceName: 'ویکی‌پدیای فارسی — حسین خرازی / نشان (پرونده مزار)',
    sourceUrl: 'https://fa.wikipedia.org/wiki/حسین_خرازی',
  },
  {
    martyrId: 'babaei',
    cemetery: 'گلزار شهدای قزوین',
    city: 'قزوین',
    detail: 'جوار امامزاده حسین (ع)، بلوار جمهوری اسلامی',
    photo: { url: `${IMG}/1536506b9dc6.jpg`, sourceName: 'جست‌وجوی تصویر وب — بومی‌سازی‌شده در آرشیو موزه', caption: 'یادمان شهید بابایی با پرتره در گلزار شهدا قزوین (نیازمند تأیید نهایی هویت‌سنجی تصویر)', verified: 'pending-review', photoKind: 'memorial', localFile: true },
    note: 'چند منبع مستقل (بلد، نشان، فدای ولایت) آرامگاه او را گلزار شهدا قزوین ثبت کرده‌اند؛ یک منبع (گلزار شهدا) «لواسان» نوشته است که مغایرت دارد و ثبت شده است.',
    confidence: 'B',
    sourceName: 'آدرس‌یاب آرامگاه شهید بابایی (بلد/نشان) + فدای ولایت',
    sourceUrl: 'https://neshan.org/maps/places/c79b66d6dfe5d250931d0637630d07de',
  },
]

// ─── خاطرات، وصیت‌ها و روایت‌ها ───
export const MARTYR_MEMORIES: MartyrMemory[] = [
  // ── شهید چمران ──
  {
    id: 'mem-chamran-1', martyrId: 'chamran', kind: 'memoir', verbatim: true, confidence: 'B',
    narrator: 'شهید چمران (نوشته جبهه سوسنگرد)',
    text: '«سوسنگرد برای ما اهمیت خاصی دارد زیرا معبر حمیدیه و اهواز است و دشمن به مدت چند روز سوسنگرد را محاصره کرده بود.» — بخشی از خاطرات دکتر چمران درباره حماسه آزادسازی سوسنگرد که در مقاله بصیرت بازنشر شده است.',
    sourceName: 'بصیرت — «خاطرات دکتر چمران از حماسه آزادسازی سوسنگرد»',
    sourceUrl: 'https://basirat.ir/fa/news/225267',
  },
  {
    id: 'mem-chamran-2', martyrId: 'chamran', kind: 'book', verbatim: false, confidence: 'B',
    text: 'کتاب «چمران: به روایت همسر شهید» نوشته حبیبه جعفریان (نشر روایت فتح) و مجموعه «یادگاران ۱ — روایتگر خاطرات شهید چمران» (یکصد خاطره کوتاه درباره زندگی، روحیات و شهادت او) از اصلی‌ترین منابع خاطرات این شهیدند.',
    sourceName: 'طاقچه / کتابخانه دیجیتال — چمران به روایت همسر شهید',
    sourceUrl: 'https://taaghche.com/book/832',
  },
  // ── شهید رجایی ──
  {
    id: 'mem-rajaei-1', martyrId: 'rajaei', kind: 'memoir', verbatim: false, confidence: 'B',
    text: 'خاطراتی که از سوی خبرگزاری جماران «برای اولین بار منتشر شد»: از بازی در تئاتر و خرید از دستفروش‌ها در جوانی و نخست‌وزیری، تا پاسخ تند به یکی از نزدیکان اشرف پهلوی — روایتی از ساده‌زیستی و صلابت شهید رجایی.',
    sourceName: 'خبرگزاری جماران — «خاطراتی از شهید رجایی که برای اولین بار منتشر می‌شوند»',
    sourceUrl: 'https://www.jamaran.news/بخش-سیاست-12/1523028',
  },
  // ── شهید باهنر ──
  {
    id: 'mem-bahonar-1', martyrId: 'bahonar', kind: 'museum-note', verbatim: false, confidence: 'B',
    text: 'در جمع‌بندی منابع باز اینترنت، خاطره مستقلِ قابل‌ارجاع دقیق برای شهید باهنر به‌دست نیامد؛ مطابق سیاست ضدجعل موزه به‌جای نقل نامعین، پرونده وی از طریق سند مزار (قطعه ۷۲ بهشت زهرا) و منابع رسمی پیوند داده شده است.',
    sourceName: 'سیاست راستی‌آزمایی موزه',
  },
  // ── شهید فلاحی ──
  {
    id: 'mem-falahi-1', martyrId: 'falahi', kind: 'memoir', verbatim: true, confidence: 'B',
    narrator: 'یکی از محافظان شهید فلاحی',
    text: 'شهید فلاحی با لبخندی گفت: «تو از من خاطر جمع باش، چون انسان شهید نمی‌شود مگر آنکه قبل از شهادت، کامل شده باشد. ضمن آنکه من هنوز به آرزویم نرسیده‌ام.»',
    sourceName: 'حوزه — «خاطره یکی از محافظین» (پایگاه حوزه)',
    sourceUrl: 'https://hawzah.net/fa/Mostabser/View/65194/11247',
  },
  {
    id: 'mem-falahi-2', martyrId: 'falahi', kind: 'narration', verbatim: false, confidence: 'B',
    text: 'پایگاه شهدای شاخص روایت کرده است: در ابتدای حمله صدام به ایران، تیمسار فلاحی در حضور امام راحل بود و ایشان نظر امیر فلاحی را درباره وضعیت جنگ پرسید — نگاه راهبردی او به ماهیت دفاعی جنگ از نخستین روزها در همین جلسات شکل گرفت.',
    sourceName: 'پایگاه شهدای شاخص (شهدای شاخص) — «خاطراتی از شهید ولی فلاحی»',
    sourceUrl: 'https://shohada.org/fa/shahid/content/350707',
  },
  // ── شهید فکوری ──
  {
    id: 'mem-fakoori-1', martyrId: 'fakoori', kind: 'museum-note', verbatim: false, confidence: 'B',
    text: 'خاطره مستقلِ قابل‌ارجاع از منابع باز برای شهید فکوری در این جمع‌بندی یافت نشد؛ تنها شرح مسئولیت‌های او (طراحی عملیات‌های هوایی نخست جنگ مانند کمان ۹۹) از ویکی‌پدیای فارسی و پایگاه گلزار شهدا ثبت است.',
    sourceName: 'سیاست راستی‌آزمایی موزه',
  },
  // ── شهید نامجو ──
  {
    id: 'mem-namjou-1', martyrId: 'namjou', kind: 'memoir', verbatim: false, confidence: 'B',
    text: 'روایت ساده‌زیستی شهید نامجو از مرکز اسناد انقلاب اسلامی: در زمانی که وزیر دفاع بود، هنوز در یک خانه استیجاری کوچک با ماهی ۲۰۰۰ تومان کرایه، در دورافتاده‌ترین نقطه خیابان پیروزی زندگی می‌کرد.',
    sourceName: 'مرکز اسناد انقلاب اسلامی (irdc.ir) — «روایتی از ساده‌زیستی شهید نامجو»',
    sourceUrl: 'https://irdc.ir/fa/news/8081',
  },
  // ── شهید جهان‌آرا ──
  {
    id: 'mem-jahanara-1', martyrId: 'jahandar', kind: 'memoir', verbatim: false, confidence: 'B',
    text: 'از «ده خاطره از شهید محمد جهان‌آرا» (سراج اندیشه): روزِ جهان‌آرا خرمشهر بود؛ از روزی که عراق به خرمشهر هجوم آورد، محمد همّ خود را وقف جنگ کرد.',
    sourceName: 'سراج اندیشه — «ده خاطره از شهید محمد جهان‌آرا»',
    sourceUrl: 'https://serajnet.org/post/detail/Fa/2-62-13-2-1-0',
  },
  {
    id: 'mem-jahanara-2', martyrId: 'jahandar', kind: 'narration', verbatim: true, confidence: 'B',
    narrator: 'مقام معظم رهبری (حضرت آیت‌الله خامنه‌ای)',
    text: '«من مایلم اینجا یادی بکنم از محمد جهان‌آرا، شهید عزیز خرمشهر و شهدایی که در خرمشهرِ مظلوم آن‌طور مقاومت کردند. آن روزها بنده در اهواز از نزدیک شاهد قضایا بودم.»',
    sourceName: 'ویکی‌فقه — مدخل محمد جهان‌آرا (نقل سخنرانی)',
    sourceUrl: 'https://fa.wikifeqh.ir/محمد_جهان‌آرا',
  },
  // ── شهید دقایقی ──
  {
    id: 'mem-daghayeghi-1', martyrId: 'daghayeghi', kind: 'narration', verbatim: false, confidence: 'B',
    text: 'خبرگزاری ایسنا «داستان تیپ بدر و سردار شهید اسماعیل دقایقی» را روایت کرده است: با شروع تهاجم سراسری عراق، دقایقی به عنوان نماینده سپاه در اتاق جنگ لشکر ۹۲ زرهی حضور یافت و بعدها در ساخت پل‌های عبور از اروند و شلمچه در کربلای ۴ و ۵ نقش محوری گرفت.',
    sourceName: 'ایسنا — «داستان تیپ بدر و سردار شهید اسماعیل دقایقی»',
    sourceUrl: 'https://www.isna.ir/news/1401102819079',
  },
  {
    id: 'mem-daghayeghi-2', martyrId: 'daghayeghi', kind: 'book', verbatim: false, confidence: 'B',
    text: 'کتاب «روشنای بدر» شرح زندگی شهید دقایقی، فرمانده تیپ ۹ بدر، است؛ حاصل ۱۸۰ ساعت مصاحبه با همرزمان او. درباره جزئیات ساخته‌شدن پل‌های شناور و عبور از هور در این کتاب روایت‌های مفصل آمده است.',
    sourceName: 'معرفی کتاب — روزنامه/پایگاه‌های خبری (تگ تابناک: اسماعیل دقایقی)',
    sourceUrl: 'https://tabnak.ir/fa/tags/legacy-tag-218010',
  },
  // ── شهید دوران ──
  {
    id: 'mem-doran-1', martyrId: 'doran', kind: 'memoir', verbatim: true, confidence: 'B',
    text: '«در آغاز جنگ تحمیلی عباس دوران و سید علیرضا یاسینی تنها خلبانان نیروی هوایی در خلیج فارس بودند که قادر به شلیک موشک راداری هوا‌به‌زمین "ماوریک" بودند... در ۶ و ۷ آذر ۱۳۵۹ طی عملیات مروارید، باقی‌مانده نیروی دریایی عراق با شلیک‌های دقیق دوران و دیگر همرزمان او به اعماق آب‌های خلیج فارس فرستاده شد.»',
    sourceName: 'نوید شاهد — «۱۴ خاطره کوتاه و خواندنی از خلبانی که داوطلب شهادت بود»',
    sourceUrl: 'https://navideshahed.com/fa/news/395238/',
  },
  {
    id: 'mem-doran-2', martyrId: 'doran', kind: 'memoir', verbatim: true, confidence: 'B',
    text: '«در طول پرواز صحبت نمی‌کرد. همواره می‌گفت: اگر از مسیر منحرف شده و یا حالت نامتعادلی داشتم، با من صحبت کنید، خودتان هم مواظب اطراف باشید.»',
    sourceName: 'حوزه — «ده خاطره از شهید عباس دوران» (گهرناب)',
    sourceUrl: 'https://hawzah.net/fa/Goharenab/view/86469',
  },
  // ── شهید وزوایی ──
  {
    id: 'mem-vazvaei-1', martyrId: 'vazvaei', kind: 'narration', verbatim: true, confidence: 'A',
    narrator: 'پرونده رسمی شهید (گلزار شهدا)',
    text: '«هجدهم مرداد ۱۳۳۹ در تهران چشم به جهان گشود... دهم اردیبهشت ۱۳۶۱، با سمت فرمانده گردان در خرمشهر بر اثر اصابت ترکش خمپاره شهید شد.» (شرح شهادت رسمی؛ عملیات بیت‌المقدس)',
    sourceName: 'پایگاه گلزار شهدا — پرونده محسن وزوایی',
    sourceUrl: 'https://www.golzar.info/21007',
  },
  {
    id: 'mem-vazvaei-2', martyrId: 'vazvaei', kind: 'museum-note', verbatim: false, confidence: 'B',
    text: 'خاطره مستقلِ با ارجاع باز برای شهید وزوایی در این جمع‌بندی محدود بود؛ کتاب «یک محسن عزیز» (روایتی مستند از زندگی او) به‌عنوان منبع اصلی خاطرات معرفی می‌شود (به نقل از ویکی‌پدیای فارسی).',
    sourceName: 'ویکی‌پدیای فارسی — محسن وزوایی',
    sourceUrl: 'https://fa.wikipedia.org/wiki/محسن_وزوایی',
  },
  // ── شهید کاوه ──
  {
    id: 'mem-kaveh-1', martyrId: 'kaveh', kind: 'memoir', verbatim: false, confidence: 'B',
    text: 'از «دوازده خاطره از شهید محمود کاوه» (نوید شاهد): محمود کاوه ۱۸ سال بیشتر نداشت که فرمانده حفاظت از بیت امام (ره) در جماران شد و حیرت بزرگان ارتش را در آن زمان به خود واداشت.',
    sourceName: 'نوید شاهد — «دوازده خاطره از شهید محمود کاوه»',
    sourceUrl: 'https://navideshahed.com/fa/news/428671',
  },
  {
    id: 'mem-kaveh-2', martyrId: 'kaveh', kind: 'memoir', verbatim: false, confidence: 'B',
    text: 'از «۱۰ خاطره ناگفته از شهید محمود کاوه» (روزنامه کیهان): سال ۶۰، کاوه پیش از تشکیل تیپ ویژه شهدا، برای فتح بوکان اقدام کرد — روایت همرزمانی که آن سال‌ها را در کنار او بودند.',
    sourceName: 'روزنامه کیهان — «۱۰ خاطره ناگفته از شهید محمود کاوه»',
    sourceUrl: 'https://kayhan.ir/fa/news/140989',
  },
  // ── شهید ردانی‌پور ──
  {
    id: 'mem-redanipour-1', martyrId: 'redanipour', kind: 'will', verbatim: true, confidence: 'C',
    text: '«اگر شهید شدم جنازه‌ام را جلوی در گلستان شهدای اصفهان دفن کنید؛ دلم می‌خواهد وقتی پدر و مادرها می‌آیند زیارت بچه‌هایشان...» — بخشی از سخن شهید ردانی‌پور درباره آرامگاهش (ادامه جمله در منبع اصلی).',
    sourceName: 'الگو ایرانی — «زندگی‌نامه و وصیت‌نامه شهید مصطفی ردانی‌پور»',
    sourceUrl: 'https://olgoirani.com/content/1044',
  },
  // ── شهید کلاهدوز ──
  {
    id: 'mem-kolahdooz-1', martyrId: 'kolahdooz', kind: 'memoir', verbatim: false, confidence: 'B',
    text: 'از خاطرات ویژه‌نامه رشد: «حواسش حتی به صدای ماشین هم بود! خانه‌اش در انتهای یک کوچه فرعی بود. شب‌ها که دیروقت از محل کار به خانه بازمی‌گشت...» — روایت مراقبت اطلاعاتی و ساده‌زیستی جانشین فرمانده کل سپاه.',
    sourceName: 'ویژه‌نامه‌های رشد — «خاطره‌ای از شهید یوسف کلاهدوز»',
    sourceUrl: 'https://vijename.roshd.ir/index.php/fa/khakriz',
  },
  {
    id: 'mem-kolahdooz-2', martyrId: 'kolahdooz', kind: 'book', verbatim: false, confidence: 'B',
    text: 'کتاب «همدم یاد شما» مجموعه خاطرات سرداران درباره شهید کلاهدوز برای نوجوانان است؛ سرگذشتنامه او از ۱۳۲۵ تا ۱۳۶۰ (نوید شاهد). کتاب «مژه‌های سوخته» نوشته پسرش حامد کلاهدوز نیز روایت مفصلی از شخصیت اوست.',
    sourceName: 'نوید شاهد — «همدم یاد شما؛ خاطراتی از شهید کلاهدوز»',
    sourceUrl: 'https://navideshahed.com/fa/news/440697',
  },
  // ── شهید حسن باقری ──
  {
    id: 'mem-bagheri-1', martyrId: 'bagheri', kind: 'memoir', verbatim: true, confidence: 'B',
    text: '«کلاس هشتم بود. سال چهل‌وهشت، چهل‌ونه. خانواده دورشان با چند بچه قد و نیم‌قد از عراق آواره شده بود؛ هیچی نداشتند. هفت‌هشت ماه پای‌پِی صندوق‌دار مسجد لرزاده شده بود. می‌گفت: "بابا یه وام بدین به این بنده خدا؛ لااقل یه سرپناهی پیدا کنه. گناه داره."»',
    sourceName: 'آوینی — «ده خاطره از شهید حسن باقری (غلامحسین افشردی)»',
    sourceUrl: 'https://old.aviny.com/rahiyan_noor/revaiat-eshgh/khatere/08.aspx',
  },
  {
    id: 'mem-bagheri-2', martyrId: 'bagheri', kind: 'memoir', verbatim: true, confidence: 'B',
    text: '«باشگاه گلف اهواز شده بود پایگاه منتظران شهادت. یکی از اتاق‌های کوچکش را با فیبر جدا کرد؛ محل استراحت و کار. روی در هم نوشت: "۱۰۰٪ شناسایی، ۱۰۰٪ موفقیت." گفت: "حتی با یه بی‌سیم کوچیک هم شده باید بی‌سیم‌های عراقی را گوش کنید." از شناسایی که می‌آمد با سر و صورت خاکی می‌رفت اتاقش؛ اطلاعات را روی نقشه می‌نوشت.»',
    sourceName: 'آوینی — «ده خاطره از شهید حسن باقری»',
    sourceUrl: 'https://old.aviny.com/rahiyan_noor/revaiat-eshgh/khatere/08.aspx',
  },
  // ── شهیدان باکری ──
  {
    id: 'mem-bakri-mehdi-1', martyrId: 'bakri-mehdi', kind: 'memoir', verbatim: true, confidence: 'B',
    text: 'خاطره ۷۳ از «۱۰۰ خاطره از شهید مهدی باکری» (دفاع‌پرس): «گفتم خیلی از بچه‌های امداد مرخصی می‌خوان... گفت از قول من به‌شان سلام برسون، بعد بگو اگر رفتید خونه، ازتون پرسیدند توی این مدت که جبهه بودید خط مقدم رو هم دیدید یا نه، چی به‌شون می‌گین؟ اگه جواب داشتند که بسم الله... عین صحبت‌های آقا مهدی را به‌شان گفتم. هیچ‌کدامشان نرفتند.»',
    sourceName: 'خبرگزاری دفاع‌پرس — «۱۰۰ خاطره از شهید مهدی باکری»',
    sourceUrl: 'https://defapress.ir/fa/news/118737',
  },
  {
    id: 'mem-bakri-mehdi-2', martyrId: 'bakri-mehdi', kind: 'book', verbatim: false, confidence: 'B',
    text: 'نشریه شاهد یاران (شماره ۱۱۷) به بهانه چهلمین سالگرد شهادت او، ۲۰ خاطره کوتاه از زبان قاسم سلیمانی، محسن رضایی، یحیی رحیم صفوی و همسر شهید صفیه مدرس منتشر کرده است؛ کتاب «موقعیت مهدی» نیز روایت جامع زندگی اوست.',
    sourceName: 'نوید شاهد — «۲۰ خاطره کوتاه و خواندنی از شهیدان باکری»',
    sourceUrl: 'https://navideshahed.com/fa/news/588433',
  },
  {
    id: 'mem-bakri-hamid-1', martyrId: 'bakri-hamid', kind: 'narration', verbatim: false, confidence: 'B',
    narrator: 'همسر شهید حمید باکری',
    text: 'همسر شهید حمید باکری درباره شهادت او روایت کرده است: «وقتی به ارومیه رسیدیم تازه فهمیدم جنازه‌ای در کار نیست؛ بدنش مفقود بود.» روایت کامل شهادت او در گزارش خبری منتشر شده است.',
    sourceName: 'گزارش خبری — «شهادت حمید باکری به روایت همسرش» (گفت‌وگوی منتشرشده)',
    sourceUrl: 'https://navideshahed.com/fa/vip/19444',
  },
  // ── شهید یاغچیان ──
  {
    id: 'mem-yaghchian-1', martyrId: 'yaghchian', kind: 'narration', verbatim: true, confidence: 'B',
    narrator: 'همرزم شهید یاغچیان',
    text: '«دومین باری بود که مرتضی یاغچیان از ناحیه پا مجروح می‌شد. با خودم گفتم دیگر کارش تمام است.» — روایت همرزم شهید که دفاع‌پرس منتشر کرده است.',
    sourceName: 'خبرگزاری دفاع‌پرس — «حیات مرتضی یاغچیان بسته به حضورش در جبهه بود»',
    sourceUrl: 'https://defapress.ir/fa/news/506010',
  },
  // ── شهید علی هاشمی ──
  {
    id: 'mem-hashemi-1', martyrId: 'hashemi-ali', kind: 'narration', verbatim: true, confidence: 'B',
    narrator: 'فرمانده عراقی (روایت تابناک درباره فریب هور)',
    text: '«در زمستان ۱۳۶۴ لشکر من در فاو مستقر بود. آن‌قدر تحرکات شما در هور زیاد شد که مطمئن شدم حمله‌ی مجدد شما از هور است... وقتی نیروها خبر دادند ایران به فاو حمله کرده، گفتم نگران نباشید؛ حمله ایران به فاو یک فریب است! حمله اصلی از هور است. ما تا سه روز منتظر حمله شما در هور بودیم، اما خبری نشد! این اشتباه من باعث شد فاو را از دست دادیم.»',
    sourceName: 'تابناک — پرونده شهید علی هاشمی (روایت فرمانده عراقی)',
    sourceUrl: 'https://tabnak.ir/fa/tags/legacy-tag-4982',
  },
  {
    id: 'mem-hashemi-2', martyrId: 'hashemi-ali', kind: 'book', verbatim: false, confidence: 'B',
    text: 'کتاب «هوری — زندگینامه و خاطرات سردار شهید علی هاشمی» شرح زندگی فرمانده قرارگاه نصرت در جنگ هشت‌ساله است؛ «خاطرات شنیدنی از سردار هور» نیز از زبان برادرش عادل هاشمی در نوید شاهد منتشر شده است.',
    sourceName: 'طاقچه — کتاب هوری / نوید شاهد — خاطرات شنیدنی از سردار هور',
    sourceUrl: 'https://taaghche.com/book/21587',
  },
  // ── شهید همت ──
  {
    id: 'mem-hemmet-1', martyrId: 'hammet', kind: 'narration', verbatim: true, confidence: 'B',
    text: '«حاج محمد ابراهیم همت به تاریخ ۱۲ فروردین سال ۱۳۳۴ در "شهرضا" به دنیا آمد... وی در زمان شهادت، فرماندهی لشکر ۲۷ محمد رسول‌الله را بر عهده داشت.» (شرح رسمی زندگی؛ درباره روز دقیق شهادت منابع ۱۷ تا ۲۴ اسفند ۱۳۶۲ را ثبت کرده‌اند)',
    sourceName: 'روزنامه جوان — «مزار شهید همت کجاست؟ + عکس»',
    sourceUrl: 'https://www.javanonline.ir/fa/news/419468',
  },
  {
    id: 'mem-hemmet-2', martyrId: 'hammet', kind: 'book', verbatim: false, confidence: 'B',
    text: 'فصل‌های کتاب «گنجشک و ققنوس» و مجموعه خاطرات همرزمان او در لشکر ۲۷ محمد رسول‌الله (ص) — از جمله روایت‌های منتشرشده در ایسنا («روایت‌هایی از معلمِ شیک‌پوشِ مبارز») و ایرنا («تلخ‌ترین خاطره زندگی شهید همت») — سند انسانی جبهه هور است.',
    sourceName: 'ایسنا — «روایت‌هایی از معلمِ شیک‌پوشِ مبارز»',
    sourceUrl: 'https://www.isna.ir/news/1401121712715',
  },
  // ── شهید خرازی ──
  {
    id: 'mem-kharrazi-1', martyrId: 'kharrazi', kind: 'memoir', verbatim: true, confidence: 'B',
    text: '«شب عروسیش بچه‌ها یه قبضه تیربار گرینوف با ۳۰۰ تیر فشنگ را کادو کردند و روی کارت نوشتند: "جنگ یادت نره". فردا صبح بود که آن‌ها را برگرداند و تحویل اسلحه‌خانه داد، بعد هم به دوستاش گفت: "بیت‌المال که یادتون نرفته".»',
    sourceName: 'مرکز اسناد انقلاب اسلامی — «چند خاطره از شهید حسین خرازی»',
    sourceUrl: 'https://irdc.ir/fa/news/10033',
  },
  {
    id: 'mem-kharrazi-2', martyrId: 'kharrazi', kind: 'memoir', verbatim: true, confidence: 'B',
    text: '«چهار نفر به اندازه یک نفر نان خشک داشتند؛ توی محاصره آن هم غنیمت بود. همه گرسنه نشسته بودند کنار سنگر و نان‌ها مانده بود وسط. هر کسی به دیگری تعارف می‌کرد. گفت: "خوبه چراغ‌ها را خاموش کنی تا هر کی گرسنه‌تره نان‌ها را بخوره و خجالت هم نکشه." یک ربع بعد چراغ‌ها روشن ش...» (ادامه در منبع اصلی)',
    sourceName: 'مرکز اسناد انقلاب اسلامی — «چند خاطره از شهید حسین خرازی»',
    sourceUrl: 'https://irdc.ir/fa/news/10033',
  },
  // ── شهید بابایی ──
  {
    id: 'mem-babaei-1', martyrId: 'babaei', kind: 'memoir', verbatim: true, confidence: 'B',
    text: '«تیمسار شهید "عباس بابایی" سربازی عاشق، متقی و وفادار بود که پانزدهم مردادماه ۱۳۶۶ به آسمان پرکشید و جاودانه شد... خلبانی که با هوشی سرشار و ذهنی خلاق، چهره آشنای بسیجیان و یار وفادار فرماندهان قرارگاه‌های عملیاتی بود.»',
    sourceName: 'نوید شاهد — «۱۰ خاطره از شهید عباس بابایی که نخوانده‌اید!»',
    sourceUrl: 'https://navideshahed.com/fa/news/434801',
  },
  {
    id: 'mem-babaei-2', martyrId: 'babaei', kind: 'book', verbatim: false, confidence: 'B',
    text: 'کتاب «پرواز تا آسمان‌ها» و کتاب گویای «من و عباس بابایی» (خاطرات حسن دوشن از شهید بابایی) از اصلی‌ترین منابع خاطرات اوست؛ دوستی دوشن و بابایی به پیش از انقلاب بازمی‌گردد.',
    sourceName: 'ایران‌صدا — کتاب گویای «من و عباس بابایی»',
    sourceUrl: 'https://www.iranseda.ir',
  },
]

export function memoriesOf(martyrId: string): MartyrMemory[] {
  return MARTYR_MEMORIES.filter(m => m.martyrId === martyrId)
}

export function burialOf(martyrId: string): MartyrBurial | undefined {
  return MARTYR_BURIALS.find(b => b.martyrId === martyrId)
}
