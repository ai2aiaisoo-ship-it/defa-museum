'use client'

import { useEffect, useMemo, useState } from 'react'
import { CITIES, RIVERS, FRONT_SNAPSHOTS, OP_ARROWS } from '@/data/geo'
import { OPERATIONS } from '@/data/operations'
import type { Operation } from '@/data/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toFa, MONTHS_FA } from '@/lib/jalali'

// ─── پروجکشن ساده اکویی‌رکتانگولار روی محدوده ایران و عراق ───
const LON_MIN = 42.5, LON_MAX = 62.5, LAT_MIN = 24.2, LAT_MAX = 40.8
const W = 1000, H = Math.round((W * (LAT_MAX - LAT_MIN)) / (LON_MAX - LON_MIN))
const px = (lng: number) => ((lng - LON_MIN) / (LON_MAX - LON_MIN)) * W
const py = (lat: number) => ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * H

interface BoundaryFC { type: 'FeatureCollection'; features: { properties: { en: string; fa: string }; geometry: { type: string; coordinates: number[][][] | number[][][][] } }[] }

function ringToPath(ring: number[][]): string {
  return ring.map((c, i) => `${i === 0 ? 'M' : 'L'}${px(c[0]).toFixed(1)},${py(c[1]).toFixed(1)}`).join(' ') + ' Z'
}
function geomToPaths(geom: { type: string; coordinates: unknown }): string[] {
  if (geom.type === 'Polygon') return (geom.coordinates as number[][][]).map(ringToPath)
  return (geom.coordinates as number[][][][]).map(poly => poly.map(ringToPath).join(' '))
}

export interface MapAtlasProps {
  compact?: boolean
  onSelectOperation?: (op: Operation) => void
}

