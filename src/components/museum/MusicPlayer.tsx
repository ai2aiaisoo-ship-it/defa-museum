'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'

const AUDIO_SRC = '/audio/defa-ambient.wav'
const STORE_KEY = 'defa-music-pref'
const CREDIT_URL = 'https://www.navahang.com/mp3/mohammadreza-aligholi-khake-sorkh'

/**
 * پخش‌کننده موسیقی متن دفاع مقدس (قابل میوت)
 * فایل محلی: قطعه محیطی بی‌کلام الهام‌گرفته از موسیقی متن «خاک سرخ» (ساخته‌شده برای این موزه)
 * پیوند قطعه اصلی با صدای محمدرضا علیقلی برای شنیدن نسخه رسمی در دسترس است.
 */
export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const armedRef = useRef(false)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(0.45)
  const [open, setOpen] = useState(false)
  const [inited, setInited] = useState(false)

  // بازیابی تنظیم کاربر — الگوی رسمی React: تنظیم state حین رندر (بدون effect)
  if (!inited) {
    setInited(true)
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORE_KEY)
        if (raw) {
          const p = JSON.parse(raw) as { muted?: boolean; volume?: number }
          if (typeof p.muted === 'boolean') setMuted(p.muted)
          if (typeof p.volume === 'number') setVolume(p.volume)
        }
      } catch { /* بی‌اهمیت */ }
    }
  }

  useEffect(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify({ muted, volume })) } catch { /* بی‌اهمیت */ }
    if (audioRef.current) audioRef.current.muted = muted
  }, [muted, volume])

  const play = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    a.volume = volume
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
  }, [volume])

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
        <div className="w-64 rounded-2xl border bg-card/95 p-3 shadow-xl backdrop-blur">
          <div className="text-xs font-extrabold text-primary">🎵 موسیقی متن دفاع مقدس</div>
          <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
            قطعه محیطی بی‌کلام، الهام‌گرفته از موسیقی متن سریال «خاک سرخ» — ساخته‌شده برای این موزه.
          </p>
          <a href={CREDIT_URL} target="_blank" rel="noreferrer" className="mt-1.5 block text-[10.5px] font-bold text-primary underline">
            شنیدن قطعه اصلی با صدای محمدرضا علیقلی ↗
          </a>
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
        <audio ref={audioRef} src={AUDIO_SRC} loop preload="none" />
        <Button size="sm" onClick={() => (playing ? (audioRef.current?.pause(), setPlaying(false)) : play())}
          aria-label={playing ? 'توقف موسیقی' : 'پخش موسیقی'}
          className="h-8 w-8 rounded-full p-0 text-base leading-none">
          {playing ? '⏸' : '▶'}
        </Button>
        <Button size="sm" variant={muted ? 'secondary' : 'outline'} onClick={() => setMuted(m => !m)}
          aria-label={muted ? 'صدا دادن موسیقی' : 'میوت کردن موسیقی'}
          className="h-8 rounded-full px-2.5 text-xs font-extrabold">
          {muted ? '🔇 میوت' : '🔊 صدا'}
        </Button>
        <button onClick={() => setOpen(o => !o)} className="text-[11px] font-extrabold text-muted-foreground hover:text-primary" aria-expanded={open}>
          {open ? 'بستن ✕' : 'خاک سرخ 🎶'}
        </button>
      </div>
    </div>
  )
}
