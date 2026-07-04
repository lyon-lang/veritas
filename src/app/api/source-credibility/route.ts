import { NextResponse } from 'next/server';
import { SourceModel } from '@/lib/models';
import { UserModel } from '@/lib/models';
import { cookies } from 'next/headers';

// Admin domains that can update source credibility
const ADMIN_DOMAINS = ['corevalidate.app', 'localhost'];

function isAdmin(request: Request): boolean {
  // Check for admin API key in header
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer vrt_')) {
    // API key authentication - would need to validate against api_keys table
    // For now, we'll check the session-based auth
  }

  // Check for internal admin header (for server-to-server calls)
  const adminHeader = request.headers.get('x-admin-key');
  if (adminHeader === process.env.ADMIN_API_KEY) {
    return true;
  }

  return false;
}

async function getAuthenticatedUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_id')?.value;
  if (!userId) return null;

  const user = UserModel.findById(userId);
  return user ? userId : null;
}

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
        domain,
        score: source.score,
        category: source.category,
        reputation: source.reputation,
        fact_check_rating: source.fact_check_rating,
        bias: source.bias,
        description: source.description,
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

// PUT - Update source credibility (admin only)
export async function PUT(request: Request) {
  try {
    // Require admin authentication
    if (!isAdmin(request)) {
      const userId = await getAuthenticatedUserId();
      if (!userId) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
      // For non-admin users, check if they have admin role
      const user = UserModel.findById(userId);
      if (!user || user.plan !== 'enterprise') {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        );
      }
    }

    const data = await request.json();

    if (!data.domain) {
      return NextResponse.json(
        { error: 'Domain is required' },
        { status: 400 }
      );
    }

    // Validate score range
    if (data.score !== undefined && (data.score < 0 || data.score > 100)) {
      return NextResponse.json(
        { error: 'Score must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!data.score || !data.category || !data.reputation) {
      return NextResponse.json(
        { error: 'Score, category, and reputation are required' },
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
