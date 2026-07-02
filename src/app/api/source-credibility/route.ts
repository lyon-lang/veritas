import { NextResponse } from 'next/server';
import { SourceModel } from '@/lib/models';

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

    // Check database
    const source = SourceModel.findByDomain(domain);

    if (source) {
      return NextResponse.json({
        ...source,
        domain,
        verified: true,
      });
    }

    // Return default for unknown domains
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

    const results = domains.map((domain: string) => {
      const source = SourceModel.findByDomain(domain);
      
      if (source) {
        return {
          ...source,
          domain,
          verified: true,
        };
      }

      return {
        domain,
        score: 50,
        category: 'unknown',
        reputation: 'unknown',
        verified: false,
      };
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error checking sources:', error);
    return NextResponse.json(
      { error: 'Failed to check sources' },
      { status: 500 }
    );
  }
}

// PUT - Update source credibility
export async function PUT(request: Request) {
  try {
    const data = await request.json();

    if (!data.domain) {
      return NextResponse.json(
        { error: 'Domain is required' },
        { status: 400 }
      );
    }

    const source = SourceModel.upsert({
      domain: data.domain,
      score: data.score,
      category: data.category,
      reputation: data.reputation,
      factCheckRating: data.factCheckRating,
      bias: data.bias,
      description: data.description,
    });

    return NextResponse.json({
      source,
      message: 'Source credibility updated',
    });
  } catch (error) {
    console.error('Error updating source:', error);
    return NextResponse.json(
      { error: 'Failed to update source' },
      { status: 500 }
    );
  }
}
