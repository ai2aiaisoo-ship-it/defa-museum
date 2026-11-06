// ─── رجیستری نهایی نقشه‌های نبرد: پایه + نقشه‌های جدید + موج تکمیل ───
import { BATTLE_MAPS } from './battle-maps'
import { BATTLE_MAPS_EXTRA } from './battle-maps-extra'
import { BATTLE_MAPS_EXTRA2 } from './battle-maps-extra2'
import type { BattleMapData, BSide } from './battle-maps'

export const BATTLE_MAPS_ALL: Record<string, BattleMapData> = {
  ...BATTLE_MAPS,
  ...BATTLE_MAPS_EXTRA,
  ...BATTLE_MAPS_EXTRA2,
}

export { applyTactics } from './battle-tactics'
export { BATTLE_MAP_LABELS } from './battle-maps'
export type { BattleMapData, BattlePhase, BSide, ArrowKind } from './battle-maps'
