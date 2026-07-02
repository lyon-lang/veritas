// In-memory watchlist storage
// For production, use database

interface WatchlistItem {
  id: string;
  userId: string;
  url: string;
  label: string;
  currentScore: number;
  previousScore: number;
  verdict: string;
  lastChecked: string;
  createdAt: string;
  alerts: Alert[];
}

interface Alert {
  id: string;
  watchlistId: string;
  type: 'score_change' | 'verdict_change' | 'manipulation_detected';
  message: string;
  previousScore: number;
  currentScore: number;
  read: boolean;
  createdAt: string;
}

// In-memory storage
const watchlist: Map<string, WatchlistItem> = new Map();
const alerts: Alert[] = [];

export const WatchlistModel = {
  create(data: {
    userId: string;
    url: string;
    label?: string;
    initialScore?: number;
    initialVerdict?: string;
  }) {
    const id = crypto.randomUUID();
    const item: WatchlistItem = {
      id,
      userId: data.userId,
      url: data.url,
      label: data.label || new URL(data.url).hostname,
      currentScore: data.initialScore || 50,
      previousScore: data.initialScore || 50,
      verdict: data.initialVerdict || 'unknown',
      lastChecked: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      alerts: [],
    };
    watchlist.set(id, item);
    return item;
  },

  findByUser(userId: string) {
    return Array.from(watchlist.values())
      .filter(item => item.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  findById(id: string) {
    return watchlist.get(id) || null;
  },

  update(id: string, data: {
    currentScore?: number;
    verdict?: string;
    label?: string;
  }) {
    const item = watchlist.get(id);
    if (!item) return null;

    if (data.currentScore !== undefined) {
      item.previousScore = item.currentScore;
      item.currentScore = data.currentScore;
    }
    if (data.verdict !== undefined) {
      item.verdict = data.verdict;
    }
    if (data.label !== undefined) {
      item.label = data.label;
    }
    item.lastChecked = new Date().toISOString();

    watchlist.set(id, item);
    return item;
  },

  delete(id: string) {
    return watchlist.delete(id);
  },

  // Check for score changes and create alerts
  checkForAlerts(id: string, newScore: number, newVerdict: string) {
    const item = watchlist.get(id);
    if (!item) return [];

    const newAlerts: Alert[] = [];

    // Score change alert (significant change = 10+ points)
    if (Math.abs(item.currentScore - newScore) >= 10) {
      const alert: Alert = {
        id: crypto.randomUUID(),
        watchlistId: id,
        type: 'score_change',
        message: `Score changed from ${item.currentScore} to ${newScore} (${newScore > item.currentScore ? '+' : ''}${newScore - item.currentScore})`,
        previousScore: item.currentScore,
        currentScore: newScore,
        read: false,
        createdAt: new Date().toISOString(),
      };
      newAlerts.push(alert);
      alerts.push(alert);
    }

    // Verdict change alert
    if (item.verdict !== newVerdict) {
      const alert: Alert = {
        id: crypto.randomUUID(),
        watchlistId: id,
        type: 'verdict_change',
        message: `Verdict changed from ${item.verdict} to ${newVerdict}`,
        previousScore: item.currentScore,
        currentScore: newScore,
        read: false,
        createdAt: new Date().toISOString(),
      };
      newAlerts.push(alert);
      alerts.push(alert);
    }

    return newAlerts;
  }
};

export const AlertsModel = {
  findByUser(userId: string, unreadOnly = false) {
    const userWatchlist = WatchlistModel.findByUser(userId);
    const watchlistIds = new Set(userWatchlist.map(w => w.id));

    let userAlerts = alerts.filter(a => watchlistIds.has(a.watchlistId));

    if (unreadOnly) {
      userAlerts = userAlerts.filter(a => !a.read);
    }

    return userAlerts.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  markAsRead(alertId: string) {
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      alert.read = true;
    }
    return alert;
  },

  markAllAsRead(userId: string) {
    const userWatchlist = WatchlistModel.findByUser(userId);
    const watchlistIds = new Set(userWatchlist.map(w => w.id));

    alerts.forEach(a => {
      if (watchlistIds.has(a.watchlistId)) {
        a.read = true;
      }
    });
  },

  getUnreadCount(userId: string) {
    const userWatchlist = WatchlistModel.findByUser(userId);
    const watchlistIds = new Set(userWatchlist.map(w => w.id));
    return alerts.filter(a => watchlistIds.has(a.watchlistId) && !a.read).length;
  }
};
