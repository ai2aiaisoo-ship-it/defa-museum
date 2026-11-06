'use client'

import { useState } from 'react'
import { COMMANDERS } from '@/data/commanders'
import { ORGANIZATIONS } from '@/data/organizations'
import { EQUIPMENT, CAPTURES_SUMMARY } from '@/data/equipment'
import { RESOLUTIONS, FOREIGN_POWERS } from '@/data/resolutions'
import { SIDE_LABELS, CONFIDENCE_LABELS } from '@/data/operations'
import { getSource } from '@/data/sources'
import { toFa, formatJalali } from '@/lib/jalali'
import { OPERATIONS } from '@/data/operations'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SideBadge, SectionHeader, SourceChips, ConfidenceBadge } from './ui-bits'

export function CommandersView({ go }: { go: (v: string, p?: string) => void }) {
  const [side, setSide] = useState('all')
  const list = COMMANDERS.filter(c => side === 'all' || c.side === side)
  return (
    <div>
      <SectionHeader kicker="پرونده شخصیت‌ها" title="فرماندهان و چهره‌های تاریخی" desc="برای هر شخص: سمت دوره جنگ، نقش تاریخی، تصمیم‌های مهم، عملیات‌های مرتبط و روایت‌های متفاوت درباره عملکرد." />
      <div className="mb-4 flex flex-wrap gap-2">
        {['all', 'iran', 'iraq', 'mek'].map(s => (
          <button key={s} onClick={() => setSide(s)} className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${side === s ? 'border-primary bg-primary/15 text-primary' : 'border-border bg-card/60'}`}>
            {s === 'all' ? 'همه' : SIDE_LABELS[s]}
          </button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {list.map(c => (
          <Card key={c.id} className="museum-card">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-extrabold">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">{c.role} • {c.org}</p>
                  {(c.birth || c.death) && <p className="mt-0.5 text-[11px] text-muted-foreground">{c.birth ?? ''}{c.death ? ` — ${c.death}` : ''}</p>}
                </div>
                <SideBadge side={c.side} />
              </div>
              <p className="mt-3 text-sm leading-7 text-justify">{c.bio}</p>
              <Accordion type="single" collapsible className="mt-2">
                <AccordionItem value="role">
                  <AccordionTrigger className="text-sm font-bold">نقش در تحولات جنگ</AccordionTrigger>
                  <AccordionContent className="text-sm leading-7">{c.warRole}</AccordionContent>
                </AccordionItem>
                {c.decisions.length > 0 && (
                  <AccordionItem value="dec">
                    <AccordionTrigger className="text-sm font-bold">تصمیم‌های مهم</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc space-y-1 pr-5 text-sm leading-7">{c.decisions.map((d, i) => <li key={i}>{d}</li>)}</ul>
                    </AccordionContent>
                  </AccordionItem>
                )}
                {c.controversies && (
                  <AccordionItem value="cont">
                    <AccordionTrigger className="text-sm font-bold">روایت‌های متفاوت و انتقادها</AccordionTrigger>
                    <AccordionContent className="text-sm leading-7">{c.controversies}</AccordionContent>
                  </AccordionItem>
                )}
                <AccordionItem value="ops">
                  <AccordionTrigger className="text-sm font-bold">عملیات‌های مرتبط</AccordionTrigger>
                  <AccordionContent className="flex flex-wrap gap-2">
                    {c.relatedOps.map(id => {
                      const op = OPERATIONS.find(o => o.id === id)
                      return op ? <Badge key={id} variant="outline" className="cursor-pointer hover:border-primary" onClick={() => go('operations', id)}>{op.faName}</Badge> : null
                    })}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="mt-2"><SourceChips ids={c.sourceIds} /></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function ForcesView() {
  return (
    <div>
      <SectionHeader kicker="نیروها" title="سازمان‌ها و سازمان‌های نظامی" desc="تکامل ساختاری هر سازمان در طول هشت سال جنگ." />
      <div className="grid gap-4 md:grid-cols-2">
        {ORGANIZATIONS.map(o => (
          <Card key={o.id} className="museum-card">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-extrabold">{o.name}</h3>
                <SideBadge side={o.side} />
              </div>
              <p className="text-xs text-muted-foreground">{o.type} • تأسیس: {o.founded}</p>
              <p className="mt-2 text-sm leading-7 text-justify">{o.desc}</p>
              <div className="mt-2">
                <div className="text-xs font-bold text-muted-foreground mb-1">مسیر تکامل در جنگ:</div>
                <ul className="list-disc space-y-1 pr-5 text-xs leading-6">{o.warEvolution.map((w, i) => <li key={i}>{w}</li>)}</ul>
              </div>
              <div className="mt-2"><SourceChips ids={o.sourceIds} /></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function EquipmentView() {
  const cats = [
    { k: 'aircraft', l: 'هواپیماها' }, { k: 'tank', l: 'تانک‌ها' }, { k: 'naval', l: 'شناورها' },
    { k: 'missile', l: 'موشک‌ها' }, { k: 'chemical', l: 'سلاح شیمیایی' },
  ]
  return (
    <div>
      <SectionHeader
        kicker="پایگاه تجهیزات"
        title="تجهیزات، غنائم و خسارات"
        desc="تفکیک مفاهیم: انهدام قطعی ≠ آسیب‌دیدگی ≠ رهاشدن ≠ به‌غنیمت‌گرفتن ≠ ادعای انهدام تأییدنشده. این موزه از جزئیات فنی که به کاربرد عملی تجهیزات کمک کند پرهیز می‌کند."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {EQUIPMENT.map(e => (
          <Card key={e.id} className="museum-card">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-extrabold">{e.name}</h3>
                  <p className="text-xs text-muted-foreground">{e.enName} • ساخت: {e.origin}</p>
                </div>
                <SideBadge side={e.user} />
              </div>
              <p className="mt-2 text-sm leading-7 text-justify">{e.desc}</p>
              <div className="mt-3 space-y-2">
                {e.reportedNumbers.map((n, i) => (
                  <div key={i} className="rounded-lg bg-muted/50 p-2.5 text-xs leading-6">
                    <div className="flex items-center gap-2"><span className="font-extrabold">{n.value}</span><ConfidenceBadge c={n.confidence} /></div>
                    <div className="text-muted-foreground">{n.note} — منبع: {n.sourceId}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6">
        <SectionHeader kicker="غنائم" title="خلاصه غنائم و خسارات مستند" />
        <div className="grid gap-3 md:grid-cols-2">
          {CAPTURES_SUMMARY.map((c, i) => (
            <Card key={i}><CardContent className="p-4">
              <div className="flex items-center gap-2"><span className="font-extrabold">{c.title}</span><ConfidenceBadge c={c.confidence as 'A' | 'B' | 'C'} /></div>
              <p className="mt-1 text-sm leading-7">{c.text}</p>
            </CardContent></Card>
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        {cats.map(c => <Badge key={c.k} variant="outline">{c.l}</Badge>)}
      </div>
    </div>
  )
}

export function ResolutionsView() {
  return (
    <div>
      <SectionHeader kicker="دیپلماسی جنگ" title="قطعنامه‌های شورای امنیت" desc="از ۴۷۹ تا ۵۹۸ — مسیر پانزده قطعنامه و پاسخ متفاوت دو طرف." />
      <div className="space-y-3">
        {RESOLUTIONS.map(r => (
          <Card key={r.id} className="museum-card">
            <CardContent className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="font-extrabold">قطعنامه {toFa(r.number)}</Badge>
                <Badge variant="outline" className="font-bold">{formatJalaliSafe(r.date)}</Badge>
                <span className="text-xs text-muted-foreground">{r.gDate}</span>
              </div>
              <h3 className="mt-2 text-lg font-extrabold text-primary">{r.title}</h3>
              <ul className="mt-2 list-disc space-y-1 pr-5 text-sm leading-7">{r.summary.map((s, i) => <li key={i}>{s}</li>)}</ul>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border bg-muted/40 p-3 text-sm leading-7"><span className="font-extrabold text-teal-400">ایران: </span>{r.iranResponse}</div>
                <div className="rounded-lg border bg-muted/40 p-3 text-sm leading-7"><span className="font-extrabold text-amber-400">عراق: </span>{r.iraqResponse}</div>
              </div>
              <div className="mt-2"><SourceChips ids={r.sourceIds} /></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
function formatJalaliSafe(d: string) {
  try { return formatJalali(d) } catch { return d }
}

export function ForeignView() {
  return (
    <div>
      <SectionHeader kicker="بازیگران بین‌المللی" title="نقش کشورهای خارجی" desc="از تأمین سلاح تا اطلاعات ماهواره‌ای، وام‌های جنگی و مداخله مستقیم در خلیج فارس." />
      <div className="grid gap-4 md:grid-cols-2">
        {FOREIGN_POWERS.map(f => (
          <Card key={f.id} className="museum-card">
            <CardContent className="p-5">
              <h3 className="text-lg font-extrabold">{f.name}</h3>
              <Badge variant="outline" className="mt-1">{f.stance}</Badge>
              <p className="mt-3 text-sm leading-7 text-justify">{f.desc}</p>
              <div className="mt-2">
                <div className="mb-1 text-xs font-bold text-muted-foreground">اقدام‌های کلیدی:</div>
                <ul className="list-disc space-y-1 pr-5 text-xs leading-6">{f.keyActions.map((a, i) => <li key={i}>{a}</li>)}</ul>
              </div>
              <div className="mt-2"><SourceChips ids={f.sourceIds} /></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
