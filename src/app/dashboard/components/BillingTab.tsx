import { Button } from '@/components/ui/button';
import type { UserPublic } from '@/types';

interface BillingTabProps {
  user: UserPublic | null;
}

export function BillingTab({ user }: BillingTabProps) {
  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Billing & Credits</h2>
      <p className="text-sm text-gray-500 mb-6">Manage your plan and monitor credit usage.</p>
      
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Current Plan</h3>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium uppercase tracking-wider">{user?.plan || 'Free'}</span>
          </div>
          <div className="mb-6">
            <div className="text-3xl font-bold text-gray-900 mb-1">$0<span className="text-lg text-gray-500 font-normal">/mo</span></div>
            <p className="text-sm text-gray-500">You are currently on the Free plan.</p>
          </div>
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Upgrade to Consumer</Button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Credit Usage</h3>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-gray-600">Credits used this month</span>
            <span className="font-medium text-gray-900">12 / 15</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 mb-6">
            <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '80%' }}></div>
          </div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Cost Breakdown</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex justify-between"><span>Text / URL Check</span><span>1 Credit</span></li>
            <li className="flex justify-between"><span>Image Check</span><span>5 Credits</span></li>
            <li className="flex justify-between"><span>Video / Audio Check</span><span>10 Credits/min</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
