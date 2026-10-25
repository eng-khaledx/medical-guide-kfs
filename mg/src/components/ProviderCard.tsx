import Image from "next/image";
import Link from "next/link";
import Icon from "./Icon";
import { Provider } from "@/types";
import { getArea, getSpecialty, typeLabel } from "@/lib/data";
import { getFeeDisplay } from "@/lib/site";
import { MSG, createWhatsAppUrl, getContact } from "@/lib/whatsapp";

export default function ProviderCard({ p }: { p: Provider }) {
  const sub = getSpecialty(p.specialty)?.name ?? typeLabel[p.providerType];
  const area = getArea(p.area)?.name;
  const fee = getFeeDisplay(p);
  const img = p.image ?? p.logo;
  const c = getContact(p);
  const wa = createWhatsAppUrl({ phone: c.whatsapp, message: MSG.contact(p.name, getSpecialty(p.specialty)?.name) });
  return (
    <article className="pcard">
      <div className="badges">
        {p.featured && <span className="badge">مميز</span>}
        {p.verified && <span className="badge badge-ok">موثق</span>}
      </div>
      <div className="avatar">
        {img ? <Image src={img} alt={p.name} fill sizes="76px" style={{ objectFit: "cover" }} />
          : <Icon name={p.providerType === "PHARMACY" ? "pill" : p.providerType === "LABORATORY" ? "flask" : "user"} size={30} />}
      </div>
      <h3><Link href={`/providers/${p.slug}`}>{p.name}</Link></h3>
      <p className="muted">{p.title ?? sub}</p>
      {area && <p className="muted small"><Icon name="pin" size={14} /> {area}</p>}
      {p.subspecialties && p.subspecialties.length > 0 && <ul className="tags tags-sm">{p.subspecialties.map((s) => <li key={s}>{s}</li>)}</ul>}
      {fee && <p className={fee.isPlaceholder ? "fee fee-muted" : "fee"}>سعر الكشف: {fee.text}</p>}
      {p.services && p.services.length > 0 && <p className="small services">{p.services.slice(0, 3).join(" • ")}</p>}
      <div className="pcard-actions">
        <Link className="btn btn-ghost" href={`/providers/${p.slug}`}>عرض الملف</Link>
        <a className="icon-btn icon-wa" href={wa} target="_blank" rel="noopener noreferrer" aria-label={`واتساب ${p.name}${c.whatsappViaGuide ? " عبر دليلك الطبي" : ""}`}><Icon name="chat" size={18} /></a>
        <a className="icon-btn" href={`tel:${c.phone}`} aria-label={`اتصال ${p.name}${c.phoneViaGuide ? " عبر دليلك الطبي" : ""}`}><Icon name="phone" size={18} /></a>
      </div>
    </article>
  );
}
