#!/usr/bin/env node
// ─── فاز ۱۴ — مهاجرت یک‌باره db/mazar-reviews.json → جدول Prisma (MazarReview) ───
// اجرا: node scripts/migrate-mazar-reviews.mjs
import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const FILE = path.join(process.cwd(), 'db', 'mazar-reviews.json')
const prisma = new PrismaClient()

try {
  const raw = JSON.parse(readFileSync(FILE, 'utf-8'))
  const reviews = Array.isArray(raw?.reviews) ? raw.reviews : []
  let n = 0
  for (const r of reviews) {
    if (!r?.photoKey || !r?.verdict) continue
    await prisma.mazarReview.upsert({
      where: { photoKey: r.photoKey },
      update: {
        martyrId: r.martyrId ?? '',
        verdict: r.verdict,
        reviewer: r.reviewer ?? 'کارتابل موزه',
        note: r.note ?? null,
        reviewedAt: new Date(r.reviewedAt ?? Date.now()),
      },
      create: {
        photoKey: r.photoKey,
        martyrId: r.martyrId ?? '',
        verdict: r.verdict,
        reviewer: r.reviewer ?? 'کارتابل موزه',
        note: r.note ?? null,
        reviewedAt: new Date(r.reviewedAt ?? Date.now()),
      },
    })
    n++
  }
  console.log(`migrated ${n} review(s) from JSON to Prisma table MazarReview`)
} catch (e) {
  console.error('migration failed:', e.message)
  process.exitCode = 1
} finally {
  await prisma.$disconnect()
}
