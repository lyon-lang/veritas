import { getDatabase } from './database';

interface WatchlistItem {
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

interface Alert {
  id: string;
  watchlist_id: string;
  type: string;
  message: string;
  previous_score: number;
  current_score: number;
  read: number;
  created_at: string;
}

function getDb() {
  return getDatabase();
}

export const WatchlistModel = {
  create(data: {
    userId: string;
    url: string;
    label?: string;
    initialScore?: number;
    initialVerdict?: string;
  }) {
    const db = getDb();
    const id = crypto.randomUUID();
    let label = data.label;
    if (!label) {
      try {
        label = new URL(data.url).hostname;
      } catch {
        label = data.url;
      }
    }
    const stmt = db.prepare(`
      INSERT INTO watchlist (id, user_id, url, label, current_score, previous_score, verdict, last_checked, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);
    stmt.run(id, data.userId, data.url, label, data.initialScore || 50, data.initialScore || 50, data.initialVerdict || 'unknown');
    return this.findById(id)!;
  },

  findByUser(userId: string): WatchlistItem[] {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM watchlist WHERE user_id = ? ORDER BY created_at DESC');
    return stmt.all(userId) as WatchlistItem[];
  },

  findById(id: string): WatchlistItem | null {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM watchlist WHERE id = ?');
    return stmt.get(id) as WatchlistItem | null;
  },

  update(id: string, data: {
    currentScore?: number;
    verdict?: string;
    label?: string;
  }) {
    const db = getDb();
    const item = this.findById(id);
    if (!item) return null;

    const updates: string[] = [];
    const values: any[] = [];

    if (data.currentScore !== undefined) {
      updates.push('previous_score = current_score');
      updates.push('current_score = ?');
      values.push(data.currentScore);
    }
    if (data.verdict !== undefined) {
      updates.push('verdict = ?');
      values.push(data.verdict);
    }
    if (data.label !== undefined) {
      updates.push('label = ?');
      values.push(data.label);
    }
    updates.push('last_checked = datetime(\'now\')');
    values.push(id);

    const stmt = db.prepare(`UPDATE watchlist SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    return this.findById(id);
  },

  delete(id: string) {
    const db = getDb();
    const stmt = db.prepare('DELETE FROM watchlist WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  },

  checkForAlerts(id: string, newScore: number, newVerdict: string) {
    const db = getDb();
    const item = this.findById(id);
    if (!item) return [];

    const newAlerts: Alert[] = [];

    // Score change alert (significant change = 10+ points)
    if (Math.abs(item.current_score - newScore) >= 10) {
      const alertId = crypto.randomUUID();
      const message = `Score changed from ${item.current_score} to ${newScore} (${newScore > item.current_score ? '+' : ''}${newScore - item.current_score})`;
      const stmt = db.prepare(`
        INSERT INTO alerts (id, watchlist_id, type, message, previous_score, current_score, read, created_at)
        VALUES (?, ?, 'score_change', ?, ?, ?, 0, datetime('now'))
      `);
      stmt.run(alertId, id, message, item.current_score, newScore);
      newAlerts.push(this.getAlert(alertId)!);
    }

    // Verdict change alert
    if (item.verdict !== newVerdict) {
      const alertId = crypto.randomUUID();
      const message = `Verdict changed from ${item.verdict} to ${newVerdict}`;
      const stmt = db.prepare(`
        INSERT INTO alerts (id, watchlist_id, type, message, previous_score, current_score, read, created_at)
        VALUES (?, ?, 'verdict_change', ?, ?, ?, 0, datetime('now'))
      `);
      stmt.run(alertId, id, message, item.current_score, newScore);
      newAlerts.push(this.getAlert(alertId)!);
    }

    return newAlerts;
  },

  getAlert(id: string): Alert | null {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM alerts WHERE id = ?');
    return stmt.get(id) as Alert | null;
  }
};

export const AlertsModel = {
  findByUser(userId: string, unreadOnly = false): Alert[] {
    const db = getDb();
    const watchlistIds = db.prepare('SELECT id FROM watchlist WHERE user_id = ?').all(userId).map((w: any) => w.id);
    if (watchlistIds.length === 0) return [];

    const placeholders = watchlistIds.map(() => '?').join(',');
    let query = `SELECT * FROM alerts WHERE watchlist_id IN (${placeholders})`;
    const params: any[] = [...watchlistIds];

    if (unreadOnly) {
      query += ' AND read = 0';
    }

    query += ' ORDER BY created_at DESC';

    const stmt = db.prepare(query);
    return stmt.all(...params) as Alert[];
  },

  markAsRead(alertId: string): Alert | null {
    const db = getDb();
    const stmt = db.prepare('UPDATE alerts SET read = 1 WHERE id = ?');
    stmt.run(alertId);
    const getStmt = db.prepare('SELECT * FROM alerts WHERE id = ?');
    return getStmt.get(alertId) as Alert | null;
  },

  markAllAsRead(userId: string) {
    const db = getDb();
    const watchlistIds = db.prepare('SELECT id FROM watchlist WHERE user_id = ?').all(userId).map((w: any) => w.id);
    if (watchlistIds.length === 0) return;

    const placeholders = watchlistIds.map(() => '?').join(',');
    const stmt = db.prepare(`UPDATE alerts SET read = 1 WHERE watchlist_id IN (${placeholders})`);
    stmt.run(...watchlistIds);
  },

  getUnreadCount(userId: string): number {
    const db = getDb();
    const watchlistIds = db.prepare('SELECT id FROM watchlist WHERE user_id = ?').all(userId).map((w: any) => w.id);
    if (watchlistIds.length === 0) return 0;

    const placeholders = watchlistIds.map(() => '?').join(',');
    const stmt = db.prepare(`SELECT COUNT(*) as count FROM alerts WHERE watchlist_id IN (${placeholders}) AND read = 0`);
    return (stmt.get(...watchlistIds) as any).count;
  }
};
