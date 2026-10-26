import type { Metadata } from "next";
import { jobs } from "@/data/jobs";
import { getArea } from "@/lib/data";
import { createWhatsAppUrl } from "@/lib/whatsapp";
import { GUIDE_CONTACT_NUMBER } from "@/lib/site";

export const metadata: Metadata = { title: "وظائف", description: "وظائف طبية في كفرالشيخ" };

const wa = (message: string) => createWhatsAppUrl({ phone: GUIDE_CONTACT_NUMBER.whatsapp, message });
const cv = wa("مرحبًا، أرغب في إرسال السيرة الذاتية (CV) للتقديم على وظيفة عبر دليلك الطبي بكفرالشيخ.");

export default function JobsPage() {
  return (
    <div className="container section">
      <h1 className="page-title">وظائف</h1>
      {jobs.length === 0 ? (
        <div className="empty">
          <h2>مفيش وظائف متاحة حالياً</h2>
          <a className="btn btn-wa" href={cv} target="_blank" rel="noopener noreferrer">ابعتلنا الـCV على واتساب</a>
        </div>
      ) : (
        <>
          <div className="grid">
            {jobs.map((j) => (
              <article key={j.id} className="panel job-card">
                <h2>{j.title}</h2>
                {(j.org || j.area) && <p className="muted">{[j.org, getArea(j.area ?? "")?.name ?? j.area].filter(Boolean).join(" • ")}</p>}
                {j.description && <p>{j.description}</p>}
                <a className="btn btn-wa" href={wa(`مرحبًا، أرغب في التقديم على وظيفة: ${j.title}`)} target="_blank" rel="noopener noreferrer">قدّم عبر واتساب</a>
              </article>
            ))}
          </div>
          <p style={{ marginTop: 16 }}><a className="btn btn-ghost" href={cv} target="_blank" rel="noopener noreferrer">ابعتلنا الـCV على واتساب</a></p>
        </>
      )}
    </div>
  );
}
