import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'veritas.db');

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    
    // Enable WAL mode for better performance
    db.pragma('journal_mode = WAL');
    
    // Initialize tables
    initializeDatabase(db);
  }
  
  return db;
}

function initializeDatabase(db: Database.Database) {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      password_hash TEXT,
      plan TEXT DEFAULT 'free',
      verifications_today INTEGER DEFAULT 0,
      verifications_limit INTEGER DEFAULT 5,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Verifications table
  db.exec(`
    CREATE TABLE IF NOT EXISTS verifications (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      url TEXT,
      content_type TEXT NOT NULL,
      content_hash TEXT,
      trust_score INTEGER NOT NULL,
      verdict TEXT NOT NULL,
      confidence INTEGER NOT NULL,
      checks TEXT,
      c2pa_data TEXT,
      ai_detection TEXT,
      source_data TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Source credibility table
  db.exec(`
    CREATE TABLE IF NOT EXISTS source_credibility (
      domain TEXT PRIMARY KEY,
      score INTEGER NOT NULL,
      category TEXT,
      reputation TEXT,
      fact_check_rating TEXT,
      bias TEXT,
      description TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Verification stats table
  db.exec(`
    CREATE TABLE IF NOT EXISTS verification_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      total_verifications INTEGER DEFAULT 0,
      authentic_count INTEGER DEFAULT 0,
      suspicious_count INTEGER DEFAULT 0,
      fake_count INTEGER DEFAULT 0,
      avg_trust_score REAL DEFAULT 0
    )
  `);

  // Insert default source credibility data
  const defaultSources = [
    { domain: 'reuters.com', score: 95, category: 'news', reputation: 'high', bias: 'center', fact_check_rating: 'highly factual', description: 'International news organization' },
    { domain: 'apnews.com', score: 95, category: 'news', reputation: 'high', bias: 'center', fact_check_rating: 'highly factual', description: 'Associated Press' },
    { domain: 'bbc.com', score: 92, category: 'news', reputation: 'high', bias: 'center', fact_check_rating: 'highly factual', description: 'British broadcaster' },
    { domain: 'nytimes.com', score: 88, category: 'news', reputation: 'high', bias: 'left-center', fact_check_rating: 'highly factual', description: 'American newspaper' },
    { domain: 'washingtonpost.com', score: 87, category: 'news', reputation: 'high', bias: 'left-center', fact_check_rating: 'highly factual', description: 'American newspaper' },
    { domain: 'theguardian.com', score: 85, category: 'news', reputation: 'high', bias: 'left-center', fact_check_rating: 'mostly factual', description: 'British newspaper' },
    { domain: 'wsj.com', score: 86, category: 'news', reputation: 'high', bias: 'right-center', fact_check_rating: 'highly factual', description: 'Wall Street Journal' },
    { domain: 'bloomberg.com', score: 88, category: 'news', reputation: 'high', bias: 'center', fact_check_rating: 'highly factual', description: 'Financial news' },
    { domain: 'nature.com', score: 98, category: 'science', reputation: 'high', bias: 'center', fact_check_rating: 'peer-reviewed', description: 'Scientific journal' },
    { domain: 'science.org', score: 98, category: 'science', reputation: 'high', bias: 'center', fact_check_rating: 'peer-reviewed', description: 'Science journal' },
  ];

  const insertSource = db.prepare(`
    INSERT OR IGNORE INTO source_credibility (domain, score, category, reputation, bias, fact_check_rating, description)
    VALUES (@domain, @score, @category, @reputation, @bias, @fact_check_rating, @description)
  `);

  for (const source of defaultSources) {
    insertSource.run(source);
  }
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}
