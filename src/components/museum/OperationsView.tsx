'use client'

import { useMemo, useState } from 'react'
import { OPERATIONS, RESULT_LABELS, SCALE_LABELS, KIND_LABELS, FRONT_LABELS, SIDE_LABELS, STATUS_LABELS } from '@/data/operations'
import type { Operation } from '@/data/types'
import { formatJalali, toFa } from '@/lib/jalali'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ResultBadge, SideBadge, StatClaimsTable, SourceChips, StatusBadge, SectionHeader, ConfidenceBadge, SafeImage } from './ui-bits'
import { getNarrative } from '@/data/narratives'
import { MARTYRS } from '@/data/martyrs'
import { MEDIA_ITEMS, VIDEO_ITEMS, MEDIA_VERIFICATION_LABELS } from '@/data/media-registry'
import { DOCUMENTARIES } from '@/data/documentaries'
import { RAVAYAT_FATH } from '@/data/avini'
import { BATTLE_MAPS } from '@/data/battle-maps'
import { BattleMap } from './BattleMap'

export function OperationsView({ focusId, go }: { focusId?: string; go: (v: string, p?: string) => void }) {
  const [q, setQ] = useState('')
  const [side, setSide] = useState('all')
  const [result, setResult] = useState('all')
  const [scale, setScale] = useState('all')
  const [yearF, setYearF] = useState('all')
  const [kind, setKind] = useState('all')
  const [selectedId, setSelectedId] = useState<string | undefined>(focusId)

  const filtered = useMemo(() => {
    const norm = (s: string) => s.replace(/[أإآ]/g, 'ا').replace(/ی/g, 'ي').replace(/\u200c/g, ' ')
    const nq = norm(q.trim())
    return OPERATIONS.filter(o => {
      if (side !== 'all' && o.side !== side) return false
      if (result !== 'all' && o.result !== result) return false
      if (scale !== 'all' && o.scale !== scale) return false
      if (yearF !== 'all' && String(o.year) !== yearF) return false
      if (kind !== 'all' && o.kind !== kind) return false
      if (nq && !norm(o.faName + ' ' + o.enName + ' ' + o.region + ' ' + o.tags.join(' ')).includes(nq)) return false
      return true
    })
  }, [q, side, result, scale, yearF, kind])

  if (selectedId) {
    const op = OPERATIONS.find(o => o.id === selectedId)
    if (op) return <OperationDetail op={op} onBack={() => setSelectedId(undefined)} go={go} />
  }

  const select = 'rounded-lg border bg-background px-2 py-1.5 text-xs font-bold'
  return (
    <div>
      <SectionHeader
        kicker="بانک اطلاعات جامع"
        title="اطلس عملیات‌ها"
        desc={`همه پرونده‌ها با ساختار استاندارد: شناسنامه، زمینه تاریخی، روند وقایع، نتیجه و ارزیابی، جدول آمار ادعایی و منابع. ${toFa(OPERATIONS.length)} پرونده ثبت شده است؛ پرونده‌های ناتمام صریحاً «در حال تحقیق» علامت خورده‌اند و برای آن‌ها آمار جعل نمی‌شود.`}
      />
      {/* فیلترها */}
      <div className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border bg-card/60 p-3">
        <Input value={q} onChange={e => setQ(e.target.value)} placeholder="جست‌وجو در عملیات‌ها…" className="w-48 text-sm" />
        <select value={side} onChange={e => setSide(e.target.value)} className={select}>
          <option value="all">همه طرف‌ها</option>
          <option value="iran">ایران</option>
          <option value="iraq">عراق</option>
          <option value="mek">منافقین</option>
          <option value="us">آمریکا</option>
          <option value="israel">اسرائیل</option>
        </select>
        <select value={kind} onChange={e => setKind(e.target.value)} className={select}>
          <option value="all">همه انواع</option>
          {Object.entries(KIND_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={scale} onChange={e => setScale(e.target.value)} className={select}>
          <option value="all">همه مقیاس‌ها</option>
          {Object.entries(SCALE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={result} onChange={e => setResult(e.target.value)} className={select}>
          <option value="all">همه نتایج</option>
          {Object.entries(RESULT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={yearF} onChange={e => setYearF(e.target.value)} className={select}>
          <option value="all">همه سال‌ها</option>
          {[1359, 1360, 1361, 1362, 1363, 1364, 1365, 1366, 1367].map(y => <option key={y} value={y}>{toFa(y)}</option>)}
        </select>
        <span className="mr-auto text-xs font-bold text-muted-foreground">{toFa(filtered.length)} پرونده</span>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {filtered.map(o => (
          <Card key={o.id} className="museum-card cursor-pointer" onClick={() => setSelectedId(o.id)}>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold">{o.faName}</span>
                <ResultBadge r={o.result} />
                <SideBadge side={o.side} />
                {o.status !== 'published' && <StatusBadge s={o.status} />}
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                <span>🗓 {o.faStart ? formatJalali(o.faStart) : 'تاریخ نیازمند راستی‌آزمایی'}{o.faEnd ? ' تا ' + formatJalali(o.faEnd) : ''}</span>
                <span>📍 {o.region}</span>
                <span>🎖 {SCALE_LABELS[o.scale]} • {KIND_LABELS[o.kind]}</span>
              </div>
              <p className="mt-2 line-clamp-2 text-xs leading-6 text-muted-foreground">{o.objectives}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function OperationDetail({ op, onBack, go }: { op: Operation; onBack: () => void; go: (v: string, p?: string) => void }) {
  const related = (op.relatedOps ?? []).map(id => OPERATIONS.find(o => o.id === id)).filter(Boolean) as Operation[]
  const narrative = getNarrative(op.id)
  const opMartyrs = MARTYRS.filter(m => m.opIds.includes(op.id))
  const opMedia = MEDIA_ITEMS.filter(m => m.opIds?.includes(op.id) && m.url)
  const opVideos = VIDEO_ITEMS.filter(m => m.opIds?.includes(op.id))
  const rfLinks = RAVAYAT_FATH.filter(rf => rf.opIds.includes(op.id))
  const docMap: Record<string, string> = { 'bayt-almoghaddas': 'doc-khorramshahr', 'khorramshahr-battle': 'doc-khorramshahr', 'valfajr-8': 'doc-faw', 'mersad': 'doc-mersad', 'forough-javidan': 'doc-mersad', 'iraq-invasion': 'doc-invasion' }
  const relatedDocId = docMap[op.id]
  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" onClick={onBack} className="mb-3 text-primary">→ بازگشت به فهرست</Button>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="museum-title text-2xl md:text-4xl">{op.faName}</h1>
          <ResultBadge r={op.result} />
          <SideBadge side={op.side} />
          <StatusBadge s={op.status} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{op.enName}{op.code ? ` • رمز عملیات: «${op.code}»` : ''}</p>
      </div>

      {/* شناسنامه */}
      <Card>
        <CardContent className="p-4">
          <h3 className="mb-3 font-extrabold text-primary">شناسنامه عملیات</h3>
          <div className="grid gap-x-6 gap-y-2 text-sm md:grid-cols-2">
            {[
              ['تاریخ شروع', op.faStart ? formatJalali(op.faStart) : 'نیازمند راستی‌آزمایی'],
              ['تاریخ پایان', op.faEnd ? formatJalali(op.faEnd) : '—'],
              ['مقیاس', SCALE_LABELS[op.scale]],
              ['نوع', KIND_LABELS[op.kind]],
              ['جبهه', op.fronts.map(f => FRONT_LABELS[f]).join('، ')],
              ['منطقه جغرافیایی', `${op.region} (${op.regionEn})`],
              ['سال', toFa(op.year)],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-2 border-b border-dashed py-1">
                <span className="w-28 shrink-0 text-xs font-bold text-muted-foreground">{k}:</span>
                <span className="font-bold">{v}</span>
              </div>
            ))}
          </div>
          {op.dateNote && <p className="mt-3 rounded-lg bg-amber-500/10 p-2 text-xs leading-6 text-amber-500">🗓 نکته تاریخ‌نگاری: {op.dateNote}</p>}
          {op.commanders.length > 0 && (
            <div className="mt-3">
              <span className="text-xs font-bold text-muted-foreground">فرماندهان شناخته‌شده: </span>
              {op.commanders.map(c => (
                <span key={c.name} className="mr-2 inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-bold">{c.name} <span className="font-normal text-muted-foreground">({c.role})</span></span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* نقشه تاکتیکی اختصاصی نبرد (بخش جدید — فاز نقشه‌های عملیاتی) */}
      {BATTLE_MAPS[op.id] && (
        <div>
          <h3 className="mb-1 font-extrabold text-primary">⚔ نقشه تاکتیکی اختصاصی نبرد</h3>
          <p className="mb-3 text-xs leading-6 text-muted-foreground">زوم روی کل محدوده نبرد، خط تماس جبهه‌ها، پرچم مواضع نیروهای ایران و عراق، محورهای پیشروی و پخش مرحله‌به‌مرحله نبرد — با چرخ ماوس زوم کنید و با درگ جابه‌جا شوید.</p>
          <BattleMap data={BATTLE_MAPS[op.id]} />
        </div>
      )}

      {/* سطح الف — روایت تاریخی اصلی بر اساس چارچوب ایران (فاز ۲، بخش ۱.۱) */}
      {narrative && (
        <Card className="border-teal-500/40">
          <CardContent className="p-5">
            <span className="inline-flex rounded-full border border-teal-500/40 bg-teal-500/10 px-2.5 py-0.5 text-[11px] font-extrabold text-teal-300">الف) روایت تاریخی اصلی — چارچوب تاریخی ایران</span>
            <h3 className="mt-3 mb-2 text-lg font-extrabold">{narrative.headline}</h3>
            <div className="space-y-3 text-[15px] leading-8 text-justify">
              {narrative.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            {narrative.castNote && <p className="mt-2 text-xs text-muted-foreground"><span className="font-bold">نقش‌ها: </span>{narrative.castNote}</p>}
          </CardContent>
        </Card>
      )}

      {/* رسانه‌های جانمایی‌شده در محل متن (فاز ۲، بخش ۴.۲) */}
      {opMedia.length > 0 && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {opMedia.slice(0, 3).map(m => (
            <SafeImage key={m.id} img={{ id: m.id, url: m.url!, title: m.title, sourceName: m.sourceName, sourceUrl: m.sourceUrl, kind: m.authenticity === 'real' ? 'archival' : 'artistic' }} className="aspect-video w-full" />
          ))}
        </div>
      )}

      {/* سه حالت مطالعه (فاز ۲، بخش ۴.۳): متنی / تصویری-اسنادی / مستند */}
      <Tabs defaultValue="text" dir="rtl">
        <TabsList className="mb-3">
          <TabsTrigger value="text">📖 مطالعه متنی</TabsTrigger>
          <TabsTrigger value="docs">🖼 اسناد تصویری {(opMedia.length + opVideos.length) > 0 ? `(${opMedia.length + opVideos.length})` : ''}</TabsTrigger>
          <TabsTrigger value="doc">🎬 مستند</TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-6">
          {/* سطح ب و ج — تحلیل چندمنبعی و اختلاف روایت‌ها */}
          <Card>
            <CardContent className="p-5">
              <Accordion type="multiple" defaultValue={['bg', 'course', 'outcome', 'analysis']} className="w-full">
                <AccordionItem value="bg">
                  <AccordionTrigger className="font-extrabold">زمینه تاریخی و هدف اعلام‌شده (سند چندمنبعی)</AccordionTrigger>
                  <AccordionContent className="space-y-3 leading-7">
                    <p className="text-justify">{op.background}</p>
                    <p className="text-justify"><span className="font-bold text-primary">اهداف: </span>{op.objectives}</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="course">
                  <AccordionTrigger className="font-extrabold">روند کلی وقایع (به ترتیب زمانی)</AccordionTrigger>
                  <AccordionContent>
                    {op.course.length ? (
                      <ol className="list-decimal space-y-2 pr-5 leading-7">
                        {op.course.map((c, i) => <li key={i} className="text-justify">{c}</li>)}
                      </ol>
                    ) : <p className="text-sm text-muted-foreground">روند وقایع این پرونده در حال تکمیل است.</p>}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="outcome">
                  <AccordionTrigger className="font-extrabold">نتیجه نهایی</AccordionTrigger>
                  <AccordionContent className="space-y-3 leading-7">
                    <p className="text-justify">{op.outcome}</p>
                    {op.territorial && <p className="text-justify"><span className="font-bold text-primary">تغییرات سرزمینی: </span>{op.territorial}</p>}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="analysis">
                  <AccordionTrigger className="font-extrabold">تحلیل تاریخی — ارزیابی بر اساس اهداف و نتایج واقعی</AccordionTrigger>
                  <AccordionContent className="space-y-3 leading-7">
                    <p className="text-justify">{op.analysis}</p>
                    {op.narrativeDiff && (
                      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm leading-7">
                        <span className="font-bold text-amber-500">سطح ج — اختلاف روایت‌ها: </span>{op.narrativeDiff}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* جدول آماری */}
          <div>
            <h3 className="mb-3 font-extrabold text-primary">جدول آماری — هر عدد یک ادعای منبع‌دار است</h3>
            <StatClaimsTable claims={op.stats} />
            <p className="mt-2 text-[11px] text-muted-foreground leading-5">کشته، مجروح، اسیر و مفقود در این موزه با هم جمع نمی‌شوند. ارقام اعلامی هر طرف با برچسب «ادعای» مشخص شده‌اند؛ درجه اطمینان: A مستند چندمنبعی، B برآورد با اختلاف محدود، C مورد اختلاف یا فاقد تأیید مستقل.</p>
          </div>

          {/* منابع */}
          <div>
            <h3 className="mb-3 font-extrabold text-primary">منابع و اسناد</h3>
            <SourceChips ids={op.sourceIds} />
          </div>
        </TabsContent>

        <TabsContent value="docs" className="space-y-4">
          {opMedia.length + opVideos.length === 0 ? (
            <div className="rounded-xl border border-dashed p-5 text-sm text-muted-foreground">
              رسانه‌ای با ارتباط تاریخی تأییدشده با این عملیات ثبت نشده است — طبق قاعده فاز ۲، هیچ عکس یا فیلمی بدون بررسی ارتباط تاریخی در کنار عملیات قرار نمی‌گیرد.
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {opMedia.map(m => (
                  <Card key={m.id} className="museum-card overflow-hidden">
                    <SafeImage img={{ id: m.id, url: m.url!, title: m.title, sourceName: m.sourceName, sourceUrl: m.sourceUrl, kind: m.authenticity === 'real' ? 'archival' : 'artistic' }} className="aspect-video w-full" />
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-muted-foreground">{m.verification === 'confirmed' ? MEDIA_VERIFICATION_LABELS.confirmed : MEDIA_VERIFICATION_LABELS['pending-review']}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {opVideos.map(v => (
                <Card key={v.id}><CardContent className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-extrabold">🎬 {v.title}</span>
                    <Badge variant="outline" className="text-[10px]">{v.availability === 'link-only' ? 'پیوند به منبع رسمی' : 'در انتظار آرشیو'}</Badge>
                  </div>
                  <p className="mt-1.5 text-xs leading-6 text-muted-foreground">{v.desc}</p>
                  {v.displayNote && <p className="mt-2 rounded bg-sky-500/10 p-2 text-[11px] leading-5 text-sky-300">ℹ {v.displayNote}</p>}
                  {v.sourceUrl && <a href={v.sourceUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs font-bold text-primary underline">منبع رسمی ↗</a>}
                </CardContent></Card>
              ))}
            </>
          )}
          <Button variant="outline" onClick={() => go('archive')} className="font-bold">آرشیو کامل و شناسنامه رسانه‌ها</Button>
        </TabsContent>

        <TabsContent value="doc" className="space-y-4">
          {relatedDocId ? (
            <Card><CardContent className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="font-extrabold">🎬 {DOCUMENTARIES.find(d => d.id === relatedDocId)?.title}</h4>
                  <p className="text-xs text-muted-foreground">{DOCUMENTARIES.find(d => d.id === relatedDocId)?.subtitle}</p>
                </div>
                <Button size="sm" onClick={() => go('documentaries', relatedDocId)} className="font-bold">مشاهده مستند تعاملی</Button>
              </div>
            </CardContent></Card>
          ) : (
            <div className="rounded-xl border border-dashed p-5 text-sm text-muted-foreground">مستند اختصاصی این عملیات ساخته نشده است؛ مستندهای موجود در تالار مستندها فصل‌بندی موضوعی دارند.</div>
          )}
          {rfLinks.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-extrabold text-primary">مستندهای روایت فتح مرتبط (شهید آوینی)</h4>
              {rfLinks.map(rf => (
                <div key={rf.id} className="rounded-lg border bg-card/60 p-3 text-xs leading-6">
                  🎬 {rf.topic} <Badge variant="outline" className="text-[10px]">{rf.episodeStatus === 'identified' ? 'شناسه‌گذاری‌شده' : 'در انتظار استخراج آرشیوی'}</Badge>
                </div>
              ))}
              <Button size="sm" variant="outline" onClick={() => go('avini')}>بخش ویژه روایت فتح</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* شهدا مرتبط — شبکه اطلاعاتی یکپارچه (فاز ۲، بخش ۶.۵) */}
      {opMartyrs.length > 0 && (
        <div>
          <h3 className="mb-3 font-extrabold text-primary">شهدای این عملیات — پرونده‌های متصل</h3>
          <div className="flex flex-wrap gap-2">
            {opMartyrs.map(m => (
              <Badge key={m.id} variant="outline" className="cursor-pointer py-1.5 hover:border-primary" onClick={() => go('martyrs')}>
                🌙 {m.name} — {m.dateLabel ?? formatJalali(m.martyrdomDate)}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* عملیات مرتبط */}
      {related.length > 0 && (
        <div>
          <h3 className="mb-3 font-extrabold text-primary">عملیات‌های مرتبط</h3>
          <div className="flex flex-wrap gap-2">
            {related.map(r => (
              <Badge key={r.id} variant="outline" className="cursor-pointer py-1.5 hover:border-primary" onClick={() => { onBack(); setTimeout(() => window.dispatchEvent(new CustomEvent('museum-open-op', { detail: r.id })), 0) }}>
                {r.faName} <ResultBadge r={r.result} />
              </Badge>
            ))}
          </div>
        </div>
      )}
      <div className="text-center">
        <Button variant="outline" onClick={() => go('atlas')} className="font-bold">🗺 مشاهده این عملیات روی نقشه</Button>
      </div>
    </div>
  )
}
