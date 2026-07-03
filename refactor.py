import re

with open('src/app/dashboard/page.tsx', 'r') as f:
    content = f.read()

# 1. Add imports
imports = """
import { OverviewTab } from './components/OverviewTab';
import { HistoryTab } from './components/HistoryTab';
import { WatchlistTab } from './components/WatchlistTab';
import { AnalyticsTab } from './components/AnalyticsTab';
import { SourcesTab } from './components/SourcesTab';
import { ApiKeysTab } from './components/ApiKeysTab';
import { BillingTab } from './components/BillingTab';
import { getTrustScoreBg, getTrustScoreColor } from './utils';
"""

# Insert imports after the first few imports
content = content.replace("import { DashboardSkeleton } from '@/components/skeleton';", "import { DashboardSkeleton } from '@/components/skeleton';\n" + imports)


# 2. Remove helper functions
# getVerdictIcon
content = re.sub(r'  const getVerdictIcon =.*?};\n', '', content, flags=re.DOTALL)
# getContentTypeIcon
content = re.sub(r'  const getContentTypeIcon =.*?};\n', '', content, flags=re.DOTALL)
# getTrustScoreColor
content = re.sub(r'  const getTrustScoreColor =.*?};\n', '', content, flags=re.DOTALL)
# getTrustScoreBg
content = re.sub(r'  const getTrustScoreBg =.*?};\n', '', content, flags=re.DOTALL)
# formatTime
content = re.sub(r'  const formatTime =.*?};\n', '', content, flags=re.DOTALL)
# UpgradePrompt
content = re.sub(r'  const UpgradePrompt =.*?};\n', '', content, flags=re.DOTALL)


# 3. Replace Tabs Content
tabs_start = "{/* Tab Content */}"
tabs_end = "{/* Verification Detail Modal */}"
start_idx = content.find(tabs_start)
end_idx = content.find(tabs_end)

if start_idx != -1 and end_idx != -1:
    tabs_replacement = """{/* Tab Content */}
        {activeTab === 'overview' && (
          <OverviewTab stats={stats} verifications={verifications} setActiveTab={setActiveTab} setSelectedVerification={setSelectedVerification} />
        )}
        {activeTab === 'history' && (
          <HistoryTab verifications={verifications} filteredVerifications={filteredVerifications} setSelectedVerification={setSelectedVerification} showFilters={showFilters} setShowFilters={setShowFilters} filterType={filterType} setFilterType={setFilterType} filterVerdict={filterVerdict} setFilterVerdict={setFilterVerdict} exportData={exportData} />
        )}
        {activeTab === 'watchlist' && (
          <WatchlistTab watchlist={watchlist} alerts={alerts} loadWatchlist={loadWatchlist} setError={setError} />
        )}
        {activeTab === 'analytics' && (
          <AnalyticsTab stats={stats} verifications={verifications} />
        )}
        {activeTab === 'sources' && (
          <SourcesTab hasAccess={getTabAccess('sources').allowed} />
        )}
        {activeTab === 'api-keys' && (
          <ApiKeysTab hasAccess={getTabAccess('api-keys').allowed} apiKeys={apiKeys} />
        )}
        {activeTab === 'billing' && (
          <BillingTab user={user} />
        )}

      """
    
    content = content[:start_idx] + tabs_replacement + content[end_idx:]

with open('src/app/dashboard/page.tsx', 'w') as f:
    f.write(content)
print("Done")
