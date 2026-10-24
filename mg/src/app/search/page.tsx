import type { Metadata } from "next";
import Icon from "@/components/Icon";
import SearchBar from "@/components/SearchBar";
import ProviderCard from "@/components/ProviderCard";
import EmptyState from "@/components/EmptyState";
import { categories } from "@/data/categories";
import { getArea, getAreas, getSpecialties, searchProviders } from "@/lib/data";

export const metadata: Metadata = { title: "نتائج البحث", robots: { index: false } };
type SP = { q?: string; area?: string; type?: string; specialty?: string; featured?: string };
const one = (v: unknown) => (typeof v === "string" ? v.slice(0, 80) : "");

export default function SearchPage({ searchParams }: { searchParams: SP }) {
  const q = one(searchParams.q), area = one(searchParams.area), type = one(searchParams.type);
  const specialty = one(searchParams.specialty), featured = searchParams.featured === "1";
  const results = searchProviders({ q, area, type, specialty, featured });
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
          <form className="filters" action="/search" method="get">
            <input type="hidden" name="q" value={q} />
            <label>نوع الخدمة
              <select name="type" defaultValue={type}>
                <option value="">الكل</option>
                {categories.map((c) => <option key={c.slug} value={c.type}>{c.name}</option>)}
              </select></label>
            <label>التخصص
              <select name="specialty" defaultValue={specialty}>
                <option value="">الكل</option>
                {getSpecialties().map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
              </select></label>
            <label>المنطقة
              <select name="area" defaultValue={area}>
                <option value="">الكل</option>
                {getAreas().map((a) => <option key={a.slug} value={a.slug}>{a.name}</option>)}
              </select></label>
            <label className="check"><input type="checkbox" name="featured" value="1" defaultChecked={featured} />مميز فقط</label>
            <button className="btn btn-primary" type="submit">تطبيق</button>
          </form>
        </aside>
        <div className="results">
          {results.length ? <div className="grid">{results.map((p) => <ProviderCard key={p.id} p={p} />)}</div> : <EmptyState />}
        </div>
      </div>
    </div>
  );
}
