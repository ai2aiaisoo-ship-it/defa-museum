'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { narrationOf, narrationTime, NARRATION_META } from '@/data/narrations'
import { toFa } from '@/lib/jalali'

/** گذرگاه تک‌صدایی: همیشه فقط یک روایت پخش می‌شود */
export const NARR_BUS = {
  play: 'narration-play', // شروع پخش (detail: expId)
  stop: 'narration-stop', // توقف به دست کاربر یا حذف کامپوننت (detail: expId)
  ended: 'narration-ended', // پایان طبیعی قطعه (detail: expId)
} as const

const SPEEDS = [
  { v: 0.75, label: 'آوینی‌وار ۰٫۷۵' },
  { v: 1, label: 'عادی' },
  { v: 1.25, label: 'تند ۱٫۲۵' },
]

interface NarrationPlayerProps {
  expId: string
  /** compact: ردیف کارت تجربه | full: پخش‌کننده اصلی تالار شنیداری */
  variant?: 'compact' | 'full'
  title?: string
  subtitle?: string
  /** توکن درخواست پخش — با هر تغییر، پخش آغاز می‌شود (تالار شنیداری) */
  playToken?: number
}

export function NarrationPlayer({ expId, variant = 'compact', title, subtitle, playToken = 0 }: NarrationPlayerProps) {
  const info = narrationOf(expId)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const bedRef = useRef<HTMLAudioElement | null>(null)
  const playingRef = useRef(false)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(info?.durationSec ?? 0)
  const [speedIdx, setSpeedIdx] = useState(0)
  const [bed, setBed] = useState(false)
  const [expanded, setExpanded] = useState(variant === 'full')

  // آینه وضعیت برای پاک‌سازی مطمئن هنگام حذف کامپوننت
  useEffect(() => { playingRef.current = playing }, [playing])

  const start = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    a.playbackRate = SPEEDS[speedIdx].v
    a.play().then(() => {
      setPlaying(true)
      window.dispatchEvent(new CustomEvent(NARR_BUS.play, { detail: expId }))
    }).catch(() => setPlaying(false))
  }, [expId, speedIdx])

  const pause = useCallback((announce = true) => {
    const a = audioRef.current
    if (a) a.pause()
    bedRef.current?.pause()
    setPlaying(false)
    if (announce) window.dispatchEvent(new CustomEvent(NARR_BUS.stop, { detail: expId }))
  }, [expId])

  // پخش خودکار در تالار شنیداری — با گارد توکن تا تغییر سرعت باعث پخش دوباره نشود
  const lastTokenRef = useRef(0)
  useEffect(() => {
    if (!playToken || lastTokenRef.current === playToken) return
    lastTokenRef.current = playToken
    const t = window.setTimeout(() => start(), 250) // فرصت بارگذاری متادیتا
    return () => window.clearTimeout(t)
  }, [playToken, start])

  // تک‌صدایی: با شروع روایت دیگر، این روایت بی‌اعلان ساکت می‌شود
  useEffect(() => {
    const onOther = (e: Event) => {
      const id = (e as CustomEvent<string>).detail
      if (id !== expId && audioRef.current && !audioRef.current.paused) pause(false)
    }
    window.addEventListener(NARR_BUS.play, onOther)
    return () => window.removeEventListener(NARR_BUS.play, onOther)
  }, [expId, pause])

  // بستر مستند: موسیقی محیطی کم‌صدا زیر صدا (پیش‌فرض خاموش)
  useEffect(() => {
    const b = bedRef.current
    if (!b) return
    if (playing && bed) {
      b.volume = 0.08
      b.play().catch(() => { /* بی‌اهمیت */ })
    } else {
      b.pause()
    }
  }, [playing, bed])

  // پاک‌سازی هنگام حذف کامپوننت
  useEffect(() => () => {
    audioRef.current?.pause()
    bedRef.current?.pause()
    if (playingRef.current) window.dispatchEvent(new CustomEvent(NARR_BUS.stop, { detail: expId }))
  }, [expId])

  if (!info) return null

  const onEnded = () => {
    setPlaying(false)
    bedRef.current?.pause()
    window.dispatchEvent(new CustomEvent(NARR_BUS.ended, { detail: expId }))
  }

  const seek = (v: number) => {
    const a = audioRef.current
    if (!a) return
    a.currentTime = v
    setCurrent(v)
  }

  const applySpeed = (i: number) => {
    setSpeedIdx(i)
    if (audioRef.current) audioRef.current.playbackRate = SPEEDS[i].v
  }

  const dur = duration || info.durationSec
  const timeLabel = current > 0 || playing ? `${narrationTime(current)} / ${narrationTime(dur)}` : narrationTime(dur)

  const controls = (
    <>
      {/* نوار پیشرفت */}
      <div className="flex items-center gap-2" dir="ltr">
        <span className="w-10 shrink-0 text-center text-[10px] font-bold tabular-nums text-muted-foreground" dir="rtl">{narrationTime(current)}</span>
        <input
          type="range" min={0} max={Math.max(dur, 1)} step={0.1} value={Math.min(current, dur)}
          aria-label="جای‌گاه پیشرفت روایت"
          onChange={e => seek(Number(e.target.value))}
          className="h-1.5 flex-1 accent-primary"
        />
        <span className="w-10 shrink-0 text-center text-[10px] font-bold tabular-nums text-muted-foreground" dir="rtl">{narrationTime(dur)}</span>
      </div>
      {/* سرعت + بستر مستند */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-extrabold text-muted-foreground">سرعت روایت:</span>
        {SPEEDS.map((s, i) => (
          <button
            key={s.v}
            onClick={() => applySpeed(i)}
            aria-pressed={speedIdx === i}
            className={`rounded-lg border px-2 py-0.5 text-[10px] font-bold transition-colors ${speedIdx === i ? 'border-primary/60 bg-primary/15 text-primary' : 'border-border bg-muted/40 text-muted-foreground hover:border-primary/40'}`}
          >
            {s.label}
          </button>
        ))}
        <button
          onClick={() => setBed(b => !b)}
          aria-pressed={bed}
          title="بستر صوتی کم‌صدای موزه زیر روایت — حال‌وهوای مستند"
          className={`rounded-lg border px-2 py-0.5 text-[10px] font-bold transition-colors ${bed ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-400' : 'border-border bg-muted/40 text-muted-foreground hover:border-primary/40'}`}
        >
          {bed ? '🎼 بستر مستند: روشن' : '🎼 بستر مستند: خاموش'}
        </button>
      </div>
    </>
  )

  const disclosure = (
    <p className="text-[10px] leading-5 text-muted-foreground/90">
      {NARRATION_META.disclosureShort} — بازسازی صدای واقعی شهید آوینی ممکن و صحیح نیست؛ متن، بازآفرینی ادبیِ تازه از پرونده‌ی مستند است، نه نقل‌قول از شهید.
    </p>
  )

  if (variant === 'compact') {
    return (
      <div className="rounded-xl border border-primary/25 bg-gradient-to-l from-primary/5 to-transparent p-2" data-narration={expId}>
        <audio
          ref={audioRef} src={info.audioUrl} preload="metadata"
          onLoadedMetadata={e => { const d = e.currentTarget.duration; if (Number.isFinite(d)) setDuration(d) }}
          onTimeUpdate={e => setCurrent(e.currentTarget.currentTime)}
          onEnded={onEnded}
        />
        <audio ref={bedRef} src="/audio/defa-ambient.wav" loop preload="none" />
        <div className="flex items-center gap-2">
          <Button
            size="sm" onClick={() => (playing ? pause() : start())}
            aria-label={playing ? `توقف روایت شنیداری ${title ?? ''}` : `پخش روایت شنیداری ${title ?? ''}`}
            className="h-9 w-9 shrink-0 rounded-full p-0 text-base leading-none"
          >
            {playing ? '⏸' : '▶'}
          </Button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2 text-[10px] font-bold">
              <span className="truncate text-primary/90">{NARRATION_META.disclosureShort}</span>
              <span className="shrink-0 tabular-nums text-muted-foreground" dir="rtl">{timeLabel}</span>
            </div>
            <input
              type="range" min={0} max={Math.max(dur, 1)} step={0.1} value={Math.min(current, dur)}
              aria-label="جای‌گاه پیشرفت روایت"
              onChange={e => seek(Number(e.target.value))}
              className="mt-0.5 h-1 w-full accent-primary"
            />
          </div>
          <button
            onClick={() => setExpanded(x => !x)}
            aria-expanded={expanded}
            aria-label="نمایش کنترل‌ها و متن روایت"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border text-xs font-bold text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            {expanded ? '▲' : '▼'}
          </button>
        </div>
        {expanded && (
          <div className="mt-2 space-y-2 border-t pt-2">
            {controls}
            <div className="rounded-lg border bg-card/70 p-2.5">
              <div className="mb-1 text-[10px] font-extrabold text-primary">📜 متن روایت (بازآفرینی ادبی به شیوه‌ی شهید آوینی — نقل‌قول مستقیم نیست)</div>
              <p className="text-[12px] leading-7 text-foreground/90">{info.script}</p>
            </div>
            {disclosure}
          </div>
        )}
      </div>
    )
  }

  // ─── نمونه کامل: پخش‌کننده اصلی تالار شنیداری ───
  return (
    <div className="rounded-2xl border border-primary/30 bg-gradient-to-l from-primary/10 via-card to-card p-4 shadow-lg" data-narration={expId}>
      <audio
        ref={audioRef} src={info.audioUrl} preload="metadata"
        onLoadedMetadata={e => { const d = e.currentTarget.duration; if (Number.isFinite(d)) setDuration(d) }}
        onTimeUpdate={e => setCurrent(e.currentTarget.currentTime)}
        onEnded={onEnded}
      />
      <audio ref={bedRef} src="/audio/defa-ambient.wav" loop preload="none" />
      <div className="flex items-start gap-3">
        <Button
          size="sm" onClick={() => (playing ? pause() : start())}
          aria-label={playing ? 'توقف روایت شنیداری' : 'پخش روایت شنیداری'}
          className="h-12 w-12 shrink-0 rounded-full p-0 text-xl leading-none shadow-md"
        >
          {playing ? '⏸' : '▶'}
        </Button>
        <div className="min-w-0 flex-1">
          {title && <h3 className="truncate text-sm font-extrabold leading-6">{title}</h3>}
          {subtitle && <p className="mt-0.5 text-[11px] text-muted-foreground">{subtitle}</p>}
          <p className="mt-0.5 text-[10.5px] font-bold text-primary/90">
            {NARRATION_META.disclosureShort} · {NARRATION_META.styleLabel} · مدت {toFa(narrationTime(dur))}
          </p>
        </div>
      </div>
      <div className="mt-3 space-y-2.5">{controls}</div>
      <div className="mt-3 rounded-xl border bg-card/70 p-3">
        <div className="mb-1.5 text-[10.5px] font-extrabold text-primary">📜 متن روایت (بازآفرینی ادبی به شیوه‌ی شهید آوینی — نقل‌قول مستقیم نیست)</div>
        <p className="text-[13px] leading-8 text-foreground/90">{info.script}</p>
      </div>
      {disclosure}
    </div>
  )
}
