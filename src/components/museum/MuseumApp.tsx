'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Dashboard } from './Dashboard'
import { MapAtlas } from './MapAtlas'
import { OperationsView } from './OperationsView'
import { TimelineView } from './TimelineView'
import { StatsView } from './StatsView'
import { KhorramshahrView, MersadView } from './SpecialViews'
import { WarOfCitiesView, TankerWarView, AirWarView, NavalWarView, IraqOpsView, MekOpsView } from './ThemeViews'
import { CommandersView, ForcesView, EquipmentView, ResolutionsView, ForeignView } from './LibraryViews'
import { GalleryView, DocumentaryView } from './MediaViews'
import { AssistantView } from './AssistantView'
import { LearnView, GlossaryView, MapQuizView } from './LearnView'
import { SourcesView, SearchView, AdminView, DocsView } from './UtilityViews'
import { RootsView } from './RootsView'
import { MartyrsView } from './MartyrsView'
import { AviniView } from './AviniView'
import { ArchiveView } from './ArchiveView'
import { SaddamView } from './SaddamView'
import { toFa } from '@/lib/jalali'
import { BattleMapsView } from './BattleMapsView'
import { MusicPlayer } from './MusicPlayer'
import { HeadbandRibbon } from './DefaDecor'
import { Hall3D } from './Hall3D'

export type ViewKey =
  | 'home' | 'hall-3d' | 'atlas' | 'operations' | 'battle-maps' | 'timeline' | 'stats'
  | 'roots' | 'martyrs' | 'avini' | 'archive' | 'saddam-dossier'
  | 'khorramshahr' | 'mersad' | 'war-of-cities' | 'tanker-war' | 'air-war' | 'naval-war' | 'iraq-ops' | 'mek-ops'
  | 'commanders' | 'forces' | 'equipment' | 'foreign' | 'resolutions'
  | 'gallery' | 'documentaries' | 'sources' | 'glossary'
  | 'assistant' | 'learn' | 'map-quiz' | 'search' | 'admin' | 'docs'

const NAV: { group: string; items: { key: ViewKey; label: string; icon: string }[] }[] = [
  {
    group: 'فصل ریشه‌ها (فاز ۲)',
    items: [
      { key: 'roots', label: 'ریشه‌های جنگ؛ از پهلوی تا ۳۱ شهریور', icon: '🌱' },
      { key: 'saddam-dossier', label: 'پرونده تصمیم صدام برای حمله', icon: '📁' },
    ],
  },
  {
    group: 'تالارهای اصلی',
    items: [
      { key: 'home', label: 'داشبورد موزه', icon: '🏛' },
      { key: 'hall-3d', label: 'تالار سه‌بعدی عملیات‌ها (جدید)', icon: '🚶' },
      { key: 'atlas', label: 'اطلس نقشه تعاملی', icon: '🗺' },
      { key: 'timeline', label: 'خط زمانی هشت‌ساله', icon: '📅' },
      { key: 'operations', label: 'اطلس عملیات‌ها', icon: '⚔' },
      { key: 'battle-maps', label: 'نقشه‌های تاکتیکی نبردها (جدید)', icon: '🛡' },
      { key: 'stats', label: 'مرکز آمار و تلفات', icon: '📊' },
    ],
  },
  {
    group: 'شهدا و روایت فتح (فاز ۲)',
    items: [
      { key: 'martyrs', label: 'ستارگان دفاع مقدس؛ خط زمانی شهدا', icon: '🌙' },
      { key: 'avini', label: 'روایت فتح؛ دریچه دوربین آوینی', icon: '🎥' },
      { key: 'archive', label: 'آرشیو جامع چندرسانه‌ای', icon: '📦' },
    ],
  },
  {
    group: 'بخش‌های ویژه',
    items: [
      { key: 'khorramshahr', label: 'خرمشهر؛ از اشغال تا آزادی', icon: '🏙' },
      { key: 'mersad', label: 'فروغ جاویدان و مرصاد', icon: '🕊' },
      { key: 'war-of-cities', label: 'جنگ شهرها', icon: '🏙' },
      { key: 'tanker-war', label: 'جنگ نفتکش‌ها', icon: '🛢' },
      { key: 'air-war', label: 'نبرد هوایی', icon: '✈' },
      { key: 'naval-war', label: 'نبردهای دریایی', icon: '⚓' },
      { key: 'iraq-ops', label: 'عملیات‌های عراق', icon: '🎯' },
      { key: 'mek-ops', label: 'سازمان منافقین', icon: '🔶' },
    ],
  },
  {
    group: 'آرشیو و دانشنامه',
    items: [
      { key: 'commanders', label: 'فرماندهان و شخصیت‌ها', icon: '🎖' },
      { key: 'forces', label: 'نیروها و سازمان‌ها', icon: '🛡' },
      { key: 'equipment', label: 'تجهیزات و غنائم', icon: '⚙' },
      { key: 'foreign', label: 'بازیگران خارجی', icon: '🌍' },
      { key: 'resolutions', label: 'قطعنامه‌ها و دیپلماسی', icon: '📜' },
      { key: 'gallery', label: 'گالری تصاویر', icon: '📷' },
      { key: 'documentaries', label: 'مستندهای تعاملی', icon: '🎬' },
      { key: 'sources', label: 'بانک منابع', icon: '📚' },
      { key: 'glossary', label: 'واژه‌نامه', icon: '📖' },
    ],
  },
  {
    group: 'آموزش و ابزار',
    items: [
      { key: 'assistant', label: 'راهنمای هوشمند موزه', icon: '🤖' },
      { key: 'learn', label: 'آزمون و فلش‌کارت', icon: '🎓' },
      { key: 'map-quiz', label: 'آزمون نقشه', icon: '🧭' },
      { key: 'search', label: 'جست‌وجوی پیشرفته', icon: '🔍' },
      { key: 'admin', label: 'پنل مدیریت محتوا', icon: '🗂' },
      { key: 'docs', label: 'مستندات پروژه', icon: '🧾' },
    ],
  },
]

