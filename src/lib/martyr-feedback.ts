'use client'

// ─── سامانه مشارکت بازدیدکنندگان و مرور کارشناسی تالار «خاطرات شهدا و آرامگاه‌ها» ───
// ۱) مرور کارشناسی تصاویر مزار: کارشناس تصویر مزار را بازبینی می‌کند و نتیجه مرور
//    برچسب تأیید تصویر را ارتقا می‌دهد (در انتظار مرور → تأیید کارشناسی / تصویر زمینه / عدم تأیید).
//    پیش‌فرض نمایش، «پیش‌مرور مستند آرشیو موزه» است (data/grave-reviews.ts)؛ مرور نام‌دار کارشناس
//    در مرورگرِ خودش ثبت و بر پیش‌مرور اولویت داده می‌شود.
// ۲) اشتراک خاطره: بازدیدکننده خاطره‌اش را ثبت می‌کند؛ خاطره با وضعیت
//    «در انتظار تأیید کارشناس» ثبت و تا تأیید، فقط به‌عنوان پیش‌نویس محلی نمایش داده می‌شود.
// ذخیره‌سازی: localStorage مرورگر + پشتیبان بی‌همگام روی سرور برای مرورهای نام‌دار کارشناس (api/reviews)؛
// خاطرات بازدیدکنندگان فقط در مرورگر می‌ماند (وعده حریم خصوصی). کلیدهای نسخه‌دار برای مهاجرت به پایگاه داده.

import { useCallback, useEffect, useState } from 'react'
import { GRAVE_REVIEW_SEEDS, SEED_REVIEW_META, seedPhotoKey } from '@/data/grave-reviews'

const REVIEWS_KEY = 'museum-grave-photo-reviews-v1'
const MEMORIES_KEY = 'museum-visitor-memories-v1'

export type ReviewVerdict = 'approved' | 'rejected' | 'needs-more' | 'context'

export const VERDICT_LABELS: Record<ReviewVerdict, string> = {
  approved: 'تأیید هویت‌سنجی تصویر (ارتقای برچسب به «تأیید کارشناسی»)',
  context: 'تصویر زمینه گلزار/یادمان (مزار اختصاصی در آرشیو باز ثبت نشد)',
  'needs-more': 'نیازمند بررسی تکمیلی (برچسب «در انتظار مرور» باقی می‌ماند)',
  rejected: 'عدم تطابق تصویر (تصویر از نمایش مزار خارج می‌شود)',
}

export interface GravePhotoReview {
  id: string
  /** کلید یکتای تصویر: `${martyrId}|${photoUrl}` */
  photoKey: string
  martyrId: string
  verdict: ReviewVerdict
  reviewer: string
  note?: string
  reviewedAt: string // ISO
  /** پیش‌مرورِ بارگذاری‌شده از کارتابل موزه (در برابر مرور نام‌دار کارشناس) */
  seed?: boolean
}

/** کارتابل پیش‌مرور مستند آرشیو موزه — پیش‌فرض نمایش برچسب‌ها پیش از مرور نام‌دار */
export function seedReviewMap(): Record<string, GravePhotoReview> {
  return Object.fromEntries(
    GRAVE_REVIEW_SEEDS.map(s => {
      const photoKey = seedPhotoKey(s)
      const review: GravePhotoReview = {
        id: `seed-${s.martyrId}-${s.photoHash}`,
        photoKey,
        martyrId: s.martyrId,
        verdict: s.verdict,
        reviewer: SEED_REVIEW_META.reviewer,
        note: s.note,
        reviewedAt: SEED_REVIEW_META.reviewedAt,
        seed: true,
      }
      return [photoKey, review]
    }),
  )
}

export interface VisitorMemory {
  id: string
  martyrId: string
  name: string
  city?: string
  text: string
  submittedAt: string // ISO
  /** وضعیت کارتابل کارشناسی — تا تأیید، نمایش به‌صورت «پیش‌نویس در انتظار تأیید» است */
  status: 'pending-review'
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* حافظه پر یا محدود — بی‌اثر */ }
}

/** هوک مرور کارشناسی تصاویر مزار — پیش‌مرور موزه + مرورهای نام‌دار کارشناس (اولویت‌دار)
 *  پشتیبان‌گیری: مرورهای نام‌دار به‌صورت بی‌همگام روی سرور هم ذخیره می‌شوند (api/reviews)
 *  تا پاک‌شدن حافظه مرورگر سبب از بین رفتن مرورهای کارشناسی نشود. */
