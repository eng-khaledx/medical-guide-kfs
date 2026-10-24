// أقسام الصفحة الرئيسية بالترتيب. عدّل هذه القائمة فقط لتغيير الأقسام الظاهرة.
// spec = تخصص (data/specialties.ts) أو cat = قسم حسب النوع (data/categories.ts).
// extra: true = يظهر على الشاشات الكبيرة فقط (التاسع يكمل صفًا من 5 مع العاشر).
export const homeTiles: { spec?: string; cat?: string; extra?: boolean }[] = [
  { spec: "internal-medicine" },
  { spec: "pediatrics" },
  { spec: "obstetrics-gynecology" },
  { spec: "orthopedics" },
  { spec: "dermatology" },
  { spec: "ent" },
  { spec: "neurology" },
  { spec: "general-surgery" },
  { spec: "psychiatry" },
  { spec: "surgical-oncology", extra: true },
];
