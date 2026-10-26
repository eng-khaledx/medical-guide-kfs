/** showIf: يظهر الحقل فقط لما حقل select آخر (باسمه) يساوي قيمة معينة. allow24: حقل المواعيد يقبل "شغال 24 ساعة". */
interface FieldExtras { showIf?: { field: string; value?: string; gt?: number }; allow24?: boolean; defaultValue?: string }
export type JoinField = FieldExtras &
(
  | { name: string; label: string; kind: "text" | "email"; required?: boolean; placeholder?: string }
  | { name: string; label: string; kind: "tel"; required?: boolean; placeholder?: string; landline?: boolean }
  | { name: string; label: string; kind: "number"; required?: boolean; max?: number }
  | { name: string; label: string; kind: "textarea" | "mapurl" | "area" | "areas" | "specialty" | "schedule" | "consent"; required?: boolean; placeholder?: string }
  | { name: string; label: string; kind: "select" | "radio" | "checkbox"; options: string[]; required?: boolean });

/** attach: نص تنبيه الصور وسطر رسالة واتساب لنماذج غير الطبيب (الطبيب يستخدم attachNote). */
export interface JoinConfig { slug: string; role: string; title: string; intro: string; fields: JoinField[]; attachNote?: boolean; attach?: { note: string; message: string } }

export const OTHER = "أخرى";
export const DAYS = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];
export const HOURS = ["6ص", "7ص", "8ص", "9ص", "10ص", "11ص", "12م", "1م", "2م", "3م", "4م", "5م", "6م", "7م", "8م", "9م", "10م", "11م", "12ص"];
export const CONSENT_LABEL = "الموافقة على عرض البيانات";
export const SCHEDULE_NOTE_LABEL = "ملاحظات المواعيد";
export const ATTACH_NOTE = "بعد ما الواتساب يفتح، ابعت في نفس الشات: صورة شخصية، صور العيادة، وصورة الشهادة أو كارنيه النقابة للتوثيق.";

/** مفاتيح الأعمدة التي ينتجها الحقل (حقل المواعيد ينتج عمودين). */
export const fieldLabels = (f: JoinField) => (f.kind === "schedule" ? [cleanLabel(f.label), SCHEDULE_NOTE_LABEL] : f.kind === "consent" ? [CONSENT_LABEL] : [cleanLabel(f.label)]);

/** سطر واحد مقروء للأيام والمواعيد: "السبت، الاثنين — 5م إلى 10م". */
export function formatSchedule(days: string[], from: string, to: string) {
  const d = DAYS.filter((x) => days.includes(x)).join("، ");
  const t = from && to ? `${from} إلى ${to}` : "";
  return [d, t].filter(Boolean).join(" — ");
}

export const LANDLINE_RE = /^0[2-9]\d{7,8}$/;
/** روابط خرائط جوجل فقط: https وأحد النطاقات المسموحة (google.com/maps، goo.gl/maps، maps.app.goo.gl). */
export function isMapUrl(s: string) {
  let u: URL;
  try { u = new URL(s); } catch { return false; }
  if (u.protocol !== "https:") return false;
  const host = u.hostname.replace(/^www\./, "");
  if (host === "maps.app.goo.gl") return u.pathname.length > 1;
  if (host === "goo.gl") return u.pathname.startsWith("/maps");
  if (host === "maps.google.com") return true;
  return (host === "google.com" || host === "google.com.eg") && u.pathname.startsWith("/maps");
}

const name = (label: string): JoinField => ({ name: "name", label, kind: "text", required: true });
const mobile: JoinField = { name: "mobile", label: "الموبايل", kind: "tel", required: true, placeholder: "01xxxxxxxxx" };
const area: JoinField = { name: "area", label: "المنطقة", kind: "area" };

const placeAttach = {
  note: "بعد ما الواتساب يفتح، ابعت في نفس الشات: صور المكان وصورة الترخيص للتوثيق.",
  message: "📎 هبعت في نفس الشات: صور المكان وصورة الترخيص للتوثيق.",
};
/** الحقول المشتركة بين المعمل والمركز بعد "النوع" وقبل الحقول الخاصة بكل نوع. */
const placeCommon: JoinField[] = [
  { name: "contact", label: "اسم المسؤول", kind: "text", required: true },
  mobile,
  { name: "landline", label: "رقم التليفون الأرضي / رقم الحجز (اختياري)", kind: "tel", landline: true, placeholder: "موبايل أو أرضي" },
  { ...area, required: true },
  { name: "address", label: "العنوان بالتفصيل", kind: "textarea", required: true, placeholder: "الشارع، أقرب علامة مميزة، الدور" },
  { name: "branches", label: "عدد الفروع (اختياري)", kind: "number", max: 50, defaultValue: "1" },
  { name: "otherBranches", label: "عناوين الفروع التانية (اختياري)", kind: "textarea", placeholder: "كل فرع في سطر: المنطقة - العنوان", showIf: { field: "branches", gt: 1 } },
  { name: "mapUrl", label: "لينك جوجل ماب (اختياري)", kind: "mapurl" },
  { name: "schedule", label: "مواعيد العمل (اختياري)", kind: "schedule", allow24: true },
  { name: "services", label: "الخدمات (اختياري)", kind: "text", placeholder: "مثال: تحاليل دم، سونار، أشعة عادية" },
];
const placeTail: JoinField[] = [
  { name: "email", label: "الإيميل (اختياري)", kind: "email" },
  { name: "source", label: "عرفتنا منين؟ (اختياري)", kind: "select", options: ["فيسبوك", "واتساب", "صديق", "دكتور زميل", "أخرى"] },
  { name: "consent", label: "أوافق على عرض بيانات المكان (الاسم، النوع، العنوان، أرقام التواصل، المواعيد) على دليلك الطبي", kind: "consent", required: true },
];

