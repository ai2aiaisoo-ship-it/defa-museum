// ─── فاز ۲ — آرشیو جامع چندرسانه‌ای با «شناسنامه رسانه» ───
// قواعد بخش ۸ فاز ۲:
// • تصویر تولیدشده با هوش مصنوعی هرگز به‌عنوان عکس تاریخی نمایش داده نمی‌شود.
// • هر رسانه شناسنامه کامل دارد: تاریخ ثبت، تاریخ انتشار، مکان، عکاس/فیلم‌بردار، سازمان صاحب آرشیو،
//   لینک منبع، وضعیت مجوز، کیفیت، اصالت، ارتباط با عملیات/اشخاص، وضعیت بررسی کارشناسی، برچسب واقعی/بازسازی‌شده.
// • دسترسی به تصویر در اینترنت به معنی مجوز بازنشر نیست؛ موارد فاقد مجوز نمایشی با پیوند منبع معرفی می‌شوند.

import type { Confidence } from './types'

export type MediaType = 'photo' | 'video' | 'document' | 'audio'
export type MediaVerification = 'confirmed' | 'pending-review' | 'unverified-origin'
export type MediaLicense = 'public' | 'archival-reference' | 'rights-reserved'
export type MediaAvailability = 'online' | 'link-only' | 'not-digitized' | 'archived-offline'

export interface MediaItem {
  id: string
  type: MediaType
  title: string
  desc: string
  /** تاریخ ثبت تصویر/فیلم (تاریخی) در صورت مشخص بودن */
  captureDate?: string
  captureLabel?: string
  publishDate?: string
  location?: string
  people?: string[]
  /** عملیات‌های مرتبط (شناسه Operation) */
  opIds?: string[]
  /** برچسب موضوعی برای فیلتر و جانمایی هوشمند */
  tags: string[]
  sourceName: string
  sourceUrl?: string
  photographer?: string
  /** سازمان صاحب آرشیو */
  archiveOrg?: string
  license: MediaLicense
  quality: 'high' | 'medium' | 'low'
  authenticity: 'real' | 'reconstruction' | 'artwork' | 'infographic'
  verification: MediaVerification
  verificationNote?: string
  confidence: Confidence
  /** فقط برای رسانه‌های آنلاین قابل نمایش */
  url?: string
  availability: MediaAvailability
  /** برای ویدیوها: نکته نمایش و جایگزین */
  displayNote?: string
}

