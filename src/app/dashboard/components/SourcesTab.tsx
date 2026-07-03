import { UpgradePrompt } from './UpgradePrompt';

interface SourcesTabProps {
  hasAccess: boolean;
}

export function SourcesTab({ hasAccess }: SourcesTabProps) {
  if (!hasAccess) {
    return <UpgradePrompt requiredPlan="professional" feature="Sources Database" />;
  }

  return (
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
  );
}
