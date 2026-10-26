import type { Metadata } from "next";
import JoinForm from "@/components/JoinForm";
import JoinHero from "@/components/JoinHero";
import { getAreas } from "@/lib/data";
import { joinConfigs } from "@/lib/join";

const config = joinConfigs.lab;
export const metadata: Metadata = { title: config.title, description: config.intro };

export default function Page() {
  return (
    <div className="container section join-page">
      <JoinHero icon="flask" title={config.title} />
      <p className="muted">{config.intro}</p>
      <JoinForm config={config} areas={getAreas()} />
    </div>
  );
}
