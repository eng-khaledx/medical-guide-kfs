import { Area, Banner, Category, Offer, Provider, ProviderType, Specialty } from "@/types";
import { specialties } from "@/data/specialties";
import { categories } from "@/data/categories";
import { areas } from "@/data/areas";
import { homeTiles } from "@/data/homeTiles";
import { offers } from "@/data/offers";
import { banners } from "@/data/banners";
import { doctors } from "@/data/doctors";
import { pharmacies } from "@/data/pharmacies";
import { laboratories } from "@/data/laboratories";
import { radiology } from "@/data/radiology";
import { medicalCenters } from "@/data/medicalCenters";
import { dentalClinics } from "@/data/dentalClinics";
import { hospitals } from "@/data/hospitals";
import { physiotherapy } from "@/data/physiotherapy";

// طبقة الوصول للبيانات: لاحقًا يمكن استبدال هذه الدوال باستعلامات قاعدة بيانات دون تغيير الواجهة.

export function getProviders(): Provider[] {
  return [...doctors, ...dentalClinics, ...pharmacies, ...laboratories, ...radiology, ...medicalCenters, ...hospitals, ...physiotherapy];
}
export const getDoctors = () => getProviders().filter((p) => p.providerType === "DOCTOR");
export const getProviderBySlug = (slug: string) => getProviders().find((p) => p.slug === slug);
export const getProviderById = (id: string) => getProviders().find((p) => p.id === id);
export const getFeaturedProviders = () => getProviders().filter((p) => p.featured);
export const getSpecialties = (): Specialty[] => specialties;
export const getSpecialty = (slug?: string) => specialties.find((s) => s.slug === slug);
export const getCategories = (): Category[] => categories;
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getAreas = (): Area[] => areas;
export const getArea = (slug?: string) => areas.find((a) => a.slug === slug);
export const getProvidersByType = (t: ProviderType) => getProviders().filter((p) => p.providerType === t);
export const getProvidersBySpecialty = (slug: string) =>
  getProviders().filter((p) => p.specialty === slug || p.specialties?.includes(slug));

const today = () => new Date().toISOString().slice(0, 10);
const inRange = (s?: string, e?: string) => (!s || today() >= s) && (!e || today() <= e);

export const getActiveOffers = (): Offer[] =>
  offers.filter((o) => o.active && inRange(o.startDate, o.endDate) && getProviderById(o.providerId));
export const getActiveBanners = (): Banner[] => banners.filter((b) => b.active && inRange(b.startDate, b.endDate));

export const typeLabel: Record<ProviderType, string> = {
  DOCTOR: "طبيب", DENTAL_CLINIC: "عيادة أسنان", PHARMACY: "صيدلية", LABORATORY: "معمل تحاليل",
  RADIOLOGY: "مركز أشعة", MEDICAL_CENTER: "مركز طبي", HOSPITAL: "مستشفى", PHYSIOTHERAPY: "علاج طبيعي",
};
const typeKeywords: Record<ProviderType, string> = {
  DOCTOR: "دكتور دكاتره طبيب اطباء عيادة", DENTAL_CLINIC: "اسنان عيادة دكتور طبيب",
  PHARMACY: "صيدليه صيدليات دواء ادويه", LABORATORY: "معمل معامل تحاليل تحليل",
  RADIOLOGY: "اشعه مركز اشعه سونار رنين", MEDICAL_CENTER: "مركز مراكز طبي طبيه",
  HOSPITAL: "مستشفي مستشفيات", PHYSIOTHERAPY: "علاج طبيعي تاهيل",
};

export function normalizeArabic(s: string) {
  return s.toLowerCase().replace(/[\u064B-\u0652\u0640]/g, "").replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/\s+/g, " ").trim();
}

// كلمات البحث: الاسم، التخصص (الرئيسي والإضافي) وكلماته، اللقب، التخصصات الدقيقة، نوع مقدم الخدمة، واسم المنطقة.
// لا يُبحث في النبذة أو العنوان التفصيلي. تُحذف "ال/وال/بال/لل" ثم حرف ب/و/ل واحد من أول كل كلمة قبل المطابقة.
// المطابقة بالكلمة: كلمة قصيرة (3 أحرف أو أقل) تطابق الكلمة كاملة، والأطول تطابق بداية الكلمة.
const stripAl = (w: string) => {
  for (const pre of ["وال", "بال", "لل", "ال"]) if (w.startsWith(pre) && w.length - pre.length >= 2) { w = w.slice(pre.length); break; }
  // حرف جر/عطف واحد (ب/و/ل) بشرط بقاء 3 أحرف على الأقل، فتتساوى "ولادة" و"الولادة" و"بكلية" و"كلية"
  return /^[بول]/.test(w) && w.length - 1 >= 3 ? w.slice(1) : w;
};
const words = (s: string) => normalizeArabic(s).replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean).map(stripAl);
const wordMatches = (word: string, token: string) => (token.length <= 3 ? word === token : word.startsWith(token));

