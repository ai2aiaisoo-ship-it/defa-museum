// ─── روایت شنیداری تجربه‌نگاری — صدای مصنوعی به سبک آوینی ───
// خط قرمز صداقت صوتی: هیچ فناوری‌ای صدای واقعی شهید سید مرتضی آوینی را بازسازی نمی‌کند
// و این کار از نظر اخلاقی و تاریخی ممنوع است. روایت‌های این تالار با «صدای مصنوعی»
// و با تنظیم لحن آوینی‌وار (آهسته و سترگ) خوانده می‌شوند و این نکته صریحاً در رابط
// کاربری درج است. متن هر روایت، بازآفرینی ادبیِ تازه از پرونده‌ی مستند همان تجربه
// است — نه نقل‌قول از شهید آوینی — و هیچ رقم یا ادعای تازه‌ای به پرونده افزوده نشده است.

import scriptsJson from './narration-scripts.json'
import manifestJson from './narration-manifest.json'

export const NARRATION_META = {
  voice: 'fa-IR-FaridNeural',
  voiceLabel: 'صدای مصنوعی مردانه فارسی',
  styleLabel: 'به سبک آوینی — آهسته و سترگ',
  disclosureShort: '🎙 صدای مصنوعی به سبک آوینی',
  disclosureLong:
    'بازسازی صدای واقعی شهید سید مرتضی آوینی ممکن و صحیح نیست؛ روایت‌های شنیداری این تالار با صدای مصنوعیِ فارسی و لحنِ آوینی‌وار (آهسته و سترگ) خوانده می‌شوند. متن هر روایت، بازآفرینی ادبیِ تازه از پرونده‌ی مستند همان تجربه است — نه نقل‌قول از شهید آوینی — و هیچ رقم، نام یا ادعای تازه‌ای فراتر از پرونده افزوده نشده است.',
  engine: 'edge-tts',
  toneSetting: 'سرعت ۰٫۸۲، زیر و بمیِ اندکی پایین‌تر از عادی',
} as const

export interface NarrationInfo {
  expId: string
  script: string
  audioUrl: string
  durationSec: number
}

type ScriptMap = Record<string, string>
type ManifestMap = Record<string, { sec?: number; bytes?: number; error?: string }>

const SCRIPTS = scriptsJson as ScriptMap
const MANIFEST = manifestJson as ManifestMap

/** اطلاعات روایت شنیداری یک تجربه — اگر روایت وجود نداشته باشد null */
export function narrationOf(expId: string): NarrationInfo | null {
  const script = SCRIPTS[expId]
  if (!script) return null
  return {
    expId,
    script,
    audioUrl: `/audio/narrations/${expId}.mp3`,
    durationSec: MANIFEST[expId]?.sec ?? 0,
  }
}

export const NARRATED_IDS = Object.keys(SCRIPTS)
export const NARRATED_COUNT = NARRATED_IDS.length
export const NARRATION_TOTAL_SEC = Object.values(MANIFEST).reduce((s, m) => s + (m.sec ?? 0), 0)

/** نمایش زمان به شکل م:ث با ارقام فارسی */
export function narrationTime(sec: number): string {
  const m = Math.floor(sec / 60)
  const r = Math.floor(sec % 60)
  return `${m}:${String(r).padStart(2, '0')}`
}
