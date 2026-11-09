'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'

// ─── لینک اصلی موسیقی «خاک سرخ» — دقیقاً همان لینک انتخابی کارفرما؛ بدون جایگزینی ───
const AUDIO_SRC =
  'https://dl2.mifamusic.ir/Music/1389/03/16/Mohammadreza%20Aligholi%20-%20Khake%20Sorkh/01%20-%20Khak-e-Sorkh.mp3'
const STORE_KEY = 'defa-music-pref'

/** آیکون‌های SVG — مستقل از فونت ایموجی دستگاه (روی برخی سیستم‌ها ایموجی tofu/بلوک تیره می‌شود) */
function PlayIcon({ pause = false }: { pause?: boolean }) {
  return pause ? (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-4 w-4 translate-x-[1px]" fill="currentColor" aria-hidden="true">
      <path d="M8 5.5 L19 12 L8 18.5 Z" />
    </svg>
  )
}

function SoundIcon({ muted = false }: { muted?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M4 9.5 h3.5 L12 5.5 v13 L7.5 14.5 H4 Z" fill="currentColor" stroke="none" />
      {muted ? (
        <>
          <path d="M16 9.5 l5 5 M21 9.5 l-5 5" />
        </>
      ) : (
        <>
          <path d="M15.5 9.2 a4.2 4.2 0 0 1 0 5.6" />
          <path d="M18.2 7 a7.6 7.6 0 0 1 0 10" />
        </>
      )}
    </svg>
  )
}

/**
 * پخش‌کننده موسیقی متن «خاک سرخ» — اثر محمدرضا علیقلی
 * پخش مستقیم از لینک عمومی انتخاب‌شده توسط کارفرما (mifamusic)؛ هیچ فایل جایگزین یا ساخت موزه استفاده نمی‌شود.
 * در صورت قطع لینک توسط سرور میزبان، پیام شفاف نمایش داده می‌شود و لینک اصلی ارائه می‌گردد.
 */
