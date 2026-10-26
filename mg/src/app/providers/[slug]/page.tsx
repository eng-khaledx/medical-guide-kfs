import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import ContactActions from "@/components/ContactActions";
import OfferCard from "@/components/OfferCard";
import { MSG, createWhatsAppUrl } from "@/lib/whatsapp";
import { getActiveOffers, getArea, getProviderBySlug, getProviders, getSpecialty, typeLabel } from "@/lib/data";
import { GUIDE_CONTACT_NUMBER, SITE, getFeeDisplay } from "@/lib/site";

export const dynamicParams = false;
export const generateStaticParams = () => getProviders().map((p) => ({ slug: p.slug }));

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getProviderBySlug(params.slug);
  if (!p) return {};
  const sp = getSpecialty(p.specialty)?.name;
  const area = getArea(p.area)?.name ?? "كفرالشيخ";
  const title = `${p.name}${sp ? ` - ${sp}` : ""} في ${area}`;
  const description = p.description ?? `${typeLabel[p.providerType]} ${p.name} في ${area}. تواصل عبر الاتصال أو واتساب من ${SITE.name}.`;
  return { title, description, alternates: { canonical: `/providers/${p.slug}` }, openGraph: { title, description } };
}

export default function ProviderPage({ params }: { params: { slug: string } }) {
  const p = getProviderBySlug(params.slug);
  if (!p) notFound();
  const sp = getSpecialty(p.specialty)?.name;
  const area = getArea(p.area)?.name;
  const img = p.image ?? p.logo;
  const offers = getActiveOffers().filter((o) => o.providerId === p.id);
  const fee = getFeeDisplay(p);
  const addr = [area, p.address].filter(Boolean).join(" - ") || undefined;
  const rows: [string, React.ReactNode][] = [
    ["ساعات العمل", p.workingHours],
    ["العنوان", addr && <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${addr} كفر الشيخ`)}`} target="_blank" rel="noopener noreferrer">{addr}</a>],
    ["سعر الكشف", fee && (fee.isPlaceholder ? <span className="fee-muted">{fee.text}</span> : fee.text)],
    ["الهاتف", p.phone && <a href={`tel:${p.phone}`} dir="ltr">{p.phone}</a>],
  ];
  const ld = {
    "@context": "https://schema.org", "@type": "MedicalBusiness", name: p.name,
    ...(p.phone && { telephone: p.phone }), ...(p.address && { address: p.address }), ...(p.description && { description: p.description }),
  };
  return (
    <div className="container section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <nav className="crumbs" aria-label="مسار التصفح"><Link href="/">الرئيسية</Link> / <Link href="/search">الخدمات</Link> / <span>{p.name}</span></nav>
      <div className="profile">
        <div className="avatar avatar-lg">{img ? <Image src={img} alt={p.name} fill sizes="120px" style={{ objectFit: "cover" }} /> : <Icon name="user" size={44} />}</div>
        <div>
          <div className="badges static">
            {p.featured && <span className="badge">مميز</span>}{p.verified && <span className="badge badge-ok">موثق</span>}
          </div>
          <h1 className="page-title">{p.name}</h1>
          <p className="muted">{p.title ?? [typeLabel[p.providerType], sp].filter(Boolean).join(" • ")}</p>
          {fee && <p className={fee.isPlaceholder ? "fee fee-muted" : "fee"}>سعر الكشف: {fee.text}</p>}
        </div>
      </div>
      <ContactActions p={p} />
      <p className="emergency-note">في الطوارئ اتصل بالإسعاف <a href="tel:123" dir="ltr">123</a></p>
      <div className="detail-grid">
        <section className="panel">
          {p.description && (<><h2>نبذة</h2><p>{p.description}</p></>)}
          {p.subspecialties && p.subspecialties.length > 0 && (<><h2>التخصصات الدقيقة</h2><ul className="tags">{p.subspecialties.map((s) => <li key={s}>{s}</li>)}</ul></>)}
          {p.services && p.services.length > 0 && (<><h2>الخدمات</h2><ul className="tags">{p.services.map((s) => <li key={s}>{s}</li>)}</ul></>)}
          {p.gallery && p.gallery.length > 0 && (<><h2>معرض الصور</h2><div className="gallery">{p.gallery.map((g) => (
            <div key={g} className="g-item"><Image src={g} alt={p.name} fill sizes="(min-width: 960px) 20vw, (min-width: 600px) 30vw, 50vw" style={{ objectFit: "cover" }} /></div>))}</div></>)}
        </section>
        <aside className="panel">
          <h2>معلومات</h2>
          <dl className="info">{rows.filter(([, v]) => v).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        </aside>
      </div>
      <p className="claim-link"><a href={createWhatsAppUrl({ phone: GUIDE_CONTACT_NUMBER.whatsapp, message: MSG.claim(p.name, `${SITE.url}/providers/${p.slug}`) })} target="_blank" rel="noopener noreferrer">{p.providerType === "DOCTOR" ? "أنت الدكتور؟" : "أنت صاحب الخدمة؟"} عدّل بياناتك أو اطلب حذفها</a></p>
      {offers.length > 0 && (<><h2 className="section-title">عروض</h2><div className="grid">{offers.map((o) => <OfferCard key={o.id} o={o} />)}</div></>)}
    </div>
  );
}