// ─── رسانه‌های نمایش‌پذیر (تصاویر واقعی با منبع) ───
export const MEDIA_ITEMS: MediaItem[] = [
  // — روایت ایرانی: مردم، فرماندهان، جبهه‌ها —
  {
    id: 'm-fr-chamran',
    type: 'photo', title: 'شهید مصطفی چمران در سنگرهای جبهه دشت آزادگان',
    desc: 'تصویر شناخته‌شده شهید چمران در جبهه؛ یکی از اسناد بصری محبوب دفاع اولیه.',
    captureLabel: '۱۳۵۹–۱۳۶۰', location: 'جبهه دشت آزادگان، خوزستان',
    people: ['مصطفی چمران'], tags: ['martyrs', 'front', 'susangerd'], opIds: ['susangerd-battle'],
    sourceName: 'نوید شاهد (بنیاد حفظ آثار و نشر ارزش‌های دفاع مقدس)',
    sourceUrl: 'https://navideshahed.com', archiveOrg: 'بنیاد حفظ آثار و نشر ارزش‌های دفاع مقدس',
    license: 'archival-reference', quality: 'medium', authenticity: 'real',
    verification: 'confirmed', confidence: 'B',
    url: '/images/arch/cfae36733105.jpg', availability: 'online',
  },
  {
    id: 'm-fr-jahanara',
    type: 'photo', title: 'پرتره شهید محمد جهان‌آرا',
    desc: 'پرتره منتشرشده در پرونده‌های رسمی شهید؛ فرمانده مقاومت ۳۴ روزه خرمشهر.',
    captureLabel: 'پیش از ۱۳۶۰', location: 'خرمشهر',
    people: ['محمد جهان‌آرا'], tags: ['martyrs', 'khorramshahr'], opIds: ['khorramshahr-battle'],
    sourceName: 'خبرگزاری میزان — پرونده شهید',
    sourceUrl: 'https://mizanonline.ir', archiveOrg: 'بازنشر رسانه‌ای از پرونده بنیاد شهید',
    license: 'archival-reference', quality: 'medium', authenticity: 'real',
    verification: 'pending-review', verificationNote: 'برای تأیید نهایی هویت پرتره، مقایسه با آرشیو بنیاد شهید خوزستان توصیه می‌شود.',
    confidence: 'B',
    url: '/images/arch/3fb8a77bc6f0.jpg', availability: 'online',
  },
  {
    id: 'm-fr-khorram-ruins',
    type: 'photo', title: 'خرابه‌های خرمشهر پس از نبردها',
    desc: 'آثار اشغال و نبردهای خیابانی؛ شهری که ۱۹ ماه در اشغال ماند.',
    captureLabel: '۱۳۶۱ (پس از آزادسازی)', location: 'خرمشهر',
    tags: ['khorramshahr', 'ruins'], opIds: ['bayt-almoghaddas', 'khorramshahr-battle'],
    sourceName: 'Ajam Media Collective', license: 'archival-reference', quality: 'medium',
    authenticity: 'real', verification: 'pending-review', confidence: 'B',
    url: '/images/arch/552ec9a2306d.jpg', availability: 'online',
  },
  {
    id: 'm-fr-khorram-bld',
    type: 'photo', title: 'ساختمان گلوله‌خورده — آثار نبردهای خیابانی',
    desc: 'سند بصری تخریب شهری در خرمشهر؛ مکان دقیق نیازمند تطبیق با آرشیو محلی.',
    captureLabel: '۱۳۶۱', location: 'خرمشهر',
    tags: ['khorramshahr', 'ruins'], opIds: ['bayt-almoghaddas'],
    sourceName: 'Aggregate (آرشیو معماری)', license: 'archival-reference', quality: 'medium',
    authenticity: 'real', verification: 'pending-review', confidence: 'B',
    url: '/images/arch/8ee115bf8967.jpg', availability: 'online',
  },
  {
    id: 'm-fr-front1',
    type: 'photo', title: 'رزمندگان در سنگرهای صحرایی جبهه جنوب',
    desc: 'تصویر آرشیوی از گزارش‌های هم‌زمان جنگ.',
    captureLabel: '۱۳۶۰s', location: 'جبهه جنوب', tags: ['front', 'hero'],
    sourceName: 'BBC (آرشیو جنگ)', archiveOrg: 'بی‌بی‌سی', license: 'archival-reference',
    quality: 'medium', authenticity: 'real', verification: 'pending-review', confidence: 'B',
    url: '/images/arch/0a2c3c57dcd9.jpg', availability: 'online',
  },
  {
    id: 'm-fr-front2',
    type: 'photo', title: 'رزمنده ایرانی در جبهه',
    desc: 'تصویر آرشیوی از منابع نظامی تاریخی.',
    captureLabel: '۱۳۶۰s', location: 'جبهه‌های جنوب/میانی', tags: ['front', 'hero'],
    sourceName: 'Warfare History Network', license: 'archival-reference', quality: 'medium',
    authenticity: 'real', verification: 'pending-review', confidence: 'B',
    url: '/images/arch/caacd135d922.jpg', availability: 'online',
  },
  {
    id: 'm-fr-march',
    type: 'photo', title: 'یورش رزمندگان در دشت — تصویر آرشیو خبری',
    desc: 'تصویر سیاه‌وسفید از گزارش‌های خبری دوران جنگ؛ تاریخ و منشأ در انتظار تأیید کارشناسی.',
    captureLabel: 'تاریخ و منشأ نامشخص', tags: ['front', 'hero'], opIds: ['fath-ol-mobin'],
    sourceName: 'آرشیو عمومی وب', license: 'archival-reference', quality: 'medium',
    authenticity: 'real', verification: 'unverified-origin', verificationNote: 'فاقد تاریخ و منبع دقیق — بر اساس قاعده بخش ۸ با برچسب «تاریخ و منشأ نامشخص» ثبت شد.',
    confidence: 'C',
    url: '/images/arch/7b91aa2a8a9f.jpg', availability: 'online',
  },
  {
    id: 'm-fr-trenches',
    type: 'photo', title: 'رزمندگان در سنگر — آرشیو ایرنا',
    desc: 'تصویر آرشیو خبرگزاری جمهوری اسلامی از جبهه‌ها.',
    captureLabel: '۱۳۶۰s', location: 'جبهه جنوب', tags: ['front', 'hero'],
    sourceName: 'ایرنا (آرشیو خبرگزاری جمهوری اسلامی)', archiveOrg: 'ایرنا',
    license: 'archival-reference', quality: 'medium', authenticity: 'real',
    verification: 'pending-review', confidence: 'B',
    url: '/images/arch/9aec4ec8d627.jpg', availability: 'online',
  },
  {
    id: 'm-fr-rpg',
    type: 'photo', title: 'نبرد تانک و سنگر — تصویر آرشیو خبری',
    desc: 'صحنه نبرد زرهی–پیاده در دشت؛ تاریخ و منشأ در انتظار تأیید.',
    captureLabel: 'تاریخ و منشأ نامشخص', tags: ['front', 'hero'], opIds: ['karbala-5'],
    sourceName: 'آرشیو عمومی وب', license: 'archival-reference', quality: 'medium',
    authenticity: 'real', verification: 'unverified-origin', confidence: 'C',
    url: '/images/arch/9d4b01c2661f.jpg', availability: 'online',
  },
  // — روایت دشمن: اسناد عراقی —
  {
    id: 'm-iq-march',
    type: 'photo', title: 'ارابه‌های نظامی و پرچم‌های حکومت بعث',
    desc: 'تصویر رسانه‌ای از نمایش نظامی حکومت صدام؛ سند شناخت تبلیغات و ساختار نظامی بعث.',
    captureLabel: 'دهه ۱۹۸۰', location: 'عراق', tags: ['iraq-side', 'saddam-dossier'],
    sourceName: 'ایندیپندنت فارسی', license: 'archival-reference', quality: 'medium',
    authenticity: 'real', verification: 'pending-review', confidence: 'B',
    url: '/images/arch/b6d0c84fb6dd.jpg', availability: 'online',
  },
  {
    id: 'm-iq-saddam-thumb',
    type: 'photo', title: 'تصویر نمادین صدام حسین در بازنشر مستند',
    desc: 'قاب بازنشر یک مستند ویدیویی درباره صدام و جنگ؛ به‌عنوان تصویر نمادین (نه سند دست‌اول) ثبت شده است.',
    captureLabel: 'دهه ۱۹۸۰ (بازنشر امروز)', tags: ['iraq-side', 'saddam-dossier'],
    sourceName: 'بازنشر یوتیوب', license: 'archival-reference', quality: 'low',
    authenticity: 'real', verification: 'pending-review', confidence: 'C',
    url: '/images/arch/a3d2fd5f3f74.jpg', availability: 'online',
    displayNote: 'پوستر بازنشر است؛ فیلم اصلی در پرونده «تصمیم صدام» معرفی شده است.',
  },
  // — پیشینه جنگ: الجزایر و مرزها —
  {
    id: 'm-algiers-meeting',
    type: 'photo', title: 'تصویر منتسب به نشست امضای توافق الجزایر ۱۹۷۵',
    desc: 'عکس تاریخی سیاه‌وسفید از مرکز اسناد انقلاب اسلامی؛ به نشست‌های مذاکره الجزایر نسبت داده شده و نیازمند تطبیق نهایی با آرشیو رسمی است.',
    captureLabel: '۱۵ اسفند ۱۳۵۳ (مارس ۱۹۷۵)', location: 'الجزایر',
    people: ['محمدرضا شاه', 'صدام حسین', 'هواری بومدین'], tags: ['algiers', 'roots'],
    sourceName: 'مرکز اسناد انقلاب اسلامی', sourceUrl: 'https://rc.majlis.ir',
    license: 'archival-reference', quality: 'medium', authenticity: 'real',
    verification: 'pending-review', verificationNote: 'تطبیق دقیق جلسه (امضای توافق یا مذاکرات تکمیلی بغداد) در انتظار بررسی کارشناسی است.',
    confidence: 'B',
    url: '/images/arch/148a4e095dc3.jpg', availability: 'online',
  },
  {
    id: 'm-rev-khomeini',
    type: 'photo', title: 'بنیان‌گذار انقلاب در دوران جنگ',
    desc: 'تصویر آرشیوی از رهبری ایران در دوران دفاع مقدس.',
    captureLabel: '۱۳۶۰s', location: 'تهران', people: ['سید روح‌الله خمینی'],
    tags: ['leadership', 'front'], sourceName: 'آرشیو عمومی وب',
    license: 'archival-reference', quality: 'medium', authenticity: 'real',
    verification: 'pending-review', confidence: 'B',
    url: '/images/arch/8235f256b37c.jpg', availability: 'online',
  },
  {
    id: 'm-rev-rally',
    type: 'photo', title: 'مردم و پرچم‌ها — جبهه داخلی',
    desc: 'تصویر آرشیوی از حضور مردمی در دوران جنگ.',
    captureLabel: '۱۳۶۰s', location: 'ایران', tags: ['people', 'front'],
    sourceName: 'آرشیو عمومی وب', license: 'archival-reference', quality: 'medium',
    authenticity: 'real', verification: 'pending-review', confidence: 'B',
    url: '/images/arch/43e1da2d77a5.jpg', availability: 'online',
  },
  {
    id: 'm-avini-portrait',
    type: 'photo', title: 'پرتره شهید سید مرتضی آوینی',
    desc: 'پرتره منتشرشده در رسانه‌های رسمی دفاع مقدس؛ مستندساز روایت فتح.',
    captureLabel: 'دهه ۱۳۶۰', people: ['سید مرتضی آوینی'], tags: ['avini', 'martyrs'],
    sourceName: 'خبرگزاری دفاع مقدس', license: 'archival-reference', quality: 'medium',
    authenticity: 'real', verification: 'pending-review', confidence: 'B',
    url: '/images/arch/e504e243c12f.jpg', availability: 'online',
  },
  {
    id: 'm-avini-cam',
    type: 'photo', title: 'کار دوربین در جبهه — تصویر نمادین روایت فتح',
    desc: 'تصویر نمادین کار تصویربرداری در جبهه‌ها؛ بازتاب سبک کار گروه روایت فتح (سند بصری نمادین، نه پرتره مستند).',
    captureLabel: 'دهه ۱۳۶۰', people: ['سید مرتضی آوینی'], tags: ['avini', 'documentary'],
    sourceName: 'رویداد۲۴', license: 'archival-reference', quality: 'medium',
    authenticity: 'real', verification: 'pending-review',
    verificationNote: 'این تصویر به‌عنوان «نمادین» ثبت شده است؛ نسبت مستقیم آن با شخص آوینی نیازمند تأیید کارشناسی است.',
    confidence: 'B',
    url: '/images/arch/40e1cdfd9d58.jpg', availability: 'online',
  },
  // — نبردها و تجهیزات —
  {
    id: 'm-war-f4',
    type: 'photo', title: 'فانتوم اف-۴ نیروی هوایی ارتش',
    desc: 'ستون حملات هوایی ایران در کل جنگ (کمان ۹۹، اچ-۳).',
    tags: ['air', 'equipment'], opIds: ['kaman-99', 'h-3'],
    sourceName: 'منابع عمومی هوانوردی', license: 'archival-reference', quality: 'medium',
    authenticity: 'real', verification: 'pending-review', confidence: 'B',
    url: '/images/arch/e2c7140b7d2e.jpg', availability: 'online',
  },
  {
    id: 'm-war-f14',
    type: 'photo', title: 'اف-۱۴های نیروی هوایی در پرواز گروهی',
    desc: 'ناوچه هوایی ایران در دوران جنگ.',
    tags: ['air', 'equipment'], sourceName: 'Royal Aeronautical Society',
    license: 'archival-reference', quality: 'high', authenticity: 'real',
    verification: 'pending-review', confidence: 'B',
    url: '/images/arch/ded81eaf82be.jpg', availability: 'online',
  },
  {
    id: 'm-war-tank72',
    type: 'photo', title: 'تانک‌های تی-۷۲ ارتش عراق',
    desc: 'برتری زرهی عراق در سال‌های میانی جنگ.',
    tags: ['equipment', 'iraq-side'], sourceName: 'Alamy',
    license: 'archival-reference', quality: 'medium', authenticity: 'real',
    verification: 'pending-review', confidence: 'B',
    url: '/images/arch/d68082f1483a.jpg', availability: 'online',
  },
  // — جنگ شهرها، خلیج فارس و شیمیایی —
  {
    id: 'm-gulf-fire',
    type: 'photo', title: 'آتش‌سوزی تأسیسات نفتی دریایی',
    desc: 'تصویر آرشیو نیروی دریایی آمریکا از آتش سکوها/شناورها در جنگ نفتکش‌ها.',
    captureLabel: '۱۳۶۰s', location: 'خلیج فارس', tags: ['gulf', 'tanker-war'],
    opIds: ['tanker-war'], sourceName: 'U.S. Naval Institute (Proceedings)',
    archiveOrg: 'U.S. Naval Institute', license: 'archival-reference', quality: 'medium',
    authenticity: 'real', verification: 'pending-review', confidence: 'B',
    url: '/images/arch/e965a1b194fb.jpg', availability: 'online',
  },
  {
    id: 'm-gulf-tanker',
    type: 'photo', title: 'نفتکش در آب‌های خلیج فارس در دوران جنگ',
    desc: 'نفتکش‌های تجاری اصلی‌ترین هدف دو طرف در جنگ نفتکش‌ها بودند.',
    tags: ['gulf', 'tanker-war'], opIds: ['tanker-war'],
    sourceName: 'The Guardian', license: 'archival-reference', quality: 'medium',
    authenticity: 'real', verification: 'pending-review', confidence: 'B',
    url: '/images/arch/2c7a8201059d.jpg', availability: 'online',
  },
  {
    id: 'm-chem-halabja-mem',
    type: 'photo', title: 'یادمان شهدای حلبچه',
    desc: 'یادمان قربانیان بمباران شیمیایی ۲۶ اسفند ۱۳۶۶ — به جای تصاویر دلخراش، یادمان نمایش داده می‌شود.',
    captureLabel: 'یادمان معاصر', location: 'حلبچه', tags: ['chemical'],
    opIds: ['halabja-chem'], sourceName: 'Tripadvisor (آرشیو سفر)',
    license: 'archival-reference', quality: 'medium', authenticity: 'real',
    verification: 'confirmed', confidence: 'B',
    url: '/images/arch/04e79aa72757.jpg', availability: 'online',
  },
  {
    id: 'm-chem-halabja-2',
    type: 'photo', title: 'بنای یادبود حلبچه',
    desc: 'نماد ملی قربانیان سلاح شیمیایی در کردستان عراق.',
    tags: ['chemical'], opIds: ['halabja-chem'], sourceName: 'آرشیو خبری',
    license: 'archival-reference', quality: 'medium', authenticity: 'real',
    verification: 'confirmed', confidence: 'B',
    url: '/images/arch/bd7a320ab6ba.jpg', availability: 'online',
  },

// ─── فاز ۱۴: عکس‌های آرشیوی عملیات‌ها (جست‌وجوی وب + دانلود محلی + شناسنامه کامل) ───
  {
    id: 'm-p14-badr-63-1',
    type: 'photo', title: 'حرکت رزمندگان روی پل شناور در هورالدلمج — عملیات بدر — عکس عملیات بدر/هورالدلمج',
    desc: 'تصویر آرشیوی یافت‌شده در جست‌وجوی وب برای پرونده بدر/هورالدلمج؛ منبع و مجوز نمایش آرشیوی در همین شناسنامه ثبت است.',
    captureLabel: 'اسفند ۱۳۶۳', location: 'بدر/هورالدلمج',
    tags: ["offensive", "marsh"], opIds: ['badr-63'],
    sourceName: 'ایمنا (مؤسسه مطالعات و پژوهش‌های خبری)', license: 'archival-reference', quality: 'medium',
    authenticity: 'real', verification: 'pending-review',
    verificationNote: 'برای استناد پژوهشی، تطبیق نهایی با آرشیو صاحب اثر توصیه می‌شود.',
    confidence: 'B',
    url: '/images/ops/badr-63/1.jpg', availability: 'online',
  },
  {
    id: 'm-p14-bayt-almoghaddas-1',
    type: 'photo', title: 'رزمندگان آزادی‌ساز خرمشهر با نشان پیروزی — عکس عملیات بیت‌المقدس/خرمشهر',
    desc: 'تصویر آرشیوی یافت‌شده در جست‌وجوی وب برای پرونده بیت‌المقدس/خرمشهر؛ منبع و مجوز نمایش آرشیوی در همین شناسنامه ثبت است.',
    captureLabel: 'اردیبهشت–خرداد ۱۳۶۱', location: 'بیت‌المقدس/خرمشهر',
    tags: ["offensive", "khorramshahr"], opIds: ['bayt-almoghaddas'],
    sourceName: 'ایرنا (آرشیو مطبوعاتی)', license: 'archival-reference', quality: 'medium',
    authenticity: 'real', verification: 'pending-review',
    verificationNote: 'برای استناد پژوهشی، تطبیق نهایی با آرشیو صاحب اثر توصیه می‌شود.',
    confidence: 'B',
    url: '/images/ops/bayt-almoghaddas/1.jpg', availability: 'online',
  },
  {
    id: 'm-p14-bayt-almoghaddas-2',
    type: 'photo', title: 'رزمندگان در آستانه عملیات بیت‌المقدس مقابل دیوار خوش‌نویسی‌شده — عکس عملیات بیت‌المقدس/خرمشهر',
    desc: 'تصویر آرشیوی یافت‌شده در جست‌وجوی وب برای پرونده بیت‌المقدس/خرمشهر؛ منبع و مجوز نمایش آرشیوی در همین شناسنامه ثبت است.',
    captureLabel: 'اردیبهشت–خرداد ۱۳۶۱', location: 'بیت‌المقدس/خرمشهر',
    tags: ["offensive", "khorramshahr"], opIds: ['bayt-almoghaddas'],
    sourceName: 'نوید شاهد (بنیاد حفظ آثار)', license: 'archival-reference', quality: 'medium',
    authenticity: 'real', verification: 'pending-review',
    verificationNote: 'برای استناد پژوهشی، تطبیق نهایی با آرشیو صاحب اثر توصیه می‌شود.',
    confidence: 'B',
    url: '/images/ops/bayt-almoghaddas/2.jpg', availability: 'online',
  },
  {
    id: 'm-p14-bayt-almoghaddas-3',
    type: 'photo', title: 'مردم در ویرانه‌های خرمشهر آزادشده با پرچم ایران — عکس عملیات بیت‌المقدس/خرمشهر',
    desc: 'تصویر آرشیوی یافت‌شده در جست‌وجوی وب برای پرونده بیت‌المقدس/خرمشهر؛ منبع و مجوز نمایش آرشیوی در همین شناسنامه ثبت است.',
    captureLabel: 'اردیبهشت–خرداد ۱۳۶۱', location: 'بیت‌المقدس/خرمشهر',
    tags: ["offensive", "khorramshahr"], opIds: ['bayt-almoghaddas'],
    sourceName: 'خبرگزاری میزان (بازنشر آرشیو ایرنا)', license: 'archival-reference', quality: 'medium',
    authenticity: 'real', verification: 'pending-review',
    verificationNote: 'برای استناد پژوهشی، تطبیق نهایی با آرشیو صاحب اثر توصیه می‌شود.',
    confidence: 'B',
    url: '/images/ops/bayt-almoghaddas/3.jpg', availability: 'online',
  },
  {
    id: 'm-p14-fath-ol-mobin-1',
    type: 'photo', title: 'رزمندگان پیش از آفند فتح‌المبین در کنار پرچم ایران — عکس عملیات فتح‌المبین',
    desc: 'تصویر آرشیوی یافت‌شده در جست‌وجوی وب برای پرونده فتح‌المبین؛ منبع و مجوز نمایش آرشیوی در همین شناسنامه ثبت است.',
    captureLabel: 'فروردین–اردیبهشت ۱۳۶۱', location: 'فتح‌المبین',
    tags: ["offensive", "south"], opIds: ['fath-ol-mobin'],
    sourceName: 'ایرنا (آرشیو مطبوعاتی)', license: 'archival-reference', quality: 'medium',
    authenticity: 'real', verification: 'pending-review',
    verificationNote: 'برای استناد پژوهشی، تطبیق نهایی با آرشیو صاحب اثر توصیه می‌شود.',
    confidence: 'B',
    url: '/images/ops/fath-ol-mobin/1.jpg', availability: 'online',
  },
  {
    id: 'm-p14-fath-ol-mobin-2',
    type: 'photo', title: 'پشتیبانی و آماده‌سازی رزمندگان پیش از عملیات فتح‌المبین — عکس عملیات فتح‌المبین',
    desc: 'تصویر آرشیوی یافت‌شده در جست‌وجوی وب برای پرونده فتح‌المبین؛ منبع و مجوز نمایش آرشیوی در همین شناسنامه ثبت است.',
    captureLabel: 'فروردین–اردیبهشت ۱۳۶۱', location: 'فتح‌المبین',
    tags: ["offensive", "south"], opIds: ['fath-ol-mobin'],
    sourceName: 'خبرگزاری دفاع مقدس (دفاپرس)', license: 'archival-reference', quality: 'medium',
    authenticity: 'real', verification: 'pending-review',
    verificationNote: 'برای استناد پژوهشی، تطبیق نهایی با آرشیو صاحب اثر توصیه می‌شود.',
    confidence: 'B',
    url: '/images/ops/fath-ol-mobin/2.jpg', availability: 'online',
  },
  {
    id: 'm-p14-fath-ol-mobin-3',
    type: 'photo', title: 'رزمندگان فتح‌المبین در جشن پیروزی با پرچم ایران — بامزه کرمانشاه — عکس عملیات فتح‌المبین',
    desc: 'تصویر آرشیوی یافت‌شده در جست‌وجوی وب برای پرونده فتح‌المبین؛ منبع و مجوز نمایش آرشیوی در همین شناسنامه ثبت است.',
    captureLabel: 'فروردین–اردیبهشت ۱۳۶۱', location: 'فتح‌المبین',
    tags: ["offensive", "south"], opIds: ['fath-ol-mobin'],
    sourceName: 'ایرنا (آرشیو مطبوعاتی)', license: 'archival-reference', quality: 'medium',
    authenticity: 'real', verification: 'pending-review',
    verificationNote: 'برای استناد پژوهشی، تطبیق نهایی با آرشیو صاحب اثر توصیه می‌شود.',
    confidence: 'B',
    url: '/images/ops/fath-ol-mobin/3.jpg', availability: 'online',
  },
  {
    id: 'm-p14-karbala-4-1',
    type: 'photo', title: 'گروه رزمندگان پیش از عملیات کربلای ۴ در جوار نخلستان‌های جنوب — عکس عملیات کربلای ۴/ام‌الرصاص',
    desc: 'تصویر آرشیوی یافت‌شده در جست‌وجوی وب برای پرونده کربلای ۴/ام‌الرصاص؛ منبع و مجوز نمایش آرشیوی در همین شناسنامه ثبت است.',
    captureLabel: 'دی ۱۳۶۵', location: 'کربلای ۴/ام‌الرصاص',
    tags: ["offensive"], opIds: ['karbala-4'],
    sourceName: 'گردان حضرت علی‌اکبر (آرشیو محلی)', license: 'archival-reference', quality: 'medium',
    authenticity: 'real', verification: 'pending-review',
    verificationNote: 'برای استناد پژوهشی، تطبیق نهایی با آرشیو صاحب اثر توصیه می‌شود.',
    confidence: 'C',
    url: '/images/ops/karbala-4/1.jpg', availability: 'online',
  },
  {
    id: 'm-p14-karbala-4-2',
    type: 'photo', title: 'رزمندگان کربلای ۴ کنار خودرو پشتیبانی در منطقه عملیاتی — عکس عملیات کربلای ۴/ام‌الرصاص',
    desc: 'تصویر آرشیوی یافت‌شده در جست‌وجوی وب برای پرونده کربلای ۴/ام‌الرصاص؛ منبع و مجوز نمایش آرشیوی در همین شناسنامه ثبت است.',
    captureLabel: 'دی ۱۳۶۵', location: 'کربلای ۴/ام‌الرصاص',
    tags: ["offensive"], opIds: ['karbala-4'],
    sourceName: 'بوشهرپورت (آرشیو محلی)', license: 'archival-reference', quality: 'medium',
    authenticity: 'real', verification: 'pending-review',
    verificationNote: 'برای استناد پژوهشی، تطبیق نهایی با آرشیو صاحب اثر توصیه می‌شود.',
    confidence: 'C',
    url: '/images/ops/karbala-4/2.jpg', availability: 'online',
  },
  {
    id: 'm-p14-karbala-5-1',
    type: 'photo', title: 'رزمندگان کربلای ۵ کنار قایق‌ها و جعبه‌های مهمات در ساحل نصار — عکس عملیات کربلای ۵/شلمچه',
    desc: 'تصویر آرشیوی یافت‌شده در جست‌وجوی وب برای پرونده کربلای ۵/شلمچه؛ منبع و مجوز نمایش آرشیوی در همین شناسنامه ثبت است.',
    captureLabel: 'دی–بهمن ۱۳۶۵', location: 'کربلای ۵/شلمچه',
    tags: ["offensive"], opIds: ['karbala-5'],
    sourceName: 'خبرگزاری دفاع مقدس (دفاپرس)', license: 'archival-reference', quality: 'medium',
    authenticity: 'real', verification: 'pending-review',
    verificationNote: 'برای استناد پژوهشی، تطبیق نهایی با آرشیو صاحب اثر توصیه می‌شود.',
    confidence: 'B',
    url: '/images/ops/karbala-5/1.jpg', availability: 'online',
  },
  {
    id: 'm-p14-karbala-5-2',
    type: 'photo', title: 'تجهیز رزمندگان در عملیات کربلای ۵ — تصویر آرشیو خبری — عکس عملیات کربلای ۵/شلمچه',
    desc: 'تصویر آرشیوی یافت‌شده در جست‌وجوی وب برای پرونده کربلای ۵/شلمچه؛ منبع و مجوز نمایش آرشیوی در همین شناسنامه ثبت است.',
    captureLabel: 'دی–بهمن ۱۳۶۵', location: 'کربلای ۵/شلمچه',
    tags: ["offensive"], opIds: ['karbala-5'],
    sourceName: 'رادیو فردا (آرشیو خبری)', license: 'archival-reference', quality: 'medium',
    authenticity: 'real', verification: 'pending-review',
    verificationNote: 'برای استناد پژوهشی، تطبیق نهایی با آرشیو صاحب اثر توصیه می‌شود.',
    confidence: 'C',
    url: '/images/ops/karbala-5/2.jpg', availability: 'online',
  },
  {
    id: 'm-p14-kheibar-1',
    type: 'photo', title: 'عبور رزمندگان با قایق از هور الهویزه در عملیات خیبر — عکس عملیات خیبر/هور الهویزه',
    desc: 'تصویر آرشیوی یافت‌شده در جست‌وجوی وب برای پرونده خیبر/هور الهویزه؛ منبع و مجوز نمایش آرشیوی در همین شناسنامه ثبت است.',
    captureLabel: 'بهمن–اسفند ۱۳۶۲', location: 'خیبر/هور الهویزه',
    tags: ["offensive", "marsh"], opIds: ['kheibar'],
    sourceName: 'همشهری آنلاین (آرشیو جنگ)', license: 'archival-reference', quality: 'medium',
    authenticity: 'real', verification: 'pending-review',
    verificationNote: 'برای استناد پژوهشی، تطبیق نهایی با آرشیو صاحب اثر توصیه می‌شود.',
    confidence: 'B',
    url: '/images/ops/kheibar/1.jpg', availability: 'online',
  },
  {
    id: 'm-p14-kheibar-2',
    type: 'photo', title: 'قایق‌رانی رزمندگان در هور — عملیات خیبر — عکس عملیات خیبر/هور الهویزه',
    desc: 'تصویر آرشیوی یافت‌شده در جست‌وجوی وب برای پرونده خیبر/هور الهویزه؛ منبع و مجوز نمایش آرشیوی در همین شناسنامه ثبت است.',
    captureLabel: 'بهمن–اسفند ۱۳۶۲', location: 'خیبر/هور الهویزه',
    tags: ["offensive", "marsh"], opIds: ['kheibar'],
    sourceName: 'اندیشه ناب', license: 'archival-reference', quality: 'medium',
    authenticity: 'real', verification: 'pending-review',
    verificationNote: 'برای استناد پژوهشی، تطبیق نهایی با آرشیو صاحب اثر توصیه می‌شود.',
    confidence: 'C',
    url: '/images/ops/kheibar/2.jpg', availability: 'online',
  },
  {
    id: 'm-p14-martyrs-general-1',
    type: 'photo', title: 'گفت‌وگوی خبرنگار با رزمنده سربندبسته در جبهه — چهره‌های جنگ — عکس عملیات چهره‌های جبهه',
    desc: 'تصویر آرشیوی یافت‌شده در جست‌وجوی وب برای پرونده چهره‌های جبهه؛ منبع و مجوز نمایش آرشیوی در همین شناسنامه ثبت است.',
    captureLabel: '۱۳۵۹–۱۳۶۷', location: 'چهره‌های جبهه',
    tags: ["martyrs", "hero"], opIds: [],
    sourceName: 'خبرگزاری دفاع مقدس (دفاپرس)', license: 'archival-reference', quality: 'medium',
    authenticity: 'real', verification: 'pending-review',
    verificationNote: 'برای استناد پژوهشی، تطبیق نهایی با آرشیو صاحب اثر توصیه می‌شود.',
    confidence: 'B',
    url: '/images/ops/martyrs-general/1.jpg', availability: 'online',
  },
  {
    id: 'm-p14-mersad-1',
    type: 'photo', title: 'نیروهای عملیاتی مرصاد در بالگرد در مسیر منطقه غرب — عکس عملیات مرصاد/کرمانشاه',
    desc: 'تصویر آرشیوی یافت‌شده در جست‌وجوی وب برای پرونده مرصاد/کرمانشاه؛ منبع و مجوز نمایش آرشیوی در همین شناسنامه ثبت است.',
    captureLabel: 'مرداد ۱۳۶۷', location: 'مرصاد/کرمانشاه',
    tags: ["defensive"], opIds: ['mersad'],
    sourceName: 'هم‌نوا (آژانس خبری)', license: 'archival-reference', quality: 'medium',
    authenticity: 'real', verification: 'pending-review',
    verificationNote: 'برای استناد پژوهشی، تطبیق نهایی با آرشیو صاحب اثر توصیه می‌شود.',
    confidence: 'C',
    url: '/images/ops/mersad/1.jpg', availability: 'online',
  },
  {
    id: 'm-p14-mersad-2',
    type: 'photo', title: 'رزمندگان مرصاد پس از پیروزی در منطقه عملیاتی غرب — عکس عملیات مرصاد/کرمانشاه',
    desc: 'تصویر آرشیوی یافت‌شده در جست‌وجوی وب برای پرونده مرصاد/کرمانشاه؛ منبع و مجوز نمایش آرشیوی در همین شناسنامه ثبت است.',
    captureLabel: 'مرداد ۱۳۶۷', location: 'مرصاد/کرمانشاه',
    tags: ["defensive"], opIds: ['mersad'],
    sourceName: 'همشهری آنلاین (آرشیو جنگ)', license: 'archival-reference', quality: 'medium',
    authenticity: 'real', verification: 'pending-review',
    verificationNote: 'برای استناد پژوهشی، تطبیق نهایی با آرشیو صاحب اثر توصیه می‌شود.',
    confidence: 'B',
    url: '/images/ops/mersad/2.jpg', availability: 'online',
  },
  {
    id: 'm-p14-ramadan-61-1',
    type: 'photo', title: 'غواصان و نیروهای تهاجم دریایی عملیات رمضان — عکس عملیات رمضان/شرق بصره',
    desc: 'تصویر آرشیوی یافت‌شده در جست‌وجوی وب برای پرونده رمضان/شرق بصره؛ منبع و مجوز نمایش آرشیوی در همین شناسنامه ثبت است.',
    captureLabel: 'تیر ۱۳۶۱', location: 'رمضان/شرق بصره',
    tags: ["offensive"], opIds: ['ramadan-61'],
    sourceName: 'ایمنا (مؤسسه مطالعات و پژوهش‌های خبری)', license: 'archival-reference', quality: 'medium',
    authenticity: 'real', verification: 'pending-review',
    verificationNote: 'برای استناد پژوهشی، تطبیق نهایی با آرشیو صاحب اثر توصیه می‌شود.',
    confidence: 'B',
    url: '/images/ops/ramadan-61/1.jpg', availability: 'online',
  },
  {
    id: 'm-p14-ramadan-61-2',
    type: 'photo', title: 'صفحه اول روزنامه اطلاعات در روزگار عملیات رمضان — سند مطبوعاتی — عکس عملیات رمضان/شرق بصره',
    desc: 'تصویر آرشیوی یافت‌شده در جست‌وجوی وب برای پرونده رمضان/شرق بصره؛ منبع و مجوز نمایش آرشیوی در همین شناسنامه ثبت است.',
    captureLabel: 'تیر ۱۳۶۱', location: 'رمضان/شرق بصره',
    tags: ["offensive"], opIds: ['ramadan-61'],
    sourceName: 'روزنامه اطلاعات (بازنشر خبرگزاری دفاع مقدس)', license: 'archival-reference', quality: 'medium',
    authenticity: 'real', verification: 'pending-review',
    verificationNote: 'برای استناد پژوهشی، تطبیق نهایی با آرشیو صاحب اثر توصیه می‌شود.',
    confidence: 'C',
    url: '/images/ops/ramadan-61/2.jpg', availability: 'online',
  },
  {
    id: 'm-p14-valfajr-8-1',
    type: 'photo', title: 'رزمندگان در جشن آزادسازی فاو در گل‌وگل جبهه — عکس عملیات والفجر ۸/فاو',
    desc: 'تصویر آرشیوی یافت‌شده در جست‌وجوی وب برای پرونده والفجر ۸/فاو؛ منبع و مجوز نمایش آرشیوی در همین شناسنامه ثبت است.',
    captureLabel: 'اسفند ۱۳۶۴', location: 'والفجر ۸/فاو',
    tags: ["offensive", "faw"], opIds: ['valfajr-8'],
    sourceName: 'همشهری آنلاین (آرشیو جنگ)', license: 'archival-reference', quality: 'medium',
    authenticity: 'real', verification: 'pending-review',
    verificationNote: 'برای استناد پژوهشی، تطبیق نهایی با آرشیو صاحب اثر توصیه می‌شود.',
    confidence: 'B',
    url: '/images/ops/valfajr-8/1.jpg', availability: 'online',
  },
  {
    id: 'm-p14-valfajr-8-2',
    type: 'photo', title: 'رزمندگان والفجر ۸ با پرتره‌های شهدا در دود نبرد — عکس عملیات والفجر ۸/فاو',
    desc: 'تصویر آرشیوی یافت‌شده در جست‌وجوی وب برای پرونده والفجر ۸/فاو؛ منبع و مجوز نمایش آرشیوی در همین شناسنامه ثبت است.',
    captureLabel: 'اسفند ۱۳۶۴', location: 'والفجر ۸/فاو',
    tags: ["offensive", "faw"], opIds: ['valfajr-8'],
    sourceName: 'ایرنا (آرشیو مطبوعاتی)', license: 'archival-reference', quality: 'medium',
    authenticity: 'real', verification: 'pending-review',
    verificationNote: 'برای استناد پژوهشی، تطبیق نهایی با آرشیو صاحب اثر توصیه می‌شود.',
    confidence: 'B',
    url: '/images/ops/valfajr-8/2.jpg', availability: 'online',
  },
  {
    id: 'm-p14-valfajr-8-3',
    type: 'photo', title: 'برافراشتن پرچم ایران روی خاکریز فاو — عکس عملیات والفجر ۸/فاو',
    desc: 'تصویر آرشیوی یافت‌شده در جست‌وجوی وب برای پرونده والفجر ۸/فاو؛ منبع و مجوز نمایش آرشیوی در همین شناسنامه ثبت است.',
    captureLabel: 'اسفند ۱۳۶۴', location: 'والفجر ۸/فاو',
    tags: ["offensive", "faw"], opIds: ['valfajr-8'],
    sourceName: 'ایرنا (آرشیو مطبوعاتی)', license: 'archival-reference', quality: 'medium',
    authenticity: 'real', verification: 'pending-review',
    verificationNote: 'برای استناد پژوهشی، تطبیق نهایی با آرشیو صاحب اثر توصیه می‌شود.',
    confidence: 'B',
    url: '/images/ops/valfajr-8/3.jpg', availability: 'online',
  },
]

