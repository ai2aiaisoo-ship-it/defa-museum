import type { StatClaim } from './types'

// ─── آمار کلان جنگ — هر عدد یک «ادعای منبع‌دار» است، نه واقعیت بی‌منشأ ───
export const WAR_STATS: StatClaim[] = [
  // تلفات نظامی — ایران
  { id: 'st-ir-martyrs-front', value: '۱۵۵٫۰۸۱', unit: 'نفر (شمارش بسیج — کشتگان مستقیم جبهه)', side: 'iran', metric: 'کشته‌های نظامی', period: '۱۳۵۹–۱۳۶۷', region: 'کل جبهه‌ها', sourceId: 'kurzman-deathtolls', method: 'شمارش اداری سازمان بسیج', confidence: 'B', note: 'شمارش‌های ایرانی دیگر: ۱۷۲٫۰۵۶ (روزنامه اصلاح‌طلب) و ۱۸۳٫۶۲۳ (مبتنی بر اسناد بنیاد شهید) — اختلاف روش شمارش.' },
  { id: 'st-ir-dead-total', value: '۱۸۸٫۰۱۵ تا ۲۱۷٫۴۸۹', unit: 'نفر (برآورد پژوهشی)', side: 'iran', metric: 'کشته‌های مرتبط با جنگ', period: '۱۳۵۹–۱۳۶۷', region: 'ایران', sourceId: 'salamati-2013', method: 'پژوهش منتشرشده در نشریه علمی (Salamati 2013)', confidence: 'B', note: 'شامل کشتگان جبهه، جنگ شهرها و مرگ‌های مرتبط؛ حدود ۷۰ نفر در روز.' },
  { id: 'st-ir-cities-dead', value: '۱۵٫۹۵۹ تا ۱۶٫۱۵۴', unit: 'نفر', side: 'other', metric: 'کشته‌های غیرنظامی (جنگ شهرها)', period: '۱۳۶۲–۱۳۶۷', region: 'شهرهای ایران', sourceId: 'kurzman-deathtolls', method: 'شمارش‌های ایرانی نقل‌شده در پژوهش کورزمن', confidence: 'B' },
  // تلفات نظامی — عراق
  { id: 'st-iq-dead-low', value: '۱۰۵٫۰۰۰ تا ۲۰۰٫۰۰۰', unit: 'نفر (برآورد)', side: 'iraq', metric: 'کشته‌های نظامی', period: '۱۳۵۹–۱۳۶۷', region: 'کل جبهه‌ها', sourceId: 'canadian-history', method: 'برآوردهای دانشنامه‌ای و پژوهشی؛ عراق آمار رسمی منتشر نکرد', confidence: 'C', note: 'برآورد سرلشکر رعد حمیدانی: ۲۵۰ هزار «شهید» عراقی. ارقام COW (۵۰۰ هزار) بسیار بالاتر از اجماع است.' },
  { id: 'st-iq-dead-hamdani', value: '۲۵۰٫۰۰۰', unit: 'نفر (برآورد فرمانده سابق عراقی)', side: 'iraq', metric: 'کشته‌های نظامی', period: '۱۳۵۹–۱۳۶۷', region: 'کل', sourceId: 'kurzman-deathtolls', method: 'اظهار سرلشکر رعد حمیدانی', confidence: 'C' },
  // مجموع
  { id: 'st-total-dead', value: '۵۰۰٫۰۰۰ تا ۱٫۰۰۰٫۰۰۰+ (برآوردهای گوناگون)', unit: 'نفر — دو طرف', side: 'other', metric: 'مجموع کشتگان جنگ', period: '۱۳۵۹–۱۳۶۷', region: 'ایران و عراق', sourceId: 'kurzman-deathtolls', method: 'جمع‌بندی مجموعه‌های Battle Deaths و COW در مقابل شمارش‌های اداری؛ داده سرشماری‌های پس از جنگ از ارقام بالا پشتیبانی نمی‌کند', confidence: 'C', note: 'این آمار به‌شدت محل اختلاف است؛ هرگز کشته/مجروح/اسیر/مفقود را با هم جمع نکنید.' },
  // اسرا
  { id: 'st-pow-iraqi-in-iran', value: '۵۸٫۳۳۲ نفر در ۱۱۸ مرحله (۲۶ خرداد ۱۳۶۰ تا ۱۵ اردیبهشت ۱۳۸۲)', unit: 'اسیر عراقی بازگردانده‌شده', side: 'iraq', metric: 'اسرا', period: '۱۳۶۰–۱۳۸۲', region: 'ایران → عراق', sourceId: 'pows-report', method: 'گزارش‌های رسمی ایران درباره آزادگان', confidence: 'B', note: 'ویکی‌پدیا/برآوردها تا ۷۰ هزار ذکر کرده‌اند؛ رقم ثبت‌شده ۵۸٫۳۳۲ است.' },
  { id: 'st-pow-iranian-in-iraq', value: '۳۹٫۱۴۰ نفر (ثبت‌شده)؛ برآورد پایان جنگ حدود ۴۰ هزار', unit: 'اسیر ایرانی', side: 'iran', metric: 'اسرا', period: '۱۳۶۰–۱۳۸۲', region: 'عراق → ایران', sourceId: 'pows-report', method: 'گزارش‌های رسمی ایران؛ ICRC ارقام کمی متفاوت', confidence: 'B', note: 'منبع دیگر (مدخل دانشنامه‌ای): ۴۲٫۸۷۵ نفر.' },
  // شیمیایی
  { id: 'st-chem-un', value: 'کاربرد سلاح شیمیایی توسط عراق تأیید شد', unit: '—', side: 'iraq', metric: 'سلاح شیمیایی', period: '۱۳۶۲–۱۳۶۷', region: 'جبهه‌ها و شهرها', sourceId: 'unsg-reports-chem', method: 'گزارش‌های هیئت‌های کارشناسی دبیرکل (۱۹۸۴–۱۹۸۸)', confidence: 'A' },
  { id: 'st-chem-iran-cas', value: 'برآوردها از ده‌ها هزار تا حدود ۱۰۰٫۰۰۰ مصدوم متفاوت است', unit: 'مصدوم شیمیایی ایرانی', side: 'iran', metric: 'مصدومان شیمیایی', period: '۱۳۶۲–۱۳۶۷', region: 'ایران', sourceId: 'kurzman-deathtolls', method: 'برآوردهای سازمان‌های مدنی و پژوهشی؛ رقم دقیق ثبت نشده', confidence: 'C' },
  // اقتصادی
  { id: 'st-econ-iran-claim', value: 'بیش از ۱٫۰۰۰ میلیارد دلار (ادعای رسمی ایران — مستقیم و غیرمستقیم)', unit: 'دلار', side: 'iran', metric: 'خسارات اقتصادی', period: 'پس از جنگ', region: 'ایران', sourceId: 'un-compensation', method: 'ادعای رسمی دولت ایران؛ شامل کاهش درآمد نفتی', confidence: 'C' },
  { id: 'st-econ-iran-direct', value: 'حدود ۹۷ تا ۹۹ میلیارد دلار', unit: 'دلار — خسارت مستقیم', side: 'iran', metric: 'خسارات اقتصادی مستقیم', period: 'پس از جنگ', region: 'ایران', sourceId: 'un-compensation', method: 'برآورد گروه ویژه بررسی خسارات (۱۳۷۱)', confidence: 'B' },
  { id: 'st-econ-iraq-debt', value: 'برآوردها از ۸۰ تا ۱۳۰ میلیارد دلار', unit: 'دلار — بدهی جنگی', side: 'iraq', metric: 'خسارات اقتصادی', period: 'پس از جنگ', region: 'عراق', sourceId: 'razoux', method: 'برآورد وام‌های کشورهای خلیج فارس و بدهی تسلیحاتی', confidence: 'B' },
  // جنگ نفتکش‌ها
  { id: 'st-tanker-ships', value: 'برآوردها از ۴۰۰ تا بیش از ۵۵۰ فروند', unit: 'کشتی حمله‌شده یا آسیب‌دیده', side: 'other', metric: 'کشتی‌ها', period: '۱۳۶۳–۱۳۶۷', region: 'خلیج فارس', sourceId: 'razoux', method: 'برآورد پژوهشگران', confidence: 'C' },
  // آوارگان
  { id: 'st-displaced-ir', value: 'آمار قابل اتکا یافت نشد (برآوردها از ۱٫۵ تا بیش از ۲ میلیون نفر)', unit: 'آواره داخلی', side: 'iran', metric: 'آوارگان', period: '۱۳۵۹–۱۳۶۷', region: 'ایران', sourceId: 'fa-wiki-war', method: 'برآوردهای متفاوت؛ سرشماری دقیق ثبت نشد', confidence: 'C' },
]

