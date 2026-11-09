'use client'

import { useMemo, useState } from 'react'
import { SOURCES } from '@/data/sources'
import { OPERATIONS } from '@/data/operations'
import { WAR_EXPERIENCES, EXPERIENCE_CATEGORIES } from '@/data/experiences'
import { EVENTS } from '@/data/events'
import { COMMANDERS } from '@/data/commanders'
import { GLOSSARY } from '@/data/glossary'
import { MARTYRS } from '@/data/martyrs'
import { MEDIA_ITEMS, VIDEO_ITEMS } from '@/data/media-registry'
import { TREATIES } from '@/data/roots'
import { RAVAYAT_FATH } from '@/data/avini'
import { toFa, formatJalali } from '@/lib/jalali'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ConfidenceBadge, SectionHeader } from './ui-bits'
import { Button } from '@/components/ui/button'

export function SourcesView() {
  const [type, setType] = useState('all')
  const types = [...new Set(SOURCES.map(s => s.type))]
  const typeLabel: Record<string, string> = { document: 'سند رسمی', book: 'کتاب', academic: 'پژوهشی', media: 'رسانه', official: 'مقطع رسمی/نظامی', encyclopedia: 'دانشنامه', archive: 'آرشیو' }
  const list = SOURCES.filter(s => type === 'all' || s.type === type)
  return (
    <div>
      <SectionHeader kicker="پایگاه منابع" title={`${toFa(SOURCES.length)} منبع ثبت‌شده`} desc="هر ادعای آماری موزه به یکی از این منابع ارجاع دارد. درجه اطمینان منبع: A مستند چندمنبعی / B قابل استناد با احتیاط / C نیازمند مقایسه." />
      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={() => setType('all')} className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${type === 'all' ? 'border-primary bg-primary/15 text-primary' : 'border-border bg-card/60'}`}>همه</button>
        {types.map(t => (
          <button key={t} onClick={() => setType(t)} className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${type === t ? 'border-primary bg-primary/15 text-primary' : 'border-border bg-card/60'}`}>{typeLabel[t] ?? t}</button>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {list.map(s => (
          <Card key={s.id} className="museum-card"><CardContent className="p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-extrabold leading-6">{s.faTitle}</h3>
              <ConfidenceBadge c={s.reliability} />
            </div>
            {s.enTitle && <p className="text-[11px] text-muted-foreground" dir="ltr">{s.enTitle}</p>}
            <div className="mt-1 flex flex-wrap gap-1">
              <Badge variant="outline" className="text-[10px]">{typeLabel[s.type] ?? s.type}</Badge>
              {s.year && <Badge variant="outline" className="text-[10px]">{s.year}</Badge>}
            </div>
            <p className="mt-2 text-xs leading-6 text-muted-foreground">{s.note}</p>
            {s.url && <a href={s.url} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs font-bold text-primary underline">پیوند منبع ↗</a>}
          </CardContent></Card>
        ))}
      </div>
    </div>
  )
}

