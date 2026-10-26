import { NextResponse } from "next/server";
import { getProviderBySlug, getSpecialty } from "@/lib/data";
import { clientIp, trackRateLimited } from "@/lib/spam";

export const runtime = "nodejs";

const EVENTS = new Set(["whatsapp_click", "call_click", "join_submit"]);
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// لا يُحفظ أي IP أو رقم أو معرّف للزائر: الحدث والدكتور والتخصص والصفحة فقط.
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  const event = str(body.event, 30);
  if (!EVENTS.has(event)) return NextResponse.json({ ok: false }, { status: 400 });
  if (trackRateLimited(clientIp(req.headers))) return NextResponse.json({ ok: false }, { status: 429 });

  // لو الدكتور معروف نأخذ الاسم والتخصص من بياناتنا بدل ما يرسله المتصفح
  const slug = str(body.providerSlug, 100);
  const provider = slug ? getProviderBySlug(slug) : undefined;
  if (slug && !provider) return NextResponse.json({ ok: false }, { status: 400 });
  const page = str(body.page, 200).split(/[?#]/)[0];
  const fields: Record<string, string> = {
    "الحدث": event,
    "الدكتور": provider?.name ?? str(body.providerName, 100),
    "التخصص": (provider ? getSpecialty(provider.specialty)?.name : undefined) ?? str(body.specialty, 100),
    "الصفحة": page.startsWith("/") ? page : "",
  };
  for (const k of Object.keys(fields)) if (!fields[k]) delete fields[k];

  const url = process.env.SHEETS_WEBHOOK_URL, secret = process.env.SHEETS_SECRET;
  if (!url || !secret) return NextResponse.json({ ok: false, error: "not configured" });
  try {
    const res = await fetch(url, {
      method: "POST", redirect: "follow", cache: "no-store", signal: AbortSignal.timeout(15000),
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, type: "ضغطات", fields }),
    });
    const reply = res.ok ? await res.json().catch(() => null) as { ok?: boolean } | null : null;
    return NextResponse.json({ ok: reply?.ok === true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