export const joinConfigs: Record<string, JoinConfig> = {
  doctor: {
    slug: "doctor", role: "طبيب", title: "انضم كطبيب", intro: "سجّل بياناتك وهنتواصل معاك على واتساب لإضافتك للدليل.",
    attachNote: true,
    fields: [
      name("الاسم"),
      { name: "gender", label: "دكتور / دكتورة", kind: "radio", required: true, options: ["دكتور", "دكتورة"] },
      { name: "rank", label: "اللقب", kind: "select", required: true, options: ["ممارس عام", "أخصائي", "استشاري", "مدرس / أستاذ مساعد", "أستاذ"] },
      { name: "specialty", label: "التخصص", kind: "specialty", required: true },
      { name: "subspecialty", label: "التخصص الدقيق (اختياري)", kind: "text" },
      { ...mobile, label: "الموبايل الشخصي" },
      { name: "email", label: "الإيميل (اختياري)", kind: "email" },
      { name: "clinicPhone", label: "رقم العيادة للحجز (اختياري)", kind: "tel", landline: true, placeholder: "موبايل أو أرضي" },
      { ...area, required: true },
      { name: "address", label: "العنوان بالتفصيل", kind: "textarea", required: true, placeholder: "الشارع، أقرب علامة مميزة، الدور" },
      { name: "mapUrl", label: "لينك جوجل ماب (اختياري)", kind: "mapurl" },
      { name: "serviceType", label: "نوع الخدمة", kind: "checkbox", required: true, options: ["كشف في العيادة", "زيارة منزلية", "استشارة أونلاين"] },
      { name: "schedule", label: "أيام ومواعيد العمل (اختياري)", kind: "schedule" },
      { name: "price", label: "سعر الكشف (اختياري)", kind: "number", max: 100000 },
      { name: "source", label: "عرفتنا منين؟ (اختياري)", kind: "select", options: ["فيسبوك", "واتساب", "صديق", "دكتور زميل", "أخرى"] },
      { name: "consent", label: "أوافق على عرض بياناتي المهنية (الاسم، التخصص، العنوان، رقم العيادة، المواعيد) على دليلك الطبي", kind: "consent", required: true },
    ],
  },
  lab: {
    slug: "lab", role: "معمل", title: "انضم كمعمل", intro: "سجّل بيانات المعمل أو مركز الأشعة وهنتواصل معاك على واتساب.",
    attach: placeAttach,
    fields: [
      name("اسم المكان"),
      { name: "placeType", label: "النوع", kind: "select", required: true, options: ["معمل تحاليل", "مركز أشعة", "تحاليل وأشعة"] },
      ...placeCommon,
      { name: "homeSampling", label: "سحب عينات من البيت؟", kind: "radio", options: ["نعم", "لا"] },
      { name: "onlineResults", label: "نتايج أونلاين؟", kind: "radio", options: ["نعم", "لا"] },
      ...placeTail,
    ],
  },
  center: {
    slug: "center", role: "مركز", title: "انضم كمركز", intro: "للمراكز الطبية والمستشفيات والصيدليات.",
    attach: placeAttach,
    fields: [
      name("اسم المكان"),
      { name: "placeType", label: "النوع", kind: "select", required: true, options: ["مركز طبي", "مستشفى", "صيدلية", "أخرى"] },
      ...placeCommon,
      { name: "delivery", label: "توصيل للبيت؟", kind: "radio", options: ["نعم", "لا"], showIf: { field: "placeType", value: "صيدلية" } },
      ...placeTail,
    ],
  },
  nurse: {
    slug: "nurse", role: "ممرض/ممرضة", title: "انضم كممرض/ممرضة", intro: "سجّل بياناتك وهنتواصل معاك على واتساب.",
    attach: { note: "ابعت في نفس الشات: صورة شخصية وصورة كارنيه نقابة التمريض للتوثيق.", message: "📎 ابعت في نفس الشات: صورة شخصية وصورة كارنيه نقابة التمريض للتوثيق." },
    fields: [
      name("الاسم"),
      { name: "gender", label: "النوع", kind: "radio", options: ["ممرض", "ممرضة"] },
      { name: "qualification", label: "المؤهل", kind: "select", required: true, options: ["دبلوم تمريض", "معهد فني تمريض", "بكالوريوس تمريض", "أخرى"] },
      mobile, area,
      { name: "coverage", label: "المناطق اللي تقدر تروحها", kind: "areas", required: true },
      { name: "experience", label: "سنين الخبرة (اختياري)", kind: "number" },
      { name: "services", label: "الخدمات", kind: "checkbox", options: ["حقن ومحاليل", "غيار على الجروح", "رعاية مسنين", "رعاية بعد العمليات", "أخرى"] },
      { name: "home", label: "متاح لزيارات منزلية؟", kind: "radio", options: ["نعم", "لا"] },
      { name: "availability", label: "المواعيد المتاحة (اختياري)", kind: "checkbox", options: ["صباحي", "مسائي", "ليلي", "24 ساعة / إقامة"] },
      { name: "email", label: "الإيميل (اختياري)", kind: "email" },
      { name: "source", label: "عرفتنا منين؟ (اختياري)", kind: "select", options: ["فيسبوك", "واتساب", "صديق", "دكتور زميل", "أخرى"] },
      { name: "consent", label: "أوافق على عرض بياناتي المهنية (الاسم، التخصص، العنوان، رقم العيادة، المواعيد) على دليلك الطبي", kind: "consent", required: true },
    ],
  },
  company: {
    slug: "company", role: "شركة", title: "انضم إلينا كشركة", intro: "لشركات الأدوية والمستلزمات الطبية والتأمين الطبي.",
    fields: [
      name("اسم الشركة"),
      { name: "companyType", label: "نوع الشركة", kind: "select", required: true, options: ["شركة أدوية", "مستلزمات طبية", "تأمين طبي", "أخرى"] },
      { name: "contact", label: "اسم المسؤول", kind: "text", required: true },
      mobile,
      { name: "email", label: "الإيميل (اختياري)", kind: "email" },
      { name: "cooperation", label: "نوع التعاون المطلوب (اختياري)", kind: "text" },
    ],
  },
};

