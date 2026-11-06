'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { CONFIDENCE_LABELS, SIDE_LABELS, RESULT_LABELS, STATUS_LABELS } from '@/data/operations'
import { getSource, SOURCES } from '@/data/sources'
import type { StatClaim, OperationResult, ContentStatus, GalleryImage } from '@/data/types'
import { useState } from 'react'
import { formatJalali } from '@/lib/jalali'

export function SectionHeader({ kicker, title, desc }: { kicker?: string; title: string; desc?: string }) {
  return (
    <div className="mb-6">
      {kicker && <div className="text-xs font-bold tracking-widest text-primary mb-2">{kicker}</div>}
      <h2 className="museum-title text-2xl md:text-3xl">{title}</h2>
      {desc && <p className="text-muted-foreground mt-2 max-w-3xl leading-7">{desc}</p>}
    </div>
  )
}

export function ConfidenceBadge({ c }: { c: 'A' | 'B' | 'C' }) {
  const info = CONFIDENCE_LABELS[c]
  return (
    <span className={`conf-${c} inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold`}>
      {c === 'A' ? '●' : c === 'B' ? '◐' : '○'} {info.label}
    </span>
  )
}

export function ResultBadge({ r }: { r: OperationResult }) {
  const tones: Record<string, string> = {
    clear_victory: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    limited_success: 'bg-lime-500/15 text-lime-400 border-lime-500/30',
    costly_success: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    mixed: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
    failure: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    halted: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    defensive_success: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
    defensive_failure: 'bg-red-500/15 text-red-400 border-red-500/30',
  }
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${tones[r] ?? tones.mixed}`}>{RESULT_LABELS[r]}</span>
}

export function StatusBadge({ s }: { s: ContentStatus }) {
  const tone = s === 'published' ? 'bg-primary/15 text-primary border-primary/30' : 'bg-muted text-muted-foreground border-border'
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold border ${tone}`}>{STATUS_LABELS[s]}</span>
}

export function SideBadge({ side }: { side: string }) {
  const tones: Record<string, string> = {
    iran: 'bg-teal-600/15 text-teal-300 border-teal-600/40',
    iraq: 'bg-amber-700/20 text-amber-300 border-amber-700/40',
    mek: 'bg-rose-600/15 text-rose-300 border-rose-600/40',
    us: 'bg-sky-700/20 text-sky-300 border-sky-700/40',
    israel: 'bg-indigo-700/20 text-indigo-300 border-indigo-700/40',
    other: 'bg-muted text-muted-foreground border-border',
  }
  return <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-bold border ${tones[side] ?? tones.other}`}>{SIDE_LABELS[side] ?? side}</span>
}

/** جدول آمار ادعایی یک عملیات — هر ردیف یک ادعای منبع‌دار */
export function StatClaimsTable({ claims }: { claims: StatClaim[] }) {
  if (!claims.length)
    return (
      <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
        آمار قابل اتکا یافت نشد — برای این موضوع عدد مستندی در منابع موجود نیست و موزه عددی تولید نمی‌کند.
      </div>
    )
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead className="bg-muted/60 text-xs text-muted-foreground">
          <tr>
            <th className="p-3 text-right font-bold">شاخص</th>
            <th className="p-3 text-right font-bold">مقدار گزارش‌شده</th>
            <th className="p-3 text-right font-bold">طرف</th>
            <th className="p-3 text-right font-bold">دوره / منطقه</th>
            <th className="p-3 text-right font-bold">منبع و روش</th>
            <th className="p-3 text-right font-bold">اطمینان</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {claims.map(c => {
            const src = getSource(c.sourceId)
            return (
              <tr key={c.id} className="align-top">
                <td className="p-3 font-bold whitespace-nowrap">{c.metric}</td>
                <td className="p-3">
                  <div className="font-extrabold">{c.value}</div>
                  <div className="text-[11px] text-muted-foreground">{c.unit}</div>
                </td>
                <td className="p-3"><SideBadge side={c.side} /></td>
                <td className="p-3 text-xs text-muted-foreground">{c.period}<br />{c.region}</td>
                <td className="p-3 text-xs">
                  {src ? <span className="font-bold">{src.faTitle}</span> : c.sourceId}
                  <div className="text-muted-foreground mt-1">{c.method}</div>
                  {c.note && <div className="text-amber-500/90 mt-1">⚠ {c.note}</div>}
                </td>
                <td className="p-3"><ConfidenceBadge c={c.confidence} /></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function SourceChips({ ids }: { ids: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {ids.map(id => {
        const s = getSource(id)
        if (!s) return null
        return (
          <a key={id} href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border bg-muted/50 px-2.5 py-1 text-xs hover:border-primary/50 transition-colors">
            <span className="font-bold">{s.faTitle.length > 60 ? s.faTitle.slice(0, 60) + '…' : s.faTitle}</span>
            <ConfidenceBadge c={s.reliability} />
          </a>
        )
      })}
    </div>
  )
}

/** تصویر با جایگزین امن (اگر لینک آرشیو در دسترس نبود) */
export function SafeImage({ img, className }: { img: GalleryImage; className?: string }) {
  const [err, setErr] = useState(false)
  return (
    <figure className="relative">
      {err ? (
        <div className={`flex items-center justify-center rounded-xl border border-dashed bg-muted/40 text-center text-xs text-muted-foreground p-6 ${className ?? ''}`}>
          تصویر آرشیوی «{img.title}» — منبع: {img.sourceName}
          {img.sourceUrl && <a className="block text-primary underline mt-1" href={img.sourceUrl} target="_blank" rel="noreferrer">مشاهده در منبع اصلی</a>}
        </div>
      ) : (
        <img src={img.url} alt={img.title} loading="lazy" onError={() => setErr(true)} className={`rounded-xl object-cover ${className ?? ''}`} />
      )}
      <figcaption className="mt-1.5 text-[11px] text-muted-foreground leading-5">
        {img.kind === 'archival' ? '📷 تصویر آرشیوی' : img.kind === 'artistic' ? '🎨 بازسازی هنری (سند تاریخی نیست)' : '🗺 نقشه'} — {img.title} | منبع: {img.sourceName}
      </figcaption>
    </figure>
  )
}

export function StoryBlock({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="space-y-4 leading-8 text-[15px]">
      {paragraphs.map((p, i) => <p key={i} className="text-justify">{p}</p>)}
    </div>
  )
}
