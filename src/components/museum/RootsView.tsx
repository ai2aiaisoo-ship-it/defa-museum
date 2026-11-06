'use client'

import { useMemo, useState } from 'react'
import { ROOT_PERIODS, ROOTS_FRAMEWORK, TREATIES, MONTHS_1359, INVASION_DAY, getTreaty } from '@/data/roots'
import { MEDIA_ITEMS } from '@/data/media-registry'
import { formatJalali, toFa } from '@/lib/jalali'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { SafeImage, SectionHeader, SourceChips, ConfidenceBadge } from './ui-bits'

type Level = 'narrative' | 'evidence' | 'review'

const LEVEL_TONES: Record<Level, string> = {
  narrative: 'border-teal-500/40 bg-teal-500/10 text-teal-300',
  evidence: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
  review: 'border-amber-500/40 bg-amber-500/10 text-amber-500',
}

/** برچسب سه‌سطحی روایت/سند/بررسی — در تمام فصل ریشه‌ها تکرار می‌شود */
export function LevelTag({ level, label }: { level: Level; label: string }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-extrabold ${LEVEL_TONES[level]}`}>
      {label}
    </span>
  )
}

function MediaStrip({ tags }: { tags: string[] }) {
  const imgs = useMemo(() => MEDIA_ITEMS.filter(m => tags.some(t => m.tags.includes(t)) && m.url), [tags])
  if (!imgs.length) return null
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {imgs.slice(0, 4).map(m => (
        <SafeImage key={m.id} img={{ id: m.id, url: m.url!, title: m.title, sourceName: m.sourceName, sourceUrl: m.sourceUrl, kind: m.authenticity === 'real' ? 'archival' : 'artistic', note: m.captureLabel }} className="aspect-video w-full" />
      ))}
    </div>
  )
}

function TreatyCard({ id, onOpen }: { id: string; onOpen: (t: string) => void }) {
  const t = getTreaty(id)
  if (!t) return null
  return (
    <Card className="museum-card cursor-pointer" onClick={() => onOpen(t.id)}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-lg font-extrabold text-primary">{t.faName}</h4>
          <Badge variant="outline" className="font-extrabold">{t.yearLabel}</Badge>
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground" dir="ltr">{t.enName}</p>
        <p className="mt-2 text-xs leading-6 text-muted-foreground">{t.dateLabel} • {t.parties}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-[10px]">اروندرود: {t.arvandStatus.length > 60 ? t.arvandStatus.slice(0, 60) + '…' : t.arvandStatus}</Badge>
          <ConfidenceBadge c={t.confidence} />
          <span className="text-[11px] font-bold text-primary">پرونده کامل ←</span>
        </div>
      </CardContent>
    </Card>
  )
}

function TreatyDialog({ id, onClose }: { id: string | null; onClose: () => void }) {
  const t = id ? getTreaty(id) : null
  if (!t) return null
  return (
    <Dialog open={!!id} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="text-right text-xl font-extrabold text-primary">
            {t.faName} <span className="text-xs font-normal text-muted-foreground">({t.yearLabel})</span>
          </DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground" dir="ltr">{t.enName}</p>
        <div className="rounded-lg border bg-muted/40 p-3 text-xs leading-6">{t.dateLabel} — {t.parties}</div>
        <div className="space-y-3 text-sm leading-7 text-justify">
          {t.context.map((c, i) => <p key={i}>{c}</p>)}
        </div>
        <h4 className="text-sm font-extrabold text-primary">مفاد اصلی</h4>
        <div className="space-y-2">
          {t.clauses.map((c, i) => (
            <div key={i} className="rounded-lg border bg-card/60 p-3 text-sm leading-7">
              <div className="font-extrabold">{c.title}</div>
              <div className="text-justify text-muted-foreground">{c.text}</div>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm leading-7">
          <span className="font-extrabold">وضعیت اروندرود: </span>{t.arvandStatus}
        </div>
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm leading-7">
          <LevelTag level="review" label="بررسی اسناد و روایت‌های تاریخی" />
          <ul className="mt-2 list-disc space-y-1.5 pr-5">
            {t.disputes.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
        </div>
        <p className="text-sm leading-7"><span className="font-extrabold text-primary">میراث تاریخی: </span>{t.legacy}</p>
        <SourceChips ids={t.sources} />
      </DialogContent>
    </Dialog>
  )
}

function PeriodSection({ periodId, onTreaty }: { periodId: string; onTreaty: (t: string) => void }) {
  const p = ROOT_PERIODS.find(r => r.id === periodId)!
  return (
    <section id={p.id} className="scroll-mt-24 space-y-5">
      <div className="rounded-3xl border bg-card/50 p-5 md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="font-extrabold">دوره {toFa(p.index)}</Badge>
          <Badge variant="outline" className="font-bold">{p.span}</Badge>
        </div>
        <h3 className="mt-3 text-xl font-extrabold md:text-2xl">{p.title}</h3>
        <div className="mt-4 space-y-3 leading-8 text-[15px] text-justify">
          {p.intro.map((t, i) => <p key={i}><LevelTag level="narrative" label="روایت اصلی" /> {t}</p>)}
        </div>
        {p.themes.length > 0 && (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {p.themes.map((th, i) => (
              <div key={i} className="rounded-xl border bg-card/70 p-4">
                <div className="text-sm font-extrabold text-primary">{th.title}</div>
                <p className="mt-1.5 text-xs leading-6 text-justify text-muted-foreground">{th.text}</p>
              </div>
            ))}
          </div>
        )}
        {p.timeline.length > 0 && (
          <div className="mt-6">
            <div className="mb-3 text-sm font-extrabold">خط زمانی تحولات</div>
            <div className="relative space-y-4 border-r-2 border-primary/40 pr-5">
              {p.timeline.map((e, i) => (
                <div key={i} className="relative">
                  <span className="absolute -right-[27px] top-1.5 h-3 w-3 rounded-full bg-primary" />
                  <Badge variant="outline" className="font-extrabold">{e.date}</Badge>
                  <div className="mt-1 text-sm font-bold">{e.title}</div>
                  <p className="text-xs leading-6 text-muted-foreground">{e.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {p.figures && p.figures.length > 0 && (
          <div className="mt-5 grid gap-2 md:grid-cols-3">
            {p.figures.map((f, i) => (
              <div key={i} className="rounded-xl border bg-muted/30 p-3 text-xs leading-6">
                <div className="font-extrabold">{f.name}</div>
                <div className="text-muted-foreground">{f.role}</div>
                <div className="mt-1">{f.note}</div>
              </div>
            ))}
          </div>
        )}
        {p.treatyIds && p.treatyIds.length > 0 && (
          <div className="mt-5">
            <div className="mb-3 text-sm font-extrabold">معاهده‌های این دوره — برای هر معاهده پرونده مستقل</div>
            <div className="grid gap-3 md:grid-cols-2">
              {p.treatyIds.map(tid => <TreatyCard key={tid} id={tid} onOpen={onTreaty} />)}
            </div>
          </div>
        )}
        <div className="mt-5"><MediaStrip tags={['roots', 'algiers']} /></div>
        <div className="mt-4"><SourceChips ids={p.sourceIds} /></div>
      </div>
    </section>
  )
}

function MonthsView() {
  const [mi, setMi] = useState(0)
  const m = MONTHS_1359[mi]
  return (
    <section id="r-months" className="scroll-mt-24 space-y-5">
      <SectionHeader kicker="دوره چهارم" title="ماه‌های منتهی به آغاز جنگ؛ فروردین تا شهریور ۱۳۵۹" desc="میان وقوع یک حادثه مرزی، ادعای سیاسی درباره آن و تصمیم نظامی گسترده تفکیک می‌شود — ماه‌به‌ماه." />
      <div className="mb-4 flex flex-wrap gap-2">
        {MONTHS_1359.map((mm, i) => (
          <button key={mm.month} onClick={() => setMi(i)} className={`rounded-xl border px-3.5 py-2 text-xs font-extrabold transition-colors ${mi === i ? 'border-primary bg-primary/15 text-primary' : 'border-border bg-card/60'}`}>
            {mm.month}
          </button>
        ))}
      </div>
      <Card>
        <CardContent className="p-5">
          <h4 className="text-lg font-extrabold text-primary">{m.month} — {m.headline}</h4>
          <div className="relative mt-4 space-y-4 border-r-2 border-primary/40 pr-5">
            {m.items.map((it, i) => (
              <div key={i} className="relative">
                <span className="absolute -right-[27px] top-1.5 h-3 w-3 rounded-full bg-primary" />
                {it.day && <Badge variant="outline" className="mb-1 font-extrabold">{it.day}</Badge>}
                <p className="text-sm leading-7 text-justify">{it.text}</p>
              </div>
            ))}
          </div>
          {m.note && (
            <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs leading-6">
              <span className="font-extrabold">تفکیک حادثه از تصمیم: </span>{m.note}
            </div>
          )}
          <div className="mt-4 flex gap-2">
            <Button size="sm" variant="outline" disabled={mi === 0} onClick={() => setMi(i => i - 1)}>→ ماه قبل</Button>
            <Button size="sm" variant="outline" disabled={mi === MONTHS_1359.length - 1} onClick={() => setMi(i => i + 1)}>ماه بعد ←</Button>
          </div>
        </CardContent>
      </Card>
      <MediaStrip tags={['invasion', 'iraq-side']} />
    </section>
  )
}

function InvasionDayView({ go }: { go: (v: string, p?: string) => void }) {
  return (
    <section id="r-invasion" className="scroll-mt-24 space-y-5">
      <div className="hero-vignette rounded-3xl border p-6 md:p-10">
        <Badge variant="outline" className="mb-3">فصل نهایی پیشینه — نقطه اتصال به فصل اصلی جنگ</Badge>
        <h3 className="museum-title text-2xl font-extrabold md:text-4xl">۳۱ شهریور ۱۳۵۹ — آغاز جنگ تحمیلی</h3>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          خط زمانی روز آغاز: سخنرانی‌ها و مواضع، حملات واقعی، نقشه مناطق مورد حمله، واکنش مسئولان و گزارش‌های خبری.
          پس از این فصل، کاربر وارد «هشت سال دفاع مقدس» می‌شود.
        </p>
      </div>
      <Card>
        <CardContent className="p-5">
          <div className="relative space-y-5 border-r-2 border-primary/40 pr-5">
            {INVASION_DAY.map((it, i) => (
              <div key={i} className="relative">
                <span className="absolute -right-[27px] top-1.5 h-3.5 w-3.5 rounded-full bg-primary ring-4 ring-primary/20" />
                <Badge className="font-extrabold">{it.time}</Badge>
                <div className="mt-1.5 text-sm font-extrabold">{it.title}</div>
                <p className="text-sm leading-7 text-justify text-muted-foreground">{it.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <MediaStrip tags={['invasion', 'air']} />
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => go('documentaries', 'doc-invasion')} className="font-bold">🎬 مستند تعاملی «۳۱ شهریور»</Button>
        <Button variant="outline" onClick={() => go('timeline')} className="font-bold">ورود به هشت سال دفاع مقدس ←</Button>
        <Button variant="outline" onClick={() => go('saddam-dossier')} className="font-bold">پرونده تصمیم صدام</Button>
      </div>
    </section>
  )
}

export function RootsView({ go }: { go: (v: string, p?: string) => void }) {
  const [treaty, setTreaty] = useState<string | null>(null)
  const [doc, setDoc] = useState('doc-algiers')

  return (
    <div className="space-y-8">
      <section className="hero-vignette rounded-3xl border p-6 md:p-10">
        <Badge variant="outline" className="mb-3">فصل جدید فاز ۲ — پیش از آغاز جنگ</Badge>
        <h1 className="museum-title text-2xl font-extrabold leading-tight md:text-4xl">{ROOTS_FRAMEWORK.title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{ROOTS_FRAMEWORK.lead}</p>
        <div className="mt-5 grid gap-2 md:grid-cols-3">
          {ROOTS_FRAMEWORK.levels.map(l => (
            <div key={l.key} className={`rounded-xl border p-3 text-xs leading-6 ${LEVEL_TONES[l.key as Level]}`}>
              <div className="font-extrabold">{l.title}</div>
              <p className="mt-1 opacity-90">{l.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={() => document.getElementById('r-historical')?.scrollIntoView({ behavior: 'smooth' })} className="font-bold">شروع فصل ↓</Button>
          <Button variant="outline" onClick={() => { setDoc('doc-algiers'); go('documentaries', 'doc-algiers') }} className="font-bold">🎬 مستند الجزایر ۱۹۷۵</Button>
          <Button variant="outline" onClick={() => go('map')} className="font-bold">نقشه مرزها و جبهه‌ها</Button>
        </div>
      </section>

      {/* ناوبری فصل */}
      <nav aria-label="ناوبری فصل ریشه‌ها" className="flex flex-wrap gap-2 rounded-2xl border bg-card/60 p-3">
        {ROOT_PERIODS.map(p => (
          <a key={p.id} href={`#${p.id}`} onClick={e => { e.preventDefault(); document.getElementById(p.id)?.scrollIntoView({ behavior: 'smooth' }) }} className="rounded-lg border bg-muted/40 px-3 py-1.5 text-xs font-bold hover:border-primary/60">
            {toFa(p.index)}. {p.title.length > 34 ? p.title.slice(0, 34) + '…' : p.title}
          </a>
        ))}
        <a href="#r-months" onClick={e => { e.preventDefault(); document.getElementById('r-months')?.scrollIntoView({ behavior: 'smooth' }) }} className="rounded-lg border bg-muted/40 px-3 py-1.5 text-xs font-bold hover:border-primary/60">ماه‌به‌ماه ۱۳۵۹</a>
        <a href="#r-invasion" onClick={e => { e.preventDefault(); document.getElementById('r-invasion')?.scrollIntoView({ behavior: 'smooth' }) }} className="rounded-lg border bg-primary/20 px-3 py-1.5 text-xs font-extrabold text-primary hover:border-primary">۳۱ شهریور — آغاز جنگ</a>
      </nav>

      {ROOT_PERIODS.map(p => <PeriodSection key={p.id} periodId={p.id} onTreaty={setTreaty} />)}

      <MonthsView />
      <InvasionDayView go={go} />

      {/* مستند فصل */}
      <section>
        <SectionHeader kicker="روایت سینمایی" title="مستند تعاملی فصل ریشه‌ها" desc="الگو: تصویر تاریخی → مستند کوتاه زمینه‌ها → نقشه تعاملی اروند و مرزها → متن توافق → مواضع رسمی طرفین → لغو یک‌جانبه." />
        <Card>
          <CardContent className="p-5">
            <div className="mb-4 flex flex-wrap gap-2">
              {['doc-algiers', 'doc-invasion'].map(id => (
                <button key={id} onClick={() => setDoc(id)} className={`rounded-xl border px-4 py-2 text-sm font-bold ${doc === id ? 'border-primary bg-primary/15 text-primary' : 'border-border bg-card/60'}`}>
                  {id === 'doc-algiers' ? 'الجزایر ۱۹۷۵؛ قراردادی که شکست' : '۳۱ شهریور ۱۳۵۹؛ آغاز تجاوز'}
                </button>
              ))}
            </div>
            <p className="text-sm leading-7 text-justify">
              هر دو مستند در تالار «مستندهای تعاملی» با روایت فارسی، فصل‌بندی، نقشه هم‌زمان و منابع اجرا شده‌اند؛
              این فصل از طریق دکمه زیر به آن تالار متصل است. در حالت «مطالعه تصویری و اسنادی»، تصاویر و ویدیوهای مرتبط با شناسنامه رسانه در همین صفحه و در محل مناسب متن قرار گرفته‌اند.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={() => go('documentaries', doc)} className="font-bold">🎬 مشاهده مستند در تالار مستندها</Button>
              <Button variant="outline" onClick={() => go('archive')} className="font-bold">شناسنامه رسانه‌های این فصل</Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <TreatyDialog id={treaty} onClose={() => setTreaty(null)} />
    </div>
  )
}
