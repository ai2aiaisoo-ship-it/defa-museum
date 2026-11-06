'use client'

import { useMemo, useState } from 'react'
import { MARTYRS, MARTYR_RESEARCH, MARTYR_ORG_LABELS, MARTYR_ROLE_LABELS, type Martyr, type MartyrOrg, type MartyrRole } from '@/data/martyrs'
import { OPERATIONS } from '@/data/operations'
import { RAVAYAT_FATH } from '@/data/avini'
import { MEDIA_ITEMS, MEDIA_VERIFICATION_LABELS } from '@/data/media-registry'
import { formatJalali, toFa, jalaliToDate } from '@/lib/jalali'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ConfidenceBadge, SectionHeader, SourceChips, ResultBadge } from './ui-bits'

const ORG_TONE: Record<MartyrOrg, string> = {
  sepah: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  artesth: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  iriaf: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  political: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  people: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
}

const RESEARCH_STATUS: Record<string, { label: string; tone: string }> = {
  'post-war': { label: 'شهادت پس از جنگ — خارج از خط زمانی', tone: 'bg-amber-500/15 text-amber-500 border-amber-500/30' },
  'not-martyr': { label: 'شهید جنگ نیست — چهره شاخص مقاومت', tone: 'bg-sky-500/15 text-sky-300 border-sky-500/30' },
  'other-front': { label: 'جبهه دیگر (خارج از جبهه ایران–عراق)', tone: 'bg-violet-500/15 text-violet-300 border-violet-500/30' },
  category: { label: 'دسته تحقیق — نیازمند استخراج آرشیوی', tone: 'bg-muted text-muted-foreground border-border' },
}

const MONTH_KEYS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند']

function MartyrPortrait({ m, className }: { m: Martyr; className?: string }) {
  return m.image ? (
    <div className={`relative overflow-hidden rounded-xl border ${className ?? ''}`}>
      <img src={m.image.url} alt={`پرتره شهید ${m.name}`} loading="lazy" onError={e => { (e.currentTarget.style.display = 'none') }} className="h-full w-full object-cover" />
      {m.image.verified === 'pending-review' && (
        <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-[9px] text-amber-300">{MEDIA_VERIFICATION_LABELS['pending-review']}</span>
      )}
    </div>
  ) : (
    // جایگزین محترمانه: قاب خوشنویسی با نام شهید — تا استخراج پرتره رسمی از آرشیو بنیاد شهید
    <div className={`relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed bg-gradient-to-b from-muted/60 to-background ${className ?? ''}`}>
      <span className="text-3xl opacity-70">✦</span>
      <span className="mt-2 px-3 text-center text-sm font-extrabold leading-7">شهید {m.name}</span>
      <span className="mt-1 px-3 pb-3 text-center text-[9px] text-muted-foreground">پرتره در انتظار استخراج از آرشیو رسمی</span>
    </div>
  )
}

