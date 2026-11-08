'use client'

import { useMemo, useState } from 'react'
import { MARTYRS, type Martyr } from '@/data/martyrs'
import {
  MARTYR_BURIALS,
  MARTYR_MEMORIES,
  MEMORY_KIND_LABELS,
  memoriesOf,
  burialOf,
  type MartyrMemory,
  type MartyrBurial,
} from '@/data/martyr-memories'
import { formatJalali } from '@/lib/jalali'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ConfidenceBadge, SectionHeader } from './ui-bits'
import { toFa } from '@/lib/jalali'

const KIND_TONE: Record<string, string> = {
  memoir: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  will: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  book: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  narration: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  'museum-note': 'bg-muted text-muted-foreground border-border',
}

function Portrait({ m, className }: { m: Martyr; className?: string }) {
  return m.image ? (
    <div className={`relative overflow-hidden rounded-xl border ${className ?? ''}`}>
      <img
        src={m.image.url}
        alt={`پرتره شهید ${m.name}`}
        loading="lazy"
        onError={e => { (e.currentTarget.style.display = 'none') }}
        className="h-full w-full object-cover object-top"
      />
      {m.image.verified === 'pending-review' && (
        <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-[9px] text-amber-300">هویت‌سنجی در انتظار تأیید</span>
      )}
    </div>
  ) : (
    <div className={`relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed bg-gradient-to-b from-muted/60 to-background ${className ?? ''}`}>
      <span className="text-2xl opacity-70">✦</span>
      <span className="mt-1 px-2 text-center text-[11px] font-extrabold leading-5">شهید {m.name}</span>
    </div>
  )
}

function GraveFigure({ b, className }: { b: MartyrBurial; className?: string }) {
  if (b.photo) {
    return (
      <div className={`relative overflow-hidden rounded-xl border ${className ?? ''}`}>
        <img
          src={b.photo.url}
          alt={`محل دفن شهید — ${b.cemetery}`}
          loading="lazy"
          onError={e => { (e.currentTarget.style.display = 'none') }}
          className="h-full w-full object-cover"
        />
        <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-[9px] text-amber-300">تأیید تصویر نیازمند بازبینی کارشناسی</span>
      </div>
    )
  }
  return (
    <div className={`relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed bg-gradient-to-b from-muted/50 to-background ${className ?? ''}`}>
      <span className="text-2xl opacity-60">🕌</span>
      <span className="mt-1 px-2 pb-2 text-center text-[10px] leading-5 text-muted-foreground">عکس مزار در آرشیو باز در دسترس نیست</span>
    </div>
  )
}

function MemoryItem({ mem }: { mem: MartyrMemory }) {
  return (
    <div className="rounded-xl border bg-card/60 p-3">
      <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
        <Badge variant="outline" className={`text-[10px] font-extrabold ${KIND_TONE[mem.kind]}`}>{MEMORY_KIND_LABELS[mem.kind]}</Badge>
        {mem.narrator && <span className="text-[11px] font-bold text-primary">راوی: {mem.narrator}</span>}
        {mem.verbatim && <Badge variant="outline" className="text-[9px]">نقل مستقیم منبع</Badge>}
        <ConfidenceBadge c={mem.confidence} />
      </div>
      <p className="text-justify text-[13px] leading-7">{mem.text}</p>
      <div className="mt-2 text-[11px] text-muted-foreground">
        منبع: {mem.sourceUrl ? (
          <a href={mem.sourceUrl} target="_blank" rel="noreferrer" className="font-bold text-primary underline decoration-primary/40 hover:decoration-primary">{mem.sourceName}</a>
        ) : mem.sourceName}
      </div>
    </div>
  )
}

function MemoryCard({ m, b, mems, onOpen }: { m: Martyr; b?: MartyrBurial; mems: MartyrMemory[]; onOpen: () => void }) {
  return (
    <Card className="museum-card cursor-pointer transition-colors hover:border-primary/50" onClick={onOpen}>
      <CardContent className="space-y-3 p-4">
        <div className="flex gap-3">
          <Portrait m={m} className="h-28 w-24 shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="font-extrabold">شهید {m.name}</div>
            <div className="mt-1 text-[11px] leading-5 text-muted-foreground">🗓 شهادت: {m.dateLabel ?? formatJalali(m.martyrdomDate)}</div>
            <div className="mt-1 text-[11px] leading-5 text-muted-foreground">
              🕌 {b ? `${b.cemetery} — ${b.city}` : 'اطلاعات آرامگاه در انتظار استخراج'}
            </div>
            {b?.detail && <div className="mt-0.5 line-clamp-2 text-[10px] leading-5 text-muted-foreground">{b.detail}</div>}
            <div className="mt-2 flex flex-wrap gap-1">
              {mems.length > 0 && <Badge variant="outline" className="text-[10px]">📜 {toFa(mems.length)} مدخل خاطره و روایت</Badge>}
              <ConfidenceBadge c={b?.confidence ?? 'C'} />
            </div>
          </div>
        </div>
        {b?.photo && <GraveFigure b={b} className="h-40 w-full" />}
      </CardContent>
    </Card>
  )
}