// ─── ویدیوها و فیلم‌های آرشیوی (شناسنامه؛ نمایش از منبع مجاز یا پیوند رسمی) ───
export const VIDEO_ITEMS: MediaItem[] = [
  {
    id: 'v-saddam-abrogate',
    type: 'video', title: 'اعلامیه صدام درباره لغو یک‌جانبه توافق الجزایر',
    desc: 'پخش تلویزیون عراق: صدام حسین در ۲۶ شهریور ۱۳۵۹ (۱۷ سپتامبر ۱۹۸۰) توافق ۱۹۷۵ را لغو کرد؛ بر اساس روایت رایج، سند توافق را در برابر دوربین پاره کرد.',
    captureDate: '1980-09-17', captureLabel: '۲۶ شهریور ۱۳۵۹', publishDate: 'همان روز — تلویزیون عراق',
    location: 'بغداد', people: ['صدام حسین'], tags: ['saddam-dossier', 'roots', 'algiers'],
    sourceName: 'تلویزیون عراق (آرشیوهای خبری بین‌المللی)',
    sourceUrl: 'https://www.bbc.co.uk/archives', archiveOrg: 'آرشیو بی‌بی‌سی / AP Archive',
    license: 'rights-reserved', quality: 'medium', authenticity: 'real',
    verification: 'pending-review', confidence: 'B', availability: 'link-only',
    displayNote: 'فیلم در آرشیوهای خبری بین‌المللی (BBC / AP) موجود است و بازنشر کامل در این موزه مجاز نیست — از پیوند رسمی استفاده کنید. اگر نسخه اصلی در دسترس نبود، صریحاً اعلام می‌شود و فیلم جایگزینِ نامرتبط قرار نمی‌گیرد.',
  },
  {
    id: 'v-saddam-council',
    type: 'video', title: 'جلسات شورای فرماندهی انقلاب عراق در دوره تصمیم‌گیری جنگ',
    desc: 'اسناد صوتی/تصویری جلسات صدام با مقامات ارشد بعث (از مجموعه ضبط‌های منتشرشده در پژوهش Murray & Woods و آرشیوهای ملی عراق).',
    captureLabel: '۱۳۵۹ (تابستان)', location: 'بغداد', people: ['صدام حسین', 'شورای فرماندهی انقلاب عراق'],
    tags: ['saddam-dossier'], sourceName: 'آرشیوهای ملی عراق / پژوهش Murray & Woods',
    archiveOrg: 'Hoover Institution / آرشیو ملی عراق', license: 'rights-reserved', quality: 'medium',
    authenticity: 'real', verification: 'pending-review', confidence: 'B', availability: 'not-digitized',
    displayNote: 'نسخه کامل تصویری جلسات در دسترس عمومی نیست؛ این موضوع صریحاً اعلام می‌شود. متن و تحلیل اسناد صوتی منتشرشده در پژوهش‌های دانشگاهی موجود است.',
  },
  {
    id: 'v-invasion-tv',
    type: 'video', title: 'گزارش‌های تلویزیونی آغاز تهاجم (۳۱ شهریور ۱۳۵۹)',
    desc: 'گزارش‌های خبری هم‌دوره از آغاز حمله هوایی و زمینی عراق؛ از آرشیوهای ایرنا، بی‌بی‌سی و آژانس‌های بین‌المللی.',
    captureDate: '1980-09-22', captureLabel: '۳۱ شهریور ۱۳۵۹', publishDate: 'شهریور–مهر ۱۳۵۹',
    location: 'خوزستان و بغداد', tags: ['invasion', 'roots', 'front'],
    sourceName: 'آرشیوهای خبری ایران و بین‌الملل', sourceUrl: 'https://irna.ir',
    license: 'rights-reserved', quality: 'medium', authenticity: 'real',
    verification: 'pending-review', confidence: 'B', availability: 'link-only',
    displayNote: 'در پرونده «۳۱ شهریور» فصل ریشه‌ها، گلچین گزارش‌ها با شناسنامه و پیوند منبع معرفی می‌شود.',
  },
  {
    id: 'v-rf-series',
    type: 'video', title: 'مجموعه مستند «روایت فتح»',
    desc: 'مجموعه مستندهای دفاع مقدس با کارگردانی و نریشن شهید سید مرتضی آوینی؛ آرشیو رسمی در حوزه هنری.',
    captureLabel: '۱۳۶۱ به بعد', location: 'جبهه‌های ایران و عراق',
    people: ['سید مرتضی آوینی'], tags: ['avini', 'documentary'],
    sourceName: 'حوزه هنری انقلاب اسلامی — دفتر ادبیات و هنر مقاومت',
    sourceUrl: 'https://howzeh-honari.ir', archiveOrg: 'حوزه هنری', license: 'rights-reserved',
    quality: 'high', authenticity: 'real', verification: 'confirmed', confidence: 'A',
    availability: 'link-only',
    displayNote: 'بازنشر کامل اثر دارای حق نشر مجاز نیست؛ در بخش «روایت فتح» مشخصات آرشیوی هر قسمت و پیوند منبع رسمی ارائه می‌شود.',
  },
  {
    id: 'v-mersad-news',
    type: 'video', title: 'گزارش‌های مرداد ۱۳۶۷ — فروغ جاویدان و مرصاد',
    desc: 'گزارش‌های خبری دوران تهاجم سازمان منافقین و عملیات مرصاد.',
    captureLabel: 'مرداد ۱۳۶۷', location: 'کرمانشاه و ایلام', tags: ['mersad', 'front'],
    opIds: ['forough-javidan', 'mersad'], sourceName: 'آرشیوهای خبری ایران',
    sourceUrl: 'https://irna.ir', license: 'rights-reserved', quality: 'medium',
    authenticity: 'real', verification: 'pending-review', confidence: 'B', availability: 'link-only',
  },
  {
    id: 'v-halabja-docs',
    type: 'video', title: 'مستندهای حلبچه و سلاح شیمیایی',
    desc: 'مستندها و گزارش‌های کارشناسی درباره بمباران شیمیایی حلبچه (۲۶ اسفند ۱۳۶۶) و سردشت.',
    captureLabel: '۱۳۶۶–۱۳۶۷', location: 'حلبچه و سردشت', tags: ['chemical'],
    opIds: ['halabja-chem', 'sardasht-chem'], sourceName: 'آرشیوهای خبری بین‌المللی',
    license: 'rights-reserved', quality: 'medium', authenticity: 'real',
    verification: 'pending-review', confidence: 'B', availability: 'link-only',
    displayNote: 'از نمایش تصاویر دلخراش پرهیز می‌شود؛ گزارش‌های کارشناسی و روایت‌های انسانی منتخب معرفی می‌شوند.',
  },
]

