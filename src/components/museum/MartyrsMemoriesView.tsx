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
import { formatJalali, toFa } from '@/lib/jalali'
import {
  useGravePhotoReviews,
  useVisitorMemories,
  gravePhotoBadge,
  faDateTime,
  VERDICT_LABELS,
  type GravePhotoReview,
  type ReviewVerdict,
  type VisitorMemory,
} from '@/lib/martyr-feedback'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ConfidenceBadge, SectionHeader } from './ui-bits'
import { useToast } from '@/hooks/use-toast'

const KIND_TONE: Record<string, string> = {
  memoir: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  will: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  book: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  narration: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  'museum-note': 'bg-muted text-muted-foreground border-border',
}

const VERDICT_TONE: Record<ReviewVerdict, string> = {
  approved: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
  rejected: 'border-rose-500/50 bg-rose-500/10 text-rose-300',
  'needs-more': 'border-amber-500/50 bg-amber-500/10 text-amber-400',
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

/** تصویر مزار با برچسب پویا بر پایه مرور کارشناسی — تأیید کارشناس، برچسب را ارتقا می‌دهد */
function GraveFigure({ b, review, className }: { b: MartyrBurial; review?: GravePhotoReview; className?: string }) {
  if (b.photo && review?.verdict !== 'rejected') {
    const badge = gravePhotoBadge(b.photo.verified, review)
    return (
      <div className={`relative overflow-hidden rounded-xl border ${className ?? ''}`}>
        <img
          src={b.photo.url}
          alt={`محل دفن شهید — ${b.cemetery}`}
          loading="lazy"
          onError={e => { (e.currentTarget.style.display = 'none') }}
          className="h-full w-full object-cover"
        />
        <span className={`absolute bottom-1 right-1 rounded border px-1.5 py-0.5 text-[9px] font-bold ${badge.cls}`}>{badge.label}</span>
      </div>
    )
  }
  return (
    <div className={`relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed bg-gradient-to-b from-muted/50 to-background ${className ?? ''}`}>
      <span className="text-2xl opacity-60">🕌</span>
      <span className="mt-1 px-3 pb-2 text-center text-[10px] leading-5 text-muted-foreground">
        {review?.verdict === 'rejected'
          ? 'این تصویر در مرور کارشناسی، مزار این شهید تشخیص داده نشد و از نمایش خارج شده است'
          : 'عکس مزار در آرشیو باز در دسترس نیست'}
      </span>
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

/** خاطره ثبت‌شده توسط بازدیدکننده — تا تأیید کارشناس با برچسب «در انتظار تأیید» نمایش داده می‌شود */
function VisitorMemoryItem({ mem, onDelete }: { mem: VisitorMemory; onDelete: () => void }) {
  return (
    <div className="rounded-xl border border-dashed bg-amber-500/5 p-3">
      <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
        <Badge variant="outline" className="border-sky-500/40 bg-sky-500/10 text-[10px] font-extrabold text-sky-300">خاطره بازدیدکننده</Badge>
        <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-[9px] text-amber-400">⏳ در انتظار تأیید کارشناس</Badge>
        <span className="text-[11px] font-bold text-primary">{mem.name}{mem.city ? ` — ${mem.city}` : ''}</span>
        <span className="text-[10px] text-muted-foreground">{faDateTime(mem.submittedAt)}</span>
      </div>
      <p className="whitespace-pre-line text-justify text-[13px] leading-7">{mem.text}</p>
      <button onClick={onDelete} className="mt-1.5 text-[10px] font-bold text-rose-400/80 underline hover:text-rose-400">
        حذف این خاطره (ثبت من در همین مرورگر)
      </button>
    </div>
  )
}

function ReviewInfoLine({ review }: { review: GravePhotoReview }) {
  return (
    <div className={`rounded-lg border p-2 text-[11px] leading-5 ${VERDICT_TONE[review.verdict]}`}>
      <b>آخرین مرور کارشناسی:</b> {VERDICT_LABELS[review.verdict].split(' (')[0]} — کارشناس: <b>{review.reviewer}</b> — {faDateTime(review.reviewedAt)}
      {review.note && <span className="block text-muted-foreground">یادداشت کارشناس: {review.note}</span>}
    </div>
  )
}

/** فرم مرور کارشناسی تصویر مزار — ارتقای برچسب تأیید (تقاضای کارفرما) */
function ExpertReviewDialog({ m, b, open, onClose, onSubmit }: {
  m: Martyr
  b: MartyrBurial
  open: boolean
  onClose: () => void
  onSubmit: (v: { verdict: ReviewVerdict; reviewer: string; note?: string }) => void
}) {
  const [verdict, setVerdict] = useState<ReviewVerdict>('approved')
  const [reviewer, setReviewer] = useState('')
  const [note, setNote] = useState('')
  const ok = reviewer.trim().length >= 3

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-right text-lg font-extrabold text-primary">🧑‍⚖ مرور کارشناسی تصویر مزار — شهید {m.name}</DialogTitle>
        </DialogHeader>
        {b.photo && (
          <div className="flex gap-3">
            <img src={b.photo.url} alt="تصویر موضوع مرور" className="h-28 w-28 shrink-0 rounded-lg border object-cover" />
            <div className="space-y-1 text-[11px] leading-5 text-muted-foreground">
              <p><b className="text-foreground">کپشن ثبت‌شده:</b> {b.photo.caption}</p>
              <p><b className="text-foreground">منبع تصویر:</b> {b.photo.sourceName}</p>
              <p><b className="text-foreground">آرامگاه:</b> {b.cemetery}، {b.city} {b.detail ? `— ${b.detail}` : ''}</p>
            </div>
          </div>
        )}
        <div className="space-y-2">
          <div className="text-xs font-extrabold">نتیجه مرور:</div>
          <div className="space-y-1.5">
            {(Object.keys(VERDICT_LABELS) as ReviewVerdict[]).map(v => (
              <label key={v} className={`flex cursor-pointer items-start gap-2 rounded-lg border p-2 text-[11.5px] leading-5 transition-colors ${verdict === v ? VERDICT_TONE[v] : 'border-border hover:bg-muted/50'}`}>
                <input type="radio" name="verdict" checked={verdict === v} onChange={() => setVerdict(v)} className="mt-0.5 accent-[var(--primary)]" />
                <span>{VERDICT_LABELS[v]}</span>
              </label>
            ))}
          </div>
          <label className="block pt-1 text-xs font-extrabold" htmlFor="reviewer-name">نام کارشناس (الزامی)</label>
          <input
            id="reviewer-name"
            value={reviewer}
            onChange={e => setReviewer(e.target.value)}
            placeholder="مثلاً: کارشناس آرشیو بنیاد شهید"
            className="w-full rounded-lg border bg-background px-3 py-2 text-xs font-bold"
          />
          <label className="block pt-1 text-xs font-extrabold" htmlFor="review-note">یادداشت مرور (اختیاری)</label>
          <textarea
            id="review-note"
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={3}
            placeholder="توضیح کوتاه درباره مبنای تأیید یا عدم تأیید تصویر (مثلاً تطابق سنگ مزار با مشخصات ثبت‌شده)"
            className="w-full rounded-lg border bg-background px-3 py-2 text-xs leading-6"
          />
          <p className="text-[10px] leading-5 text-muted-foreground">
            گردش کار: تصویر با برچسب «در انتظار مرور کارشناس» ثبت می‌شود؛ تأیید کارشناس برچسب را به «تأیید کارشناسی» ارتقا می‌دهد و عدم تطابق، تصویر را از نمایش مزار خارج می‌کند. در این نسخه نمایشی نتیجه مرور در مرورگر شما ثبت می‌شود.
          </p>
        </div>
        <div className="flex justify-start gap-2">
          <Button
            size="sm"
            disabled={!ok}
            onClick={() => { onSubmit({ verdict, reviewer: reviewer.trim(), note: note.trim() || undefined }); setReviewer(''); setNote('') }}
            className="font-bold"
          >
            ثبت نتیجه مرور
          </Button>
          <Button size="sm" variant="outline" onClick={onClose}>انصراف</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/** فرم اشتراک خاطره بازدیدکننده (تقاضای کارفرما) */
function ShareMemoryDialog({ m, open, onClose, onSubmit }: {
  m: Martyr
  open: boolean
  onClose: () => void
  onSubmit: (v: { name: string; city?: string; text: string }) => void
}) {
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [text, setText] = useState('')
  const [consent, setConsent] = useState(false)
  const ok = name.trim().length >= 2 && text.trim().length >= 15 && consent

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-right text-lg font-extrabold text-primary">✍ اشتراک خاطره از شهید {m.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-xs font-extrabold" htmlFor="vm-name">نام شما *</label>
              <input id="vm-name" value={name} onChange={e => setName(e.target.value)} placeholder="نام و نام خانوادگی"
                className="w-full rounded-lg border bg-background px-3 py-2 text-xs font-bold" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-extrabold" htmlFor="vm-city">شهر / رابطه (اختیاری)</label>
              <input id="vm-city" value={city} onChange={e => setCity(e.target.value)} placeholder="مثلاً: همرزم سابق"
                className="w-full rounded-lg border bg-background px-3 py-2 text-xs font-bold" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-extrabold" htmlFor="vm-text">متن خاطره *</label>
            <textarea id="vm-text" value={text} onChange={e => setText(e.target.value)} rows={5}
              placeholder="خاطره‌ای که از این شهید به یاد دارید؛ پرهیز از جزئیات عملیاتی حساس و رعایت احترام شهدا"
              className="w-full rounded-lg border bg-background px-3 py-2 text-xs leading-6" />
          </div>
          <label className="flex cursor-pointer items-start gap-2 text-[11px] leading-5">
            <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-0.5 accent-[var(--primary)]" />
            <span>می‌پذیرم این خاطره پس از مرور کارشناس و تأیید منتشر شود و محتوای آن خاطره شخصی از شهید است، نه داده عملیاتی حساس.</span>
          </label>
          <p className="text-[10px] leading-5 text-muted-foreground">
            حریم خصوصی: در این نسخه نمایشی، خاطره شما فقط در همین مرورگر (Local Storage) به‌صورت «در انتظار تأیید کارشناس» ذخیره می‌شود و به سروری ارسال نمی‌گردد.
          </p>
        </div>
        <div className="flex justify-start gap-2">
          <Button size="sm" disabled={!ok} onClick={() => { onSubmit({ name: name.trim(), city: city.trim() || undefined, text: text.trim() }); setName(''); setCity(''); setText(''); setConsent(false) }} className="font-bold">
            ثبت خاطره
          </Button>
          <Button size="sm" variant="outline" onClick={onClose}>انصراف</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function MemoryCard({ m, b, mems, visitorCount, review, onOpen, onShare, onReview }: {
  m: Martyr
  b?: MartyrBurial
  mems: MartyrMemory[]
  visitorCount: number
  review?: GravePhotoReview
  onOpen: () => void
  onShare: () => void
  onReview: () => void
}) {
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
              {visitorCount > 0 && <Badge variant="outline" className="border-sky-500/40 bg-sky-500/10 text-[10px] text-sky-300">✍ {toFa(visitorCount)} خاطره بازدیدکنندگان</Badge>}
              <ConfidenceBadge c={b?.confidence ?? 'C'} />
            </div>
          </div>
        </div>
        {b?.photo && <GraveFigure b={b} review={review} className="h-40 w-full" />}
        <div className="flex flex-wrap gap-1.5" onClick={e => e.stopPropagation()}>
          <Button size="sm" variant="outline" className="h-7 px-2 text-[10.5px] font-extrabold" onClick={onShare}>✍ اشتراک خاطره</Button>
          {b?.photo && (
            <Button size="sm" variant="outline" className="h-7 px-2 text-[10.5px] font-extrabold" onClick={onReview}>
              🧑‍⚖ مرور کارشناسی مزار{review?.verdict === 'approved' ? ' ✓' : ''}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function DetailDialog({ m, b, mems, vMems, review, onClose, onShare, onReview, onDeleteVisitor }: {
  m: Martyr | null
  b?: MartyrBurial
  mems: MartyrMemory[]
  vMems: VisitorMemory[]
  review?: GravePhotoReview
  onClose: () => void
  onShare: () => void
  onReview: () => void
  onDeleteVisitor: (id: string) => void
}) {
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
                  <div className="mb-1 text-xs font-extrabold text-primary">🕌 محل دفن — آدرس و شماره قبر</div>
                  <p className="text-xs leading-6"><b>{b.cemetery}</b> — {b.city}</p>
                  <p className="text-xs leading-6"><b>شماره قبر / محل قرارگیری: </b>{b.detail ?? <span className="text-muted-foreground">در انتظار تأیید کارشناس</span>}</p>
                  {b.note && <p className="mt-1 text-[11px] leading-6 text-muted-foreground">{b.note}</p>}
                  <div className="mt-2 text-[11px] text-muted-foreground">
                    منبع: {b.sourceUrl ? (
                      <a href={b.sourceUrl} target="_blank" rel="noreferrer" className="font-bold text-primary underline decoration-primary/40 hover:decoration-primary">{b.sourceName}</a>
                    ) : b.sourceName}
                  </div>
                </div>
                {b.photo && (
                  <div className="space-y-1">
                    <GraveFigure b={b} review={review} className="h-52 w-full" />
                    <p className="text-[10px] leading-5 text-muted-foreground">تصویر: {b.photo.caption} — منبع: {b.photo.sourceName}</p>
                    {review && <ReviewInfoLine review={review} />}
                  </div>
                )}
              </>
            ) : (
              <p className="rounded-xl border border-dashed p-3 text-xs leading-6 text-muted-foreground">اطلاعات آرامگاه این شهید هنوز استخراج نشده است؛ مطابق سیاست موزه، به‌جای حدس، فقط داده‌های مستند نمایش داده می‌شود.</p>
            )}
            {/* دکمه‌های مشارکت — تقاضای کارفرما */}
            <div className="flex flex-wrap gap-2 pt-1">
              <Button size="sm" className="font-bold" onClick={onShare}>✍ اشتراک خاطره</Button>
              {b?.photo && (
                <Button size="sm" variant="outline" className="font-bold" onClick={onReview}>
                  🧑‍⚖ مرور کارشناسی تصویر مزار
                </Button>
              )}
            </div>
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
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-extrabold text-primary">خاطرات بازدیدکنندگان این تالار</h4>
            <Badge variant="outline" className="text-[10px]">{toFa(vMems.length)} ثبت</Badge>
          </div>
          {vMems.length > 0 ? (
            <div className="space-y-2">{vMems.map(vm => <VisitorMemoryItem key={vm.id} mem={vm} onDelete={() => onDeleteVisitor(vm.id)} />)}</div>
          ) : (
            <p className="rounded-xl border border-dashed p-3 text-xs leading-6 text-muted-foreground">
              هنوز خاطره‌ای از بازدیدکنندگان ثبت نشده است؛ با دکمه «✍ اشتراک خاطره» می‌توانید نخستین نفر باشید. خاطره شما پس از مرور کارشناس با برچسب تأیید منتشر می‌شود.
            </p>
          )}
        </div>
        {m.dateNote && <p className="rounded-lg bg-amber-500/10 p-2 text-[11px] leading-6 text-amber-500">🗓 {m.dateNote}</p>}
        <p className="text-[10px] leading-5 text-muted-foreground">
          یادآوری سیاست موزه: خاطرات فقط از منابع بازِ مشخص جمع‌آوری شده‌اند؛ نقل‌های مستقیم با برچسب مشخص شده‌اند، خاطرات بازدیدکنندگان تا تأیید کارشناس «در انتظار تأیید» نمایش داده می‌شوند و مغایرت منابع شفاف ثبت می‌شود.
        </p>
      </DialogContent>
    </Dialog>
  )
}

export function MartyrsMemoriesView({ go, focusId }: { go: (v: string, p?: string) => void; focusId?: string }) {
  const [q, setQ] = useState('')
  const [onlyMemoirs, setOnlyMemoirs] = useState(false)
  const [onlyGravePhoto, setOnlyGravePhoto] = useState(false)
  const [openOverride, setOpenOverride] = useState<Martyr | null>(null)
  const [dismissedFocus, setDismissedFocus] = useState<string | null>(null)
  const [shareFor, setShareFor] = useState<Martyr | null>(null)
  const [reviewFor, setReviewFor] = useState<Martyr | null>(null)
  const { reviewOf, submitReview } = useGravePhotoReviews()
  const { memoriesOf, addMemory, removeMemory } = useVisitorMemories()
  const { toast } = useToast()

  // باز شدن خودکار پرونده شهید از پیوند دیگر تالارها — حالت مشتق‌شده از focusId (بدون setState در effect)
  const openFromParam = focusId && focusId !== dismissedFocus ? MARTYRS.find(x => x.id === focusId) ?? null : null
  const open = openOverride ?? openFromParam

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
  }, [q, onlyMemoirs, onlyGravePhoto, memoriesOf])

  const totalMems = MARTYR_MEMORIES.filter(x => x.kind !== 'museum-note').length
  const totalPhotos = MARTYR_BURIALS.filter(b => b.photo).length

  return (
    <div className="space-y-8">
      <section className="hero-vignette rounded-3xl border p-6 md:p-10">
        <Badge variant="outline" className="mb-3">تالار جدید — به‌روزرسانی تصاویر و خاطرات</Badge>
        <h1 className="museum-title text-2xl font-extrabold leading-tight md:text-4xl">خاطرات شهدا و آرامگاه‌ها</h1>
        <p className="mt-2 text-sm font-bold text-primary">جمع‌آوری خاطرات و روایت‌های شهدای جنگ تحمیلی از منابع اینترنتی + عکس و مشخصات محل دفن</p>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
          در این تالار، خاطرات، وصیت‌ها و روایت‌های شهدای شاخص دفاع مقدس از منابع بازِ اینترنت (نوید شاهد، گلزار شهدا، مراکز اسناد، خبرگزاری‌ها) با آدرس دقیق منبع جمع‌آوری شده است. مشخصات آرامگاه هر شهید (گلزار، شهر، قطعه و ردیف) و تصویر مزار یا یادمان او همراه با برچسب وضعیت تأیید ثبت شده است؛ مرور کارشناسی تصویر، برچسب را به «تأیید کارشناسی» ارتقا می‌دهد و بازدیدکنندگان می‌توانند خاطره خود را ثبت کنند. جایی که عکس مزار اختصاصی در دسترس نباشد، صریحاً گفته می‌شود و تصویر کلی گلزار جایگزین می‌شود؛ موزه هیچ داده‌ای را از خود نمی‌سازد.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
          <Badge variant="outline">📜 {toFa(totalMems)} مدخل خاطره/روایت</Badge>
          <Badge variant="outline">🖼 {toFa(totalPhotos)} تصویر مزار/یادمان</Badge>
          <Badge variant="outline">🕌 {toFa(MARTYR_BURIALS.length)} پرونده آرامگاه</Badge>
          <Badge variant="outline">🔗 هر مدخل با منبع اصلی</Badge>
          <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-300">🧑‍⚖ مرور کارشناسی تصاویر فعال است</Badge>
        </div>
      </section>

      {/* گردش کار مشارکت و مرور — تقاضای کارفرما */}
      <section className="rounded-2xl border bg-card/60 p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border bg-emerald-500/5 p-3">
            <div className="mb-1 text-xs font-extrabold text-emerald-400">🧑‍⚖ گردش کار مرور کارشناسی تصاویر مزار</div>
            <ol className="list-inside list-decimal space-y-1 text-[11.5px] leading-6 text-muted-foreground">
              <li>تصویر مزار با برچسب «در انتظار مرور کارشناس» ثبت می‌شود.</li>
              <li>کارشناس تصویر را با مشخصات رسمی آرامگاه (قطعه، ردیف، شماره قبر) می‌سنجد.</li>
              <li>تأیید ⟵ برچسب به «تأیید کارشناسی» با نام کارشناس ارتقا می‌یابد؛ عدم تطابق ⟵ تصویر از نمایش خارج و شفاف ثبت می‌شود.</li>
              <li>نتیجه مرور، نام، تاریخ و یادداشت کارشناس در پرونده شهید ثبت و نمایش داده می‌شود.</li>
            </ol>
          </div>
          <div className="rounded-xl border bg-sky-500/5 p-3">
            <div className="mb-1 text-xs font-extrabold text-sky-400">✍ اشتراک خاطره از بازدیدکنندگان</div>
            <ol className="list-inside list-decimal space-y-1 text-[11.5px] leading-6 text-muted-foreground">
              <li>روی پرونده هر شهید، دکمه «اشتراک خاطره» را بزنید.</li>
              <li>خاطره با نام شما و برچسب «در انتظار تأیید کارشناس» ثبت می‌شود.</li>
              <li>پس از مرور کارشناس، خاطره تأییدشده کنار خاطرات آرشیوی منتشر می‌شود.</li>
              <li>در این نسخه نمایشی، خاطرات در مرورگر خودتان ذخیره می‌شود و به سرور ارسال نمی‌گردد.</li>
            </ol>
          </div>
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
        {rows.map(r => {
          const vCount = memoriesOf(r.m.id).length
          const review = r.b?.photo ? reviewOf(r.m.id, r.b.photo.url) : undefined
          return (
            <MemoryCard
              key={r.m.id}
              m={r.m}
              b={r.b}
              mems={r.mems}
              visitorCount={vCount}
              review={review}
              onOpen={() => setOpenOverride(r.m)}
              onShare={() => setShareFor(r.m)}
              onReview={() => setReviewFor(r.m)}
            />
          )
        })}
        {rows.length === 0 && <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">پرونده‌ای با این جست‌وجو یافت نشد.</div>}
      </div>

      <SectionHeader
        kicker="شفافیت آرشیوی"
        title="درباره تصاویر پرتره و مزار"
        desc="پرتره‌ها و تصاویر مزار با جست‌وجوی تصویر وب از منابع عمومی جمع‌آوری و با برچسب «در انتظار مرور کارشناس» ثبت شده‌اند. دکمه «مرور کارشناسی مزار» به کارشناس امکان می‌دهد نتیجه هویت‌سنجی را ثبت کند و برچسب تأیید را ارتقا دهد؛ جایگزین نهایی باید از آرشیو رسمی بنیاد شهید و مرکز اسناد دفاع مقدس تأیید شود."
      />

      <DetailDialog
        m={open}
        b={open ? burialOf(open.id) : undefined}
        mems={open ? memoriesOf(open.id) : []}
        vMems={open ? memoriesOf(open.id) : []}
        review={open && burialOf(open.id)?.photo ? reviewOf(open.id, burialOf(open.id)!.photo!.url) : undefined}
        onClose={() => { setOpenOverride(null); if (focusId) setDismissedFocus(focusId) }}
        onShare={() => { setShareFor(open); setOpenOverride(null); setDismissedFocus(focusId ?? null) }}
        onReview={() => { setReviewFor(open); setOpenOverride(null); setDismissedFocus(focusId ?? null) }}
        onDeleteVisitor={removeMemory}
      />

      {shareFor && (
        <ShareMemoryDialog
          m={shareFor}
          open={!!shareFor}
          onClose={() => setShareFor(null)}
          onSubmit={v => {
            addMemory({ martyrId: shareFor.id, ...v })
            setShareFor(null)
            toast({ title: 'خاطره شما ثبت شد', description: 'خاطره با برچسب «در انتظار تأیید کارشناس» در پرونده شهید ثبت شد و پس از مرور کارشناس منتشر می‌شود.' })
          }}
        />
      )}

      {reviewFor && burialOf(reviewFor.id)?.photo && (
        <ExpertReviewDialog
          m={reviewFor}
          b={burialOf(reviewFor.id)!}
          open={!!reviewFor}
          onClose={() => setReviewFor(null)}
          onSubmit={v => {
            submitReview({ photoKey: `${reviewFor.id}|${burialOf(reviewFor.id)!.photo!.url}`, martyrId: reviewFor.id, ...v })
            setReviewFor(null)
            toast({
              title: v.verdict === 'approved' ? 'برچسب تصویر به «تأیید کارشناسی» ارتقا یافت' : 'نتیجه مرور کارشناسی ثبت شد',
              description: `کارشناس: ${v.reviewer} — نتیجه در پرونده شهید و روی تصویر مزار نمایش داده می‌شود.`,
            })
          }}
        />
      )}

      <button className="sr-only" onClick={() => go('martyrs')}>بازگشت به خط زمانی شهدا</button>
    </div>
  )
}
