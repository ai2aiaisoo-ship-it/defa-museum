'use client'

import { useEffect, useRef, useState } from 'react'
import type { BattleMapData, BattlePhase, BSide } from '@/data/battle-maps'
import { getOperation, RESULT_LABELS } from '@/data/operations'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toFa } from '@/lib/jalali'
import { ConfidenceBadge, SourceChips } from './ui-bits'

// ─── هندسه نقشه ───
const W = 1000

interface VB { x: number; y: number; w: number; h: number }

interface BoundaryFC { type: 'FeatureCollection'; features: { properties: { en: string; fa: string }; geometry: { type: string; coordinates: number[][][] | number[][][][] } }[] }

function ringToPathG(ring: number[][], px: (v: number) => number, py: (v: number) => number): string {
  return ring.map((c, i) => `${i === 0 ? 'M' : 'L'}${px(c[0]).toFixed(1)},${py(c[1]).toFixed(1)}`).join(' ') + ' Z'
}
function geomToPathsG(geom: { type: string; coordinates: unknown }, px: (v: number) => number, py: (v: number) => number): string[] {
  if (geom.type === 'Polygon') return (geom.coordinates as number[][][]).map(r => ringToPathG(r, px, py))
  return (geom.coordinates as number[][][][]).map(poly => poly.map(r => ringToPathG(r, px, py)).join(' '))
}

const SIDE_COLOR: Record<BSide, string> = {
  iran: 'oklch(0.72 0.15 165)',
  iraq: 'oklch(0.70 0.17 55)',
  mek: 'oklch(0.68 0.19 20)',
}
const SIDE_FILL: Record<BSide, string> = {
  iran: 'oklch(0.65 0.12 165 / 0.26)',
  iraq: 'oklch(0.62 0.14 55 / 0.26)',
  mek: 'oklch(0.62 0.15 20 / 0.26)',
}

function ringToPath(ring: [number, number][], px: (v: number) => number, py: (v: number) => number): string {
  return ring.map((c, i) => `${i === 0 ? 'M' : 'L'}${px(c[1]).toFixed(1)},${py(c[0]).toFixed(1)}`).join(' ') + ' Z'
}
function pathToD(path: [number, number][], px: (v: number) => number, py: (v: number) => number): string {
  return path.map((c, i) => `${i === 0 ? 'M' : 'L'}${px(c[1]).toFixed(1)},${py(c[0]).toFixed(1)}`).join(' ')
}
function centroid(ring: [number, number][]): [number, number] {
  const s = ring.reduce((a, c) => [a[0] + c[0], a[1] + c[1]], [0, 0])
  return [s[0] / ring.length, s[1] / ring.length]
}

/** پرچم کوچک روی نقشه — عراق: پرچم تاریخی ۱۹۸۰ با سه ستاره سبز */
function FlagMarker({ side, label, x, y, scale = 1 }: { side: BSide; label: string; x: number; y: number; scale?: number }) {
  const fw = 26 * scale, fh = 16 * scale
  return (
    <g transform={`translate(${x},${y})`} className="cursor-help">
      <circle r={9 * scale} fill={SIDE_COLOR[side]} fillOpacity="0.25" stroke={SIDE_COLOR[side]} strokeWidth="1.2" className="bm-pulse" />
      <line x1={0} y1={0} x2={0} y2={-20 * scale} stroke="oklch(0.85 0.02 90 / 0.8)" strokeWidth={1.4 * scale} />
      <g transform={`translate(${1 * scale},${-20 * scale})`}>
        {side === 'iran' ? (
          <>
            <rect x={0} y={0} width={fw} height={fh / 3} fill="oklch(0.55 0.14 150)" />
            <rect x={0} y={fh / 3} width={fw} height={fh / 3} fill="oklch(0.98 0.01 95)" />
            <rect x={0} y={(2 * fh) / 3} width={fw} height={fh / 3} fill="oklch(0.55 0.19 28)" />
            <circle cx={fw / 2} cy={fh / 2} r={fh / 7} fill="oklch(0.52 0.2 28)" />
          </>
        ) : side === 'iraq' ? (
          <>
            <rect x={0} y={0} width={fw} height={fh / 3} fill="oklch(0.52 0.2 28)" />
            <rect x={0} y={fh / 3} width={fw} height={fh / 3} fill="oklch(0.97 0.01 95)" />
            <rect x={0} y={(2 * fh) / 3} width={fw} height={fh / 3} fill="oklch(0.22 0.01 60)" />
            {[0.28, 0.5, 0.72].map((cx, i) => (
              <text key={i} x={fw * cx} y={fh * 0.62} fontSize={6.5 * scale} fill="oklch(0.5 0.15 150)" textAnchor="middle" fontWeight="900">★</text>
            ))}
          </>
        ) : (
          <>
            <rect x={0} y={0} width={fw} height={fh} fill="oklch(0.95 0.01 95)" />
            <rect x={0} y={0} width={fw} height={fh / 2} fill="oklch(0.62 0.19 20 / 0.9)" />
          </>
        )}
        <rect x={0} y={0} width={fw} height={fh} fill="none" stroke="oklch(0.2 0 0 / 0.6)" strokeWidth={0.8} />
      </g>
      <text x={0} y={10 * scale + 4} textAnchor="middle" fontSize={11.5 * scale} fontWeight="700" fill="oklch(0.95 0.01 95)" stroke="oklch(0.15 0 0 / 0.85)" strokeWidth={0.55} paintOrder="stroke">{label}</text>
    </g>
  )
}

