import type { Metadata } from "next";
import JoinForm from "@/components/JoinForm";
import { getAreas } from "@/lib/data";
import { joinConfigs } from "@/lib/join";

const config = joinConfigs.nurse;
export const metadata: Metadata = { title: config.title, description: config.intro };

export default function Page() {
  return (
    <div className="container section join-page">
      <h1 className="page-title">{config.title}</h1>
      <p className="muted">{config.intro}</p>
      <JoinForm config={config} areas={getAreas()} />
    </div>
  );
}
