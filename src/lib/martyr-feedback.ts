'use client'

// ─── سامانه مشارکت بازدیدکنندگان و مرور کارشناسی تالار «خاطرات شهدا و آرامگاه‌ها» ───
// ۱) مرور کارشناسی تصاویر مزار: کارشناس تصویر مزار را بازبینی می‌کند و نتیجه مرور
//    برچسب تأیید تصویر را ارتقا می‌دهد (در انتظار مرور → تأیید کارشناسی / عدم تأیید / نیازمند بررسی تکمیلی).
// ۲) اشتراک خاطره: بازدیدکننده خاطره‌اش را ثبت می‌کند؛ خاطره با وضعیت
//    «در انتظار تأیید کارشناس» ثبت و تا تأیید، فقط به‌عنوان پیش‌نویس محلی نمایش داده می‌شود.
// ذخیره‌سازی: localStorage مرورگر (نسخه نمایشی) — کلیدهای نسخه‌دار برای مهاجرت آینده به پایگاه داده.

import { useCallback, useState } from 'react'

const REVIEWS_KEY = 'museum-grave-photo-reviews-v1'
const MEMORIES_KEY = 'museum-visitor-memories-v1'

export type ReviewVerdict = 'approved' | 'rejected' | 'needs-more'

export const VERDICT_LABELS: Record<ReviewVerdict, string> = {
  approved: 'تأیید هویت‌سنجی تصویر (ارتقای برچسب به «تأیید کارشناسی»)',
  rejected: 'عدم تطابق تصویر (تصویر از نمایش مزار خارج می‌شود)',
  'needs-more': 'نیازمند بررسی تکمیلی (برچسب «در انتظار مرور» باقی می‌ماند)',
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

/** هوک مرور کارشناسی تصاویر مزار */
export function useGravePhotoReviews() {
  const [reviews, setReviews] = useState<Record<string, GravePhotoReview>>(() => {
    const list = readJson<GravePhotoReview[]>(REVIEWS_KEY, [])
    return Object.fromEntries(list.map(r => [r.photoKey, r]))
  })

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
    return review
  }, [])

  /** آخرین مرور ثبت‌شده برای یک تصویر مزار */
  const reviewOf = useCallback(
    (martyrId: string, photoUrl: string): GravePhotoReview | undefined =>
      reviews[`${martyrId}|${photoUrl}`],
    [reviews],
  )

  return { reviews, reviewOf, submitReview }
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
