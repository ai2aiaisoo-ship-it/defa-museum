'use client'

import { useRef, useState } from 'react'
import { KHORRAMSHAHR_CHAPTERS, MERSAD_CHAPTERS, MEK_TIMELINE } from '@/data/special'
import { OPERATIONS } from '@/data/operations'
import { GALLERY } from '@/data/gallery'
import { toFa } from '@/lib/jalali'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SafeImage, SectionHeader, StatClaimsTable, SourceChips, ResultBadge } from './ui-bits'

/** مقایسه‌گر قبل/بعد */
function BeforeAfter({ before, after }: { before: { url: string; title: string; sourceName: string }; after: { url: string; title: string; sourceName: string } }) {
  const [pos, setPos] = useState(50)
  const ref = useRef<HTMLDivElement>(null)
  const drag = (clientX: number) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    const pct = ((r.right - clientX) / r.width) * 100 // RTL
    setPos(Math.min(96, Math.max(4, pct)))
  }
  return (
    <div>
      <div ref={ref} className="beforeafter relative aspect-video w-full cursor-ew-resize rounded-2xl border" onMouseMove={e => e.buttons === 1 && drag(e.clientX)} onMouseDown={e => drag(e.clientX)} onTouchMove={e => drag(e.touches[0].clientX)}>
        <img src={after.url} alt={after.title} className="absolute inset-0 h-full w-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
        <img
          src={before.url} alt={before.title}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ clipPath: `inset(0 0 0 ${100 - pos}%)` }}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
        <div className="ba-handle" style={{ right: `${pos}%` }} />
        <Badge className="absolute bottom-2 right-2">{before.title}</Badge>
        <Badge className="absolute bottom-2 left-2" variant="outline">{after.title}</Badge>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">دستگیره را بکشید تا تصاویر/نقشه‌های دو دوره مقایسه شوند. تصاویر آرشیوی از منابع عمومی وب؛ در صورت نادرستی لینک، منبع اصلی نمایش داده می‌شود. منابع: {before.sourceName} / {after.sourceName}</p>
    </div>
  )
}

