import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Copy, CheckCircle } from 'lucide-react';
import { UpgradePrompt } from './UpgradePrompt';
// import type { ApiKey } from '@/types';

export interface DashboardApiKey {
  id: string;
  name: string;
  prefix: string;
  key: string;
  created_at: string;
  last_used: string;
}

interface ApiKeysTabProps {
  hasAccess: boolean;
  apiKeys: DashboardApiKey[];
}

export function ApiKeysTab({ hasAccess, apiKeys }: ApiKeysTabProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!hasAccess) {
    return <UpgradePrompt requiredPlan="professional" feature="API Keys" />;
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">API Keys</h2>
          <p className="text-sm text-gray-500">Manage your API keys for programmatic access.</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Generate New Key
        </Button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
          <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Key</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Created</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Last Used</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {apiKeys.map((k) => (
              <tr key={k.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-900">{k.name}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">{k.prefix}••••••••</code>
                    <button onClick={() => copyToClipboard(k.key)} className="text-gray-400 hover:text-emerald-600">
                      {copied ? <CheckCircle className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-500">{new Date(k.created_at).toLocaleDateString()}</td>
                <td className="py-3 px-4 text-gray-500">{new Date(k.last_used).toLocaleDateString()}</td>
                <td className="py-3 px-4 text-right">
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">Revoke</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
