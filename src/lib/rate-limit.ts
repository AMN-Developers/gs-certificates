type RecordItem = { count: number; resetAt: number };
declare global { var gsRateLimits: Map<string, RecordItem> | undefined; }
const records = global.gsRateLimits || new Map<string, RecordItem>();
if (process.env.NODE_ENV !== 'production') global.gsRateLimits = records;
export const resolveClientIp = (headers: Headers) => (headers.get('x-forwarded-for')?.split(',')[0] || headers.get('x-real-ip') || 'unknown').trim();
export function consumeRateLimit({ key, limit, windowMs }: { key: string; limit: number; windowMs: number }) { const now = Date.now(); const current = records.get(key); if (!current || current.resetAt <= now) { records.set(key, { count: 1, resetAt: now + windowMs }); return { allowed: true, retryAfter: 0 }; } if (current.count >= limit) return { allowed: false, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) }; current.count += 1; return { allowed: true, retryAfter: 0 }; }
export const resetRateLimit = (key: string) => records.delete(key);