export const cleanLabel = (label: string) => label.replace(/ \(اختياري\)$/, "");
export const MOBILE_RE = /^01[0125]\d{8}$/;
export const MAX_FIELD_LENGTH = 200;
export const MAX_TEXT_LENGTH = 500;

/** اسم الورقة في Google Sheets لكل نموذج. */
export const sheetNames: Record<string, string> = { doctor: "أطباء", lab: "معامل", center: "مراكز", nurse: "تمريض", company: "شركات" };

/** تحقق من جسم الطلب؛ يرجع الحقول المنظفة أو رسالة خطأ. المفاتيح هي أسماء الحقول بالعربية بدون "(اختياري)". */
export function validateJoin(type: unknown, fields: unknown): { ok: true; fields: Record<string, string> } | { ok: false; error: string } {
  const config = typeof type === "string" && Object.hasOwn(joinConfigs, type) ? joinConfigs[type] : undefined;
  if (!config) return { ok: false, error: "unknown type" };
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) return { ok: false, error: "bad fields" };
  const input = fields as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const f of config.fields) {
    const [label, extra] = fieldLabels(f);
    const get = (k: string) => {
      const raw = input[k];
      if (raw !== undefined && typeof raw !== "string") return null;
      return typeof raw === "string" ? raw.trim() : "";
    };
    const v = get(label), note = extra ? get(extra) : "";
    if (v === null || note === null) return { ok: false, error: `bad value: ${label}` };
    const max = f.kind === "textarea" || f.kind === "schedule" ? MAX_TEXT_LENGTH : MAX_FIELD_LENGTH;
    if (v.length > max || note.length > MAX_FIELD_LENGTH) return { ok: false, error: `too long: ${label}` };
    if (f.required && !f.showIf && !v) return { ok: false, error: `required: ${label}` };
    if (v && f.kind === "tel" && !(MOBILE_RE.test(v) || (f.landline && LANDLINE_RE.test(v)))) return { ok: false, error: `bad phone: ${label}` };
    if (v && f.kind === "email" && !/^\S+@\S+\.\S+$/.test(v)) return { ok: false, error: `bad email: ${label}` };
    if (v && f.kind === "mapurl" && !isMapUrl(v)) return { ok: false, error: `bad map link: ${label}` };
    if (v && f.kind === "number" && !(/^\d+$/.test(v) && Number(v) <= (f.max ?? 60))) return { ok: false, error: `bad number: ${label}` };
    if (v) out[label] = v;
    if (note && extra) out[extra] = note;
  }
  return { ok: true, fields: out };
}

export const joinLinks = [
  { href: "/join/doctor", label: "انضم كطبيب" },
  { href: "/join/lab", label: "انضم كمعمل" },
  { href: "/join/center", label: "انضم كمركز" },
  { href: "/join/nurse", label: "انضم كممرض/ممرضة" },
  { href: "/join/company", label: "انضم إلينا كشركة" },
  { href: "/jobs", label: "وظائف" },
];
