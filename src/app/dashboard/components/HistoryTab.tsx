import { Button } from '@/components/ui/button';
import { Filter, Download, History, Copy } from 'lucide-react';
import { getTrustScoreBg, getContentTypeIcon, getTrustScoreColor } from '../utils';

interface DashboardVerification {
  id: string;
  url?: string;
  content_type: string;
  trust_score: number;
  verdict: string;
  confidence: number;
  checks: any[];
  created_at: string;
}

interface HistoryTabProps {
  verifications: DashboardVerification[];
  filteredVerifications: DashboardVerification[];
  setSelectedVerification: (v: DashboardVerification) => void;
  showFilters: boolean;
  setShowFilters: (val: boolean) => void;
  filterType: string;
  setFilterType: (val: string) => void;
  filterVerdict: string;
  setFilterVerdict: (val: string) => void;
  exportData: () => void;
}

export function HistoryTab({
  verifications,
  filteredVerifications,
  setSelectedVerification,
  showFilters,
  setShowFilters,
  filterType,
  setFilterType,
  filterVerdict,
  setFilterVerdict,
  exportData
}: HistoryTabProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-gray-900">Verification History</h2>
            <p className="text-sm text-gray-500">{verifications.length} total verifications</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="sm" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg mb-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Type</label>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="text-sm border border-gray-200 rounded-md px-3 py-1.5">
                <option value="all">All types</option>
                <option value="url">URL</option>
                <option value="text">Text</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Verdict</label>
              <select value={filterVerdict} onChange={(e) => setFilterVerdict(e.target.value)} className="text-sm border border-gray-200 rounded-md px-3 py-1.5">
                <option value="all">All verdicts</option>
                <option value="authentic">Authentic</option>
                <option value="suspicious">Suspicious</option>
                <option value="fake">Fake</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="ghost" size="sm" onClick={() => { setFilterType('all'); setFilterVerdict('all'); }}>
                Clear filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {filteredVerifications.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {filteredVerifications.map((v) => (
            <div key={v.id} className="px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setSelectedVerification(v)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTrustScoreBg(v.trust_score)}`}>
                    {getContentTypeIcon(v.content_type)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-md">
                      {v.url || `${v.content_type} content`}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{new Date(v.created_at).toLocaleString()}</span>
                      <span>•</span>
                      <span className="capitalize">{v.content_type}</span>
                      <span>•</span>
                      <span>Confidence: {v.confidence}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    v.verdict === 'authentic' ? 'bg-green-100 text-green-700' :
                    v.verdict === 'suspicious' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>{v.verdict}</span>
                  <div className={`text-lg font-bold ${getTrustScoreColor(v.trust_score)}`}>{v.trust_score}</div>
                  <button onClick={(e) => { e.stopPropagation(); copyToClipboard(v.url || ''); }} className="p-1 text-gray-400 hover:text-gray-600">
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center">
          <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No verifications found</h3>
          <p className="text-sm text-gray-500">
            {filterType !== 'all' || filterVerdict !== 'all' ? 'Try adjusting your filters' : 'Start verifying content to see your history'}
          </p>
        </div>
      )}
    </div>
  );
}
