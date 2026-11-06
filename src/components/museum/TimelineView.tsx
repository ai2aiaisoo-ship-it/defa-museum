'use client'

import { useState } from 'react'
import { PERIODS } from '@/data/periods'
import { EVENTS } from '@/data/events'
import { OPERATIONS, RESULT_LABELS } from '@/data/operations'
import { formatJalali, toFa } from '@/lib/jalali'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResultBadge, SourceChips, SectionHeader } from './ui-bits'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

const CAT: Record<string, { label: string; cls: string }> = {
  political: { label: 'سیاسی', cls: 'bg-violet-500/15 text-violet-300' },
  military: { label: 'نظامی', cls: 'bg-rose-500/15 text-rose-300' },
  diplomatic: { label: 'دیپلماتیک', cls: 'bg-sky-500/15 text-sky-300' },
  economic: { label: 'اقتصادی', cls: 'bg-emerald-500/15 text-emerald-300' },
  humanitarian: { label: 'انسانی', cls: 'bg-amber-500/15 text-amber-300' },
  chemical: { label: 'شیمیایی', cls: 'bg-lime-600/20 text-lime-300' },
  legal: { label: 'حقوقی/سازمان ملل', cls: 'bg-cyan-600/15 text-cyan-300' },
}

export function TimelineView({ go }: { go: (v: string, p?: string) => void }) {
  const [year, setYear] = useState(1359)
  const period = PERIODS.find(p => p.year === year)!
  const yearEvents = EVENTS.filter(e => e.year === year).sort((a, b) => a.date.localeCompare(b.date))
  const yearOps = OPERATIONS.filter(o => o.year === year)

  return (
    <div>
      <SectionHeader kicker="خط زمانی هشت‌ساله" title="کاوش سال‌به‌سال" desc="هر سال جنگ، دوره تاریخی مستقلی است با روایت، عملیات‌ها و رویدادهای خود. ایستگاه سال را انتخاب کنید." />

      {/* ریل سال‌ها */}
      <div className="mb-6 flex items-center gap-1 overflow-x-auto pb-2 scrollbar-thin">
        {PERIODS.map(p => (
          <button
            key={p.id}
            onClick={() => setYear(p.year)}
            className={`shrink-0 rounded-xl border px-4 py-2.5 text-center transition-all ${year === p.year ? 'border-primary bg-primary/15 text-primary shadow-lg' : 'border-border bg-card/60 hover:border-primary/40'}`}
          >
            <div className="text-lg font-extrabold">{toFa(p.year)}</div>
            <div className="text-[10px] text-muted-foreground">دوره {toFa(p.index)}</div>
          </button>
        ))}
      </div>

      <Tabs defaultValue="story">
        <TabsList className="mb-4">
          <TabsTrigger value="story">روایت دوره</TabsTrigger>
          <TabsTrigger value="ops">عملیات‌ها ({toFa(yearOps.length)})</TabsTrigger>
          <TabsTrigger value="events">رویدادها ({toFa(yearEvents.length)})</TabsTrigger>
        </TabsList>

        <TabsContent value="story" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="museum-title text-xl">{period.title} — {period.subtitle}</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3 leading-8 text-[15px] text-justify">
                {period.overview.map((t, i) => <p key={i}>{t}</p>)}
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-3 md:grid-cols-2">
            {period.keyThemes.map(t => (
              <Card key={t.title} className="museum-card">
                <CardContent className="p-4">
                  <h4 className="mb-2 font-extrabold text-primary">{t.title}</h4>
                  <p className="text-sm leading-7 text-justify">{t.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div>
            <div className="mb-2 text-xs font-bold text-muted-foreground">منابع این دوره:</div>
            <SourceChips ids={period.sourceIds} />
          </div>
        </TabsContent>

        <TabsContent value="ops" className="space-y-2">
          {yearOps.map(o => (
            <button key={o.id} onClick={() => go('operations', o.id)} className="w-full rounded-xl border bg-card/70 p-3 text-right transition-colors hover:border-primary/50">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold">{o.faName}</span>
                <ResultBadge r={o.result} />
                <Badge variant="outline" className="text-[10px]">{o.faStart ? formatJalali(o.faStart) : 'در حال تحقیق'}</Badge>
                <Badge variant="outline" className="text-[10px]">{RESULT_LABELS[o.result]}</Badge>
              </div>
              <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{o.outcome}</p>
            </button>
          ))}
        </TabsContent>

        <TabsContent value="events" className="space-y-3">
          {yearEvents.length === 0 && <p className="text-sm text-muted-foreground">رویداد ثبت‌شده‌ای برای این سال در بانک داده نیست.</p>}
          {yearEvents.map(e => (
            <div key={e.id} className={`rounded-xl border p-3 ${e.important ? 'border-primary/40 bg-primary/5' : 'bg-card/60'}`}>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="font-bold">{formatJalali(e.date)}</Badge>
                <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${CAT[e.category]?.cls}`}>{CAT[e.category]?.label}</span>
                {e.important && <span className="text-[10px] font-bold text-primary">★ نقطه عطف</span>}
                <span className="text-sm font-bold">{e.faTitle}</span>
              </div>
              <p className="mt-1.5 text-xs leading-6 text-muted-foreground">{e.desc}</p>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
