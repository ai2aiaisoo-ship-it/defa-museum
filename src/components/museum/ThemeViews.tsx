'use client'

import { OPERATIONS } from '@/data/operations'
import { EVENTS } from '@/data/events'
import { ResultBadge, SectionHeader, StatClaimsTable, SourceChips, ConfidenceBadge } from './ui-bits'
import { formatJalali, toFa } from '@/lib/jalali'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export interface ThemePageProps {
  kicker: string
  title: string
  intro: string[]
  opIds: string[]
  eventIds: string[]
  statFilter?: (m: string) => boolean
  go: (v: string, p?: string) => void
}

export function ThemePage({ kicker, title, intro, opIds, eventIds, statFilter, go }: ThemePageProps) {
  const ops = opIds.map(id => OPERATIONS.find(o => o.id === id)).filter(Boolean) as typeof OPERATIONS
  const evs = eventIds.map(id => EVENTS.find(e => e.id === id)).filter(Boolean) as typeof EVENTS
  return (
    <div className="space-y-8">
      <section className="hero-vignette rounded-3xl border p-6 md:p-10">
        <Badge variant="outline" className="mb-3">{kicker}</Badge>
        <h1 className="museum-title text-3xl md:text-4xl">{title}</h1>
      </section>
      <section className="space-y-3 leading-8 text-[15px] text-justify">
        {intro.map((t, i) => <p key={i}>{t}</p>)}
      </section>
      {evs.length > 0 && (
        <section>
          <SectionHeader kicker="رویدادها" title="ریشه در خط زمانی" />
          <div className="space-y-2">
            {evs.map(e => (
              <div key={e.id} className="rounded-xl border bg-card/70 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="font-bold">{formatJalali(e.date)}</Badge>
                  <span className="text-sm font-bold">{e.faTitle}</span>
                </div>
                <p className="mt-1 text-xs leading-6 text-muted-foreground">{e.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      <section>
        <SectionHeader kicker="پرونده‌ها" title={`عملیات‌های مرتبط (${toFa(ops.length)})`} />
        <div className="grid gap-3 md:grid-cols-2">
          {ops.map(o => (
            <button key={o.id} onClick={() => go('operations', o.id)} className="rounded-xl border bg-card/70 p-3 text-right transition-colors hover:border-primary/50">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold">{o.faName}</span>
                <ResultBadge r={o.result} />
                <Badge variant="outline" className="text-[10px]">{o.faStart ? formatJalali(o.faStart) : 'در حال تحقیق'}</Badge>
              </div>
              <p className="mt-1 line-clamp-2 text-xs leading-6 text-muted-foreground">{o.outcome}</p>
            </button>
          ))}
        </div>
      </section>
      {statFilter && (
        <section>
          <SectionHeader kicker="آمار" title="شاخص‌های مرتبط" />
          <StatClaimsTable claims={[]} />
        </section>
      )}
    </div>
  )
}

export function WarOfCitiesView({ go }: { go: (v: string, p?: string) => void }) {
  return <ThemePage
    kicker="فصل موضوعی"
    title="جنگ شهرها — پنج دور بمباران مناطق مسکونی"
    intro={[
      'جنگ شهرها به پنج دور بمباران شدید مناطق شهری در جنگ ایران و عراق گفته می‌شود: بهمن ۶۲ (۷–۲۲ فوریه ۱۹۸۴)، فروردین ۶۴، دی–بهمن ۶۵، بهمن ۶۵ تا اردیبهشت ۶۶، و شدیدترین دور از اسفند ۶۶ تا اردیبهشت ۶۷.',
      'در دور پنجم، عراق با موشک‌های «الحسین» (بردارتافته اسکاد-بی) نزدیک به ۱۸۹ موشک به تهران، قم، اصفهان و شهرهای دیگر شلیک کرد؛ خروج گسترده مردم از تهران رخ داد. ایران با اسکادهای باقی‌مانده و دریافتی از لیبی پاسخ می‌داد.',
      'بر اساس شمارش‌های ایرانی نقل‌شده در پژوهش کورزمن، ۱۵٫۹۵۹ تا ۱۶٫۱۵۴ غیرنظامی ایرانی در جنگ شهرها کشته شدند. سازمان ملل بارها از عراق خواست حمله به غیرنظامیان را متوقف کند؛ از دید حقوق بین‌الملل، این حملات آشکارا غیرنظامیان را هدف قرار می‌داد.',
    ]}
    opIds={['war-of-cities', 'badr-63', 'karbala-4', 'karbala-5', 'sardasht-chem', 'halabja-chem']}
    eventIds={['e-wc1', 'e-hussein-missiles', 'e-sardasht', 'e-halabja', 'e-chavar']}
    go={go}
  />
}

export function TankerWarView({ go }: { go: (v: string, p?: string) => void }) {
  return <ThemePage
    kicker="فصل موضوعی"
    title="جنگ نفتکش‌ها — جنگ اقتصادی خلیج فارس"
    intro={[
      'از ۱۳۶۳ حملات نظامی به کشتی‌های تجاری خلیج فارس به جنگی مستقل تبدیل شد: عراق با میراژها و اگزوسه‌ها نفتکش‌های ایران و پایانه خارک را هدف می‌گرفت و ایران با قایق‌های موشک‌انداز و موشک‌های سیلوورم چینی، نفتکش‌های حامیان مالی بغداد (کویت و عربستان) را.',
      'ورود آمریکا با عملیات «اراده جدی» (پرچم‌گذاری نفتکش‌های کویتی، مرداد ۱۳۶۶) بازی را تغییر داد: درگیری‌های مستقیم ایران و آمریکا (استارک، کمانگیر چابک، آخوندک) و سرانجام سقوط پرواز ۶۵۵ ایران‌ایر.',
      'برآورد شمار کشتی‌های آسیب‌دیده در منابع از ۴۰۰ تا بیش از ۵۵۰ فروند متفاوت است (درجه اطمینان پایین)؛ صادرات نفت عراق از مسیر دریایی از همان ۱۳۵۹ (عملیات مروارید) قطع شده بود و هر دو طرف در پایان جنگ از نظر اقتصادی فرسوده بودند.',
    ]}
    opIds={['tanker-war', 'earnest-will', 'nimble-archer', 'praying-mantis', 'uss-stark', 'iran-air-655', 'morvarid', 'karbala-3']}
    eventIds={['e-morvarid', 'e-earnest-will', 'e-stark', 'e-nimble', 'e-mantis', 'e-ia655', 'e-nowruz']}
    go={go}
  />
}

export function AirWarView({ go }: { go: (v: string, p?: string) => void }) {
  return <ThemePage
    kicker="فصل موضوعی"
    title="نبرد هوایی — از کمان ۹۹ تا پدافند شهرها"
    intro={[
      'در روز نخست جنگ، دو نیروی هوایی وارد نبردی سنگین شدند: عراق پایگاه‌های ایران را بمباران کرد و ایران در همان روز با «کمان ۹۹» به عمق عراق پاسخ داد — عملیاتی با حدود صد سورتی جنگنده‌بمب‌افکن.',
      'نوروز ۱۳۶۰، فانتوم‌های ایران در عملیات اچ-۳ با پرواز کم‌ارتفاع هزار و پانصد کیلومتر در عمق عراق پایگاه‌های پناه‌گرفته جنگنده‌های بغداد را زدند (برآورد ۴۴ تا ۵۰ فروند منهدم/آسیب‌دیده — روایت‌ها متفاوت).',
      'تحریم قطعات، بهره‌وری هوایی ایران را به‌تدریج کم کرد اما نیروی هوایی در پشتیبانی نبردهای بزرگ و پدافند شهرها تا روز آخر فعال ماند؛ در مقابل هوای عراق نقش اصلی را در بمباران شهرها و نفتکش‌ها و پشتیبانی پاتک‌ها داشت.',
    ]}
    opIds={['kaman-99', 'h-3', 'osirak', 'uss-stark', 'iran-air-655', 'war-of-cities', 'iraq-invasion']}
    eventIds={['e-kaman99', 'e-h3', 'e-osirak', 'e-andimeshk', 'e-ia655']}
    go={go}
  />
}

export function NavalWarView({ go }: { go: (v: string, p?: string) => void }) {
  return <ThemePage
    kicker="فصل موضوعی"
    title="نبردهای دریایی — مروارید، کربلای ۳ و خلیج فارس"
    intro={[
      'عملیات مروارید (۷ آذر ۱۳۵۹) بزرگ‌ترین پیروزی دریایی جنگ بود: انهدام سکوهای البکر و الامیه و حدود ۸۰ درصد توان دریایی عراق؛ صادرات دریایی نفت بغداد از همان ماه‌های نخست قطع شد و ۷ آذر روز نیروی دریایی ارتش نام گرفت.',
      'پنج سال بعد، کربلای ۳ (۱۰–۱۱ شهریور ۱۳۶۵) سکوهای بازسازی‌شده را دوباره منهدم کرد و تیپ ویژه ۴۴۰ دریایی عراق را از بین برد؛ توان قایقی سپاه (به فرماندهی علی شمخانی) در این عملیات تکامل یافت.',
      'در جنگ نفتکش‌ها، دریای خلیج فارس میدان چندجانبه شد: ایران، عراق، نفتکش‌های کشورهای ثالث و سرانجام ناوگان آمریکا؛ عملیات آخوندک (۲۹ فروردین ۱۳۶۷) بزرگ‌ترین درگیری مستقیم دریایی ایران و آمریکا بود.',
    ]}
    opIds={['morvarid', 'karbala-3', 'tanker-war', 'praying-mantis', 'nimble-archer', 'earnest-will', 'iran-air-655']}
    eventIds={['e-morvarid', 'e-karbala3-naval', 'e-mantis', 'e-ia655']}
    go={go}
  />
}

export function IraqOpsView({ go }: { go: (v: string, p?: string) => void }) {
  const iraqOps = OPERATIONS.filter(o => o.side === 'iraq')
  return (
    <div className="space-y-8">
      <section className="hero-vignette rounded-3xl border p-6 md:p-10">
        <Badge variant="outline" className="mb-3">فصل مستقل</Badge>
        <h1 className="museum-title text-3xl md:text-4xl">عملیات‌ها و پاتک‌های عراق</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          این فصل صرفاً به عملیات‌های ایران محدود نیست: تهاجم ۱۳۵۹، دفاع شرق بصره، پاتک‌های بزرگ و عملیات‌های بازپس‌گیری ۱۳۶۷ — هر رویداد با دستاورد واقعی، هزینه و پیامدهای مستند.
        </p>
      </section>
      <section>
        <SectionHeader kicker="پرونده‌ها" title={`${toFa(iraqOps.length)} پرونده ثبت‌شده`} />
        <div className="grid gap-3 md:grid-cols-2">
          {iraqOps.map(o => (
            <button key={o.id} onClick={() => go('operations', o.id)} className="rounded-xl border bg-card/70 p-3 text-right transition-colors hover:border-primary/50">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold">{o.faName}</span>
                <ResultBadge r={o.result} />
                <Badge variant="outline" className="text-[10px]">{o.faStart ? formatJalali(o.faStart) : 'در حال تحقیق'}</Badge>
              </div>
              <p className="mt-1 line-clamp-2 text-xs leading-6 text-muted-foreground">{o.outcome}</p>
            </button>
          ))}
        </div>
      </section>
      <section>
        <SectionHeader kicker="تحلیل" title="چرا عراق در ۱۳۶۷ پیروز شد؟" />
        <Card><CardContent className="p-5 text-sm leading-8">
          ترکیبی از عوامل: بازسازی گسترده ارتش با پول خلیج فارس و سلاح فرانسه/شوروی، برتری در سلاح شیمیایی به‌عنوان بازدارنده، پهپادهای شناسایی، خستگی و فرسودگی عمق آفندی ایران پس از کربلای ۵، و پشتیبانی اطلاعاتی خارجی. در مقابل، ایران پس از پذیرش ۵۹۸ (۲۷ تیر) عملاً جنگ را از نظر نظامی پایان‌یافته می‌دانست و عراق پیش از آتش‌بس به دنبال حداکثر امتیاز زمینی بود.
        </CardContent></Card>
      </section>
    </div>
  )
}

export function MekOpsView({ go }: { go: (v: string, p?: string) => void }) {
  const mekOps = OPERATIONS.filter(o => o.side === 'mek')
  return (
    <div className="space-y-8">
      <section className="hero-vignette rounded-3xl border p-6 md:p-10">
        <Badge variant="outline" className="mb-3">فصل مستقل</Badge>
        <h1 className="museum-title text-3xl md:text-4xl">سازمان مجاهدین خلق در جنگ</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          از مبارزه مسلحانه داخلی (۱۳۶۰) تا استقرار در عراق (۱۳۶۵) و تهاجم فروغ جاویدان (مرداد ۱۳۶۷). برای روایت کامل تاریخی، فصل ویژه «تابستان ۱۳۶۷» را ببینید.
        </p>
      </section>
      <section>
        <SectionHeader kicker="پرونده‌ها" title="عملیات‌های ثبت‌شده سازمان" />
        <div className="grid gap-3 md:grid-cols-2">
          {mekOps.map(o => (
            <button key={o.id} onClick={() => go('operations', o.id)} className="rounded-xl border bg-card/70 p-3 text-right transition-colors hover:border-primary/50">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold">{o.faName}</span>
                <ResultBadge r={o.result} />
                <Badge variant="outline" className="text-[10px]">{o.faStart ? formatJalali(o.faStart) : 'در حال تحقیق'}</Badge>
              </div>
              <p className="mt-1 line-clamp-2 text-xs leading-6 text-muted-foreground">{o.outcome}</p>
            </button>
          ))}
        </div>
      </section>
      <div className="text-center">
        <Button onClick={() => go('mersad')} className="font-bold">فصل ویژه: تابستان ۱۳۶۷ — فروغ جاویدان و مرصاد</Button>
      </div>
    </div>
  )
}
