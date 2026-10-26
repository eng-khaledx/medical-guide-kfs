import Link from "next/link";
import Icon from "./Icon";

/** بانر رأس صفحات الانضمام: تدرج بالألوان الأساسية، أيقونة، مسار تصفح، وعنوان الصفحة (h1). */
export default function JoinHero({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <header className="join-hero">
      <span className="join-hero-icon"><Icon name={icon} size={32} /></span>
      <div className="join-hero-text">
        <nav className="join-crumbs" aria-label="مسار التصفح"><Link href="/">الرئيسية</Link> / <span aria-current="page">{title}</span></nav>
        <h1>{title}</h1>
        {subtitle && <p className="join-hero-sub">{subtitle}</p>}
      </div>
    </header>
  );
}
