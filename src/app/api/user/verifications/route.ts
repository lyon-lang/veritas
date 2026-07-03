import { NextResponse } from 'next/server';
import { VerificationModel, StatsModel } from '@/lib/models';
import { requireAuth, requireCsrf } from '@/lib/auth';

// GET - Get user's verification history
export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = Math.max(parseInt(searchParams.get('offset') || '0'), 0);

    const verifications = VerificationModel.findByUser(user.id, limit, offset);
    const stats = VerificationModel.getStats(user.id);
    const dailyStats = StatsModel.getDaily();

    return NextResponse.json({
      verifications,
      stats: {
        total: stats?.total || 0,
        authentic: stats?.authentic || 0,
        suspicious: stats?.suspicious || 0,
        fake: stats?.fake || 0,
        avgScore: Math.round(stats?.avg_score || 0),
      },
      dailyStats,
      total: stats?.total || 0,
      hasMore: verifications.length === limit,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    console.error('Error fetching verifications:', error);
    return NextResponse.json({ error: 'Failed to fetch verifications' }, { status: 500 });
  }
}

// POST - Save verification
export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    await requireCsrf(request);
    const data = await request.json();

    if (data.trustScore === undefined || data.trustScore === null || !data.verdict) {
      return NextResponse.json({ error: 'Trust score and verdict are required' }, { status: 400 });
    }

    const verification = VerificationModel.create({
      userId: user.id,
      url: data.url || null,
      contentType: data.contentType || 'unknown',
      trustScore: data.trustScore,
      verdict: data.verdict,
      confidence: data.confidence || 50,
      checks: data.checks || [],
      c2paData: data.c2paData || null,
      aiDetection: data.aiDetection || null,
      sourceData: data.sourceData || null,
    });

    return NextResponse.json({ verification, message: 'Verification saved' });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'CSRF_INVALID') {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
    }
    console.error('Error saving verification:', error);
    return NextResponse.json({ error: 'Failed to save verification' }, { status: 500 });
  }
}
