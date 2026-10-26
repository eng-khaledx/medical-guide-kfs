import type { MetadataRoute } from "next";
import { joinLinks } from "@/lib/join";
import { SITE } from "@/lib/site";
import { getCategories, getProviders, getSpecialties } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => ({ url: `${SITE.url}${p}` });
  return [u("/"), ...joinLinks.map((l) => u(l.href)), ...getCategories().map((c) => u(`/category/${c.slug}`)), ...getSpecialties().map((s) => u(`/specialties/${s.slug}`)),
    ...getProviders().map((p) => u(`/providers/${p.slug}`))];
}
