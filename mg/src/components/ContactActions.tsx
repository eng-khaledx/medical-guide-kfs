import Icon from "./Icon";
import { Provider } from "@/types";
import { getSpecialty } from "@/lib/data";
import { MSG, createWhatsAppUrl, getContact } from "@/lib/whatsapp";

export default function ContactActions({ p }: { p: Provider }) {
  const safeDirections = p.directionsUrl?.startsWith("https://") ? p.directionsUrl : undefined;
  const c = getContact(p);
  const wa = createWhatsAppUrl({ phone: c.whatsapp, message: MSG.contact(p.name, getSpecialty(p.specialty)?.name) });
  const callLabel = c.phoneViaGuide ? "اتصل عبر دليلك الطبي" : "اتصل الآن";
  const waLabel = c.whatsappViaGuide ? "تواصل عبر دليلك الطبي" : "تواصل عبر واتساب";
  return (
    <>
    <div className="contact-actions">
      <a className="btn btn-primary" href={`tel:${c.phone}`}><Icon name="phone" size={18} />{callLabel}</a>
      <a className="btn btn-wa" href={wa} target="_blank" rel="noopener noreferrer"><Icon name="chat" size={18} />{waLabel}</a>
      <a className="btn btn-ghost" href={createWhatsAppUrl({ phone: c.whatsapp, message: MSG.booking(p.name) })} target="_blank" rel="noopener noreferrer">طلب حجز / استفسار</a>
      {safeDirections && <a className="btn btn-ghost" href={safeDirections} target="_blank" rel="noopener noreferrer"><Icon name="nav" size={18} />الاتجاهات</a>}
    </div>
    <div className="sticky-contact">
      <a className="btn btn-primary" href={`tel:${c.phone}`}><Icon name="phone" size={18} />اتصل</a>
      <a className="btn btn-wa" href={wa} target="_blank" rel="noopener noreferrer"><Icon name="chat" size={18} />{c.whatsappViaGuide ? "عبر الدليل" : "واتساب"}</a>
    </div>
    </>
  );
}