export function SearchView({ go }: { go: (v: string, p?: string) => void }) {
  const [q, setQ] = useState('')
  const norm = (s: string) => s.replace(/[أإآ]/g, 'ا').replace(/ی/g, 'ي').replace(/\u200c/g, ' ')
  const nq = norm(q.trim())
  const results = useMemo(() => {
    if (nq.length < 2) return { ops: [], evs: [], cmds: [], terms: [], mrtrs: [], media: [], treatises: [], rf: [], exps: [] }
    return {
      ops: OPERATIONS.filter(o => norm(o.faName + o.enName + o.region + o.tags.join() + o.objectives).includes(nq)).slice(0, 8),
      evs: EVENTS.filter(e => norm(e.faTitle + e.desc).includes(nq)).slice(0, 8),
      cmds: COMMANDERS.filter(c => norm(c.name + c.role + c.bio).includes(nq)).slice(0, 5),
      terms: GLOSSARY.filter(g => norm(g.term + g.definition).includes(nq)).slice(0, 5),
      mrtrs: MARTYRS.filter(m => norm(m.name + m.role + m.bio + m.place).includes(nq)).slice(0, 6),
      media: [...MEDIA_ITEMS, ...VIDEO_ITEMS].filter(m => norm(m.title + m.desc + m.sourceName + (m.people ?? []).join()).includes(nq)).slice(0, 6),
      treatises: TREATIES.filter(t => norm(t.faName + t.enName + t.legacy).includes(nq)).slice(0, 4),
      rf: RAVAYAT_FATH.filter(r => norm(r.topic + r.note).includes(nq)).slice(0, 4),
      exps: WAR_EXPERIENCES.filter(e => norm(e.title + e.text + e.significance + EXPERIENCE_CATEGORIES[e.category].label).includes(nq)).slice(0, 6),
    }
  }, [nq])
  const total = results.ops.length + results.evs.length + results.cmds.length + results.terms.length + results.mrtrs.length + results.media.length + results.treatises.length + results.rf.length + results.exps.length
  return (
    <div>
      <SectionHeader kicker="جست‌وجوی پیشرفته" title="جست‌وجوی سراسری در کل موزه" desc="عملیات‌ها، رویدادها، شهدا، فرماندهان، رسانه‌ها، معاهده‌ها، روایت فتح و واژه‌نامه — همه در یک جست‌وجو. مثلاً با جست‌وجوی «محمد جهان‌آرا» زندگی‌نامه، تصاویر، تاریخ شهادت، عملیات‌ها و مستندهای مرتبط در دسترس است." />
      <input value={q} onChange={e => setQ(e.target.value)} autoFocus placeholder="مثلاً: خرمشهر، قطعنامه ۵۹۸، الجزایر، روایت فتح، محمد جهان‌آرا…" className="mb-6 w-full rounded-xl border bg-background px-4 py-3 text-sm" />
      {nq.length >= 2 && <p className="mb-3 text-xs text-muted-foreground">{toFa(total)} نتیجه</p>}
      <div className="space-y-4">
        {results.ops.length > 0 && (
          <div><h4 className="mb-2 text-sm font-extrabold text-primary">عملیات‌ها</h4>
            {results.ops.map(o => <button key={o.id} onClick={() => go('operations', o.id)} className="mb-1.5 block w-full rounded-lg border bg-card/70 p-2.5 text-right text-sm hover:border-primary/50">⚙ {o.faName} <span className="text-xs text-muted-foreground">— {o.region}</span></button>)}
          </div>
        )}
        {results.exps.length > 0 && (
          <div><h4 className="mb-2 text-sm font-extrabold text-primary">تجربه‌های گران‌بها (تجربه‌نگاری)</h4>
            {results.exps.map(e => <button key={e.id} onClick={() => go('experiences', e.opIds[0])} className="mb-1.5 block w-full rounded-lg border bg-card/70 p-2.5 text-right text-sm hover:border-primary/50">🧭 {e.title} <span className="text-xs text-muted-foreground">— {EXPERIENCE_CATEGORIES[e.category].label}</span></button>)}
          </div>
        )}
        {results.evs.length > 0 && (
          <div><h4 className="mb-2 text-sm font-extrabold text-primary">رویدادها</h4>
            {results.evs.map(e => <button key={e.id} onClick={() => go('timeline')} className="mb-1.5 block w-full rounded-lg border bg-card/70 p-2.5 text-right text-sm hover:border-primary/50">📅 {e.faTitle} <span className="text-xs text-muted-foreground">— {e.date}</span></button>)}
          </div>
        )}
        {results.cmds.length > 0 && (
          <div><h4 className="mb-2 text-sm font-extrabold text-primary">فرماندهان</h4>
            {results.cmds.map(c => <button key={c.id} onClick={() => go('commanders')} className="mb-1.5 block w-full rounded-lg border bg-card/70 p-2.5 text-right text-sm hover:border-primary/50">🎖 {c.name} <span className="text-xs text-muted-foreground">— {c.role}</span></button>)}
          </div>
        )}
        {results.terms.length > 0 && (
          <div><h4 className="mb-2 text-sm font-extrabold text-primary">واژه‌نامه</h4>
            {results.terms.map(t => <div key={t.id} className="mb-1.5 rounded-lg border bg-card/70 p-2.5 text-sm">📖 <span className="font-bold">{t.term}</span> — <span className="text-xs text-muted-foreground">{t.definition}</span></div>)}
          </div>
        )}
        {results.mrtrs.length > 0 && (
          <div><h4 className="mb-2 text-sm font-extrabold text-primary">شهدای شاخص</h4>
            {results.mrtrs.map(m => <button key={m.id} onClick={() => go('martyrs')} className="mb-1.5 block w-full rounded-lg border bg-card/70 p-2.5 text-right text-sm hover:border-primary/50">🌙 {m.name} <span className="text-xs text-muted-foreground">— شهادت {m.dateLabel ?? formatJalali(m.martyrdomDate)}، {m.place}</span></button>)}
          </div>
        )}
        {results.media.length > 0 && (
          <div><h4 className="mb-2 text-sm font-extrabold text-primary">آرشیو چندرسانه‌ای</h4>
            {results.media.map(m => <button key={m.id} onClick={() => go('archive')} className="mb-1.5 block w-full rounded-lg border bg-card/70 p-2.5 text-right text-sm hover:border-primary/50">{m.type === 'video' ? '🎬' : '📷'} {m.title} <span className="text-xs text-muted-foreground">— {m.sourceName}</span></button>)}
          </div>
        )}
        {results.treatises.length > 0 && (
          <div><h4 className="mb-2 text-sm font-extrabold text-primary">معاهده‌ها (فصل ریشه‌ها)</h4>
            {results.treatises.map(t => <button key={t.id} onClick={() => go('roots')} className="mb-1.5 block w-full rounded-lg border bg-card/70 p-2.5 text-right text-sm hover:border-primary/50">📜 {t.faName} <span className="text-xs text-muted-foreground">— {t.yearLabel}</span></button>)}
          </div>
        )}
        {results.rf.length > 0 && (
          <div><h4 className="mb-2 text-sm font-extrabold text-primary">روایت فتح (شهید آوینی)</h4>
            {results.rf.map(r => <button key={r.id} onClick={() => go('avini')} className="mb-1.5 block w-full rounded-lg border bg-card/70 p-2.5 text-right text-sm hover:border-primary/50">🎥 {r.topic}</button>)}
          </div>
        )}
        {nq.length >= 2 && total === 0 && <p className="text-sm text-muted-foreground">نتیجه‌ای یافت نشد.</p>}
      </div>
    </div>
  )
}