export function MapAtlas({ compact = false, onSelectOperation }: MapAtlasProps) {
  const [bnd, setBnd] = useState<BoundaryFC | null>(null)
  const [year, setYear] = useState(1361)
  const [month, setMonth] = useState(3)
  const [layers, setLayers] = useState({ borders: true, rivers: true, cities: true, ops: true, fronts: true, arrows: true })
  const [compare, setCompare] = useState(false)
  const [compareYear, setCompareYear] = useState(1367)
  const [selected, setSelected] = useState<{ kind: 'city' | 'op'; id: string } | null>(null)
  const [hoverTip, setHoverTip] = useState<{ x: number; y: number; text: string } | null>(null)

  useEffect(() => {
    fetch('/geo/boundaries.json').then(r => r.json()).then(setBnd).catch(() => setBnd(null))
  }, [])

  const years = [1359, 1360, 1361, 1362, 1363, 1364, 1365, 1366, 1367]

  const opsByYear = useMemo(() => {
    const m = new Map<number, Operation[]>()
    OPERATIONS.forEach(o => {
      if (!o.faStart && o.status === 'under_research') return
      if (!m.has(o.year)) m.set(o.year, [])
      m.get(o.year)!.push(o)
    })
    return m
  }, [])

  const snapshotFor = (y: number) => FRONT_SNAPSHOTS.reduce((best, s) => (s.year <= y && (!best || s.year > best.year) ? s : best), undefined as typeof FRONT_SNAPSHOTS[number] | undefined)

  const activeOps = opsByYear.get(year) ?? []
  const snap = snapshotFor(year)
  const cmpSnap = snapshotFor(compareYear)

  const layerBtn = (key: keyof typeof layers, label: string) => (
    <button
      key={key}
      onClick={() => setLayers(l => ({ ...l, [key]: !l[key] }))}
      className={`rounded-lg border px-2.5 py-1 text-xs font-bold transition-colors ${layers[key] ? 'border-primary/60 bg-primary/15 text-primary' : 'border-border bg-muted/40 text-muted-foreground'}`}
    >
      {layers[key] ? '✓ ' : ''}{label}
    </button>
  )

  const renderMap = (y: number, m: number, isCompare: boolean) => {
    const s = isCompare ? cmpSnap : snap
    const ops = (opsByYear.get(y) ?? []).filter(o => o.faStart?.slice(5, 7).length)
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" role="img" aria-label={`نقشه جنگ در سال ${toFa(y)}`}>
        <defs>
          <radialGradient id="seaGrad" cx="20%" cy="90%" r="80%">
            <stop offset="0%" stopColor="oklch(0.35 0.06 230)" />
            <stop offset="100%" stopColor="oklch(0.22 0.03 240)" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#seaGrad)" />
        {/* خشکی‌ها */}
        {bnd?.features.map(f => (
          <path key={f.properties.en} d={geomToPaths(f.geometry).join(' ')} fill="oklch(0.30 0.02 90)" stroke="oklch(0.55 0.03 80 / 0.5)" strokeWidth="1" />
        ))}
        {/* مرز ایران و عراق پررنگ */}
        {bnd?.features.filter(f => f.properties.en === 'Iran' || f.properties.en === 'Iraq').map(f => (
          <path key={'b-' + f.properties.en} d={geomToPaths(f.geometry).join(' ')} fill="none" stroke="oklch(0.8 0.1 85 / 0.55)" strokeWidth="1.6" strokeDasharray="6 4" />
        ))}
        {/* نام کشورها */}
        <text x={px(53.5)} y={py(32.6)} fill="oklch(0.85 0.02 90 / 0.55)" fontSize="26" fontWeight="800" textAnchor="middle">ایران</text>
        <text x={px(43.4)} y={py(33.4)} fill="oklch(0.85 0.02 90 / 0.55)" fontSize="24" fontWeight="800" textAnchor="middle">عراق</text>
        <text x={px(48.6)} y={py(25.3)} fill="oklch(0.7 0.06 230 / 0.8)" fontSize="17" fontWeight="700" textAnchor="middle">خلیج فارس</text>
        {/* مناطق کنترلی تقریبی */}
        {layers.fronts && s && (
          <g>
            {s.iraqInIran.map(z => (
              <g key={z.name}>
                <path d={z.ring.map((c, i) => `${i === 0 ? 'M' : 'L'}${px(c[0]).toFixed(1)},${py(c[1]).toFixed(1)}`).join(' ') + ' Z'} fill="oklch(0.62 0.17 60 / 0.30)" stroke="oklch(0.75 0.15 60)" strokeWidth="1.4" strokeDasharray="5 3" />
                <text x={px(z.ring.reduce((a, c) => a + c[0], 0) / z.ring.length)} y={py(z.ring.reduce((a, c) => a + c[1], 0) / z.ring.length)} fill="oklch(0.9 0.1 70)" fontSize="12" fontWeight="700" textAnchor="middle">اشغال عراق</text>
              </g>
            ))}
            {s.iranInIraq.map(z => (
              <g key={z.name}>
                <path d={z.ring.map((c, i) => `${i === 0 ? 'M' : 'L'}${px(c[0]).toFixed(1)},${py(c[1]).toFixed(1)}`).join(' ') + ' Z'} fill="oklch(0.6 0.13 165 / 0.32)" stroke="oklch(0.75 0.13 165)" strokeWidth="1.4" strokeDasharray="5 3" />
                <text x={px(z.ring.reduce((a, c) => a + c[0], 0) / z.ring.length)} y={py(z.ring.reduce((a, c) => a + c[1], 0) / z.ring.length)} fill="oklch(0.9 0.08 165)" fontSize="12" fontWeight="700" textAnchor="middle">تصرف ایران</text>
              </g>
            ))}
          </g>
        )}
        {/* رودها */}
        {layers.rivers && RIVERS.map(r => (
          <g key={r.id}>
            <path d={r.path.map((c, i) => `${i === 0 ? 'M' : 'L'}${px(c[0]).toFixed(1)},${py(c[1]).toFixed(1)}`).join(' ')} fill="none" stroke="oklch(0.6 0.09 230 / 0.85)" strokeWidth="2.2" strokeLinecap="round" />
            <text x={px(r.path[1][0])} y={py(r.path[1][1]) - 6} fill="oklch(0.75 0.06 230)" fontSize="12" textAnchor="middle">{r.fa}</text>
          </g>
        ))}
        {/* پیکان‌های شماتیک عملیات‌ها */}
        {layers.arrows && !isCompare && OP_ARROWS.filter(a => a.year === y).map(a => {
          const [p1, p2] = a.points
          const x1 = px(p1[1]), y1 = py(p1[0]), x2 = px(p2[1]), y2 = py(p2[0])
          const ang = Math.atan2(y2 - y1, x2 - x1)
          const head = 11
          return (
            <g key={a.id}>
              <line x1={x1} y1={y1} x2={x2 - Math.cos(ang) * head} y2={y2 - Math.sin(ang) * head} stroke="oklch(0.68 0.2 25 / 0.9)" strokeWidth="3.2" strokeLinecap="round" />
              <polygon points={`${x2},${y2} ${x2 - Math.cos(ang - 0.45) * head},${y2 - Math.sin(ang - 0.45) * head} ${x2 - Math.cos(ang + 0.45) * head},${y2 - Math.sin(ang + 0.45) * head}`} fill="oklch(0.68 0.2 25 / 0.9)" />
            </g>
          )
        })}
        {/* شهرها */}
        {layers.cities && CITIES.map(c => (
          <g key={c.id} className="cursor-pointer" onClick={() => setSelected({ kind: 'city', id: c.id })}
            onMouseMove={e => setHoverTip({ x: px(c.lng), y: py(c.lat), text: c.fa })}
            onMouseLeave={() => setHoverTip(null)}>
            <circle cx={px(c.lng)} cy={py(c.lat)} r={c.importance.includes('پایتخت') || c.fa === 'بغداد' ? 5.5 : 3.4} fill="oklch(0.9 0.05 90)" stroke="oklch(0.3 0.02 80)" strokeWidth="1" />
            <text x={px(c.lng) + 7} y={py(c.lat) + 4} fill="oklch(0.92 0.02 90 / 0.92)" fontSize="12.5" fontWeight="600">{c.fa}</text>
          </g>
        ))}
        {/* عملیات‌های سال انتخابی */}
        {layers.ops && ops.map(o => {
          const col = o.side === 'iran' ? 'oklch(0.72 0.16 165)' : o.side === 'iraq' ? 'oklch(0.72 0.17 60)' : o.side === 'mek' ? 'oklch(0.68 0.19 20)' : o.side === 'us' ? 'oklch(0.7 0.14 250)' : 'oklch(0.7 0.1 90)'
          const done = o.faEnd && o.faEnd.slice(5, 7) === String(m).padStart(2, '0')
          return (
            <g key={o.id} className="cursor-pointer" onClick={() => (onSelectOperation ? onSelectOperation(o) : setSelected({ kind: 'op', id: o.id }))}
              onMouseMove={e => setHoverTip({ x: px(o.center.lng), y: py(o.center.lat), text: o.faName })}
              onMouseLeave={() => setHoverTip(null)}>
              <circle cx={px(o.center.lng)} cy={py(o.center.lat)} r={done ? 10 : 7} fill={col} fillOpacity="0.9" stroke="oklch(0.15 0 0)" strokeWidth="1.5" />
              {done && <circle cx={px(o.center.lng)} cy={py(o.center.lat)} r="14" fill="none" stroke={col} strokeWidth="1.6" strokeDasharray="3 3" />}
            </g>
          )
        })}
        {hoverTip && (
          <g>
            <rect x={hoverTip.x - hoverTip.text.length * 7} y={hoverTip.y - 34} width={hoverTip.text.length * 14 + 12} height="24" rx="6" fill="oklch(0.15 0 0 / 0.85)" />
            <text x={hoverTip.x - hoverTip.text.length * 7 + 6} y={hoverTip.y - 17} fill="oklch(0.95 0 0)" fontSize="13" fontWeight="700">{hoverTip.text}</text>
          </g>
        )}
      </svg>
    )
  }

  const selCity = selected?.kind === 'city' ? CITIES.find(c => c.id === selected.id) : null
  const selOp = selected?.kind === 'op' ? OPERATIONS.find(o => o.id === selected.id) : null

  return (
    <div className="space-y-4">
      {/* کنترل‌ها */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border bg-card/70 p-3">
        <span className="text-xs font-bold text-muted-foreground ml-1">زمان:</span>
        <select value={year} onChange={e => setYear(Number(e.target.value))} className="rounded-lg border bg-background px-2 py-1.5 text-sm font-bold" aria-label="سال">
          {years.map(y => <option key={y} value={y}>سال {toFa(y)}</option>)}
        </select>
        <select value={month} onChange={e => setMonth(Number(e.target.value))} className="rounded-lg border bg-background px-2 py-1.5 text-sm" aria-label="ماه">
          {MONTHS_FA.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
        </select>
        {!compact && (
          <Button size="sm" variant={compare ? 'default' : 'outline'} onClick={() => setCompare(c => !c)} className="text-xs">
            ⚖ مقایسه دو تاریخ
          </Button>
        )}
        {compare && (
          <select value={compareYear} onChange={e => setCompareYear(Number(e.target.value))} className="rounded-lg border bg-background px-2 py-1.5 text-sm font-bold" aria-label="سال مقایسه">
            {years.map(y => <option key={y} value={y}>مقایسه با {toFa(y)}</option>)}
          </select>
        )}
        <div className="mx-1 h-5 w-px bg-border" />
        {layerBtn('borders', 'مرزها')}
        {layerBtn('fronts', 'خطوط جبهه')}
        {layerBtn('cities', 'شهرها')}
        {layerBtn('ops', 'عملیات‌ها')}
        {layerBtn('arrows', 'مسیر پیشروی')}
        {layerBtn('rivers', 'رودها')}
      </div>

      {/* نقشه‌ها */}
      <div className={`grid gap-4 ${compare ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
        <div className="map-frame border bg-card/60 p-2">
          <div className="flex items-center justify-between px-2 py-1.5">
            <Badge variant="outline" className="font-bold">{toFa(year)} / {MONTHS_FA[month - 1]}</Badge>
            {snap && <span className="text-[11px] text-muted-foreground">لحظه جغرافیایی: {snap.label}</span>}
          </div>
          {renderMap(year, month, false)}
          <div className="px-2 py-1.5 text-[11px] text-muted-foreground leading-5">
            {snap?.desc}
          </div>
        </div>
        {compare && (
          <div className="map-frame border bg-card/60 p-2">
            <div className="flex items-center justify-between px-2 py-1.5">
              <Badge variant="outline" className="font-bold">{toFa(compareYear)}</Badge>
              {cmpSnap && <span className="text-[11px] text-muted-foreground">{cmpSnap.label}</span>}
            </div>
            {renderMap(compareYear, month, true)}
            <div className="px-2 py-1.5 text-[11px] text-muted-foreground leading-5">{cmpSnap?.desc}</div>
          </div>
        )}
      </div>

      <p className="text-[11px] text-muted-foreground leading-5">
        ⚠ مناطق کنترلی و مسیر پیشروی «نمایش تقریبی» هستند و برای درک تاریخی تحولات جنگ رسم شده‌اند؛ مختصات دقیق خطوط جبهه در دسترس نیست و این لایه جانشین سند نقشه‌برداری نیست. نمایش جغرافیایی صرفاً آموزشی است.
      </p>

      {/* کارت اطلاعات */}
      {(selCity || selOp) && (
        <div className="rounded-2xl border bg-card p-4">
          {selCity && (
            <div>
              <div className="flex items-center justify-between">
                <h3 className="museum-title text-xl">{selCity.fa} <span className="text-sm text-muted-foreground font-normal">({selCity.en})</span></h3>
                <Button size="sm" variant="ghost" onClick={() => setSelected(null)}>بستن ✕</Button>
              </div>
              <p className="mt-2 text-sm leading-7">{selCity.importance}</p>
              <p className="mt-1 text-xs text-muted-foreground">موقعیت جغرافیایی: {toFa(selCity.lat.toFixed(2))}، {toFa(selCity.lng.toFixed(2))} — {selCity.country === 'iran' ? 'ایران' : selCity.country === 'iraq' ? 'عراق' : 'کویت'}</p>
              {selCity.relatedOps && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selCity.relatedOps.map(id => {
                    const op = OPERATIONS.find(o => o.id === id)
                    return op ? <Badge key={id} variant="outline" className="cursor-pointer hover:border-primary" onClick={() => setSelected({ kind: 'op', id })}>{op.faName}</Badge> : null
                  })}
                </div>
              )}
            </div>
          )}
          {selOp && (
            <div>
              <div className="flex items-center justify-between">
                <h3 className="museum-title text-xl">{selOp.faName}</h3>
                <Button size="sm" variant="ghost" onClick={() => setSelected(null)}>بستن ✕</Button>
              </div>
              <p className="mt-2 text-sm leading-7">{selOp.outcome}</p>
              {onSelectOperation && <Button size="sm" className="mt-3" onClick={() => onSelectOperation(selOp)}>پرونده کامل عملیات</Button>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
