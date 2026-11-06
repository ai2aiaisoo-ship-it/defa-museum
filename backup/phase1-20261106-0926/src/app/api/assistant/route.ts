import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import { OPERATIONS, RESULT_LABELS } from '@/data/operations'
import { EVENTS } from '@/data/events'
import { WAR_STATS } from '@/data/statistics'
import { SOURCES, getSource } from '@/data/sources'
import { RESOLUTIONS } from '@/data/resolutions'
import { GLOSSARY } from '@/data/glossary'

export const runtime = 'nodejs'
export const maxDuration = 60

const norm = (s: string) => s.replace(/[أإآ]/g, 'ا').replace(/ی/g, 'ي').replace(/\u200c/g, ' ').replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))

/** RAG ساده: یافتن مرتبط‌ترین پرونده‌ها از پایگاه داده موزه برای زمین‌سازی پاسخ */
function retrieve(query: string): string {
  const nq = norm(query)
  const score = (text: string) => {
    const t = norm(text)
    let s = 0
    for (const w of nq.split(/\s+/).filter(w => w.length > 2)) if (t.includes(w)) s += 2
    return s
  }
  const ops = OPERATIONS.map(o => ({ o, s: score(o.faName + o.enName + o.region + o.tags.join(' ') + o.objectives + o.outcome + o.analysis) })).filter(x => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 4)
  const evs = EVENTS.map(e => ({ e, s: score(e.faTitle + e.desc) })).filter(x => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 4)
  const stats = WAR_STATS.filter(s => score(s.metric + s.note + s.value) > 0).slice(0, 5)
  const res = RESOLUTIONS.filter(r => score(r.title + r.summary.join(' ') + r.iranResponse) > 0).slice(0, 2)
  const terms = GLOSSARY.filter(g => score(g.term + g.definition) > 0).slice(0, 3)

  let ctx = ''
  if (ops.length) ctx += '\n### پرونده‌های عملیات مرتبط:\n' + ops.map(({ o }) => `- ${o.faName} (${o.side === 'iran' ? 'ایران' : o.side === 'iraq' ? 'عراق' : o.side}) — تاریخ: ${o.faStart || 'نامشخص'} تا ${o.faEnd || '؟'} | منطقه: ${o.region} | نتیجه: ${RESULT_LABELS[o.result]} | نتیجه نهایی: ${o.outcome} | تحلیل: ${o.analysis}${o.narrativeDiff ? ' | اختلاف روایت: ' + o.narrativeDiff : ''}`).join('\n')
  if (evs.length) ctx += '\n### رویدادهای مرتبط:\n' + evs.map(({ e }) => `- ${e.date} — ${e.faTitle}: ${e.desc}`).join('\n')
  if (stats.length) ctx += '\n### آمار منبع‌دار مرتبط:\n' + stats.map(s => `- ${s.metric}: ${s.value} ${s.unit} (درجه اطمینان ${s.confidence}، منبع: ${s.sourceId}${s.note ? '، ' + s.note : ''})`).join('\n')
  if (res.length) ctx += '\n### قطعنامه‌ها:\n' + res.map(r => `- قطعنامه ${r.number} (${r.gDate}): ${r.summary.join(' ')} | پاسخ ایران: ${r.iranResponse} | پاسخ عراق: ${r.iraqResponse}`).join('\n')
  if (terms.length) ctx += '\n### واژه‌نامه:\n' + terms.map(t => `- ${t.term}: ${t.definition}`).join('\n')
  if (!ctx) ctx = '\n(مورد مرتبط مشخصی در پایگاه داده یافت نشد)'
  return ctx
}

const SYSTEM = `تو «راهنمای تاریخ جنگ» هستی؛ دستیار هوشمند موزه دیجیتال جنگ ایران و عراق (۱۳۵۹–۱۳۶۷).
قواعد مذاکره‌ناپذیر:
1. فقط از «زمینه پایگاه داده» که در پیام کاربر ارسال می‌شود استفاده کن؛ از دانش عمومی خود فقط برای توضیح زمینه تاریخی کلی بهره بگیر و اگر چیزی در داده موزه نیست، صریح بگو «در پایگاه داده موزه اطلاعات کافی یافت نشد».
2. هیچ آمار، سند، نقل‌قول یا تاریخ را جعل نکن. آمارها را با درجه اطمینان و برچسب «ادعای طرف درگیر» بیان کن.
3. بی‌طرف باش: موفقیت تاکتیکی را از موفقیت راهبردی تفکیک کن؛ روایت ایران و عراق را جدا معرفی کن؛ مسئولیت آغاز تجاوز را بر اساس قطعنامه ۵۹۸ به عراق نسبت بده.
4. پاسخ فارسی، روان، ساختارمند و آموزشی باشد؛ برای نوجوان تا پژوهشگر قابل فهم. طول پاسخ: ۱ تا ۴ بند کوتاه + در صورت لزوم فهرست.
5. کشته/مجروح/اسیر/مفقود را هرگز با هم جمع نکن.
6. در پایان پاسخ، منابع مرتبط را با نام کوتاه ذکر کن.`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const messages: { role: string; content: string }[] = body.messages ?? []
    const last = [...messages].reverse().find(m => m.role === 'user')
    if (!last?.content) return NextResponse.json({ error: 'پیام کاربر یافت نشد' }, { status: 400 })

    const context = retrieve(last.content)
    const zai = await ZAI.create()
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: SYSTEM },
        { role: 'assistant', content: `زمینه پایگاه داده موزه (فقط از این استفاده کن):\n${context}` },
        ...messages.slice(-6).map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }) as { role: 'user' | 'assistant'; content: string }),
      ],
      thinking: { type: 'disabled' },
    })
    const reply = completion.choices[0]?.message?.content
    if (!reply) return NextResponse.json({ error: 'پاسخی تولید نشد' }, { status: 502 })
    return NextResponse.json({ reply, contextUsed: context.length > 60 })
  } catch (e) {
    console.error('assistant error', e)
    return NextResponse.json({ error: 'دستیار در دسترس نیست؛ لطفاً بعداً تلاش کنید.' }, { status: 500 })
  }
}
