'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { SectionHeader } from './ui-bits'

interface Msg { role: 'user' | 'assistant'; content: string }

const SUGGESTIONS = [
  'چرا عملیات رمضان به هدف نهایی خود نرسید؟',
  'تفاوت عملیات فتح‌المبین و بیت‌المقدس چه بود؟',
  'چرا آزادسازی فاو اهمیت داشت؟',
  'چه عواملی باعث تغییر شرایط جنگ در سال ۱۳۶۷ شد؟',
  'آمار تلفات جنگ چند است و چرا منابع اختلاف دارند؟',
]

export function AssistantView() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'assistant', content: 'سلام! من «راهنمای تاریخ جنگ» هستم. پاسخ‌هایم فقط از پایگاه داده منبع‌دار همین موزه تولید می‌شود؛ اگر اطلاعات کافی در منابع موجود نباشد، صریح می‌گویم و هیچ آمار یا سندی جعل نمی‌کنم.' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    const next: Msg[] = [...msgs, { role: 'user', content: text }]
    setMsgs(next)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(-8) }),
      })
      const data = await res.json()
      setMsgs(m => [...m, { role: 'assistant', content: data.reply ?? data.error ?? 'پاسخی دریافت نشد.' }])
    } catch {
      setMsgs(m => [...m, { role: 'assistant', content: 'ارتباط با دستیار برقرار نشد. دوباره تلاش کنید.' }])
    } finally {
      setLoading(false)
      setTimeout(() => boxRef.current?.scrollTo({ top: 999999, behavior: 'smooth' }), 100)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <SectionHeader kicker="هوش مصنوعی" title="راهنمای تاریخ جنگ" desc="دستیار فارسی موزه: توضیح عملیات‌ها، مقایسه روایت‌ها، معرفی منابع و پاسخ به پرسش‌های آموزشی — فقط بر پایه پایگاه داده تأییدشده موزه." />
      <Card>
        <CardContent className="p-0">
          <div ref={boxRef} className="max-h-[55vh] min-h-[300px] space-y-3 overflow-y-auto p-4 scrollbar-thin">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-7 ${m.role === 'user' ? 'bg-primary/15 border border-primary/30' : 'bg-muted border'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-end"><div className="rounded-2xl border bg-muted px-4 py-3 text-sm animate-pulse">در حال بررسی پایگاه داده تاریخی…</div></div>
            )}
          </div>
          <div className="border-t p-3">
            <div className="mb-2 flex flex-wrap gap-2">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)} className="rounded-full border bg-muted/50 px-3 py-1 text-[11px] hover:border-primary/60">{s}</button>
              ))}
            </div>
            <form onSubmit={e => { e.preventDefault(); send(input) }} className="flex gap-2">
              <Input value={input} onChange={e => setInput(e.target.value)} placeholder="سؤال تاریخی خود را بپرسید…" dir="rtl" />
              <Button type="submit" disabled={loading} className="font-bold">ارسال</Button>
            </form>
            <p className="mt-2 text-[10px] leading-4 text-muted-foreground">⚠ دستیار از منابع موزه استفاده می‌کند و در موارد نامطمئن شفاف اعلام می‌کند. هیچ نقل‌قول، سند یا آماری جعل نمی‌شود؛ برای استناد پژوهشی همیشه به بخش منابع مراجعه کنید.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