/** مجموعات الكلمات حسب أولوية الصلة: 0 التخصص الرئيسي، 1 التخصصات الإضافية، 2 اللقب والتخصصات الدقيقة، 3 الاسم/النوع/المنطقة. */
function searchGroups(p: Provider): string[][] {
  const spWords = (slug?: string) => words(`${getSpecialty(slug)?.name ?? ""} ${getSpecialty(slug)?.keywords ?? ""}`);
  return [
    spWords(p.specialty),
    (p.specialties ?? []).flatMap(spWords),
    words([p.title ?? "", ...(p.subspecialties ?? [])].join(" ")),
    words([p.name, typeLabel[p.providerType], typeKeywords[p.providerType], getArea(p.area)?.name ?? ""].join(" ")),
  ];
}

export interface SearchFilters { q?: string; area?: string; type?: string; specialty?: string; featured?: boolean }

export function searchProviders(f: SearchFilters): Provider[] {
  let list = getProviders();
  if (f.type) list = list.filter((p) => p.providerType === f.type);
  if (f.area) list = list.filter((p) => p.area === f.area);
  if (f.specialty) list = list.filter((p) => p.specialty === f.specialty || p.specialties?.includes(f.specialty!));
  if (f.featured) list = list.filter((p) => p.featured);
  const tokens = words((f.q ?? "").slice(0, 80));
  const feat = (p: Provider) => Number(!!p.featured);
  if (!tokens.length) return [...list].sort((a, b) => feat(b) - feat(a));
  // مستوى الصلة = أسوأ مستوى تطابقت عنده كلمات البحث (أقل رقم = أفضل)؛ ثم المميز؛ ثم الترتيب الحالي (الفرز مستقر)
  const ranked: { p: Provider; level: number }[] = [];
  for (const p of list) {
    const groups = searchGroups(p);
    let level = 0;
    let ok = true;
    for (const t of tokens) {
      const g = groups.findIndex((w) => w.some((x) => wordMatches(x, t)));
      if (g < 0) { ok = false; break; }
      level = Math.max(level, g);
    }
    if (ok) ranked.push({ p, level });
  }
  return ranked.sort((a, b) => a.level - b.level || feat(b.p) - feat(a.p)).map((r) => r.p);
}

function allTiles() {
  const cat = (s: string) => categories.find((c) => c.slug === s)!;
  const sp = (s: string) => specialties.find((c) => c.slug === s)!;
  const tile = (x: { name: string; icon: string; tint: string }, href: string) => ({ label: x.name, icon: x.icon, tint: x.tint, href });
  return { cat, sp, tile };
}

/** كل الأقسام (صفحة /specialties). */
export function getAllTiles() {
  const { cat, sp, tile } = allTiles();
  return [
    tile(cat("doctors"), "/category/doctors"), tile(cat("dental-clinics"), "/category/dental-clinics"),
    ...["pediatrics", "internal-medicine", "dermatology", "obstetrics-gynecology", "orthopedics", "ent", "ophthalmology", "cardiology", "neurology", "chest-diseases", "family-medicine", "psychiatry", "general-surgery", "pediatric-surgery", "surgical-oncology", "urology"]
      .map((s) => tile(sp(s), `/specialties/${s}`)),
    tile(cat("physiotherapy"), "/category/physiotherapy"), tile(cat("pharmacies"), "/category/pharmacies"),
    tile(cat("laboratories"), "/category/laboratories"), tile(cat("radiology"), "/category/radiology"),
    tile(cat("medical-centers"), "/category/medical-centers"), tile(cat("hospitals"), "/category/hospitals"),
  ];
}

/** أقسام الرئيسية: القائمة في data/homeTiles.ts. */
export function getHomeTiles() {
  const { cat, sp, tile } = allTiles();
  return homeTiles.map((t) =>
    t.spec ? { ...tile(sp(t.spec), `/specialties/${t.spec}`), extra: t.extra } : { ...tile(cat(t.cat!), `/category/${t.cat}`), extra: t.extra });
}

// روابط مباشرة لأقسام بها مقدمو خدمة (غيّرها عند إضافة أقسام جديدة)
export const popularSearches = [
  { label: "دكتور أطفال", href: "/specialties/pediatrics" }, { label: "جلدية", href: "/specialties/dermatology" },
  { label: "باطنة", href: "/specialties/internal-medicine" }, { label: "عظام", href: "/specialties/orthopedics" },
  { label: "نساء وتوليد", href: "/specialties/obstetrics-gynecology" }, { label: "عيون", href: "/specialties/ophthalmology" },
  { label: "مسالك بولية", href: "/specialties/urology" },
];
