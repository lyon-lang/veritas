import type { VerificationStats } from '@/types';
import { UpgradePrompt } from './UpgradePrompt';

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

interface AnalyticsTabProps {
  stats: VerificationStats | null;
  verifications: DashboardVerification[];
}

export function AnalyticsTab({ stats, verifications }: AnalyticsTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verdict Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Verdict Distribution</h3>
          <div className="space-y-4">
            {[
              { label: 'Authentic', count: stats?.overall.authentic || 0, percent: stats?.overall.authenticPercent || 0, color: 'bg-green-500' },
              { label: 'Suspicious', count: stats?.overall.suspicious || 0, percent: stats?.overall.suspiciousPercent || 0, color: 'bg-yellow-500' },
              { label: 'Fake', count: stats?.overall.fake || 0, percent: stats?.overall.fakePercent || 0, color: 'bg-red-500' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <span className="text-sm font-medium text-gray-900">{item.count} ({item.percent}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={`${item.color} h-2 rounded-full transition-all`} style={{ width: `${item.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Type Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Content Types</h3>
          <div className="space-y-4">
            {['url', 'text', 'image', 'video'].map((type) => {
              const count = verifications.filter(v => v.content_type === type).length;
              const percent = verifications.length > 0 ? Math.round(count / verifications.length * 100) : 0;
              return (
                <div key={type}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600 capitalize">{type}</span>
                    <span className="text-sm font-medium text-gray-900">{count} ({percent}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Score Distribution */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Score Distribution</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {[
            { range: '0-20', label: 'Very Low', color: 'bg-red-500' },
            { range: '21-40', label: 'Low', color: 'bg-orange-500' },
            { range: '41-60', label: 'Medium', color: 'bg-yellow-500' },
            { range: '61-80', label: 'High', color: 'bg-lime-500' },
            { range: '81-100', label: 'Very High', color: 'bg-green-500' },
          ].map((bucket, i) => {
            const [min, max] = bucket.range.split('-').map(Number);
            const count = verifications.filter(v => v.trust_score >= min && v.trust_score <= max).length;
            const percent = verifications.length > 0 ? Math.round(count / verifications.length * 100) : 0;
            return (
              <div key={i} className="text-center">
                <div className="h-32 bg-gray-100 rounded-lg relative mb-2">
                  <div className={`absolute bottom-0 left-0 right-0 ${bucket.color} rounded-lg transition-all`} style={{ height: `${percent}%` }}></div>
                </div>
                <div className="text-xs text-gray-500">{bucket.range}</div>
                <div className="text-sm font-medium text-gray-900">{count}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
