import type { GeoPoint } from './types'

// ─── شهرها و مکان‌های مهم (مختصات واقعی جغرافیایی) ───
export interface City extends GeoPoint {
  id: string
  fa: string
  en: string
  country: 'iran' | 'iraq' | 'kuwait'
  pop?: string
  importance: string
  relatedOps?: string[]
}

export const CITIES: City[] = [
  { id: 'tehran', fa: 'تهران', en: 'Tehran', lat: 35.69, lng: 51.39, country: 'iran', importance: 'پایتخت؛ هدف اصلی موشک‌باران «الحسین» در دور پنجم جنگ شهرها (۱۳۶۶–۶۷).', relatedOps: ['war-of-cities'] },
  { id: 'ahvaz', fa: 'اهواز', en: 'Ahvaz', lat: 31.32, lng: 48.67, country: 'iran', importance: 'مرکز خوزستان؛ در برد توپخانه عراق در سال‌های نخست جنگ بود.', relatedOps: ['nasr-59'] },
  { id: 'khorramshahr', fa: 'خرمشهر', en: 'Khorramshahr', lat: 30.44, lng: 48.17, country: 'iran', importance: 'درگاه اروندرود؛ پس از ۳۴ روز مقاومت در ۴ آبان ۱۳۵۹ سقوط کرد و در ۳ خرداد ۱۳۶۱ آزاد شد.', relatedOps: ['khorramshahr-battle', 'bayt-almoghaddas'] },
  { id: 'abadan', fa: 'آبادان', en: 'Abadan', lat: 30.34, lng: 48.30, country: 'iran', importance: 'پالایشگاه بزرگ جهان؛ بیش از یک سال در محاصره عراق بود تا ثامن‌الائمه (۵ مهر ۱۳۶۰).', relatedOps: ['samen-ol-aemmeh'] },
  { id: 'dezful', fa: 'دزفول', en: 'Dezful', lat: 32.38, lng: 48.41, country: 'iran', importance: 'پایگاه اصلی پدافند جبهه میانی جنوب؛ بارها هدف آتش عراق.', relatedOps: ['nasr-59', 'fath-ol-mobin'] },
  { id: 'andimeshk', fa: 'اندیمشک', en: 'Andimeshk', lat: 32.46, lng: 48.36, country: 'iran', importance: 'شهرک پشتیبانی جبهه؛ بازار آن در آبان ۱۳۵۹ هدف بمباران غیرنظامیان شد.' },
  { id: 'susangerd', fa: 'سوسنگرد', en: 'Susangerd', lat: 31.54, lng: 48.05, country: 'iran', importance: 'صحنه نبردهای آبان ۱۳۵۹ و دی ۱۳۵۹؛ ۲۶ آبان ۱۳۵۹ آزاد شد.', relatedOps: ['susangerd-battle', 'nasr-59'] },
  { id: 'bostan', fa: 'بستان', en: 'Bostan', lat: 31.74, lng: 47.88, country: 'iran', importance: 'شهر مرزی دشت آزادگان؛ ۹ آذر ۱۳۶۰ در طریق‌القدس آزاد شد.', relatedOps: ['tariq-ol-qods'] },
  { id: 'hoveyzeh', fa: 'هویزه', en: 'Hoveyzeh', lat: 31.46, lng: 47.98, country: 'iran', importance: 'صحنه نبرد دی ۱۳۵۹ و شهادت دانشجویان پیرو خط امام؛ در بیت‌المقدس آزاد شد.', relatedOps: ['nasr-59', 'bayt-almoghaddas'] },
  { id: 'mahshahr', fa: 'ماهشهر (بندر)', en: 'Bandar-e Mahshahr', lat: 30.56, lng: 49.20, country: 'iran', importance: 'محور دفاع شرق کارون؛ هدف عملیات توکل برای جلوگیری از سقوط.' },
  { id: 'shushtar', fa: 'شوشتر', en: 'Shushtar', lat: 32.05, lng: 48.85, country: 'iran', importance: 'شهرک پشتیبانی جبهه جنوب.' },
  { id: 'shush', fa: 'شوش', en: 'Shush', lat: 32.19, lng: 48.25, country: 'iran', importance: 'در اشغال عراق بود تا عملیات فتح‌المبین (فروردین ۱۳۶۱).', relatedOps: ['fath-ol-mobin'] },
  { id: 'khorramabad', fa: 'خرم‌آباد', en: 'Khorramabad', lat: 33.49, lng: 48.35, country: 'iran', importance: 'هدف بمباران‌های هوایی عراق.' },
  { id: 'dehloran', fa: 'دهلران', en: 'Dehloran', lat: 33.11, lng: 47.27, country: 'iran', importance: 'محور جبهه میانی؛ صحنه والفجر ۱ و محرم.' },
  { id: 'mehran', fa: 'مهران', en: 'Mehran', lat: 33.12, lng: 46.13, country: 'iran', importance: 'چهار بار دست‌به‌دست شد؛ در والفجر ۳ (مرداد ۶۲) و کربلای ۱ (تیر ۶۵) آزاد شد.', relatedOps: ['valfajr-3', 'karbala-1'] },
  { id: 'ilam', fa: 'ایلام', en: 'Ilam', lat: 33.64, lng: 46.42, country: 'iran', importance: 'مرکز جبهه میانی؛ هدف پایدار آتش توپخانه و هواپیماهای عراق.' },
  { id: 'sumar', fa: 'سومار', en: 'Sumar', lat: 34.25, lng: 45.88, country: 'iran', importance: 'منطقه عملیات مسلم بن عقیل و کربلای ۶.', relatedOps: ['moslem-ibn-aghil', 'karbala-6'] },
  { id: 'qasr-e-shirin', fa: 'قصرشیرین', en: 'Qasr-e Shirin', lat: 34.58, lng: 45.58, country: 'iran', importance: 'در آبان ۱۳۵۹ سقوط کرد و حدود دو سال در اشغال بود.', relatedOps: ['iraq-invasion', 'karbala-9'] },
  { id: 'kermanshah', fa: 'کرمانشاه', en: 'Kermanshah', lat: 34.31, lng: 47.07, country: 'iran', importance: 'صحنه دفاع نهایی در برابر تهاجم فروغ جاویدان (مرداد ۱۳۶۷).', relatedOps: ['mersad'] },
  { id: 'sarpol-zahab', fa: 'سرپل ذهاب', en: 'Sarpol-e Zahab', lat: 34.32, lng: 45.84, country: 'iran', importance: 'محور عملیات کربلای ۹.' },
  { id: 'naft-shahr', fa: 'نفت‌شهر', en: 'Naft Shahr', lat: 34.16, lng: 45.94, country: 'iran', importance: 'منطقه نفت‌خیز مرزی؛ صحنه کربلای ۶ (۲۴ دی ۱۳۶۵).', relatedOps: ['karbala-6'] },
  { id: 'sanandaj', fa: 'سنندج', en: 'Sanandaj', lat: 35.32, lng: 46.99, country: 'iran', importance: 'مرکز استان کردستان؛ منطقه ناامنی گروه‌های اپوزیسیون در سال‌های نخست جنگ.' },
  { id: 'mariwan', fa: 'مریوان', en: 'Marivan', lat: 35.53, lng: 46.18, country: 'iran', importance: 'محور والفجر ۹ (اسفند ۱۳۶۴).', relatedOps: ['valfajr-9'] },
  { id: 'sardasht', fa: 'سردشت', en: 'Sardasht', lat: 36.16, lng: 45.56, country: 'iran', importance: '۷ تیر ۱۳۶۶ هدف بمباران شیمیایی عراق؛ ۱۱۰ شهید رسمی و هزاران مصدوم.' },
  { id: 'bukan', fa: 'بوکان', en: 'Bukan', lat: 36.52, lng: 46.21, country: 'iran', importance: 'منطقه عملیات بوکان (۱۳۶۶).' },
  { id: 'urmia', fa: 'ارومیه', en: 'Urmia', lat: 37.55, lng: 45.08, country: 'iran', importance: 'محور شمالی کردستان؛ پایگاه لشکر ۶۴.' },
  { id: 'piranshahr', fa: 'پیرانشهر', en: 'Piranshahr', lat: 36.70, lng: 45.14, country: 'iran', importance: 'محور عملیات‌های حاج‌عمران (والفجر ۲، کربلای ۲ و ۷).', relatedOps: ['valfajr-2', 'karbala-2', 'karbala-7'] },
  { id: 'baneh', fa: 'بانه', en: 'Baneh', lat: 35.99, lng: 45.88, country: 'iran', importance: 'محور عملیات کربلای ۱۰ (فروردین ۱۳۶۶).', relatedOps: ['karbala-10'] },
  { id: 'tabriz', fa: 'تبریز', en: 'Tabriz', lat: 38.08, lng: 46.29, country: 'iran', importance: 'هدف بمباران‌های هوایی و موشکی عراق در جنگ شهرها.' },
  { id: 'isfahan', fa: 'اصفهان', en: 'Isfahan', lat: 32.65, lng: 51.67, country: 'iran', importance: 'هدف بمباران و موشک‌باران عراق.' },
  { id: 'shiraz', fa: 'شیراز', en: 'Shiraz', lat: 29.59, lng: 52.58, country: 'iran', importance: 'هدف بمباران‌های هوایی عراق؛ پایگاه هوایی کلیدی ایران.' },
  { id: 'qom', fa: 'قم', en: 'Qom', lat: 34.64, lng: 50.88, country: 'iran', importance: 'هدف موشک‌های الحسین در ۱۳۶۷.' },
  { id: 'bandar-abbas', fa: 'بندرعباس', en: 'Bandar Abbas', lat: 27.19, lng: 56.28, country: 'iran', importance: 'مبدأ پرواز ۶۵۵ ایران‌ایر که در ۱۲ تیر ۱۳۶۷ ساقط شد.' },
  { id: 'kharg', fa: 'جزیره خارک', en: 'Kharg Island', lat: 29.25, lng: 50.33, country: 'iran', importance: 'پایانه اصلی صادرات نفت ایران؛ بارها هدف حملات هوایی عراق.' },
  { id: 'sirri', fa: 'جزیره سیری', en: 'Sirri Island', lat: 25.92, lng: 54.53, country: 'iran', importance: 'پایانه صادرات نفت؛ فروردین ۱۳۶۶ هدف حمله هوایی عراق شد.' },
  { id: 'baghdad', fa: 'بغداد', en: 'Baghdad', lat: 33.31, lng: 44.36, country: 'iraq', importance: 'پایتخت؛ هدف بمباران‌های هوایی ایران و موشک‌های اسکاد.' },
  { id: 'basra', fa: 'بصره', en: 'Basra', lat: 30.51, lng: 47.78, country: 'iraq', importance: 'هدف نهایی عملیات‌های رمضان، کربلای ۵ و ۸؛ محاصره طولانی.' },
  { id: 'faw', fa: 'فاو', en: 'Faw', lat: 29.98, lng: 48.49, country: 'iraq', importance: 'شبه‌جزیره کلید دسترسی عراق به خلیج فارس؛ بهمن ۱۳۶۴ به دست ایران افتاد و فروردین ۱۳۶۷ بازپس‌گیری شد.', relatedOps: ['valfajr-8', 'second-faw'] },
  { id: 'um-al-rasas', fa: 'جزیره ام‌الرصاص', en: 'Umm al-Rasas', lat: 30.05, lng: 48.43, country: 'iraq', importance: 'صحنه شکست‌خورده کربلای ۴.', relatedOps: ['karbala-4'] },
  { id: 'shalamcheh', fa: 'شلمچه', en: 'Shalamcheh', lat: 30.69, lng: 47.94, country: 'iraq', importance: 'صحنه کربلای ۵، ۸ و بیت‌المقدس ۷؛ اردیبهشت ۱۳۶۷ بازپس‌گیری شد.', relatedOps: ['karbala-5', 'karbala-8'] },
  { id: 'majnoon', fa: 'جزایر مجنون', en: 'Majnoon Islands', lat: 31.06, lng: 47.35, country: 'iraq', importance: 'میدان نفتی عظیم؛ در خیبر (اسفند ۶۲) تصرف و تیر ۶۷ بازپس‌گیری شد.', relatedOps: ['kheibar', 'majnoon-recapture'] },
  { id: 'amara', fa: 'العماره', en: 'Amarah', lat: 31.84, lng: 47.15, country: 'iraq', importance: 'هدف والفجر مقدماتی که محقق نشد.' },
  { id: 'fakkeh', fa: 'فکه', en: 'Fakkeh', lat: 32.03, lng: 47.50, country: 'iraq', importance: 'صحنه والفجر مقدماتی و والفجر ۱؛ گورستان معروف رزمندگان.', relatedOps: ['valfajr-moqaddamati', 'valfajr-1'] },
  { id: 'chazabeh', fa: 'چذابه', en: 'Chazabeh', lat: 31.97, lng: 47.72, country: 'iraq', importance: 'تنگه کلیدی طريق‌القدس و والفجر مقدماتی.' },
  { id: 'kirkuk', fa: 'کرکوک', en: 'Kirkuk', lat: 35.47, lng: 44.39, country: 'iraq', importance: 'مرکز نفتی؛ هدف بمباران‌های هوایی ایران.' },
  { id: 'sulaymaniyah', fa: 'سلیمانیه', en: 'Sulaymaniyah', lat: 35.56, lng: 45.43, country: 'iraq', importance: 'شمال جبهه کردستان؛ در والفجر ۱۰ زیر محاصره ایرانیان رفت.' },
  { id: 'mawat', fa: 'ماووت', en: 'Mawat', lat: 35.95, lng: 45.62, country: 'iraq', importance: 'صحنه کربلای ۱۰ و نصر ۴.', relatedOps: ['karbala-10', 'nasr-4'] },
  { id: 'haj-omran', fa: 'حاج‌عمران', en: 'Haj Omran', lat: 36.19, lng: 45.06, country: 'iraq', importance: 'صحنه والفجر ۲، کربلای ۲ و ۷.', relatedOps: ['valfajr-2', 'karbala-2', 'karbala-7'] },
  { id: 'penjwin', fa: 'پنجوین', en: 'Penjwin', lat: 35.62, lng: 45.95, country: 'iraq', importance: 'صحنه والفجر ۴ (مهر–آبان ۱۳۶۲).', relatedOps: ['valfajr-4'] },
  { id: 'halabja', fa: 'حلبچه', en: 'Halabja', lat: 35.18, lng: 45.99, country: 'iraq', importance: 'در والفجر ۱۰ (اسفند ۶۶) تصرف شد؛ ۱۶ مارس ۱۹۸۸ هدف بزرگ‌ترین حمله شیمیایی به غیرنظامیان.', relatedOps: ['valfajr-10', 'halabja-chem'] },
  { id: 'umm-qasr', fa: 'ام‌القصر', en: 'Umm Qasr', lat: 30.05, lng: 47.97, country: 'iraq', importance: 'پایگاه دریایی و بندر؛ هدف عملیات مروارید.' },
  { id: 'al-bakr', fa: 'سکوی البکر', en: 'Al-Bakr Oil Terminal', lat: 29.72, lng: 48.78, country: 'iraq', importance: 'پایانه صادرات نفت؛ در مروارید (۱۳۵۹) و کربلای ۳ (۱۳۶۵) منهدم شد.', relatedOps: ['morvarid', 'karbala-3'] },
  { id: 'al-amiyah', fa: 'سکوی الامیه', en: 'Al-Amiyah Oil Terminal', lat: 29.60, lng: 48.73, country: 'iraq', importance: 'پایانه صادرات نفت عراق در خلیج فارس.', relatedOps: ['morvarid', 'karbala-3'] },
  { id: 'zurbatiyah', fa: 'زرباتییه', en: 'Zurbatiyah', lat: 33.17, lng: 46.11, country: 'iraq', importance: 'محور حمله عراق به دهلران در تهاجم ۱۳۵۹.' },
  { id: 'musian', fa: 'موسیان', en: 'Musian', lat: 33.02, lng: 47.00, country: 'iran', importance: 'آزادسازی موسیان و میدان بیات در عملیات محرم (آبان ۱۳۶۱).', relatedOps: ['moharram-61'] },
  { id: 'kuwait-city', fa: 'کویت (شهر)', en: 'Kuwait City', lat: 29.37, lng: 47.98, country: 'kuwait', importance: 'حامی مالی عراق؛ نفتکش‌هایش هدف موشک‌های سیلوورم ایران قرار گرفت.' },
]

