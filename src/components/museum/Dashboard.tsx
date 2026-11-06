'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { OPERATIONS, RESULT_LABELS, SIDE_LABELS } from '@/data/operations'
import { PERIODS } from '@/data/periods'
import { EVENTS } from '@/data/events'
import { WAR_STATS } from '@/data/statistics'
import { MARTYRS, MARTYR_RESEARCH } from '@/data/martyrs'
import { MEDIA_ITEMS, VIDEO_ITEMS } from '@/data/media-registry'
import { MapAtlas } from './MapAtlas'
import { DefaIconsStrip, SandbagStrip, RifleIcon, BootsIcon } from './DefaDecor'
import { formatJalali, toFa } from '@/lib/jalali'
import { ResultBadge, SectionHeader, ConfidenceBadge } from './ui-bits'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function Dashboard({ go }: { go: (v: string, p?: string) => void }) {
  const [year, setYear] = useState<number | null>(null)
  const published = OPERATIONS.filter(o => o.status === 'published' || o.status === 'source_verified')
  const drafts = OPERATIONS.length - published.length
  const years = [1359, 1360, 1361, 1362, 1363, 1364, 1365, 1366, 1367]
  const warDays = (() => {
    const start = new Date(1980, 8, 22), end = new Date(1988, 7, 20)
    return Math.round((end.getTime() - start.getTime()) / 86400000)
  })()

  const kpis = [
    { label: 'مدت جنگ', value: `${toFa(2879)} روز`, sub: '۳۱ شهریور ۱۳۵۹ تا ۲۹ مرداد ۱۳۶۷ (محاسبه: ' + toFa(warDays) + ' روز)' },
    { label: 'عملیات‌های ثبت‌شده', value: toFa(OPERATIONS.length), sub: `${toFa(published.length)} پرونده کامل + ${toFa(drafts)} در حال تکمیل` },
    { label: 'پیروزی‌های روشن', value: toFa(OPERATIONS.filter(o => o.result === 'clear_victory').length), sub: 'بر اساس اهداف و نتایج واقعی، نه ادبیات تبلیغاتی' },
    { label: 'شکست‌ها و توقف‌ها', value: toFa(OPERATIONS.filter(o => ['failure', 'halted', 'mixed'].includes(o.result)).length), sub: 'شامل عملیات‌های هر دو طرف — پوشش بی‌طرف' },
  ]

  const keyEvents = EVENTS.filter(e => e.important).slice(0, 12)

  return (
    <div className="space-y-10">
      {/* قهرمان */}
      <section className="hero-vignette relative overflow-hidden rounded-3xl border">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, currentColor 0 1px, transparent 1px 14px)' }} />
        <div className="relative p-6 md:p-12">
          <Badge className="mb-4" variant="outline">موزه دیجیتال • روایت ایرانی • اطلس تعاملی • نسخه ۲.۰ (فاز ۲)</Badge>
          <h1 className="museum-title text-3xl md:text-5xl font-extrabold leading-tight">
            جنگ هشت‌ساله عراق علیه ایران
          </h1>
          <p className="mt-4 max-w-2xl text-sm md:text-base leading-8 text-muted-foreground">
            موزه دیجیتال دفاع مقدس با روایت تاریخی ایرانی: روایت از سند تفکیک می‌شود، اختلاف روایت‌ها شفاف بررسی می‌شود،
            فصل کامل «ریشه‌های جنگ از پهلوی تا ۳۱ شهریور»، خط زمانی شهدای شاخص، آرشیو چندرسانه‌ای با شناسنامه کامل،
            پرونده روایت فتح شهید آوینی و آمار منبع‌دار با درجه اطمینان.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-emerald-400/90">
            <RifleIcon className="h-4 w-4" />
            <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2.5 py-0.5 text-[10.5px] font-extrabold">سربند یا زهرا</span>
            <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2.5 py-0.5 text-[10.5px] font-extrabold">خاکریز</span>
            <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2.5 py-0.5 text-[10.5px] font-extrabold">پوتین و اسلحه</span>
            <BootsIcon className="h-4 w-4" />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => go('hall-3d')} className="font-bold">🏛 تالار سه‌بعدی عملیات‌ها (جدید)</Button>
            <Button variant="outline" onClick={() => go('battle-maps')} className="font-bold">📍 نقشه‌های تاکتیکی نبردها (جدید)</Button>
            <Button variant="outline" onClick={() => go('experiences')} className="font-bold">🧭 تجربه‌نگاری؛ درس‌های عملیات (جدید)</Button>
            <Button onClick={() => go('roots')} className="font-bold">🌱 فصل ریشه‌های جنگ (جدید)</Button>
            <Button variant="outline" onClick={() => go('martyrs')} className="font-bold">🌙 خط زمانی شهدا (جدید)</Button>
            <Button variant="outline" onClick={() => go('atlas')} className="font-bold">🗺 اطلس تعاملی</Button>
            <Button variant="outline" onClick={() => go('operations')} className="font-bold">اطلس عملیات‌ها</Button>
            <Button variant="outline" onClick={() => go('archive')} className="font-bold">آرشیو چندرسانه‌ای</Button>
            <Button variant="outline" onClick={() => go('stats')} className="font-bold">مرکز آمار</Button>
          </div>
        </div>
      </section>

      <SandbagStrip />

      {/* چهره‌های ماندگار دفاع مقدس — امام، رهبری و شهدا */}
      <section>
        <SectionHeader kicker="تم دفاع مقدسی" title="از امام تا خاکریز؛ چهره‌های ماندگار" desc="نمادهای بصری دفاع مقدس: سربند یا زهرا، خاکریز، پوتین و سیلوئت اسلحه در سراسر موزه به‌کار رفته‌اند و در این نوار، پرتره‌های هویت‌سنجی‌شده رهبران و شهدا گرد آمده‌اند." />
        <DefaIconsStrip />
      </section>

      {/* تالارهای جدید فاز ۲ */}
      <section>
        <SectionHeader kicker="فاز ۲ — تالارهای جدید" title="روایت ایرانی، شهدا و آرشیو چندملیتی" desc="چهار تالار جدید: فصل ریشه‌های جنگ (از معاهده‌های مرزی تا ۳۱ شهریور)، پرونده تصمیم صدام، خط زمانی شهدای شاخص و بخش ویژه روایت فتح با آرشیو جامع چندرسانه‌ای." />
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {[
            { key: 'roots', icon: '🌱', title: 'ریشه‌های جنگ', desc: 'از عهدنامه ارزروم و قرارداد ۱۹۳۷ تا الجزایر ۱۹۷۵، انقلاب و ماه‌به‌ماه ۱۳۵۹ — با تفکیک روایت/سند/بررسی.', badge: `${toFa(4)} معاهده + ماه‌به‌ماه ۱۳۵۹` },
            { key: 'martyrs', icon: '🌙', title: 'ستارگان دفاع مقدس', desc: 'خط زمانی شهادت شهدای شاخص با تاریخ راستی‌آزمایی‌شده و جدول شفاف بررسی فهرست پیشنهادی.', badge: `${toFa(MARTYRS.length)} پرونده + ${toFa(MARTYR_RESEARCH.length)} بررسی` },
            { key: 'avini', icon: '🎥', title: 'روایت فتح؛ آوینی', desc: 'آرشیو ویژه شهید آوینی با اتصال مستقیم مستند به عملیات و نقشه محل تصویربرداری.', badge: 'روایت فتح + حقیقت سینما' },
            { key: 'archive', icon: '📦', title: 'آرشیو چندرسانه‌ای', desc: 'شناسنامه کامل هر رسانه: منبع، مجوز، اصالت و وضعیت بررسی کارشناسی؛ منابع ایرانی، عراقی و بین‌المللی.', badge: `${toFa(MEDIA_ITEMS.length + VIDEO_ITEMS.length)} رسانه ثبت‌شده` },
          ].map(c => (
            <Card key={c.key} className="museum-card cursor-pointer" onClick={() => go(c.key)}>
              <CardContent className="p-4">
                <div className="text-2xl">{c.icon}</div>
                <div className="mt-2 text-sm font-extrabold">{c.title}</div>
                <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{c.desc}</p>
                <Badge variant="outline" className="mt-2 text-[10px]">{c.badge}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* KPI */}
      <section>
        <SectionHeader kicker="داشبورد" title="جنگ در یک نگاه" desc="اعداد فقط از پایگاه داده منبع‌دار استخراج می‌شوند؛ برای هر عدد، منبع و درجه اطمینان نمایش داده می‌شود." />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {kpis.map(k => (
            <Card key={k.label} className="museum-card">
              <CardContent className="p-4">
                <div className="text-xs font-bold text-muted-foreground">{k.label}</div>
                <div className="mt-1 text-2xl font-extrabold text-primary">{k.value}</div>
                <div className="mt-1 text-[11px] leading-4 text-muted-foreground">{k.sub}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* نقشه سینمایی + خط زمانی */}
      <section>
        <SectionHeader kicker="نقشه بزرگ" title="تحولات جغرافیایی جبهه‌ها" desc="سال را انتخاب کنید تا عملیات‌ها، مناطق کنترلی و رویدادهای همان دوره روی نقشه تغییر کنند." />
        <MapAtlas compact />
      </section>

      <section>
        <SectionHeader kicker="خط زمانی" title="هشت سال در هشت ایستگاه" />
        <div className="tl-rail mb-6" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PERIODS.map(p => (
            <Card key={p.id} className="museum-card cursor-pointer" onClick={() => go('timeline')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  <span className="text-primary font-extrabold">دوره {toFa(p.index)} — {toFa(p.year)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs leading-6 text-muted-foreground">
                <div className="mb-1 font-bold text-foreground">{p.title}</div>
                {p.subtitle}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* نقاط عطف + آمار کلان */}
      <section className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <SectionHeader kicker="نقاط عطف" title="رویدادهای تعیین‌کننده" />
          <div className="space-y-2 max-h-[420px] overflow-y-auto scrollbar-thin pl-1">
            {keyEvents.map(e => (
              <div key={e.id} className="rounded-xl border bg-card/70 p-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-bold shrink-0">{formatJalali(e.date)}</Badge>
                  <span className="text-sm font-bold">{e.faTitle}</span>
                </div>
                <p className="mt-1 text-xs leading-6 text-muted-foreground">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2">
          <SectionHeader kicker="آمار با منبع" title="کلان‌آمار جنگ" />
          <div className="space-y-3">
            {WAR_STATS.slice(0, 6).map(s => (
              <div key={s.id} className="rounded-xl border bg-card/70 p-3">
                <div className="text-xs font-bold text-muted-foreground">{s.metric}</div>
                <div className="mt-0.5 text-sm font-extrabold leading-6">{s.value} <span className="text-[11px] font-normal text-muted-foreground">{s.unit}</span></div>
                <div className="mt-1 flex items-center gap-2">
                  <ConfidenceBadge c={s.confidence} />
                  <span className="text-[11px] text-muted-foreground">{s.sourceId}</span>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={() => go('stats')} className="w-full font-bold">مرکز کامل آمار و نمودارها</Button>
          </div>
        </div>
      </section>

      {/* عملیات‌های شاخص */}
      <section>
        <SectionHeader kicker="اطلس عملیات‌ها" title="برخی عملیات‌های کلیدی" desc="پرونده هر عملیات شامل شناسنامه، زمینه، روند وقایع، نتایج، جدول آمار ادعایی و منابع است." />
        <Tabs defaultValue="iran" dir="rtl">
          <TabsList className="mb-3">
            <TabsTrigger value="iran">ایران</TabsTrigger>
            <TabsTrigger value="iraq">عراق</TabsTrigger>
            <TabsTrigger value="mek">منافقین</TabsTrigger>
            <TabsTrigger value="other">سایر بازیگران</TabsTrigger>
          </TabsList>
          {['iran', 'iraq', 'mek', 'us', 'other'].map(side => (
            <TabsContent key={side} value={['us', 'israel'].includes(side) ? 'other' : side} className="space-y-2">
              {published.filter(o => o.side === side).slice(0, side === 'iran' ? 8 : 6).map(o => (
                <button key={o.id} onClick={() => go('operations', o.id)} className="w-full rounded-xl border bg-card/70 p-3 text-right transition-colors hover:border-primary/50">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold">{o.faName}</span>
                    <ResultBadge r={o.result} />
                    <Badge variant="outline" className="text-[10px]">{o.faStart ? formatJalali(o.faStart) : 'در حال تحقیق'}</Badge>
                    <Badge variant="outline" className="text-[10px]">{SIDE_LABELS[o.side]}</Badge>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-6 text-muted-foreground">{o.outcome}</p>
                </button>
              ))}
              {side === 'iran' && (
                <div className="text-center">
                  <Button variant="ghost" onClick={() => go('operations')} className="text-primary">مشاهده همه {toFa(published.filter(o => o.side === 'iran').length)} پرونده ایرانی ←</Button>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* بیانیه پژوهشی */}
      <section className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
        <h3 className="font-extrabold mb-2">📜 میثاق پژوهشی این موزه</h3>
        <ul className="list-disc space-y-1.5 pr-5 text-sm leading-7 text-muted-foreground">
          <li>روایت رسمی ایران، روایت رسمی عراق و پژوهش‌های مستقل از هم تفکیک می‌شوند؛ موفقیت تاکتیکی با موفقیت راهبردی یکی گرفته نمی‌شود.</li>
          <li>کشته، مجروح، اسیر و مفقود هرگز با هم جمع نمی‌شوند؛ ارقام هر طرف با برچسب «ادعای طرف درگیر» مشخص می‌شود.</li>
          <li>برای هیچ فیلد خالی عددی تولید نمی‌شود؛ جای خالی صریحاً «آمار قابل اتکا یافت نشد» اعلام می‌گردد.</li>
          <li>مسئولیت آغاز جنگ بر اساس اسناد شورای امنیت (به‌ویژه بند ۶ قطعنامه ۵۹۸ و گزارش هیئت حقیقت‌یاب ۱۹۹۱) مستند شده است: آغاز تجاوز از سوی عراق.</li>
        </ul>
      </section>
    </div>
  )
}
