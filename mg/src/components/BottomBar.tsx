import Link from "next/link";
import Icon from "./Icon";
import { MSG, createWhatsAppUrl } from "@/lib/whatsapp";

// شريط سفلي للموبايل فقط (يُخفى من 960px)
export default function BottomBar() {
  return (
    <nav className="bottom-bar" aria-label="إجراءات سريعة">
      <Link href="/search"><Icon name="search" size={22} />بحث</Link>
      <Link href="/#categories"><Icon name="grid" size={22} />الأقسام</Link>
      <a className="bb-wa" href={createWhatsAppUrl({ message: MSG.help })} target="_blank" rel="noopener noreferrer"><Icon name="chat" size={22} />واتساب</a>
    </nav>
  );
}
