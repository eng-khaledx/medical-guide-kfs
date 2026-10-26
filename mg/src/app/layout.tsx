import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomBar from "@/components/BottomBar";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { SITE } from "@/lib/site";
import "./globals.css";

// Cairo مستضاف محليًا (بدون Google Fonts وقت البناء): ملفات عربية ولاتينية لكل وزن بنطاق يونيكود خاص (القيم لازم تكون literals لـ next/font)
const cairoArabic = localFont({ src: [
    { path: "../fonts/cairo/cairo-arabic-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/cairo/cairo-arabic-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/cairo/cairo-arabic-700-normal.woff2", weight: "700", style: "normal" },
    { path: "../fonts/cairo/cairo-arabic-800-normal.woff2", weight: "800", style: "normal" },
  ], variable: "--font-cairo-ar", display: "swap", fallback: ["Tahoma", "sans-serif"],
  declarations: [{ prop: "unicode-range", value: "U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0897-08E1,U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC,U+102E0-102FB,U+10E60-10E7E,U+10EC2-10EC4,U+10EFC-10EFF,U+1EE00-1EE03,U+1EE05-1EE1F,U+1EE21-1EE22,U+1EE24,U+1EE27,U+1EE29-1EE32,U+1EE34-1EE37,U+1EE39,U+1EE3B,U+1EE42,U+1EE47,U+1EE49,U+1EE4B,U+1EE4D-1EE4F,U+1EE51-1EE52,U+1EE54,U+1EE57,U+1EE59,U+1EE5B,U+1EE5D,U+1EE5F,U+1EE61-1EE62,U+1EE64,U+1EE67-1EE6A,U+1EE6C-1EE72,U+1EE74-1EE77,U+1EE79-1EE7C,U+1EE7E,U+1EE80-1EE89,U+1EE8B-1EE9B,U+1EEA1-1EEA3,U+1EEA5-1EEA9,U+1EEAB-1EEBB,U+1EEF0-1EEF1" }] });
const cairoLatin = localFont({ src: [
    { path: "../fonts/cairo/cairo-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/cairo/cairo-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/cairo/cairo-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "../fonts/cairo/cairo-latin-800-normal.woff2", weight: "800", style: "normal" },
  ], variable: "--font-cairo-lat", display: "swap", fallback: ["Tahoma", "sans-serif"],
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD" }] });

const description = "ابحث عن الأطباء والصيدليات ومعامل التحاليل ومراكز الأشعة والخدمات الطبية في كفرالشيخ، وتواصل مباشرة عبر الاتصال أو واتساب.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} | ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description,
  alternates: { canonical: "/" },
  openGraph: { title: SITE.name, description, siteName: SITE.name, locale: "ar_EG", type: "website", images: ["/logo/medical-guide-logo.jpg"] },
};
export const viewport: Viewport = { themeColor: "#F0F7FD", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${cairoArabic.variable} ${cairoLatin.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <BottomBar />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
