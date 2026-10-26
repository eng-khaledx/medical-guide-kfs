import Link from "next/link";
import { getActiveBanners } from "@/lib/data";
import { createWhatsAppUrl } from "@/lib/whatsapp";

export default function Banners() {
  const banners = getActiveBanners();
  if (!banners.length) return null;
  return (
    <section className="container banners" aria-label="إعلانات">
      {banners.map((b) => {
        const external = !!b.ctaWhatsAppMessage;
        const href = external ? createWhatsAppUrl({ message: b.ctaWhatsAppMessage }) : b.ctaUrl ?? "/search";
        return (
          <div className="banner" key={b.id}>
            <div>
              <h2>{b.title}</h2>
              {b.subtitle && <p className="muted">{b.subtitle}</p>}
            </div>
            <div className="cta-actions">
              {external
                ? <a className="btn btn-primary" href={href} target="_blank" rel="noopener noreferrer">{b.ctaText}</a>
                : <Link className="btn btn-primary" href={href}>{b.ctaText}</Link>}
              {b.secondaryWhatsAppMessage && (
                <a className="cta-secondary" href={createWhatsAppUrl({ message: b.secondaryWhatsAppMessage })} target="_blank" rel="noopener noreferrer">عندك سؤال؟ كلمنا واتساب</a>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}