export function AdminView() {
  const [status, setStatus] = useState<string>('')
  const [note, setNote] = useState<string>('')
  const ops = OPERATIONS.filter(o => o.status !== 'published')
  return (
    <div>
      <SectionHeader kicker="سیستم مدیریت محتوا" title="پنل مدیریت" desc="گردش کار محتوا: پیش‌نویس ← در حال تحقیق ← منبع‌دار ← بررسی تاریخی‌شده ← منتشرشده. هیچ محتوای فاقد منبع به‌عنوان تأییدشده نمایش داده نمی‌شود." />
      <div className="grid gap-3 md:grid-cols-2">
        <Card><CardContent className="p-4">
          <h4 className="mb-2 font-extrabold text-primary">پرونده‌های در گردش کار ({toFa(ops.length)})</h4>
          <div className="max-h-80 space-y-2 overflow-y-auto scrollbar-thin">
            {ops.map(o => (
              <div key={o.id} className="flex items-center justify-between rounded-lg border bg-muted/40 p-2.5 text-sm">
                <span className="font-bold">{o.faName}</span>
                <Badge variant="outline" className="text-[10px]">{o.status === 'under_research' ? 'در حال تحقیق' : 'منبع‌دار'}</Badge>
              </div>
            ))}
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <h4 className="mb-2 font-extrabold text-primary">ثبت اصلاحیه محتوایی</h4>
          <p className="mb-3 text-xs leading-6 text-muted-foreground">اصلاحیه‌ها در پایگاه داده ثبت و برای بررسی تاریخ‌نگار ذخیره می‌شوند (وضعیت: در انتظار تأیید).</p>
          <select onChange={e => setStatus(e.target.value)} className="mb-2 w-full rounded-lg border bg-background px-2 py-2 text-sm">
            <option value="">انتخاب پرونده…</option>
            {OPERATIONS.map(o => <option key={o.id} value={o.id}>{o.faName}</option>)}
          </select>
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="متن اصلاحیه یا ادعای منبع‌دار جدید…" className="mb-2 w-full rounded-lg border bg-background px-3 py-2 text-sm" />
          <Button className="font-bold" disabled={!status || !note.trim()} onClick={async () => {
            try {
              const res = await fetch('/api/cms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ targetId: status, note }) })
              const d = await res.json()
              if (d.success) { setNote(''); alert('✅ اصلاحیه با شناسه ' + d.id + ' ثبت شد (وضعیت: در انتظار تأیید).') }
              else alert('خطا در ثبت: ' + (d.error ?? ''))
            } catch { alert('ارتباط با سرور برقرار نشد.') }
          }}>ثبت در پایگاه داده</Button>
        </CardContent></Card>
      </div>
      <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs leading-6 text-amber-500">⚠ این پنل برای نسخه نمایشی است: ثبت اصلاحیه فعال است اما انتشار نهایی نیازمند نقش «تاریخ‌نگار» در محیط عملیاتی است. برای محیط واقعی، احراز هویت چندسطحی و تاریخچه تغییرات الزامی است.</p>
    </div>
  )
}

export function DocsView({ go }: { go: (v: string, p?: string) => void }) {
  return (
    <div>
      <SectionHeader kicker="مستندات" title="نصب، اجرا، معماری فاز ۲ و راهنمای مدیریت محتوا" />
      <div className="space-y-4 text-sm leading-8">
        <Card><CardContent className="p-5">
          <h4 className="mb-2 font-extrabold text-primary">۱) اجرای محلی</h4>
          <pre className="overflow-x-auto rounded-lg bg-muted/60 p-3 text-xs" dir="ltr">{`bun install\nbun run dev   # http://localhost:3000`}</pre>
          <p className="mt-2 text-xs text-muted-foreground">پشته فناوری: Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + shadcn/ui + Recharts + Prisma/SQLite + z-ai-web-dev-sdk (فقط سمت سرور). نسخه ۲.۰ = فاز ۱ (اطلس و عملیات‌ها) + فاز ۲ (روایت ایرانی، ریشه‌ها، شهدا، آرشیو چندرسانه‌ای).</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <h4 className="mb-2 font-extrabold text-primary">۲) معماری داده — فاز ۱</h4>
          <ul className="list-disc space-y-1 pr-5 text-xs leading-6">
            <li>محتوای منبع‌دار در <code dir="ltr">src/data/*.ts</code> — عملیات‌ها (operations-a/b/c)، رویدادها، فرماندهان، تجهیزات، آمار ادعایی، قطعنامه‌ها، واژه‌نامه، آزمون‌ها.</li>
            <li>هر عدد آماری از نوع <code dir="ltr">StatClaim</code> است: مقدار، واحد، طرف، دوره، منطقه، منبع، روش، درجه اطمینان و توضیح اختلاف.</li>
            <li>داده جغرافیایی مرزها: <code dir="ltr">public/geo/boundaries.json</code> (Natural Earth 1:50m) + شهرها و نمودهای جبهه در <code dir="ltr">src/data/geo.ts</code>.</li>
            <li>اصلاحیه‌های پنل مدیریت در SQLite (Prisma) ذخیره می‌شود.</li>
            <li>تصاویر مزار، پرتره‌ها و گالری به‌صورت محلی نگهداری می‌شوند (<code dir="ltr">public/images/mazar</code> و <code dir="ltr">public/images/arch</code>)؛ منبع اصلی هر تصویر در کپشن ثبت است.</li>
            <li>مرورهای نام‌دار کارشناس تصاویر مزار: ذخیره در مرورگر + پشتیبان بی‌همگام روی سرور (<code dir="ltr">api/reviews</code> ← <code dir="ltr">db/mazar-reviews.json</code>)؛ خاطرات بازدیدکنندگان فقط در مرورگر می‌ماند (حریم خصوصی).</li>
          </ul>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <h4 className="mb-2 font-extrabold text-primary">۳) معماری داده — فاز ۲ (روایت ایرانی و آرشیو)</h4>
          <ul className="list-disc space-y-1 pr-5 text-xs leading-6">
            <li><code dir="ltr">roots.ts</code>: فصل ریشه‌ها — چهار معاهده (ارزروم، قسطنطنیه، ۱۹۳۷، الجزایر)، چهار دوره تاریخی، ماه‌به‌ماه ۱۳۵۹ و خط زمانی ۳۱ شهریور. هر معاهده بخش مستقل «بررسی اسناد و روایت‌های تاریخی» دارد.</li>
            <li><code dir="ltr">narratives.ts</code>: لایه «روایت تاریخی اصلی (چارچوب ایران)» برای عملیات‌های شاخص — سطح الف؛ متن چندمنبعی فاز ۱ = سطح ب؛ فیلد narrativeDiff = سطح ج.</li>
            <li><code dir="ltr">martyrs.ts</code>: پرونده شهدای شاخص با تاریخ راستی‌آزمایی‌شده + جدول MARTYR_RESEARCH (شفاف‌سازی شهادت پس از جنگ، تفکیک چهره شاخص مقاومت از شهید، و دسته‌های نیازمند استخراج آرشیوی).</li>
            <li><code dir="ltr">media-registry.ts</code>: شناسنامه رسانه (بخش ۸.۲) — منبع، مجوز، اصالت، وضعیت بررسی کارشناسی، برچسب واقعی/بازسازی؛ + فهرست آرشیوهای ایرانی/عراقی/بین‌المللی و شرایط استفاده.</li>
            <li><code dir="ltr">avini.ts</code> و <code dir="ltr">saddam.ts</code>: بخش روایت فتح (اتصال مستند به عملیات) و پرونده تصمیم صدام (با سیاست راستی‌آزمایی فیلم).</li>
            <li>جانمایی رسانه: هر عکس/فیلم فقط با ارتباط تاریخی ثبت‌شده (opIds) در صفحه عملیات نمایش داده می‌شود؛ جایی که رسانه نیست، صریحاً اعلام می‌شود و جایگزین نامرتبط قرار نمی‌گیرد.</li>
          </ul>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <h4 className="mb-2 font-extrabold text-primary">۴) توسعه و افزودن پرونده جدید</h4>
          <p className="text-xs leading-6">برای افزودن عملیات، رکورد جدیدی با ساختار <code dir="ltr">Operation</code> به فایل دوره مربوط اضافه کنید؛ تاریخ‌ها را با دو منبع مستقل تطبیق دهید و اگر آمار معتبر نیست، صریحاً «آمار قابل اتکا یافت نشد» بنویسید و وضعیت را <code dir="ltr">under_research</code> بگذارید. برای افزودن شهید، رکورد <code dir="ltr">Martyr</code> را با تاریخ قابل مرتب‌سازی ( martyrdomDate) ثبت کنید؛ برای رسانه، رکورد <code dir="ltr">MediaItem</code> با وضعیت بررسی کارشناسی. موزه هیچ فیلد خالی را با عدد یا تصویر ساختگی پر نمی‌کند.</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <h4 className="mb-2 font-extrabold text-primary">۵) پشتیبان‌گیری و کنترل کیفیت فاز ۲</h4>
          <ul className="list-disc space-y-1 pr-5 text-xs leading-6">
            <li>پشتیبان نسخه پیش از فاز ۲ در پوشه <code dir="ltr">backup/</code> نگهداری می‌شود؛ پشتیبان‌گیری دوره‌ای از <code dir="ltr">src/data/</code> و <code dir="ltr">prisma/db</code> توصیه است.</li>
            <li>تاریخ‌ها: همه تاریخ‌های کلیدی با الگوریتم استاندارد جلالی (scripts/jcheck.mjs) راستی‌آزمایی شده‌اند؛ خطاهای تاریخی یافت‌شده در بازبینی فاز ۲ اصلاح شده‌اند (از جمله ۲۶ شهریور برای لغو توافق الجزایر و ۱۴ خرداد برای اچ-۳).</li>
            <li>گزارش موارد فاقد سند در تالار آرشیو (کارت «گزارش شفافیت») نگهداری می‌شود.</li>
          </ul>
        </CardContent></Card>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => go('sources')} className="font-bold">مشاهده بانک منابع</Button>
          <Button variant="outline" onClick={() => go('archive')} className="font-bold">آرشیو و شناسنامه رسانه‌ها</Button>
          <Button variant="outline" onClick={() => go('admin')} className="font-bold">پنل مدیریت</Button>
        </div>
      </div>
    </div>
  )
}