export function useGravePhotoReviews() {
  const [reviews, setReviews] = useState<Record<string, GravePhotoReview>>(() => {
    const seeds = seedReviewMap()
    const list = readJson<GravePhotoReview[]>(REVIEWS_KEY, [])
    return { ...seeds, ...Object.fromEntries(list.map(r => [r.photoKey, r])) }
  })

  // واکشی پشتیبان سرور — مرورهای نام‌دارِ ثبت‌شده روی سرور بر پیش‌مرور اولویت دارند
  // و فقط مرورهایی که روی سرور تازه‌تر از نسخه محلی‌اند جایگزین می‌شوند.
  useEffect(() => {
    let alive = true
    fetch('/api/reviews', { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : null))
      .then((data: { reviews?: GravePhotoReview[] } | null) => {
        if (!alive || !data?.reviews?.length) return
        const local = readJson<GravePhotoReview[]>(REVIEWS_KEY, [])
        const localAt = new Map(local.map(r => [r.photoKey, r.reviewedAt]))
        const newer = data.reviews.filter(r => !r.seed && r.reviewedAt > (localAt.get(r.photoKey) ?? ''))
        if (!newer.length) return
        setReviews(prev => {
          const next = { ...prev }
          for (const r of newer) next[r.photoKey] = r
          writeJson(REVIEWS_KEY, Object.values(next))
          return next
        })
      })
      .catch(() => { /* سرور در دسترس نیست — فقط مرورگر */ })
    return () => { alive = false }
  }, [])

  const submitReview = useCallback((r: Omit<GravePhotoReview, 'id' | 'reviewedAt'>): GravePhotoReview => {
    const review: GravePhotoReview = {
      ...r,
      id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      reviewedAt: new Date().toISOString(),
    }
    setReviews(prev => {
      const next = { ...prev, [r.photoKey]: review }
      writeJson(REVIEWS_KEY, Object.values(next))
      return next
    })
    // پشتیبان‌گیری بی‌همگام روی سرور — بیرون از state-updater (الگوی رسمی ری‌اکت)؛
    // در صورت قطع ارتباط، نسخه محلی معتبر می‌ماند و دفعه بعد همگام می‌شود.
    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ review }),
    }).catch(() => { /* بی‌اهمیت */ })
    return review
  }, [])

  /** ثبت گروهی مرور کارتابل — یک POST واحد برای همه تصاویر علامت‌خورده (بدون رقابت نوشتن روی سرور) */
  const submitReviewsBatch = useCallback((list: Omit<GravePhotoReview, 'id' | 'reviewedAt'>[]): GravePhotoReview[] => {
    const stamped = list.map(r => ({
      ...r,
      id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      reviewedAt: new Date().toISOString(),
    }))
    setReviews(prev => {
      const next = { ...prev }
      for (const review of stamped) next[review.photoKey] = review
      writeJson(REVIEWS_KEY, Object.values(next))
      return next
    })
    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ review: stamped }),
    }).catch(() => { /* بی‌اهمیت — نسخه محلی معتبر می‌ماند */ })
    return stamped
  }, [])

  /** آخرین مرور ثبت‌شده برای یک تصویر مزار */
  const reviewOf = useCallback(
    (martyrId: string, photoUrl: string): GravePhotoReview | undefined =>
      reviews[`${martyrId}|${photoUrl}`],
    [reviews],
  )

  return { reviews, reviewOf, submitReview, submitReviewsBatch }
}

/** هوک خاطرات بازدیدکنندگان */
export function useVisitorMemories() {
  const [memories, setMemories] = useState<VisitorMemory[]>(() => readJson<VisitorMemory[]>(MEMORIES_KEY, []))

  const persist = useCallback((list: VisitorMemory[]) => {
    setMemories(list)
    writeJson(MEMORIES_KEY, list)
  }, [])

  const addMemory = useCallback((m: Omit<VisitorMemory, 'id' | 'submittedAt' | 'status'>): VisitorMemory => {
    const memory: VisitorMemory = {
      ...m,
      id: `vm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      submittedAt: new Date().toISOString(),
      status: 'pending-review' as const,
    }
    setMemories(prev => {
      const next = [memory, ...prev]
      writeJson(MEMORIES_KEY, next)
      return next
    })
    return memory
  }, [])

  const removeMemory = useCallback((id: string) => {
    setMemories(prev => {
      const next = prev.filter(m => m.id !== id)
      writeJson(MEMORIES_KEY, next)
      return next
    })
  }, [])

  const memoriesOf = useCallback(
    (martyrId: string) => memories.filter(m => m.martyrId === martyrId),
    [memories],
  )

  return { memories, memoriesOf, addMemory, removeMemory }
}

/** برچسب و کلاس رنگ برچسب وضعیت تصویر مزار بر پایه مرور کارشناسی */
export function gravePhotoBadge(
  verified: 'archival-confirmed' | 'pending-review' | undefined,
  review?: GravePhotoReview,
): { label: string; cls: string } {
  if (review?.verdict === 'approved') {
    return { label: `✓ تأیید کارشناسی — ${review.reviewer}`, cls: 'bg-emerald-900/85 text-emerald-200 border-emerald-400/40' }
  }
  if (review?.verdict === 'rejected') {
    return { label: `✕ عدم تأیید کارشناس — ${review.reviewer}`, cls: 'bg-rose-950/85 text-rose-200 border-rose-400/40' }
  }
  if (review?.verdict === 'context') {
    return { label: '⌂ تصویر زمینه — مزار اختصاصی ثبت نشد', cls: 'bg-slate-900/85 text-slate-300 border-slate-400/30' }
  }
  if (review?.verdict === 'needs-more') {
    return { label: '⏳ نیازمند بررسی تکمیلی کارشناس', cls: 'bg-amber-950/85 text-amber-200 border-amber-400/40' }
  }
  if (verified === 'archival-confirmed') {
    return { label: '✓ تأیید آرشیوی منبع', cls: 'bg-emerald-900/85 text-emerald-200 border-emerald-400/40' }
  }
  return { label: 'در انتظار مرور کارشناس', cls: 'bg-black/70 text-amber-300 border-amber-400/30' }
}

/** تاریخ شمسی نمایشی از رشته ISO — بدون وابستگی به کتابخانه بیرونی */
export function faDateTime(iso: string): string {
  if (typeof window === 'undefined') return ''
  try {
    return new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))
  } catch {
    return iso
  }
}
