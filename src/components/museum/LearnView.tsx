'use client'

import { useMemo, useState } from 'react'
import { QUIZZES } from '@/data/glossary'
import { GLOSSARY } from '@/data/glossary'
import { OPERATIONS } from '@/data/operations'
import { CITIES } from '@/data/geo'
import { toFa } from '@/lib/jalali'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { SectionHeader, SourceChips } from './ui-bits'

const LEVELS = [
  { k: 'general', l: 'عمومی' }, { k: 'student', l: 'دانش‌آموزی' },
  { k: 'enthusiast', l: 'علاقه‌مندان تاریخ' }, { k: 'researcher', l: 'پژوهشگر' },
]

export function LearnView() {
  const [level, setLevel] = useState('general')
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [flashMode, setFlashMode] = useState(false)

  const qs = useMemo(() => QUIZZES.filter(q => q.level === level), [level])
  const q = qs[idx]

  const answer = (i: number) => {
    if (picked !== null) return
    setPicked(i)
    if (i === q.correct) setScore(s => s + 1)
  }
  const next = () => {
    if (idx + 1 >= qs.length) setDone(true)
    else { setIdx(i => i + 1); setPicked(null) }
  }
  const restart = () => { setIdx(0); setPicked(null); setScore(0); setDone(false) }

  return (
    <div>
      <SectionHeader kicker="آموزش تعاملی" title="آزمون و فلش‌کارت" desc="بعد از هر پاسخ، توضیح درست همراه با منبع نمایش داده می‌شود. سطوح: عمومی، دانش‌آموزی، علاقه‌مندان تاریخ و پژوهشگر." />
      <div className="mb-4 flex flex-wrap gap-2">
        {LEVELS.map(l => (
          <button key={l.k} onClick={() => { setLevel(l.k); restart(); setFlashMode(false) }} className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${level === l.k && !flashMode ? 'border-primary bg-primary/15 text-primary' : 'border-border bg-card/60'}`}>{l.l}</button>
        ))}
        <button onClick={() => setFlashMode(true)} className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${flashMode ? 'border-primary bg-primary/15 text-primary' : 'border-border bg-card/60'}`}>🗂 فلش‌کارت عملیات‌ها</button>
      </div>

      {flashMode ? <FlashCards /> : done ? (
        <Card className="mx-auto max-w-xl"><CardContent className="p-8 text-center">
          <div className="text-4xl font-extrabold text-primary">{toFa(score)} / {toFa(qs.length)}</div>
          <p className="mt-2 text-sm text-muted-foreground">نمره شما در سطح «{LEVELS.find(l => l.k === level)?.l}»</p>
          <Button onClick={restart} className="mt-4 font-bold">آزمون مجدد</Button>
        </CardContent></Card>
      ) : q ? (
        <Card className="mx-auto max-w-2xl"><CardContent className="p-6">
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>سؤال {toFa(idx + 1)} از {toFa(qs.length)}</span>
            <span>امتیاز: {toFa(score)}</span>
          </div>
          <Progress value={((idx + (picked !== null ? 1 : 0)) / qs.length) * 100} className="mb-4" />
          <h3 className="mb-4 text-lg font-extrabold leading-8">{q.question}</h3>
          <div className="space-y-2">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correct
              const chosen = picked === i
              return (
                <button key={i} onClick={() => answer(i)} disabled={picked !== null}
                  className={`w-full rounded-xl border p-3 text-right text-sm transition-colors ${picked === null ? 'hover:border-primary/60' : chosen && isCorrect ? 'border-emerald-500 bg-emerald-500/10' : chosen ? 'border-rose-500 bg-rose-500/10' : isCorrect && picked !== null ? 'border-emerald-500/60 bg-emerald-500/5' : 'border-border'}`}>
                  <span className="font-bold">{['الف', 'ب', 'پ', 'ت'][i]}) </span>{opt}
                </button>
              )
            })}
          </div>
          {picked !== null && (
            <div className="mt-4 rounded-xl border bg-muted/50 p-4 text-sm leading-7">
              <div className="font-extrabold text-primary mb-1">{picked === q.correct ? '✅ درست!' : '❌ پاسخ درست: ' + ['الف', 'ب', 'پ', 'ت'][q.correct]}</div>
              <p>{q.explanation}</p>
              <div className="mt-2"><span className="text-xs font-bold text-muted-foreground">منبع: </span><SourceChips ids={q.sourceIds} /></div>
              <Button onClick={next} className="mt-3 font-bold">سؤال بعدی ←</Button>
            </div>
          )}
        </CardContent></Card>
      ) : (
        <p className="text-sm text-muted-foreground">سؤالی در این سطح موجود نیست.</p>
      )}
    </div>
  )
}

