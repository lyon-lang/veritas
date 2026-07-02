import { getDatabase } from './database';

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

function getDb() {
  return getDatabase();
}

// User operations
export const UserModel = {
  create(email: string, name: string, passwordHash: string) {
    const db = getDb();
    const id = crypto.randomUUID();
    const stmt = db.prepare(`
      INSERT INTO users (id, email, name, password_hash, plan, verifications_today, verifications_limit, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'free', 0, 5, datetime('now'), datetime('now'))
    `);
    stmt.run(id, email, name, passwordHash);
    return { id, email, name };
  },

  findByEmail(email: string): User | null {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email) as User | null;
  },

  findById(id: string): User | null {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id) as User | null;
  },

  updatePlan(id: string, plan: string) {
    const db = getDb();
    const stmt = db.prepare('UPDATE users SET plan = ?, updated_at = datetime(\'now\') WHERE id = ?');
    stmt.run(plan, id);
  },

  incrementVerifications(id: string) {
    const db = getDb();
    const stmt = db.prepare('UPDATE users SET verifications_today = verifications_today + 1, updated_at = datetime(\'now\') WHERE id = ?');
    stmt.run(id);
  },

  resetDailyVerifications() {
    const db = getDb();
    const stmt = db.prepare('UPDATE users SET verifications_today = 0, updated_at = datetime(\'now\')');
    stmt.run();
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
    const db = getDb();
    const id = crypto.randomUUID();
    const stmt = db.prepare(`
      INSERT INTO verifications (id, user_id, url, content_type, content_hash, trust_score, verdict, confidence, checks, c2pa_data, ai_detection, source_data, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `);
    stmt.run(
      id,
      data.userId || null,
      data.url || null,
      data.contentType,
      data.contentHash || null,
      data.trustScore,
      data.verdict,
      data.confidence,
      JSON.stringify(data.checks),
      data.c2paData ? JSON.stringify(data.c2paData) : null,
      data.aiDetection ? JSON.stringify(data.aiDetection) : null,
      data.sourceData ? JSON.stringify(data.sourceData) : null
    );
    return { id, ...data };
  },

  findByUser(userId: string, limit = 50, offset = 0): Verification[] {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM verifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?');
    return stmt.all(userId, limit, offset) as Verification[];
  },

  findById(id: string): Verification | null {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM verifications WHERE id = ?');
    return stmt.get(id) as Verification | null;
  },

  getStats(userId?: string) {
    const db = getDb();
    let stmt;
    if (userId) {
      stmt = db.prepare(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN verdict = 'authentic' THEN 1 ELSE 0 END) as authentic,
          SUM(CASE WHEN verdict = 'suspicious' THEN 1 ELSE 0 END) as suspicious,
          SUM(CASE WHEN verdict = 'fake' THEN 1 ELSE 0 END) as fake,
          AVG(trust_score) as avg_score
        FROM verifications WHERE user_id = ?
      `);
      return stmt.get(userId) as { total: number; authentic: number; suspicious: number; fake: number; avg_score: number };
    } else {
      stmt = db.prepare(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN verdict = 'authentic' THEN 1 ELSE 0 END) as authentic,
          SUM(CASE WHEN verdict = 'suspicious' THEN 1 ELSE 0 END) as suspicious,
          SUM(CASE WHEN verdict = 'fake' THEN 1 ELSE 0 END) as fake,
          AVG(trust_score) as avg_score
        FROM verifications
      `);
      return stmt.get() as { total: number; authentic: number; suspicious: number; fake: number; avg_score: number };
    }
  },

  getRecent(limit = 10): Verification[] {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM verifications ORDER BY created_at DESC LIMIT ?');
    return stmt.all(limit) as Verification[];
  }
};

// Source credibility operations
export const SourceModel = {
  findByDomain(domain: string): SourceCredibility | null {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM source_credibility WHERE domain = ?');
    return stmt.get(domain) as SourceCredibility | null;
  },

  upsert(data: {
    domain: string;
    score: number;
    category: string;
    reputation: string;
    factCheckRating?: string;
    bias?: string;
    description?: string;
  }): SourceCredibility {
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO source_credibility (domain, score, category, reputation, fact_check_rating, bias, description, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
      ON CONFLICT(domain) DO UPDATE SET
        score = excluded.score,
        category = excluded.category,
        reputation = excluded.reputation,
        fact_check_rating = excluded.fact_check_rating,
        bias = excluded.bias,
        description = excluded.description,
        updated_at = datetime('now')
    `);
    stmt.run(
      data.domain,
      data.score,
      data.category,
      data.reputation,
      data.factCheckRating || 'unknown',
      data.bias || 'unknown',
      data.description || ''
    );
    return this.findByDomain(data.domain)!;
  },

  getAll(): SourceCredibility[] {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM source_credibility ORDER BY score DESC');
    return stmt.all() as SourceCredibility[];
  }
};

// Stats operations
export const StatsModel = {
  getDaily(date?: string) {
    const db = getDb();
    const today = date || new Date().toISOString().split('T')[0];
    const stmt = db.prepare(`
      SELECT 
        ? as date,
        COUNT(*) as total_verifications,
        SUM(CASE WHEN verdict = 'authentic' THEN 1 ELSE 0 END) as authentic_count,
        SUM(CASE WHEN verdict = 'suspicious' THEN 1 ELSE 0 END) as suspicious_count,
        SUM(CASE WHEN verdict = 'fake' THEN 1 ELSE 0 END) as fake_count,
        AVG(trust_score) as avg_trust_score
      FROM verifications
      WHERE DATE(created_at) = ?
    `);
    return stmt.get(today, today) as {
      date: string;
      total_verifications: number;
      authentic_count: number;
      suspicious_count: number;
      fake_count: number;
      avg_trust_score: number;
    };
  },

  getRange(startDate: string, endDate: string) {
    const db = getDb();
    const stmt = db.prepare(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as total_verifications,
        SUM(CASE WHEN verdict = 'authentic' THEN 1 ELSE 0 END) as authentic_count,
        SUM(CASE WHEN verdict = 'suspicious' THEN 1 ELSE 0 END) as suspicious_count,
        SUM(CASE WHEN verdict = 'fake' THEN 1 ELSE 0 END) as fake_count,
        AVG(trust_score) as avg_trust_score
      FROM verifications
      WHERE DATE(created_at) BETWEEN ? AND ?
      GROUP BY DATE(created_at)
      ORDER BY date
    `);
    return stmt.all(startDate, endDate) as Array<{
      date: string;
      total_verifications: number;
      authentic_count: number;
      suspicious_count: number;
      fake_count: number;
      avg_trust_score: number;
    }>;
  },

  getTotals() {
    const db = getDb();
    const stmt = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN verdict = 'authentic' THEN 1 ELSE 0 END) as authentic,
        SUM(CASE WHEN verdict = 'suspicious' THEN 1 ELSE 0 END) as suspicious,
        SUM(CASE WHEN verdict = 'fake' THEN 1 ELSE 0 END) as fake,
        AVG(trust_score) as avg_score
      FROM verifications
    `);
    return stmt.get() as {
      total: number;
      authentic: number;
      suspicious: number;
      fake: number;
      avg_score: number;
    };
  }
};
