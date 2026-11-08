'use client'

import { useEffect, useMemo, useState } from 'react'
import { WAR_EXPERIENCES, EXPERIENCE_CATEGORIES, experiencesOfOp } from '@/data/experiences'
import { OPERATIONS } from '@/data/operations'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SectionHeader, ConfidenceBadge, SourceChips } from './ui-bits'
import { toFa } from '@/lib/jalali'
import { NarrationPlayer, NARR_BUS } from './NarrationPlayer'
import { narrationOf, narrationTime, NARRATED_COUNT, NARRATION_META, NARRATION_TOTAL_SEC } from '@/data/narrations'

type CatKey = keyof typeof EXPERIENCE_CATEGORIES

/** کلاس‌های رنگی ثابت هر دسته (برای جلوگیری از حذف کلاس‌های داینامیک توسط Tailwind) */
const CAT_STYLE: Record<string, { chip: string; bar: string; text: string; box: string }> = {
  amber: { chip: 'border-amber-500/50 bg-amber-500/10 text-amber-400', bar: 'bg-amber-500/70', text: 'text-amber-400', box: 'border-amber-500/30 bg-amber-500/5' },
  sky: { chip: 'border-sky-500/50 bg-sky-500/10 text-sky-300', bar: 'bg-sky-500/70', text: 'text-sky-300', box: 'border-sky-500/30 bg-sky-500/5' },
  teal: { chip: 'border-teal-500/50 bg-teal-500/10 text-teal-300', bar: 'bg-teal-500/70', text: 'text-teal-300', box: 'border-teal-500/30 bg-teal-500/5' },
  primary: { chip: 'border-primary/50 bg-primary/10 text-primary', bar: 'bg-primary/70', text: 'text-primary', box: 'border-primary/30 bg-primary/5' },
  emerald: { chip: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300', bar: 'bg-emerald-500/70', text: 'text-emerald-300', box: 'border-emerald-500/30 bg-emerald-500/5' },
  violet: { chip: 'border-violet-500/50 bg-violet-500/10 text-violet-300', bar: 'bg-violet-500/70', text: 'text-violet-300', box: 'border-violet-500/30 bg-violet-500/5' },
  rose: { chip: 'border-rose-500/50 bg-rose-500/10 text-rose-300', bar: 'bg-rose-500/70', text: 'text-rose-300', box: 'border-rose-500/30 bg-rose-500/5' },
  lime: { chip: 'border-lime-500/50 bg-lime-500/10 text-lime-300', bar: 'bg-lime-500/70', text: 'text-lime-300', box: 'border-lime-500/30 bg-lime-500/5' },
  red: { chip: 'border-red-500/50 bg-red-500/10 text-red-300', bar: 'bg-red-500/70', text: 'text-red-300', box: 'border-red-500/30 bg-red-500/5' },
}

export function ExperiencesView({ focusId, go }: { focusId?: string; go: (v: string, p?: string) => void }) {
  const [cat, setCat] = useState<'all' | CatKey>('all')
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState<'cards' | 'matrix' | 'listen'>('cards')
  const [openOpFilter, setOpenOpFilter] = useState<string | undefined>(focusId)
  const [lastFocus, setLastFocus] = useState<string | undefined>(focusId)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [playToken, setPlayToken] = useState(0)
  // همگام‌سازی focusId با فیلتر عملیات
  if (focusId && focusId !== lastFocus) {
    setLastFocus(focusId)
    setOpenOpFilter(focusId)
  }

  const opName = (id: string) => OPERATIONS.find(o => o.id === id)?.faName ?? id

  const filtered = useMemo(() => {
    return WAR_EXPERIENCES.filter(e => {
      if (cat !== 'all' && e.category !== cat) return false
      if (openOpFilter && !e.opIds.includes(openOpFilter)) return false
      if (query.trim()) {
        const q = query.trim()
        if (!e.title.includes(q) && !e.text.includes(q) && !e.significance.includes(q)) return false
      }
      return true
    })
  }, [cat, query, openOpFilter])

  const opsCovered = useMemo(() => {
    const s = new Set<string>()
    WAR_EXPERIENCES.forEach(e => e.opIds.forEach(id => s.add(id)))
    return s.size
  }, [])

  const matrixOps = useMemo(() => {
    const ids: string[] = []
    WAR_EXPERIENCES.forEach(e => e.opIds.forEach(id => { if (!ids.includes(id)) ids.push(id) }))
    return ids.map(id => OPERATIONS.find(o => o.id === id)).filter(Boolean) as typeof OPERATIONS
  }, [])

  const resetFilters = () => { setCat('all'); setQuery(''); setOpenOpFilter(undefined) }

  // تالار شنیداری: پیشروی خودکار در پایان هر قطعه (رویداد خارجی → اشتراک رویداد)
  useEffect(() => {
    if (mode !== 'listen') return
    const onEnded = (ev: Event) => {
      const id = (ev as CustomEvent<string>).detail
      const idx = filtered.findIndex(f => f.id === id)
      if (idx >= 0 && idx < filtered.length - 1) {
        setActiveId(filtered[idx + 1].id)
        setPlayToken(t => t + 1)
      }
    }
    window.addEventListener(NARR_BUS.ended, onEnded)
    return () => window.removeEventListener(NARR_BUS.ended, onEnded)
  }, [mode, filtered])

  const listenActive = mode === 'listen' ? (filtered.find(f => f.id === activeId) ?? filtered[0] ?? null) : null
  const listenIdx = listenActive ? filtered.findIndex(f => f.id === listenActive.id) : -1
  const selectTrack = (id: string) => { setActiveId(id); setPlayToken(t => t + 1) }

  return (
    <div className="space-y-5">
      <SectionHeader
        kicker="تجربه‌نگاری دفاع مقدس"
        title="تجربه نگاری؛ میراث عملیاتی جنگ"
        desc="هر عملیات، گنجینه‌ای از تجربه‌های گران‌بها بود: از رعایت حفاظت اطلاعات و سکوت رادیویی تا مهندسی هور و اروندرود، از فرماندهی مشترک ارتش و سپاه تا پشتیبانی مردمی. این تالار تجربه‌ها را از دل پرونده‌های مستند عملیات‌ها استخراج، دسته‌بندی و تجمیع می‌کند تا الگوهای ماندگار دفاع مقدس در یک نگاه دیده شوند."
      />

      {/* کارنامه تالار */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border bg-card/70 p-2.5">
        <Badge variant="outline" className="border-primary/40 bg-primary/10 text-[10.5px] font-extrabold">🧭 {toFa(WAR_EXPERIENCES.length)} تجربه ثبت‌شده</Badge>
        <Badge variant="outline" className="text-[10.5px] font-extrabold">🗂 {toFa(Object.keys(EXPERIENCE_CATEGORIES).length)} دسته</Badge>
        <Badge variant="outline" className="text-[10.5px] font-extrabold">⚔ {toFa(opsCovered)} عملیات پوشش‌داده‌شده</Badge>
        <Badge variant="outline" className="border-primary/40 bg-primary/10 text-[10.5px] font-extrabold">🎙 {toFa(NARRATED_COUNT)} روایت شنیداری · {narrationTime(NARRATION_TOTAL_SEC)}</Badge>
        <Badge variant="outline" className="text-[10.5px] font-extrabold text-muted-foreground">منبع: پرونده‌های مستند موزه — بدون جزئیات تاکتیکی</Badge>
        {openOpFilter && (
          <button onClick={() => setOpenOpFilter(undefined)} className="rounded-lg border border-primary/50 bg-primary/10 px-2 py-0.5 text-[10.5px] font-extrabold text-primary">
            ⚔ فیلتر فعال: {opName(openOpFilter)} ✕
          </button>
        )}
      </div>

      {/* ابزارهای جست‌وجو */}
      <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => { setCat('all'); }}
              className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold transition-colors ${cat === 'all' ? 'border-primary/60 bg-primary/15 text-primary' : 'border-border bg-muted/40 text-muted-foreground hover:border-primary/40'}`}
            >
              همه دسته‌ها
            </button>
            {Object.entries(EXPERIENCE_CATEGORIES).map(([key, c]) => {
              const st = CAT_STYLE[c.color] ?? CAT_STYLE.primary
              return (
                <button
                  key={key}
                  onClick={() => setCat(key as CatKey)}
                  className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold transition-colors ${cat === key ? st.chip : 'border-border bg-muted/40 text-muted-foreground hover:border-primary/40'}`}
                >
                  {c.icon} {c.label}
                </button>
              )
            })}
          </div>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="جست‌وجو در تجربه‌ها… (مثلاً: سکوت رادیویی، پل شناور، مهندسی هور)"
            className="w-full rounded-xl border bg-card/70 px-3 py-2 text-xs outline-none placeholder:text-muted-foreground/60 focus:border-primary/60"
          />
        </div>
        <div className="flex items-start gap-1.5">
          <Button size="sm" variant={mode === 'cards' ? 'default' : 'outline'} onClick={() => setMode('cards')} className="text-xs font-bold">🗂 نمای کارت</Button>
          <Button size="sm" variant={mode === 'matrix' ? 'default' : 'outline'} onClick={() => setMode('matrix')} className="text-xs font-bold">🧮 ماتریس تجربه × عملیات</Button>
          <Button size="sm" variant={mode === 'listen' ? 'default' : 'outline'} onClick={() => setMode('listen')} className="text-xs font-bold">🎧 تالار شنیداری</Button>
        </div>
      </div>

      {/* نتیجه فیلتر */}
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{toFa(filtered.length)} تجربه در نتیجه فیلتر</span>
        {(cat !== 'all' || query || openOpFilter) && (
          <button onClick={resetFilters} className="font-bold text-primary hover:underline">پاک کردن فیلترها</button>
        )}
      </div>

      {mode === 'listen' ? (
        /* ─── تالار شنیداری: پخش پیاپی روایت‌ها مثل مستند رادیویی ─── */
        <div className="space-y-3">
          <div className="rounded-2xl border border-primary/25 bg-primary/5 p-3">
            <p className="text-[11px] leading-6 text-foreground/90">
              <span className="font-extrabold text-primary">🎧 تالار شنیداری —</span> روایت‌های فیلترشده، پیاپی و مثل مستند رادیویی پخش می‌شوند؛ در پایان هر قطعه، روایت بعدی خودکار آغاز می‌شود. {NARRATION_META.disclosureShort}
            </p>
            <p className="mt-1 text-[10px] leading-5 text-muted-foreground">{NARRATION_META.disclosureLong}</p>
          </div>
          {listenActive ? (
            <>
              <NarrationPlayer
                key={listenActive.id}
                expId={listenActive.id}
                variant="full"
                playToken={playToken}
                title={`${toFa(listenIdx + 1)}. ${listenActive.title}`}
                subtitle={`${EXPERIENCE_CATEGORIES[listenActive.category].icon} ${EXPERIENCE_CATEGORIES[listenActive.category].label} · سال ${listenActive.year}`}
              />
              <div className="flex items-center justify-between">
                <Button
                  size="sm" variant="outline" disabled={listenIdx <= 0}
                  onClick={() => selectTrack(filtered[listenIdx - 1].id)}
                  className="text-xs font-bold"
                >
                  → روایت قبلی
                </Button>
                <span className="text-[11px] font-bold text-muted-foreground">روایت {toFa(listenIdx + 1)} از {toFa(filtered.length)}</span>
                <Button
                  size="sm" variant="outline" disabled={listenIdx >= filtered.length - 1}
                  onClick={() => selectTrack(filtered[listenIdx + 1].id)}
                  className="text-xs font-bold"
                >
                  روایت بعدی ←
                </Button>
              </div>
              <div className="overflow-hidden rounded-2xl border bg-card/40">
                {filtered.map((e, i) => {
                  const c = EXPERIENCE_CATEGORIES[e.category]
                  const st = CAT_STYLE[c.color] ?? CAT_STYLE.primary
                  const info = narrationOf(e.id)
                  const active = !!listenActive && e.id === listenActive.id
                  return (
                    <button
                      key={e.id}
                      onClick={() => selectTrack(e.id)}
                      aria-label={`پخش روایت ${e.title}`}
                      className={`flex w-full items-center gap-3 border-b px-3 py-2.5 text-right transition-colors last:border-b-0 min-h-[44px] ${active ? 'border-r-4 border-r-primary bg-primary/10' : 'border-r-4 border-r-transparent hover:bg-muted/40'}`}
                    >
                      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[11px] font-extrabold ${active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{toFa(i + 1)}</span>
                      <span className="min-w-0 flex-1">
                        <span className={`block truncate text-[12.5px] font-bold ${active ? 'text-primary' : ''}`}>{e.title}</span>
                        <span className={`mt-0.5 inline-block rounded-md border px-1.5 text-[9.5px] font-bold ${st.chip}`}>{c.icon} {c.label}</span>
                      </span>
                      <span className="shrink-0 text-[10.5px] font-bold tabular-nums text-muted-foreground">🎙 {info ? narrationTime(info.durationSec) : '—'}</span>
                    </button>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">روایتی با این فیلترها یافت نشد.</div>
          )}
        </div>
      ) : mode === 'cards' ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map(e => {
            const c = EXPERIENCE_CATEGORIES[e.category]
            const st = CAT_STYLE[c.color] ?? CAT_STYLE.primary
            return (
              <Card key={e.id} className="museum-card flex flex-col">
                <div className={`h-1 rounded-t-2xl ${st.bar}`} />
                <CardContent className="flex flex-1 flex-col gap-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="outline" className={`${st.chip} text-[10px] font-extrabold`}>{c.icon} {c.label}</Badge>
                    <Badge variant="outline" className="text-[10px] font-bold text-muted-foreground">🗓 {e.year}</Badge>
                  </div>
                  <h3 className="text-sm font-extrabold leading-6">{e.title}</h3>
                  {narrationOf(e.id) && <NarrationPlayer expId={e.id} variant="compact" title={e.title} />}
                  <p className="flex-1 text-[12px] leading-6 text-muted-foreground">{e.text}</p>
                  <div className={`rounded-xl border p-2.5 text-[11px] font-bold leading-5 ${st.box}`}>
                    <span className={st.text}>★ چرا گران‌بها بود:</span> <span className="text-foreground/90">{e.significance}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-extrabold text-muted-foreground">عملیات‌های مرتبط:</span>
                    {e.opIds.map(id => (
                      <button
                        key={id}
                        onClick={() => go('operations', id)}
                        className="rounded-lg border border-border bg-muted/40 px-2 py-0.5 text-[10px] font-bold text-foreground/90 transition-colors hover:border-primary/50 hover:text-primary"
                      >
                        {opName(id)}
                      </button>
                    ))}
                  </div>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t pt-2.5">
                    <ConfidenceBadge c={e.confidence} />
                    <SourceChips ids={e.sourceIds} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
          {filtered.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              تجربه‌ای با این فیلترها یافت نشد — فیلترها را پاک کنید یا عبارت دیگری بجویید.
            </div>
          )}
        </div>
      ) : (
        /* ماتریس تجربه × عملیات */
        <div className="overflow-x-auto rounded-2xl border bg-card/40">
          <table className="w-full min-w-[720px] text-right text-[11px]">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-3 text-right font-extrabold">تجربه</th>
                <th className="p-3 font-extrabold">دسته</th>
                {matrixOps.map(o => (
                  <th key={o.id} className="p-2 text-center font-extrabold" title={o.faName}>
                    <button onClick={() => go('operations', o.id)} className="text-[10px] text-primary hover:underline">{o.faName.replace('عملیات ', '')}</button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => {
                const c = EXPERIENCE_CATEGORIES[e.category]
                const st = CAT_STYLE[c.color] ?? CAT_STYLE.primary
                return (
                  <tr key={e.id} className="border-b transition-colors hover:bg-muted/30">
                    <td className="p-3 font-bold leading-5">{e.title}</td>
                    <td className="p-3"><Badge variant="outline" className={`${st.chip} text-[9.5px]`}>{c.icon} {c.label}</Badge></td>
                    {matrixOps.map(o => (
                      <td key={o.id} className="p-2 text-center">
                        {e.opIds.includes(o.id) ? <span className={`inline-block h-2.5 w-2.5 rounded-full ${st.bar}`} title="این تجربه از این عملیات استخراج شده است" /> : <span className="text-muted-foreground/40">—</span>}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="border-t bg-muted/30 p-3 text-[11px] leading-5 text-muted-foreground">
            🧮 در این ماتریس، هر نقطه رنگی یعنی «تجربه از این عملیات استخراج شده است». ستون‌ها با کلیک به پرونده کامل عملیات می‌روند و ردیف‌ها با فیلترهای بالا مهار می‌شوند.
          </div>
        </div>
      )}

      {/* پروتکل تجربه‌نگاری */}
      <div className="rounded-3xl border bg-card/40 p-5">
        <h3 className="museum-title text-xl">📋 پروتکل تجربه‌نگاری موزه</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[
            { n: 1, t: 'استخراج از پرونده', d: 'تجربه فقط از «پرونده مستند همان عملیات» در همین موزه برداشته می‌شود؛ هیچ روایتی بی‌منبع وارد نمی‌شود.' },
            { n: 2, t: 'دسته‌بندی نه‌گانه', d: 'حفاظت اطلاعات، شناسایی، مهندسی، فرماندهی، مردم‌داری، ابتکار، لجستیک، آموزش و درس‌های شکست.' },
            { n: 3, t: 'روایت عام و غیرتاکتیکی', d: 'متن‌ها فاقد جزئیات قابل استفاده عملیاتی است؛ موزه سیاست سخت‌گیرانه «بدون دستورالعمل» دارد.' },
            { n: 4, t: 'درجه اطمینان شفاف', d: 'هر تجربه با برچسب اطمینان A/B/C منتشر می‌شود؛ اختلاف منابع پنهان نمی‌ماند.' },
          ].map(s => (
            <div key={s.n} className="rounded-2xl border bg-card/60 p-4">
              <div className="mb-1.5 flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/15 text-sm font-extrabold text-primary">{toFa(s.n)}</span>
                <span className="text-xs font-extrabold">{s.t}</span>
              </div>
              <p className="text-[11px] leading-5 text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* پرش سریع به عملیات‌های پرتجربه */}
      <div className="rounded-3xl border bg-card/40 p-5">
        <h3 className="text-sm font-extrabold">⚔ عملیات‌های دارای بیشترین تجربه ثبت‌شده</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {matrixOps
            .map(o => ({ o, n: experiencesOfOp(o.id).length }))
            .sort((a, b) => b.n - a.n)
            .slice(0, 10)
            .map(({ o, n }) => (
              <button
                key={o.id}
                onClick={() => go('operations', o.id)}
                className="rounded-xl border border-border bg-muted/40 px-3 py-1.5 text-[11px] font-bold transition-colors hover:border-primary/50 hover:text-primary"
              >
                {o.faName} <span className="text-primary">({toFa(n)})</span>
              </button>
            ))}
        </div>
      </div>
    </div>
  )
}
