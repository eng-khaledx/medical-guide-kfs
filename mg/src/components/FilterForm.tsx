"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { showFeatured } from "@/lib/site";

interface Opt { value: string; name: string }
interface Props { q: string; type: string; specialty: string; area: string; featured: boolean; types: Opt[]; specialties: Opt[]; areas: Opt[] }

export default function FilterForm({ q, type, specialty, area, featured, types, specialties, areas }: Props) {
  const router = useRouter();
  const active = !!(type || specialty || area || featured);
  // الحالة تأتي دائماً من عنوان الصفحة؛ الـ key يعيد بناء الحقول عند تغيّره حتى لا يعيد المتصفح قيماً قديمة
  const key = [q, type, specialty, area, featured].join("|");

  function apply(form: HTMLFormElement) {
    const params = new URLSearchParams();
    for (const [k, v] of new FormData(form)) if (typeof v === "string" && v) params.set(k, v);
    const qs = params.toString();
    router.push(qs ? `/search?${qs}` : "/search");
  }

  return (
    <form key={key} className="filters" action="/search" method="get" autoComplete="off" onChange={(e) => apply(e.currentTarget)}>
      <input type="hidden" name="q" value={q} />
      <label>نوع الخدمة
        <select name="type" defaultValue={type}>
          <option value="">الكل</option>
          {types.map((o) => <option key={o.value} value={o.value}>{o.name}</option>)}
        </select></label>
      <label>التخصص
        <select name="specialty" defaultValue={specialty}>
          <option value="">الكل</option>
          {specialties.map((o) => <option key={o.value} value={o.value}>{o.name}</option>)}
        </select></label>
      <label>المنطقة
        <select name="area" defaultValue={area}>
          <option value="">الكل</option>
          {areas.map((o) => <option key={o.value} value={o.value}>{o.name}</option>)}
        </select></label>
      {showFeatured && <label className="check"><input type="checkbox" name="featured" value="1" defaultChecked={featured} />مميز فقط</label>}
      <noscript><button className="btn btn-primary" type="submit">تطبيق</button></noscript>
      {active && <Link href="/search" className="clear-filters">مسح الفلاتر</Link>}
    </form>
  );
}