function PointIcon({ type }: { type: string }) {
  switch (type) {
    case 'city': return <circle r="5" />
    case 'height': return <polygon points="0,-6 5.5,4 -5.5,4" />
    case 'bridge': return <rect x="-4" y="-4" width="8" height="8" transform="rotate(45)" />
    case 'border': return <rect x="-4" y="-4" width="8" height="8" />
    case 'garrison': return <polygon points="0,-6 6,-2 6,4 -6,4 -6,-2" />
    case 'island': return <circle r="5" />
    default: return <circle r="3.5" />
  }
}

export function BattleMap({ data }: { data: BattleMapData }) {
  const op = getOperation(data.opId)
  const { minLat, minLng, maxLat, maxLng } = data.bounds
  const H = Math.round((W * (maxLat - minLat)) / (maxLng - minLng))
  const px = (lng: number) => ((lng - minLng) / (maxLng - minLng)) * W
  const py = (lat: number) => ((maxLat - lat) / (maxLat - minLat)) * H
  const baseVB: VB = { x: 0, y: 0, w: W, h: H }

  const [phaseIdx, setPhaseIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [vb, setVb] = useState<VB>(baseVB)
  const [layers, setLayers] = useState({ zones: true, fronts: true, arrows: true, flags: true, points: true, rivers: true, border: true })
  const svgRef = useRef<SVGSVGElement | null>(null)
  const dragRef = useRef<{ sx: number; sy: number; vb: VB } | null>(null)
  const pinchRef = useRef<{ dist: number; vb: VB } | null>(null)
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map())
  const [bnd, setBnd] = useState<BoundaryFC | null>(null)

  useEffect(() => {
    fetch('/geo/boundaries.json').then(r => r.json()).then(setBnd).catch(() => setBnd(null))
  }, [])

  const phase: BattlePhase = data.phases[phaseIdx]
  const total = data.phases.length

  // پخش خودکار مراحل
  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => {
      setPhaseIdx(i => {
        if (i >= total - 1) { setPlaying(false); return i }
        return i + 1
      })
    }, 5200)
    return () => clearInterval(t)
  }, [playing, total])

  // زوم با چرخ ماوس (غیرمنفعل)
  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const rect = el.getBoundingClientRect()
      const mx = ((e.clientX - rect.left) / rect.width) * vb.w + vb.x
      const my = ((e.clientY - rect.top) / rect.height) * vb.h + vb.y
      const k = e.deltaY > 0 ? 1.18 : 0.85
      setVb(v => {
        const nw = Math.min(W, Math.max(W / 7, v.w * k))
        const nh = nw * (v.h / v.w)
        const fx = (mx - v.x) / v.w, fy = (my - v.y) / v.h
        let nx = mx - fx * nw, ny = my - fy * nh
        nx = Math.min(Math.max(nx, 0), W - nw); ny = Math.min(Math.max(ny, 0), H - nh)
        return { x: nx, y: ny, w: nw, h: nh }
      })
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [vb, H])

  const clientToMap = (cx: number, cy: number) => {
    const el = svgRef.current!
    const rect = el.getBoundingClientRect()
    return { mx: ((cx - rect.left) / rect.width) * vb.w + vb.x, my: ((cy - rect.top) / rect.height) * vb.h + vb.y }
  }

  const onPointerDown = (e: React.PointerEvent) => {
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointersRef.current.size === 2) {
      const [a, b] = [...pointersRef.current.values()]
      pinchRef.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), vb }
      dragRef.current = null
    } else if (pointersRef.current.size === 1) {
      dragRef.current = { sx: e.clientX, sy: e.clientY, vb }
    }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointersRef.current.has(e.pointerId)) return
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointersRef.current.size === 2 && pinchRef.current) {
      const [a, b] = [...pointersRef.current.values()]
      const d = Math.hypot(a.x - b.x, a.y - b.y)
      const k = pinchRef.current.dist / d
      const v0 = pinchRef.current.vb
      const nw = Math.min(W, Math.max(W / 7, v0.w * k))
      const nh = nw * (v0.h / v0.w)
      const rect = svgRef.current!.getBoundingClientRect()
      const midx = ((a.x + b.x) / 2 - rect.left) / rect.width, midy = ((a.y + b.y) / 2 - rect.top) / rect.height
      const mx = midx * v0.w + v0.x, my = midy * v0.h + v0.y
      const fx = (mx - v0.x) / v0.w, fy = (my - v0.y) / v0.h
      let nx = mx - fx * nw, ny = my - fy * nh
      nx = Math.min(Math.max(nx, 0), W - nw); ny = Math.min(Math.max(ny, 0), H - nh)
      setVb({ x: nx, y: ny, w: nw, h: nh })
    } else if (dragRef.current) {
      const d = dragRef.current
      const rect = svgRef.current!.getBoundingClientRect()
      const dx = ((e.clientX - d.sx) / rect.width) * d.vb.w
      const dy = ((e.clientY - d.sy) / rect.height) * d.vb.h
      let nx = d.vb.x - dx, ny = d.vb.y - dy
      nx = Math.min(Math.max(nx, 0), W - d.vb.w); ny = Math.min(Math.max(ny, 0), H - d.vb.h)
      setVb({ ...d.vb, x: nx, y: ny })
    }
  }
  const onPointerUp = (e: React.PointerEvent) => {
    pointersRef.current.delete(e.pointerId)
    if (pointersRef.current.size < 2) pinchRef.current = null
    if (pointersRef.current.size === 0) dragRef.current = null
  }

  const zoomBtn = (k: number) => setVb(v => {
    const nw = Math.min(W, Math.max(W / 7, v.w * k)); const nh = nw * (v.h / v.w)
    const cx = v.x + v.w / 2, cy = v.y + v.h / 2
    let nx = cx - nw / 2, ny = cy - nh / 2
    nx = Math.min(Math.max(nx, 0), W - nw); ny = Math.min(Math.max(ny, 0), H - nh)
    return { x: nx, y: ny, w: nw, h: nh }
  })

  const toggleFullscreen = () => {
    const el = svgRef.current?.closest('.bm-shell')
    if (!document.fullscreenElement) el?.requestFullscreen?.()
    else document.exitFullscreen?.()
  }

  const layerBtn = (key: keyof typeof layers, label: string) => (
    <button
      key={key}
      onClick={() => setLayers(l => ({ ...l, [key]: !l[key] }))}
      className={`rounded-lg border px-2 py-1 text-[11px] font-bold transition-colors ${layers[key] ? 'border-primary/60 bg-primary/15 text-primary' : 'border-border bg-muted/40 text-muted-foreground'}`}
    >
      {layers[key] ? '✓ ' : ''}{label}
    </button>
  )

  const zoomPct = Math.round((baseVB.w / vb.w) * 100)

  return (
    <div className="bm-shell space-y-3">
      {/* سربرگ نقشه */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-rose-950/60 text-rose-200 border border-rose-500/40" variant="outline">⚔ نقشه تاکتیکی نبرد</Badge>
          {op && <Badge variant="outline" className="font-bold">{RESULT_LABELS[op.result]}</Badge>}
          <Badge variant="outline" className="font-bold">زوم: {toFa(zoomPct)}٪</Badge>
        </div>
        <div className="flex items-center gap-1.5">
          <Button size="sm" variant="outline" onClick={() => zoomBtn(0.8)} aria-label="بزرگ‌نمایی" className="px-3">＋</Button>
          <Button size="sm" variant="outline" onClick={() => zoomBtn(1.25)} aria-label="کوچک‌نمایی" className="px-3">−</Button>
          <Button size="sm" variant="outline" onClick={() => setVb(baseVB)} className="text-xs font-bold">⌂ نمای کامل</Button>
          <Button size="sm" variant="outline" onClick={toggleFullscreen} aria-label="تمام‌صفحه" className="px-3">⛶</Button>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_330px]">
        {/* ناحیه نقشه */}
        <div className="relative overflow-hidden rounded-2xl border bg-card/60">
          <svg
            ref={svgRef}
            viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
            className="block h-auto w-full touch-none select-none"
            style={{ cursor: 'grab' }}
            role="img"
            aria-label={`نقشه تاکتیکی ${data.subtitle}`}
            onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}
          >
            <defs>
              <radialGradient id="bmSea" cx="30%" cy="95%" r="90%">
                <stop offset="0%" stopColor="oklch(0.30 0.05 230)" />
                <stop offset="100%" stopColor="oklch(0.20 0.03 245)" />
              </radialGradient>
              <pattern id="bmGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="oklch(0.75 0.03 90 / 0.07)" strokeWidth="0.7" />
              </pattern>
            </defs>
            <rect width={W} height={H} fill="url(#bmSea)" />
            <rect width={W} height={H} fill="url(#bmGrid)" />
            {/* خشکی واقعی ایران و عراق و همسایگان */}
            {bnd?.features.map(f => {
              const isIran = f.properties.en === 'Iran'
              const isIraq = f.properties.en === 'Iraq'
              return (
                <path
                  key={f.properties.en}
                  d={geomToPathsG(f.geometry, px, py).join(' ')}
                  fill={isIran ? 'oklch(0.33 0.045 150 / 0.72)' : isIraq ? 'oklch(0.35 0.05 70 / 0.66)' : 'oklch(0.29 0.02 90 / 0.5)'}
                  stroke="oklch(0.62 0.03 85 / 0.4)"
                  strokeWidth="1"
                />
              )
            })}
            {bnd?.features.filter(f => f.properties.en === 'Iran' || f.properties.en === 'Iraq').map(f => (
              <path key={'o-' + f.properties.en} d={geomToPathsG(f.geometry, px, py).join(' ')} fill="none" stroke="oklch(0.8 0.09 85 / 0.5)" strokeWidth="1.4" strokeDasharray="8 5" />
            ))}

            {/* برچسب کشورها/دریا */}
            {data.labels?.map(l => (
              <text key={l.text} x={px(l.pos[1])} y={py(l.pos[0])} fill={l.color ?? 'oklch(0.85 0.02 90 / 0.5)'} fontSize={l.size ?? 18} fontWeight="800" textAnchor="middle">{l.text}</text>
            ))}

            <g key={phase.id} className="bm-phase-in">
              {/* رودها */}
              {layers.rivers && data.rivers?.map(r => (
                <g key={r.id}>
                  <path d={pathToD(r.path, px, py)} fill="none" stroke="oklch(0.55 0.10 235 / 0.9)" strokeWidth="2.6" strokeLinecap="round" />
                  <text x={px(r.path[0][1])} y={py(r.path[0][0]) - 7} fill="oklch(0.72 0.07 235)" fontSize="11.5" fontWeight="700" textAnchor="middle">{r.name}</text>
                </g>
              ))}

              {/* مرز بین‌المللی */}
              {layers.border && data.borderPath && (
                <path d={pathToD(data.borderPath, px, py)} fill="none" stroke="oklch(0.85 0.08 85 / 0.7)" strokeWidth="2" strokeDasharray="10 5" />
              )}

              {/* مناطق کنترل */}
              {layers.zones && (
                <g>
                  {phase.iraqZones?.map(z => (
                    <g key={z.id}>
                      <path d={ringToPath(z.ring, px, py)} fill={SIDE_FILL.iraq} stroke={SIDE_COLOR.iraq} strokeWidth="1.6" strokeDasharray="6 4" />
                      <text x={px(centroid(z.ring)[1])} y={py(centroid(z.ring)[0])} fill="oklch(0.9 0.09 60)" fontSize="12" fontWeight="800" textAnchor="middle">{z.name}</text>
                    </g>
                  ))}
                  {phase.iranZones?.map(z => (
                    <g key={z.id}>
                      <path d={ringToPath(z.ring, px, py)} fill={SIDE_FILL.iran} stroke={SIDE_COLOR.iran} strokeWidth="1.6" strokeDasharray="6 4" />
                      <text x={px(centroid(z.ring)[1])} y={py(centroid(z.ring)[0])} fill="oklch(0.92 0.08 165)" fontSize="12" fontWeight="800" textAnchor="middle">{z.name}</text>
                    </g>
                  ))}
                </g>
              )}

              {/* خط تماس جبهه‌ها */}
              {layers.fronts && phase.fronts?.map(f => (
                <path key={f.id} d={pathToD(f.path, px, py)} fill="none" stroke="oklch(0.62 0.22 28)" strokeWidth="3.4" strokeLinecap="round" strokeDasharray="14 7" className="bm-march" />
              ))}

              {/* محورهای پیشروی */}
              {layers.arrows && phase.arrows?.map(a => {
                const d = a.path
                const x1 = px(d[d.length - 2][1]), y1 = py(d[d.length - 2][0])
                const x2 = px(d[d.length - 1][1]), y2 = py(d[d.length - 1][0])
                const ang = Math.atan2(y2 - y1, x2 - x1)
                const head = 13
                return (
                  <g key={a.id}>
                    <path d={pathToD(d, px, py)} fill="none" stroke={SIDE_COLOR[a.side]} strokeWidth="4" strokeLinecap="round" strokeDasharray="12 8" className="bm-march" />
                    <polygon points={`${x2},${y2} ${x2 - Math.cos(ang - 0.42) * head},${y2 - Math.sin(ang - 0.42) * head} ${x2 - Math.cos(ang + 0.42) * head},${y2 - Math.sin(ang + 0.42) * head}`} fill={SIDE_COLOR[a.side]} />
                    <text x={px(d[0][1])} y={py(d[0][0]) - 9} fill={SIDE_COLOR[a.side]} fontSize="11.5" fontWeight="800" textAnchor="middle" stroke="oklch(0.12 0 0 / 0.8)" strokeWidth="0.6" paintOrder="stroke">{a.label}</text>
                  </g>
                )
              })}

              {/* نقاط کلیدی */}
              {layers.points && data.points.map(p => (
                <g key={p.id} transform={`translate(${px(p.lng)},${py(p.lat)})`}>
                  <PointIcon type={p.type} />
                  <circle r="7.5" fill="transparent" />
                  <circle r="5.5" fill={p.side === 'iraq' ? 'oklch(0.72 0.13 60)' : 'oklch(0.88 0.05 90)'} stroke="oklch(0.15 0 0)" strokeWidth="1" />
                  <text x="7" y="4" fontSize="12" fontWeight="700" fill="oklch(0.94 0.01 95)" stroke="oklch(0.12 0 0 / 0.8)" strokeWidth="0.55" paintOrder="stroke">{p.name}</text>
                </g>
              ))}

              {/* پرچم مواضع نیروها */}
              {layers.flags && phase.flags?.map(f => (
                <FlagMarker key={f.id} side={f.side} label={f.label} x={px(f.pos[1])} y={py(f.pos[0])} />
              ))}
            </g>

            {/* قطب‌نما */}
            <g transform={`translate(${vb.x + vb.w - 46},${vb.y + 44})`}>
              <circle r="20" fill="oklch(0.15 0 0 / 0.55)" stroke="oklch(0.85 0.03 90 / 0.5)" strokeWidth="1" />
              <polygon points="0,-14 4,4 0,1 -4,4" fill="oklch(0.85 0.12 30)" />
              <text x="0" y="17" fontSize="10" fontWeight="800" textAnchor="middle" fill="oklch(0.9 0.02 95)">ش</text>
            </g>
          </svg>

          {/* راهنمای شماتیک روی نقشه */}
          <div className="pointer-events-none absolute bottom-2 right-2 rounded-xl border bg-background/80 p-2.5 text-[10.5px] leading-5 backdrop-blur">
            <div className="mb-1 font-extrabold text-primary">راهنما</div>
            <div className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-5 rounded-sm" style={{ background: SIDE_FILL.iran, border: `1.5px dashed ${SIDE_COLOR.iran}` }} /> تصرف/مواضع ایران</div>
            <div className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-5 rounded-sm" style={{ background: SIDE_FILL.iraq, border: `1.5px dashed ${SIDE_COLOR.iraq}` }} /> اشغال/مواضع عراق</div>
            <div className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-5 bg-[oklch(0.62_0.22_28)]" style={{ borderTop: '2.5px dashed oklch(0.62 0.22 28)' }} /> خط تماس جبهه</div>
            <div className="flex items-center gap-1.5"><span className="inline-block h-2 w-5" style={{ background: `linear-gradient(90deg, transparent, ${SIDE_COLOR.iran})` }} />→ محور پیشروی</div>
          </div>
        </div>

        {/* پنل روایت مرحله */}
        <div className="space-y-3">
          {/* پخش‌کننده مراحل */}
          <div className="rounded-2xl border bg-card/70 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-extrabold text-primary">🎬 پخش روایت نبرد</span>
              <span className="text-[11px] font-bold text-muted-foreground">مرحله {toFa(phaseIdx + 1)} از {toFa(total)}</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Button size="sm" onClick={() => { if (phaseIdx >= total - 1) setPhaseIdx(0); setPlaying(p => !p) }} className="px-4 font-extrabold">
                {playing ? '⏸ توقف' : '▶ پخش'}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setPhaseIdx(i => Math.max(0, i - 1))} disabled={phaseIdx === 0} aria-label="مرحله قبل">‹</Button>
              <Button size="sm" variant="outline" onClick={() => setPhaseIdx(i => Math.min(total - 1, i + 1))} disabled={phaseIdx >= total - 1} aria-label="مرحله بعد">›</Button>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${((phaseIdx + 1) / total) * 100}%` }} />
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {data.phases.map((p, i) => (
                <button key={p.id} onClick={() => setPhaseIdx(i)}
                  className={`rounded-lg border px-2 py-1 text-[10.5px] font-bold transition-colors ${i === phaseIdx ? 'border-primary/60 bg-primary/15 text-primary' : 'border-border bg-muted/40 text-muted-foreground hover:border-primary/40'}`}>
                  {toFa(i + 1)}. {p.dateLabel}
                </button>
              ))}
            </div>
          </div>

          {/* توضیح مرحله */}
          <div key={phase.id} className="bm-phase-in rounded-2xl border bg-card/70 p-4">
            <Badge variant="outline" className="font-extrabold text-primary">{phase.dateLabel}</Badge>
            <h4 className="mt-2 text-sm font-extrabold leading-6">{phase.title}</h4>
            <p className="mt-2 text-xs leading-6 text-justify text-muted-foreground">{phase.desc}</p>
            {phase.advance && (
              <div className="mt-3 rounded-xl border border-teal-500/30 bg-teal-500/10 p-2.5 text-[11px] font-bold leading-5 text-teal-300">
                📈 میزان پیشروی: {phase.advance}
              </div>
            )}
          </div>

          {/* لایه‌ها */}
          <div className="flex flex-wrap gap-1.5 rounded-2xl border bg-card/60 p-3">
            <span className="w-full text-[10px] font-extrabold tracking-widest text-muted-foreground">لایه‌های نقشه</span>
            {layerBtn('zones', 'مناطق کنترل')}
            {layerBtn('fronts', 'خط تماس')}
            {layerBtn('arrows', 'محور پیشروی')}
            {layerBtn('flags', 'پرچم نیروها')}
            {layerBtn('points', 'نقاط کلیدی')}
            {layerBtn('rivers', 'آب‌ها')}
            {layerBtn('border', 'مرز بین‌المللی')}
          </div>
        </div>
      </div>

      {/* پانویس صادقانه */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-[11px] leading-6 text-amber-400">
        ⚠ {data.note} خطوط جبهه، مواضع و پیکان‌ها «ترسیم تقریبی آموزشی» هستند؛ برای هیچ یگانی ادعای موقعیت دقیق نداریم و نقشه جانشین اسناد عملیاتی نیست.
      </div>
      <div>
        <div className="mb-1.5 text-xs font-extrabold text-primary">منابع نقشه</div>
        <SourceChips ids={data.sources} />
        {op && (
          <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
            ارزیابی نتیجه این نبرد:
            <ConfidenceBadge c="B" />
            <span>— جزئیات کامل آمار ادعایی در پرونده عملیات</span>
          </div>
        )}
      </div>
    </div>
  )
}
