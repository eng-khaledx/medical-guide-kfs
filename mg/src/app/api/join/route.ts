import { NextResponse } from "next/server";
import { sheetNames, validateJoin } from "@/lib/join";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { type?: unknown; fields?: unknown; website?: unknown };
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 }); }
  // حقل مصيدة: يملؤه الروبوتات فقط؛ نرجع نجاحًا دون حفظ
  if (typeof body.website === "string" && body.website.trim()) return NextResponse.json({ ok: true });
  const v = validateJoin(body.type, body.fields);
  if (!v.ok) return NextResponse.json({ ok: false, error: v.error }, { status: 400 });

  const url = process.env.SHEETS_WEBHOOK_URL, secret = process.env.SHEETS_SECRET;
  if (!url || !secret) return NextResponse.json({ ok: false, error: "not configured" });
  try {
    const res = await fetch(url, {
      method: "POST", redirect: "follow", cache: "no-store", signal: AbortSignal.timeout(15000),
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, type: sheetNames[body.type as string], fields: v.fields }),
    });
    if (!res.ok) return NextResponse.json({ ok: false, error: "sheet error" });
    const reply = await res.json().catch(() => null) as { ok?: boolean } | null;
    return NextResponse.json({ ok: reply?.ok === true });
  } catch {
    return NextResponse.json({ ok: false, error: "sheet unreachable" });
  }
}
