import type { Operation } from './types'
import { OPERATIONS_A } from './operations-a'
import { OPERATIONS_B, OPERATIONS_DRAFT_B } from './operations-b'
import { OPERATIONS_C, OPERATIONS_DRAFT_C } from './operations-c'

export const OPERATIONS: Operation[] = [
  ...OPERATIONS_A,
  ...OPERATIONS_B,
  ...OPERATIONS_C,
  ...OPERATIONS_DRAFT_B,
  ...OPERATIONS_DRAFT_C,
]

export function getOperation(id: string): Operation | undefined {
  return OPERATIONS.find(o => o.id === id)
}

export const RESULT_LABELS: Record<string, string> = {
  clear_victory: 'پیروزی روشن',
  limited_success: 'موفقیت محدود',
  costly_success: 'موفقیت پرهزینه',
  mixed: 'نتیجه مختلط',
  failure: 'شکست',
  halted: 'متوقف‌شده',
  defensive_success: 'دفاع موفق',
  defensive_failure: 'دفاع ناموفق',
}

export const SCALE_LABELS: Record<string, string> = {
  grand: 'گسترده',
  semi: 'نیمه‌گسترده',
  limited: 'محدود',
  nuisance: 'ایذایی',
  strategic_strike: 'ضربه راهبردی',
}

export const KIND_LABELS: Record<string, string> = {
  offensive: 'آفندی',
  defensive: 'دفاعی',
  counterattack: 'پاتک',
  air: 'هوایی',
  naval: 'دریایی',
  missile: 'موشکی',
  invasion: 'تهاجم',
  special: 'ویژه / حادثه',
}

export const FRONT_LABELS: Record<string, string> = {
  south: 'جبهه جنوب',
  central: 'جبهه میانی',
  north: 'جبهه شمالی',
  gulf: 'خلیج فارس',
  cities: 'شهرها',
  air: 'آسمان',
}

export const SIDE_LABELS: Record<string, string> = {
  iran: 'ایران',
  iraq: 'عراق',
  mek: 'سازمان منافقین',
  us: 'ایالات متحده',
  israel: 'اسرائیل',
  un: 'سازمان ملل',
  other: '—',
}

export const CONFIDENCE_LABELS: Record<string, { label: string; desc: string }> = {
  A: { label: 'مستند', desc: 'دارای پشتوانه قوی و چندمنبعی' },
  B: { label: 'تخمینی', desc: 'برآورد با اختلاف محدود بین منابع' },
  C: { label: 'مورد اختلاف', desc: 'فاقد تأیید مستقل یا محل اختلاف جدی' },
}

export const STATUS_LABELS: Record<string, string> = {
  draft: 'پیش‌نویس',
  under_research: 'در حال تحقیق',
  source_verified: 'منبع‌دار',
  historically_reviewed: 'بررسی تاریخی‌شده',
  published: 'منتشرشده',
}
