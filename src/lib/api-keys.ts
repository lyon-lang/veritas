import crypto from 'crypto';
import { getDatabase } from './database';

// API Key Management Service
// Handles API key generation, validation, and rate limiting

interface ApiKey {
  id: string;
  key: string;
  user_id: string;
  name: string;
  tier: 'free' | 'pro' | 'enterprise';
  requests_per_day: number;
  requests_per_minute: number;
  total_requests: number;
  created_at: string;
  last_used_at: string | null;
  active: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: string;
}

// Tier limits
const TIER_LIMITS = {
  free: {
    requestsPerDay: 100,
    requestsPerMinute: 10,
  },
  pro: {
    requestsPerDay: 10000,
    requestsPerMinute: 100,
  },
  enterprise: {
    requestsPerDay: 100000,
    requestsPerMinute: 1000,
  },
};

function getDb() {
  return getDatabase();
}

// Generate API key
export function generateApiKey(): string {
  const prefix = 'vrt_';
  const randomBytes = crypto.randomBytes(36);
  return prefix + randomBytes.toString('base64url').substring(0, 48);
}

// Create API key
export function createApiKey(userId: string, name: string, tier: 'free' | 'pro' | 'enterprise' = 'free'): ApiKey {
  const db = getDb();
  const key = generateApiKey();
  const id = crypto.randomUUID();

  const stmt = db.prepare(`
    INSERT INTO api_keys (id, key, user_id, name, tier, requests_per_day, requests_per_minute, total_requests, created_at, last_used_at, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, 0, datetime('now'), NULL, 1)
  `);
  stmt.run(id, key, userId, name, tier, TIER_LIMITS[tier].requestsPerDay, TIER_LIMITS[tier].requestsPerMinute);

  const rateLimitStmt = db.prepare(`
    INSERT INTO api_key_rate_limits (key, minute_count, day_count, last_minute, last_day)
    VALUES (?, 0, 0, 0, NULL)
  `);
  rateLimitStmt.run(key);

  return getApiKeyInfo(key)!;
}

// Validate API key
export function validateApiKey(key: string): ApiKey | null {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM api_keys WHERE key = ? AND active = 1');
  return stmt.get(key) as ApiKey | null;
}

// Check rate limit
export function checkRateLimit(key: string): RateLimitResult {
  const db = getDb();
  const apiKey = validateApiKey(key);
  if (!apiKey) {
    return { allowed: false, remaining: 0, resetAt: new Date().toISOString() };
  }

  const now = Date.now();
  const currentMinute = Math.floor(now / 60000);
  const currentDay = new Date().toISOString().split('T')[0];

  const limitsStmt = db.prepare('SELECT * FROM api_key_rate_limits WHERE key = ?');
  let limits = limitsStmt.get(key) as { minute_count: number; day_count: number; last_minute: number; last_day: string } | undefined;

  if (!limits) {
    const insertStmt = db.prepare(`
      INSERT INTO api_key_rate_limits (key, minute_count, day_count, last_minute, last_day)
      VALUES (?, 0, 0, ?, ?)
    `);
    insertStmt.run(key, currentMinute, currentDay);
    limits = { minute_count: 0, day_count: 0, last_minute: currentMinute, last_day: currentDay };
  }

  // Reset minute count if new minute
  if (currentMinute !== limits.last_minute) {
    const updateStmt = db.prepare('UPDATE api_key_rate_limits SET minute_count = 0, last_minute = ? WHERE key = ?');
    updateStmt.run(currentMinute, key);
    limits.minute_count = 0;
    limits.last_minute = currentMinute;
  }

  // Reset day count if new day
  if (currentDay !== limits.last_day) {
    const updateStmt = db.prepare('UPDATE api_key_rate_limits SET day_count = 0, last_day = ? WHERE key = ?');
    updateStmt.run(currentDay, key);
    limits.day_count = 0;
    limits.last_day = currentDay;
  }

  // Check limits
  if (limits.minute_count >= apiKey.requests_per_minute) {
    const resetAt = new Date((currentMinute + 1) * 60000).toISOString();
    return { allowed: false, remaining: 0, resetAt };
  }

  if (limits.day_count >= apiKey.requests_per_day) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return { allowed: false, remaining: 0, resetAt: tomorrow.toISOString() };
  }

  // Increment counts
  const incrementStmt = db.prepare(`
    UPDATE api_key_rate_limits SET minute_count = minute_count + 1, day_count = day_count + 1 WHERE key = ?
  `);
  incrementStmt.run(key);

  const updateTotalStmt = db.prepare(`
    UPDATE api_keys SET total_requests = total_requests + 1, last_used_at = datetime('now') WHERE key = ?
  `);
  updateTotalStmt.run(key);

  const remaining = Math.min(
    apiKey.requests_per_minute - limits.minute_count - 1,
    apiKey.requests_per_day - limits.day_count - 1
  );

  const resetAt = new Date((currentMinute + 1) * 60000).toISOString();

  return { allowed: true, remaining, resetAt };
}

// Get API key info
export function getApiKeyInfo(key: string): ApiKey | null {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM api_keys WHERE key = ?');
  return stmt.get(key) as ApiKey | null;
}

// Get user's API keys
export function getUserApiKeys(userId: string): ApiKey[] {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM api_keys WHERE user_id = ? ORDER BY created_at DESC');
  return stmt.all(userId) as ApiKey[];
}

// Revoke API key
export function revokeApiKey(key: string): boolean {
  const db = getDb();
  const stmt = db.prepare('UPDATE api_keys SET active = 0 WHERE key = ?');
  const result = stmt.run(key);
  return result.changes > 0;
}

// Get usage stats
export function getUsageStats(key: string): {
  today: number;
  thisMinute: number;
  total: number;
  limits: { perDay: number; perMinute: number };
} | null {
  const db = getDb();
  const apiKey = validateApiKey(key);
  if (!apiKey) return null;

  const limitsStmt = db.prepare('SELECT * FROM api_key_rate_limits WHERE key = ?');
  const limits = limitsStmt.get(key) as { minute_count: number; day_count: number; last_minute: number; last_day: string } | undefined;

  const now = Date.now();
  const currentMinute = Math.floor(now / 60000);
  const currentDay = new Date().toISOString().split('T')[0];

  let todayRequests = 0;
  let minuteRequests = 0;

  if (limits) {
    if (limits.last_day === currentDay) {
      todayRequests = limits.day_count;
    }
    if (limits.last_minute === currentMinute) {
      minuteRequests = limits.minute_count;
    }
  }

  return {
    today: todayRequests,
    thisMinute: minuteRequests,
    total: apiKey.total_requests,
    limits: {
      perDay: apiKey.requests_per_day,
      perMinute: apiKey.requests_per_minute,
    },
  };
}