// ─── رودها (نمایش تقریبی برای درک جغرافیا — سند نقشه‌برداری نیست) ───
export const RIVERS: { id: string; fa: string; path: [number, number][] }[] = [
  { id: 'tigris', fa: 'دجله', path: [[36.35, 43.15], [34.6, 43.7], [33.31, 44.36], [32.5, 45.8], [31.01, 47.05]] },
  { id: 'euphrates', fa: 'فرات', path: [[34.1, 42.4], [33.4, 43.3], [32.47, 44.4], [31.05, 46.26], [31.01, 47.05]] },
  { id: 'shatt', fa: 'شط‌العرب (اروند)', path: [[31.01, 47.05], [30.51, 47.78], [30.44, 48.17], [29.97, 48.55]] },
  { id: 'karun', fa: 'کارون', path: [[32.05, 48.85], [31.32, 48.67], [30.66, 48.31]] },
  { id: 'karkheh', fa: 'کرخه', path: [[32.46, 48.35], [31.55, 48.05], [31.3, 47.7]] },
  { id: 'zab', fa: 'زاب کوچک', path: [[35.9, 45.9], [35.6, 44.6], [35.4, 43.9]] },
]

// ─── نمودهای خط جبهه در مقاطع تاریخی (محدوده‌های «تقریبی» با برچسب صریح) ───
export interface FrontSnapshot {
  id: string
  label: string // «پایان آبان ۱۳۵۹»
  date: string
  year: number
  desc: string
  /** مناطق در اشغال عراق در خاک ایران — چندضلعی‌های تقریبی */
  iraqInIran: { name: string; ring: [number, number][] }[]
  /** مناطق در تصرف ایران در خاک عراق */
  iranInIraq: { name: string; ring: [number, number][] }[]
}

