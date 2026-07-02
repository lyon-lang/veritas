import { cookies } from 'next/headers';
import { UserModel } from '@/lib/models';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimits: Map<string, RateLimitEntry> = new Map();

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_MINUTE = 10;
const MAX_REQUESTS_PER_MINUTE_PRO = 50;
const MAX_REQUESTS_PER_MINUTE_ENTERPRISE = 200;

function getMaxRequests(plan: string): number {
  switch (plan) {
    case 'enterprise': return MAX_REQUESTS_PER_MINUTE_ENTERPRISE;
    case 'pro': return MAX_REQUESTS_PER_MINUTE_PRO;
    default: return MAX_REQUESTS_PER_MINUTE;
  }
}

export async function checkUserRateLimit(): Promise<{ allowed: boolean; remaining: number; resetAt: string }> {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    const key = userId || 'anonymous';
    const user = userId ? UserModel.findById(userId) as any : null;
    const maxRequests = getMaxRequests(user?.plan || 'free');

    const now = Date.now();
    let entry = rateLimits.get(key);

    if (!entry || now > entry.resetAt) {
      entry = { count: 0, resetAt: now + WINDOW_MS };
      rateLimits.set(key, entry);
    }

    entry.count++;

    if (entry.count > maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: new Date(entry.resetAt).toISOString(),
      };
    }

    return {
      allowed: true,
      remaining: maxRequests - entry.count,
      resetAt: new Date(entry.resetAt).toISOString(),
    };
  } catch {
    return { allowed: true, remaining: 10, resetAt: new Date(Date.now() + WINDOW_MS).toISOString() };
  }
}

export function cleanupRateLimits() {
  const now = Date.now();
  for (const [key, entry] of rateLimits.entries()) {
    if (now > entry.resetAt) {
      rateLimits.delete(key);
    }
  }
}

setInterval(cleanupRateLimits, 5 * 60 * 1000);