function DetailDialog({ m, b, mems, onClose }: { m: Martyr | null; b?: MartyrBurial; mems: MartyrMemory[]; onClose: () => void }) {
  if (!m) return null
  return (
    <Dialog open={!!m} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-h-[88vh] max-w-3xl overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="text-right text-2xl font-extrabold text-primary">شهید {m.name} — خاطرات و آرامگاه</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 md:grid-cols-[190px_1fr]">
          <Portrait m={m} className="aspect-[3/4] w-full md:aspect-auto md:h-56" />
          <div className="space-y-2 text-sm">
            <p className="text-xs leading-6"><span className="font-extrabold">شهادت: </span>{m.dateLabel ?? formatJalali(m.martyrdomDate)} — {m.place}</p>
            <p className="text-xs leading-6"><span className="font-extrabold">مسئولیت: </span>{m.role}</p>
            {b ? (
              <>
                <div className="rounded-xl border bg-primary/5 p-3">
                  <div className="mb-1 text-xs font-extrabold text-primary">🕌 محل دفن</div>
                  <p className="text-xs leading-6"><b>{b.cemetery}</b> — {b.city}</p>
                  {b.detail && <p className="mt-0.5 text-xs leading-6">{b.detail}</p>}
                  {b.note && <p className="mt-1 text-[11px] leading-6 text-muted-foreground">{b.note}</p>}
                  <div className="mt-2 text-[11px] text-muted-foreground">
                    منبع: {b.sourceUrl ? (
                      <a href={b.sourceUrl} target="_blank" rel="noreferrer" className="font-bold text-primary underline decoration-primary/40 hover:decoration-primary">{b.sourceName}</a>
                    ) : b.sourceName}
                  </div>
                </div>
                {b.photo && (
                  <div className="space-y-1">
                    <GraveFigure b={b} className="h-52 w-full" />
                    <p className="text-[10px] leading-5 text-muted-foreground">تصویر: {b.photo.caption} — منبع: {b.photo.sourceName}</p>
                  </div>
                )}
              </>
            ) : (
              <p className="rounded-xl border border-dashed p-3 text-xs leading-6 text-muted-foreground">اطلاعات آرامگاه این شهید هنوز استخراج نشده است؛ مطابق سیاست موزه، به‌جای حدس، فقط داده‌های مستند نمایش داده می‌شود.</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-extrabold text-primary">خاطرات، وصیت‌ها و روایت‌ها</h4>
            <Badge variant="outline" className="text-[10px]">{toFa(mems.length)} مدخل</Badge>
          </div>
          {mems.length > 0 ? (
            <div className="space-y-2">{mems.map(mem => <MemoryItem key={mem.id} mem={mem} />)}</div>
          ) : (
            <p className="rounded-xl border border-dashed p-3 text-xs leading-6 text-muted-foreground">برای این شهید در این جمع‌بندی خاطره‌ای با ارجاع دقیق یافت نشد؛ به‌جای نقل نامعین، این شفاف‌سازی ثبت شده است.</p>
          )}
        </div>
        {m.dateNote && <p className="rounded-lg bg-amber-500/10 p-2 text-[11px] leading-6 text-amber-500">🗓 {m.dateNote}</p>}
        <p className="text-[10px] leading-5 text-muted-foreground">
          یادآوری سیاست موزه: خاطرات فقط از منابع بازِ مشخص جمع‌آوری شده‌اند؛ نقل‌های مستقیم با برچسب مشخص شده‌اند و مغایرت منابع شفاف ثبت می‌شود.
        </p>
      </DialogContent>
    </Dialog>
  )
}

export function MartyrsMemoriesView({ go }: { go: (v: string, p?: string) => void }) {
  const [q, setQ] = useState('')
  const [onlyMemoirs, setOnlyMemoirs] = useState(false)
  const [onlyGravePhoto, setOnlyGravePhoto] = useState(false)
  const [open, setOpen] = useState<Martyr | null>(null)

  const rows = useMemo(() => {
    return [...MARTYRS]
      .sort((a, b2) => a.martyrdomDate.localeCompare(b2.martyrdomDate))
      .map(m => ({ m, b: burialOf(m.id), mems: memoriesOf(m.id) }))
      .filter(r => {
        if (q && !`${r.m.name} ${r.m.knownAs ?? ''}`.includes(q.trim())) return false
        if (onlyMemoirs && r.mems.filter(x => x.kind !== 'museum-note').length === 0) return false
        if (onlyGravePhoto && !r.b?.photo) return false
        return true
      })
  }, [q, onlyMemoirs, onlyGravePhoto])

  const totalMems = MARTYR_MEMORIES.filter(x => x.kind !== 'museum-note').length
  const totalPhotos = MARTYR_BURIALS.filter(b => b.photo).length

  return (
    <div className="space-y-8">
      <section className="hero-vignette rounded-3xl border p-6 md:p-10">
        <Badge variant="outline" className="mb-3">تالار جدید — به‌روزرسانی تصاویر و خاطرات</Badge>
        <h1 className="museum-title text-2xl font-extrabold leading-tight md:text-4xl">خاطرات شهدا و آرامگاه‌ها</h1>
        <p className="mt-2 text-sm font-bold text-primary">جمع‌آوری خاطرات و روایت‌های شهدای جنگ تحمیلی از منابع اینترنتی + عکس و مشخصات محل دفن</p>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
          در این تالار، خاطرات، وصیت‌ها و روایت‌های شهدای شاخص دفاع مقدس از منابع بازِ اینترنت (نوید شاهد، گلزار شهدا، مراکز اسناد، خبرگزاری‌ها) با آدرس دقیق منبع جمع‌آوری شده است. مشخصات آرامگاه هر شهید (گلزار، شهر، قطعه و ردیف) و تصویر مزار یا یادمان او همراه با برچسب وضعیت تأیید ثبت شده است. جایی که عکس مزار اختصاصی در دسترس نباشد، صریحاً گفته می‌شود و تصویر کلی گلزار جایگزین می‌شود؛ موزه هیچ داده‌ای را از خود نمی‌سازد.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
          <Badge variant="outline">📜 {toFa(totalMems)} مدخل خاطره/روایت</Badge>
          <Badge variant="outline">🖼 {toFa(totalPhotos)} تصویر مزار/یادمان</Badge>
          <Badge variant="outline">🕌 {toFa(MARTYR_BURIALS.length)} پرونده آرامگاه</Badge>
          <Badge variant="outline">🔗 هر مدخل با منبع اصلی</Badge>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border bg-card/60 p-3">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="جست‌وجوی نام شهید…"
          className="w-56 rounded-lg border bg-background px-3 py-1.5 text-xs font-bold"
          aria-label="جست‌وجوی شهید"
        />
        <label className="flex cursor-pointer items-center gap-1.5 text-xs font-bold">
          <input type="checkbox" checked={onlyMemoirs} onChange={e => setOnlyMemoirs(e.target.checked)} className="accent-[var(--primary)]" />
          فقط شهیدان دارای خاطره
        </label>
        <label className="flex cursor-pointer items-center gap-1.5 text-xs font-bold">
          <input type="checkbox" checked={onlyGravePhoto} onChange={e => setOnlyGravePhoto(e.target.checked)} className="accent-[var(--primary)]" />
          فقط دارای عکس مزار
        </label>
        <span className="mr-auto text-xs font-bold text-muted-foreground">{toFa(rows.length)} پرونده</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {rows.map(r => (
          <MemoryCard key={r.m.id} m={r.m} b={r.b} mems={r.mems} onOpen={() => setOpen(r.m)} />
        ))}
        {rows.length === 0 && <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">پرونده‌ای با این جست‌وجو یافت نشد.</div>}
      </div>

      <SectionHeader
        kicker="شفافیت آرشیوی"
        title="درباره تصاویر پرتره و مزار"
        desc="پرتره‌ها و تصاویر مزار با جست‌وجوی تصویر وب از منابع عمومی جمع‌آوری و با برچسب «هویت‌سنجی در انتظار تأیید» ثبت شده‌اند. جایگزین نهایی باید از آرشیو رسمی بنیاد شهید و مرکز اسناد دفاع مقدس تأیید شود؛ تا آن زمان موزه ادعای قطعیت درباره تطابق تصویر ندارد."
      />

      <DetailDialog m={open} b={open ? burialOf(open.id) : undefined} mems={open ? memoriesOf(open.id) : []} onClose={() => setOpen(null)} />
      <button className="sr-only" onClick={() => go('martyrs')}>بازگشت به خط زمانی شهدا</button>
    </div>
  )
}
