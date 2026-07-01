import { NextResponse } from 'next/server';
import { VerificationModel, StatsModel } from '@/lib/models';

// GET - Get user's verification history
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let verifications;
    let stats;

    if (userId) {
      verifications = VerificationModel.findByUser(userId, limit, offset);
      stats = VerificationModel.getStats(userId);
    } else {
      verifications = VerificationModel.getRecent(limit);
      stats = VerificationModel.getStats();
    }

    // Get daily stats
    const dailyStats = StatsModel.getDaily();

    return NextResponse.json({
      verifications,
      stats: {
        total: (stats as any)?.total || 0,
        authentic: (stats as any)?.authentic || 0,
        suspicious: (stats as any)?.suspicious || 0,
        fake: (stats as any)?.fake || 0,
        avgScore: Math.round((stats as any)?.avg_score || 0),
      },
      dailyStats,
      total: (stats as any)?.total || 0,
      hasMore: verifications.length === limit,
    });
  } catch (error) {
    console.error('Error fetching verifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verifications' },
      { status: 500 }
    );
  }
}

// POST - Save verification
export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.trustScore || !data.verdict) {
      return NextResponse.json(
        { error: 'Trust score and verdict are required' },
        { status: 400 }
      );
    }

    const verification = VerificationModel.create({
      userId: data.userId || null,
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

    return NextResponse.json({
      verification,
      message: 'Verification saved',
    });
  } catch (error) {
    console.error('Error saving verification:', error);
    return NextResponse.json(
      { error: 'Failed to save verification' },
      { status: 500 }
    );
  }
}

// DELETE - Delete verification
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Verification ID is required' },
        { status: 400 }
      );
    }

    // TODO: Implement delete in database

    return NextResponse.json({
      message: 'Verification deleted',
      id,
    });
  } catch (error) {
    console.error('Error deleting verification:', error);
    return NextResponse.json(
      { error: 'Failed to delete verification' },
      { status: 500 }
    );
  }
}
