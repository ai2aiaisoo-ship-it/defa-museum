'use client'

import { useEffect, useRef, useState } from 'react'
import { GALLERY, GALLERY_TAGS } from '@/data/gallery'
import { DOCUMENTARIES } from '@/data/documentaries'
import { getSource } from '@/data/sources'
import { toFa } from '@/lib/jalali'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { SafeImage, SectionHeader, SourceChips } from './ui-bits'

export function GalleryView() {
  const [tag, setTag] = useState('all')
  const imgs = GALLERY.filter(g => tag === 'all' || g.tags.includes(tag))
  return (
    <div>
      <SectionHeader
        kicker="آرشیو تصویری"
        title="گالری تصاویر آرشیوی"
        desc="قوانین رسانه‌ای موزه: عکس واقعی از بازسازی هنری تفکیک می‌شود، منبع هر تصویر ثبت است، از تصاویر دلخراش پرهیز شده و به جای آن یادمان‌ها نمایش داده می‌شوند. برای استفاده تجاری، مجوز باید از منبع اصلی بررسی شود."
      />
      <div className="mb-4 flex flex-wrap gap-2">
        {GALLERY_TAGS.map(t => (
          <button key={t.k} onClick={() => setTag(t.k)} className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${tag === t.k ? 'border-primary bg-primary/15 text-primary' : 'border-border bg-card/60'}`}>{t.l}</button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {imgs.map(g => (
          <Card key={g.id} className="museum-card overflow-hidden">
            <SafeImage img={g} className="aspect-video w-full" />
            <CardContent className="p-3">
              {g.note && <p className="text-[11px] leading-5 text-muted-foreground">{g.note}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function DocumentaryView({ go }: { go: (v: string, p?: string) => void }) {
  const [docId, setDocId] = useState(DOCUMENTARIES[0].id)
  const [ch, setCh] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [t, setT] = useState(0)
  const [audioNote, setAudioNote] = useState<string | null>(null)
  const doc = DOCUMENTARIES.find(d => d.id === docId)!
  const chapter = doc.chapters[ch]
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (timer.current) clearInterval(timer.current)
    if (playing) {
      timer.current = setInterval(() => {
        setT(prev => {
          if (prev + 1 >= chapter.durationSec) {
            if (ch + 1 < doc.chapters.length) { setCh(c => c + 1); return 0 }
            setPlaying(false)
            return chapter.durationSec
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => { if (timer.current) clearInterval(timer.current) }
  }, [playing, ch, doc])

  const tryVoice = async () => {
    setAudioNote('در حال ساخت روایت صوتی…')
    try {
      const res = await fetch('/api/tts', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: chapter.text.slice(0, 900) }),
      })
      if (res.ok) {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = new Audio(url)
        setAudioNote('🔊 در حال پخش روایت فارسی…')
        a.play().catch(() => setAudioNote('پخش صوت در مرورگر شما مسدود شد؛ متن روایت در دسترس است.'))
        a.onended = () => setAudioNote(null)
      } else {
        setAudioNote('صوت فارسی در این محیط در دسترس نیست — متن کامل روایت را در ادامه ببینید.')
      }
    } catch {
      setAudioNote('صوت فارسی در این محیط در دسترس نیست — متن کامل روایت را در ادامه ببینید.')
    }
  }

  return (
    <div>
      <SectionHeader kicker="مستند تعاملی" title="روایت‌های سینمایی موزه" desc="هر فصل تاریخی به یک مستند کوتاه تبدیل شده است: روایت فارسی، نقشه هم‌زمان، تصاویر آرشیوی و فهرست منابع." />
      <div className="mb-4 flex flex-wrap gap-2">
        {DOCUMENTARIES.map(d => (
          <button key={d.id} onClick={() => { setDocId(d.id); setCh(0); setT(0); setPlaying(false) }} className={`rounded-xl border px-4 py-2 text-sm font-bold ${docId === d.id ? 'border-primary bg-primary/15 text-primary' : 'border-border bg-card/60'}`}>
            🎬 {d.title}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* صحنه مستند */}
          <div className="relative aspect-video bg-gradient-to-br from-muted to-background">
            <div className="absolute inset-0 hero-vignette" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
              <Badge variant="outline" className="mb-2 w-fit">فصل {toFa(ch + 1)} از {toFa(doc.chapters.length)} • {chapter.title}</Badge>
              <p className="max-w-3xl text-base md:text-lg font-bold leading-9 drop-shadow">{chapter.text}</p>
            </div>
            <div className="absolute left-4 top-4 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => go('atlas')} className="text-xs">🗺 نمایش روی نقشه (سال {toFa(chapter.mapYear ?? 1359)})</Button>
              <Button size="sm" variant="outline" onClick={tryVoice} className="text-xs">🔊 روایت صوتی</Button>
            </div>
          </div>
          {/* کنترل‌ها */}
          <div className="p-4">
            <Progress value={(t / chapter.durationSec) * 100} className="mb-3" />
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" onClick={() => setPlaying(p => !p)} className="font-bold">{playing ? '⏸ توقف' : '▶ پخش'}</Button>
              <Button size="sm" variant="outline" disabled={ch === 0} onClick={() => { setCh(c => c - 1); setT(0) }}>→ فصل قبل</Button>
              <Button size="sm" variant="outline" disabled={ch === doc.chapters.length - 1} onClick={() => { setCh(c => c + 1); setT(0) }}>فصل بعد ←</Button>
              <select value={t === 0 ? '1' : '1'} onChange={() => {}} className="rounded-lg border bg-background px-2 py-1 text-xs" aria-label="سرعت پخش">
                <option value="1">سرعت: عادی</option>
              </select>
              {audioNote && <span className="text-xs font-bold text-amber-500">{audioNote}</span>}
            </div>
            {/* فصل‌ها */}
            <div className="mt-4 flex flex-wrap gap-2">
              {doc.chapters.map((c, i) => (
                <button key={i} onClick={() => { setCh(i); setT(0) }} className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${ch === i ? 'border-primary bg-primary/15 text-primary' : 'border-border'}`}>
                  {toFa(i + 1)}. {c.title}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4">
        <div className="mb-2 text-xs font-bold text-muted-foreground">منابع این مستند:</div>
        <SourceChips ids={doc.sourceIds} />
      </div>
    </div>
  )
}