function NavLinks({ view, go, mobile = false }: { view: ViewKey; go: (v: string, p?: string) => void; mobile?: boolean }) {
  return (
    <nav aria-label="ناوبری موزه" className={mobile ? 'space-y-5' : 'hidden lg:block'}>
      {NAV.map(g => (
        <div key={g.group}>
          <div className="mb-1.5 text-[10px] font-extrabold tracking-widest text-muted-foreground">{g.group}</div>
          <div className={mobile ? 'space-y-1' : 'space-y-0.5'}>
            {g.items.map(it => (
              <button key={it.key} onClick={() => go(it.key)}
                className={`block w-full rounded-lg px-3 py-2 text-right text-[13px] font-bold transition-colors ${view === it.key ? 'bg-primary/15 text-primary' : 'hover:bg-muted'}`}>
                <span className="ml-1.5">{it.icon}</span>{it.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </nav>
  )
}

export function MuseumApp() {
  const [view, setView] = useState<ViewKey>('home')
  const [param, setParam] = useState<string | undefined>()
  const [navOpen, setNavOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const go = (v: string, p?: string) => {
    setView(v as ViewKey)
    setParam(p)
    setNavOpen(false)
    window.history.replaceState(null, '', p ? `#${v}/${p}` : `#${v}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const apply = () => {
      const h = window.location.hash.slice(1)
      const [v, p] = h.split('/')
      if (v) { setView(v as ViewKey); setParam(p) }
    }
    apply()
    window.addEventListener('hashchange', apply)
    const openOp = (e: Event) => { const id = (e as CustomEvent<string>).detail; setView('operations'); setParam(id); window.history.replaceState(null, '', `#operations/${id}`) }
    window.addEventListener('museum-open-op', openOp)
    return () => { window.removeEventListener('hashchange', apply); window.removeEventListener('museum-open-op', openOp) }
  }, [])

  const title = NAV.flatMap(g => g.items).find(i => i.key === view)?.label ?? 'موزه دیجیتال'
  const immersive = view === 'hall-3d'

  const render = () => {
    switch (view) {
      case 'home': return <Dashboard go={go} />
      case 'hall-3d': return <Hall3D go={go} />
      case 'atlas': return (
        <div>
          <div className="mb-5">
            <div className="text-xs font-bold tracking-widest text-primary mb-2">اطلس جغرافیایی</div>
            <h2 className="museum-title text-2xl md:text-3xl">نقشه تعاملی جبهه‌ها</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">سال و ماه را انتخاب کنید؛ عملیات‌های آن دوره، مناطق کنترلی تقریبی و مسیرهای کلی پیشروی روی نقشه تغییر می‌کنند. با «مقایسه دو تاریخ» وضعیت دو مقطع را کنار هم ببینید و روی هر شهر یا عملیات کلیک کنید.</p>
          </div>
          <MapAtlas onSelectOperation={op => go('operations', op.id)} />
        </div>
      )
      case 'operations': return <OperationsView focusId={param} go={go} />
      case 'battle-maps': return <BattleMapsView focusId={param} go={go} />
      case 'timeline': return <TimelineView go={go} />
      case 'stats': return <StatsView />
      case 'roots': return <RootsView go={go} />
      case 'martyrs': return <MartyrsView go={go} />
      case 'avini': return <AviniView go={go} />
      case 'archive': return <ArchiveView go={go} />
      case 'saddam-dossier': return <SaddamView go={go} />
      case 'khorramshahr': return <KhorramshahrView go={go} />
      case 'mersad': return <MersadView go={go} />
      case 'war-of-cities': return <WarOfCitiesView go={go} />
      case 'tanker-war': return <TankerWarView go={go} />
      case 'air-war': return <AirWarView go={go} />
      case 'naval-war': return <NavalWarView go={go} />
      case 'iraq-ops': return <IraqOpsView go={go} />
      case 'mek-ops': return <MekOpsView go={go} />
      case 'commanders': return <CommandersView go={go} />
      case 'forces': return <ForcesView />
      case 'equipment': return <EquipmentView />
      case 'foreign': return <ForeignView />
      case 'resolutions': return <ResolutionsView />
      case 'gallery': return <GalleryView />
      case 'documentaries': return <DocumentaryView go={go} focusId={param} />
      case 'sources': return <SourcesView />
      case 'glossary': return <GlossaryView />
      case 'assistant': return <AssistantView />
      case 'learn': return <LearnView />
      case 'map-quiz': return <MapQuizView />
      case 'search': return <SearchView go={go} />
      case 'admin': return <AdminView />
      case 'docs': return <DocsView go={go} />
      default: return <Dashboard go={go} />
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* سربند یا زهرا — تم دفاع مقدسی */}
      <HeadbandRibbon />
      {/* سربرگ */}
      <header className="glass sticky top-0 z-40 border-b">
        <div className="mx-auto flex max-w-[1500px] items-center gap-3 px-4 py-3">
          <button onClick={() => go('home')} className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-xl">🏛</span>
            <span className="text-right">
              <span className="block text-sm font-extrabold leading-5">موزه دیجیتال جنگ ایران و عراق</span>
              <span className="block text-[10px] text-muted-foreground">روایت ایرانی، اسناد واقعی، آرشیو چندملیتی — نسخه پژوهشی {toFa('2.0')}</span>
            </span>
          </button>
          <div className="mr-auto flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => go('search')} className="text-xs font-bold">🔍 جست‌وجو</Button>
            <Button size="sm" variant="outline" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="تغییر تم" className="text-xs"><span suppressHydrationWarning>{theme === 'dark' ? '☀ روشن' : '🌙 تاریک'}</span></Button>
            <Sheet open={navOpen} onOpenChange={setNavOpen}>
              <SheetTrigger asChild>
                <Button size="sm" type="button" className="lg:hidden font-bold">☰ تالارها</Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 overflow-y-auto scrollbar-thin">
                <SheetTitle className="mb-4 text-right">تالارهای موزه</SheetTitle>
                <NavLinks view={view} go={go} mobile />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* بدنه */}
      {immersive ? (
        <div className="w-full flex-1">
          {render()}
        </div>
      ) : (
      <div className="mx-auto flex w-full max-w-[1500px] flex-1 gap-6 px-4 py-6">
        <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] w-60 shrink-0 overflow-y-auto rounded-2xl border bg-card/50 p-3 scrollbar-thin lg:block">
          <NavLinks view={view} go={go} />
        </aside>
        <main className="min-w-0 flex-1">
          {view !== 'home' && (
            <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
              <button onClick={() => go('home')} className="hover:text-primary">خانه</button>
              <span>/</span>
              <span className="font-bold text-foreground">{title}</span>
            </div>
          )}
          {render()}
        </main>
      </div>
      )}

      {/* پخش‌کننده موسیقی متن خاک سرخ — قابل میوت */}
      <MusicPlayer />

      {/* پابرگ چسبان */}
      <footer className="mt-auto border-t bg-card/60">
        <div className="mx-auto flex max-w-[1500px] flex-col items-center justify-between gap-2 px-4 py-4 text-center text-[11px] leading-5 text-muted-foreground md:flex-row md:text-right">
          <p>موزه دیجیتال و اطلس تعاملی جنگ ایران و عراق (۱۳۵۹–۱۳۶۷) — پروژه پژوهشی-آموزشی با روایت تاریخی ایرانی. روایت از سند تفکیک می‌شود، اختلاف روایت‌ها شفاف ثبت است و آمار با درجه اطمینان A/B/C ارائه می‌شود.</p>
          <p>مسئولیت آغاز تجاوز بر اساس بند ۶ قطعنامه ۵۹۸ و گزارش هیئت حقیقت‌یاب دبیرکل (دسامبر ۱۹۹۱) به عراق مستند شده است. موسیقی: قطعه محیطی الهام‌گرفته از «خاک سرخ» (لینک قطعه اصلی علیقلی در پخش‌کننده)؛ پرتره‌ها با برچسب وضعیت هویت‌سنجی از منابع عمومی.</p>
        </div>
      </footer>
    </div>
  )
}
