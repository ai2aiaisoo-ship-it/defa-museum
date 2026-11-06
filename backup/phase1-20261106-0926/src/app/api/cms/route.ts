import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const runtime = 'nodejs'

/** پنل مدیریت — ثبت و خواندن اصلاحیه‌های محتوایی (گردش کار: Draft → Published) */
export async function POST(req: NextRequest) {
  try {
    const { targetId, note } = await req.json()
    if (!targetId || !note?.trim()) return NextResponse.json({ error: 'پرونده و متن اصلاحیه لازم است' }, { status: 400 })
    const edit = await db.contentEdit.create({
      data: { targetId, note: note.trim(), status: 'pending_review' },
    })
    return NextResponse.json({ success: true, id: edit.id, status: edit.status })
  } catch (e) {
    console.error('cms error', e)
    return NextResponse.json({ error: 'ذخیره ناموفق بود' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const edits = await db.contentEdit.findMany({ orderBy: { createdAt: 'desc' }, take: 100 })
    return NextResponse.json({ edits })
  } catch {
    return NextResponse.json({ edits: [] })
  }
}
