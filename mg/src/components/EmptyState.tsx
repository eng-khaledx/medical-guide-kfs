import { MSG, createWhatsAppUrl } from "@/lib/whatsapp";

export default function EmptyState({ title = "ملقيناش نتائج مطابقة لبحثك", text = "جرّب تخصصًا آخر أو منطقة مختلفة.", cta = "اطلب المساعدة عبر واتساب" }: { title?: string; text?: string; cta?: string }) {
  return (
    <div className="empty">
      <h2>{title}</h2>
      <p className="muted">{text}</p>
      <a className="btn btn-wa" href={createWhatsAppUrl({ message: MSG.help })} target="_blank" rel="noopener noreferrer">{cta}</a>
    </div>
  );
}
