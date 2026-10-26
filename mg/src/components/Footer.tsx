import Image from "next/image";
import Link from "next/link";
import Icon from "./Icon";
import { getProvidersBySpecialty, getSpecialties } from "@/lib/data";
import { joinLinks } from "@/lib/join";
import { FACEBOOK_URL, SITE } from "@/lib/site";
import { createWhatsAppUrl } from "@/lib/whatsapp";

// أكثر 6 تخصصات فيها أطباء
const topSpecialties = () =>
  getSpecialties()
    .map((s) => ({ s, n: getProvidersBySpecialty(s.slug).filter((p) => p.providerType === "DOCTOR").length }))
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n)
    .slice(0, 6)
    .map((x) => x.s);

export default function Footer() {
  const wa = createWhatsAppUrl({});
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="brand">
            <span className="logo-wrap"><Image src="/logo/medical-guide-logo.jpg" alt="" width={96} height={96} /></span>
            <span className="brand-text"><strong>{SITE.name}</strong><small>{SITE.tagline}</small></span>
          </div>
          <p className="footer-about">دليل مجاني يساعدك توصل لأقرب دكتور أو معمل أو صيدلية في كفرالشيخ بسهولة.</p>
          <div className="footer-social">
            <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="واتساب"><Icon name="chat" size={20} /></a>
            {FACEBOOK_URL && (
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="فيسبوك">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1z" /></svg>
              </a>
            )}
          </div>
        </div>
        <nav aria-label="التخصصات" className="footer-links">
          <strong className="footer-head">التخصصات</strong>
          {topSpecialties().map((s) => <Link key={s.slug} href={`/specialties/${s.slug}`}>{s.name}</Link>)}
          <Link href="/specialties">كل التخصصات</Link>
        </nav>
        <nav aria-label="انضم إلينا" className="footer-links">
          <strong className="footer-head">انضم إلينا</strong>
          {joinLinks.map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}
        </nav>
        <nav aria-label="تحتاج مساعدة؟" className="footer-links footer-contact">
          <strong className="footer-head">تحتاج مساعدة؟</strong>
          <a href={wa} target="_blank" rel="noopener noreferrer">تواصل معنا</a>
          <a href={`tel:${SITE.phoneLocal}`} dir="ltr">{SITE.phoneLocal}</a>
          <Link href="/privacy">سياسة الخصوصية</Link>
          <Link href="/terms">الشروط والأحكام</Link>
        </nav>
      </div>
      <p className="copyright">© {new Date().getFullYear()} {SITE.name}. جميع الحقوق محفوظة.</p>
    </footer>
  );
}
