export type JoinField =
  | { name: string; label: string; kind: "text" | "tel" | "email" | "number"; required?: boolean; placeholder?: string }
  | { name: string; label: string; kind: "area"; required?: boolean }
  | { name: string; label: string; kind: "select" | "radio" | "checkbox"; options: string[]; required?: boolean };

export interface JoinConfig { slug: string; role: string; title: string; intro: string; fields: JoinField[] }

const name = (label: string): JoinField => ({ name: "name", label, kind: "text", required: true });
const mobile: JoinField = { name: "mobile", label: "الموبايل", kind: "tel", required: true, placeholder: "01xxxxxxxxx" };
const area: JoinField = { name: "area", label: "المنطقة", kind: "area" };

export const joinConfigs: Record<string, JoinConfig> = {
  doctor: {
    slug: "doctor", role: "طبيب", title: "انضم كطبيب", intro: "سجّل بياناتك وهنتواصل معاك على واتساب لإضافتك للدليل.",
    fields: [name("الاسم"), { name: "specialty", label: "التخصص", kind: "text" }, mobile, area, { name: "clinic", label: "اسم العيادة (اختياري)", kind: "text" }],
  },
  lab: {
    slug: "lab", role: "معمل", title: "انضم كمعمل", intro: "سجّل بيانات المعمل وهنتواصل معاك على واتساب.",
    fields: [name("اسم المعمل"), { name: "contact", label: "اسم المسؤول", kind: "text" }, mobile, area, { name: "address", label: "العنوان (اختياري)", kind: "text" }],
  },
  center: {
    slug: "center", role: "مركز", title: "انضم كمركز", intro: "للمراكز الطبية والأشعة والعيادات المتخصصة.",
    fields: [name("اسم المركز"), { name: "centerType", label: "نوع المركز", kind: "select", options: ["مركز طبي", "مركز أشعة", "مركز أسنان", "مركز علاج طبيعي", "أخرى"] }, { name: "contact", label: "اسم المسؤول", kind: "text" }, mobile, area],
  },
  nurse: {
    slug: "nurse", role: "ممرض/ممرضة", title: "انضم كممرض/ممرضة", intro: "سجّل بياناتك وهنتواصل معاك على واتساب.",
    fields: [
      name("الاسم"),
      { name: "gender", label: "النوع", kind: "radio", options: ["ممرض", "ممرضة"] },
      mobile, area,
      { name: "experience", label: "سنين الخبرة (اختياري)", kind: "number" },
      { name: "services", label: "الخدمات", kind: "checkbox", options: ["حقن ومحاليل", "غيار على الجروح", "رعاية مسنين", "رعاية بعد العمليات", "أخرى"] },
      { name: "home", label: "متاح لزيارات منزلية؟", kind: "radio", options: ["نعم", "لا"] },
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

export const joinLinks = [
  { href: "/join/doctor", label: "انضم كطبيب" },
  { href: "/join/lab", label: "انضم كمعمل" },
  { href: "/join/center", label: "انضم كمركز" },
  { href: "/join/nurse", label: "انضم كممرض/ممرضة" },
  { href: "/join/company", label: "انضم إلينا كشركة" },
  { href: "/jobs", label: "وظائف" },
];
