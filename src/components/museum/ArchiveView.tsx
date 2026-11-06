'use client'

import { useMemo, useState } from 'react'
import { MEDIA_ITEMS, VIDEO_ITEMS, ARCHIVE_DIRECTORIES, MEDIA_TYPE_LABELS, MEDIA_VERIFICATION_LABELS, MEDIA_LICENSE_LABELS, MEDIA_AVAILABILITY_LABELS, MEDIA_AUTHENTICITY_LABELS, type MediaItem } from '@/data/media-registry'
import { OPERATIONS } from '@/data/operations'
import { toFa } from '@/lib/jalali'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ConfidenceBadge, SectionHeader, SourceChips, SafeImage } from './ui-bits'

const VERIFY_TONE: Record<string, string> = {
  confirmed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  'pending-review': 'bg-amber-500/15 text-amber-500 border-amber-500/30',
  'unverified-origin': 'bg-rose-500/15 text-rose-400 border-rose-500/30',
}

function MediaBadge({ m }: { m: MediaItem }) {
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-extrabold ${VERIFY_TONE[m.verification]}`}>
      {MEDIA_VERIFICATION_LABELS[m.verification]}
    </span>
  )
}

/** شناسنامه رسانه — بخش ۸.۲ فاز ۲ */
export function MediaIDCard({ m }: { m: MediaItem }) {
  const rows: [string, string][] = [
    ['نوع رسانه', MEDIA_TYPE_LABELS[m.type]],
    ['عنوان', m.title],
    ['تاریخ ثبت تصویر/فیلم', m.captureLabel ?? m.captureDate ?? 'تاریخ و منشأ نامشخص'],
    ['تاریخ انتشار', m.publishDate ?? '—'],
    ['مکان ثبت', m.location ?? '—'],
    ['عکاس/فیلم‌بردار', m.photographer ?? 'در منبع مشخص نشده'],
    ['اشخاص حاضر', m.people?.join('، ') ?? '—'],
    ['سازمان صاحب آرشیو', m.archiveOrg ?? m.sourceName],
    ['منبع اصلی', m.sourceName + (m.sourceUrl ? '' : '')],
    ['وضعیت مجوز', MEDIA_LICENSE_LABELS[m.license]],
    ['کیفیت فایل', m.quality === 'high' ? 'بالا' : m.quality === 'medium' ? 'متوسط' : 'پایین'],
    ['اصالت', MEDIA_AUTHENTICITY_LABELS[m.authenticity]],
    ['ارتباط با عملیات', (m.opIds ?? []).map(id => OPERATIONS.find(o => o.id === id)?.faName ?? id).join('، ') || '—'],
    ['ارتباط با اشخاص', m.people?.join('، ') ?? '—'],
    ['وضعیت بررسی کارشناسی', MEDIA_VERIFICATION_LABELS[m.verification]],
    ['در دسترس‌پذیری', MEDIA_AVAILABILITY_LABELS[m.availability]],
  ]
  return (
    <div className="space-y-3">
      {m.verificationNote && <p className="rounded-lg bg-amber-500/10 p-2 text-[11px] leading-6 text-amber-500">⚠ {m.verificationNote}</p>}
      {m.displayNote && <p className="rounded-lg bg-sky-500/10 p-2 text-[11px] leading-6 text-sky-300">ℹ {m.displayNote}</p>}
      <div className="overflow-hidden rounded-xl border">
        <table className="w-full text-sm">
          <tbody className="divide-y">
            {rows.map(([k, v]) => (
              <tr key={k} className="align-top">
                <td className="w-40 bg-muted/50 p-2.5 text-xs font-bold text-muted-foreground">{k}</td>
                <td className="p-2.5 text-xs leading-6">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-2">
        <ConfidenceBadge c={m.confidence} />
        {m.sourceUrl && <a href={m.sourceUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-primary underline">منبع اصلی ↗</a>}
        {m.url && m.license !== 'rights-reserved' && <a href={m.url} target="_blank" rel="noreferrer" className="text-xs font-bold text-primary underline">فایل رسانه ↗</a>}
      </div>
    </div>
  )
}

function MediaDialog({ m, onClose }: { m: MediaItem | null; onClose: () => void }) {
  if (!m) return null
  return (
    <Dialog open={!!m} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-h-[88vh] max-w-2xl overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="text-right text-lg font-extrabold text-primary">شناسنامه رسانه — {m.title}</DialogTitle>
        </DialogHeader>
        {m.url && m.type === 'photo' && m.availability === 'online' && (
          <SafeImage img={{ id: m.id, url: m.url, title: m.title, sourceName: m.sourceName, sourceUrl: m.sourceUrl, kind: m.authenticity === 'real' ? 'archival' : 'artistic' }} className="aspect-video w-full" />
        )}
        <MediaIDCard m={m} />
      </DialogContent>
    </Dialog>
  )
}

export function ArchiveView({ go }: { go: (v: string, p?: string) => void }) {
  const [q, setQ] = useState('')
  const [type, setType] = useState('all')
  const [country, setCountry] = useState('all')
  const [open, setOpen] = useState<MediaItem | null>(null)

  const all = useMemo(() => [...MEDIA_ITEMS, ...VIDEO_ITEMS], [])
  const norm = (s: string) => s.replace(/[أإآ]/g, 'ا').replace(/ی/g, 'ي').replace(/\u200c/g, ' ')
  const filtered = useMemo(() => {
    const nq = norm(q.trim())
    return all.filter(m => {
      if (type === 'photo' && m.type !== 'photo') return false
      if (type === 'video' && m.type !== 'video') return false
      if (type === 'pending' && m.verification === 'confirmed') return false
      if (country !== 'all') {
        const c = m.id.startsWith('m-iq') || m.tags.includes('iraq-side') ? 'iraq' : m.tags.includes('saddam-dossier') ? 'iraq' : 'iran'
        if (c !== country) return false
      }
      if (nq && !norm(m.title + m.desc + (m.people ?? []).join() + m.sourceName + m.tags.join()).includes(nq)) return false
      return true
    })
  }, [all, q, type, country])

  const stats = {
    total: all.length,
    photos: MEDIA_ITEMS.length,
    videos: VIDEO_ITEMS.length,
    confirmed: all.filter(m => m.verification === 'confirmed').length,
    pending: all.filter(m => m.verification === 'pending-review').length,
    unverified: all.filter(m => m.verification === 'unverified-origin').length,
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        kicker="فاز ۲ — بخش دوم و هشتم"
        title="آرشیو جامع چندرسانه‌ای جنگ"
        desc="تمام رسانه‌های ثبت‌شده در موزه با «شناسنامه رسانه» کامل: منبع، مجوز، اصالت، وضعیت بررسی کارشناسی و برچسب واقعی/بازسازی‌شده. دسترسی به تصویر در اینترنت به معنی مجوز بازنشر نیست؛ موارد دارای حق نشر با پیوند منبع معرفی می‌شوند."
      />

      {/* آمار اعتبارسنجی */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
        {[
          { l: 'کل رسانه‌ها', v: stats.total, tone: 'text-primary' },
          { l: 'عکس آرشیوی', v: stats.photos, tone: '' },
          { l: 'فیلم/سند', v: stats.videos, tone: '' },
          { l: 'تأیید کارشناسی', v: stats.confirmed, tone: 'text-emerald-400' },
          { l: 'در انتظار تأیید', v: stats.pending, tone: 'text-amber-500' },
          { l: 'تاریخ/منشأ نامشخص', v: stats.unverified, tone: 'text-rose-400' },
        ].map(s => (
          <Card key={s.l}><CardContent className="p-3 text-center">
            <div className="text-[11px] font-bold text-muted-foreground">{s.l}</div>
            <div className={`text-xl font-extrabold ${s.tone || 'text-foreground'}`}>{toFa(s.v)}</div>
          </CardContent></Card>
        ))}
      </div>

      {/* قواعد ممنوعیت تصاویر جعلی */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs leading-6">
        <div className="mb-1 text-sm font-extrabold text-amber-500">قواعد بخش ۸ — مدیریت آرشیو و اعتبارسنجی</div>
        <ul className="list-disc space-y-1 pr-5">
          <li>تصویر تولیدشده با هوش مصنوعی هرگز به‌عنوان عکس تاریخی نمایش داده نمی‌شود.</li>
          <li>عکس‌های جنگ‌های دیگر به جنگ ایران و عراق نسبت داده نمی‌شوند؛ هر رسانه پیش از جانمایی در صفحه عملیات، ارتباط تاریخی بررسی می‌شود.</li>
          <li>تصاویر فاقد تاریخ و منبع با برچسب «تاریخ و منشأ نامشخص» مشخص می‌شوند و رقم اطمینان آن‌ها C است.</li>
          <li>از حذف واترمارک و نشانه مالکیت خودداری می‌شود؛ شرایط استفاده هر آرشیو در فهرست آرشیوها ثبت است.</li>
        </ul>
      </div>

      {/* فیلترها */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border bg-card/60 p-3">
        <Input value={q} onChange={e => setQ(e.target.value)} placeholder="جست‌وجو در آرشیو (عنوان، اشخاص، منبع…)" className="w-56 text-sm" />
        <select value={type} onChange={e => setType(e.target.value)} className="rounded-lg border bg-background px-2 py-1.5 text-xs font-bold">
          <option value="all">همه انواع</option>
          <option value="photo">عکس</option>
          <option value="video">فیلم</option>
          <option value="pending">در انتظار تأیید کارشناسی</option>
        </select>
        <select value={country} onChange={e => setCountry(e.target.value)} className="rounded-lg border bg-background px-2 py-1.5 text-xs font-bold">
          <option value="all">همه منابع</option>
          <option value="iran">منابع ایرانی</option>
          <option value="iraq">منابع عراقی/دشمن</option>
        </select>
        <span className="mr-auto text-xs font-bold text-muted-foreground">{toFa(filtered.length)} مورد</span>
      </div>

      {/* گالری رسانه‌ها */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(m => (
          <Card key={m.id} className="museum-card overflow-hidden">
            {m.url && m.type === 'photo' && m.availability === 'online' ? (
              <SafeImage img={{ id: m.id, url: m.url, title: m.title, sourceName: m.sourceName, sourceUrl: m.sourceUrl, kind: m.authenticity === 'real' ? 'archival' : 'artistic' }} className="aspect-video w-full" />
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-xl border-b bg-muted/40 p-4 text-center text-xs text-muted-foreground">
                {m.type === 'video' ? '🎬 ' : '📄 '}{MEDIA_AVAILABILITY_LABELS[m.availability]} — {m.sourceName}
              </div>
            )}
            <CardContent className="p-3">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-extrabold leading-6">{m.title}</h4>
                <MediaBadge m={m} />
              </div>
              <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{m.desc}</p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <Badge variant="outline" className="text-[10px]">{m.captureLabel ?? 'تاریخ و منشأ نامشخص'}</Badge>
                {m.opIds?.slice(0, 1).map(id => (
                  <Badge key={id} variant="outline" className="cursor-pointer text-[10px] hover:border-primary" onClick={() => go('operations', id)}>⚔ {OPERATIONS.find(o => o.id === id)?.faName}</Badge>
                ))}
              </div>
              <Button size="sm" variant="outline" onClick={() => setOpen(m)} className="mt-2 w-full text-xs font-bold">شناسنامه رسانه</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* فهرست آرشیوها و شرایط استفاده (بخش ۲.۲ و ۲.۳) */}
      <section>
        <SectionHeader kicker="راهنمای آرشیو" title="آرشیوهای ایرانی، عراقی و بین‌المللی و شرایط استفاده" desc="هدف، شناسایی حداکثری آرشیوهای موجود است؛ استخراج مرحله‌بندی‌شده در ادامه توسعه ادامه دارد." />
        <div className="grid gap-3 md:grid-cols-2">
          {(['iran', 'iraq', 'international'] as const).map(c => (
            <div key={c} className="space-y-2">
              <h4 className="text-sm font-extrabold text-primary">{c === 'iran' ? '🇮🇷 منابع ایرانی' : c === 'iraq' ? '🇮🇶 منابع عراقی' : '🌍 منابع بین‌المللی'}</h4>
              {ARCHIVE_DIRECTORIES.filter(a => a.country === c).map(a => (
                <Card key={a.id}><CardContent className="p-3">
                  <div className="text-sm font-extrabold">{a.name}</div>
                  <p className="mt-1 text-[11px] leading-5 text-muted-foreground">دسترسی: {a.accessNote}</p>
                  <p className="text-[11px] leading-5 text-muted-foreground">شرایط استفاده: {a.usageTerms}</p>
                  {a.url && <a href={a.url} target="_blank" rel="noreferrer" className="mt-1 inline-block text-[11px] font-bold text-primary underline">سامانه آرشیو ↗</a>}
                </CardContent></Card>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* گزارش مجوزها و موارد فاقد سند (بخش ۱۰) */}
      <section>
        <SectionHeader kicker="گزارش شفافیت" title="گزارش منابع، مجوزها و موارد فاقد سند" />
        <div className="grid gap-3 md:grid-cols-2">
          <Card><CardContent className="p-4">
            <h4 className="mb-2 font-extrabold text-primary">وضعیت مجوز رسانه‌ها</h4>
            <ul className="list-disc space-y-1.5 pr-5 text-xs leading-6 text-muted-foreground">
              <li>{toFa(all.filter(m => m.license === 'archival-reference').length)} مورد: نمایش آرشیوی با ارجاع به منبع (برای استفاده تجاری مجوز بررسی شود).</li>
              <li>{toFa(all.filter(m => m.license === 'rights-reserved').length)} مورد: دارای حق نشر — فقط معرفی و پیوند رسمی، بدون بازنشر.</li>
              <li>{toFa(all.filter(m => m.license === 'public').length)} مورد: مجوز آزاد.</li>
            </ul>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <h4 className="mb-2 font-extrabold text-primary">موارد فاقد سند یا دارای اختلاف (اعلام صریح)</h4>
            <ul className="list-disc space-y-1.5 pr-5 text-xs leading-6 text-muted-foreground">
              <li>فیلم اصلی جلسات شورای فرماندهی انقلاب عراق در دسترس عمومی نیست — صریحاً اعلام می‌شود و جایگزین نامرتبط قرار نمی‌گیرد.</li>
              <li>تصاویر «م-فر-مارش» و «م-فر-آر پی جی» فاقد تاریخ و منبع دقیق‌اند و با برچسب شفاف ثبت شده‌اند.</li>
              <li>پرتره شهید جهان‌آرا در انتظار تطبیق نهایی با آرشیو بنیاد شهید است.</li>
              <li>شناسه قسمت‌های روایت فتح در انتظار استخراج آرشیوی از حوزه هنری است.</li>
            </ul>
          </CardContent></Card>
        </div>
        <div className="mt-4"><SourceChips ids={['defa-center', 'hafiz-hozeh', 'irna-archive', 'intl-agencies', 'saddam-records']} /></div>
      </section>

      <MediaDialog m={open} onClose={() => setOpen(null)} />
    </div>
  )
}
