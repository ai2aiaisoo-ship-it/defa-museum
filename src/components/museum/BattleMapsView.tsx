'use client'

import { useEffect, useState } from 'react'
import { BATTLE_MAPS } from '@/data/battle-maps'
import { OPERATIONS, RESULT_LABELS } from '@/data/operations'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SectionHeader } from './ui-bits'
import { BattleMap } from './BattleMap'
import { toFa } from '@/lib/jalali'

export function BattleMapsView({ focusId, go }: { focusId?: string; go: (v: string, p?: string) => void }) {
  const entries = Object.values(BATTLE_MAPS)
  const [selected, setSelected] = useState<string>(focusId && BATTLE_MAPS[focusId] ? focusId : entries[0].opId)
  const [lastFocus, setLastFocus] = useState<string | undefined>(focusId)
  // الگوی رسمی React: تنظیم state حین رندر برای همگام‌سازی با props (بدون effect)
  if (focusId && focusId !== lastFocus && BATTLE_MAPS[focusId]) {
    setLastFocus(focusId)
    setSelected(focusId)
  }
  const data = BATTLE_MAPS[selected]
  const op = OPERATIONS.find(o => o.id === selected)

  return (
    <div className="space-y-5">
      <SectionHeader
        kicker="نقشه‌های اختصاصی عملیات"
        title="تالار نقشه‌های تاکتیکی نبردها"
        desc="برای هر عملیات بزرگ، یک نقشه اختصاصی با زوم روی کل محدوده نبرد، خط تماس جبهه‌ها، پرچم مواضع نیروهای ایران و عراق، محورهای پیشروی و پخش مرحله‌به‌مرحله نبرد. با چرخ ماوس زوم کنید، با درگ جابه‌جا شوید و مراحل را پخش کنید."
      />

      {/* انتخاب نبرد */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {entries.map(d => {
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
                {o && <Badge variant="outline" className="mt-2 text-[10px]">{RESULT_LABELS[o.result]}</Badge>}
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
