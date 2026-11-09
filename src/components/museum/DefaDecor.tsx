'use client'

// ─── تزئینات تم «دفاع مقدس»: سربند یا زهرا، خاکریز، اسلحه، پوتین، پرتره شهدا و رهبران ───

import Link from 'next/link'

/** نوار سربند «یا زهرا (س)» — سربرگ بالای برنامه */
export function HeadbandRibbon() {
  return (
    <div className="defa-headband overflow-hidden whitespace-nowrap px-4 py-2.5 text-center text-[11.5px] font-extrabold leading-[2.3] tracking-[0.35em] text-white" aria-hidden="true">
      <span className="defa-headband-scroll inline-block">
        یا زهرا (س) ✦ یا حسین (ع) ✦ یا زهرا (س) ✦ یا حسین (ع) ✦ یا زهرا (س) ✦ یا حسین (ع) ✦ یا زهرا (س) ✦ یا حسین (ع) ✦ یا زهرا (س) ✦ یا حسین (ع) ✦ یا زهرا (س) ✦ یا حسین (ع) ✦
      </span>
    </div>
  )
}

/** ردیف خاکریز (گونی‌های شن) — تصویر واقعی سنگر آپلودی کارفرما با پس‌زمینه حذف‌شده؛
 *  با گرادیان بالا/پایین به زمینه ادغام می‌شود (جایگزین بافت SVG قبلی) */
export function SandbagStrip({ flip = false }: { flip?: boolean }) {
  return (
    <div className={`pointer-events-none relative h-16 w-full overflow-hidden ${flip ? 'rotate-180' : ''}`} aria-hidden="true">
      <div className="defa-sandbag absolute inset-0" />
      <div className="absolute inset-x-0 top-0 h-5 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-3 bg-gradient-to-t from-background/70 to-transparent" />
    </div>
  )
}

/** سیلوئت اسلحه (تزئینی و انتزاعی) */
export function RifleIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 20" className={className} fill="currentColor" aria-hidden="true">
      <path d="M2 9 L10 7 L12 9 L15 9 L15 11 L12 11 L11 14 L8 14 L8 11 L4 12 Z" />
      <rect x="15" y="7.5" width="22" height="4" rx="1" />
      <rect x="37" y="8.5" width="10" height="2" rx="1" />
      <path d="M22 11.5 L27 11.5 L25.5 18 L21 18 Z" />
      <rect x="17" y="5" width="4" height="2.5" rx="0.5" />
    </svg>
  )
}

/** سیلوئت پوتین رزمی */
export function BootsIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 22" className={className} fill="currentColor" aria-hidden="true">
      <path d="M4 2 L13 2 L13 10 L17 13 L17 18 L4 18 Z" />
      <path d="M26 2 L35 2 L35 10 L39 13 L39 18 L26 18 Z" />
      <path d="M4 18 L17 18 L17 20 L4 20 Z M26 18 L39 18 L39 20 L26 20 Z" fillOpacity="0.6" />
    </svg>
  )
}

export interface PortraitMeta {
  src: string
  name: string
  caption: string
  /** وضعیت هویت‌سنجی تصویر */
  badge: string
}

/** قاب پرتره سبز با نور ملایم */
export function PortraitFrame({ p, size = 'md' }: { p: PortraitMeta; size?: 'md' | 'lg' }) {
  return (
    <figure className="defa-frame flex flex-col items-center">
      <div className={`relative overflow-hidden rounded-2xl border-2 border-emerald-400/40 shadow-[0_0_24px_oklch(0.6_0.12_160/0.25)] ${size === 'lg' ? 'h-40 w-40' : 'h-28 w-28'}`}>
        {/* کراپ پایین تصویر برای حذف نشان‌آب کنج */}
        <img src={p.src} alt={p.name} loading="lazy" className="h-full w-full scale-105 object-cover object-top" />
        <span className="absolute bottom-1 left-1 rounded-md bg-emerald-950/80 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300 border border-emerald-400/30">{p.badge}</span>
      </div>
      <figcaption className="mt-1.5 text-center text-[11px] leading-4">
        <span className="block font-extrabold">{p.name}</span>
        <span className="block text-muted-foreground">{p.caption}</span>
      </figcaption>
    </figure>
  )
}

/** پلاک نام شهید بدون تصویر در دسترس — صادقانه و بی‌جعل (ذخیره برای پرتره‌های نیافته) */
export function MartyrPlaque({ name, caption }: { name: string; caption: string }) {
  return (
    <figure className="defa-frame flex flex-col items-center">
      <div className="grid h-28 w-28 place-items-center rounded-2xl border-2 border-dashed border-emerald-400/40 bg-emerald-950/30">
        <div className="text-center">
          <div className="text-2xl">🌙</div>
          <div className="mt-0.5 text-[9px] font-bold leading-3 text-emerald-300">تصویر تأییدشده<br />در آرشیو ثبت نشد</div>
        </div>
      </div>
      <figcaption className="mt-1.5 text-center text-[11px] leading-4">
        <span className="block font-extrabold">{name}</span>
        <span className="block text-muted-foreground">{caption}</span>
      </figcaption>
    </figure>
  )
}

const LEADERS: PortraitMeta[] = [
  { src: '/images/defa/khomeini-portrait.jpg', name: 'امام خمینی (ره)', caption: 'بنیان‌گذار جمهوری اسلامی ایران — پرتره یادبود رسمی', badge: 'پرتره یادبود آرشیوی' },
  { src: '/images/defa/khamenei-portrait.jpg', name: 'حضرت آیت‌الله خامنه‌ای (مدظله‌العالی)', caption: 'مقام معظم رهبری — پرتره رسمی', badge: 'پرتره رسمی' },
]

