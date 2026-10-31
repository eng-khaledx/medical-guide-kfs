import { categories } from "@/data/categories";
import { getArea, getSpecialty } from "./data";

interface Filters { q: string; area: string; type: string; specialty: string }

/** عنوان صفحة البحث حسب الفلاتر الفعالة (يُستخدم للـ H1 والـ title والوصف). */
export function searchHeading({ q, area, type, specialty }: Filters) {
  const inArea = getArea(area) ? ` في ${getArea(area)!.name}` : "";
  if (q) return `نتايج البحث عن «${q}»${inArea}`;
  const spec = getSpecialty(specialty)?.name;
  if (spec) return `أطباء ${spec}${inArea}`;
  const cat = categories.find((c) => c.type === type);
  if (cat) return `${cat.name}${inArea}`;
  return inArea ? `مقدمو الخدمة${inArea}` : "كل مقدمي الخدمة";
}

/** سطر العدد بالمفرد/المثنى/الجمع الصحيح: "طبيب واحد"، "طبيبان"، "3 أطباء"، "11 طبيبًا"؛ وللأنواع المختلطة "نتيجة/نتائج". */
export function resultCount(n: number, doctors: boolean) {
  if (n === 0) return doctors ? "لا يوجد أطباء" : "لا توجد نتائج";
  const [one, two, few, many] = doctors ? ["طبيب واحد", "طبيبان", "أطباء", "طبيبًا"] : ["نتيجة واحدة", "نتيجتان", "نتائج", "نتيجة"];
  if (n === 1) return one;
  if (n === 2) return two;
  return `${n} ${n <= 10 ? few : many}`;
}
