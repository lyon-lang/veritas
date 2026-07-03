import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Lock, CreditCard } from 'lucide-react';

export function UpgradePrompt({ requiredPlan, feature }: { requiredPlan: string; feature: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Lock className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature} requires {requiredPlan} plan</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
        Upgrade to {requiredPlan} to access {feature} and unlock more powerful verification tools.
      </p>
      <Link href="/#pricing">
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <CreditCard className="h-4 w-4 mr-2" />
          Upgrade to {requiredPlan}
        </Button>
      </Link>
    </div>
  );
}