// ─── راهنمای آرشیوها (بخش ۲.۲ و ۲.۳ فاز ۲) ───
export interface ArchiveDirectory {
  id: string
  name: string
  country: 'iran' | 'iraq' | 'international'
  kind: 'official' | 'media' | 'military' | 'academic' | 'broadcast'
  url?: string
  accessNote: string
  usageTerms: string
}

export const ARCHIVE_DIRECTORIES: ArchiveDirectory[] = [
  { id: 'ar-icrdc', name: 'مرکز اسناد و تحقیقات دفاع مقدس', country: 'iran', kind: 'official', url: 'https://icrdc.ir', accessNote: 'دسترسی پژوهشی با درخواست رسمی؛ بخشی از اسناد در پایگاه وب منتشر است.', usageTerms: 'استفاده پژوهشی با ذکر منبع؛ انتشار تجاری نیازمند مجوز کتبی.' },
  { id: 'ar-hafiz', name: 'بنیاد حفظ آثار و نشر ارزش‌های دفاع مقدس', country: 'iran', kind: 'official', url: 'https://navideshahed.com', accessNote: 'پرونده شهدا و آرشیو صوت/تصویر در سامانه نوید شاهد.', usageTerms: 'بازنشر با ذکر منبع؛ برخی آثار دارای حق نشر.' },
  { id: 'ar-irna', name: 'خبرگزاری جمهوری اسلامی (ایرنا)', country: 'iran', kind: 'media', url: 'https://irna.ir', accessNote: 'آرشیو عکس و خبر دوران جنگ؛ جست‌وجوی موضوعی فعال.', usageTerms: 'استفاده با ذکر منبع و در چارچوب قواعد خبرگزاری.' },
  { id: 'ar-irib', name: 'آرشیو صداوسیما و مستندهای دفاع مقدس', country: 'iran', kind: 'broadcast', accessNote: 'دسترسی درون‌سازمانی؛ برخی آثار از طریق حوزه هنری منتشر می‌شود.', usageTerms: 'حق نشر صداوسیما؛ نمایش عمومی نیازمند مجوز.' },
  { id: 'ar-hozeh', name: 'حوزه هنری — آرشیو شهید آوینی و روایت فتح', country: 'iran', kind: 'official', url: 'https://howzeh-honari.ir', accessNote: 'آرشیو رسمی روایت فتح؛ اطلاعات تولید هر قسمت.', usageTerms: 'بازنشر کامل ممنوع؛ پیوند رسمی مجاز.' },
  { id: 'ar-bonyad', name: 'بنیاد شهید و امور ایثارگران', country: 'iran', kind: 'official', accessNote: 'پرونده فردی شهدا و جانبازان؛ دسترسی خانوادگی و پژوهشی.', usageTerms: 'مشخصات فردی محرمانه است؛ استفاده پژوهشی با مجوز.' },
  { id: 'ar-army', name: 'آرشیوهای ارتش و سپاه پاسداران', country: 'iran', kind: 'military', accessNote: 'آرشیو عملیاتی؛ دسترسی محدود.', usageTerms: 'با مجوز رسمی.' },
  { id: 'ar-jahad', name: 'آرشیو جهاد سازندگی و مطبوعات ایران', country: 'iran', kind: 'media', accessNote: 'گزارش‌های مردمی و جهادی دوران جنگ.', usageTerms: 'با ذکر منبع.' },
  { id: 'ar-iraq-tv', name: 'فیلم‌های رسمی حکومت بعث و تلویزیون دولتی عراق', country: 'iraq', kind: 'broadcast', accessNote: 'در آرشیوهای ملی عراق و مجموعه‌های غربی (Hoover, Wilson Center) منتشر شده است.', usageTerms: 'سند تاریخی؛ بررسی اصالت و زمینه انتشار الزامی است.' },
  { id: 'ar-iraq-army', name: 'تصاویر و اسناد ارتش عراق (شورای فرماندهی انقلاب)', country: 'iraq', kind: 'military', accessNote: 'بخشی در اسناد ملی آمریکا (NARA) و آرشیوهای پژوهشی است.', usageTerms: 'با بررسی اصالت.' },
  { id: 'ar-bbc', name: 'آرشیو تاریخی بی‌بی‌سی', country: 'international', kind: 'broadcast', url: 'https://www.bbc.co.uk/archives', accessNote: 'گزارش‌های هم‌دوره جنگ.', usageTerms: 'حق نشر بی‌بی‌سی؛ پیوند رسمی مجاز.' },
  { id: 'ar-ap', name: 'آرشیوهای AP و Reuters', country: 'international', kind: 'media', url: 'https://www.aparchive.com', accessNote: 'تصاویر و ویدیوهای خبری جنگ؛ جست‌وجوی موضعی.', usageTerms: 'حق نشر آژانس؛ خرید یا پیوند رسمی.' },
  { id: 'ar-un', name: 'آرشیو سازمان ملل (قطعنامه‌ها و گزارش‌های دبیرکل)', country: 'international', kind: 'official', url: 'https://digitallibrary.un.org', accessNote: 'اسناد رسمی رایگان و قابل استناد.', usageTerms: 'استناد آزاد با ذکر سند.' },
  { id: 'ar-acad', name: 'مجموعه‌های پژوهشی دانشگاه‌ها (Hoover, Georgetown, طاق‌بُستان و...)', country: 'international', kind: 'academic', accessNote: 'اسناد صوتی بعث و پژوهش‌های مرجع.', usageTerms: 'بر اساس قواعد هر مجموعه.' },
]