export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const armedRef = useRef(false)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(0.45)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState(false)
  const duckRef = useRef(0) // شمار روایت‌های در حال پخش — هنگام روایت، موسیقی ساکت می‌شود
  const resumeRef = useRef(false)
  const mutedRef = useRef(muted)
  const volumeRef = useRef(volume)
  const playingRef = useRef(false)

  // بازیابی تنظیم کاربر — پس از مونت (نه حین رندر) تا عدم تطابق هیدریشن رخ ندهد
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem(STORE_KEY)
      if (!raw) return
      const p = JSON.parse(raw) as { muted?: boolean; volume?: number }
      if (typeof p.muted === 'boolean') setMuted(p.muted)
      if (typeof p.volume === 'number') setVolume(p.volume)
    } catch { /* بی‌اهمیت */ }
  }, [])

  // اطلاع‌رسانی وضعیت پخش به سایر اجزا (پرچم ایران گوشه تصویر)
  useEffect(() => {
    playingRef.current = playing
    window.dispatchEvent(new CustomEvent('museum-music-state', { detail: { playing } }))
  }, [playing])

  useEffect(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify({ muted, volume })) } catch { /* بی‌اهمیت */ }
    if (audioRef.current) audioRef.current.muted = muted
  }, [muted, volume])

  const play = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    if (duckRef.current > 0) return // روایت در جریان است — موسیقی پخش نشود
    a.volume = volume
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
  }, [volume])

  const toggle = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    if (playingRef.current) {
      a.pause()
      setPlaying(false)
    } else {
      play()
    }
  }, [play])

  // هماهنگی با روایت‌های شنیداری: هنگام روایت سکوت، پس از روایت بازیابی (الگوی اشتراک رویداد)
  useEffect(() => {
    mutedRef.current = muted
    volumeRef.current = volume
  }, [muted, volume])

  useEffect(() => {
    const up = () => {
      duckRef.current += 1
      const a = audioRef.current
      if (a && !a.paused) {
        resumeRef.current = !mutedRef.current
        a.pause()
        setPlaying(false)
      }
    }
    const down = () => {
      duckRef.current = Math.max(0, duckRef.current - 1)
      if (duckRef.current === 0 && resumeRef.current) {
        resumeRef.current = false
        const a = audioRef.current
        if (a && !mutedRef.current) {
          a.volume = volumeRef.current
          a.play().then(() => setPlaying(true)).catch(() => { /* بی‌اهمیت */ })
        }
      }
    }
    window.addEventListener('narration-play', up)
    window.addEventListener('narration-stop', down)
    window.addEventListener('narration-ended', down)
    // پرچم ایران (گوشه تصویر) هم می‌تواند موسیقی را کنترل کند
    const onFlagToggle = () => toggle()
    window.addEventListener('museum-toggle-music', onFlagToggle)
    return () => {
      window.removeEventListener('narration-play', up)
      window.removeEventListener('narration-stop', down)
      window.removeEventListener('narration-ended', down)
      window.removeEventListener('museum-toggle-music', onFlagToggle)
    }
  }, [toggle])

  // پخش پس از نخستین تعامل کاربر (سیاست مرورگرها) — اگر کاربر قبلاً میوت نکرده باشد
  useEffect(() => {
    const arm = () => {
      if (armedRef.current) return
      armedRef.current = true
      if (!muted) play()
      window.removeEventListener('pointerdown', arm)
      window.removeEventListener('keydown', arm)
    }
    window.addEventListener('pointerdown', arm, { once: true })
    window.addEventListener('keydown', arm, { once: true })
    return () => { window.removeEventListener('pointerdown', arm); window.removeEventListener('keydown', arm) }
  }, [play, muted])

  return (
    <div className="fixed bottom-3 left-3 z-50 flex flex-col items-start gap-1.5" dir="rtl">
      {open && (
        <div className="w-72 rounded-2xl border bg-card/95 p-3 shadow-xl backdrop-blur">
          <div className="text-xs font-extrabold text-primary">🎵 موسیقی متن «خاک سرخ» — محمدرضا علیقلی</div>
          <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
            پخش مستقیم از همان لینک اصلی انتخاب‌شده برای یادواره؛ هیچ فایل جایگزین یا بازسازی‌شده‌ای استفاده نمی‌شود.
          </p>
          <a href={AUDIO_SRC} target="_blank" rel="noreferrer" className="mt-1.5 block break-all text-[10px] font-bold text-primary underline decoration-dotted">
            لینک اصلی قطعه (dl2.mifamusic.ir) ↗
          </a>
          {error && (
            <p className="mt-2 rounded-lg bg-amber-500/10 p-2 text-[10.5px] leading-5 text-amber-600">
              ⚠ پخش مستقیم از سرور میزبان موقتاً ممکن نشد (محدودیت سرورِ میزبان فایل یا قطعی لینک). با دکمه «لینک اصلی قطعه» می‌توانید همان قطعه را مستقیم بشنوید.
            </p>
          )}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[11px] font-bold">🔊 صدا</span>
            <input
              type="range" min={0} max={1} step={0.05} value={volume} aria-label="میزان صدا"
              onChange={e => { const v = Number(e.target.value); setVolume(v); if (audioRef.current) audioRef.current.volume = v }}
              className="h-1.5 flex-1 accent-emerald-500"
            />
          </div>
        </div>
      )}
      <div className="flex items-center gap-1.5 rounded-full border bg-card/95 py-1 pl-3 pr-1.5 shadow-xl backdrop-blur">
        <audio
          ref={audioRef}
          src={AUDIO_SRC}
          loop
          preload="none"
          onError={() => { setError(true); setPlaying(false) }}
          onStalled={() => { /* شبکه کند — کاری نمی‌کنیم */ }}
        />
        <Button size="sm" onClick={toggle}
          aria-label={playing ? 'توقف موسیقی' : 'پخش موسیقی'}
          className="h-8 w-8 rounded-full p-0 leading-none">
          <PlayIcon pause={playing} />
        </Button>
        <Button size="sm" variant={muted ? 'secondary' : 'outline'} onClick={() => setMuted(m => !m)}
          aria-label={muted ? 'صدا دادن موسیقی' : 'میوت کردن موسیقی'}
          className="h-8 gap-1 rounded-full px-2.5 text-xs font-extrabold">
          <SoundIcon muted={muted} />
          <span>{muted ? 'میوت' : 'صدا'}</span>
        </Button>
        <button onClick={() => setOpen(o => !o)} className="text-[11px] font-extrabold text-muted-foreground hover:text-primary" aria-expanded={open}>
          {open ? 'بستن ✕' : 'خاک سرخ ♪'}
        </button>
      </div>
    </div>
  )
}