function FlashCards() {
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const cards = OPERATIONS.filter(o => o.status !== 'under_research')
  const c = cards[i % cards.length]
  return (
    <Card className="mx-auto max-w-2xl"><CardContent className="p-6 text-center">
      <button onClick={() => setFlipped(f => !f)} className="min-h-[220px] w-full rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 p-6">
        {!flipped ? (
          <div>
            <div className="text-xs font-bold text-muted-foreground mb-2">کارت {toFa((i % cards.length) + 1)} از {toFa(cards.length)} — برای دیدن پاسخ کلیک کنید</div>
            <div className="text-2xl font-extrabold">{c.faName}</div>
            <div className="mt-2 text-sm text-muted-foreground">{c.region}</div>
          </div>
        ) : (
          <div className="text-right">
            <div className="mb-2 text-sm font-extrabold text-primary">{c.faStart ? 'تاریخ: ' + c.faStart.replace('-', '/').replace('-', '/') : 'تاریخ نیازمند راستی‌آزمایی'}</div>
            <p className="text-sm leading-7">{c.outcome}</p>
            <div className="mt-2 text-xs text-muted-foreground">هدف: {c.objectives}</div>
          </div>
        )}
      </button>
      <div className="mt-4 flex justify-center gap-2">
        <Button variant="outline" onClick={() => { setI(x => (x + cards.length - 1) % cards.length); setFlipped(false) }}>→ قبلی</Button>
        <Button onClick={() => { setI(x => (x + 1) % cards.length); setFlipped(false) }} className="font-bold">کارت بعدی ←</Button>
      </div>
    </CardContent></Card>
  )
}

export function GlossaryView() {
  const [q, setQ] = useState('')
  const list = GLOSSARY.filter(g => !q || g.term.includes(q) || g.definition.includes(q))
  return (
    <div>
      <SectionHeader kicker="واژه‌نامه تاریخی" title="واژگان و مفاهیم" />
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="جست‌وجوی واژه…" className="mb-4 w-full max-w-md rounded-lg border bg-background px-3 py-2 text-sm" />
      <div className="grid gap-3 md:grid-cols-2">
        {list.map(g => (
          <Card key={g.id} className="museum-card"><CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-primary">{g.term}</span>
              <Badge variant="outline" className="text-[10px]">{g.category}</Badge>
            </div>
            <p className="mt-2 text-sm leading-7">{g.definition}</p>
          </CardContent></Card>
        ))}
      </div>
    </div>
  )
}

/** شناسایی شهر روی نقشه — آزمون نقشه ساده */
export function MapQuizView() {
  const [idx, setIdx] = useState(0)
  const [msg, setMsg] = useState<string | null>(null)
  const pool = CITIES.filter(c => c.importance.length > 20)
  const target = pool[idx % pool.length]
  const options = useMemo(() => {
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 7)
    if (!shuffled.includes(target)) shuffled[0] = target
    return shuffled.sort(() => Math.random() - 0.5)
  }, [idx, pool, target])
  return (
    <Card className="mx-auto max-w-2xl"><CardContent className="p-6 text-center">
      <h3 className="mb-3 font-extrabold">کدام دایره «{target.fa}» است؟ ({toFa(target.lat.toFixed(1))}، {toFa(target.lng.toFixed(1))})</h3>
      <svg viewBox="0 0 1000 800" className="mx-auto w-full max-w-xl rounded-xl border bg-slate-800">
        {options.map(o => (
          <g key={o.id} className="cursor-pointer" onClick={() => {
            setMsg(o.id === target.id ? `✅ درست! ${o.importance}` : `❌ این ${o.fa} بود. پاسخ: ${target.fa}`)
            if (o.id === target.id) setTimeout(() => { setIdx(i => i + 1); setMsg(null) }, 1600)
          }}>
            <circle cx={((o.lng - 42.5) / 20) * 1000} cy={((40.8 - o.lat) / 16.6) * 800} r="10" fill="gold" stroke="black" />
            <text x={((o.lng - 42.5) / 20) * 1000 + 14} y={((40.8 - o.lat) / 16.6) * 800 + 4} fill="white" fontSize="16">{o.fa}</text>
          </g>
        ))}
      </svg>
      {msg && <p className="mt-3 text-sm font-bold">{msg}</p>}
    </CardContent></Card>
  )
}
