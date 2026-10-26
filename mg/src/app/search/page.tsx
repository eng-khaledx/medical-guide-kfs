import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import FilterForm from "@/components/FilterForm";
import SearchBar from "@/components/SearchBar";
import ProviderCard from "@/components/ProviderCard";
import EmptyState from "@/components/EmptyState";
import { categories } from "@/data/categories";
import { showFeatured } from "@/lib/site";
import { getArea, getAreas, getSpecialties, searchProviders } from "@/lib/data";

export const metadata: Metadata = { title: "نتائج البحث", robots: { index: false } };
type SP = { q?: string; area?: string; type?: string; specialty?: string; featured?: string };
const one = (v: unknown) => (typeof v === "string" ? v.slice(0, 80) : "");

export default function SearchPage({ searchParams }: { searchParams: SP }) {
  const q = one(searchParams.q), area = one(searchParams.area), type = one(searchParams.type);
  const specialty = one(searchParams.specialty), featured = showFeatured && searchParams.featured === "1";
  const results = searchProviders({ q, area, type, specialty, featured });
  const KFS = "kafr-el-sheikh";
  // لا نتائج بسبب المنطقة: نفس الفلاتر في كفرالشيخ فيها نتائج
  const areaEmpty = results.length === 0 && !!getArea(area) && area !== KFS && searchProviders({ q, area: KFS, type, specialty, featured }).length > 0;
  const kfsHref = `/search?${new URLSearchParams(Object.entries({ q, type, specialty, area: KFS, ...(featured && { featured: "1" }) }).filter(([, v]) => v) as [string, string][])}`;
  return (
    <div className="container section">
      <h1 className="page-title">{q ? `نتائج البحث عن "${q}"` : "كل مقدمي الخدمة"}</h1>
      <p className="muted">{results.length} نتيجة{getArea(area) ? ` في ${getArea(area)!.name}` : ""}</p>
      <div className="sticky-search"><SearchBar compact q={q} area={area} /></div>
      <div className="listing">
        <input id="filter-toggle" type="checkbox" className="sheet-toggle sr-only" aria-label="إظهار أو إخفاء التصفية" />
        <label htmlFor="filter-toggle" className="btn btn-ghost filter-open"><Icon name="filter" size={18} />تصفية النتائج</label>
        <label htmlFor="filter-toggle" className="sheet-backdrop" aria-hidden="true" />
        <aside className="filter-sheet" aria-label="تصفية النتائج">
          <div className="sheet-head">
            <h2>تصفية النتائج</h2>
            <label htmlFor="filter-toggle" className="icon-btn" aria-label="إغلاق"><Icon name="close" size={20} /></label>
          </div>
          <FilterForm q={q} type={type} specialty={specialty} area={area} featured={featured}
            types={categories.map((c) => ({ value: c.type, name: c.name }))}
            specialties={getSpecialties().map((x) => ({ value: x.slug, name: x.name }))}
            areas={getAreas().map((a) => ({ value: a.slug, name: a.name }))} />
        </aside>
        <div className="results">
          {results.length ? <div className="grid">{results.map((p) => <ProviderCard key={p.id} p={p} />)}</div> : areaEmpty ? (
            <div className="empty">
              <h2>لسه مفيش أطباء في المنطقة دي، بنضيفهم قريب.</h2>
              <p className="muted">تقدر تشوف الأطباء المتاحين في كفرالشيخ، أو لو إنت دكتور في المنطقة دي سجّل عيادتك.</p>
              <div className="empty-actions">
                <Link className="btn btn-primary" href={kfsHref}>شوف الأطباء في كفرالشيخ</Link>
                <Link className="btn btn-ghost" href="/join/doctor">أنت طبيب هنا؟ سجّل عيادتك</Link>
              </div>
            </div>
          ) : <EmptyState />}
        </div>
      </div>
    </div>
  );
}
