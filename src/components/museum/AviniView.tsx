'use client'

import { useState } from 'react'
import { AVINI_PROFILE, RAVAYAT_FATH, RAVAYAT_FATH_UX } from '@/data/avini'
import { MEDIA_ITEMS, VIDEO_ITEMS, MEDIA_VERIFICATION_LABELS } from '@/data/media-registry'
import { OPERATIONS } from '@/data/operations'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SectionHeader, SourceChips, SafeImage } from './ui-bits'

/** بخش سوم فاز ۲ — آرشیو ویژه شهید سید مرتضی آوینی و روایت فتح */
export function AviniView({ go }: { go: (v: string, p?: string) => void }) {
  const [opFilter, setOpFilter] = useState('all')
  const portrait = MEDIA_ITEMS.find(m => m.id === 'm-avini-portrait')
  const cameraman = MEDIA_ITEMS.find(m => m.id === 'm-avini-cam')
  const links = RAVAYAT_FATH.filter(rf => opFilter === 'all' || rf.opIds.includes(opFilter))

  return (
    <div className="space-y-8">
      <section className="hero-vignette rounded-3xl border p-6 md:p-10">
        <Badge variant="outline" className="mb-3">فصل جدید فاز ۲ — آرشیو ویژه</Badge>
        <h1 className="museum-title text-2xl font-extrabold leading-tight md:text-4xl">{RAVAYAT_FATH_UX.title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
          مجموعه مستندهای روایت فتح و آثار شهید سید مرتضی آوینی، با اطلاعات تولید، عملیات‌های مرتبط،
          نقشه محل تصویربرداری و منابع تکمیلی. نمایش ویدیو فقط از منبع مجاز انجام می‌شود.
        </p>
      </section>

      {/* پرونده شهید آوینی */}
      <section className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <Card>
          <CardContent className="p-4">
            {portrait && portrait.url && (
              <SafeImage img={{ id: portrait.id, url: portrait.url, title: portrait.title, sourceName: portrait.sourceName, sourceUrl: portrait.sourceUrl, kind: 'archival' }} className="aspect-[3/4] w-full" />
            )}
            <div className="mt-3 space-y-1 text-xs leading-6">
              <div><span className="font-extrabold">تولد: </span>{AVINI_PROFILE.birth}</div>
              <div><span className="font-extrabold">شهادت: </span>{AVINI_PROFILE.martyrdom}</div>
              <div><span className="font-extrabold">نقش جنگ: </span>{AVINI_PROFILE.warRole}</div>
            </div>
            {cameraman && cameraman.url && (
              <SafeImage img={{ id: cameraman.id, url: cameraman.url!, title: cameraman.title, sourceName: cameraman.sourceName, sourceUrl: cameraman.sourceUrl, kind: 'archival', note: 'تصویر نمادین کار با دوربین در جبهه' }} className="mt-3 aspect-video w-full" />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="space-y-3 text-sm leading-8 text-justify">
              {AVINI_PROFILE.bio.map((b, i) => <p key={i}>{b}</p>)}
            </div>
            <h4 className="mt-5 mb-2 text-sm font-extrabold text-primary">آثار و میراث</h4>
            <div className="grid gap-2 md:grid-cols-2">
              {AVINI_PROFILE.works.map((w, i) => (
                <div key={i} className="rounded-lg border bg-card/60 p-3 text-xs leading-6">
                  <div className="font-extrabold">{w.title} <Badge variant="outline" className="text-[10px]">{w.kind}</Badge></div>
                  <div className="text-muted-foreground">{w.note}</div>
                </div>
              ))}
            </div>
            <div className="mt-4"><SourceChips ids={AVINI_PROFILE.sources} /></div>
          </CardContent>
        </Card>
      </section>

      {/* ارتباط مستند با عملیات (بخش ۳.۲) */}
      <section>
        <SectionHeader kicker="ارتباط مستند با عملیات" title="نقشه اتصال روایت فتح به جبهه‌ها" desc="هر قسمت مستند به عملیات و دوره تاریخی مرتبط متصل است؛ اگر مستندی درباره والفجر ۸ باشد، در صفحه همان عملیات هم نمایش داده می‌شود." />
        <div className="mb-3 flex flex-wrap gap-2">
          <button onClick={() => setOpFilter('all')} className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${opFilter === 'all' ? 'border-primary bg-primary/15 text-primary' : 'border-border bg-card/60'}`}>همه</button>
          {['valfajr-8', 'kheibar', 'bayt-almoghaddas', 'karbala-4', 'karbala-5', 'badr-63'].map(id => {
            const op = OPERATIONS.find(o => o.id === id)
            return (
              <button key={id} onClick={() => setOpFilter(id)} className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${opFilter === id ? 'border-primary bg-primary/15 text-primary' : 'border-border bg-card/60'}`}>{op?.faName ?? id}</button>
            )
          })}
        </div>
        <div className="space-y-3">
          {links.map(rf => (
            <Card key={rf.id}><CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold">🎬 {rf.topic}</span>
                <Badge variant="outline" className={`text-[10px] ${rf.episodeStatus === 'identified' ? 'text-emerald-400' : 'text-amber-500'}`}>
                  {rf.episodeStatus === 'identified' ? 'شناسه‌گذاری‌شده' : 'در انتظار استخراج آرشیوی'}
                </Badge>
                {rf.episodeLabel && <span className="text-[11px] text-muted-foreground">{rf.episodeLabel}</span>}
              </div>
              <p className="mt-1.5 text-xs leading-6 text-justify text-muted-foreground">{rf.note}</p>
              {rf.opIds.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {rf.opIds.map(id => {
                    const op = OPERATIONS.find(o => o.id === id)
                    return op ? <Badge key={id} variant="outline" className="cursor-pointer text-[10px] hover:border-primary" onClick={() => go('operations', id)}>⚔ {op.faName}</Badge> : null
                  })}
                </div>
              )}
            </CardContent></Card>
          ))}
        </div>
      </section>

      {/* تجربه کاربری و حقوق انتشار */}
      <section className="grid gap-4 lg:grid-cols-2">
        <Card><CardContent className="p-4">
          <h4 className="mb-2 font-extrabold text-primary">امکانات این آرشیو</h4>
          <ul className="list-disc space-y-1.5 pr-5 text-xs leading-6 text-muted-foreground">
            {RAVAYAT_FATH_UX.features.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <h4 className="mb-2 font-extrabold text-primary">حقوق انتشار</h4>
          <p className="text-xs leading-6 text-justify text-muted-foreground">{RAVAYAT_FATH_UX.rightsNote}</p>
          <div className="mt-2 rounded-lg bg-muted/50 p-2 text-[11px] leading-5">
            وضعیت نمایش مجموعه: <span className="font-extrabold text-amber-500">{MEDIA_VERIFICATION_LABELS['confirmed']} (آرشیو رسمی حوزه هنری) — بازنشر کامل ممنوع؛ پیوند رسمی</span>
          </div>
          <Button size="sm" variant="outline" className="mt-3" onClick={() => go('archive')} >شناسنامه رسانه‌ها و شرایط استفاده</Button>
        </CardContent></Card>
      </section>

      {/* ویدیوی مجموعه */}
      <section>
        <SectionHeader kicker="نمایش" title="وضعیت ویدیوهای مجموعه" desc="جایی که اجازه انتشار نیست، مشخصات آرشیوی و پیوند منبع رسمی نمایش داده می‌شود؛ هیچ قسمتی با فیلم جایگزین پر نمی‌شود." />
        {VIDEO_ITEMS.filter(v => v.tags.includes('avini')).map(v => (
          <Card key={v.id}><CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-extrabold">🎬 {v.title}</span>
              <Badge variant="outline" className="text-[10px]">{v.availability === 'link-only' ? 'پیوند به منبع رسمی' : '—'}</Badge>
            </div>
            <p className="mt-1.5 text-xs leading-6 text-muted-foreground">{v.desc}</p>
            {v.displayNote && <p className="mt-2 rounded-lg bg-sky-500/10 p-2 text-[11px] leading-5 text-sky-300">ℹ {v.displayNote}</p>}
            {v.sourceUrl && <a href={v.sourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-bold text-primary underline">منبع رسمی آرشیو ↗</a>}
          </CardContent></Card>
        ))}
      </section>
    </div>
  )
}
