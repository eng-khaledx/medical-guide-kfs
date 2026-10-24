import { Category } from "@/types";

// أقسام حسب نوع مقدم الخدمة: /category/<slug>
export const categories: Category[] = [
  { slug: "doctors", type: "DOCTOR", name: "أطباء", title: "أطباء كفرالشيخ", icon: "user", tint: "blue" },
  { slug: "dental-clinics", type: "DENTAL_CLINIC", name: "عيادات أسنان", title: "عيادات أسنان كفرالشيخ", icon: "smile", tint: "green" },
  { slug: "pharmacies", type: "PHARMACY", name: "صيدليات", title: "صيدليات كفرالشيخ", icon: "pill", tint: "green" },
  { slug: "laboratories", type: "LABORATORY", name: "معامل تحاليل", title: "معامل تحاليل كفرالشيخ", icon: "flask", tint: "cyan" },
  { slug: "radiology", type: "RADIOLOGY", name: "أشعة", title: "مراكز أشعة كفرالشيخ", icon: "scan", tint: "blue" },
  { slug: "medical-centers", type: "MEDICAL_CENTER", name: "مراكز طبية", title: "مراكز طبية كفرالشيخ", icon: "building", tint: "gold" },
  { slug: "hospitals", type: "HOSPITAL", name: "مستشفيات", title: "مستشفيات كفرالشيخ", icon: "hospital", tint: "pink" },
  { slug: "physiotherapy", type: "PHYSIOTHERAPY", name: "علاج طبيعي", title: "مراكز علاج طبيعي كفرالشيخ", icon: "activity", tint: "green" },
];
