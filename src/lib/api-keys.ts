// API Key Management Service
// Handles API key generation, validation, and rate limiting

interface ApiKey {
  id: string;
  key: string;
  userId: string;
  name: string;
  tier: 'free' | 'pro' | 'enterprise';
  requestsPerDay: number;
  requestsPerMinute: number;
  totalRequests: number;
  createdAt: string;
  lastUsedAt: string | null;
  active: boolean;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: string;
}

// In-memory storage
const apiKeys: Map<string, ApiKey> = new Map();
const requestCounts: Map<string, { minute: number; day: number; lastMinute: number; lastDay: string }> = new Map();

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

// Generate API key
export function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const prefix = 'vrt_';
  let result = prefix;
  for (let i = 0; i < 48; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Create API key
export function createApiKey(userId: string, name: string, tier: 'free' | 'pro' | 'enterprise' = 'free'): ApiKey {
  const key = generateApiKey();
  const apiKey: ApiKey = {
    id: crypto.randomUUID(),
    key,
    userId,
    name,
    tier,
    requestsPerDay: TIER_LIMITS[tier].requestsPerDay,
    requestsPerMinute: TIER_LIMITS[tier].requestsPerMinute,
    totalRequests: 0,
    createdAt: new Date().toISOString(),
    lastUsedAt: null,
    active: true,
  };
  
  apiKeys.set(key, apiKey);
  return apiKey;
}

// Validate API key
export function validateApiKey(key: string): ApiKey | null {
  const apiKey = apiKeys.get(key);
  if (!apiKey || !apiKey.active) return null;
  return apiKey;
}

// Check rate limit
export function checkRateLimit(key: string): RateLimitResult {
  const apiKey = apiKeys.get(key);
  if (!apiKey) {
    return { allowed: false, remaining: 0, resetAt: new Date().toISOString() };
  }

  const now = Date.now();
  const currentMinute = Math.floor(now / 60000);
  const currentDay = new Date().toISOString().split('T')[0];

  let counts = requestCounts.get(key);
  if (!counts) {
    counts = { minute: 0, day: 0, lastMinute: currentMinute, lastDay: currentDay };
    requestCounts.set(key, counts);
  }

  // Reset minute count if new minute
  if (currentMinute !== counts.lastMinute) {
    counts.minute = 0;
    counts.lastMinute = currentMinute;
  }

  // Reset day count if new day
  if (currentDay !== counts.lastDay) {
    counts.day = 0;
    counts.lastDay = currentDay;
  }

  // Check limits
  if (counts.minute >= apiKey.requestsPerMinute) {
    const resetAt = new Date((currentMinute + 1) * 60000).toISOString();
    return { allowed: false, remaining: 0, resetAt };
  }

  if (counts.day >= apiKey.requestsPerDay) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return { allowed: false, remaining: 0, resetAt: tomorrow.toISOString() };
  }

  // Increment counts
  counts.minute++;
  counts.day++;
  apiKey.totalRequests++;
  apiKey.lastUsedAt = new Date().toISOString();

  const remaining = Math.min(
    apiKey.requestsPerMinute - counts.minute,
    apiKey.requestsPerDay - counts.day
  );

  const resetAt = new Date((currentMinute + 1) * 60000).toISOString();

  return { allowed: true, remaining, resetAt };
}

// Get API key info
export function getApiKeyInfo(key: string): ApiKey | null {
  return apiKeys.get(key) || null;
}

// Get user's API keys
export function getUserApiKeys(userId: string): ApiKey[] {
  return Array.from(apiKeys.values()).filter(k => k.userId === userId);
}

// Revoke API key
export function revokeApiKey(key: string): boolean {
  const apiKey = apiKeys.get(key);
  if (apiKey) {
    apiKey.active = false;
    return true;
  }
  return false;
}

// Get usage stats
export function getUsageStats(key: string): {
  today: number;
  thisMinute: number;
  total: number;
  limits: { perDay: number; perMinute: number };
} | null {
  const apiKey = apiKeys.get(key);
  if (!apiKey) return null;

  const counts = requestCounts.get(key);
  const now = Date.now();
  const currentMinute = Math.floor(now / 60000);
  const currentDay = new Date().toISOString().split('T')[0];

  let todayRequests = 0;
  let minuteRequests = 0;

  if (counts) {
    if (counts.lastDay === currentDay) {
      todayRequests = counts.day;
    }
    if (counts.lastMinute === currentMinute) {
      minuteRequests = counts.minute;
    }
  }

  return {
    today: todayRequests,
    thisMinute: minuteRequests,
    total: apiKey.totalRequests,
    limits: {
      perDay: apiKey.requestsPerDay,
      perMinute: apiKey.requestsPerMinute,
    },
  };
}
