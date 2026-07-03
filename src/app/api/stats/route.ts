import { NextResponse } from 'next/server';
import { VerificationModel, StatsModel } from '@/lib/models';
import { getAuthUser } from '@/lib/auth';
import type { StatsTotalsRow, StatsRow } from '@/types';

// GET - Get verification stats
export async function GET(request: Request) {
  try {
    const user = await getAuthUser();

    const overallStats = user 
      ? VerificationModel.getStats(user.id)
      : VerificationModel.getStats();

    const today = new Date().toISOString().split('T')[0];
    const dailyStats = StatsModel.getDaily(today);

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const weeklyStats = StatsModel.getRange(weekAgo, today);

    const weeklyTotals = { total: 0, authentic: 0, suspicious: 0, fake: 0, avgScore: 0 };

    if (Array.isArray(weeklyStats)) {
      for (const day of weeklyStats) {
        weeklyTotals.total += day.total_verifications || 0;
        weeklyTotals.authentic += day.authentic_count || 0;
        weeklyTotals.suspicious += day.suspicious_count || 0;
        weeklyTotals.fake += day.fake_count || 0;
      }
    }

    const total = overallStats?.total || 0;
    const stats = {
      overall: {
        total,
        authentic: overallStats?.authentic || 0,
        suspicious: overallStats?.suspicious || 0,
        fake: overallStats?.fake || 0,
        avgScore: Math.round(overallStats?.avg_score || 0),
        authenticPercent: total > 0 ? Math.round((overallStats?.authentic || 0) / total * 100) : 0,
        suspiciousPercent: total > 0 ? Math.round((overallStats?.suspicious || 0) / total * 100) : 0,
        fakePercent: total > 0 ? Math.round((overallStats?.fake || 0) / total * 100) : 0,
      },
      today: {
        total: dailyStats?.total_verifications || 0,
        authentic: dailyStats?.authentic_count || 0,
        suspicious: dailyStats?.suspicious_count || 0,
        fake: dailyStats?.fake_count || 0,
        avgScore: Math.round(dailyStats?.avg_trust_score || 0),
      },
      week: weeklyTotals,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
