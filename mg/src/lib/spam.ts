// حماية خفيفة لنماذج الانضمام: بدون خدمات خارجية. الحد في الذاكرة فقط (يُصفَّر مع كل instance).
export const MIN_FILL_MS = 3000;
export const RATE_LIMIT_MAX = 5;
export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

const hits = new Map<string, number[]>();

/** true لو الإرسال أسرع من أن يكون بشريًا، أو لم يرسل النموذج زمن التعبئة. */
export const tooFast = (elapsedMs: unknown) => typeof elapsedMs !== "number" || !Number.isFinite(elapsedMs) || elapsedMs < MIN_FILL_MS;

/** يسجّل المحاولة ويرجّع true لو تجاوز الـ IP الحد (5 كل 10 دقائق). */
export function rateLimited(ip: string, now = Date.now()) {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) { hits.set(ip, recent); return true; }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < RATE_LIMIT_WINDOW_MS)) hits.delete(k);
  return false;
}

export const clientIp = (h: Headers) => h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "unknown";