export const MEDIA_VERIFICATION_LABELS: Record<MediaVerification, string> = {
  confirmed: 'تأیید کارشناسی‌شده',
  'pending-review': 'در انتظار تأیید کارشناسی نهایی',
  'unverified-origin': 'تاریخ و منشأ نامشخص',
}
export const MEDIA_LICENSE_LABELS: Record<MediaLicense, string> = {
  public: 'مجوز آزاد',
  'archival-reference': 'نمایش آرشیوی با ارجاع به منبع',
  'rights-reserved': 'دارای حق نشر — پیوند رسمی',
}
export const MEDIA_AVAILABILITY_LABELS: Record<MediaAvailability, string> = {
  online: 'قابل نمایش در موزه',
  'link-only': 'پیوند به منبع رسمی',
  'not-digitized': 'دسترس‌پذیر نیست (نیازمند دسترسی آرشیو)',
  'archived-offline': 'در آرشیو آفلاین موزه',
}
export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
  photo: 'عکس', video: 'فیلم', document: 'سند', audio: 'صوت',
}
export const MEDIA_AUTHENTICITY_LABELS: Record<MediaItem['authenticity'], string> = {
  real: 'واقعی (آرشیوی)', reconstruction: 'بازسازی', artwork: 'اثر هنری', infographic: 'اینفوگرافیک',
}
