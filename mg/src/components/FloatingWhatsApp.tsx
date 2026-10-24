import Icon from "./Icon";
import { MSG, createWhatsAppUrl } from "@/lib/whatsapp";

export default function FloatingWhatsApp() {
  return (
    <a className="fab" href={createWhatsAppUrl({ message: MSG.help })} target="_blank" rel="noopener noreferrer"
      aria-label="تواصل معنا عبر واتساب">
      <Icon name="chat" size={26} />
      <span className="fab-tip" role="tooltip">تواصل معنا عبر واتساب</span>
    </a>
  );
}
