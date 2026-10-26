import Icon from "./Icon";
import { ATTACH_NOTE, type JoinConfig } from "@/lib/join";
import { MSG, createWhatsAppUrl } from "@/lib/whatsapp";

const benefits = [
  { icon: "user", title: "صفحة خاصة بيك", text: "بياناتك وطرق التواصل معاك في مكان واحد." },
  { icon: "search", title: "المرضى بيوصلولك", text: "بالبحث بالتخصص أو المنطقة في كفرالشيخ." },
  { icon: "chat", title: "تواصل مباشر", text: "واتساب واتصال من صفحتك بضغطة واحدة." },
];

/** كارد جانبي لصفحات الانضمام: مميزات + تنبيه المستندات + سؤال سريع على واتساب. */
export default function JoinSide({ config }: { config: JoinConfig }) {
  const note = config.attachNote ? ATTACH_NOTE : config.attach?.note ?? "ابعت الصور والمستندات على واتساب بعد الإرسال.";
  return (
    <aside className="join-side" aria-label="ليه تنضم لدليلك الطبي؟">
      <h2>ليه تنضم لدليلك الطبي؟</h2>
      <ul className="join-benefits">
        {benefits.map((b) => (
          <li key={b.title}>
            <span className="join-benefit-icon"><Icon name={b.icon} size={20} /></span>
            <span><strong>{b.title}</strong><small>{b.text}</small></span>
          </li>
        ))}
      </ul>
      <p className="attach-note">📎 {note}</p>
      <a className="join-side-wa" href={createWhatsAppUrl({ message: MSG.join })} target="_blank" rel="noopener noreferrer">عندك سؤال؟ كلمنا واتساب</a>
    </aside>
  );
}
