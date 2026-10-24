import { Specialty } from "@/types";

// أضف تخصصًا جديدًا هنا وستظهر صفحته تلقائيًا: /specialties/<slug>
export const specialties: Specialty[] = [
  { slug: "pediatrics", name: "أطفال", icon: "baby", tint: "gold" },
  { slug: "internal-medicine", name: "باطنة", icon: "stethoscope", tint: "cyan" },
  { slug: "dermatology", name: "جلدية", icon: "droplet", tint: "pink" },
  { slug: "dentistry", name: "أسنان", icon: "tooth", tint: "green" },
  { slug: "obstetrics-gynecology", name: "نساء وتوليد", icon: "venus", tint: "pink" },
  { slug: "orthopedics", name: "عظام", icon: "bone", tint: "blue" },
  { slug: "ent", name: "أنف وأذن", icon: "ear", tint: "green" },
  { slug: "ophthalmology", name: "عيون", icon: "eye", tint: "cyan" },
  { slug: "cardiology", name: "قلب", icon: "heart", tint: "pink" },
  { slug: "neurology", name: "مخ وأعصاب", icon: "brain", tint: "blue" },
  { slug: "chest-diseases", name: "صدر وجهاز تنفسي", icon: "lungs", tint: "cyan" },
  { slug: "family-medicine", name: "طب الأسرة", icon: "users", tint: "gold" },
  { slug: "psychiatry", name: "نفسي", icon: "chat", tint: "pink" },
  { slug: "general-surgery", name: "جراحة عامة", icon: "scalpel", tint: "cyan" },
  { slug: "pediatric-surgery", name: "جراحة أطفال", icon: "bandage", tint: "green" },
  { slug: "surgical-oncology", name: "جراحة أورام", icon: "ribbon", tint: "pink" },
  { slug: "urology", name: "مسالك بولية وذكورة", icon: "kidney", tint: "blue", keywords: "مسالك ذكورة بروستاتا كلى حصوات عقم رجال" },
];
