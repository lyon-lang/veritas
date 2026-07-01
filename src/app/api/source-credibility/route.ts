import { NextResponse } from 'next/server';

// GET - Get source credibility
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain is required' },
        { status: 400 }
      );
    }

    // Known trusted sources with detailed info
    const trustedSources: Record<string, {
      score: number;
      category: string;
      reputation: string;
      bias: string;
      factCheckRating: string;
      description: string;
    }> = {
      'reuters.com': {
        score: 95,
        category: 'news',
        reputation: 'high',
        bias: 'center',
        factCheckRating: 'highly factual',
        description: 'International news organization known for factual reporting',
      },
      'apnews.com': {
        score: 95,
        category: 'news',
        reputation: 'high',
        bias: 'center',
        factCheckRating: 'highly factual',
        description: 'Associated Press - nonprofit news agency',
      },
      'bbc.com': {
        score: 92,
        category: 'news',
        reputation: 'high',
        bias: 'center',
        factCheckRating: 'highly factual',
        description: 'British public service broadcaster',
      },
      'nytimes.com': {
        score: 88,
        category: 'news',
        reputation: 'high',
        bias: 'left-center',
        factCheckRating: 'highly factual',
        description: 'American newspaper with high journalistic standards',
      },
      'washingtonpost.com': {
        score: 87,
        category: 'news',
        reputation: 'high',
        bias: 'left-center',
        factCheckRating: 'highly factual',
        description: 'Major American newspaper',
      },
      'theguardian.com': {
        score: 85,
        category: 'news',
        reputation: 'high',
        bias: 'left-center',
        factCheckRating: 'mostly factual',
        description: 'British newspaper with global reach',
      },
      'wsj.com': {
        score: 86,
        category: 'news',
        reputation: 'high',
        bias: 'right-center',
        factCheckRating: 'highly factual',
        description: 'American business-focused newspaper',
      },
      'bloomberg.com': {
        score: 88,
        category: 'news',
        reputation: 'high',
        bias: 'center',
        factCheckRating: 'highly factual',
        description: 'Financial news and data',
      },
      'nature.com': {
        score: 98,
        category: 'science',
        reputation: 'high',
        bias: 'center',
        factCheckRating: 'peer-reviewed',
        description: 'Peer-reviewed scientific journal',
      },
      'science.org': {
        score: 98,
        category: 'science',
        reputation: 'high',
        bias: 'center',
        factCheckRating: 'peer-reviewed',
        description: 'American Association for the Advancement of Science',
      },
    };

    const sourceInfo = trustedSources[domain];

    if (sourceInfo) {
      return NextResponse.json({
        domain,
        ...sourceInfo,
        verified: true,
      });
    }

    // For unknown domains, return default
    return NextResponse.json({
      domain,
      score: 50,
      category: 'unknown',
      reputation: 'unknown',
      bias: 'unknown',
      factCheckRating: 'not rated',
      description: 'Source not in our database',
      verified: false,
    });
  } catch (error) {
    console.error('Error getting source credibility:', error);
    return NextResponse.json(
      { error: 'Failed to get source credibility' },
      { status: 500 }
    );
  }
}

// POST - Check multiple sources
export async function POST(request: Request) {
  try {
    const { domains } = await request.json();

    if (!domains || !Array.isArray(domains)) {
      return NextResponse.json(
        { error: 'Domains array is required' },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      domains.map(async (domain: string) => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL}/api/source-credibility?domain=${domain}`
          );
          return response.json();
        } catch {
          return { domain, score: 50, error: true };
        }
      })
    );

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error checking sources:', error);
    return NextResponse.json(
      { error: 'Failed to check sources' },
      { status: 500 }
    );
  }
}
