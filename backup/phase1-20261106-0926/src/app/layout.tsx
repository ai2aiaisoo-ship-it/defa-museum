import type { Metadata } from "next";
import "./globals.css";
import "vazirmatn/Vazirmatn-font-face.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "موزه دیجیتال جنگ ایران و عراق (۱۳۵۹–۱۳۶۷)",
  description:
    "اطلس تعاملی و موزه دیجیتال جامع جنگ هشت‌ساله: عملیات‌ها، خط زمانی، نقشه تحولات جغرافیایی، آمار منبع‌دار با درجه اطمینان، اسناد، فرماندهان و آموزش تعاملی.",
  keywords: ["جنگ ایران و عراق", "دفاع مقدس", "اطلس تعاملی", "موزه دیجیتال", "خط زمانی", "آمار تاریخی"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground font-sans">
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
