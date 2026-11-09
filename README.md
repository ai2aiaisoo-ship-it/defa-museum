# یادواره شهدای دفاع مقدس — موزه دیجیتال جنگ تحمیلی (۱۳۵۹–۱۳۶۷)

موزه دیجیتال و اطلس تعاملی جنگ تحمیلی با روایت تاریخی ایرانی: ۳۷ تالار و نما، پرونده کامل ۸ دوره عملیات شاخص،
لایه سه‌گانه داده (روایت/سند/بررسی)، درجه اعتماد A/B/C برای آمارها، اطلس نقشه SVG، تالار سه‌بعدی،
تجربه‌نگاری شنیداری با افشای TTS، تالار خاطرات و آرامگاه‌ها با کارتابل مرور کارشناسی، و گالری تصاویر آرشیوی با شناسنامه کامل.

## اجرای محلی

```bash
npm install
npx prisma generate && npx prisma db push
cp .env.example .env   # در صورت نیاز مسیر DATABASE_URL را تنظیم کنید
npm run dev            # http://localhost:3000
```

## ساخت نسخه ویندوز (exe قابل‌حمل)

ورک‌فلو GitHub Actions در مسیر `.github/workflows/build-exe.yml` روی `windows-latest` اجرا می‌شود:

- تریگر: `workflow_dispatch` (دستی) یا پوش تگ `v*`
- خروجی: `defa-museum-<نسخه>-portable.exe` (Electron + سرور standalone Next.js + پایگاه داده SQLite)
- آرتیفکت در تب Actions و برای تگ‌ها به‌عنوان Release پیوست می‌شود.

ساخت محلی (لینوکس/ویندوز با پیش‌نیازها):

```bash
npm install
npx prisma generate && npx next build
# آماده‌سازی سرور مستقل
cp -r .next/static .next/standalone/.next/static && cp -r public .next/standalone/public
mkdir -p build && cp -r .next/standalone build/app-server && cp -r db build/app-server/db
npx electron-builder --win portable --config electron-builder.yml
```

## معماری داده

- **Prisma + SQLite** (`db/custom.db`): مدل‌های `ContentEdit`، `AuditLog` و `MazarReview`
  (مرورهای کارشناسی تصاویر مزار — مهاجرت‌یافته از `db/mazar-reviews.json` با اسکریپت `scripts/migrate-mazar-reviews.mjs`).
- API مرورها (`/api/reviews`) روی Prisma اجرا می‌شود و در نبود پایگاه داده به ذخیره‌ساز فایل برمی‌گردد.
- خاطرات بازدیدکنندگان طبق وعده حریم خصوصی فقط در مرورگر کاربر می‌ماند.

## میثاق محتوایی

- روایت از سند تفکیک می‌شود؛ آمار هر طرف با برچسب «ادعای طرف درگیر» و درجه اطمینان ارائه می‌شود.
- برای هیچ فیلد خالی عددی جعل نمی‌شود؛ جای خالی صریح اعلام می‌گردد.
- هیچ تصویری بدون برچسب هویت‌سنجی کنار نام شهدا قرار نمی‌گیرد؛ عکس‌های آرشیوی با منبع و مجوز نمایش ثبت می‌شوند.
- مسئولیت آغاز تجاوز بر اساس بند ۶ قطعنامه ۵۹۸ و گزارش هیئت حقیقت‌یاب ۱۹۹۱ به عراق مستند است.
