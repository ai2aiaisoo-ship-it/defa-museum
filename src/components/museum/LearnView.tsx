'use client'

import { useEffect, useMemo, useState } from 'react'
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

/** شناسایی شهر روی نقشه — آزمون نقشه با زمینِ همان نقشه اطلس (GeoJSON مرزها + پروجکشن یکسان) */
interface BoundaryFC { type: 'FeatureCollection'; features: { properties: { en: string; fa: string }; geometry: { type: string; coordinates: number[][][] | number[][][][] } }[] }

// هم‌عرض با MapAtlas — پروجکشن اکویی‌رکتانگولار روی محدوده ایران و عراق
const Q_LON_MIN = 42.5, Q_LON_MAX = 62.5, Q_LAT_MIN = 24.2, Q_LAT_MAX = 40.8
const Q_W = 1000, Q_H = Math.round((Q_W * (Q_LAT_MAX - Q_LAT_MIN)) / (Q_LON_MAX - Q_LON_MIN))
const qpx = (lng: number) => ((lng - Q_LON_MIN) / (Q_LON_MAX - Q_LON_MIN)) * Q_W
const qpy = (lat: number) => ((Q_LAT_MAX - lat) / (Q_LAT_MAX - Q_LAT_MIN)) * Q_H

let qBoundaryCache: Promise<BoundaryFC | null> | null = null
function loadBoundaries(): Promise<BoundaryFC | null> {
  if (!qBoundaryCache) {
    qBoundaryCache = fetch('/geo/boundaries.json').then(r => (r.ok ? r.json() : null)).catch(() => null)
  }
  return qBoundaryCache
}

function qRingToPath(ring: number[][]): string {
  return ring.map((c, i) => `${i === 0 ? 'M' : 'L'}${qpx(c[0]).toFixed(1)},${qpy(c[1]).toFixed(1)}`).join(' ') + ' Z'
}
function qGeomToPaths(geom: { type: string; coordinates: unknown }): string[] {
  if (geom.type === 'Polygon') return (geom.coordinates as number[][][]).map(qRingToPath)
  return (geom.coordinates as number[][][][]).map(poly => poly.map(qRingToPath).join(' '))
}

export function MapQuizView() {
  const [idx, setIdx] = useState(0)
  const [msg, setMsg] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [asked, setAsked] = useState(0)
  const [pickedId, setPickedId] = useState<string | null>(null)
  const [bnd, setBnd] = useState<BoundaryFC | null>(null)
  useEffect(() => { let alive = true; loadBoundaries().then(b => { if (alive) setBnd(b) }); return () => { alive = false } }, [])
  const pool = CITIES.filter(c => c.importance.length > 20)
  const target = pool[idx % pool.length]
  const options = useMemo(() => {
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 7)
    if (!shuffled.includes(target)) shuffled[0] = target
    return shuffled.sort(() => Math.random() - 0.5)
  }, [idx, pool, target])

  const pick = (o: (typeof pool)[number]) => {
    if (pickedId) return
    setPickedId(o.id)
    setAsked(a => a + 1)
    if (o.id === target.id) {
      setScore(s => s + 1)
      setMsg(`✅ درست! ${o.importance}`)
      setTimeout(() => { setIdx(i => i + 1); setMsg(null); setPickedId(null) }, 1800)
    } else {
      setMsg(`❌ این ${o.fa} بود. پاسخ درست: ${target.fa}`)
    }
  }

  return (
    <Card className="mx-auto max-w-3xl"><CardContent className="p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-extrabold">کدام دایره «{target.fa}» است؟ ({toFa(target.lat.toFixed(1))}، {toFa(target.lng.toFixed(1))})</h3>
        <Badge variant="outline" className="text-[10px]">نمره: {toFa(score)} از {toFa(asked)}</Badge>
      </div>
      <svg viewBox={`0 0 ${Q_W} ${Q_H}`} className="mx-auto block w-full max-w-xl rounded-xl border" role="img" aria-label="نقشه ایران برای آزمون شناسایی شهرها">
        <defs>
          <radialGradient id="qSea" cx="20%" cy="90%" r="80%">
            <stop offset="0%" stopColor="oklch(0.35 0.06 230)" />
            <stop offset="100%" stopColor="oklch(0.22 0.03 240)" />
          </radialGradient>
        </defs>
        <rect width={Q_W} height={Q_H} fill="url(#qSea)" />
        {bnd?.features.map(f => (
          <path key={f.properties.en} d={qGeomToPaths(f.geometry).join(' ')} fill="oklch(0.30 0.02 90)" stroke="oklch(0.55 0.03 80 / 0.5)" strokeWidth="1" />
        ))}
        {bnd?.features.filter(f => f.properties.en === 'Iran' || f.properties.en === 'Iraq').map(f => (
          <path key={'qb-' + f.properties.en} d={qGeomToPaths(f.geometry).join(' ')} fill="none" stroke="oklch(0.8 0.1 85 / 0.55)" strokeWidth="1.6" strokeDasharray="6 4" />
        ))}
        <text x={qpx(53.5)} y={qpy(32.6)} fill="oklch(0.85 0.02 90 / 0.5)" fontSize="30" fontWeight="800" textAnchor="middle">ایران</text>
        <text x={qpx(48.6)} y={qpy(25.3)} fill="oklch(0.7 0.06 230 / 0.8)" fontSize="18" fontWeight="700" textAnchor="middle">خلیج فارس</text>
        {options.map(o => {
          const cx = qpx(o.lng), cy = qpy(o.lat)
          const state = !pickedId ? 'idle' : o.id === target.id ? 'target' : o.id === pickedId ? 'wrong' : 'dim'
          return (
            <g key={o.id} className="cursor-pointer" onClick={() => pick(o)} role="button" aria-label={`گزینه ${o.fa}`}>
              {state === 'target' && <circle cx={cx} cy={cy} r="22" fill="none" stroke="oklch(0.75 0.15 155)" strokeWidth="3" className="bm-pulse" />}
              <circle
                cx={cx} cy={cy} r={state === 'target' ? 12 : 9}
                fill={state === 'target' ? 'oklch(0.72 0.15 155)' : state === 'wrong' ? 'oklch(0.62 0.19 25)' : state === 'dim' ? 'oklch(0.75 0.04 90 / 0.45)' : 'gold'}
                stroke={state === 'wrong' ? 'oklch(0.5 0.19 25)' : 'black'}
              />
              <text x={cx + 14} y={cy + 4} fill={state === 'dim' ? 'oklch(0.8 0.02 90 / 0.4)' : 'white'} fontSize="17" fontWeight={state === 'target' ? 800 : 500}>{o.fa}</text>
            </g>
          )
        })}
      </svg>
      {msg && (
        <p className={`mt-3 rounded-lg border p-2.5 text-sm font-bold leading-6 ${msg.startsWith('✅') ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/40 bg-rose-500/10 text-rose-300'}`}>{msg}</p>
      )}
      {pickedId && pickedId !== target.id && (
        <div className="mt-2 text-center">
          <Button size="sm" onClick={() => { setIdx(i => i + 1); setMsg(null); setPickedId(null) }} className="font-bold">سؤال بعدی ←</Button>
        </div>
      )}
      <p className="mt-3 text-[10.5px] leading-5 text-muted-foreground">زمینه نقشه، همان جغرافیای واقعی «اطلس نقشه تعاملی» موزه است؛ مختصات کنار پرسش، عرض/طول جغرافیایی شهر است — با نقشه واقعی، خواندن مختصات را تمرین کنید.</p>
    </CardContent></Card>
  )
}
