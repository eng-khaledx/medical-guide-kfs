import Link from "next/link";
import Icon from "./Icon";

export default function Tile({ label, icon, tint, href, extra }: { label: string; icon: string; tint: string; href: string; extra?: boolean }) {
  return (
    <Link href={href} className={`tile${extra ? " tile-extra" : ""}`}>
      <span className={`tile-icon tint-${tint}`}><Icon name={icon} size={22} /></span>
      <span>{label}</span>
    </Link>
  );
}
