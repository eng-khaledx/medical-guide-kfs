"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Icon from "./Icon";

type NavLink = { href: string; label: string };

export default function MobileNav({ links, waUrl, phone }: { links: NavLink[]; waUrl: string; phone: string }) {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); toggle.current?.focus(); }
    };
    const mq = window.matchMedia("(min-width: 960px)");
    const onMq = () => mq.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  return (
    <div className={`nav-wrap${open ? " drawer-open" : ""}`}>
      <button ref={toggle} type="button" className="menu-btn" aria-label="فتح القائمة" aria-expanded={open} aria-controls="mobile-drawer" onClick={() => setOpen(true)}>
        <Icon name="menu" />
      </button>
      <div className="drawer-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
      <nav id="mobile-drawer" className="drawer" aria-label="القائمة للموبايل" aria-hidden={!open} onClick={(e) => { if ((e.target as HTMLElement).closest("a")) setOpen(false); }}>
        <div className="drawer-head">
          <span>القائمة</span>
          <button ref={closeBtn} type="button" className="icon-btn" aria-label="إغلاق القائمة" onClick={() => { setOpen(false); toggle.current?.focus(); }}>
            <Icon name="close" size={20} />
          </button>
        </div>
        {links.map((l) => <Link key={l.label} href={l.href}>{l.label}</Link>)}
        <a className="drawer-phone" href={`tel:${phone}`}><Icon name="phone" size={18} /><span dir="ltr">{phone}</span></a>
        <a className="drawer-cta" href={waUrl} target="_blank" rel="noopener noreferrer"><Icon name="chat" size={18} />تواصل معنا عبر واتساب</a>
      </nav>
    </div>
  );
}
