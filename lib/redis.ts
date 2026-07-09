import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis =
  redisUrl && redisToken
    ? new Redis({ url: redisUrl, token: redisToken })
    : null;

function createRateLimiter(requests: number, window: `${number} s` | `${number} m`) {
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
    analytics: true,
    prefix: "trimly:ratelimit",
  });
}

export const guestRateLimit = createRateLimiter(10, "1 m");
export const authRateLimit = createRateLimiter(60, "1 m");
export const apiKeyRateLimit = createRateLimiter(100, "1 m");

export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<{ success: boolean; remaining: number }> {
  if (!limiter) return { success: true, remaining: 999 };
  const result = await limiter.limit(identifier);
  return { success: result.success, remaining: result.remaining };
}