const MARTYR_CARDS: { img?: string; name: string; caption: string; badge?: string; pos?: string }[] = [
  { img: '/images/defa/jahanara2.jpg', name: 'شهید محمد جهان‌آرا', caption: 'فرمانده دفاع از خرمشهر — ۷ مهر ۱۳۶۰ (سانحه سی-۱۳۰)', badge: 'پوستر یادبود (ایکنا)' },
  { img: '/images/defa/kharazi.jpg', name: 'شهید حسین خرازی', caption: 'فرمانده لشکر ۱۴ امام حسین (ع) — اسفند ۱۳۶۵', badge: 'پرتره دیجیتال' },
  { img: '/images/defa/sayyad.jpg', name: 'شهید علی صیاد شیرازی', caption: 'فرمانده قرارگاه کربلا و عملیات مرصاد — فروردین ۱۳۷۸ (پس از جنگ)', badge: 'پوستر یادبود' },
  { img: '/images/defa/chamran.jpg', name: 'شهید مصطفی چمران', caption: 'وزیر دفاع و فرمانده جنگ‌های نامنظم — ۳۱ خرداد ۱۳۶۰', badge: 'پرتره تأیید آرشیوی', pos: 'object-top' },
  { img: '/images/defa/hemmat.jpg', name: 'شهید ابراهیم همت', caption: 'فرمانده لشکر ۲۷ محمد رسول‌الله (ص) — اسفند ۱۳۶۲ (خیبر)', badge: 'پرتره آرشیوی جبهه' },
  { img: '/images/defa/bakri-mehdi.jpg', name: 'شهید مهدی باکری', caption: 'فرمانده لشکر ۳۱ عاشورا — اسفند ۱۳۶۳ (بدر)', badge: 'پرتره آرشیوی' },
]

/** نوار چهره‌های ماندگار دفاع مقدس (رهبران + شهدا)
 *  جایگاه ثابت: امام خمینی (ره) بالای سمت راست و حضرت آیت‌الله خامنه‌ای بالای سمت چپ
 *  (الگوی پوستر یادواره؛ در RTL نخستین عنصر flex سمت راست است) */
export function DefaIconsStrip() {
  return (
    <div className="space-y-6">
      {/* دایپتیک رهبری */}
      <div className="flex flex-wrap items-start justify-between gap-4 sm:px-10">
        {LEADERS.map(p => <PortraitFrame key={p.name} p={p} size="lg" />)}
      </div>
      <div>
        <div className="mb-2 flex items-center justify-center gap-2 text-xs font-extrabold tracking-widest text-emerald-400">
          <RifleIcon className="h-4 w-4 text-emerald-500/70" />
          <span>ستارگان آسمان دفاع مقدس</span>
          <BootsIcon className="h-4 w-4 text-emerald-500/70" />
        </div>
        <div className="grid grid-cols-3 justify-items-center gap-4 sm:grid-cols-6">
          {MARTYR_CARDS.map(m =>
            m.img ? (
              <figure key={m.name} className="defa-frame flex flex-col items-center">
                <div className="relative h-28 w-28 overflow-hidden rounded-2xl border-2 border-emerald-400/40 shadow-[0_0_20px_oklch(0.6_0.12_160/0.22)]">
                  <img src={m.img} alt={`پرتره ${m.name}`} loading="lazy" onError={e => { (e.currentTarget.style.display = 'none') }} className={`h-full w-full object-cover ${m.pos ?? ''}`} />
                  {/* روبان «شهید» — سبک پلاک یادواره */}
                  <span className="absolute inset-x-0 top-0 bg-gradient-to-l from-rose-900/95 via-rose-700/95 to-rose-900/95 py-[3px] text-center text-[9.5px] font-black leading-none tracking-[0.3em] text-rose-50 shadow-[0_1px_4px_rgba(0,0,0,0.4)]">شهید</span>
                  {m.badge && <span className="absolute bottom-1 left-1 rounded-md bg-emerald-950/80 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300 border border-emerald-400/30">{m.badge}</span>}
                </div>
                <figcaption className="mt-1.5 text-center text-[11px] leading-4">
                  <span className="block font-extrabold">{m.name}</span>
                  <span className="block text-muted-foreground">{m.caption}</span>
                </figcaption>
              </figure>
            ) : (
              <MartyrPlaque key={m.name} name={m.name} caption={m.caption} />
            ),
          )}
        </div>
        <div className="mt-3 text-center">
          <Link href="#martyrs" className="text-[11px] font-bold text-primary underline decoration-dotted">خط زمانی کامل شهدا در تالار «ستارگان دفاع مقدس» ↗</Link>
        </div>
      </div>
      <p className="mx-auto max-w-2xl text-center text-[10px] leading-5 text-muted-foreground">
        پرتره‌های این نوار از منابع آرشیوی و عمومی وب بازیابی و تطبیق هویت‌سنجی شده‌اند و وضعیت هر تصویر روی خود قاب درج است؛ تاریخ شهادت هر شهید با رکورد راستی‌آزمایی‌شده خط زمانی موزه یکدست است. طبق میثاق موزه، هیچ تصویری بدون احراز هویت در کنار نام شهدا قرار نمی‌گیرد و اگر پرتره‌ای در دسترس نباشد، پلاک نام شهید جای آن را می‌گیرد.
      </p>
    </div>
  )
}
