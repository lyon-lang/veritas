import { cookies } from 'next/headers';
import { UserModel } from '@/lib/models';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface MonthlyLimitEntry {
  count: number;
  month: string; // YYYY-MM format
}

const rateLimits: Map<string, RateLimitEntry> = new Map();
const monthlyLimits: Map<string, MonthlyLimitEntry> = new Map();

// Per-minute limits
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_MINUTE = 10;
const MAX_REQUESTS_PER_MINUTE_PRO = 50;
const MAX_REQUESTS_PER_MINUTE_ENTERPRISE = 200;

// Monthly limits
const FREE_MONTHLY_LIMIT = 15;
const CONSUMER_MONTHLY_LIMIT = -1; // unlimited
const PROFESSIONAL_MONTHLY_LIMIT = -1; // unlimited
const ENTERPRISE_MONTHLY_LIMIT = -1; // unlimited

function getMaxRequestsPerMinute(plan: string): number {
  switch (plan) {
    case 'enterprise': return MAX_REQUESTS_PER_MINUTE_ENTERPRISE;
    case 'professional': return MAX_REQUESTS_PER_MINUTE_PRO;
    case 'consumer': return MAX_REQUESTS_PER_MINUTE_PRO;
    default: return MAX_REQUESTS_PER_MINUTE;
  }
}

function getMonthlyLimit(plan: string): number {
  switch (plan) {
    case 'enterprise': return ENTERPRISE_MONTHLY_LIMIT;
    case 'professional': return PROFESSIONAL_MONTHLY_LIMIT;
    case 'consumer': return CONSUMER_MONTHLY_LIMIT;
    default: return FREE_MONTHLY_LIMIT;
  }
}

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export async function checkUserRateLimit(): Promise<{ 
  allowed: boolean; 
  remaining: number; 
  resetAt: string;
  monthlyRemaining: number;
  monthlyLimit: number;
}> {
  try {
    maybeCleanup();
    
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    const key = userId || 'anonymous';
    const user = userId ? UserModel.findById(userId) as any : null;
    const plan = user?.plan || 'free';
    const maxRequestsPerMinute = getMaxRequestsPerMinute(plan);
    const monthlyLimit = getMonthlyLimit(plan);

    const now = Date.now();
    const currentMonth = getCurrentMonth();

    // Check per-minute rate limit
    let entry = rateLimits.get(key);
    if (!entry || now > entry.resetAt) {
      entry = { count: 0, resetAt: now + WINDOW_MS };
      rateLimits.set(key, entry);
    }
    entry.count++;

    if (entry.count > maxRequestsPerMinute) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: new Date(entry.resetAt).toISOString(),
        monthlyRemaining: getMonthlyRemaining(key, currentMonth, monthlyLimit),
        monthlyLimit,
      };
    }

    // Check monthly limit (only for free tier)
    if (monthlyLimit > 0) {
      const monthlyRemaining = getMonthlyRemaining(key, currentMonth, monthlyLimit);
      if (monthlyRemaining <= 0) {
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        nextMonth.setDate(1);
        nextMonth.setHours(0, 0, 0, 0);
        
        return {
          allowed: false,
          remaining: maxRequestsPerMinute - entry.count,
          resetAt: nextMonth.toISOString(),
          monthlyRemaining: 0,
          monthlyLimit,
        };
      }

      // Increment monthly count
      incrementMonthlyCount(key, currentMonth);

      return {
        allowed: true,
        remaining: maxRequestsPerMinute - entry.count,
        resetAt: new Date(entry.resetAt).toISOString(),
        monthlyRemaining: monthlyRemaining - 1,
        monthlyLimit,
      };
    }

    return {
      allowed: true,
      remaining: maxRequestsPerMinute - entry.count,
      resetAt: new Date(entry.resetAt).toISOString(),
      monthlyRemaining: -1, // unlimited
      monthlyLimit,
    };
  } catch {
    return { 
      allowed: true, 
      remaining: 10, 
      resetAt: new Date(Date.now() + WINDOW_MS).toISOString(),
      monthlyRemaining: 15,
      monthlyLimit: 15,
    };
  }
}

function getMonthlyRemaining(key: string, month: string, limit: number): number {
  if (limit <= 0) return -1; // unlimited
  
  const monthlyKey = `${key}-${month}`;
  const entry = monthlyLimits.get(monthlyKey);
  
  if (!entry || entry.month !== month) {
    return limit;
  }
  
  return Math.max(0, limit - entry.count);
}

function incrementMonthlyCount(key: string, month: string) {
  const monthlyKey = `${key}-${month}`;
  let entry = monthlyLimits.get(monthlyKey);
  
  if (!entry || entry.month !== month) {
    entry = { count: 0, month };
    monthlyLimits.set(monthlyKey, entry);
  }
  
  entry.count++;
}

export function getMonthlyUsage(key: string): { used: number; limit: number; remaining: number } {
  const currentMonth = getCurrentMonth();
  const monthlyKey = `${key}-${currentMonth}`;
  const entry = monthlyLimits.get(monthlyKey);
  const limit = FREE_MONTHLY_LIMIT; // Default to free tier
  
  const used = (entry && entry.month === currentMonth) ? entry.count : 0;
  const remaining = Math.max(0, limit - used);
  
  return { used, limit, remaining };
}

export function cleanupRateLimits() {
  const now = Date.now();
  for (const [key, entry] of rateLimits.entries()) {
    if (now > entry.resetAt) {
      rateLimits.delete(key);
    }
  }
  
  // Cleanup old monthly entries
  const currentMonth = getCurrentMonth();
  for (const [key, entry] of monthlyLimits.entries()) {
    if (entry.month !== currentMonth) {
      monthlyLimits.delete(key);
    }
  }
}

let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 5 * 60 * 1000;

function maybeCleanup() {
  const now = Date.now();
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    lastCleanup = now;
    cleanupRateLimits();
  }
}
