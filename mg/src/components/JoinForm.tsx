"use client";
import { useState } from "react";
import type { JoinConfig } from "@/lib/join";
import { createWhatsAppUrl } from "@/lib/whatsapp";
import { GUIDE_CONTACT_NUMBER } from "@/lib/site";

const MOBILE_RE = /^01[0125]\d{8}$/;
const toLatin = (s: string) => s.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));

export default function JoinForm({ config, areas }: { config: JoinConfig; areas: { slug: string; name: string }[] }) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const errs: Record<string, string> = {};
    const lines: string[] = [];
    for (const f of config.fields) {
      let v = f.kind === "checkbox" ? fd.getAll(f.name).map(String).join("، ") : String(fd.get(f.name) ?? "").trim();
      if (f.kind === "tel") v = toLatin(v).replace(/[\s-]/g, "");
      if (f.kind === "number") v = toLatin(v);
      if (f.kind === "area") v = areas.find((a) => a.slug === v)?.name ?? "";
      if (f.required && !v) errs[f.name] = "الحقل ده مطلوب";
      else if (f.kind === "tel" && v && !MOBILE_RE.test(v)) errs[f.name] = "اكتب رقم موبايل صحيح (11 رقم يبدأ بـ 01)";
      else if (f.kind === "email" && v && !/^\S+@\S+\.\S+$/.test(v)) errs[f.name] = "الإيميل غير صحيح";
      else if (f.kind === "number" && v && !(Number(v) >= 0 && Number(v) <= 60)) errs[f.name] = "اكتب رقم صحيح";
      if (v) lines.push(`${f.label.replace(/ \(اختياري\)$/, "")}: ${v}`);
    }
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      document.getElementById(`f-${first}`)?.focus();
      return;
    }
    const message = [`مرحبًا، أرغب في الانضمام إلى دليلك الطبي بكفرالشيخ (${config.role}).`, "", ...lines].join("\n");
    window.open(createWhatsAppUrl({ phone: GUIDE_CONTACT_NUMBER.whatsapp, message }), "_blank", "noopener,noreferrer");
  }

  return (
    <form className="join-form panel" onSubmit={onSubmit} noValidate>
      {config.fields.map((f) => {
        const id = `f-${f.name}`, err = errors[f.name];
        const common = { id, name: f.name, "aria-invalid": !!err, "aria-describedby": err ? `${id}-err` : undefined };
        let control: React.ReactNode;
        if (f.kind === "select" || f.kind === "area") {
          const opts = f.kind === "area" ? areas.map((a) => ({ v: a.slug, n: a.name })) : f.options.map((o) => ({ v: o, n: o }));
          control = <select {...common} defaultValue=""><option value="">اختر</option>{opts.map((o) => <option key={o.v} value={o.v}>{o.n}</option>)}</select>;
        } else if (f.kind === "radio" || f.kind === "checkbox") {
          control = (
            <div className="choices" role="group" aria-labelledby={`${id}-l`}>
              {f.options.map((o) => <label key={o} className="choice"><input type={f.kind} name={f.name} value={o} />{o}</label>)}
            </div>
          );
        } else {
          control = <input {...common} type={f.kind === "number" ? "text" : f.kind} inputMode={f.kind === "tel" || f.kind === "number" ? "numeric" : undefined}
            dir={f.kind === "tel" || f.kind === "email" ? "ltr" : undefined} placeholder={"placeholder" in f ? f.placeholder : undefined}
            autoComplete={f.kind === "tel" ? "tel" : "off"} maxLength={80} />;
        }
        return (
          <div key={f.name} className="field">
            <label id={`${id}-l`} htmlFor={f.kind === "radio" || f.kind === "checkbox" ? undefined : id}>{f.label}{f.required && " *"}</label>
            {control}
            {err && <p id={`${id}-err`} className="field-err" role="alert">{err}</p>}
          </div>
        );
      })}
      <button className="btn btn-wa" type="submit">إرسال عبر واتساب</button>
      <p className="muted small">هيتفتح واتساب برسالة جاهزة، راجعها وابعتها. مفيش بيانات بتتخزن على الموقع.</p>
    </form>
  );
}
