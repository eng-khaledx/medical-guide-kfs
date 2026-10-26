import Image from "next/image";
import Link from "next/link";
import Icon from "./Icon";
import MobileNav from "./MobileNav";
import { joinLinks } from "@/lib/join";
import { SITE } from "@/lib/site";
import { MSG, createWhatsAppUrl } from "@/lib/whatsapp";
import { getActiveOffers } from "@/lib/data";

export default function Header() {
  const wa = createWhatsAppUrl({ message: MSG.help });
  const links = [
    { href: "/", label: "الرئيسية" },
    { href: "/category/doctors", label: "الأطباء" },
    { href: "/#specialties", label: "التخصصات" },
    { href: "/#categories", label: "الخدمات الطبية" },
    ...(getActiveOffers().length ? [{ href: "/#offers", label: "العروض" }] : []),
    { href: "/#providers-cta", label: "للأطباء" },
  ];
  return (
    <header className="site-header">
      <div className="container header-row">
        <Link href="/" className="brand" aria-label={SITE.name}>
          <span className="logo-wrap">
            <Image src="/logo/medical-guide-logo.jpg" alt="شعار دليلك الطبي بكفرالشيخ" width={96} height={96} priority />
          </span>
          <span className="brand-text"><strong>دليلك الطبي</strong><small>بكفرالشيخ</small></span>
        </Link>
        <nav className="nav-desktop" aria-label="القائمة الرئيسية">
          {links.map((l) => <Link key={l.label} href={l.href}>{l.label}</Link>)}
          <a href={wa} target="_blank" rel="noopener noreferrer">تواصل معنا</a>
        </nav>
        <a className="phone-pill" href={`tel:${SITE.phoneLocal}`} aria-label={`اتصل على ${SITE.phoneLocal}`}>
          <span className="phone-dot"><Icon name="phone" size={16} /></span>
          <span dir="ltr">{SITE.phoneLocal}</span>
        </a>
        <a className="wa-mobile" href={wa} target="_blank" rel="noopener noreferrer" aria-label="تواصل عبر واتساب">
          <Icon name="chat" size={20} />
        </a>
        <MobileNav links={links} joinLinks={joinLinks} waUrl={wa} phone={SITE.phoneLocal} />
      </div>
    </header>
  );
}
