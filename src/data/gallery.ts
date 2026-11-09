import type { GalleryImage } from './types'

// ─── گالری تصاویر — همه آرشیوی از منابع عمومی وب با ذکر منبع ───
// سیاست رسانه‌ای موزه: عکس واقعی از تصویرسازی/بازسازی هنری تفکیک می‌شود؛
// برای هر تصویر منبع ذکر شده و برای استفاده تجاری باید مجوز بررسی شود.
// از نمایش تصاویر دلخراش و خشونت‌آمیز پرهیز شده است.
export const GALLERY: (GalleryImage & { tags: string[] })[] = [
  {
    id: 'khor-1', url: '/images/arch/552ec9a2306d.jpg',
    title: 'خرابه‌های خرمشهر پس از نبردها', sourceName: 'Ajam Media Collective', kind: 'archival',
    note: 'تصویر آرشیوی از منابع عمومی وب؛ برای استفاده تجاری مجوز بررسی شود.', tags: ['khorramshahr', 'ruins'],
  },
  {
    id: 'khor-2', url: '/images/arch/8ee115bf8967.jpg',
    title: 'ساختمان گلوله‌خورده — آثار نبردهای خیابانی', sourceName: 'Aggregate (آرشیو معماری)', kind: 'archival',
    note: 'تصویر آرشیوی؛ صحت‌سنجی مکان دقیق با آرشیو محلی توصیه می‌شود.', tags: ['khorramshahr', 'ruins'],
  },
  {
    id: 'front-1', url: '/images/arch/0a2c3c57dcd9.jpg',
    title: 'رزمندگان در سنگرهای صحرایی جبهه جنوب', sourceName: 'BBC (آرشیو جنگ)', kind: 'archival',
    note: 'تصویر آرشیوی از گزارش‌های هم‌زمان جنگ.', tags: ['front', 'hero'],
  },
  {
    id: 'front-2', url: '/images/arch/caacd135d922.jpg',
    title: 'رزمنده ایرانی در جبهه — تصویر آرشیو تاریخی', sourceName: 'Warfare History Network', kind: 'archival',
    note: 'تصویر آرشیوی از منابع نظامی تاریخی.', tags: ['front', 'hero'],
  },
  {
    id: 'front-3', url: '/images/arch/62f066c40f48.png',
    title: 'فرماندهان در حال مطالعه نقشه عملیات', sourceName: 'آرشیو عمومی وب', kind: 'artistic',
    note: 'بازسازی/تصویر تفسیری — سند تاریخی دست‌اول نیست.', tags: ['front', 'commanders'],
  },
  {
    id: 'air-1', url: '/images/arch/e2c7140b7d2e.jpg',
    title: 'فانتوم اف-۴ نیروی هوایی ارتش جمهوری اسلامی', sourceName: 'منابع عمومی هوانوردی', kind: 'archival',
    note: 'ستون حملات هوایی ایران در کل جنگ (کمان ۹۹، اچ-۳).', tags: ['air'],
  },
  {
    id: 'air-2', url: '/images/arch/ded81eaf82be.jpg',
    title: 'اف-۱۴های نیروی هوایی در پرواز گروهی', sourceName: 'Royal Aeronautical Society', kind: 'archival',
    note: 'ناوچه هوایی ایران با موشک فونیکس در سال‌های جنگ.', tags: ['air'],
  },
  {
    id: 'chem-1', url: '/images/arch/04e79aa72757.jpg',
    title: 'یادمان شهدای حلبچه', sourceName: 'Tripadvisor (آرشیو سفر)', kind: 'archival',
    note: 'یادمان قربانیان بمباران شیمیایی ۱۶ مارس ۱۹۸۸ — به جای تصاویر دلخراش، یادمان نمایش داده می‌شود.', tags: ['chemical'],
  },
  {
    id: 'chem-2', url: '/images/arch/bd7a320ab6ba.jpg',
    title: 'بنای یادبود حلبچه و فواره‌ها', sourceName: 'آرشیو خبری', kind: 'archival',
    note: 'نماد ملی قربانیان سلاح شیمیایی در کردستان عراق.', tags: ['chemical'],
  },
  {
    id: 'gulf-1', url: '/images/arch/e965a1b194fb.jpg',
    title: 'آتش‌سوزی تأسیسات نفتی دریایی در جنگ نفتکش‌ها', sourceName: 'U.S. Naval Institute (Proceedings)', kind: 'archival',
    note: 'تصویر آرشیو نیروی دریایی آمریکا از آتش سکوها/شناورها در خلیج فارس.', tags: ['gulf'],
  },
  {
    id: 'gulf-2', url: '/images/arch/2c7a8201059d.jpg',
    title: 'نفتکش در آب‌های خلیج فارس در دوران جنگ', sourceName: 'The Guardian', kind: 'archival',
    note: 'نفتکش‌های تجاری اصلی‌ترین هدف دو طرف در جنگ نفتکش‌ها بودند.', tags: ['gulf'],
  },
  {
    id: 'gulf-3', url: '/images/arch/6dfa3444f2d8.jpg',
    title: 'ناوشکن آمریکایی آسیب‌دیده در خلیج فارس', sourceName: 'Egypt Independent', kind: 'archival',
    note: 'بر اساس شرح تصویر احتمالاً ناوچه استارک (اصابت اگزوسه عراقی، اردیبهشت ۱۳۶۶)؛ صحت‌سنجی نهایی نیازمند آرشیو رسمی است.', tags: ['gulf'],
  },
  {
    id: 'eqp-1', url: '/images/arch/d68082f1483a.jpg',
    title: 'تانک‌های تی-۷۲ ارتش عراق', sourceName: 'Alamy', kind: 'archival',
    note: 'برتری زرهی عراق در سال‌های میانی جنگ.', tags: ['equipment'],
  },
  {
    id: 'map-1', url: '/images/arch/56237ae28a2f.png',
    title: 'نقشه مناطق درگیری و تحولات جبهه‌ها', sourceName: 'آرشیو وب (توضیحی)', kind: 'map',
    note: 'نقشه توضیحی برای درک عمومی؛ برای پژوهش از اطلس تعاملی این موزه استفاده کنید.', tags: ['map'],
  },
]

export const GALLERY_TAGS = [
  { k: 'all', l: 'همه' }, { k: 'hero', l: 'جبهه‌ها' }, { k: 'khorramshahr', l: 'خرمشهر' },
  { k: 'air', l: 'نبرد هوایی' }, { k: 'gulf', l: 'خلیج فارس' }, { k: 'chemical', l: 'سلاح شیمیایی (یادمان‌ها)' },
  { k: 'equipment', l: 'تجهیزات' }, { k: 'map', l: 'نقشه‌ها' },
]
