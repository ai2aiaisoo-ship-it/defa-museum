'use client'

import { SADDAM_DOSSIER, SADDAM_POLICIES } from '@/data/saddam'
import { VIDEO_ITEMS, MEDIA_ITEMS, MEDIA_AVAILABILITY_LABELS } from '@/data/media-registry'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { MediaIDCard } from './ArchiveView'
import { SectionHeader, SourceChips } from './ui-bits'

/** بخش ۲.۴ فاز ۲ — پرونده ویژه مستندسازی روند تصمیم‌گیری حکومت صدام */
export function SaddamView({ go }: { go: (v: string, p?: string) => void }) {
  const media = (ids: string[]) => [...VIDEO_ITEMS, ...MEDIA_ITEMS].filter(m => ids.includes(m.id))
  return (
    <div className="space-y-8">
      <section className="hero-vignette rounded-3xl border p-6 md:p-10">
        <Badge variant="outline" className="mb-3">پرونده ویژه فاز ۲</Badge>
        <h1 className="museum-title text-2xl font-extrabold leading-tight md:text-4xl">تصمیم صدام حسین برای حمله به ایران</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
          مستندسازی روند تصمیم‌گیری حکومت صدام درباره حمله به ایران: جلسات شورای فرماندهی انقلاب، سخنرانی‌های پیش از جنگ،
          اعلام لغو یک‌جانبه توافق الجزایر در ۲۶ شهریور ۱۳۵۹، و فیلم‌های آغاز تهاجم در ۳۱ شهریور — با بررسی اصالت،
          تاریخ و زمینه انتشار هر سند.
        </p>
      </section>

      {/* سیاست راستی‌آزمایی فیلم */}
      <section className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
        <div className="mb-2 text-sm font-extrabold text-amber-500">قاعده راستی‌آزمایی فیلم‌های این پرونده</div>
        <ul className="list-disc space-y-1.5 pr-5 text-xs leading-6">
          {SADDAM_POLICIES.verificationPolicy.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
      </section>

      {/* پرونده اسناد */}
      <section>
        <SectionHeader kicker="پرونده اسناد" title="مسیر تصمیم — چهار مرحله مستند" />
        <div className="space-y-4">
          {SADDAM_DOSSIER.map((d, i) => (
            <Card key={d.id}>
              <CardContent className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/15 text-sm font-extrabold text-primary">{i + 1}</span>
                  <h3 className="text-base font-extrabold">{d.title}</h3>
                </div>
                <div className="mt-3 grid gap-x-6 gap-y-1 text-xs leading-6 md:grid-cols-2">
                  <div><span className="font-bold text-muted-foreground">تاریخ ثبت: </span>{d.captureLabel}</div>
                  <div><span className="font-bold text-muted-foreground">تاریخ انتشار: </span>{d.publishLabel}</div>
                  <div><span className="font-bold text-muted-foreground">مکان: </span>{d.place}</div>
                  <div><span className="font-bold text-muted-foreground">اشخاص حاضر: </span>{d.people.join('، ')}</div>
                  <div className="md:col-span-2"><span className="font-bold text-muted-foreground">موضوع: </span>{d.subject}</div>
                  <div className="md:col-span-2"><span className="font-bold text-muted-foreground">منبع اصلی: </span>{d.sourceName}</div>
                  <div className="md:col-span-2"><span className="font-bold text-muted-foreground">میزان اصالت و اعتبار: </span>{d.authenticity}</div>
                  <div className="md:col-span-2"><span className="font-bold text-muted-foreground">ارتباط با روند تاریخی جنگ: </span>{d.historicalLink}</div>
                </div>
                <div className="mt-3 space-y-2">
                  {media(d.mediaIds).map(m => (
                    <div key={m.id} className="rounded-lg border bg-card/60 p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm font-bold">{m.type === 'video' ? '🎬' : '📷'} {m.title}</span>
                        <Badge variant="outline" className="text-[10px]">{MEDIA_AVAILABILITY_LABELS[m.availability]}</Badge>
                      </div>
                      {m.displayNote && <p className="mt-1.5 rounded bg-sky-500/10 p-2 text-[11px] leading-5 text-sky-300">ℹ {m.displayNote}</p>}
                      <Accordion type="single" collapsible className="mt-1">
                        <AccordionItem value={m.id}>
                          <AccordionTrigger className="text-xs font-bold">شناسنامه رسانه</AccordionTrigger>
                          <AccordionContent><MediaIDCard m={m} /></AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* بررسی اسناد و روایت‌های تاریخی */}
      <section>
        <SectionHeader kicker="سطح ج" title="بررسی اسناد و روایت‌های تاریخی" desc="روایت ایران، روایت بعث و سنجش اسناد — از هم تفکیک و هر سه ثبت شده‌اند." />
        <div className="grid gap-3 md:grid-cols-3">
          {SADDAM_POLICIES.narrativeDiff.map((n, i) => (
            <div key={i} className={`rounded-xl border p-4 text-xs leading-6 ${i === 0 ? 'border-teal-500/40 bg-teal-500/10' : i === 1 ? 'border-amber-500/40 bg-amber-500/10' : 'border-sky-500/40 bg-sky-500/10'}`}>
              <div className="mb-1.5 text-sm font-extrabold">{n.side}</div>
              <p className="text-justify">{n.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => go('roots')} className="font-bold">فصل ریشه‌های جنگ</Button>
        <Button variant="outline" onClick={() => go('operations', 'iraq-invasion')} className="font-bold">پرونده تهاجم سراسری عراق</Button>
        <Button variant="outline" onClick={() => go('archive')} className="font-bold">آرشیو چندرسانه‌ای</Button>
      </div>
      <div><SourceChips ids={SADDAM_POLICIES.sources} /></div>
    </div>
  )
}
