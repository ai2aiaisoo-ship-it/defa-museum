// ─── مدل داده موزه دیجیتال جنگ ایران و عراق ───

/** درجه اطمینان آماری طبق سیاست سخت‌گیرانه موزه */
export type Confidence = 'A' | 'B' | 'C'

export type Side = 'iran' | 'iraq' | 'mek' | 'us' | 'israel' | 'un' | 'other'

export type Front = 'south' | 'central' | 'north' | 'gulf' | 'cities' | 'air'

/** طبقه‌بندی نتیجه عملیات (۸ گزینه مذاکره‌ناپذیر) */
export type OperationResult =
  | 'clear_victory'        // پیروزی روشن
  | 'limited_success'      // موفقیت محدود
  | 'costly_success'       // موفقیت پرهزینه
  | 'mixed'                // نتیجه نامشخص یا مختلط
  | 'failure'              // شکست
  | 'halted'               // عملیات متوقف‌شده
  | 'defensive_success'    // عملیات دفاعی موفق
  | 'defensive_failure'    // عملیات دفاعی ناموفق

export type OperationScale = 'grand' | 'semi' | 'limited' | 'nuisance' | 'strategic_strike'
export type OperationKind = 'offensive' | 'defensive' | 'counterattack' | 'air' | 'naval' | 'missile' | 'invasion' | 'special'

export type ContentStatus =
  | 'draft'                 // پیش‌نویس
  | 'under_research'        // در حال تحقیق
  | 'source_verified'       // منبع‌دار
  | 'historically_reviewed' // تاریخی بررسی‌شده
  | 'published'             // منتشرشده

/** یک ادعای آماری منبع‌دار */
export interface StatClaim {
  id: string
  /** مقدار گزارش‌شده — می‌تواند دامنه باشد */
  value: string
  unit: string
  side: Side
  /** نوع شاخص: کشته/مجروح/اسیر/مفقود/غیرنظامی/تجهیزات/غنیمت/اقتصادی/شیمیایی */
  metric: string
  period: string
  region: string
  sourceId: string
  method: string
  confidence: Confidence
  /** اختلاف با منابع دیگر */
  note?: string
}

export interface GeoPoint { lat: number; lng: number; label?: string }

export interface Operation {
  id: string
  faName: string
  enName: string
  code?: string
  side: Side
  kind: OperationKind
  scale: OperationScale
  fronts: Front[]
  /** تاریخ شمسی شروع و پایان: "1365-12-13" */
  faStart: string
  faEnd?: string
  dateNote?: string
  year: number // سال شمسی
  region: string
  regionEn: string
  center: GeoPoint
  commanders: { name: string; role: string; side: Side }[]
  objectives: string
  background: string
  /** روند کلی وقایع به ترتیب زمانی */
  course: string[]
  outcome: string
  territorial?: string
  result: OperationResult
  /** تحلیل تاریخی موفقیت/شکست بر اساس اهداف و نتایج واقعی */
  analysis: string
  narrativeDiff?: string
  stats: StatClaim[]
  sourceIds: string[]
  images?: GalleryImage[]
  status: ContentStatus
  tags: string[]
  /** عملیات مرتبط */
  relatedOps?: string[]
}

export interface HistoryEvent {
  id: string
  faTitle: string
  date: string // jalali
  year: number
  category: 'political' | 'military' | 'diplomatic' | 'economic' | 'humanitarian' | 'chemical' | 'legal'
  side?: Side
  desc: string
  sourceIds: string[]
  important?: boolean
  geo?: GeoPoint
}

export interface GalleryImage {
  id: string
  url: string
  title: string
  sourceName: string
  sourceUrl?: string
  date?: string
  /** آرشیوی واقعی | بازسازی هنری | تصویرسازی */
  kind: 'archival' | 'artistic' | 'map'
  note?: string
}

export interface Period {
  id: string
  index: number
  year: number
  title: string
  subtitle: string
  overview: string[]
  keyThemes: { title: string; text: string }[]
  opIds: string[]
  sourceIds: string[]
}

export interface Commander {
  id: string
  name: string
  fullName?: string
  birth?: string
  death?: string
  side: Side
  role: string
  org: string
  bio: string
  warRole: string
  decisions: string[]
  relatedOps: string[]
  controversies?: string
  sourceIds: string[]
}

export interface Organization {
  id: string
  name: string
  side: Side
  type: string
  founded: string
  desc: string
  warEvolution: string[]
  sourceIds: string[]
}

export interface EquipmentItem {
  id: string
  name: string
  enName: string
  category: 'aircraft' | 'helicopter' | 'tank' | 'afv' | 'artillery' | 'naval' | 'missile' | 'engineer' | 'comms' | 'support' | 'chemical'
  origin: string
  user: Side
  desc: string
  reportedNumbers: { value: string; note: string; sourceId: string; confidence: Confidence }[]
}

export interface Resolution {
  id: string
  number: string
  date: string // jalali
  gDate: string
  title: string
  summary: string[]
  iranResponse: string
  iraqResponse: string
  sourceIds: string[]
}

export interface ForeignPower {
  id: string
  name: string
  stance: string
  desc: string
  keyActions: string[]
  sourceIds: string[]
}

export interface GlossaryTerm {
  id: string
  term: string
  definition: string
  category: string
}

export interface QuizQuestion {
  id: string
  level: 'general' | 'student' | 'enthusiast' | 'researcher'
  type: 'mcq' | 'order' | 'map' | 'match'
  question: string
  options: string[]
  correct: number
  explanation: string
  sourceIds: string[]
}

export interface Documentary {
  id: string
  title: string
  subtitle: string
  durationMin: number
  chapters: {
    title: string
    text: string
    image?: string
    mapYear?: number
    durationSec: number
  }[]
  sourceIds: string[]
}
