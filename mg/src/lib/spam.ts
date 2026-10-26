// حماية خفيفة بدون خدمات خارجية. الحدود في الذاكرة فقط (تُصفَّر مع كل instance).
export const MIN_FILL_MS = 3000;
export const RATE_LIMIT_MAX = 5;
export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

/** حد بسيط لكل IP: max محاولات خلال windowMs. يرجّع دالة تسجّل المحاولة وتقول هل تجاوز الحد. */
export function createRateLimiter(max: number, windowMs: number) {
  const hits = new Map<string, number[]>();
  return (ip: string, now = Date.now()) => {
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= max) { hits.set(ip, recent); return true; }
    recent.push(now);
    hits.set(ip, recent);
    if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
    return false;
  };
}

/** نماذج الانضمام: 5 إرسالات لكل IP كل 10 دقائق. */
export const rateLimited = createRateLimiter(RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);
/** تتبع الضغطات: حد أوسع (60 كل 10 دقائق) لأن التصفح العادي بيضغط أكتر. */
export const trackRateLimited = createRateLimiter(60, RATE_LIMIT_WINDOW_MS);

/** true لو الإرسال أسرع من أن يكون بشريًا، أو لم يرسل النموذج زمن التعبئة. */
export const tooFast = (elapsedMs: unknown) => typeof elapsedMs !== "number" || !Number.isFinite(elapsedMs) || elapsedMs < MIN_FILL_MS;

export const clientIp = (h: Headers) => h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "unknown";
