'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { BattleAirEvent, BattleArrow, BattleCrossing, BattleMapData, BattlePhase, ArrowKind, BSide } from '@/data/battle-maps'
import { applyTactics } from '@/data/battle-maps-all'
import { getOperation, RESULT_LABELS } from '@/data/operations'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toFa } from '@/lib/jalali'
import { ConfidenceBadge, SourceChips } from './ui-bits'

// ─── موتور «نقشه رزمی خودخوان» — کاربر بدون خواندن متن، طرح مانور را می‌فهمد ───
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
const AIR_COLOR = 'oklch(0.76 0.09 200)'
const DECEPTION_COLOR = 'oklch(0.80 0.16 75)'

function arrowColor(kind: ArrowKind, side: BSide): string {
  if (kind === 'deception') return DECEPTION_COLOR
  if (kind === 'air') return AIR_COLOR
  return SIDE_COLOR[side]
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

/** بدنه پیکان پهنِ تِیپر — زبان نمادین محور حمله */
function taperedArrow(pts: [number, number][], w0: number, w1: number): { body: string; head: string } {
  const N = pts.length
  const left: string[] = []
  const right: string[] = []
  for (let i = 0; i < N; i++) {
    const w = (w0 + (w1 - w0) * (i / (N - 1))) / 2
    const prev = pts[Math.max(0, i - 1)]
    const next = pts[Math.min(N - 1, i + 1)]
    let dx = next[0] - prev[0]
    let dy = next[1] - prev[1]
    const len = Math.hypot(dx, dy) || 1
    dx /= len; dy /= len
    const nx = -dy, ny = dx
    left.push(`${(pts[i][0] + nx * w).toFixed(1)},${(pts[i][1] + ny * w).toFixed(1)}`)
    right.push(`${(pts[i][0] - nx * w).toFixed(1)},${(pts[i][1] - ny * w).toFixed(1)}`)
  }
  const body = 'M' + left.join(' L') + ' L' + right.reverse().join(' L') + ' Z'
  const [ex, ey] = pts[N - 1]
  let dx = ex - pts[N - 2][0]
  let dy = ey - pts[N - 2][1]
  const len = Math.hypot(dx, dy) || 1
  dx /= len; dy /= len
  const hw = w1 * 1.3
  const hl = w1 * 1.7
  const bx = ex - dx * hl
  const by = ey - dy * hl
  const px = -dy, py = dx
  const head = `M${ex.toFixed(1)},${ey.toFixed(1)} L${(bx + px * hw).toFixed(1)},${(by + py * hw).toFixed(1)} L${(bx - px * hw).toFixed(1)},${(by - py * hw).toFixed(1)} Z`
  return { body, head }
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

/** نماد یگان — قاب مستطیلی (اقتباس ساده‌شده APP-6) */
function UnitMarker({ side, label, sym, x, y }: { side: BSide; label: string; sym?: 'inf' | 'armor' | 'hq'; x: number; y: number }) {
  const w = 30, h = 18
  return (
    <g transform={`translate(${x},${y})`} className="cursor-help">
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="2.5" fill={SIDE_FILL[side]} stroke={SIDE_COLOR[side]} strokeWidth="1.8" />
      {sym === 'armor' ? (
        <ellipse cx="0" cy="0" rx="8" ry="4.5" fill="none" stroke={SIDE_COLOR[side]} strokeWidth="1.6" />
      ) : sym === 'hq' ? (
        <g>
          <line x1={-4} y1={7} x2={-4} y2={-8} stroke={SIDE_COLOR[side]} strokeWidth="1.4" />
          <path d="M-4,-8 h10 l-3,2.7 l3,2.7 h-10" fill={SIDE_COLOR[side]} />
        </g>
      ) : (
        <g>
          <line x1={-7} y1={-6} x2={7} y2={6} stroke={SIDE_COLOR[side]} strokeWidth="1.6" />
          <line x1={7} y1={-6} x2={-7} y2={6} stroke={SIDE_COLOR[side]} strokeWidth="1.6" />
        </g>
      )}
      <text x="0" y={h / 2 + 11} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="oklch(0.94 0.01 95)" stroke="oklch(0.12 0 0 / 0.85)" strokeWidth="0.55" paintOrder="stroke">{label}</text>
    </g>
  )
}

/** نشان رویداد هوایی: حمله هوایی / هلی‌برد / شیمیایی / شناسایی-آواکس */
function AirMarker({ ev, x, y }: { ev: BattleAirEvent; x: number; y: number }) {
  const color = ev.side === 'iran' ? SIDE_COLOR.iran : SIDE_COLOR[ev.side ?? 'iraq']
  return (
    <g transform={`translate(${x},${y})`} className="cursor-help">
      <circle r="12" fill="oklch(0.12 0 0 / 0.55)" stroke={color} strokeWidth="1.2" className="bm-pulse" />
      {ev.kind === 'air-strike' && (
        <path d="M0,-8 L2,-2 L8,1.5 L8,3 L1.5,1.5 L0.7,5.5 L2.8,7.2 L0,6.2 L-2.8,7.2 L-0.7,5.5 L-1.5,1.5 L-8,3 L-8,1.5 L-2,-2 Z" fill={color} />
      )}
      {ev.kind === 'heli-assault' && (
        <g stroke={color} fill="none" strokeWidth="1.6">
          <ellipse cx="0" cy="1" rx="4" ry="3" fill={SIDE_FILL[ev.side ?? 'iraq']} />
          <line x1="4" y1="1" x2="9" y2="0.5" />
          <line x1="9" y1="-1.5" x2="9" y2="2.5" />
          <line x1="-6" y1="-2.5" x2="6" y2="-2.5" />
          <line x1="0" y1="-2.5" x2="0" y2="-0.5" />
        </g>
      )}
      {ev.kind === 'chem' && (
        <g>
          <circle r="7" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="2.5 2.5" />
          <circle r="2.2" fill={color} />
          <circle cx="5" cy="-4" r="1.4" fill={color} />
          <circle cx="-5" cy="-4" r="1.4" fill={color} />
        </g>
      )}
      {ev.kind === 'recon' && (
        <g stroke={color} fill="none" strokeWidth="1.6">
          <path d="M-7,3 A8,8 0 0 1 7,3" />
          <line x1="0" y1="3" x2="4" y2="-2" />
          <circle cx="0" cy="3" r="1.6" fill={color} />
        </g>
      )}
      <text x="0" y="25" textAnchor="middle" fontSize="10" fontWeight="700" fill="oklch(0.94 0.01 95)" stroke="oklch(0.12 0 0 / 0.85)" strokeWidth="0.55" paintOrder="stroke">{ev.label}</text>
    </g>
  )
}

/** نشان عبور آبی: قایق / پل شناور */
function CrossingMarker({ c, x, y }: { c: BattleCrossing; x: number; y: number }) {
  const color = AIR_COLOR
  return (
    <g transform={`translate(${x},${y})`} className="cursor-help">
      {c.kind === 'boat' ? (
        <g>
          <path d="M-7,1 Q0,6 7,1 L4.5,-3.5 L-4.5,-3.5 Z" fill={color} opacity="0.9" />
          <line x1="-9" y1="-4" x2="-2" y2="1" stroke={color} strokeWidth="1.2" />
          <line x1="9" y1="-4" x2="2" y2="1" stroke={color} strokeWidth="1.2" />
        </g>
      ) : (
        <g stroke={color} strokeWidth="1.4" fill={color} fillOpacity="0.35">
          <rect x="-9" y="-2.5" width="5.5" height="5" />
          <rect x="-2.7" y="-2.5" width="5.5" height="5" />
          <rect x="3.6" y="-2.5" width="5.5" height="5" />
          <line x1="-11" y1="3.5" x2="11" y2="3.5" />
        </g>
      )}
      <text x="0" y="16" textAnchor="middle" fontSize="10" fontWeight="700" fill="oklch(0.90 0.05 210)" stroke="oklch(0.12 0 0 / 0.85)" strokeWidth="0.55" paintOrder="stroke">{c.label}</text>
    </g>
  )
}

/** لایه تدابیر پدافندی: میدان مین / کمربند دفاعی / کانال / پهنه آتش */
function DefenseLayer({ d, px, py }: { d: NonNullable<BattlePhase['defenses']>[number]; px: (v: number) => number; py: (v: number) => number }) {
  const path = d.path
  if (!path) return null
  const dAttr = pathToD(path, px, py)
  const start = path[0]
  const labelXY = { x: px(start[1]), y: py(start[0]) - 6 }
  if (d.kind === 'minefield') {
    return (
      <g>
        <path d={dAttr} fill="none" stroke="oklch(0.72 0.15 60)" strokeWidth="8" strokeDasharray="1.5 7" opacity="0.5" strokeLinecap="round" />
        <text x={labelXY.x} y={labelXY.y} fontSize="10" fontWeight="700" fill="oklch(0.82 0.13 60)" stroke="oklch(0.12 0 0 / 0.85)" strokeWidth="0.55" paintOrder="stroke" textAnchor="middle">{d.label}</text>
      </g>
    )
  }
  if (d.kind === 'belt') {
    return (
      <g>
        <path d={dAttr} fill="none" stroke="oklch(0.48 0.07 55)" strokeWidth="5.5" strokeLinecap="round" opacity="0.9" />
        <path d={dAttr} fill="none" stroke="oklch(0.95 0.01 95)" strokeWidth="1.2" strokeDasharray="6 6" opacity="0.7" />
        <text x={labelXY.x} y={labelXY.y} fontSize="10" fontWeight="700" fill="oklch(0.86 0.06 70)" stroke="oklch(0.12 0 0 / 0.85)" strokeWidth="0.55" paintOrder="stroke" textAnchor="middle">{d.label}</text>
      </g>
    )
  }
  if (d.kind === 'canal') {
    return (
      <g>
        <path d={dAttr} fill="none" stroke="oklch(0.62 0.09 200)" strokeWidth="4.5" strokeLinecap="round" opacity="0.9" />
        <path d={dAttr} fill="none" stroke="oklch(0.95 0.01 95)" strokeWidth="1.1" strokeDasharray="4 5" opacity="0.7" />
        <text x={labelXY.x} y={labelXY.y} fontSize="10" fontWeight="700" fill="oklch(0.84 0.07 200)" stroke="oklch(0.12 0 0 / 0.85)" strokeWidth="0.55" paintOrder="stroke" textAnchor="middle">{d.label}</text>
      </g>
    )
  }
  // firezone
  return (
    <g>
      <path d={dAttr} fill="none" stroke="oklch(0.65 0.22 28)" strokeWidth="3" strokeDasharray="7 5" opacity="0.85" className="bm-march" />
      <text x={labelXY.x} y={labelXY.y} fontSize="10" fontWeight="700" fill="oklch(0.80 0.14 30)" stroke="oklch(0.12 0 0 / 0.85)" strokeWidth="0.55" paintOrder="stroke" textAnchor="middle">{d.label}</text>
    </g>
  )
}

/** برچسب خط مقدم (قبل/بعد) */
function FlotLabel({ x, y, text, color }: { x: number; y: number; text: string; color: string }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="-34" y="-9" width="68" height="15" rx="4" fill="oklch(0.12 0 0 / 0.75)" stroke={color} strokeWidth="0.8" />
      <text x="0" y="2.5" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={color}>{text}</text>
    </g>
  )
}

// ─── اجزای افسانه (mini glyphs) ───
function LegendGlyph({ kind }: { kind: string }) {
  const c = { main: SIDE_COLOR.iran, support: SIDE_COLOR.iran, dec: DECEPTION_COLOR, cnt: SIDE_COLOR.iraq, air: AIR_COLOR, red: 'oklch(0.62 0.22 28)', gray: 'oklch(0.70 0.01 90)', green: 'oklch(0.82 0.16 165)', brown: 'oklch(0.48 0.07 55)', orange: 'oklch(0.72 0.15 60)' }
  switch (kind) {
    case 'main': return <svg width="30" height="12"><polygon points="1,6 22,3.5 22,8.5" fill={c.main} /><polygon points="29,6 21,1.5 21,10.5" fill={c.main} /></svg>
    case 'support': return <svg width="30" height="12"><polygon points="1,6 22,4.5 22,7.5" fill={c.support} opacity="0.8" /><polygon points="29,6 21,2.5 21,9.5" fill={c.support} opacity="0.8" /></svg>
    case 'dec': return <svg width="30" height="12"><line x1="1" y1="6" x2="24" y2="6" stroke={c.dec} strokeWidth="2.5" strokeDasharray="4 3" /><polygon points="29,6 23,2.5 23,9.5" fill={c.dec} /></svg>
    case 'cnt': return <svg width="30" height="12"><polygon points="1,6 22,3.5 22,8.5" fill={c.cnt} /><polygon points="29,6 21,1.5 21,10.5" fill={c.cnt} /></svg>
    case 'air': return <svg width="26" height="16"><circle cx="13" cy="8" r="7.5" fill="oklch(0.12 0 0 / 0.4)" stroke={c.air} strokeWidth="1" /><path d="M13,2 L14.2,5.5 L19.5,7.6 L19.5,8.5 L14,7.4 L13.5,10.2 L15,11.5 L13,11 L11,11.5 L12.5,10.2 L12,7.4 L6.5,8.5 L6.5,7.6 L11.8,5.5 Z" fill={c.air} /></svg>
    case 'heli': return <svg width="26" height="16"><circle cx="13" cy="8" r="7.5" fill="oklch(0.12 0 0 / 0.4)" stroke={c.air} strokeWidth="1" /><g stroke={c.air} fill="none" strokeWidth="1.2"><ellipse cx="12.5" cy="9" rx="3.2" ry="2.3" /><line x1="15.7" y1="9" x2="19" y2="8.5" /><line x1="9" y1="4.8" x2="16" y2="4.8" /><line x1="12.5" y1="4.8" x2="12.5" y2="6.5" /></g></svg>
    case 'chem': return <svg width="26" height="16"><circle cx="13" cy="8" r="7.5" fill="oklch(0.12 0 0 / 0.4)" stroke={c.orange} strokeWidth="1" /><circle cx="13" cy="9" r="2" fill={c.orange} /><circle cx="16.5" cy="5.5" r="1.2" fill={c.orange} /><circle cx="9.5" cy="5.5" r="1.2" fill={c.orange} /></svg>
    case 'recon': return <svg width="26" height="16"><circle cx="13" cy="8" r="7.5" fill="oklch(0.12 0 0 / 0.4)" stroke={c.air} strokeWidth="1" /><path d="M8,11 A5.5,5.5 0 0 1 18,11" stroke={c.air} fill="none" strokeWidth="1.4" /><line x1="13" y1="11" x2="16" y2="7.5" stroke={c.air} strokeWidth="1.2" /><circle cx="13" cy="11" r="1.2" fill={c.air} /></svg>
    case 'boat': return <svg width="26" height="14"><path d="M5,8 Q13,12.5 21,8 L18.5,4 L7.5,4 Z" fill={c.air} opacity="0.9" /></svg>
    case 'pontoon': return <svg width="26" height="14"><g stroke={c.air} strokeWidth="1" fill={c.air} fillOpacity="0.35"><rect x="5" y="6" width="4.5" height="4" /><rect x="10.7" y="6" width="4.5" height="4" /><rect x="16.4" y="6" width="4.5" height="4" /></g><line x1="3" y1="11" x2="23" y2="11" stroke={c.air} strokeWidth="1.1" /></svg>
    case 'belt': return <svg width="30" height="12"><line x1="1" y1="6" x2="29" y2="6" stroke={c.brown} strokeWidth="5" strokeLinecap="round" /><line x1="1" y1="6" x2="29" y2="6" stroke="oklch(0.95 0.01 95)" strokeWidth="1" strokeDasharray="4 4" /></svg>
    case 'mine': return <svg width="30" height="12"><line x1="1" y1="6" x2="29" y2="6" stroke={c.orange} strokeWidth="7" strokeDasharray="1.5 6" strokeLinecap="round" opacity="0.55" /></svg>
    case 'fire': return <svg width="30" height="12"><line x1="1" y1="6" x2="29" y2="6" stroke={c.red} strokeWidth="2.5" strokeDasharray="6 4" /></svg>
    case 'canal': return <svg width="30" height="12"><line x1="1" y1="6" x2="29" y2="6" stroke="oklch(0.62 0.09 200)" strokeWidth="4" strokeLinecap="round" /><line x1="1" y1="6" x2="29" y2="6" stroke="oklch(0.95 0.01 95)" strokeWidth="1" strokeDasharray="3 4" /></svg>
    case 'pre': return <svg width="30" height="12"><line x1="1" y1="6" x2="29" y2="6" stroke={c.gray} strokeWidth="2" /></svg>
    case 'post': return <svg width="30" height="12"><line x1="1" y1="6" x2="29" y2="6" stroke={c.green} strokeWidth="3.2" /></svg>
    case 'front': return <svg width="30" height="12"><line x1="1" y1="6" x2="29" y2="6" stroke={c.red} strokeWidth="3" strokeDasharray="9 6" /></svg>
    case 'border': return <svg width="30" height="12"><line x1="1" y1="6" x2="29" y2="6" stroke="oklch(0.85 0.08 85 / 0.8)" strokeWidth="2" strokeDasharray="7 4" /></svg>
    case 'river': return <svg width="30" height="12"><line x1="1" y1="6" x2="29" y2="6" stroke="oklch(0.55 0.10 235)" strokeWidth="2.6" strokeLinecap="round" /></svg>
    case 'lib': return <svg width="26" height="14"><defs><pattern id="lgLib" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0,4 L4,0" stroke="oklch(0.72 0.15 165)" strokeWidth="1" /></pattern></defs><rect x="2" y="1" width="22" height="12" fill="url(#lgLib)" stroke="oklch(0.72 0.15 165)" strokeWidth="1" strokeDasharray="3 2" /></svg>
    case 'unit-inf': return <svg width="26" height="14"><rect x="4" y="1" width="18" height="12" rx="2" fill="oklch(0.65 0.12 165 / 0.26)" stroke="oklch(0.72 0.15 165)" strokeWidth="1.4" /><line x1="8" y1="4" x2="18" y2="10" stroke="oklch(0.72 0.15 165)" strokeWidth="1.2" /><line x1="18" y1="4" x2="8" y2="10" stroke="oklch(0.72 0.15 165)" strokeWidth="1.2" /></svg>
    case 'unit-armor': return <svg width="26" height="14"><rect x="4" y="1" width="18" height="12" rx="2" fill="oklch(0.65 0.12 165 / 0.26)" stroke="oklch(0.72 0.15 165)" strokeWidth="1.4" /><ellipse cx="13" cy="7" rx="6" ry="3" fill="none" stroke="oklch(0.72 0.15 165)" strokeWidth="1.2" /></svg>
    case 'city': return <svg width="26" height="14"><circle cx="13" cy="7" r="4.5" fill="oklch(0.88 0.05 90)" stroke="oklch(0.15 0 0)" /></svg>
  }
  return null
}

const LEGEND_ITEMS: { kind: string; text: string }[] = [
  { kind: 'main', text: 'محور اصلی خودی' },
  { kind: 'support', text: 'محور هماهنگ/فرعی' },
  { kind: 'dec', text: 'عملیات فریب' },
  { kind: 'cnt', text: 'پاتک/حمله دشمن' },
  { kind: 'air', text: 'حرکت/حمله هوایی' },
  { kind: 'heli', text: 'هلی‌برد' },
  { kind: 'chem', text: 'کاربرد شیمیایی' },
  { kind: 'recon', text: 'شناسایی/آواکس' },
  { kind: 'boat', text: 'عبور با قایق' },
  { kind: 'pontoon', text: 'پل شناور' },
  { kind: 'belt', text: 'کمربند دفاعی' },
  { kind: 'mine', text: 'میدان مین' },
  { kind: 'canal', text: 'کانال مسدودکننده' },
  { kind: 'fire', text: 'پهنه آتش آماده' },
  { kind: 'pre', text: 'خط مقدم — قبل از عملیات' },
  { kind: 'post', text: 'خط مقدم — پس از عملیات' },
  { kind: 'front', text: 'خط تماس مرحله' },
  { kind: 'border', text: 'مرز بین‌المللی' },
  { kind: 'river', text: 'رود/آبراه' },
  { kind: 'lib', text: 'خاک آزادشده' },
  { kind: 'unit-inf', text: 'یگان پیاده' },
  { kind: 'unit-armor', text: 'یگان زرهی' },
  { kind: 'city', text: 'شهر/نقطه کلیدی' },
]

export function BattleMap({ data: baseData }: { data: BattleMapData }) {
  const data = useMemo(() => applyTactics(baseData), [baseData])
  const op = getOperation(data.opId)
  const { minLat, minLng, maxLat, maxLng } = data.bounds
  const H = Math.round((W * (maxLat - minLat)) / (maxLng - minLng))
  const px = (lng: number) => ((lng - minLng) / (maxLng - minLng)) * W
  const py = (lat: number) => ((maxLat - lat) / (maxLat - minLat)) * H
  const baseVB: VB = { x: 0, y: 0, w: W, h: H }

  const [phaseIdx, setPhaseIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [vb, setVb] = useState<VB>(baseVB)
  const [layers, setLayers] = useState({ zones: true, fronts: true, arrows: true, flags: true, points: true, rivers: true, border: true, air: true, crossings: true, defenses: true, prepost: true })
  const [showLegend, setShowLegend] = useState(false)
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

  // زوم با چرخ ماوس
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

  // ── نوع پیش‌فرض محورها (اگر تعریف نشده باشد): اولین محور خودی = اصلی ──
  const kindOf = (a: BattleArrow, i: number): ArrowKind =>
    a.kind ?? (a.side === 'iran' ? (i === 0 ? 'main' : 'support') : 'counter')

  // ── کارنامه بصری — فقط از داده مشتق می‌شود ──
  const readout = useMemo(() => {
    const evs = data.phases.flatMap(p => p.airEvents ?? [])
    const crs = data.phases.flatMap(p => p.crossings ?? [])
    return {
      terrain: data.terrain,
      nature: data.nature,
      air: evs.some(e => e.kind === 'air-strike'),
      heli: evs.some(e => e.kind === 'heli-assault'),
      chem: evs.some(e => e.kind === 'chem'),
      recon: evs.some(e => e.kind === 'recon'),
      crossing: crs.length > 0,
      tricks: data.tricks?.length ?? 0,
      simultaneous: data.simultaneous?.length ?? 0,
      liberated: data.liberated?.map(l => l.label),
    }
  }, [data])

  // ── مقیاس کیلومتری ──
  const kmPerPx = 111.32 / (H / (maxLat - minLat))
  const scaleKm = [200, 100, 50, 25, 10, 5].find(k => k / kmPerPx <= 150) ?? 5
  const scalePx = scaleKm / kmPerPx
  const zoomPct = Math.round((baseVB.w / vb.w) * 100)

  return (
    <div className="bm-shell space-y-3">
      {/* کارنامه بصری — خوانش ۳ ثانیه‌ای */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border bg-card/70 p-2.5">
        <span className="ml-1 text-[10px] font-extrabold tracking-widest text-muted-foreground">خوانش سریع نقشه:</span>
        {readout.terrain && <Badge variant="outline" className="border-primary/40 bg-primary/10 text-[10.5px] font-extrabold">پهنه: {readout.terrain}</Badge>}
        {readout.nature && <Badge variant="outline" className={`text-[10.5px] font-extrabold ${readout.nature.includes('فریب') || readout.nature.includes('مقدماتی') ? 'border-amber-500/50 bg-amber-500/10 text-amber-400' : 'border-primary/40'}`}>طبیعت: {readout.nature}</Badge>}
        <Badge variant="outline" className={`text-[10.5px] font-extrabold ${readout.air ? 'border-teal-500/50 bg-teal-500/10 text-teal-300' : 'text-muted-foreground'}`}>پشتیبانی هوایی {readout.air ? '✓' : '—'}</Badge>
        <Badge variant="outline" className={`text-[10.5px] font-extrabold ${readout.heli ? 'border-teal-500/50 bg-teal-500/10 text-teal-300' : 'text-muted-foreground'}`}>هلی‌برد {readout.heli ? '✓' : '—'}</Badge>
        <Badge variant="outline" className={`text-[10.5px] font-extrabold ${readout.chem ? 'border-rose-500/50 bg-rose-500/10 text-rose-300' : 'text-muted-foreground'}`}>سلاح شیمیایی {readout.chem ? '✓' : '—'}</Badge>
        <Badge variant="outline" className={`text-[10.5px] font-extrabold ${readout.crossing ? 'border-teal-500/50 bg-teal-500/10 text-teal-300' : 'text-muted-foreground'}`}>عبور آبی {readout.crossing ? '✓' : '—'}</Badge>
        {readout.tricks > 0 && <Badge variant="outline" className="border-amber-500/50 bg-amber-500/10 text-[10.5px] font-extrabold text-amber-400">🃏 کلک جنگی: {toFa(readout.tricks)}</Badge>}
        {readout.simultaneous > 0 && <Badge variant="outline" className="border-sky-500/50 bg-sky-500/10 text-[10.5px] font-extrabold text-sky-300">⇄ عملیات همزمان: {toFa(readout.simultaneous)}</Badge>}
        {readout.liberated?.map(l => (
          <Badge key={l} variant="outline" className="border-emerald-500/50 bg-emerald-500/10 text-[10.5px] font-extrabold text-emerald-300">📐 {l}</Badge>
        ))}
      </div>

      {/* سربرگ نقشه */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="border border-rose-500/40 bg-rose-950/60 text-rose-200" variant="outline">⚔ نقشه رزمی خودخوان</Badge>
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
              <pattern id="bmLibHatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="7" stroke="oklch(0.72 0.15 165 / 0.30)" strokeWidth="2.2" />
              </pattern>
            </defs>
            <rect width={W} height={H} fill="url(#bmSea)" />
            <rect width={W} height={H} fill="url(#bmGrid)" />
            {/* خشکی ایران و عراق */}
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

            {/* برچسب کشورها/دریا */}
            {data.labels?.map(l => (
              <text key={l.text} x={px(l.pos[1])} y={py(l.pos[0])} fill={l.color ?? 'oklch(0.85 0.02 90 / 0.5)'} fontSize={l.size ?? 18} fontWeight="800" textAnchor="middle">{l.text}</text>
            ))}

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

            {/* ── مقایسه قبل/بعد: خاک آزادشده و خط مقدم ── */}
            {layers.prepost && (
              <g>
                {data.liberated?.map(z => (
                  <g key={z.id}>
                    <path d={ringToPath(z.ring, px, py)} fill="url(#bmLibHatch)" stroke="oklch(0.72 0.15 165 / 0.85)" strokeWidth="1.4" strokeDasharray="5 4" />
                    <text x={px(centroid(z.ring)[1])} y={py(centroid(z.ring)[0])} fill="oklch(0.88 0.10 165)" fontSize="11.5" fontWeight="800" textAnchor="middle">{z.label}</text>
                  </g>
                ))}
                {data.preFLOT && data.preFLOT !== data.postFLOT && (
                  <g>
                    <path d={pathToD(data.preFLOT, px, py)} fill="none" stroke="oklch(0.70 0.01 90)" strokeWidth="2.2" strokeLinecap="round" />
                    <FlotLabel x={px(data.preFLOT[0][1])} y={py(data.preFLOT[0][0]) - 14} text="خط مقدم — قبل" color="oklch(0.78 0.02 90)" />
                  </g>
                )}
                {data.postFLOT && (
                  <g>
                    <path d={pathToD(data.postFLOT, px, py)} fill="none" stroke="oklch(0.82 0.16 165)" strokeWidth="3.2" strokeLinecap="round" />
                    <FlotLabel x={px(data.postFLOT[data.postFLOT.length - 1][1])} y={py(data.postFLOT[data.postFLOT.length - 1][0]) + 16} text="خط مقدم — بعد" color="oklch(0.82 0.16 165)" />
                  </g>
                )}
              </g>
            )}

            <g key={phase.id} className="bm-phase-in">
              {/* تدابیر پدافندی */}
              {layers.defenses && phase.defenses?.map(d => <DefenseLayer key={d.id} d={d} px={px} py={py} />)}

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

              {/* محورهای پیشروی — پیکان پهن تیپر */}
              {layers.arrows && phase.arrows?.map((a, ai) => {
                const kind = kindOf(a, ai)
                const color = arrowColor(kind, a.side)
                const pts: [number, number][] = a.path.map(c => [px(c[1]), py(c[0])])
                const labelX = px(a.path[0][1])
                const labelY = py(a.path[0][0]) - 9
                if (kind === 'deception') {
                  // محور فریب: خط‌چین کهربایی
                  return (
                    <g key={a.id}>
                      <path d={pathToD(a.path, px, py)} fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeDasharray="10 8" className="bm-march" />
                      <text x={labelX} y={labelY} fill={color} fontSize="11.5" fontWeight="800" textAnchor="middle" stroke="oklch(0.12 0 0 / 0.85)" strokeWidth="0.6" paintOrder="stroke">◎ فریب — {a.label}</text>
                    </g>
                  )
                }
                if (kind === 'air') {
                  // حرکت هوایی: خط نقطه‌چین + هواپیما در سر
                  const [ex, ey] = pts[pts.length - 1]
                  return (
                    <g key={a.id}>
                      <path d={pathToD(a.path, px, py)} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeDasharray="3 6" className="bm-march" />
                      <g transform={`translate(${ex},${ey})`} className="bm-pulse">
                        <path d="M0,-7 L1.8,-2 L7,1 L7,2.5 L1.3,1.2 L0.6,4.8 L2.4,6.3 L0,5.4 L-2.4,6.3 L-0.6,4.8 L-1.3,1.2 L-7,2.5 L-7,1 L-1.8,-2 Z" fill={color} />
                      </g>
                      <text x={labelX} y={labelY} fill={color} fontSize="11.5" fontWeight="800" textAnchor="middle" stroke="oklch(0.12 0 0 / 0.85)" strokeWidth="0.6" paintOrder="stroke">{a.label}</text>
                    </g>
                  )
                }
                // محور زمینی: پیکان پهن
                const w0 = kind === 'main' ? 4 : 2.5
                const w1 = kind === 'main' ? 13 : 9
                const { body, head } = taperedArrow(pts, w0, w1)
                return (
                  <g key={a.id}>
                    <path d={body} fill={color} opacity={kind === 'counter' ? 0.85 : 0.95} />
                    <path d={head} fill={color} />
                    <text x={labelX} y={labelY} fill={color} fontSize="11.5" fontWeight="800" textAnchor="middle" stroke="oklch(0.12 0 0 / 0.85)" strokeWidth="0.6" paintOrder="stroke">{a.label}</text>
                  </g>
                )
              })}

              {/* عبورهای آبی */}
              {layers.crossings && phase.crossings?.map(c => (
                <CrossingMarker key={c.id} c={c} x={px(c.pos[1])} y={py(c.pos[0])} />
              ))}

              {/* رویدادهای هوایی */}
              {layers.air && phase.airEvents?.map(e => (
                <AirMarker key={e.id} ev={e} x={px(e.pos[1])} y={py(e.pos[0])} />
              ))}

              {/* نقاط کلیدی */}
              {layers.points && data.points.map(p => (
                <g key={p.id} transform={`translate(${px(p.lng)},${py(p.lat)})`}>
                  <PointIcon type={p.type} />
                  <circle r="7.5" fill="transparent" />
                  <circle r="5.5" fill={p.side === 'iraq' ? 'oklch(0.72 0.13 60)' : 'oklch(0.88 0.05 90)'} stroke="oklch(0.15 0 0)" strokeWidth="1" />
                  <text x="7" y="4" fontSize="12" fontWeight="700" fill="oklch(0.94 0.01 95)" stroke="oklch(0.12 0 0 / 0.8)" strokeWidth="0.55" paintOrder="stroke">{p.name}</text>
                </g>
              ))}

              {/* نماد یگان‌ها */}
              {layers.flags && phase.flags?.map(f => (
                <UnitMarker key={f.id} side={f.side} label={f.label} sym={f.sym} x={px(f.pos[1])} y={py(f.pos[0])} />
              ))}
            </g>

            {/* قطب‌نما */}
            <g transform={`translate(${vb.x + vb.w - 46},${vb.y + 44})`}>
              <circle r="20" fill="oklch(0.15 0 0 / 0.55)" stroke="oklch(0.85 0.03 90 / 0.5)" strokeWidth="1" />
              <polygon points="0,-14 4,4 0,1 -4,4" fill="oklch(0.85 0.12 30)" />
              <text x="0" y="17" fontSize="10" fontWeight="800" textAnchor="middle" fill="oklch(0.9 0.02 95)">ش</text>
            </g>

            {/* مقیاس کیلومتری */}
            <g transform={`translate(${vb.x + 18},${vb.y + vb.h - 22})`}>
              <line x1="0" y1="0" x2={scalePx} y2="0" stroke="oklch(0.92 0.01 95)" strokeWidth="2.4" />
              <line x1="0" y1="-5" x2="0" y2="5" stroke="oklch(0.92 0.01 95)" strokeWidth="2" />
              <line x1={scalePx} y1="-5" x2={scalePx} y2="5" stroke="oklch(0.92 0.01 95)" strokeWidth="2" />
              <text x={scalePx / 2} y="-8" fontSize="11" fontWeight="800" textAnchor="middle" fill="oklch(0.92 0.01 95)">{toFa(scaleKm)} کیلومتر</text>
            </g>
          </svg>

          {/* کلید افسانه */}
          <button
            onClick={() => setShowLegend(s => !s)}
            className="absolute bottom-2 right-2 rounded-xl border bg-background/85 px-3 py-1.5 text-[11px] font-extrabold text-primary backdrop-blur transition-colors hover:bg-background"
          >
            {showLegend ? 'بستن افسانه' : '📖 افسانه کامل نمادها'}
          </button>
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
                📈 {phase.advance}
              </div>
            )}
          </div>

          {/* لایه‌ها */}
          <div className="flex flex-wrap gap-1.5 rounded-2xl border bg-card/60 p-3">
            <span className="w-full text-[10px] font-extrabold tracking-widest text-muted-foreground">لایه‌های نقشه</span>
            {layerBtn('prepost', 'قبل/بعد — تغییر مرز')}
            {layerBtn('arrows', 'محورهای حمله')}
            {layerBtn('defenses', 'تدابیر پدافندی')}
            {layerBtn('air', 'رویدادهای هوایی')}
            {layerBtn('crossings', 'عبورهای آبی')}
            {layerBtn('flags', 'یگان‌ها')}
            {layerBtn('zones', 'مناطق کنترل')}
            {layerBtn('fronts', 'خط تماس')}
            {layerBtn('points', 'نقاط کلیدی')}
            {layerBtn('rivers', 'آب‌ها')}
            {layerBtn('border', 'مرز بین‌المللی')}
          </div>
        </div>
      </div>

      {/* افسانه کامل */}
      {showLegend && (
        <div className="grid grid-cols-1 gap-x-6 gap-y-1.5 rounded-2xl border bg-card/70 p-4 sm:grid-cols-2 lg:grid-cols-4">
          {LEGEND_ITEMS.map(it => (
            <div key={it.kind} className="flex items-center gap-2 text-[11px] font-bold">
              <span className="shrink-0"><LegendGlyph kind={it.kind} /></span>
              <span className="text-muted-foreground">{it.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* کلک‌های جنگی + عملیات همزمان */}
      {(data.tricks?.length || data.simultaneous?.length) ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {data.tricks?.length ? (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
              <div className="mb-2 text-xs font-extrabold text-amber-400">🃏 کلک‌های جنگی این نبرد</div>
              <ul className="space-y-2">
                {data.tricks.map(t => (
                  <li key={t.title} className="rounded-xl border bg-card/60 p-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-extrabold">{t.title}</span>
                      {t.conf && <ConfidenceBadge c={t.conf} />}
                    </div>
                    <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{t.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {data.simultaneous?.length ? (
            <div className="rounded-2xl border border-sky-500/30 bg-sky-500/5 p-4">
              <div className="mb-2 text-xs font-extrabold text-sky-300">⇄ عملیات‌های همزمان در جبهه‌های دیگر</div>
              <ul className="space-y-2">
                {data.simultaneous.map(s => (
                  <li key={s.label} className="rounded-xl border bg-card/60 p-2.5">
                    <div className="text-xs font-extrabold text-sky-300">{s.label}</div>
                    <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{s.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* پانویس صادقانه */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-[11px] leading-6 text-amber-400">
        ⚠ {data.note} خطوط جبهه، مواضع، محورها و پیکان‌ها «ترسیم تقریبی آموزشی» هستند؛ برای هیچ یگانی ادعای موقعیت دقیق نداریم و نقشه جانشین اسناد عملیاتی نیست.
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
