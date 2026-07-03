// ─── Enums / Unions ────────────────────────────────────────────

export type Plan = 'free' | 'consumer' | 'professional' | 'enterprise';

export type ContentType = 'image' | 'video' | 'text' | 'audio' | 'url';

export type Verdict = 'authentic' | 'suspicious' | 'fake' | 'unknown';

export type CheckStatus = 'passed' | 'failed' | 'warning' | 'skipped';

export type SourceCategory = 'news' | 'social' | 'blog' | 'science' | 'finance' | 'video' | 'unknown' | 'suspicious';

export type SourceReputation = 'high' | 'medium' | 'low' | 'unknown';

export type PoliticalBias = 'left' | 'center' | 'right' | 'unknown';

export type AlertType = 'score_change' | 'verdict_change';

export type ApiKeyTier = 'free' | 'pro' | 'enterprise';

export type TrustImpact = 'positive' | 'negative' | 'neutral';

// ─── User ──────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  plan: Plan;
  verificationsToday: number;
  verificationsLimit: number;
  createdAt: string;
}

export interface UserRow {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  plan: string;
  verifications_today: number;
  verifications_limit: number;
  created_at: string;
  updated_at: string;
}

export interface UserPublic {
  id: string;
  email: string;
  name: string;
  plan?: Plan;
}

// ─── Verification ──────────────────────────────────────────────

export interface Verification {
  id: string;
  userId?: string;
  url?: string;
  contentType: ContentType;
  contentHash?: string;
  trustScore: number;
  verdict: Verdict;
  confidence: number;
  checks: VerificationCheck[];
  c2paCredentials?: C2PACredentials;
  aiDetection?: AIDetectionResult;
  sourceCredibility?: SourceCredibility;
  createdAt: string;
}

export interface VerificationRow {
  id: string;
  user_id: string | null;
  url: string | null;
  content_type: string;
  content_hash: string | null;
  trust_score: number;
  verdict: string;
  confidence: number;
  checks: string;
  c2pa_data: string | null;
  ai_detection: string | null;
  source_data: string | null;
  created_at: string;
}

export interface VerificationCheck {
  name: string;
  status: CheckStatus;
  score: number;
  details: string;
}

export interface VerificationRequest {
  content: string;
  type: ContentType;
  options?: VerificationOptions;
}

export interface VerificationOptions {
  checkC2PA?: boolean;
  checkAI?: boolean;
  checkSource?: boolean;
  deepAnalysis?: boolean;
}

export interface BatchVerificationItem {
  content: string;
  type: ContentType;
}

export interface BatchVerificationResult {
  id: string;
  content: string;
  type: string;
  trustScore: number;
  verdict: string;
  confidence: number;
  checks: VerificationCheck[];
  error?: string;
}

export interface BatchVerificationResponse {
  results: BatchVerificationResult[];
  summary: {
    total: number;
    authentic: number;
    suspicious: number;
    fake: number;
  };
}

// ─── C2PA ──────────────────────────────────────────────────────

export interface C2PACredentials {
  present: boolean;
  valid: boolean;
  creator?: string;
  timestamp?: string;
  edits?: C2PAEdit[];
  tools?: string[];
  certificate?: string;
}

export interface C2PAEdit {
  action: string;
  timestamp: string;
  software?: string;
}

// ─── AI Detection ──────────────────────────────────────────────

export interface AIDetectionResult {
  isAIGenerated: boolean;
  confidence: number;
  model?: string;
  artifacts?: string[];
  indicators?: string[];
}

// ─── Source Credibility ────────────────────────────────────────

export interface SourceCredibility {
  domain: string;
  score: number;
  category: SourceCategory;
  reputation: SourceReputation;
  factCheckRating?: string;
  bias?: PoliticalBias;
  description?: string;
}

export interface SourceCredibilityRow {
  domain: string;
  score: number;
  category: string;
  reputation: string;
  fact_check_rating: string;
  bias: string;
  description: string;
  updated_at: string;
}

// ─── Trust Score ───────────────────────────────────────────────

export interface TrustScore {
  overall: number;
  breakdown: TrustScoreBreakdown;
  factors: TrustFactor[];
}

export interface TrustScoreBreakdown {
  c2pa: number;
  aiDetection: number;
  source: number;
  community: number;
}

export interface TrustFactor {
  name: string;
  impact: TrustImpact;
  weight: number;
  description: string;
}

export interface TrustScoreResponse extends TrustScore {
  aiAnalysis: AIDetectionResult;
  claims: ClaimAnalysis[];
}

export interface ClaimAnalysis {
  claim: string;
  verifiable: boolean;
  confidence: number;
}

// ─── Stats ─────────────────────────────────────────────────────

export interface VerificationStats {
  overall: StatsTotals;
  today: StatsTotals;
}

