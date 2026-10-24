import Link from "next/link";
import { Offer } from "@/types";
import { getProviderById } from "@/lib/data";

export default function OfferCard({ o }: { o: Offer }) {
  const p = getProviderById(o.providerId);
  const until = o.endDate ? new Date(o.endDate).toLocaleDateString("ar-EG", { day: "numeric", month: "long", year: "numeric" }) : null;
  return (
    <article className="ocard">
      {o.discountText && <span className="badge">{o.discountText}</span>}
      <h3>{o.title}</h3>
      {o.description && <p className="muted">{o.description}</p>}
      {p && <p className="small">لدى: {p.name}</p>}
      {until && <p className="muted small">ساري حتى {until}</p>}
      {p && <Link className="btn btn-ghost" href={`/providers/${p.slug}`}>اكتشف العرض</Link>}
    </article>
  );
}
