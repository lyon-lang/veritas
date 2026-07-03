import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Clock, X, Bell } from 'lucide-react';
import type { WatchlistItem, Alert, Plan } from '@/types';

// Temporarily define UpgradePrompt locally or assume it's passed or imported
// For now, I'll pass it as a prop since it's probably defined in page.tsx or we'll need to move it to a component
import { UpgradePrompt } from './UpgradePrompt';

interface WatchlistTabProps {
  watchlist: WatchlistItem[];
  alerts: Alert[];
  loadWatchlist: () => void;
  setError: (err: string | null) => void;
}

export function WatchlistTab({ watchlist, alerts, loadWatchlist, setError }: WatchlistTabProps) {
  const [showAddToWatchlist, setShowAddToWatchlist] = useState(false);
  const [watchlistUrl, setWatchlistUrl] = useState('');
  const [watchlistLabel, setWatchlistLabel] = useState('');

  const addToWatchlist = async () => {
    if (!watchlistUrl) return;
    
    try {
      const csrfToken = document.cookie.match(/csrf_token=([^;]+)/)?.[1];
      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken || '',
        },
        body: JSON.stringify({ 
          url: watchlistUrl,
          label: watchlistLabel || undefined
        }),
      });
      
      if (res.ok) {
        setShowAddToWatchlist(false);
        setWatchlistUrl('');
        setWatchlistLabel('');
        loadWatchlist();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to add to watchlist');
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      setError('Failed to add to watchlist');
    }
  };

  const removeFromWatchlist = async (id: string) => {
    try {
      const csrfToken = document.cookie.match(/csrf_token=([^;]+)/)?.[1];
      const res = await fetch(`/api/watchlist?id=${id}`, { 
        method: 'DELETE',
        headers: {
          'x-csrf-token': csrfToken || '',
        }
      });
      if (res.ok) {
        loadWatchlist();
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add to Watchlist */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-gray-900">Watchlist</h2>
            <p className="text-sm text-gray-500">Monitor content and get alerts when trust scores change</p>
          </div>
          <Button onClick={() => setShowAddToWatchlist(true)} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Add to Watchlist
          </Button>
        </div>

        {/* Add Form */}
        {showAddToWatchlist && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={watchlistUrl}
                onChange={(e) => setWatchlistUrl(e.target.value)}
                placeholder="Enter URL to monitor..."
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm"
              />
              <input
                type="text"
                value={watchlistLabel}
                onChange={(e) => setWatchlistLabel(e.target.value)}
                placeholder="Label (optional)"
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm"
              />
              <div className="flex items-center gap-2">
                <Button onClick={addToWatchlist} className="bg-emerald-600 hover:bg-emerald-700">Add</Button>
                <Button variant="ghost" onClick={() => setShowAddToWatchlist(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {/* Watchlist Items */}
        {watchlist.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {watchlist.map((item) => (
              <div key={item.id} className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    item.currentScore >= 80 ? 'bg-green-50' :
                    item.currentScore >= 60 ? 'bg-yellow-50' :
                    'bg-red-50'
                  }`}>
                    <Clock className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{item.label}</div>
                    <div className="text-xs text-gray-500 truncate">{item.url}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      item.currentScore >= 80 ? 'text-green-600' :
                      item.currentScore >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>{item.currentScore}</div>
                    <div className="text-xs text-gray-500">{item.verdict}</div>
                  </div>
                  <button onClick={() => removeFromWatchlist(item.id)} className="p-1 text-gray-400 hover:text-red-600">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items in watchlist</h3>
            <p className="text-sm text-gray-500">Add content to monitor and get alerts when trust scores change</p>
          </div>
        )}
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Recent Alerts</h2>
        {alerts.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {alerts.slice(0, 10).map((alert) => (
              <div key={alert.id} className={`py-3 ${!alert.read ? 'bg-emerald-50 -mx-6 px-6' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    alert.type === 'verdict_change' ? 'bg-red-500' :
                    alert.type === 'score_change' ? 'bg-yellow-500' :
                    'bg-emerald-500'
                  }`} />
                  <div>
                    <div className="text-sm text-gray-900">{alert.message}</div>
                    <div className="text-xs text-gray-500 mt-1">{new Date(alert.createdAt).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts yet</h3>
            <p className="text-sm text-gray-500">You'll receive alerts when watched content changes</p>
          </div>
        )}
      </div>
    </div>
  );
}
