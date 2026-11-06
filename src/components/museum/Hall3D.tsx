'use client'

// ─── تالار سه‌بعدی عملیات‌های دفاع مقدس ───
// تجربه گشت‌گذار موزه‌ای: با اسکرول وارد تالار می‌شوید، دوربین در راهروی سه‌بعدی پیش می‌رود،
// یکی‌درمیان به سمت راست و سپس چپ می‌چرخد و مقابل تابلوی هر عملیات می‌ایستد.
// تابلوها به ترتیب تاریخ شروع عملیات چیده شده‌اند؛ کلیک روی هر تابلو، پرونده کامل عملیات را باز می‌کند.
// پیاده‌سازی: CSS 3D Transforms (بدون کتابخانه سنگین) — همگام با اسلایدر موبایل و جست‌وجوی سریع.

import { useEffect, useMemo, useRef } from 'react'
import { OPERATIONS, getOperation, RESULT_LABELS } from '@/data/operations'
import { formatJalali, toFa } from '@/lib/jalali'
import { Button } from '@/components/ui/button'
import { ConfidenceBadge } from './ui-bits'

// ── ثابت‌های تالار ──
const HALF_W = 350            // نصف عرض راهرو (دیوارها در x=±350)
const FLOOR_Y = 190           // کف
const CEIL_Y = -190           // سقف
const SEG = 200               // اسکرول لازم برای هر سگمنت مسیر دوربین
const PERSP_MIN = 820
const PERSP_MAX = 1400

// ۱۰ عملیات شاخص به ترتیب تاریخ شروع — یکی‌درمیان راست/چپ
const HALL_OP_IDS = [
  'khorramshahr-battle',   // ۱۳۵۹
  'samen-ol-aemmeh',       // ۱۳۶۰
  'tariq-ol-qods',         // ۱۳۶۰
  'bayt-almoghaddas',      // ۱۳۶۱
  'ramadan-61',            // ۱۳۶۱
  'kheibar',               // ۱۳۶۲
  'valfajr-8',             // ۱۳۶۴
  'karbala-4',             // ۱۳۶۵
  'karbala-5',             // ۱۳۶۵
  'mersad',                // ۱۳۶۷
] as const

const IMAM_NAMES = ['یا زهرا (س)', 'یا حسین (ع)', 'یا ابوالفضل العباس (ع)', 'یا علی (ع)', 'یا مهدی (عج)']
const BAND_STYLES = [
  { bg: '#14532d', border: '#22c55e', text: '#f0fdf4' },  // سبز
  { bg: '#7f1d1d', border: '#ef4444', text: '#fff1f2' },  // قرمز
  { bg: '#f5f5f4', border: '#a8a29e', text: '#b91c1c' },  // سفید
]

interface KF { d: number; yaw: number; cx: number }

