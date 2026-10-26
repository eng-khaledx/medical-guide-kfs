import type { Metadata } from "next";
import JoinForm from "@/components/JoinForm";
import JoinHero from "@/components/JoinHero";
import JoinSide from "@/components/JoinSide";
import { getAreas, getSpecialties } from "@/lib/data";
import { joinConfigs } from "@/lib/join";

const config = joinConfigs.doctor;
export const metadata: Metadata = { title: config.title, description: config.intro };

export default function Page() {
  return (
    <div className="container section join-page">
      <JoinHero icon="stethoscope" title={config.title} subtitle={config.intro} />
      <div className="join-layout">
        <JoinForm config={config} areas={getAreas()} specialties={getSpecialties().map((s) => s.name)} />
        <JoinSide config={config} />
      </div>
    </div>
  );
}