// ─── داده نمودارها (با منبع) ───
export const CHART_DEATHS_BY_YEAR: { year: number; label: string; iran: number | null; iraq: number | null; note: string }[] = [
  { year: 1359, label: '۱۳۵۹', iran: null, iraq: null, note: 'آمار سالانه تفکیک‌شده مستند منتشر نشده است؛ نمودار تلفات کلان فقط با برآورد کل دو طرف ارائه می‌شود.' },
]

// برآورد روند توزیع کشتگان ایرانی بر اساس مجموع‌های شناخته‌شده (برچسب‌دار به‌عنوان برآورد)
export const IRAN_DEATHS_ESTIMATE: { label: string; value: number; kind: 'documented' | 'estimate'; note: string }[] = [
  { label: 'کشتگان جبهه (شمارش بسیج)', value: 155081, kind: 'documented', note: 'شمارش اداری بسیج — نقل در پژوهش کورزمن' },
  { label: 'کشتگان جنگ شهرها', value: 16154, kind: 'documented', note: 'شمارش‌های ایرانی' },
  { label: 'اختلاف با شمارش بنیاد شهید', value: 28542, kind: 'estimate', note: '۱۸۳٫۶۲۳ (شمارش بنیاد) منهای ۱۸۳٫۲۳۵ دو قلم بالا؛ برآورد روش شمارش متفاوت' },
]

export const IRaq_DEATHS_RANGE: { label: string; low: number; high: number; source: string }[] = [
  { label: 'برآورد دانشنامه‌ای/پژوهشی', low: 105000, high: 200000, source: 'مدخل‌های پژوهشی' },
  { label: 'برآورد سرلشکر حمیدانی', low: 250000, high: 250000, source: 'اظهار فرمانده سابق عراقی' },
  { label: 'برآورد COW (بسیار بالا)', low: 500000, high: 500000, source: 'پروژه Correlates of War — با نقد داده سرشماری' },
]