/** تابلوی یادبود هنری هر عملیات — سند بصری طراحی‌شده، نه عکس آرشیوی جعلی */
function OperationPanel({ opId }: { opId: string }) {
  const op = getOperation(opId)
  if (!op) return null
  const dateLabel = op.faStart ? formatJalali(op.faStart) : `سال ${toFa(op.year)}`
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[linear-gradient(160deg,#1c1917_0%,#292524_45%,#171412_100%)] p-3 text-right" dir="rtl">
      {/* سرصفحه تابلو */}
      <div className="flex items-center justify-between text-[9px] font-extrabold tracking-widest text-amber-300/80">
        <span>تابلوی یادبود</span>
        <span className="rounded border border-amber-400/40 bg-amber-400/10 px-1.5 py-0.5">سال {toFa(op.year)}</span>
      </div>
      {/* نام عملیات */}
      <h3 className="mt-1.5 line-clamp-3 text-[19px] font-black leading-snug text-amber-50">{op.faName}</h3>
      <p className="mt-1 text-[10px] text-stone-400">📍 {op.region}</p>
      {/* نشان لاله — نماد شهادت */}
      <div className="relative my-2 flex flex-1 items-center justify-center">
        <span className="absolute select-none text-[64px] font-black text-amber-100/5">{toFa(op.year)}</span>
        <svg viewBox="0 0 40 48" className="h-20 w-16 drop-shadow-[0_0_12px_rgba(239,68,68,0.45)]" aria-hidden="true">
          <path d="M20 4 C16 12 10 15 10 24 C10 32 14 37 20 37 C26 37 30 32 30 24 C30 15 24 12 20 4 Z" fill="#dc2626" />
          <path d="M20 10 C18 15 14.5 17 14.5 23 C14.5 28 16.5 31 20 31.5 C23.5 31 25.5 28 25.5 23 C25.5 17 22 15 20 10 Z" fill="#b91c1c" />
          <path d="M12 30 C8 34 6 40 8 46 C13 44 16 39 16.5 33 Z" fill="#15803d" />
          <path d="M28 30 C32 34 34 40 32 46 C27 44 24 39 23.5 33 Z" fill="#166534" />
          <path d="M19.4 36 L20.6 36 L21 46 L19 46 Z" fill="#166534" />
        </svg>
      </div>
      {/* پانوشت تابلو */}
      <div className="mt-auto space-y-1 border-t border-amber-400/25 pt-1.5">
        <div className="flex items-center justify-between text-[10px] font-bold">
          <span className="text-stone-300">{dateLabel}</span>
          <span className="rounded bg-emerald-900/60 px-1.5 py-0.5 text-emerald-300 border border-emerald-500/40">{RESULT_LABELS[op.result] ?? op.result}</span>
        </div>
        <div className="flex items-center justify-between text-[9px] text-stone-500">
          <span>برای پرونده کامل کلیک کنید</span>
          <ConfidenceBadge c={op.status === 'published' ? 'A' : 'B'} />
        </div>
      </div>
    </div>
  )
}

export function Hall3D({ go }: { go: (v: string, p?: string) => void }) {
  const ops = useMemo(() => HALL_OP_IDS.map(id => getOperation(id)).filter(Boolean), [])
  const N = ops.length
  const L = 900 + (N - 1) * 640 + 1400 // طول راهرو

  const stageRef = useRef<HTMLDivElement | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const worldRef = useRef<HTMLDivElement | null>(null)
  const frameRefs = useRef<(HTMLDivElement | null)[]>([])
  const sliderRef = useRef<HTMLInputElement | null>(null)
  const pctRef = useRef<HTMLSpanElement | null>(null)
  const hintRef = useRef<HTMLDivElement | null>(null)

  // کی‌فریم‌های مسیر دوربین — بازمحاسبه در تغییر اندازه (فاصله توقف تابع ارتفاع صفحه)
  const buildPath = (): KF[] => {
    const vh = typeof window !== 'undefined' ? window.innerHeight : 720
    const dwell = Math.min(420, Math.max(320, vh * 0.55))
    const cxFull = HALF_W - dwell // انحراف جانبی دوربین هنگام توقف مقابل تابلو
    const kfs: KF[] = [{ d: 0, yaw: 0, cx: 0 }]
    for (let i = 0; i < N; i++) {
      const zi = 900 + i * 640
      const right = i % 2 === 0
      const yaw = right ? -90 : 90
      const cx = right ? cxFull : -cxFull
      kfs.push(
        { d: zi - 620, yaw: 0, cx: 0 },
        { d: zi - 350, yaw: yaw * 0.5, cx: cx * 0.35 },
        { d: zi - 270, yaw, cx },
        { d: zi - 150, yaw, cx },
        { d: zi - 40, yaw: 0, cx: 0 },
      )
    }
    kfs.push({ d: L - 380, yaw: 0, cx: 0 }, { d: L - 290, yaw: 0, cx: 0 })
    return kfs
  }

  const pathRef = useRef<KF[]>([])
  const metricsRef = useRef({ maxScroll: 1, wrapTop: 0, persp: 1150, reduceMotion: false })
  const targetPRef = useRef(0)
  const smoothPRef = useRef(0)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    metricsRef.current.reduceMotion = reduce

    const recompute = () => {
      pathRef.current = buildPath()
      const stage = stageRef.current
      const wrap = wrapRef.current
      if (!stage || !wrap) return
      const header = document.querySelector('header')
      const top = header ? header.offsetHeight : 84
      const stageH = window.innerHeight - top
      stage.style.top = `${top}px`
      stage.style.height = `${stageH}px`
      const K = pathRef.current.length
      const maxScroll = (K - 1) * SEG
      wrap.style.height = `${stageH + maxScroll}px`
      const rect = wrap.getBoundingClientRect()
      metricsRef.current.wrapTop = rect.top + window.scrollY
      metricsRef.current.maxScroll = maxScroll
      metricsRef.current.persp = Math.min(PERSP_MAX, Math.max(PERSP_MIN, window.innerWidth * 0.95))
      const perspEl = stage.querySelector('.hall-persp') as HTMLElement | null
      if (perspEl) perspEl.style.perspective = `${metricsRef.current.persp}px`
      targetPRef.current = Math.min(1, Math.max(0, (window.scrollY - metricsRef.current.wrapTop) / maxScroll))
      smoothPRef.current = targetPRef.current
    }

    recompute()
    window.addEventListener('resize', recompute)
    const t = setTimeout(recompute, 300) // پس از پایدار شدن فونت/چیدمان
    const onScroll = () => {
      const m = metricsRef.current
      targetPRef.current = Math.min(1, Math.max(0, (window.scrollY - m.wrapTop) / m.maxScroll))
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // حلقه رندر — به‌روزرسانی مستقیم DOM بدون re-render
    let raf = 0
    const loop = () => {
      const m = metricsRef.current
      const kfs = pathRef.current
      const target = targetPRef.current
      smoothPRef.current = m.reduceMotion ? target : smoothPRef.current + (target - smoothPRef.current) * 0.14
      const p = smoothPRef.current

      // درون‌یابی مسیر
      const x = p * (kfs.length - 1)
      const i0 = Math.min(kfs.length - 2, Math.floor(x))
      const t = x - i0
      const e = t * t * (3 - 2 * t) // smoothstep
      const a = kfs[i0], b = kfs[i0 + 1]
      const d = a.d + (b.d - a.d) * e
      const yaw = a.yaw + (b.yaw - a.yaw) * e
      const cx = a.cx + (b.cx - a.cx) * e
      const bob = m.reduceMotion ? 0 : Math.sin(d / 300) * 5

      if (worldRef.current) {
        worldRef.current.style.transform = `rotateY(${-yaw}deg) translate3d(${-cx}px, ${bob.toFixed(1)}px, ${d.toFixed(1)}px)`
      }
      // محو تدریجی تابلوها با فاصله
      for (let i = 0; i < N; i++) {
        const el = frameRefs.current[i]
        if (!el) continue
        const zi = 900 + i * 640
        const dist = zi - d
        const op = Math.min(1, Math.max(0, (1500 - dist) / 650))
        el.style.opacity = op.toFixed(2)
        el.style.visibility = dist < -40 || dist > 1700 ? 'hidden' : 'visible'
      }
      if (sliderRef.current) sliderRef.current.value = String(Math.round(p * 1000))
      if (pctRef.current) pctRef.current.textContent = toFa(Math.round(p * 100))
      if (hintRef.current) hintRef.current.style.opacity = p > 0.02 ? '0' : '1'
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', recompute)
      window.removeEventListener('scroll', onScroll)
      clearTimeout(t)
    }
  }, [N, L])

  const jumpToPainting = (i: number) => {
    const j = 1 + i * 5 + 3 // کی‌فریم «توقف مقابل تابلو»
    const m = metricsRef.current
    window.scrollTo({ top: m.wrapTop + (j / (pathRef.current.length - 1)) * m.maxScroll, behavior: 'smooth' })
  }
  const onSlider = (v: number) => {
    const m = metricsRef.current
    window.scrollTo({ top: m.wrapTop + (v / 1000) * m.maxScroll, behavior: 'auto' })
  }

  return (
    <div ref={wrapRef} className="relative" dir="rtl">
      <div ref={stageRef} className="sticky z-10 overflow-hidden rounded-none border-y bg-black">
        {/* صحنه پرسپکتیو */}
        <div className="hall-persp absolute inset-0" style={{ perspective: '1150px' }}>
          <div ref={worldRef} className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
            {/* دیوار راست — صفحه در x=+350 با نرمال رو به راهرو */}
            <div aria-hidden className="absolute left-1/2 top-1/2 backface-hidden" style={{
              width: L, height: 420, marginLeft: -L / 2, marginTop: -210, transformStyle: 'preserve-3d',
              background: 'linear-gradient(to bottom, #2a2216 0%, #41341f 30%, #4b3c26 55%, #32281a 100%)',
              boxShadow: 'inset 0 0 120px rgba(0,0,0,0.8)',
              transform: `translate3d(${HALF_W}px, 0px, ${-L / 2}px) rotateY(-90deg)`,
            }} />
            {/* دیوار چپ */}
            <div aria-hidden className="absolute left-1/2 top-1/2 backface-hidden" style={{
              width: L, height: 420, marginLeft: -L / 2, marginTop: -210, transformStyle: 'preserve-3d',
              background: 'linear-gradient(to bottom, #2a2216 0%, #41341f 30%, #4b3c26 55%, #32281a 100%)',
              boxShadow: 'inset 0 0 120px rgba(0,0,0,0.8)',
              transform: `translate3d(${-HALF_W}px, 0px, ${-L / 2}px) rotateY(90deg)`,
            }} />
            {/* کف خاکی */}
            <div aria-hidden className="absolute left-1/2 top-1/2" style={{
              width: HALF_W * 2, height: L, marginLeft: -HALF_W, marginTop: -L / 2, transformStyle: 'preserve-3d',
              background: 'linear-gradient(to right, #241b10, #4d3c22 50%, #241b10)',
              transform: `translate3d(0px, ${FLOOR_Y}px, ${-L / 2}px) rotateX(-90deg)`,
            }} />
            {/* سقف */}
            <div aria-hidden className="absolute left-1/2 top-1/2" style={{
              width: HALF_W * 2, height: L, marginLeft: -HALF_W, marginTop: -L / 2, transformStyle: 'preserve-3d',
              background: 'linear-gradient(to right, #0b0906, #191309 50%, #0b0906)',
              transform: `translate3d(0px, ${CEIL_Y}px, ${-L / 2}px) rotateX(90deg)`,
            }} />

            {/* تابلوهای عملیات‌ها — یکی‌درمیان راست/چپ */}
            {ops.map((op, i) => {
              const zi = 900 + i * 640
              const right = i % 2 === 0
              const o = op!
              return (
                <div key={o.id} className="absolute left-1/2 top-1/2" style={{ transformStyle: 'preserve-3d', marginLeft: -132, marginTop: -170, transform: `translate3d(${right ? HALF_W - 8 : -(HALF_W - 8)}px, -8px, ${-zi}px) rotateY(${right ? -90 : 90}deg)` }}>
                  {/* نورافکن دیوار */}
                  <div aria-hidden className="pointer-events-none absolute left-1/2 top-[-120px] h-[520px] w-[380px] -translate-x-1/2" style={{ background: 'radial-gradient(closest-side, rgba(251,191,36,0.16), transparent 70%)' }} />
                  {/* قاب تابلو */}
                  <div
                    ref={el => { frameRefs.current[i] = el }}
                    role="button" tabIndex={0}
                    aria-label={`پرونده ${o.faName} — ورود به تالار عملیات‌ها`}
                    onClick={() => go('operations', o.id)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go('operations', o.id) } }}
                    className="group relative h-[340px] w-[264px] cursor-pointer rounded-sm border-[7px] p-[3px] transition-transform duration-300 hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                    style={{
                      borderColor: '#8a6d2f',
                      background: 'linear-gradient(140deg, #d4af5a, #7a5c22 40%, #b8933f 70%, #6b4f1d)',
                      boxShadow: '0 18px 50px rgba(0,0,0,0.75), 0 0 34px rgba(251,191,36,0.12)',
                    }}
                  >
                    <div className="h-full w-full overflow-hidden rounded-[2px] border border-black/50">
                      <OperationPanel opId={o.id} />
                    </div>
                    {/* پلاک برنزی زیر قاب */}
                    <div className="absolute -bottom-[52px] right-1/2 w-[240px] translate-x-1/2 rounded-md border border-amber-200/30 bg-[linear-gradient(180deg,#6d5626,#4a3a17)] px-3 py-1.5 text-center shadow-lg">
                      <div className="text-[10.5px] font-extrabold leading-4 text-amber-100">{o.faName}</div>
                      <div className="text-[9px] text-amber-200/70">{o.faStart ? formatJalali(o.faStart) : `سال ${toFa(o.year)}`} • {o.region}</div>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* سربندهای آویزان از سقف با اسامی ائمه (ع) */}
            {Array.from({ length: N - 1 }).map((_, i) => {
              const zb = 1220 + i * 640
              const xs = [-165, 0, 165]
              const x = xs[i % 3]
              const st = BAND_STYLES[i % 3]
              return (
                <div key={`band-${i}`} className="absolute left-1/2 top-1/2" style={{ transformStyle: 'preserve-3d', marginLeft: -52, transform: `translate3d(${x}px, ${CEIL_Y}px, ${-zb}px)` }}>
                  <div className="hall-swing" style={{ transformOrigin: 'top center', backfaceVisibility: 'hidden' }}>
                    <div aria-hidden className="mx-auto h-10 w-[2px] bg-stone-600/70" />
                    <div
                      className="flex h-[150px] w-[104px] items-start justify-center pt-3 text-center"
                      style={{
                        background: `linear-gradient(180deg, ${st.bg}, ${st.bg}e6)`,
                        border: `1.5px solid ${st.border}66`,
                        color: st.text,
                        clipPath: 'polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)',
                        boxShadow: '0 10px 24px rgba(0,0,0,0.5)',
                      }}
                    >
                      <span className="text-[13px] font-black leading-6">{IMAM_NAMES[i % IMAM_NAMES.length]}</span>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* بنای یادبود انتهای تالار */}
            <div className="absolute left-1/2 top-1/2" style={{ transformStyle: 'preserve-3d', marginLeft: -215, marginTop: -165, transform: `translate3d(0px, 0px, ${-(L - 2)}px)` }}>
              <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: 'radial-gradient(closest-side, rgba(16,185,129,0.22), transparent 70%)' }} />
              <div className="relative flex h-[330px] w-[430px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-emerald-400/40 bg-[linear-gradient(180deg,#0f1a14,#0a0f0c)] p-6 text-center shadow-[0_0_60px_rgba(16,185,129,0.25)]">
                <span className="text-4xl">🌙</span>
                <h3 className="museum-title text-xl font-black text-emerald-200">پایان تالار عملیات‌ها</h3>
                <p className="max-w-[320px] text-[12px] leading-6 text-emerald-100/70">
                  از ثامن‌الأئمه تا مرصاد — این راهرو به یاد همه رزمنده‌ها و شهدای دفاع مقدس روشن است.
                  نام‌ها جاودانه شد؛ خط زمانی شهدا در انتظار شماست.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <Button size="sm" onClick={() => go('martyrs')}>🌙 ستارگان دفاع مقدس</Button>
                  <Button size="sm" variant="outline" onClick={() => go('operations')}>⚔ اطلس عملیات‌ها</Button>
                  <Button size="sm" variant="ghost" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↩ بازگشت به ورودی</Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* وینیت و مه */}
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)' }} />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />

        {/* راهنمای ورود */}
        <div ref={hintRef} className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 transition-opacity duration-500">
          <div className="rounded-2xl border border-amber-400/30 bg-black/60 px-8 py-6 text-center backdrop-blur">
            <div className="text-[11px] font-extrabold tracking-[0.4em] text-amber-300/80">دفاع مقدس</div>
            <h2 className="museum-title mt-1 text-2xl font-black text-amber-50 md:text-3xl">تالار سه‌بعدی عملیات‌ها</h2>
            <p className="mt-2 text-[12px] leading-6 text-stone-300">
              با اسکرول وارد تالار شوید؛ دوربین یکی‌درمیان به راست و چپ می‌چرخد و مقابل تابلوی هر عملیات می‌ایستد.
              روی هر تابلو کلیک کنید تا پرونده کامل باز شود.
            </p>
          </div>
          <div className="animate-bounce rounded-full border border-amber-400/40 bg-black/50 px-4 py-1.5 text-[11px] font-extrabold text-amber-200">↓ برای ورود اسکرول کنید</div>
        </div>

        {/* نوار بالا */}
        <div className="absolute right-3 top-3 z-20 flex items-center gap-2">
          <span className="rounded-full border border-amber-400/30 bg-black/60 px-3 py-1 text-[11px] font-extrabold text-amber-100 backdrop-blur">🏛 تالار سه‌بعدی عملیات‌ها</span>
          <span className="rounded-full border border-stone-600/50 bg-black/50 px-2.5 py-1 text-[11px] font-bold text-stone-300 backdrop-blur" dir="rtl">
            پیشرفت: <span ref={pctRef}>۰</span>٪
          </span>
        </div>

        {/* کنترل پایین: اسلایدر موبایل + پرش سریع */}
        <div className="absolute inset-x-0 bottom-3 z-20 mx-auto flex max-w-2xl flex-col items-center gap-2 px-3">
          <div className="flex w-full flex-wrap items-center justify-center gap-1" dir="rtl">
            <button onClick={() => window.scrollTo({ top: metricsRef.current.wrapTop, behavior: 'smooth' })} className="rounded-full border border-stone-600/60 bg-black/55 px-2.5 py-1 text-[10px] font-extrabold text-stone-200 backdrop-blur hover:border-amber-300">⌂ ورودی</button>
            {ops.map((op, i) => (
              <button key={op!.id} onClick={() => jumpToPainting(i)} title={op!.faName}
                className={`rounded-full border px-2.5 py-1 text-[10px] font-extrabold backdrop-blur transition-colors ${i % 2 === 0 ? 'border-amber-400/40 bg-black/55 text-amber-100 hover:bg-amber-400/20' : 'border-emerald-400/40 bg-black/55 text-emerald-100 hover:bg-emerald-400/20'}`}>
                {toFa(i + 1)}
              </button>
            ))}
          </div>
          <input ref={sliderRef} type="range" min={0} max={1000} defaultValue={0}
            aria-label="پیمایش تالار — کشیدن اسلایدر جای اسکرول"
            onChange={e => onSlider(Number(e.target.value))}
            className="w-full accent-amber-400" />
        </div>
      </div>
    </div>
  )
}
