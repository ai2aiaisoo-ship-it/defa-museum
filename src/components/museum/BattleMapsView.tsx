'use client'

import { useState } from 'react'
import { BATTLE_MAPS_ALL } from '@/data/battle-maps-all'
import { OPERATIONS, RESULT_LABELS } from '@/data/operations'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SectionHeader } from './ui-bits'
import { BattleMap } from './BattleMap'
import { toFa } from '@/lib/jalali'

type FilterKey = 'all' | 'amphibious' | 'tricks' | 'halted'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'همه نقشه‌ها' },
  { key: 'amphibious', label: 'آبی‌خاکی' },
  { key: 'tricks', label: 'دارای کلک جنگی' },
  { key: 'halted', label: 'شکست/متوقف' },
]

export function BattleMapsView({ focusId, go }: { focusId?: string; go: (v: string, p?: string) => void }) {
  const entries = Object.values(BATTLE_MAPS_ALL)
  const [filter, setFilter] = useState<FilterKey>('all')
  const filtered = entries.filter(d => {
    const o = OPERATIONS.find(op => op.id === d.opId)
    if (filter === 'amphibious') return d.terrain === 'آبی‌خاکی'
    if (filter === 'tricks') return (d.tricks?.length ?? 0) > 0
    if (filter === 'halted') return o?.result === 'halted' || o?.result === 'failure'
    return true
  })
  const [selected, setSelected] = useState<string>(focusId && BATTLE_MAPS_ALL[focusId] ? focusId : entries[0].opId)
  const [lastFocus, setLastFocus] = useState<string | undefined>(focusId)
  // الگوی رسمی React: تنظیم state حین رندر برای همگام‌سازی با props (بدون effect)
  if (focusId && focusId !== lastFocus && BATTLE_MAPS_ALL[focusId]) {
    setLastFocus(focusId)
    setSelected(focusId)
  }
  const data = BATTLE_MAPS_ALL[selected]
  const op = OPERATIONS.find(o => o.id === selected)

  return (
    <div className="space-y-5">
      <SectionHeader
        kicker="نقشه‌های اختصاصی عملیات"
        title="تالار نقشه‌های رزمی خودخوان"
        desc="هر نقشه بدون نیاز به خواندن متن، طرح مانور را روایت می‌کند: محور اصلی و محورهای هماهنگ با پیکان پهن، کلک‌های جنگی و عملیات فریب با نشان کهربایی، پشتیبانی هوایی و هلی‌برد با نماد اختصاصی، استقرار یگان‌ها با قاب نظامی، تدابیر پدافندی دشمن، عبورهای آبی و جابجایی خط مقدم قبل/بعد از عملیات. با چرخ ماوس زوم کنید، مراحل را پخش کنید و از «خوانش سریع» بالای هر نقشه شروع کنید."
      />

      {/* فیلترها */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] font-extrabold text-muted-foreground">فیلتر:</span>
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold transition-colors ${filter === f.key ? 'border-primary/60 bg-primary/15 text-primary' : 'border-border bg-muted/40 text-muted-foreground hover:border-primary/40'}`}
          >
            {f.label}
          </button>
        ))}
        <span className="text-[11px] text-muted-foreground">({toFa(filtered.length)} نقشه)</span>
      </div>

      {/* پوشش نقشه‌ها — شفافیت موزه */}
      <div className="rounded-2xl border bg-card/50 p-3 text-[11px] leading-6 text-muted-foreground">
        🗺 <span className="font-extrabold text-foreground">پوشش تالار:</span> تمام عملیات‌های زمینی مهم جنگ (۸ سال، از تهاجم ۱۳۵۹ تا فروغ جاویدان و مرصاد ۱۳۶۷) در این تالار نقشه رزمی دارند — از «فکه» (والفجر مقدماتی و والفجر ۱)، «بدر» و «رمضان» تا «نبرد دوم فاو» و «بازپس‌گیری مجنون» از سوی عراق. عملیات‌های هوایی (کمان ۹۹، اچ-۳)، دریایی (مروارید) و بمباران‌های شهری، ماهیت زمینی ندارند و در تالارهای اختصاصی خود (نبرد هوایی، نبردهای دریایی، جنگ شهرها) روایت می‌شوند.
      </div>

      {/* انتخاب نبرد */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map(d => {
          const o = OPERATIONS.find(op => op.id === d.opId)
          const active = d.opId === selected
          return (
            <Card key={d.opId} className={`museum-card cursor-pointer ${active ? 'border-primary ring-1 ring-primary/40' : ''}`} onClick={() => { setSelected(d.opId); window.history.replaceState(null, '', `#battle-maps/${d.opId}`) }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-extrabold">{o?.faName ?? d.opId}</span>
                  <Badge variant="outline" className="text-[10px] font-bold">{toFa(d.phases.length)} مرحله</Badge>
                </div>
                <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{d.subtitle}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {o && <Badge variant="outline" className="text-[9.5px]">{RESULT_LABELS[o.result]}</Badge>}
                  {d.terrain && <Badge variant="outline" className="border-primary/40 text-[9.5px]">{d.terrain}</Badge>}
                  {(d.tricks?.length ?? 0) > 0 && <Badge variant="outline" className="border-amber-500/40 text-[9.5px] text-amber-400">🃏 کلک</Badge>}
                  {d.nature?.includes('فریب') && <Badge variant="outline" className="border-amber-500/40 text-[9.5px] text-amber-400">فریب</Badge>}
                  {(d.simultaneous?.length ?? 0) > 0 && <Badge variant="outline" className="border-sky-500/40 text-[9.5px] text-sky-300">⇄ همزمان</Badge>}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* نقشه انتخاب‌شده */}
      {data && (
        <div className="rounded-3xl border bg-card/40 p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="museum-title text-2xl">{op?.faName}</h3>
              <p className="text-xs text-muted-foreground">{data.subtitle}{op?.code ? ` • رمز: «${op.code}»` : ''}</p>
            </div>
            {op && (
              <Button variant="outline" onClick={() => go('operations', op.id)} className="text-xs font-bold">
                📄 پرونده کامل عملیات
              </Button>
            )}
          </div>
          <BattleMap data={data} />
        </div>
      )}
    </div>
  )
}
