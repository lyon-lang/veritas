'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Search, 
  CheckCircle, 
  Globe, 
  Clock,
  Settings,
  Bell,
  LogOut,
  Plus,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Activity,
  History,
  Database,
  X,
  TrendingUp,
  BarChart3,
  ExternalLink,
  Copy,
  Download,
  Filter,
  ChevronDown,
  Image as ImageIcon,
  FileText,
  Video,
  Link as LinkIcon,
  Zap,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Share2
} from 'lucide-react';

interface Verification {
  id: string;
  url?: string;
  content_type: string;
  trust_score: number;
  verdict: string;
  confidence: number;
  checks: any[];
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
  const [verifyType, setVerifyType] = useState<'url' | 'text' | 'image'>('url');
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterVerdict, setFilterVerdict] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [copied, setCopied] = useState(false);
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [unreadAlerts, setUnreadAlerts] = useState(0);
  const [showAddToWatchlist, setShowAddToWatchlist] = useState(false);
  const [watchlistUrl, setWatchlistUrl] = useState('');
  const [watchlistLabel, setWatchlistLabel] = useState('');

  useEffect(() => {
    loadData();
    loadUser();
    loadWatchlist();
    loadAlerts();
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

  const loadWatchlist = async () => {
    try {
      const res = await fetch('/api/watchlist?userId=current');
      const data = await res.json();
      setWatchlist(data.items || []);
    } catch (error) {
      console.error('Error loading watchlist:', error);
    }
  };

  const loadAlerts = async () => {
    try {
      const res = await fetch('/api/alerts?userId=current');
      const data = await res.json();
      setAlerts(data.alerts || []);
      setUnreadAlerts(data.unreadCount || 0);
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  };

  const addToWatchlist = async () => {
    if (!watchlistUrl) return;
    
    try {
      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: 'current', 
          url: watchlistUrl,
          label: watchlistLabel || undefined
        }),
      });
      
      if (res.ok) {
        setShowAddToWatchlist(false);
        setWatchlistUrl('');
        setWatchlistLabel('');
        loadWatchlist();
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };

  const removeFromWatchlist = async (id: string) => {
    try {
      await fetch(`/api/watchlist?id=${id}`, { method: 'DELETE' });
      loadWatchlist();
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const markAlertAsRead = async (alertId: string) => {
    try {
      await fetch('/api/alerts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId }),
      });
      loadAlerts();
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const markAllAlertsAsRead = async () => {
    try {
      await fetch('/api/alerts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true, userId: 'current' }),
      });
      loadAlerts();
    } catch (error) {
      console.error('Error marking all alerts as read:', error);
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportData = () => {
    const csv = [
      ['ID', 'URL', 'Type', 'Score', 'Verdict', 'Confidence', 'Date'].join(','),
      ...verifications.map(v => [
        v.id,
        v.url || '',
        v.content_type,
        v.trust_score,
        v.verdict,
        v.confidence,
        v.created_at
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'verifications.csv';
    a.click();
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'authentic': return <ShieldCheck className="h-4 w-4 text-green-600" />;
      case 'suspicious': return <ShieldAlert className="h-4 w-4 text-yellow-600" />;
      case 'fake': return <ShieldX className="h-4 w-4 text-red-600" />;
      default: return <Shield className="h-4 w-4 text-gray-600" />;
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'text': return <FileText className="h-4 w-4" />;
      case 'url': return <LinkIcon className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getTrustScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-50';
    if (score >= 60) return 'bg-yellow-50';
    if (score >= 40) return 'bg-orange-50';
    return 'bg-red-50';
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

  const filteredVerifications = verifications.filter(v => {
    if (filterType !== 'all' && v.content_type !== filterType) return false;
    if (filterVerdict !== 'all' && v.verdict !== filterVerdict) return false;
    return true;
  });

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
                  { id: 'watchlist', label: 'Watchlist', icon: Clock },
                  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
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
                    {tab.id === 'watchlist' && watchlist.length > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">{watchlist.length}</span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100">
                  <Bell className="h-4 w-4" />
                  {unreadAlerts > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{unreadAlerts}</span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                      <span className="font-semibold text-sm">Alerts</span>
                      <div className="flex items-center gap-2">
                        {unreadAlerts > 0 && (
                          <button onClick={markAllAlertsAsRead} className="text-xs text-blue-600 hover:text-blue-700">Mark all read</button>
                        )}
                        <button onClick={() => setShowNotifications(false)}>
                          <X className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    {alerts.length > 0 ? (
                      <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                        {alerts.slice(0, 5).map((alert) => (
                          <div key={alert.id} className={`p-3 hover:bg-gray-50 cursor-pointer ${!alert.read ? 'bg-blue-50' : ''}`} onClick={() => markAlertAsRead(alert.id)}>
                            <div className="flex items-start gap-2">
                              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!alert.read ? 'bg-blue-500' : 'bg-transparent'}`} />
                              <div>
                                <div className="text-sm text-gray-900">{alert.message}</div>
                                <div className="text-xs text-gray-500 mt-1">{new Date(alert.createdAt).toLocaleString()}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-sm text-gray-500 text-center">No alerts yet</div>
                    )}
                  </div>
                )}
              </div>
              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100">
                <Settings className="h-4 w-4" />
              </button>
              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 p-1.5 rounded-md hover:bg-gray-100">
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
                      <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2">
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

      {(showUserMenu || showNotifications) && (
        <div className="fixed inset-0 z-30" onClick={() => { setShowUserMenu(false); setShowNotifications(false); }} />
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6">
        {/* Welcome */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Welcome back, {user?.name || 'User'}</h1>
            <p className="text-sm text-gray-500">Verify content and track your verification history</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={loadData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Verify Input */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            {['url', 'text', 'image'].map((type) => (
              <button
                key={type}
                onClick={() => setVerifyType(type as any)}
                className={`px-3 py-1.5 text-sm rounded-md capitalize ${
                  verifyType === type ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={verifyUrl}
                onChange={(e) => setVerifyUrl(e.target.value)}
                placeholder={verifyType === 'url' ? 'Paste URL to verify...' : verifyType === 'text' ? 'Paste text to verify...' : 'Paste image URL...'}
                className="flex-1 bg-transparent outline-none text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              />
            </div>
            <Button onClick={handleVerify} disabled={verifying || !verifyUrl} className="bg-blue-600 hover:bg-blue-700 px-6">
              {verifying ? 'Verifying...' : 'Verify'}
            </Button>
          </div>

          {/* Verify Result */}
          {verifyResult && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${getTrustScoreBg(verifyResult.trustScore)} ${getTrustScoreColor(verifyResult.trustScore)}`}>
                    {verifyResult.trustScore}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-lg capitalize">{verifyResult.verdict}</div>
                    <div className="text-sm text-gray-500">Confidence: {verifyResult.confidence}%</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => copyToClipboard(JSON.stringify(verifyResult, null, 2))} className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
                    {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <button onClick={() => setVerifyResult(null)} className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {verifyResult.checks?.map((check: any, i: number) => (
                  <div key={i} className="p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">{check.name}</span>
                      <span className={`text-xs font-medium ${
                        check.status === 'passed' ? 'text-green-600' : check.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                      }`}>{check.status}</span>
                    </div>
                    <div className={`text-xl font-bold ${getTrustScoreColor(check.score)}`}>{check.score}</div>
                    <div className="text-xs text-gray-500 mt-1">{check.details}</div>
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
              <div className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Activity className="h-5 w-5 text-blue-600" />
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
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Zap className="h-5 w-5 text-blue-600" />
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
                            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
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
                  <Button onClick={() => document.querySelector('input')?.focus()} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Verify content
                  </Button>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'history' && (
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
        )}

        {activeTab === 'watchlist' && (
          <div className="space-y-6">
            {/* Add to Watchlist */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-gray-900">Watchlist</h2>
                  <p className="text-sm text-gray-500">Monitor content and get alerts when trust scores change</p>
                </div>
                <Button onClick={() => setShowAddToWatchlist(true)} className="bg-blue-600 hover:bg-blue-700">
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
                      <Button onClick={addToWatchlist} className="bg-blue-600 hover:bg-blue-700">Add</Button>
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
                    <div key={alert.id} className={`py-3 ${!alert.read ? 'bg-blue-50 -mx-6 px-6' : ''}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          alert.type === 'verdict_change' ? 'bg-red-500' :
                          alert.type === 'score_change' ? 'bg-yellow-500' :
                          'bg-blue-500'
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
        )}

        {activeTab === 'analytics' && (
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
                          <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${percent}%` }}></div>
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
              <div className="grid grid-cols-5 gap-4">
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
        )}

        {activeTab === 'sources' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Trusted Sources Database</h2>
              <p className="text-sm text-gray-500">Sources we verify against for credibility scoring</p>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { domain: 'reuters.com', score: 95, category: 'News', reputation: 'high', description: 'International news organization' },
                  { domain: 'apnews.com', score: 95, category: 'News', reputation: 'high', description: 'Associated Press' },
                  { domain: 'bbc.com', score: 92, category: 'News', reputation: 'high', description: 'British broadcaster' },
                  { domain: 'nytimes.com', score: 88, category: 'News', reputation: 'high', description: 'American newspaper' },
                  { domain: 'nature.com', score: 98, category: 'Science', reputation: 'high', description: 'Scientific journal' },
                  { domain: 'science.org', score: 98, category: 'Science', reputation: 'high', description: 'Science journal' },
                  { domain: 'bloomberg.com', score: 88, category: 'Finance', reputation: 'high', description: 'Financial news' },
                  { domain: 'wsj.com', score: 86, category: 'Finance', reputation: 'high', description: 'Wall Street Journal' },
                  { domain: 'theguardian.com', score: 85, category: 'News', reputation: 'high', description: 'British newspaper' },
                  { domain: 'youtube.com', score: 50, category: 'Video', reputation: 'medium', description: 'Video platform' },
                  { domain: 'twitter.com', score: 55, category: 'Social', reputation: 'medium', description: 'Social media' },
                  { domain: 'tiktok.com', score: 45, category: 'Video', reputation: 'medium', description: 'Video platform' },
                ].map((source, i) => (
                  <div key={i} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm text-gray-900">{source.domain}</span>
                      <span className={`text-sm font-bold ${source.score >= 80 ? 'text-green-600' : source.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {source.score}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">{source.category}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        source.reputation === 'high' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>{source.reputation}</span>
                    </div>
                    <div className="text-xs text-gray-500">{source.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Verification Detail Modal */}
      {selectedVerification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Verification Details</h2>
              <button onClick={() => setSelectedVerification(null)} className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold ${getTrustScoreBg(selectedVerification.trust_score)} ${getTrustScoreColor(selectedVerification.trust_score)}`}>
                  {selectedVerification.trust_score}
                </div>
                <div>
                  <div className="text-xl font-semibold text-gray-900 capitalize">{selectedVerification.verdict}</div>
                  <div className="text-sm text-gray-500">Confidence: {selectedVerification.confidence}%</div>
                  <div className="text-sm text-gray-500">{new Date(selectedVerification.created_at).toLocaleString()}</div>
                </div>
              </div>

              {selectedVerification.url && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">URL</div>
                  <div className="text-sm text-gray-900 break-all">{selectedVerification.url}</div>
                </div>
              )}

              <div className="mb-4">
                <div className="text-sm font-medium text-gray-900 mb-2">Content Type</div>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm capitalize">{selectedVerification.content_type}</span>
              </div>

              {selectedVerification.checks && selectedVerification.checks.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-3">Verification Checks</div>
                  <div className="space-y-3">
                    {selectedVerification.checks.map((check: any, i: number) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{check.name}</span>
                          <span className={`text-sm font-medium ${
                            check.status === 'passed' ? 'text-green-600' : check.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                          }`}>{check.status}</span>
                        </div>
                        <div className="text-xs text-gray-500">{check.details}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
