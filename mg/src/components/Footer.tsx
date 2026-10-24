import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { createWhatsAppUrl } from "@/lib/whatsapp";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="brand">
            <span className="logo-wrap"><Image src="/logo/medical-guide-logo.jpg" alt="" width={96} height={96} /></span>
            <span className="brand-text"><strong>{SITE.name}</strong><small>{SITE.tagline}</small></span>
          </div>
        </div>
        <nav aria-label="روابط التذييل" className="footer-links">
          <Link href="/category/doctors">الأطباء</Link>
          <Link href="/category/pharmacies">صيدليات</Link>
          <Link href="/category/laboratories">معامل تحاليل</Link>
          <Link href="/category/radiology">أشعة</Link>
          <Link href="/search">كل الخدمات</Link>
        </nav>
        <div className="footer-contact">
          <a href={`tel:${SITE.phoneLocal}`} dir="ltr">{SITE.phoneLocal}</a>
          <a href={createWhatsAppUrl({})} target="_blank" rel="noopener noreferrer">تواصل عبر واتساب</a>
        </div>
      </div>
      <p className="copyright">© {new Date().getFullYear()} {SITE.name}. جميع الحقوق محفوظة.</p>
    </footer>
  );
}
