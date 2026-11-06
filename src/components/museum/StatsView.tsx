'use client'

import { useState } from 'react'
import { WAR_STATS, IRAN_DEATHS_ESTIMATE, IRaq_DEATHS_RANGE } from '@/data/statistics'
import { OPERATIONS, CONFIDENCE_LABELS } from '@/data/operations'
import { toFa } from '@/lib/jalali'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ConfidenceBadge, SectionHeader } from './ui-bits'
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis, LabelList,
} from 'recharts'

const PIE_COLORS = ['#2dd4bf', '#f59e0b', '#fb7185', '#60a5fa', '#a78bfa', '#34d399', '#fbbf24']

export function StatsView() {
  const [showAll, setShowAll] = useState(false)
  const resultDist = Object.entries(
    OPERATIONS.reduce((m, o) => { m[o.result] = (m[o.result] ?? 0) + 1; return m }, {} as Record<string, number>)
  ).map(([k, v]) => ({ name: CONFIDENCE_LABELS_A(k), value: v }))
  const sideDist = ['iran', 'iraq', 'mek', 'us', 'israel'].map(s => ({ name: sideName(s), value: OPERATIONS.filter(o => o.side === s).length }))
  const yearDist = [1359, 1360, 1361, 1362, 1363, 1364, 1365, 1366, 1367].map(y => ({ year: toFa(y), تعداد: OPERATIONS.filter(o => o.year === y).length }))

  return (
    <div>
      <SectionHeader
        kicker="مرکز آماری مستقل"
        title="آمار و تلفات — با منبع و درجه اطمینان"
        desc="در این مرکز، هر عدد با منبع، روش برآورد و درجه اطمینان (A مستند / B تخمینی / C مورد اختلاف) ارائه می‌شود. آمار کل جنگ از جمع اعداد عملیات‌ها تولید نمی‌شود؛ ممکن است یک تلفات در چند گزارش تکرار شده باشد."
      />

      <Tabs defaultValue="war" className="space-y-4">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="war">آمار کلان</TabsTrigger>
          <TabsTrigger value="charts">نمودارهای ساختار</TabsTrigger>
          <TabsTrigger value="dispute">اختلاف منابع</TabsTrigger>
        </TabsList>

        <TabsContent value="war" className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            {WAR_STATS.filter(s => showAll || s.confidence !== 'C' || s.metric.includes('کشته')).map(s => (
              <Card key={s.id} className="museum-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-xs font-bold text-muted-foreground">{s.metric}</div>
                    <ConfidenceBadge c={s.confidence} />
                  </div>
                  <div className="mt-1 text-lg font-extrabold leading-8">{s.value}</div>
                  <div className="text-[11px] text-muted-foreground">{s.unit} • {s.period} • {s.region}</div>
                  {s.note && <div className="mt-2 rounded-lg bg-muted/60 p-2 text-[11px] leading-5">⚠ {s.note}</div>}
                  <div className="mt-2 text-[11px] text-muted-foreground">روش: {s.method} — منبع: <span className="font-bold">{s.sourceId}</span></div>
                </CardContent>
              </Card>
            ))}
          </div>
          <button onClick={() => setShowAll(v => !v)} className="text-sm font-bold text-primary underline">
            {showAll ? 'نمایش کمتر' : 'نمایش همه ادعاها (شامل موارد مورد اختلاف)'}
          </button>
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <h4 className="mb-3 font-extrabold">برآورد کشتگان ایرانی بر پایه شمارش‌های اداری (با تفکیک نوع)</h4>
              <div className="h-72" dir="ltr">
                <ResponsiveContainer>
                  <BarChart data={IRAN_DEATHS_ESTIMATE} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.4 0 0 / 0.2)" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="label" width={190} tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(v: number) => toFa(v.toLocaleString('fa-IR'))} contentStyle={{ fontFamily: 'Vazirmatn', direction: 'rtl' }} />
                    <Bar dataKey="value" name="نفر" radius={[0, 6, 6, 0]}>
                      {IRAN_DEATHS_ESTIMATE.map((d, i) => <Cell key={i} fill={d.kind === 'documented' ? '#2dd4bf' : '#f59e0b'} />)}
                      <LabelList dataKey="value" position="right" formatter={(v: number) => toFa(v.toLocaleString('fa-IR'))} style={{ fontSize: 11 }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 text-[11px] leading-5 text-muted-foreground">🟩 شمارش اداری منبع‌دار — 🟨 اختلاف بین روش‌های شمارش (برآورد). منبع: پژوهش کورزمن (دانشگاه UNC) و سلامتی ۲۰۱۳. این اعداد شامل مجروحان، اسرا و مفقودان «نیست» و با آن‌ها جمع نمی‌شوند.</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h4 className="mb-3 font-extrabold">دامنه برآورد کشتگان عراقی در منابع مختلف</h4>
              <div className="h-64" dir="ltr">
                <ResponsiveContainer>
                  <BarChart data={IRaq_DEATHS_RANGE}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.4 0 0 / 0.2)" />
                    <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={0} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v: number) => toFa(v.toLocaleString('fa-IR'))} contentStyle={{ fontFamily: 'Vazirmatn', direction: 'rtl' }} />
                    <Bar dataKey="low" name="حد پایین" fill="#fbbf24" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="high" name="حد بالا" fill="#fb7185" radius={[6, 6, 0, 0]} />
                    <Legend wrapperStyle={{ fontFamily: 'Vazirmatn', fontSize: 12 }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 text-[11px] leading-5 text-muted-foreground">⚠ عراق هیچ‌گاه آمار رسمی منتشر نکرد؛ ارقام COW (۵۰۰ هزار) با داده سرشماری ۱۹۹۷ عراق ناسازگار دانسته شده‌اند. منبع: پژوهش کورزمن.</p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="p-4">
                <h4 className="mb-3 font-extrabold">توزیع نتایج {toFa(OPERATIONS.length)} عملیات ثبت‌شده</h4>
                <div className="h-64" dir="ltr">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={resultDist} dataKey="value" nameKey="name" outerRadius={90} label={({ name, value }) => `${name} ${toFa(value)}`} labelLine={false} style={{ fontSize: 10, fontFamily: 'Vazirmatn' }}>
                        {resultDist.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ fontFamily: 'Vazirmatn', direction: 'rtl' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h4 className="mb-3 font-extrabold">پرونده‌ها بر اساس طرف اجراکننده</h4>
                <div className="h-64" dir="ltr">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={sideDist} dataKey="value" nameKey="name" outerRadius={90} label={({ name, value }) => `${name} ${toFa(value)}`} labelLine={false} style={{ fontSize: 10, fontFamily: 'Vazirmatn' }}>
                        {sideDist.map((_, i) => <Cell key={i} fill={PIE_COLORS[(i + 3) % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ fontFamily: 'Vazirmatn', direction: 'rtl' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-4">
              <h4 className="mb-3 font-extrabold">تعداد پرونده عملیات در هر سال جنگ</h4>
              <div className="h-60" dir="ltr">
                <ResponsiveContainer>
                  <BarChart data={yearDist}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.4 0 0 / 0.2)" />
                    <XAxis dataKey="year" tick={{ fontSize: 12, fontFamily: 'Vazirmatn' }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v: number) => toFa(v)} contentStyle={{ fontFamily: 'Vazirmatn', direction: 'rtl' }} />
                    <Bar dataKey="تعداد" fill="#34d399" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dispute" className="space-y-3">
          <Card>
            <CardContent className="p-4 text-sm leading-8">
              <h4 className="mb-2 font-extrabold text-primary">سیاست اختلاف منابع</h4>
              <p>وقتی دو منبع عدد متفاوتی می‌دهند، این موزه «هر دو رقم» را کنار هم نمایش می‌دهد و علت اختلاف (روش شمارش، تعریف شاخص، دوره زمانی، جانب‌داری منبع) را توضیح می‌دهد. هیچ عددی برای «زیباتر شدن نمودار» انتخاب نمی‌شود.</p>
              <p className="mt-3">نمونه محوری: مجموع کشتگان جنگ — از ۵۰۰ هزار (پروژه COW) تا بیش از یک میلیون در برخی برآوردها، در حالی که تحلیل سرشماری‌های پس از جنگ (ایران ۱۹۹۶ و عراق ۱۹۹۷) از ارقام بسیار بالا پشتیبانی نمی‌کند. شمارش‌های اداری ایران (۱۵۵ تا ۱۸۴ هزار) و برآورد فرمانده عراقی (۲۵۰ هزار) در میانه این طیف قرار می‌گیرند.</p>
            </CardContent>
          </Card>
          {WAR_STATS.filter(s => s.note).map(s => (
            <Card key={s.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">{s.metric}</span>
                  <ConfidenceBadge c={s.confidence} />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{s.value} — {s.unit}</div>
                <div className="mt-2 rounded-lg bg-amber-500/10 p-2 text-xs leading-6 text-amber-500">⚠ {s.note}</div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CONFIDENCE_LABELS_A(k: string): string {
  const map: Record<string, string> = {
    clear_victory: 'پیروزی روشن', limited_success: 'موفقیت محدود', costly_success: 'موفقیت پرهزینه',
    mixed: 'مختلط', failure: 'شکست', halted: 'متوقف‌شده', defensive_success: 'دفاع موفق', defensive_failure: 'دفاع ناموفق',
  }
  return map[k] ?? k
}
function sideName(s: string): string {
  return ({ iran: 'ایران', iraq: 'عراق', mek: 'منافقین', us: 'آمریکا', israel: 'اسرائیل' } as Record<string, string>)[s] ?? s
}