function MartyrCard({ m, onOpen }: { m: Martyr; onOpen: (m: Martyr) => void }) {
  const ops = m.opIds.map(id => OPERATIONS.find(o => o.id === id)).filter(Boolean)
  return (
    <Card className="museum-card cursor-pointer transition-colors hover:border-primary/50" onClick={() => onOpen(m)}>
      <CardContent className="flex gap-4 p-4">
        <MartyrPortrait m={m} className="h-28 w-24 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-extrabold">شهید {m.name}</span>
            <Badge variant="outline" className={`text-[10px] font-extrabold ${ORG_TONE[m.org]}`}>{MARTYR_ORG_LABELS[m.org]}</Badge>
            <Badge variant="outline" className="text-[10px]">{MARTYR_ROLE_LABELS[m.roleType]}</Badge>
          </div>
          <div className="mt-1 flex flex-wrap gap-x-3 text-[11px] text-muted-foreground">
            <span>🗓 شهادت: {m.dateLabel ?? formatJalali(m.martyrdomDate)}</span>
            <span>📍 {m.place}</span>
            {m.age && <span>⏳ {toFa(m.age)}</span>}
          </div>
          <p className="mt-2 line-clamp-2 text-xs leading-6 text-muted-foreground">{m.cause}</p>
          {ops.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {ops.slice(0, 2).map(o => (
                <Badge key={o!.id} variant="outline" className="text-[10px]">⚔ {o!.faName} <ResultBadge r={o!.result} /></Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function MartyrDialog({ m, onClose, go }: { m: Martyr | null; onClose: () => void; go: (v: string, p?: string) => void }) {
  if (!m) return null
  const ops = m.opIds.map(id => OPERATIONS.find(o => o.id === id)).filter(Boolean)
  const rfLinks = RAVAYAT_FATH.filter(rf => rf.opIds.some(oid => m.opIds.includes(oid)))
  const media = MEDIA_ITEMS.filter(md => md.people?.includes(m.name))
  return (
    <Dialog open={!!m} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-h-[88vh] max-w-3xl overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="text-right text-2xl font-extrabold text-primary">شهید {m.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 md:grid-cols-[160px_1fr]">
          <MartyrPortrait m={m} className="aspect-[3/4] w-full md:aspect-auto md:h-52" />
          <div className="space-y-1.5 text-sm">
            {m.knownAs && <p className="text-xs text-muted-foreground">نام شناخته‌شده: {m.knownAs}</p>}
            <p className="text-xs leading-6"><span className="font-extrabold">تولد: </span>{m.birth ?? 'در انتظار استخراج از آرشیو'}</p>
            <p className="text-xs leading-6"><span className="font-extrabold">شهادت: </span>{m.dateLabel ?? formatJalali(m.martyrdomDate)} — {m.place}</p>
            {m.age && <p className="text-xs leading-6"><span className="font-extrabold">سن هنگام شهادت: </span>{toFa(m.age)}</p>}
            <p className="text-xs leading-6"><span className="font-extrabold">مسئولیت: </span>{m.role} ({MARTYR_ORG_LABELS[m.org]})</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <Badge variant="outline" className={`text-[10px] font-extrabold ${ORG_TONE[m.org]}`}>{MARTYR_ORG_LABELS[m.org]}</Badge>
              <Badge variant="outline" className="text-[10px]">{MARTYR_ROLE_LABELS[m.roleType]}</Badge>
              <ConfidenceBadge c={m.confidence} />
            </div>
          </div>
        </div>
        {m.regionNote && <p className="rounded-lg bg-amber-500/10 p-2 text-[11px] leading-6 text-amber-500">🗓 نکته تاریخ‌نگاری: {m.regionNote}</p>}
        {m.quote && <blockquote className="rounded-xl border-r-4 border-primary/60 bg-primary/5 p-3 text-sm italic leading-7">«{m.quote}»</blockquote>}
        <div className="space-y-2">
          <h4 className="text-sm font-extrabold text-primary">نحوه شهادت (کوتاه و محترمانه)</h4>
          <p className="text-sm leading-7 text-justify">{m.cause}</p>
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-extrabold text-primary">زندگی و فعالیت‌ها</h4>
          <p className="text-sm leading-7 text-justify">{m.bio}</p>
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-extrabold text-primary">نقش تاریخی</h4>
          <p className="text-sm leading-7 text-justify">{m.legacy}</p>
        </div>
        {ops.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-extrabold text-primary">عملیات‌های مرتبط — شبکه اطلاعاتی مشترک</h4>
            <div className="flex flex-wrap gap-2">
              {ops.map(o => (
                <Badge key={o!.id} variant="outline" className="cursor-pointer py-1.5 hover:border-primary" onClick={() => { onClose(); go('operations', o!.id) }}>
                  ⚔ {o!.faName} <ResultBadge r={o!.result} />
                </Badge>
              ))}
            </div>
          </div>
        )}
        {rfLinks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-extrabold text-primary">مستندهای روایت فتح مرتبط</h4>
            {rfLinks.map(rf => (
              <div key={rf.id} className="rounded-lg border bg-card/60 p-2.5 text-xs leading-6">
                🎬 {rf.topic} <Badge variant="outline" className="text-[10px]">{rf.episodeStatus === 'identified' ? 'شناسه‌گذاری‌شده' : 'در انتظار استخراج آرشیوی'}</Badge>
              </div>
            ))}
          </div>
        )}
        {media.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-extrabold text-primary">رسانه‌های مرتبط</h4>
            <div className="grid grid-cols-2 gap-2">
              {media.map(md => (
                <div key={md.id} className="rounded-lg border bg-card/60 p-2 text-xs">
                  📷 {md.title} <span className="text-muted-foreground">— {md.sourceName}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => { onClose(); go('atlas') }}>🗺 نقشه تاریخی</Button>
          <Button size="sm" variant="outline" onClick={() => { onClose(); go('martyrs') }}>بازگشت به خط زمانی</Button>
        </div>
        <div>
          <div className="mb-2 text-xs font-bold text-muted-foreground">منابع پرونده شهید:</div>
          <SourceChips ids={m.sources} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function MartyrsView({ go }: { go: (v: string, p?: string) => void }) {
  const [year, setYear] = useState('all')
  const [month, setMonth] = useState('all')
  const [org, setOrg] = useState('all')
  const [role, setRole] = useState('all')
  const [open, setOpen] = useState<Martyr | null>(null)

  const years = useMemo(() => [...new Set(MARTYRS.map(m => Number(m.martyrdomDate.split('-')[0])))].sort(), [])
  const filtered = useMemo(() => {
    return [...MARTYRS].sort((a, b) => jalaliToDate(a.martyrdomDate).getTime() - jalaliToDate(b.martyrdomDate).getTime()).filter(m => {
      const [y, mo] = m.martyrdomDate.split('-')
      if (year !== 'all' && String(y) !== year) return false
      if (month !== 'all' && MONTH_KEYS[Number(mo) - 1] !== month) return false
      if (org !== 'all' && m.org !== org) return false
      if (role !== 'all' && m.roleType !== role) return false
      return true
    })
  }, [year, month, org, role])

  // هیستوگرام سالانه
  const byYear = years.map(y => ({ y, n: MARTYRS.filter(m => m.martyrdomDate.startsWith(String(y))).length }))
  const maxN = Math.max(...byYear.map(b => b.n), 1)

  const select = 'rounded-lg border bg-background px-2 py-1.5 text-xs font-bold'
  return (
    <div className="space-y-8">
      <section className="hero-vignette rounded-3xl border p-6 md:p-10">
        <Badge variant="outline" className="mb-3">فصل جدید فاز ۲</Badge>
        <h1 className="museum-title text-2xl font-extrabold leading-tight md:text-4xl">ستارگان آسمان دفاع مقدس</h1>
        <p className="mt-2 text-sm font-bold text-primary">خط زمانی شهادت فرماندهان و شهدای شاخص ایران (۱۳۵۹–۱۳۶۷)</p>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
          هدف این تالار، ثبت تاریخی و معرفی محترمانه شهدای شاخص جنگ است. هر پرونده با تاریخ راستی‌آزمایی‌شده،
          منبع مشخص و پیوند به عملیات‌ها، نقشه و مستندهای مرتبط ارائه می‌شود. اشخاصی که پس از جنگ شهید شده‌اند
          مطابق سیاست صحت، در خط زمانی جنگ قرار نمی‌گیرند و در «بررسی فهرست پیشنهادی» شفاف ثبت شده‌اند.
        </p>
      </section>

      {/* هیستوگرام خط زمانی */}
      <section>
        <SectionHeader kicker="خط زمانی" title="توزیع شهادت شهدای شاخص ثبت‌شده بر حسب سال" desc="این نمودار فقط پرونده‌های ثبت‌شده این تالار را نشان می‌دهد؛ نه آمار کل شهدای جنگ." />
        <div className="flex items-end gap-3 rounded-2xl border bg-card/60 p-4" style={{ height: 150 }}>
          {byYear.map(b => (
            <button key={b.y} onClick={() => setYear(String(b.y))} className="flex h-full flex-1 flex-col items-center justify-end gap-1" title={`سال ${toFa(b.y)}`}>
              <span className="text-[11px] font-extrabold text-primary">{toFa(b.n)}</span>
              <div className="w-full rounded-t-lg bg-primary/70 transition-all hover:bg-primary" style={{ height: `${(b.n / maxN) * 100}%` }} />
              <span className="text-[10px] font-bold text-muted-foreground">{toFa(b.y)}</span>
            </button>
          ))}
        </div>
      </section>

      {/* فیلترها */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border bg-card/60 p-3">
        <select value={year} onChange={e => setYear(e.target.value)} className={select}>
          <option value="all">همه سال‌ها</option>
          {years.map(y => <option key={y} value={y}>{toFa(y)}</option>)}
        </select>
        <select value={month} onChange={e => setMonth(e.target.value)} className={select}>
          <option value="all">همه ماه‌ها</option>
          {MONTH_KEYS.map(mk => <option key={mk} value={mk}>{mk}</option>)}
        </select>
        <select value={org} onChange={e => setOrg(e.target.value)} className={select}>
          <option value="all">همه سازمان‌ها</option>
          {Object.entries(MARTYR_ORG_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={role} onChange={e => setRole(e.target.value)} className={select}>
          <option value="all">همه مسئولیت‌ها</option>
          {Object.entries(MARTYR_ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <span className="mr-auto text-xs font-bold text-muted-foreground">{toFa(filtered.length)} پرونده</span>
      </div>

      {/* خط زمانی عمودی */}
      <div className="space-y-4">
        {years.filter(y => filtered.some(m => m.martyrdomDate.startsWith(String(y)))).map(y => (
          <div key={y} className="relative rounded-2xl border bg-card/40 p-4">
            <div className="mb-3 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-sm font-extrabold text-primary">{toFa(y)}</span>
              <span className="text-xs font-bold text-muted-foreground">{toFa(filtered.filter(m => m.martyrdomDate.startsWith(String(y))).length)} پرونده در این سال</span>
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              {filtered.filter(m => m.martyrdomDate.startsWith(String(y))).map(m => <MartyrCard key={m.id} m={m} onOpen={setOpen} />)}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">با این فیلترها پرونده‌ای یافت نشد.</div>}
      </div>

      {/* بررسی فهرست پیشنهادی */}
      <section>
        <SectionHeader kicker="سطح ج — بررسی اسناد" title="بررسی فهرست پیشنهادی شهدای شاخص" desc="فهرست پیشنهادی نقطه شروع تحقیق بود، نه فهرست نهایی. هر نام جداگانه راستی‌آزمایی شد و نتیجه صادقانه ثبت شده است." />
        <div className="space-y-3">
          {MARTYR_RESEARCH.map(r => {
            const st = RESEARCH_STATUS[r.status]
            return (
              <div key={r.id} className="rounded-xl border bg-card/60 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-extrabold">{r.name}</span>
                  <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-extrabold ${st.tone}`}>{st.label}</span>
                  {r.date && <Badge variant="outline" className="text-[10px]">{r.date}</Badge>}
                </div>
                <p className="mt-2 text-xs leading-6 text-justify text-muted-foreground">{r.finding}</p>
              </div>
            )
          })}
        </div>
      </section>

      <MartyrDialog m={open} onClose={() => setOpen(null)} go={go} />
    </div>
  )
}
