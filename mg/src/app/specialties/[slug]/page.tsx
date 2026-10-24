import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import ProviderCard from "@/components/ProviderCard";
import EmptyState from "@/components/EmptyState";
import { getProvidersBySpecialty, getSpecialties, getSpecialty } from "@/lib/data";

export const dynamicParams = false;
export const generateStaticParams = () => getSpecialties().map((s) => ({ slug: s.slug }));

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const s = getSpecialty(params.slug);
  if (!s) return {};
  const title = `أطباء ${s.name} في كفرالشيخ`;
  return { title, description: `تعرف على أطباء ${s.name} في كفرالشيخ وتواصل معهم مباشرة عبر الاتصال أو واتساب.`, alternates: { canonical: `/specialties/${s.slug}` } };
}

export default function SpecialtyPage({ params }: { params: { slug: string } }) {
  const s = getSpecialty(params.slug);
  if (!s) notFound();
  const list = getProvidersBySpecialty(s.slug);
  return (
    <div className="container section">
      <h1 className="page-title">أطباء {s.name} في كفرالشيخ</h1>
      <p className="muted">{list.length} نتيجة</p>
      <div className="sticky-search"><SearchBar compact /></div>
      {list.length ? <div className="grid">{list.map((p) => <ProviderCard key={p.id} p={p} />)}</div> : <EmptyState title="قريباً.. جاري إضافة مقدمي الخدمة في هذا القسم" text="تواصل معنا وسنساعدك في الوصول للخدمة المناسبة." cta="تواصل معنا وهنساعدك" />}
    </div>
  );
}
