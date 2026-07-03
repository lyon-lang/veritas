import { Button } from '@/components/ui/button';
import { 
  Activity, ArrowUpRight, ShieldCheck, ShieldAlert, ShieldX, TrendingUp, Zap, BarChart3, Plus, Shield, Share2 
} from 'lucide-react';
import type { VerificationStats } from '@/types';
import { getTrustScoreBg, getContentTypeIcon, getTrustScoreColor, formatTime } from '../utils';

// We duplicate the DashboardVerification interface here temporarily
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

interface OverviewTabProps {
  stats: VerificationStats | null;
  verifications: DashboardVerification[];
  setActiveTab: (tab: string) => void;
  setSelectedVerification: (v: DashboardVerification) => void;
}

export function OverviewTab({ stats, verifications, setActiveTab, setSelectedVerification }: OverviewTabProps) {
  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Activity className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
              <ArrowUpRight className="h-3 w-3" /> +12%
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats?.overall.total || 0}</div>
          <div className="text-sm text-gray-500">Total verified</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-xs text-gray-500">{stats?.overall.authenticPercent || 0}%</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{stats?.overall.authentic || 0}</div>
          <div className="text-sm text-gray-500">Authentic</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <ShieldAlert className="h-5 w-5 text-yellow-600" />
            </div>
            <span className="text-xs text-gray-500">{stats?.overall.suspiciousPercent || 0}%</span>
          </div>
          <div className="text-2xl font-bold text-yellow-600">{stats?.overall.suspicious || 0}</div>
          <div className="text-sm text-gray-500">Suspicious</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <ShieldX className="h-5 w-5 text-red-600" />
            </div>
            <span className="text-xs text-gray-500">{stats?.overall.fakePercent || 0}%</span>
          </div>
          <div className="text-2xl font-bold text-red-600">{stats?.overall.fake || 0}</div>
          <div className="text-sm text-gray-500">Fake</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Average Score</div>
              <div className="text-2xl font-bold text-gray-900">{stats?.overall.avgScore || 0}</div>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${stats?.overall.avgScore || 0}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Today</div>
              <div className="text-2xl font-bold text-gray-900">{stats?.today.total || 0}</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-green-600">{stats?.today.authentic || 0} authentic</span>
            <span className="text-yellow-600">{stats?.today.suspicious || 0} suspicious</span>
            <span className="text-red-600">{stats?.today.fake || 0} fake</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Accuracy Rate</div>
              <div className="text-2xl font-bold text-gray-900">95%</div>
            </div>
          </div>
          <div className="text-sm text-gray-500">Based on user feedback</div>
        </div>
      </div>

      {/* Recent Verifications */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">Recent Verifications</h2>
            <p className="text-sm text-gray-500">Your latest verification results</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setActiveTab('history')}>
            View all <ArrowUpRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {verifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {verifications.slice(0, 5).map((v) => (
              <div key={v.id} className="px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setSelectedVerification(v)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTrustScoreBg(v.trust_score)}`}>
                      {getContentTypeIcon(v.content_type)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {v.url || `${v.content_type} content`}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{formatTime(v.created_at)}</span>
                        <span>•</span>
                        <span className="capitalize">{v.content_type}</span>
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
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        window.open(`/report/${v.id}`, '_blank');
                      }} 
                      className="p-1 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                      title="Share verification"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No verifications yet</h3>
            <p className="text-sm text-gray-500 mb-6">Start verifying content to see your history here</p>
            <Button onClick={() => document.querySelector('input')?.focus()} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Verify content
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
