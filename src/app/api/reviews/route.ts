import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// ─── پشتیبان‌گیری سرورِ مرورهای نام‌دار کارشناس تصاویر مزار ───
// مرورها در مرورگر کارشناس (localStorage) اعتبار اولیه دارند و به‌صورت بی‌همگام روی سرور هم ثبت می‌شوند
// تا پاک‌شدن مرورگر سبب از بین رفتن مرورهای کارشناسی نشود (گام مهاجرت به پایگاه داده).
// حافظه سرور: db/mazar-reviews.json — کلید یکتا: photoKey
// نکته: خاطرات بازدیدکنندگان (مشارکت عمومی) طبق وعده حریم خصوصی، هرگز به سرور ارسال نمی‌شود.

export const runtime = 'nodejs'

const FILE = path.join(process.cwd(), 'db', 'mazar-reviews.json')

interface StoredReview {
  id: string
  photoKey: string
  martyrId: string
  verdict: 'approved' | 'rejected' | 'needs-more' | 'context'
  reviewer: string
  note?: string
  reviewedAt: string
  seed?: boolean
}

async function readStore(): Promise<{ updatedAt: string; reviews: StoredReview[] }> {
  try {
    const raw = await fs.readFile(FILE, 'utf-8')
    const parsed = JSON.parse(raw)
    if (parsed && Array.isArray(parsed.reviews)) return parsed
  } catch { /* فایل هنوز وجود ندارد */ }
  return { updatedAt: new Date(0).toISOString(), reviews: [] }
}

async function writeStore(data: { updatedAt: string; reviews: StoredReview[] }) {
  await fs.mkdir(path.dirname(FILE), { recursive: true })
  const tmp = FILE + '.tmp'
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf-8')
  await fs.rename(tmp, FILE)
}

// قفل نوشتن — جلوگیری از رقابت خواندن/نوشتن روی فایل ذخیره‌ساز
let writeQueue: Promise<unknown> = Promise.resolve()
function enqueue<T>(job: () => Promise<T>): Promise<T> {
  const next = writeQueue.then(job, job)
  writeQueue = next.catch(() => { /* زنجیره نباید بشکند */ })
  return next
}

export async function GET() {
  try {
    const data = await readStore()
    return NextResponse.json({ reviews: data.reviews, updatedAt: data.updatedAt })
  } catch {
    return NextResponse.json({ reviews: [], updatedAt: new Date(0).toISOString() })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const incoming: StoredReview | StoredReview[] = Array.isArray(body) ? body : body.review
    const list = Array.isArray(incoming) ? incoming : [incoming]
    if (!list.length || list.some(r => !r || typeof r.photoKey !== 'string' || typeof r.verdict !== 'string')) {
      return NextResponse.json({ error: 'قالب مرور نامعتبر است' }, { status: 400 })
    }
    const count = await enqueue(async () => {
      const store = await readStore()
      const byKey = new Map(store.reviews.map(r => [r.photoKey, r]))
      for (const r of list) {
        if (r.seed) continue // پیش‌مرورهای موزه روی سرور ثبت نمی‌شوند
        byKey.set(r.photoKey, { ...r, reviewedAt: r.reviewedAt || new Date().toISOString() })
      }
      const next = { updatedAt: new Date().toISOString(), reviews: [...byKey.values()] }
      await writeStore(next)
      return next.reviews.length
    })
    return NextResponse.json({ ok: true, count })
  } catch {
    return NextResponse.json({ error: 'ثبت روی سرور ممکن نشد' }, { status: 500 })
  }
}
