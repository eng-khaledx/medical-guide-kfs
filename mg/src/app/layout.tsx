import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomBar from "@/components/BottomBar";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { SITE } from "@/lib/site";
import "./globals.css";

const cairo = Cairo({ subsets: ["arabic", "latin"], weight: ["400", "600", "700", "800"], variable: "--font-cairo", display: "swap" });

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
    <html lang="ar" dir="rtl" className={cairo.variable}>
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