export interface StatsTotals {
  total: number;
  authentic: number;
  suspicious: number;
  fake: number;
  avgScore: number;
  authenticPercent: number;
  suspiciousPercent: number;
  fakePercent: number;
}

export interface StatsRow {
  date: string;
  total_verifications: number;
  authentic_count: number;
  suspicious_count: number;
  fake_count: number;
  avg_trust_score: number;
}

export interface StatsTotalsRow {
  total: number;
  authentic: number;
  suspicious: number;
  fake: number;
  avg_score: number;
}

// ─── Watchlist ─────────────────────────────────────────────────

export interface WatchlistItem {
  id: string;
  userId: string;
  url: string;
  label: string;
  currentScore: number;
  previousScore: number;
  verdict: string;
  lastChecked: string;
  createdAt: string;
}

export interface WatchlistItemRow {
  id: string;
  user_id: string;
  url: string;
  label: string;
  current_score: number;
  previous_score: number;
  verdict: string;
  last_checked: string;
  created_at: string;
}

export interface WatchlistCreateInput {
  url: string;
  label?: string;
}

// ─── Alerts ────────────────────────────────────────────────────

export interface Alert {
  id: string;
  watchlistId: string;
  type: AlertType;
  message: string;
  previousScore: number;
  currentScore: number;
  read: boolean;
  createdAt: string;
}

export interface AlertRow {
  id: string;
  watchlist_id: string;
  type: string;
  message: string;
  previous_score: number;
  current_score: number;
  read: number;
  created_at: string;
}

// ─── API Keys ──────────────────────────────────────────────────

export interface ApiKey {
  id: string;
  key: string;
  userId: string;
  name: string;
  tier: ApiKeyTier;
  requestsPerDay: number;
  requestsPerMinute: number;
  totalRequests: number;
  createdAt: string;
  lastUsedAt: string | null;
  active: boolean;
}

export interface ApiKeyRow {
  id: string;
  key: string;
  user_id: string;
  name: string;
  tier: string;
  requests_per_day: number;
  requests_per_minute: number;
  total_requests: number;
  created_at: string;
  last_used_at: string | null;
  active: number;
}

export interface ApiKeyMasked {
  id: string;
  name: string;
  tier: string;
  keyPreview: string;
  requestsPerDay: number;
  requestsPerMinute: number;
  totalRequests: number;
  createdAt: string;
  lastUsedAt: string | null;
  active: boolean;
}

export interface ApiKeyRateLimit {
  minute_count: number;
  day_count: number;
  last_minute: number;
  last_day: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: string;
}

export interface UserRateLimitResult extends RateLimitResult {
  monthlyRemaining: number;
  monthlyLimit: number;
}

export interface MonthlyUsage {
  used: number;
  limit: number;
  remaining: number;
}

// ─── API Key Tier Limits ──────────────────────────────────────

export const API_KEY_TIER_LIMITS: Record<ApiKeyTier, { requestsPerDay: number; requestsPerMinute: number }> = {
  free: { requestsPerDay: 100, requestsPerMinute: 10 },
  pro: { requestsPerDay: 10_000, requestsPerMinute: 100 },
  enterprise: { requestsPerDay: 100_000, requestsPerMinute: 1_000 },
};

// ─── Plan Limits ──────────────────────────────────────────────

export const PLAN_LIMITS: Record<Plan, { verificationsLimit: number; label: string; price: number }> = {
  free: { verificationsLimit: 15, label: 'Free', price: 0 },
  consumer: { verificationsLimit: 1_000, label: 'Consumer', price: 10 },
  professional: { verificationsLimit: 10_000, label: 'Professional', price: 50 },
  enterprise: { verificationsLimit: Infinity, label: 'Enterprise', price: 0 },
};

// ─── API Responses ─────────────────────────────────────────────

export interface AuthResponse {
  user: UserPublic | null;
  message?: string;
}

export interface ErrorResponse {
  error: string;
}

export interface VerifyResponse {
  trustScore: number;
  verdict: string;
  confidence: number;
  checks: VerificationCheck[];
}

export interface StatsResponse {
  overall: StatsTotals;
  today: StatsTotals;
}

// ─── DB Row → API Mapper Types ─────────────────────────────────

export interface RowMappers {
  user: {
    toApi: (row: UserRow) => User;
    toPublic: (row: UserRow) => UserPublic;
  };
  verification: {
    toApi: (row: VerificationRow) => Verification;
  };
  watchlist: {
    toApi: (row: WatchlistItemRow) => WatchlistItem;
  };
  alert: {
    toApi: (row: AlertRow) => Alert;
  };
  apiKey: {
    toApi: (row: ApiKeyRow) => ApiKey;
    toMasked: (row: ApiKeyRow) => ApiKeyMasked;
  };
  source: {
    toApi: (row: SourceCredibilityRow) => SourceCredibility;
  };
}
