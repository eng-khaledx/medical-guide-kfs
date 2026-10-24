import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import ProviderCard from "@/components/ProviderCard";
import EmptyState from "@/components/EmptyState";
import { getCategories, getCategory, getProvidersByType } from "@/lib/data";

export const dynamicParams = false;
export const generateStaticParams = () => getCategories().map((c) => ({ slug: c.slug }));

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = getCategory(params.slug);
  if (!c) return {};
  return { title: c.title, description: `${c.title}: تصفح وتواصل مباشرة عبر الاتصال أو واتساب.`, alternates: { canonical: `/category/${c.slug}` } };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const c = getCategory(params.slug);
  if (!c) notFound();
  const list = getProvidersByType(c.type);
  return (
    <div className="container section">
      <h1 className="page-title">{c.title}</h1>
      <p className="muted">{list.length} نتيجة</p>
      <div className="sticky-search"><SearchBar compact /></div>
      {list.length ? <div className="grid">{list.map((p) => <ProviderCard key={p.id} p={p} />)}</div> : <EmptyState title="قريباً.. جاري إضافة مقدمي الخدمة في هذا القسم" text="تواصل معنا وسنساعدك في الوصول للخدمة المناسبة." cta="تواصل معنا وهنساعدك" />}
    </div>
  );
}
