export type ProviderType =
  | "DOCTOR" | "DENTAL_CLINIC" | "PHARMACY" | "LABORATORY"
  | "RADIOLOGY" | "MEDICAL_CENTER" | "HOSPITAL" | "PHYSIOTHERAPY";

export type Tint = "blue" | "cyan" | "green" | "pink" | "gold";

/** مقدم خدمة طبية. الحقل الفارغ يختفي من الموقع تلقائيًا. */
export interface Provider {
  id: string;
  slug: string; // يظهر في الرابط: /providers/slug (حروف إنجليزية وشرطات فقط)
  name: string;
  providerType: ProviderType;
  specialty?: string; // slug من data/specialties.ts
  specialties?: string[]; // تخصصات إضافية: يظهر الطبيب أيضًا في صفحاتها وبحثها (التخصص الرئيسي في specialty)
  title?: string; // اللقب العلمي، مثال: "أخصائي جراحة العظام"
  subspecialties?: string[]; // تخصصات دقيقة تظهر كشارات صغيرة
  description?: string;
  image?: string; // مثال: "/doctors/dr-name.jpg"
  logo?: string;
  phone?: string; // مثال: "01000000000"
  whatsapp?: string; // بالصيغة الدولية بدون +، مثال: "201000000000"
  city?: string;
  area?: string; // slug من data/areas.ts
  address?: string;
  workingHours?: string;
  consultationPrice?: string;
  services?: string[];
  offers?: string[];
  featured?: boolean;
  verified?: boolean;
  directionsUrl?: string; // رابط خرائط جوجل (https فقط)
  gallery?: string[];
  tags?: string[];
}

export interface Specialty { slug: string; name: string; icon: string; tint: Tint; keywords?: string /* كلمات بحث إضافية */ }
export interface Area { slug: string; name: string }
export interface Category { slug: string; type: ProviderType; name: string; title: string; icon: string; tint: Tint }

export interface Offer {
  id: string; slug: string; providerId: string; title: string; description?: string;
  image?: string; discountText?: string; startDate?: string; endDate?: string; active: boolean;
}

export interface Banner {
  id: string; title: string; subtitle?: string; image?: string; ctaText: string;
  ctaUrl?: string; // رابط داخلي مثل "/category/doctors"
  ctaWhatsAppMessage?: string; // لو موجودة يفتح واتساب برسالة جاهزة
  active: boolean; startDate?: string; endDate?: string; providerId?: string; offerId?: string;
}
