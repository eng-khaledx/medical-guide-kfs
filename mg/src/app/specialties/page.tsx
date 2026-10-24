import type { Metadata } from "next";
import Tile from "@/components/Tile";
import { getAllTiles } from "@/lib/data";

export const metadata: Metadata = { title: "كل التخصصات", alternates: { canonical: "/specialties" } };

export default function SpecialtiesPage() {
  const tiles = getAllTiles();
  return (
    <div className="container section">
      <h1 className="page-title">كل التخصصات</h1>
      <p className="muted">{tiles.length} قسم</p>
      <div className="tiles">{tiles.map((t) => <Tile key={t.href} {...t} />)}</div>
    </div>
  );
}