export const FRONT_SNAPSHOTS: FrontSnapshot[] = [
  {
    id: 's-1359-08',
    label: 'آبان ۱۳۵۹ — اوج پیشروی عراق',
    date: '1359-08-20',
    year: 1359,
    desc: 'عراق بخش‌های وسیعی از خوزستان، کرمانشاه و ایلام را اشغال کرده بود؛ خرمشهر سقوط کرده، آبادان در محاصره و سوسنگرد تازه آزاد شده بود.',
    iraqInIran: [
      { name: 'خرمشهر و حومه', ring: [[30.30, 48.00], [30.30, 48.35], [30.62, 48.35], [30.62, 48.00]] },
      { name: 'محاصره آبادان', ring: [[30.22, 48.18], [30.22, 48.45], [30.48, 48.45], [30.48, 48.18]] },
      { name: 'قصرشیرین و زرباتییه', ring: [[34.30, 45.30], [34.30, 45.90], [34.85, 45.90], [34.85, 45.30]] },
      { name: 'مهران و موسیان', ring: [[32.85, 45.90], [32.85, 46.50], [33.35, 46.50], [33.35, 45.90]] },
      { name: 'سومار و نفت‌شهر', ring: [[33.95, 45.55], [33.95, 46.20], [34.55, 46.20], [34.55, 45.55]] },
      { name: 'پیشروی کردستان', ring: [[35.60, 45.30], [35.60, 45.95], [36.45, 45.95], [36.45, 45.30]] },
    ],
    iranInIraq: [],
  },
  {
    id: 's-1361-03',
    label: 'خرداد ۱۳۶۱ — آزادسازی خرمشهر',
    date: '1361-03-05',
    year: 1361,
    desc: 'با آزادسازی خرمشهر در ۳ خرداد ۱۳۶۱، عملاً همه خاک اشغالی ایران بازپس‌گیری شد و خط جبهه تقریباً به مرز بین‌المللی بازگشت.',
    iraqInIran: [
      { name: 'جزایر مجنون (میدان نفتی مرزی)', ring: [[30.95, 47.20], [30.95, 47.50], [31.20, 47.50], [31.20, 47.20]] },
    ],
    iranInIraq: [],
  },
  {
    id: 's-1363-12',
    label: 'اسفند ۱۳۶۳ — جزایر مجنون و هور',
    date: '1363-12-22',
    year: 1363,
    desc: 'پس از خیبر، ایران جزایر مجنون را در خاک عراق نگه داشت؛ در شمال نیز برجستگی‌های پنجوین و حاج‌عمران در تصرف ایران بود.',
    iraqInIran: [],
    iranInIraq: [
      { name: 'جزایر مجنون و هور الهویزه', ring: [[30.90, 47.10], [30.90, 47.55], [31.25, 47.55], [31.25, 47.10]] },
      { name: 'برجستگی پنجوین', ring: [[35.50, 45.80], [35.50, 46.15], [35.90, 46.15], [35.90, 45.80]] },
      { name: 'حاج‌عمران و چومان', ring: [[36.00, 44.85], [36.00, 45.25], [36.35, 45.25], [36.35, 44.85]] },
      { name: 'مهران و ارتفاعات زالوآب', ring: [[32.90, 45.80], [32.90, 46.35], [33.35, 46.35], [33.35, 45.80]] },
    ],
  },
  {
    id: 's-1364-11',
    label: 'بهمن ۱۳۶۴ — تصرف فاو',
    date: '1364-11-25',
    year: 1364,
    desc: 'عملیات والفجر ۸ شبه‌جزیره فاو را تصرف کرد و برای نخستین بار دسترسی مستقیم عراق به خلیج فارس قطع شد.',
    iraqInIran: [],
    iranInIraq: [
      { name: 'شبه‌جزیره فاو', ring: [[29.85, 48.30], [29.85, 48.70], [30.15, 48.70], [30.15, 48.30]] },
      { name: 'جزایر مجنون', ring: [[30.90, 47.10], [30.90, 47.55], [31.25, 47.55], [31.25, 47.10]] },
      { name: 'مهران', ring: [[32.90, 45.80], [32.90, 46.35], [33.35, 46.35], [33.35, 45.80]] },
      { name: 'حاج‌عمران و ماووت', ring: [[35.80, 45.30], [35.80, 45.95], [36.25, 45.95], [36.25, 45.30]] },
    ],
  },
  {
    id: 's-1366-01',
    label: 'دی ۱۳۶۵ — اوج برجستگی‌های ایران در جنوب',
    date: '1366-01-25',
    year: 1366,
    desc: 'پس از کربلای ۵، نیروهای ایران تا حدود ۱۲ کیلومتری بصره پیشروی کردند؛ برجستگی شلمچه و دریاچه بوبیان در تصرف ایران بود.',
    iraqInIran: [],
    iranInIraq: [
      { name: 'برجستگی شلمچه و بوبیان', ring: [[30.45, 47.70], [30.45, 48.15], [30.85, 48.15], [30.85, 47.70]] },
      { name: 'شبه‌جزیره فاو', ring: [[29.85, 48.30], [29.85, 48.70], [30.15, 48.70], [30.15, 48.30]] },
      { name: 'جزایر مجنون', ring: [[30.90, 47.10], [30.90, 47.55], [31.25, 47.55], [31.25, 47.10]] },
      { name: 'مهران', ring: [[32.90, 45.80], [32.90, 46.35], [33.35, 46.35], [33.35, 45.80]] },
      { name: 'حاج‌عمران و ماووت', ring: [[35.75, 45.30], [35.75, 45.95], [36.30, 45.95], [36.30, 45.30]] },
    ],
  },
  {
    id: 's-1367-05',
    label: 'مرداد ۱۳۶۷ — آتش‌بس و بازگشت به مرز',
    date: '1367-05-29',
    year: 1367,
    desc: 'عراق در بهار و تابستان ۱۳۶۷ فاو، شلمچه/طلاییه و مجنون را بازپس‌گرفت؛ پس از آتش‌بس ۲۹ مرداد ۱۳۶۷، ناظران سازمان ملل (UNIIMOG) بازگشت دو طرف به پشت مرز بین‌المللی را نظارت کردند.',
    iraqInIran: [],
    iranInIraq: [
      { name: 'باقی‌مانده برجستگی‌های شمال (تا تکمیل عقب‌نشینی)', ring: [[35.90, 45.40], [35.90, 45.95], [36.30, 45.95], [36.30, 45.40]] },
    ],
  },
]

