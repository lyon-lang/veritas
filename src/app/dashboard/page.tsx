'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Globe, 
  Image as ImageIcon, 
  FileText, 
  Video,
  ArrowRight,
  Clock,
  TrendingUp,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  Plus,
  Filter,
  MoreVertical,
  ExternalLink,
  Zap,
  Activity,
  ShieldCheck,
  ShieldAlert,
  ShieldX
} from 'lucide-react';

interface Verification {
  id: string;
  url?: string;
  content_type: string;
  trust_score: number;
  verdict: string;
  confidence: number;
  created_at: string;
}

interface Stats {
  overall: {
    total: number;
    authentic: number;
    suspicious: number;
    fake: number;
    avgScore: number;
    authenticPercent: number;
    suspiciousPercent: number;
    fakePercent: number;
  };
  today: {
    total: number;
    authentic: number;
    suspicious: number;
    fake: number;
    avgScore: number;
  };
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [verifyUrl, setVerifyUrl] = useState('');
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load verifications
      const verRes = await fetch('/api/user/verifications');
      const verData = await verRes.json();
      setVerifications(verData.verifications || []);

      // Load stats
      const statsRes = await fetch('/api/stats');
      const statsData = await statsRes.json();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verifyUrl) return;
    
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: verifyUrl, type: 'url' }),
      });
      const data = await res.json();
      
      // Refresh data
      loadData();
      setVerifyUrl('');
    } catch (error) {
      console.error('Error verifying:', error);
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'authentic': return <ShieldCheck className="h-4 w-4 text-green-600" />;
      case 'suspicious': return <ShieldAlert className="h-4 w-4 text-yellow-600" />;
      case 'fake': return <ShieldX className="h-4 w-4 text-red-600" />;
      default: return <Shield className="h-4 w-4 text-gray-600" />;
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'authentic': return 'bg-green-100 text-green-700';
      case 'suspicious': return 'bg-yellow-100 text-yellow-700';
      case 'fake': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Veritas</span>
              </Link>
              <nav className="hidden md:flex items-center gap-1">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'history', label: 'History' },
                  { id: 'sources', label: 'Sources' },
                ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 text-sm rounded-md ${
                      activeTab === tab.id 
                        ? 'bg-blue-50 text-blue-700 font-medium' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100">
                <Bell className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100">
                <Settings className="h-4 w-4" />
              </button>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-xs font-medium">
                U
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6">
        {/* Welcome + Verify */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500">Verify content and track your verification history</p>
            </div>
          </div>
        </div>

        {/* Verify Input */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={verifyUrl}
                onChange={(e) => setVerifyUrl(e.target.value)}
                placeholder="Paste a URL, image, or text to verify..."
                className="flex-1 bg-transparent outline-none text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              />
            </div>
            <Button 
              onClick={handleVerify}
              className="bg-blue-600 hover:bg-blue-700 px-6"
            >
              Verify
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-xs text-green-600 font-medium">+12%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats?.overall.total || 0}</div>
            <div className="text-sm text-gray-500">Total verified</div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-xs text-gray-500">{stats?.overall.authenticPercent || 0}%</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{stats?.overall.authentic || 0}</div>
            <div className="text-sm text-gray-500">Authentic</div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                <ShieldAlert className="h-5 w-5 text-yellow-600" />
              </div>
              <span className="text-xs text-gray-500">{stats?.overall.suspiciousPercent || 0}%</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600">{stats?.overall.suspicious || 0}</div>
            <div className="text-sm text-gray-500">Suspicious</div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200">
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

        {/* Recent Verifications */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Recent Verifications</h2>
                <p className="text-sm text-gray-500">Your verification history</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              View all
            </Button>
          </div>

          {verifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {verifications.map((v) => (
                <div key={v.id} className="px-5 py-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        v.verdict === 'authentic' ? 'bg-green-50' :
                        v.verdict === 'suspicious' ? 'bg-yellow-50' :
                        'bg-red-50'
                      }`}>
                        {getVerdictIcon(v.verdict)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {v.url || `${v.content_type} content`}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            v.verdict === 'authentic' ? 'bg-green-100 text-green-700' :
                            v.verdict === 'suspicious' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {v.verdict}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {new Date(v.created_at).toLocaleDateString()} • Score: {v.trust_score}/100
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`text-lg font-bold ${
                        v.trust_score >= 80 ? 'text-green-600' :
                        v.trust_score >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {v.trust_score}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No verifications yet</h3>
              <p className="text-sm text-gray-500 mb-6">
                Start verifying content to see your history here
              </p>
              <Button 
                onClick={() => document.querySelector('input')?.focus()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Verify content
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
