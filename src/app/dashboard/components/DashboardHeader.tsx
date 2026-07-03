import { useState } from 'react';
import Link from 'next/link';
import { Bell, X, Settings, LogOut, Menu } from 'lucide-react';
import type { UserPublic, Alert, WatchlistItem, Plan } from '@/types';

interface DashboardHeaderProps {
  user: UserPublic | null;
  allowedTabs: { id: string; label: string; icon: any; minPlan: Plan }[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  watchlist: WatchlistItem[];
  alerts: Alert[];
  unreadAlerts: number;
  markAllAlertsAsRead: () => void;
  markAlertAsRead: (id: string) => void;
  loadMoreAlerts: () => void;
  hasMoreAlerts: boolean;
  loadingMoreAlerts: boolean;
  handleLogout: () => void;
}

export function DashboardHeader({
  user,
  allowedTabs,
  activeTab,
  setActiveTab,
  watchlist,
  alerts,
  unreadAlerts,
  markAllAlertsAsRead,
  markAlertAsRead,
  loadMoreAlerts,
  hasMoreAlerts,
  loadingMoreAlerts,
  handleLogout,
}: DashboardHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2">
                <img src="/logo.png" alt="CoreValidate Logo" className="h-8 w-auto object-contain" />
                <span className="hidden sm:block font-semibold text-gray-900">CoreValidate</span>
              </Link>
              <nav className="hidden md:flex items-center gap-1" role="tablist" aria-label="Dashboard sections">
                {allowedTabs.map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    aria-controls={`panel-${tab.id}`}
                    className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${
                      activeTab === tab.id 
                        ? 'bg-emerald-50 text-emerald-700 font-medium' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                    {tab.id === 'watchlist' && watchlist.length > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs">{watchlist.length}</span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)} 
                  className="hidden md:flex relative p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
                  aria-label={`Notifications${unreadAlerts > 0 ? ` (${unreadAlerts} unread)` : ''}`}
                  aria-expanded={showNotifications}
                  aria-haspopup="true"
                >
                  <Bell className="h-4 w-4" />
                  {unreadAlerts > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center" aria-hidden="true">{unreadAlerts}</span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-[-1rem] sm:right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                      <span className="font-semibold text-sm">Alerts</span>
                      <div className="flex items-center gap-2">
                        {unreadAlerts > 0 && (
                          <button onClick={markAllAlertsAsRead} className="text-xs text-emerald-600 hover:text-emerald-700">Mark all read</button>
                        )}
                        <button onClick={() => setShowNotifications(false)}>
                          <X className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    {alerts.length > 0 ? (
                      <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                        {alerts.slice(0, 5).map((alert) => (
                          <div key={alert.id} className={`p-3 hover:bg-gray-50 cursor-pointer ${!alert.read ? 'bg-emerald-50' : ''}`} onClick={() => markAlertAsRead(alert.id)}>
                            <div className="flex items-start gap-2">
                              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!alert.read ? 'bg-emerald-500' : 'bg-transparent'}`} />
                              <div>
                                <div className="text-sm text-gray-900">{alert.message}</div>
                                <div className="text-xs text-gray-500 mt-1">{new Date(alert.createdAt).toLocaleString()}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {hasMoreAlerts && !loadingMoreAlerts && (
                          <div className="p-4 text-center">
                            <button
                              onClick={loadMoreAlerts}
                              className="px-4 py-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                            >
                              Load more
                            </button>
                          </div>
                        )}
                        {loadingMoreAlerts && (
                          <div className="p-4 text-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600 mx-auto"></div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 text-sm text-gray-500 text-center">No alerts yet</div>
                    )}
                  </div>
                )}
              </div>
              <Link href="/settings" className="hidden md:flex p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100" aria-label="Settings">
                <Settings className="h-4 w-4" />
              </Link>
              <div className="relative hidden md:block">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)} 
                  className="flex items-center gap-2 p-1.5 rounded-md hover:bg-gray-100"
                  aria-label="User menu"
                  aria-expanded={showUserMenu}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 text-xs font-medium" aria-hidden="true">
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
              <div className="md:hidden relative">
                <button
                  onClick={() => setShowMobileNav(!showMobileNav)}
                  className="p-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  aria-label="Toggle navigation"
                >
                  {showMobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
                {showMobileNav && (
                  <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[220px]">
                    <div className="p-3 border-b border-gray-100 bg-gray-50 rounded-t-lg">
                      <div className="font-medium text-sm text-gray-900">{user?.name || 'User'}</div>
                      <div className="text-xs text-gray-500">{user?.email}</div>
                    </div>
                    <div className="py-1">
                    {allowedTabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setShowMobileNav(false); }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm ${
                          activeTab === tab.id
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    ))}
                    </div>
                    <div className="border-t border-gray-100 py-1">
                      <button onClick={() => { setShowMobileNav(false); setShowNotifications(true); }} className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          Notifications
                        </div>
                        {unreadAlerts > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{unreadAlerts}</span>
                        )}
                      </button>
                      <Link href="/settings" onClick={() => setShowMobileNav(false)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </div>
                    <div className="border-t border-gray-100 py-1">
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
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
    </>
  );
}
