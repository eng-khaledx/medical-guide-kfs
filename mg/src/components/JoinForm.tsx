"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ATTACH_NOTE, DAYS, HOURS, LANDLINE_RE, MOBILE_RE, OTHER, SCHEDULE_NOTE_LABEL, fieldLabels, formatSchedule, isMapUrl, type JoinConfig, type JoinField } from "@/lib/join";
import { createWhatsAppUrl } from "@/lib/whatsapp";
import { GUIDE_CONTACT_NUMBER } from "@/lib/site";
import { trackEvent } from "@/lib/track";

const toLatin = (s: string) => s.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
const ATTACH_MESSAGE = "📎 هبعت في نفس الشات: صورة شخصية، صور العيادة، وصورة الشهادة أو كارنيه النقابة للتوثيق.";

export default function JoinForm({ config, areas, specialties = [] }: { config: JoinConfig; areas: { slug: string; name: string }[]; specialties?: string[] }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const renderedAt = useRef(0);
  useEffect(() => { renderedAt.current = Date.now(); }, []);
  const [otherSpecialty, setOtherSpecialty] = useState(false);
  const [geo, setGeo] = useState<{ busy: boolean; msg: string; ok?: boolean }>({ busy: false, msg: "" });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const errs: Record<string, string> = {};
    const data: Record<string, string> = {};
    for (const f of config.fields) {
      const [key, noteKey] = fieldLabels(f);
      let v = "", note = "";
      if (f.kind === "checkbox") v = fd.getAll(f.name).map(String).join("، ");
      else if (f.kind === "specialty") {
        const s = String(fd.get(f.name) ?? "");
        v = s === OTHER ? String(fd.get(`${f.name}_other`) ?? "").trim() : s;
        if (s === OTHER && !v) errs[f.name] = "اكتب التخصص";
      } else if (f.kind === "schedule") {
        const from = String(fd.get(`${f.name}_from`) ?? ""), to = String(fd.get(`${f.name}_to`) ?? "");
        v = formatSchedule(fd.getAll(`${f.name}_days`).map(String), from, to);
        note = String(fd.get(`${f.name}_note`) ?? "").trim();
        if (!from !== !to) errs[f.name] = "اختار وقت البداية والنهاية مع بعض";
      } else if (f.kind === "consent") v = fd.get(f.name) ? "موافق" : "";
      else v = String(fd.get(f.name) ?? "").trim();

      if (f.kind === "tel") v = toLatin(v).replace(/[\s-]/g, "");
      if (f.kind === "number") v = toLatin(v);
      if (f.kind === "area") v = areas.find((a) => a.slug === v)?.name ?? "";
      if (errs[f.name]) { /* خطأ محدد أعلاه */ }
      else if (f.required && !v) errs[f.name] = f.kind === "consent" ? "لازم توافق عشان نكمل" : "الحقل ده مطلوب";
      else if (f.kind === "tel" && v && !(MOBILE_RE.test(v) || (f.landline && LANDLINE_RE.test(v)))) errs[f.name] = f.landline ? "اكتب رقم موبايل أو أرضي صحيح" : "اكتب رقم موبايل صحيح (11 رقم يبدأ بـ 01)";
      else if (f.kind === "email" && v && !/^\S+@\S+\.\S+$/.test(v)) errs[f.name] = "الإيميل غير صحيح";
      else if (f.kind === "number" && v && !(/^\d+$/.test(v) && Number(v) <= (f.max ?? 60))) errs[f.name] = "اكتب رقم صحيح";
      else if (f.kind === "mapurl" && v && !isMapUrl(v)) errs[f.name] = "اكتب لينك من خرائط جوجل (google maps أو maps.app.goo.gl)";
      if (v) data[key] = v;
      if (note && noteKey) data[noteKey] = note;
    }
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      document.getElementById(`f-${first}`)?.focus();
      return;
    }
    const message = [
      `مرحبًا، أرغب في الانضمام إلى دليلك الطبي بكفرالشيخ (${config.role}).`, "",
      ...Object.entries(data).map(([k, val]) => `${k}: ${val}`),
      ...(config.attachNote ? ["", ATTACH_MESSAGE] : []),
    ].join("\n");
    // واتساب أولًا وبشكل متزامن داخل حدث الضغط حتى لا يمنعه المتصفح
    window.open(createWhatsAppUrl({ phone: GUIDE_CONTACT_NUMBER.whatsapp, message }), "_blank", "noopener,noreferrer");
    if (!String(fd.get("website") ?? "").trim()) trackEvent({ event: "join_submit", page: window.location.pathname });
    // الحفظ في الشيت في الخلفية؛ فشله لا يؤثر على واتساب
    try {
      void fetch("/api/join", {
        method: "POST", keepalive: true, headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: config.slug, fields: data, website: String(fd.get("website") ?? ""), elapsed: Date.now() - renderedAt.current }),
      }).catch(() => {});
    } catch { /* تجاهل */ }
  }

  function locateMe(id: string) {
    if (!("geolocation" in navigator)) { setGeo({ busy: false, msg: "المتصفح ده مش بيدعم تحديد الموقع. الصق لينك جوجل ماب بإيدك." }); return; }
    setGeo({ busy: true, msg: "بنحدد موقعك..." });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const input = document.getElementById(id) as HTMLInputElement | null;
        if (input) input.value = `https://www.google.com/maps?q=${pos.coords.latitude.toFixed(6)},${pos.coords.longitude.toFixed(6)}`;
        setGeo({ busy: false, ok: true, msg: "تم تحديد موقعك. راجع اللينك قبل الإرسال." });
      },
      (err) => setGeo({
        busy: false,
        msg: err.code === err.PERMISSION_DENIED ? "مقدرناش نوصل لموقعك لأنك رفضت الإذن. فعّل إذن الموقع للمتصفح أو الصق لينك جوجل ماب بإيدك."
          : err.code === err.TIMEOUT ? "تحديد الموقع أخد وقت طويل. جرّب تاني أو الصق اللينك بإيدك."
          : "الموقع غير متاح دلوقتي (تأكد إن الـGPS شغال). الصق لينك جوجل ماب بإيدك.",
      }),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  }

  function renderControl(f: JoinField, id: string, err?: string): React.ReactNode {
    const common = { id, name: f.name, "aria-invalid": !!err, "aria-describedby": err ? `${id}-err` : undefined };
    switch (f.kind) {
      case "select": case "area": case "specialty": {
        const opts = f.kind === "area" ? areas.map((a) => ({ v: a.slug, n: a.name }))
          : f.kind === "specialty" ? [...specialties, OTHER].map((o) => ({ v: o, n: o }))
          : ("options" in f ? f.options : []).map((o) => ({ v: o, n: o }));
        return (
          <>
            <select {...common} defaultValue="" onChange={f.kind === "specialty" ? (e) => setOtherSpecialty(e.target.value === OTHER) : undefined}>
              <option value="">اختر</option>{opts.map((o) => <option key={o.v} value={o.v}>{o.n}</option>)}
            </select>
            {f.kind === "specialty" && otherSpecialty && <input type="text" name={`${f.name}_other`} placeholder="اكتب تخصصك" maxLength={80} autoComplete="off" aria-label="التخصص" />}
          </>
        );
      }
      case "radio": case "checkbox":
        return (
          <div className="choices" role="group" aria-labelledby={`${id}-l`}>
            {f.options.map((o, i) => <label key={o} className="choice"><input id={i === 0 ? id : undefined} type={f.kind} name={f.name} value={o} />{o}</label>)}
          </div>
        );
      case "textarea":
        return <textarea {...common} rows={3} maxLength={500} placeholder={f.placeholder} />;
      case "schedule":
        return (
          <div className="schedule">
            <div className="choices" role="group" aria-label="الأيام">
              {DAYS.map((d, i) => <label key={d} className="choice"><input id={i === 0 ? id : undefined} type="checkbox" name={`${f.name}_days`} value={d} />{d}</label>)}
            </div>
            <div className="time-row">
              <label>من<select name={`${f.name}_from`} defaultValue=""><option value="">اختر</option>{HOURS.map((h) => <option key={h} value={h}>{h}</option>)}</select></label>
              <label>إلى<select name={`${f.name}_to`} defaultValue=""><option value="">اختر</option>{HOURS.map((h) => <option key={h} value={h}>{h}</option>)}</select></label>
            </div>
            <input type="text" name={`${f.name}_note`} placeholder={`${SCHEDULE_NOTE_LABEL}: مثال: الخميس بالحجز المسبق`} maxLength={200} autoComplete="off" aria-label={SCHEDULE_NOTE_LABEL} />
          </div>
        );
      case "consent":
        return <label className="choice consent"><input id={id} type="checkbox" name={f.name} value="1" aria-invalid={!!err} />{f.label}</label>;
      case "mapurl":
        return (
          <>
            <input {...common} type="url" dir="ltr" autoComplete="off" maxLength={300} placeholder="https://maps.app.goo.gl/..." />
            <button type="button" className="btn btn-ghost locate-btn" disabled={geo.busy} onClick={() => locateMe(id)}>📍 استخدم موقعي الحالي (وانت في العيادة)</button>
            {geo.msg && <p className={geo.ok ? "geo-msg geo-ok" : "geo-msg"} role="status">{geo.msg}</p>}
          </>
        );
      case "number":
        return <input {...common} type="text" inputMode="numeric" autoComplete="off" maxLength={8} />;
      default:
        return <input {...common} type={f.kind} inputMode={f.kind === "tel" ? "tel" : undefined}
          dir={f.kind === "tel" || f.kind === "email" ? "ltr" : undefined} placeholder={"placeholder" in f ? f.placeholder : undefined}
          autoComplete={f.kind === "tel" ? "tel" : "off"} maxLength={80} />;
    }
  }

  return (
    <form className="join-form panel" onSubmit={onSubmit} noValidate>
      <div className="hp" aria-hidden="true"><label>لا تملأ هذا الحقل<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label></div>
      {config.fields.map((f) => {
        const id = `f-${f.name}`, err = errors[f.name];
        const isGroup = f.kind === "radio" || f.kind === "checkbox" || f.kind === "schedule" || f.kind === "consent";
        return (
          <div key={f.name} className="field">
            {f.kind !== "consent" && <label id={`${id}-l`} htmlFor={isGroup ? undefined : id}>{f.label}{f.required && " *"}</label>}
            {renderControl(f, id, err)}
            {err && <p id={`${id}-err`} className="field-err" role="alert">{err}</p>}
          </div>
        );
      })}
      {config.attachNote && <p className="attach-note">📎 {ATTACH_NOTE}</p>}
      <button className="btn btn-wa" type="submit">إرسال عبر واتساب</button>
      <p className="muted small">هنحفظ <Link href="/privacy">بياناتك</Link> عندنا عشان نراجع الطلب، ومش هتظهر على الموقع غير بعد موافقتك. هنتواصل معاك خلال 48 ساعة.</p>
    </form>
  );
}
