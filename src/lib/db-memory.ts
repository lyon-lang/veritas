// In-memory database for Vercel (serverless compatible)
// For production, switch to Vercel Postgres, Turso, or your Hostinger VPS

interface User {
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

interface Verification {
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

interface SourceCredibility {
  domain: string;
  score: number;
  category: string;
  reputation: string;
  fact_check_rating: string;
  bias: string;
  description: string;
  updated_at: string;
}

// In-memory storage
const users: Map<string, User> = new Map();
const verifications: Verification[] = [];
const sourceCredibility: Map<string, SourceCredibility> = new Map();

// Initialize default sources
const defaultSources: SourceCredibility[] = [
  { domain: 'reuters.com', score: 95, category: 'news', reputation: 'high', bias: 'center', fact_check_rating: 'highly factual', description: 'International news organization', updated_at: new Date().toISOString() },
  { domain: 'apnews.com', score: 95, category: 'news', reputation: 'high', bias: 'center', fact_check_rating: 'highly factual', description: 'Associated Press', updated_at: new Date().toISOString() },
  { domain: 'bbc.com', score: 92, category: 'news', reputation: 'high', bias: 'center', fact_check_rating: 'highly factual', description: 'British broadcaster', updated_at: new Date().toISOString() },
  { domain: 'nytimes.com', score: 88, category: 'news', reputation: 'high', bias: 'left-center', fact_check_rating: 'highly factual', description: 'American newspaper', updated_at: new Date().toISOString() },
  { domain: 'washingtonpost.com', score: 87, category: 'news', reputation: 'high', bias: 'left-center', fact_check_rating: 'highly factual', description: 'American newspaper', updated_at: new Date().toISOString() },
  { domain: 'theguardian.com', score: 85, category: 'news', reputation: 'high', bias: 'left-center', fact_check_rating: 'mostly factual', description: 'British newspaper', updated_at: new Date().toISOString() },
  { domain: 'wsj.com', score: 86, category: 'news', reputation: 'high', bias: 'right-center', fact_check_rating: 'highly factual', description: 'Wall Street Journal', updated_at: new Date().toISOString() },
  { domain: 'bloomberg.com', score: 88, category: 'news', reputation: 'high', bias: 'center', fact_check_rating: 'highly factual', description: 'Financial news', updated_at: new Date().toISOString() },
  { domain: 'nature.com', score: 98, category: 'science', reputation: 'high', bias: 'center', fact_check_rating: 'peer-reviewed', description: 'Scientific journal', updated_at: new Date().toISOString() },
  { domain: 'science.org', score: 98, category: 'science', reputation: 'high', bias: 'center', fact_check_rating: 'peer-reviewed', description: 'Science journal', updated_at: new Date().toISOString() },
  { domain: 'youtube.com', score: 50, category: 'video', reputation: 'medium', bias: 'center', fact_check_rating: 'user-generated', description: 'Video platform', updated_at: new Date().toISOString() },
  { domain: 'twitter.com', score: 55, category: 'social', reputation: 'medium', bias: 'center', fact_check_rating: 'user-generated', description: 'Social media', updated_at: new Date().toISOString() },
  { domain: 'x.com', score: 55, category: 'social', reputation: 'medium', bias: 'center', fact_check_rating: 'user-generated', description: 'Social media', updated_at: new Date().toISOString() },
  { domain: 'facebook.com', score: 55, category: 'social', reputation: 'medium', bias: 'center', fact_check_rating: 'user-generated', description: 'Social media', updated_at: new Date().toISOString() },
  { domain: 'instagram.com', score: 50, category: 'social', reputation: 'medium', bias: 'center', fact_check_rating: 'user-generated', description: 'Social media', updated_at: new Date().toISOString() },
  { domain: 'tiktok.com', score: 45, category: 'social', reputation: 'medium', bias: 'center', fact_check_rating: 'user-generated', description: 'Video platform', updated_at: new Date().toISOString() },
];

// Initialize sources
defaultSources.forEach(source => {
  sourceCredibility.set(source.domain, source);
});

// User operations
export const UserModel = {
  create(email: string, name: string, passwordHash: string) {
    const id = crypto.randomUUID();
    const user: User = {
      id,
      email,
      name,
      password_hash: passwordHash,
      plan: 'free',
      verifications_today: 0,
      verifications_limit: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    users.set(email, user);
    return { id, email, name };
  },

  findByEmail(email: string) {
    return users.get(email) || null;
  },

  findById(id: string) {
    for (const user of users.values()) {
      if (user.id === id) return user;
    }
    return null;
  },

  updatePlan(id: string, plan: string) {
    for (const [email, user] of users.entries()) {
      if (user.id === id) {
        user.plan = plan;
        user.updated_at = new Date().toISOString();
        users.set(email, user);
        break;
      }
    }
  },

  incrementVerifications(id: string) {
    for (const [email, user] of users.entries()) {
      if (user.id === id) {
        user.verifications_today++;
        user.updated_at = new Date().toISOString();
        users.set(email, user);
        break;
      }
    }
  },

  resetDailyVerifications() {
    for (const [email, user] of users.entries()) {
      user.verifications_today = 0;
      users.set(email, user);
    }
  }
};

// Verification operations
export const VerificationModel = {
  create(data: {
    userId?: string;
    url?: string;
    contentType: string;
    contentHash?: string;
    trustScore: number;
    verdict: string;
    confidence: number;
    checks: any;
    c2paData?: any;
    aiDetection?: any;
    sourceData?: any;
  }) {
    const id = crypto.randomUUID();
    const verification: Verification = {
      id,
      user_id: data.userId || null,
      url: data.url || null,
      content_type: data.contentType,
      content_hash: data.contentHash || null,
      trust_score: data.trustScore,
      verdict: data.verdict,
      confidence: data.confidence,
      checks: JSON.stringify(data.checks),
      c2pa_data: data.c2paData ? JSON.stringify(data.c2paData) : null,
      ai_detection: data.aiDetection ? JSON.stringify(data.aiDetection) : null,
      source_data: data.sourceData ? JSON.stringify(data.sourceData) : null,
      created_at: new Date().toISOString(),
    };
    
    verifications.push(verification);
    return { id, ...data };
  },

  findByUser(userId: string, limit = 50, offset = 0) {
    return verifications
      .filter(v => v.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(offset, offset + limit);
  },

  findById(id: string) {
    return verifications.find(v => v.id === id) || null;
  },

  getStats(userId?: string) {
    const filtered = userId 
      ? verifications.filter(v => v.user_id === userId)
      : verifications;
    
    return {
      total: filtered.length,
      authentic: filtered.filter(v => v.verdict === 'authentic').length,
      suspicious: filtered.filter(v => v.verdict === 'suspicious').length,
      fake: filtered.filter(v => v.verdict === 'fake').length,
      avg_score: filtered.length > 0 
        ? filtered.reduce((sum, v) => sum + v.trust_score, 0) / filtered.length 
        : 0,
    };
  },

  getRecent(limit = 10) {
    return verifications
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  }
};

// Source credibility operations
export const SourceModel = {
  findByDomain(domain: string) {
    return sourceCredibility.get(domain) || null;
  },

  upsert(data: {
    domain: string;
    score: number;
    category: string;
    reputation: string;
    factCheckRating?: string;
    bias?: string;
    description?: string;
  }) {
    const source: SourceCredibility = {
      domain: data.domain,
      score: data.score,
      category: data.category,
      reputation: data.reputation,
      fact_check_rating: data.factCheckRating || 'unknown',
      bias: data.bias || 'unknown',
      description: data.description || '',
      updated_at: new Date().toISOString(),
    };
    sourceCredibility.set(data.domain, source);
    return source;
  },

  getAll() {
    return Array.from(sourceCredibility.values()).sort((a, b) => b.score - a.score);
  }
};

// Stats operations
export const StatsModel = {
  getDaily(date?: string) {
    const today = date || new Date().toISOString().split('T')[0];
    const dayVerifications = verifications.filter(v => v.created_at.startsWith(today));
    
    return {
      date: today,
      total_verifications: dayVerifications.length,
      authentic_count: dayVerifications.filter(v => v.verdict === 'authentic').length,
      suspicious_count: dayVerifications.filter(v => v.verdict === 'suspicious').length,
      fake_count: dayVerifications.filter(v => v.verdict === 'fake').length,
      avg_trust_score: dayVerifications.length > 0
        ? dayVerifications.reduce((sum, v) => sum + v.trust_score, 0) / dayVerifications.length
        : 0,
    };
  },

  getRange(startDate: string, endDate: string) {
    const days: any[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
      days.push(this.getDaily(d.toISOString().split('T')[0]));
    }
    
    return days;
  },

  getTotals() {
    return {
      total: verifications.length,
      authentic: verifications.filter(v => v.verdict === 'authentic').length,
      suspicious: verifications.filter(v => v.verdict === 'suspicious').length,
      fake: verifications.filter(v => v.verdict === 'fake').length,
      avg_score: verifications.length > 0
        ? verifications.reduce((sum, v) => sum + v.trust_score, 0) / verifications.length
        : 0,
    };
  }
};
