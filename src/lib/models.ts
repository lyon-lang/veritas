import { getDatabase } from './database';
import { v4 as uuidv4 } from 'uuid';

// User operations
export const UserModel = {
  create(email: string, name: string, passwordHash: string) {
    const db = getDatabase();
    const id = uuidv4();
    
    db.prepare(`
      INSERT INTO users (id, email, name, password_hash)
      VALUES (?, ?, ?, ?)
    `).run(id, email, name, passwordHash);
    
    return { id, email, name };
  },

  findByEmail(email: string) {
    const db = getDatabase();
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  },

  findById(id: string) {
    const db = getDatabase();
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  },

  updatePlan(id: string, plan: string) {
    const db = getDatabase();
    db.prepare('UPDATE users SET plan = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(plan, id);
  },

  incrementVerifications(id: string) {
    const db = getDatabase();
    db.prepare(`
      UPDATE users 
      SET verifications_today = verifications_today + 1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(id);
  },

  resetDailyVerifications() {
    const db = getDatabase();
    db.prepare('UPDATE users SET verifications_today = 0').run();
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
    const db = getDatabase();
    const id = uuidv4();
    
    db.prepare(`
      INSERT INTO verifications (id, user_id, url, content_type, content_hash, trust_score, verdict, confidence, checks, c2pa_data, ai_detection, source_data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
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
    
    // Update stats
    updateDailyStats(data.trustScore, data.verdict);
    
    return { id, ...data };
  },

  findByUser(userId: string, limit = 50, offset = 0) {
    const db = getDatabase();
    return db.prepare(`
      SELECT * FROM verifications 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `).all(userId, limit, offset);
  },

  findById(id: string) {
    const db = getDatabase();
    return db.prepare('SELECT * FROM verifications WHERE id = ?').get(id);
  },

  getStats(userId?: string) {
    const db = getDatabase();
    
    let query = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN verdict = 'authentic' THEN 1 ELSE 0 END) as authentic,
        SUM(CASE WHEN verdict = 'suspicious' THEN 1 ELSE 0 END) as suspicious,
        SUM(CASE WHEN verdict = 'fake' THEN 1 ELSE 0 END) as fake,
        AVG(trust_score) as avg_score
      FROM verifications
    `;
    
    if (userId) {
      query += ' WHERE user_id = ?';
      return db.prepare(query).get(userId);
    }
    
    return db.prepare(query).get();
  },

  getRecent(limit = 10) {
    const db = getDatabase();
    return db.prepare(`
      SELECT * FROM verifications 
      ORDER BY created_at DESC 
      LIMIT ?
    `).all(limit);
  }
};

// Source credibility operations
export const SourceModel = {
  findByDomain(domain: string) {
    const db = getDatabase();
    return db.prepare('SELECT * FROM source_credibility WHERE domain = ?').get(domain);
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
    const db = getDatabase();
    
    db.prepare(`
      INSERT OR REPLACE INTO source_credibility (domain, score, category, reputation, fact_check_rating, bias, description, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(data.domain, data.score, data.category, data.reputation, data.factCheckRating || null, data.bias || null, data.description || null);
    
    return data;
  },

  getAll() {
    const db = getDatabase();
    return db.prepare('SELECT * FROM source_credibility ORDER BY score DESC').all();
  }
};

// Stats operations
function updateDailyStats(trustScore: number, verdict: string) {
  const db = getDatabase();
  const today = new Date().toISOString().split('T')[0];
  
  // Get or create today's stats
  let stats = db.prepare('SELECT * FROM verification_stats WHERE date = ?').get(today) as any;
  
  if (!stats) {
    db.prepare('INSERT INTO verification_stats (date) VALUES (?)').run(today);
    stats = { date: today, total_verifications: 0, authentic_count: 0, suspicious_count: 0, fake_count: 0, avg_trust_score: 0 };
  }
  
  // Update stats
  const newTotal = stats.total_verifications + 1;
  const newAvg = ((stats.avg_trust_score * stats.total_verifications) + trustScore) / newTotal;
  
  db.prepare(`
    UPDATE verification_stats 
    SET total_verifications = ?,
        authentic_count = authentic_count + ?,
        suspicious_count = suspicious_count + ?,
        fake_count = fake_count + ?,
        avg_trust_score = ?
    WHERE date = ?
  `).run(
    newTotal,
    verdict === 'authentic' ? 1 : 0,
    verdict === 'suspicious' ? 1 : 0,
    verdict === 'fake' ? 1 : 0,
    newAvg,
    today
  );
}

export const StatsModel = {
  getDaily(date?: string) {
    const db = getDatabase();
    const targetDate = date || new Date().toISOString().split('T')[0];
    return db.prepare('SELECT * FROM verification_stats WHERE date = ?').get(targetDate);
  },

  getRange(startDate: string, endDate: string) {
    const db = getDatabase();
    return db.prepare(`
      SELECT * FROM verification_stats 
      WHERE date BETWEEN ? AND ?
      ORDER BY date DESC
    `).all(startDate, endDate);
  },

  getTotals() {
    const db = getDatabase();
    return db.prepare(`
      SELECT 
        SUM(total_verifications) as total,
        SUM(authentic_count) as authentic,
        SUM(suspicious_count) as suspicious,
        SUM(fake_count) as fake,
        AVG(avg_trust_score) as avg_score
      FROM verification_stats
    `).get();
  }
};
