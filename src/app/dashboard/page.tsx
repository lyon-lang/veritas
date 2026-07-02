'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Globe, 
  Clock,
  Settings,
  Bell,
  LogOut,
  Plus,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  ExternalLink,
  Activity,
  History,
  Database,
  X
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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [verifyUrl, setVerifyUrl] = useState('');
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<any>(null);

  useEffect(() => {
    loadData();
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await fetch('/api/auth');
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      } else {
        router.push('/sign-in');
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const loadData = async () => {
    try {
      const verRes = await fetch('/api/user/verifications');
      const verData = await verRes.json();
      setVerifications(verData.verifications || []);

      const statsRes = await fetch('/api/stats');
      const statsData = await statsRes.json();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
      router.push('/sign-in');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleVerify = async () => {
    if (!verifyUrl || verifying) return;
    
    setVerifying(true);
    setVerifyResult(null);
    
    try {
      const type = verifyUrl.startsWith('http') ? 'url' : 'text';
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: verifyUrl, type }),
      });
      const data = await res.json();
      setVerifyResult(data);
      loadData();
    } catch (error) {
      console.error('Error verifying:', error);
    } finally {
      setVerifying(false);
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
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Veritas</span>
              </Link>
              <nav className="hidden md:flex items-center gap-1">
                {[
                  { id: 'overview', label: 'Overview', icon: Activity },
                  { id: 'history', label: 'History', icon: History },
                  { id: 'sources', label: 'Sources', icon: Database },
                ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${
                      activeTab === tab.id 
                        ? 'bg-blue-50 text-blue-700 font-medium' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowUserMenu(false);
                  }}
                  className="relative p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                      <span className="font-semibold text-sm">Notifications</span>
                      <button onClick={() => setShowNotifications(false)}>
                        <X className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                    <div className="p-4 text-sm text-gray-500 text-center">
                      No new notifications
                    </div>
                  </div>
                )}
              </div>

              {/* Settings */}
              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
                <Settings className="h-4 w-4" />
              </button>

              {/* User Menu */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-2 p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-xs font-medium">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm text-gray-700 hidden md:block">{user?.name || 'User'}</span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-3 border-b border-gray-100">
                      <div className="font-medium text-sm text-gray-900">{user?.name}</div>
                      <div className="text-xs text-gray-500">{user?.email}</div>
                    </div>
                    <div className="p-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Click outside to close menus */}
      {(showUserMenu || showNotifications) && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6">
        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Welcome, {user?.name || 'User'}</h1>
          <p className="text-sm text-gray-500">Verify content and track your verification history</p>
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
              disabled={verifying || !verifyUrl}
              className="bg-blue-600 hover:bg-blue-700 px-6"
            >
              {verifying ? 'Verifying...' : 'Verify'}
              {!verifying && <Search className="ml-2 h-4 w-4" />}
            </Button>
          </div>

          {/* Verify Result */}
          {verifyResult && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                    verifyResult.trustScore >= 80 ? 'bg-green-100 text-green-600' :
                    verifyResult.trustScore >= 60 ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {verifyResult.trustScore}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 capitalize">{verifyResult.verdict}</div>
                    <div className="text-sm text-gray-500">Confidence: {verifyResult.confidence}%</div>
                  </div>
                </div>
                <button onClick={() => setVerifyResult(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {verifyResult.checks?.map((check: any, i: number) => (
                  <div key={i} className="text-xs p-2 bg-white rounded">
                    <div className="text-gray-500">{check.name}</div>
                    <div className={`font-medium ${
                      check.status === 'passed' ? 'text-green-600' :
                      check.status === 'warning' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>{check.score}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Activity className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats?.overall.total || 0}</div>
                <div className="text-sm text-gray-500">Total verified</div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-600">{stats?.overall.authentic || 0}</div>
                <div className="text-sm text-gray-500">Authentic</div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                    <ShieldAlert className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-yellow-600">{stats?.overall.suspicious || 0}</div>
                <div className="text-sm text-gray-500">Suspicious</div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                    <ShieldX className="h-5 w-5 text-red-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-red-600">{stats?.overall.fake || 0}</div>
                <div className="text-sm text-gray-500">Fake</div>
              </div>
            </div>

            {/* Recent Verifications */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Recent Verifications</h2>
              </div>

              {verifications.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {verifications.slice(0, 5).map((v) => (
                    <div key={v.id} className="px-5 py-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            v.verdict === 'authentic' ? 'bg-green-50' :
                            v.verdict === 'suspicious' ? 'bg-yellow-50' :
                            'bg-red-50'
                          }`}>
                            {getVerdictIcon(v.verdict)}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {v.url || `${v.content_type} content`}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatTime(v.created_at)} • {v.verdict}
                            </div>
                          </div>
                        </div>
                        <div className={`text-lg font-bold ${getTrustScoreColor(v.trust_score)}`}>
                          {v.trust_score}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No verifications yet</h3>
                  <p className="text-sm text-gray-500">Start verifying content above</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Verification History</h2>
              <p className="text-sm text-gray-500">All your past verifications</p>
            </div>

            {verifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {verifications.map((v) => (
                  <div key={v.id} className="px-5 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          v.verdict === 'authentic' ? 'bg-green-50' :
                          v.verdict === 'suspicious' ? 'bg-yellow-50' :
                          'bg-red-50'
                        }`}>
                          {getVerdictIcon(v.verdict)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {v.url || `${v.content_type} content`}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(v.created_at).toLocaleString()} • Type: {v.content_type}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          v.verdict === 'authentic' ? 'bg-green-100 text-green-700' :
                          v.verdict === 'suspicious' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {v.verdict}
                        </span>
                        <div className={`text-lg font-bold ${getTrustScoreColor(v.trust_score)}`}>
                          {v.trust_score}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No history yet</h3>
                <p className="text-sm text-gray-500">Your verification history will appear here</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'sources' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Trusted Sources</h2>
              <p className="text-sm text-gray-500">Sources we verify against</p>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { domain: 'reuters.com', score: 95, category: 'News', description: 'International news organization' },
                  { domain: 'apnews.com', score: 95, category: 'News', description: 'Associated Press' },
                  { domain: 'bbc.com', score: 92, category: 'News', description: 'British broadcaster' },
                  { domain: 'nytimes.com', score: 88, category: 'News', description: 'American newspaper' },
                  { domain: 'nature.com', score: 98, category: 'Science', description: 'Scientific journal' },
                  { domain: 'science.org', score: 98, category: 'Science', description: 'Science journal' },
                  { domain: 'bloomberg.com', score: 88, category: 'Finance', description: 'Financial news' },
                  { domain: 'wsj.com', score: 86, category: 'Finance', description: 'Wall Street Journal' },
                  { domain: 'theguardian.com', score: 85, category: 'News', description: 'British newspaper' },
                ].map((source, i) => (
                  <div key={i} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm text-gray-900">{source.domain}</span>
                      <span className={`text-sm font-bold ${source.score >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {source.score}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mb-1">{source.category}</div>
                    <div className="text-xs text-gray-600">{source.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
