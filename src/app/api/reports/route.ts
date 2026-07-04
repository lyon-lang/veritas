import { NextResponse } from 'next/server';
import { VerificationModel } from '@/lib/models';
import type { VerificationRow } from '@/types';

// GET - Get public verification report
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Report ID is required' },
        { status: 400 }
      );
    }

    const verification = VerificationModel.findById(id);

    if (!verification) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    // Return public-safe data (no user info)
    let checks = [];
    try {
      checks = typeof verification.checks === 'string' 
        ? JSON.parse(verification.checks) 
        : verification.checks || [];
    } catch {
      checks = [];
    }

    return NextResponse.json({
      id: verification.id,
      url: verification.url,
      contentType: verification.content_type,
      trustScore: verification.trust_score,
      verdict: verification.verdict,
      confidence: verification.confidence,
      checks,
      createdAt: verification.created_at,
      shareUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://corevalidate.app'}/report/${verification.id}`,
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    );
  }
}

// POST - Create shareable report
export async function POST(request: Request) {
  try {
    const { verificationId } = await request.json();

    if (!verificationId) {
      return NextResponse.json(
        { error: 'Verification ID is required' },
        { status: 400 }
      );
    }

    const verification = VerificationModel.findById(verificationId);

    if (!verification) {
      return NextResponse.json(
        { error: 'Verification not found' },
        { status: 404 }
      );
    }

    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://corevalidate.app'}/report/${verification.id}`;

    return NextResponse.json({
      id: verification.id,
      shareUrl,
      embedCode: `<iframe src="${shareUrl}" width="400" height="300" frameborder="0"></iframe>`,
      socialText: generateSocialText(verification),
    });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    );
  }
}

function generateSocialText(verification: VerificationRow): string {
  const score = verification.trust_score;
  const verdict = verification.verdict;
  const url = verification.url || 'content';

  if (verdict === 'fake') {
    return `🚨 This content is FAKE (Trust Score: ${score}/100)\n\nVerified with @CoreValidate\n\n${url}`;
  } else if (verdict === 'suspicious') {
    return `⚠️ This content is SUSPICIOUS (Trust Score: ${score}/100)\n\nVerified with @CoreValidate\n\n${url}`;
  } else {
    return `✅ This content is AUTHENTIC (Trust Score: ${score}/100)\n\nVerified with @CoreValidate\n\n${url}`;
  }
}
