import { cn } from '@/lib/utils';
import { getVerdictBadgeClasses, getVerdictColor } from '@/lib/utils';

interface VerdictBadgeProps {
  verdict: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function VerdictBadge({ verdict, size = 'sm', showIcon = false }: VerdictBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const getIcon = () => {
    switch (verdict) {
      case 'authentic':
      case 'likely authentic':
        return '✓';
      case 'suspicious':
        return '⚠';
      case 'fake':
      case 'untrusted':
        return '✗';
      default:
        return '•';
    }
  };

  return (
    <span className={cn(
      'rounded-full font-medium inline-flex items-center gap-1',
      getVerdictBadgeClasses(verdict),
      sizeClasses[size]
    )}>
      {showIcon && <span>{getIcon()}</span>}
      {verdict}
    </span>
  );
}

interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export function ScoreBadge({ score, size = 'sm' }: ScoreBadgeProps) {
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-lg',
    lg: 'w-20 h-20 text-2xl',
  };

  const colorClass = getVerdictColor(
    score >= 80 ? 'authentic' :
    score >= 60 ? 'likely authentic' :
    score >= 40 ? 'suspicious' : 'fake'
  );

  const bgClass = score >= 80 ? 'bg-green-100' :
    score >= 60 ? 'bg-green-50' :
    score >= 40 ? 'bg-yellow-100' : 'bg-red-100';

  return (
    <div className={cn(
      'rounded-full flex items-center justify-center font-bold',
      sizeClasses[size],
      bgClass,
      colorClass
    )}>
      {score}
    </div>
  );
}

interface ContentTypeBadgeProps {
  type: string;
  size?: 'sm' | 'md';
}

export function ContentTypeBadge({ type, size = 'sm' }: ContentTypeBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  const colorClasses: Record<string, string> = {
    url: 'bg-blue-100 text-blue-700',
    text: 'bg-purple-100 text-purple-700',
    image: 'bg-pink-100 text-pink-700',
  };

  return (
    <span className={cn(
      'rounded-full font-medium',
      sizeClasses[size],
      colorClasses[type] || 'bg-gray-100 text-gray-700'
    )}>
      {type}
    </span>
  );
}
