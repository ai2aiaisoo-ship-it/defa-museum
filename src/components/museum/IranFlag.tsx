'use client'

// ─── پرچم متحرک جمهوری اسلامی ایران — گوشه تصویر ───
// پرچم با ۱۲ برش عمودی و انیمیشن سینوسی موج می‌زند؛ کلیک روی پرچم = پخش/توقف موسیقی «خاک سرخ».
// نشان مرکزی به‌صورت گرافیک ساده‌شده (چهار هلال و شمشیر) رسم شده است.

import { useEffect, useState } from 'react'

const SLICES = 12
const GREEN = '#239f40'
const RED = '#da0000'
const WHITE = '#ffffff'

/** نشان ساده‌شده مرکز پرچم — خطوط هلالی و شمشیر (نماد «الله») */
function Emblem() {
  return (
    <svg viewBox="0 0 40 40" className="h-[46%] w-auto" aria-hidden="true">
      <g fill="none" stroke={RED} strokeWidth="2.6" strokeLinecap="round">
        {/* هلال‌های چهارگانه */}
        <path d="M14 7 C7 11 5 20 9 27 C11 30 14 32 17 33 C12 29 10.5 22 13 16 C13.8 14 14.8 12.2 16 10.8 Z" fill={RED} stroke="none" />
        <path d="M26 7 C33 11 35 20 31 27 C29 30 26 32 23 33 C28 29 29.5 22 27 16 C26.2 14 25.2 12.2 24 10.8 Z" fill={RED} stroke="none" />
        {/* دو قوس میانی */}
        <path d="M17.5 9 C15 14 15 24 18 30" />
        <path d="M22.5 9 C25 14 25 24 22 30" />
        {/* شمشیر مرکزی */}
        <path d="M20 6 L20 32" />
        <path d="M17.6 32.5 L22.4 32.5" strokeWidth="2" />
      </g>
    </svg>
  )
}

export function IranFlag() {
  const [playing, setPlaying] = useState(false)

  // همگام‌سازی با پخش‌کننده موسیقی — رویداد اشتراکی
  useEffect(() => {
    const sync = (e: Event) => setPlaying(Boolean((e as CustomEvent<{ playing?: boolean }>).detail?.playing))
    window.addEventListener('museum-music-state', sync)
    return () => window.removeEventListener('museum-music-state', sync)
  }, [])

  const toggle = () => window.dispatchEvent(new CustomEvent('museum-toggle-music'))

  return (
    <button
      type="button"
      onClick={toggle}
      title="پرچم ایران — کلیک: پخش/توقف موسیقی «خاک سرخ»"
      aria-label="پرچم متحرک ایران؛ کلیک برای پخش یا توقف موسیقی یادواره"
      className="group fixed bottom-3 right-3 z-50 select-none rounded-md border border-black/30 shadow-[0_8px_24px_rgba(0,0,0,0.45)] outline-none transition-transform duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-amber-300"
      style={{ perspective: '400px' }}
    >
      {/* پرچم چندبرشی */}
      <div className="relative flex h-11 w-[68px] overflow-hidden rounded-[5px] sm:h-[52px] sm:w-[84px]" aria-hidden="true">
        {Array.from({ length: SLICES }).map((_, i) => (
          <span
            key={i}
            className="flag-slice h-full flex-1"
            style={{
              background: `linear-gradient(180deg, ${GREEN} 0 33.4%, ${WHITE} 33.4% 66.7%, ${RED} 66.7% 100%)`,
              animationDelay: `${-i * 0.09}s`,
            }}
          />
        ))}
        {/* نشان مرکزی */}
        <span className="absolute inset-0 flex items-center justify-center" style={{ transform: 'translateY(-4%)' }}>
          <Emblem />
        </span>
        {/* برق نور در حال حرکت روی پارچه */}
        <span className="flag-sheen pointer-events-none absolute inset-0" />
        {/* حاشیه سایه بالا و پایین برای عمق پارچه */}
        <span className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.18), transparent 30%, transparent 72%, rgba(0,0,0,0.22))' }} />
      </div>
      {/* نشانگر پخش موسیقی */}
      {playing && (
        <span className="absolute -top-1.5 -left-1.5 grid h-4 w-4 place-items-center rounded-full bg-emerald-500 text-[9px] font-black text-white shadow" aria-hidden="true">
          ♪
        </span>
      )}
      <span className="sr-only">پرچم ایران؛ کلیک برای پخش یا توقف موسیقی خاک سرخ</span>
    </button>
  )
}
