export type TrackEvent = "whatsapp_click" | "call_click" | "join_submit";
export interface TrackPayload { event: TrackEvent; providerSlug?: string; providerName?: string; specialty?: string; page?: string }

/** تتبع الضغطات: لا يحجب الإجراء الأصلي ولا يرمي أخطاء، ولا يرسل أي بيانات شخصية عن الزائر. */
export function trackEvent(p: TrackPayload) {
  try {
    const body = JSON.stringify({ ...p, page: p.page ?? window.location.pathname });
    if (navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" }))) return;
    void fetch("/api/track", { method: "POST", keepalive: true, headers: { "Content-Type": "application/json" }, body }).catch(() => {});
  } catch { /* التتبع اختياري */ }
}