export function KhorramshahrView({ go }: { go: (v: string, p?: string) => void }) {
  const [step, setStep] = useState(0)
  const chapter = KHORRAMSHAHR_CHAPTERS[step]
  const imgs = GALLERY.filter(g => g.tags.includes('khorramshahr'))
  const bayt = OPERATIONS.find(o => o.id === 'bayt-almoghaddas')!
  const battle = OPERATIONS.find(o => o.id === 'khorramshahr-battle')!

  return (
    <div className="space-y-8">
      <section className="hero-vignette rounded-3xl border p-6 md:p-10">
        <Badge variant="outline" className="mb-3">فصل ویژه موزه</Badge>
        <h1 className="museum-title text-3xl md:text-4xl">خرمشهر؛ از اشغال تا آزادی</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          روایت چندرسانه‌ای و چندلایه: از مقاومت ۳۴ روزه و ۳۴ ماه اشغال تا ۳ خرداد ۱۳۶۱ — با خط زمانی تصویری، مقایسه قبل/بعد و تفکیک روایت‌ها.
        </p>
      </section>

      {/* خط زمانی تصویری */}
      <section>
        <SectionHeader kicker="تجربه تعاملی" title="خط زمانی شهر — روی ایستگاه‌ها حرکت کنید" />
        <div className="mb-5 flex items-center gap-1 overflow-x-auto pb-2 scrollbar-thin">
          {KHORRAMSHAHR_CHAPTERS.map((c, i) => (
            <button key={c.id} onClick={() => setStep(i)} className={`shrink-0 rounded-xl border px-4 py-2.5 transition-all ${step === i ? 'border-primary bg-primary/15 text-primary' : 'border-border bg-card/60'}`}>
              <div className="text-xs font-extrabold">{c.title}</div>
              <div className="text-[10px] text-muted-foreground">{c.dateLabel}</div>
            </button>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-3 text-xl font-extrabold text-primary">{chapter.title} <span className="text-xs font-normal text-muted-foreground">({chapter.dateLabel})</span></h3>
            <div className="space-y-3 leading-8 text-[15px] text-justify">
              {chapter.text.map((t, i) => <p key={i}>{t}</p>)}
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" disabled={step === 0} onClick={() => setStep(s => s - 1)}>→ قبلی</Button>
              <Button size="sm" disabled={step === KHORRAMSHAHR_CHAPTERS.length - 1} onClick={() => setStep(s => s + 1)}>بعدی ←</Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* مقایسه قبل/بعد */}
      <section>
        <SectionHeader kicker="مقایسه تصویری" title="قبل و بعد — شهر و نقشه در دو مقطع" />
        {imgs.length >= 2 ? (
          <BeforeAfter before={{ url: imgs[0].url, title: imgs[0].title, sourceName: imgs[0].sourceName }} after={{ url: imgs[1].url, title: imgs[1].title, sourceName: imgs[1].sourceName }} />
        ) : (
          <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">تصاویر مقایسه‌ای در حال تکمیل است.</div>
        )}
        {imgs.length > 2 && (
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {imgs.slice(2).map(g => <SafeImage key={g.id} img={g} className="aspect-video w-full" />)}
          </div>
        )}
      </section>

      {/* آمار و منابع */}
      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <h4 className="mb-3 font-extrabold text-primary">آمار نبرد و آزادسازی — با ادعاهای منبع‌دار</h4>
            <StatClaimsTable claims={[...battle.stats, ...bayt.stats]} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h4 className="mb-3 font-extrabold text-primary">منابع فصل</h4>
            <SourceChips ids={['jang-atlas', 'fa-wiki-ops', 'iranica-war', 'fa-wiki-war']} />
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => go('operations', 'khorramshahr-battle')}>پرونده نبرد ۱۳۵۹</Button>
              <Button size="sm" variant="outline" onClick={() => go('operations', 'bayt-almoghaddas')}>پرونده بیت‌المقدس</Button>
              <Button size="sm" variant="outline" onClick={() => go('gallery')}>گالری تصاویر</Button>
              <Button size="sm" variant="outline" onClick={() => go('documentaries')}>مستند تعاملی</Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

export function MersadView({ go }: { go: (v: string, p?: string) => void }) {
  const forough = OPERATIONS.find(o => o.id === 'forough-javidan')!
  const mersad = OPERATIONS.find(o => o.id === 'mersad')!
  const imgs = GALLERY.filter(g => g.tags.includes('mersad'))

  return (
    <div className="space-y-8">
      <section className="hero-vignette rounded-3xl border p-6 md:p-10">
        <Badge variant="outline" className="mb-3">فصل ویژه موزه</Badge>
        <h1 className="museum-title text-3xl md:text-4xl">تابستان ۱۳۶۷؛ از فروغ جاویدان تا عملیات مرصاد</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          روایت مستقل و مستند: تاریخچه سازمان منافقین، زمینه‌های تهاجم مرداد ۱۳۶۷، روند مرصاد و آمار با تفکیک اختلاف منابع.
        </p>
      </section>

      {/* تاریخچه سازمان */}
      <section>
        <SectionHeader kicker="پیشینه" title="سازمان منافقین؛ از تأسیس تا عراق" desc="این پرونده تاریخی است و بازسازی دستورالعملی عملیات ارائه نمی‌کند." />
        <div className="relative space-y-4 border-r-2 border-primary/40 pr-5">
          {MEK_TIMELINE.map((t, i) => (
            <div key={i} className="relative">
              <span className="absolute -right-[27px] top-1.5 h-3 w-3 rounded-full bg-primary" />
              <div className="rounded-xl border bg-card/70 p-3">
                <Badge variant="outline" className="font-extrabold">{t.date}</Badge>
                <p className="mt-1.5 text-sm leading-7">{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* دو فصل */}
      <section className="grid gap-4 lg:grid-cols-2">
        {MERSAD_CHAPTERS.map(ch => (
          <Card key={ch.id} className="museum-card">
            <CardContent className="p-5">
              <h4 className="mb-2 text-lg font-extrabold text-primary">{ch.title}</h4>
              <Badge variant="outline" className="mb-3">{ch.dateLabel}</Badge>
              <div className="space-y-2 text-sm leading-7 text-justify">
                {ch.text.map((t, i) => <p key={i}>{t}</p>)}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* آمار */}
      <section>
        <SectionHeader kicker="آمار مستند" title="تلفات و اسرا با بررسی اختلاف منابع" />
        <StatClaimsTable claims={[...forough.stats, ...mersad.stats]} />
        <p className="mt-2 text-[11px] leading-5 text-muted-foreground">ارقام تلفات سازمان منافقین میان روایت رسمی ایران و روایت خودِ سازمان تفاوت اساسی دارد؛ رقم مستقل و تأییدشده ثبت نشده است (درجه اطمینان C).</p>
      </section>

      {imgs.length > 0 && (
        <section>
          <SectionHeader kicker="اسناد تصویری" title="تصاویر آرشیوی" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {imgs.map(g => <SafeImage key={g.id} img={g} className="aspect-video w-full" />)}
          </div>
        </section>
      )}

      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => go('operations', 'forough-javidan')}>پرونده فروغ جاویدان</Button>
        <Button size="sm" variant="outline" onClick={() => go('operations', 'mersad')}>پرونده مرصاد</Button>
        <Button size="sm" variant="outline" onClick={() => go('documentaries')}>مستند تعاملی مرصاد</Button>
      </div>
    </div>
  )
}
