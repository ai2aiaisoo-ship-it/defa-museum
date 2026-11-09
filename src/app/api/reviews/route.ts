import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { db } from '@/lib/db'

// ─── پشتیبان‌گیری سرورِ مرورهای نام‌دار کارشناس تصاویر مزار ───
// فاز ۱۴ — مهاجرت کامل به جدول Prisma (MazarReview در SQLite):
// مرورهای کارشناس از مرورگر مستقل شدند؛ کلید یکتا photoKey و نتیجه مرور چهارحالته است.
// سازگاری نسخه نمایشی: اگر پایگاه داده در دسترس نباشد، ذخیره‌ساز فایل (db/mazar-reviews.json)
// به‌صورت شفاف جایگزین می‌شود. خاطرات بازدیدکنندگان طبق وعده حریم خصوصی هرگز به سرور نمی‌آید.

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

type StoreMode = 'db' | 'file'

async function readStoreFile(): Promise<{ updatedAt: string; reviews: StoredReview[] }> {
  try {
    const raw = await fs.readFile(FILE, 'utf-8')
    const parsed = JSON.parse(raw)
    if (parsed && Array.isArray(parsed.reviews)) return parsed
  } catch { /* فایل هنوز وجود ندارد */ }
  return { updatedAt: new Date(0).toISOString(), reviews: [] }
}

async function writeStoreFile(data: { updatedAt: string; reviews: StoredReview[] }) {
  await fs.mkdir(path.dirname(FILE), { recursive: true })
  const tmp = FILE + '.tmp'
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf-8')
  await fs.rename(tmp, FILE)
}

// قفل نوشتن فایل — جلوگیری از رقابت خواندن/نوشتن در حالت fallback
let writeQueue: Promise<unknown> = Promise.resolve()
function enqueue<T>(job: () => Promise<T>): Promise<T> {
  const next = writeQueue.then(job, job)
  writeQueue = next.catch(() => { /* زنجیره نباید بشکند */ })
  return next
}

const VALID_VERDICTS = new Set(['approved', 'rejected', 'needs-more', 'context'])

function isPrismaReady(): boolean {
  try { return Boolean(db?.mazarReview) } catch { return false }
}

export async function GET() {
  if (isPrismaReady()) {
    try {
      const rows = await db.mazarReview.findMany({ orderBy: { reviewedAt: 'desc' } })
      const reviews: StoredReview[] = rows.map(r => ({
        id: r.id, photoKey: r.photoKey, martyrId: r.martyrId,
        verdict: r.verdict as StoredReview['verdict'], reviewer: r.reviewer,
        note: r.note ?? undefined, reviewedAt: r.reviewedAt.toISOString(),
      }))
      return NextResponse.json({ reviews, updatedAt: new Date().toISOString(), store: 'db' satisfies StoreMode })
    } catch { /* افتادن به ذخیره‌ساز فایل */ }
  }
  const data = await readStoreFile()
  return NextResponse.json({ reviews: data.reviews, updatedAt: data.updatedAt, store: 'file' satisfies StoreMode })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const incoming: StoredReview | StoredReview[] = Array.isArray(body) ? body : body.review
    const list = Array.isArray(incoming) ? incoming : [incoming]
    if (!list.length || list.some(r => !r || typeof r.photoKey !== 'string' || typeof r.verdict !== 'string' || !VALID_VERDICTS.has(r.verdict))) {
      return NextResponse.json({ error: 'قالب مرور نامعتبر است' }, { status: 400 })
    }
    const fresh = list.map(r => ({ ...r, reviewedAt: r.reviewedAt || new Date().toISOString() }))

    if (isPrismaReady()) {
      try {
        for (const r of fresh) {
          if (r.seed) continue // پیش‌مرورهای موزه در پایگاه داده ثبت نمی‌شوند
          await db.mazarReview.upsert({
            where: { photoKey: r.photoKey },
            update: {
              martyrId: r.martyrId ?? '', verdict: r.verdict, reviewer: r.reviewer ?? 'کارشناس',
              note: r.note ?? null, reviewedAt: new Date(r.reviewedAt),
            },
            create: {
              photoKey: r.photoKey, martyrId: r.martyrId ?? '', verdict: r.verdict,
              reviewer: r.reviewer ?? 'کارشناس', note: r.note ?? null, reviewedAt: new Date(r.reviewedAt),
            },
          })
        }
        const count = await db.mazarReview.count()
        return NextResponse.json({ ok: true, count, store: 'db' satisfies StoreMode })
      } catch { /* افتادن به ذخیره‌ساز فایل */ }
    }

    const count = await enqueue(async () => {
      const store = await readStoreFile()
      const byKey = new Map(store.reviews.map(r => [r.photoKey, r]))
      for (const r of fresh) {
        if (r.seed) continue
        byKey.set(r.photoKey, r)
      }
      const next = { updatedAt: new Date().toISOString(), reviews: [...byKey.values()] }
      await writeStoreFile(next)
      return next.reviews.length
    })
    return NextResponse.json({ ok: true, count, store: 'file' satisfies StoreMode })
  } catch {
    return NextResponse.json({ error: 'ثبت روی سرور ممکن نشد' }, { status: 500 })
  }
}