// ─── پیکان‌های شماتیک حرکت عملیات‌های بزرگ (غیر تاکتیکی — صرفاً جهت کلی تاریخی) ───
export const OP_ARROWS: { id: string; opId: string; year: number; points: [number, number][] }[] = [
  { id: 'a-iraq-khorramshahr', opId: 'iraq-invasion', year: 1359, points: [[30.85, 47.55], [30.44, 48.17]] },
  { id: 'a-iraq-dehloran', opId: 'iraq-invasion', year: 1359, points: [[33.30, 46.05], [33.11, 47.27]] },
  { id: 'a-iraq-qasr', opId: 'iraq-invasion', year: 1359, points: [[34.45, 45.20], [34.58, 45.58]] },
  { id: 'a-fath', opId: 'fath-ol-mobin', year: 1361, points: [[32.35, 48.30], [32.20, 47.75]] },
  { id: 'a-bayt', opId: 'bayt-almoghaddas', year: 1361, points: [[31.80, 48.30], [30.45, 48.20]] },
  { id: 'a-ramadan', opId: 'ramadan-61', year: 1361, points: [[30.65, 48.00], [30.52, 47.78]] },
  { id: 'a-vf8', opId: 'valfajr-8', year: 1364, points: [[30.20, 48.90], [29.99, 48.52]] },
  { id: 'a-karbala5', opId: 'karbala-5', year: 1365, points: [[30.80, 48.00], [30.55, 47.76]] },
  { id: 'a-forough', opId: 'forough-javidan', year: 1367, points: [[33.20, 46.20], [34.25, 47.05]] },
  { id: 'a-mersad', opId: 'mersad', year: 1367, points: [[34.60, 47.20], [33.30, 46.40]] },
  { id: 'a-iraq-faw2', opId: 'second-faw', year: 1367, points: [[30.45, 48.85], [29.99, 48.52]] },
]
