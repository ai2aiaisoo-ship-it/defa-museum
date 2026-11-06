import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export const runtime = 'nodejs'
export const maxDuration = 60

/** روایت صوتی فارسی — در صورت عدم پشتیبانی، پاسخ شفاف ۵۰۳ برمی‌گردد و رابط کاربری متن را نشان می‌دهد */
export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()
    if (!text || typeof text !== 'string') return NextResponse.json({ error: 'متن لازم است' }, { status: 400 })
    const zai = await ZAI.create()
    const result = await zai.audio.tts.create({
      input: text.slice(0, 900),
      voice: 'alloy',
      response_format: 'mp3',
    })
    if (result instanceof Blob) {
      return new NextResponse(result, { headers: { 'Content-Type': 'audio/mpeg' } })
    }
    const buf = Buffer.from(result as unknown as ArrayBuffer)
    if (!buf.length) throw new Error('empty audio')
    return new NextResponse(buf, { headers: { 'Content-Type': 'audio/mpeg' } })
  } catch (e) {
    console.error('tts error', e)
    return NextResponse.json({ error: 'tts-unavailable' }, { status: 503 })
  }
}
