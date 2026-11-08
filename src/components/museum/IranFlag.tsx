'use client'

// ─── پرچم رسمی جمهوری اسلامی ایران — تصویر یک‌پارچه با نشان «الله» در مرکز ───
// فایل رسمی پرچم (شامل نشان الله، کتیبه‌های الله‌اکبر بالا/پایین و سه نوار رسمی) یک‌جا نمایش داده می‌شود؛
// موج پارچه با فیلتر SVG (feTurbulence + feDisplacementMap متحرک) روی همان یک تصویر اجرا می‌شود — بدون برش چندتکه.
// کلیک روی پرچم = پخش/توقف موسیقی «خاک سرخ».

import { useEffect, useState } from 'react'

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
      {/* پرچم یک‌پارچه رسمی (نشان الله در مرکز) + موج پارچه با فیلتر SVG */}
      <div className="relative h-11 w-[68px] overflow-hidden rounded-[5px] sm:h-[52px] sm:w-[84px]" aria-hidden="true">
        <svg className="flag-cloth h-full w-full" viewBox="0 0 630 360" role="img" aria-label="پرچم جمهوری اسلامی ایران">
          <defs>
            <filter id="iranFlagWave" x="-15%" y="-15%" width="130%" height="130%">
              <feTurbulence type="fractalNoise" baseFrequency="0.011 0.05" numOctaves="2" seed="7" result="noise">
                <animate attributeName="baseFrequency" values="0.011 0.05;0.015 0.068;0.011 0.05" dur="4.8s" repeatCount="indefinite" />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="9" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
          {/* تصویر رسمی پرچم — کمی بزرگ‌تر از قاب تا لبه موج‌خورده خالی نماند */}
          <image href="/images/flag-iran.svg" x="-18" y="-10" width="666" height="380" filter="url(#iranFlagWave)" preserveAspectRatio="xMidYMid slice" />
        </svg>
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
