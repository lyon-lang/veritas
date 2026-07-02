import { NextResponse } from 'next/server';
import { analyzeTextAuthenticity, extractClaims } from '@/lib/gemini';
import { VerificationModel, SourceModel } from '@/lib/models';
import { getAuthUser } from '@/lib/auth';
import { checkUserRateLimit } from '@/lib/rate-limit';

const MAX_CONTENT_LENGTH = 10000;

// Simplified verification - focuses on what Gemini does well
export async function POST(request: Request) {
  try {
    const rateLimit = await checkUserRateLimit();
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again later.', resetAt: rateLimit.resetAt },
        { status: 429 }
      );
    }

    const { content, type } = await request.json();

    if (!content || !type) {
      return NextResponse.json(
        { error: 'Content and type are required' },
        { status: 400 }
      );
    }

    const validTypes = ['url', 'text'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Supported types: url, text' },
        { status: 400 }
      );
    }

    if (typeof content === 'string' && content.length > MAX_CONTENT_LENGTH) {
      return NextResponse.json(
        { error: `Content exceeds maximum length of ${MAX_CONTENT_LENGTH} characters` },
        { status: 400 }
      );
    }

    const user = await getAuthUser();
    const checks = [];
    let trustScore = 50;

    // 1. Source Credibility (for URLs)
    if (type === 'url') {
      try {
        const domain = new URL(content).hostname.replace('www.', '');
        const source = SourceModel.findByDomain(domain);
        
        if (source) {
          checks.push({
            name: 'Source Credibility',
            status: source.score >= 70 ? 'passed' : source.score >= 50 ? 'warning' : 'failed',
            score: source.score,
            details: `${domain} - ${source.description}`,
          });
          trustScore += (source.score - 50) * 0.5;
        } else {
          checks.push({
            name: 'Source Credibility',
            status: 'warning',
            score: 50,
            details: `${domain} - Unknown source`,
          });
        }
      } catch {
        checks.push({
          name: 'Source Credibility',
          status: 'warning',
          score: 50,
          details: 'Unable to verify source',
        });
      }
    }

    // 2. AI Content Detection (for text)
    if (type === 'text' || type === 'url') {
      try {
        const textToAnalyze = type === 'text' ? content : content; // URL gets analyzed as text
        const aiResult = await analyzeTextAuthenticity(textToAnalyze);
        
        checks.push({
          name: 'AI Detection',
          status: aiResult.isAIGenerated ? 'failed' : 'passed',
          score: aiResult.isAIGenerated ? 30 : 80,
          details: aiResult.isAIGenerated 
            ? `AI-generated content detected (${aiResult.confidence}% confidence)`
            : `Content appears human-written`,
        });
        
        trustScore += aiResult.isAIGenerated ? -25 : 15;
      } catch {
        checks.push({
          name: 'AI Detection',
          status: 'warning',
          score: 50,
          details: 'Unable to analyze',
        });
      }
    }

    // 3. Claims Analysis (for text)
    if (type === 'text' && content.length > 100) {
      try {
        const claimsResult = await extractClaims(content);
        
        if (claimsResult.claims.length > 0) {
          const unverifiable = claimsResult.claims.filter(c => !c.verifiable).length;
          const avgConfidence = claimsResult.claims.reduce((sum, c) => sum + c.confidence, 0) / claimsResult.claims.length;
          
          checks.push({
            name: 'Claims Analysis',
            status: unverifiable > claimsResult.claims.length / 2 ? 'warning' : 'passed',
            score: Math.round(avgConfidence),
            details: `${claimsResult.claims.length} claims found, ${unverifiable} unverifiable`,
          });
          
          trustScore -= unverifiable * 5;
        }
      } catch {
        // Claims analysis is optional
      }
    }

    // Calculate final score
    trustScore = Math.max(0, Math.min(100, Math.round(trustScore)));

    // Determine verdict
    let verdict: string;
    let confidence: number;

    if (trustScore >= 80) {
      verdict = 'authentic';
      confidence = 85;
    } else if (trustScore >= 60) {
      verdict = 'likely authentic';
      confidence = 70;
    } else if (trustScore >= 40) {
      verdict = 'suspicious';
      confidence = 60;
    } else {
      verdict = 'untrusted';
      confidence = 75;
    }

    // Save to database
    const verification = VerificationModel.create({
      userId: user?.id,
      url: type === 'url' ? content : undefined,
      contentType: type,
      trustScore,
      verdict,
      confidence,
      checks,
    });

    return NextResponse.json({
      id: verification.id,
      trustScore,
      verdict,
      confidence,
      checks,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error verifying content:', error);
    return NextResponse.json(
      { error: 'Failed to verify content' },
      { status: 500 }
    );
  }
}

// GET - Get verification history
export async function GET(request: Request) {
  try {
    const user = await getAuthUser();
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);

    let verifications;
    let stats;
    
    if (user) {
      verifications = VerificationModel.findByUser(user.id, limit);
      stats = VerificationModel.getStats(user.id);
    } else {
      verifications = VerificationModel.getRecent(limit);
      stats = VerificationModel.getStats();
    }

    return NextResponse.json({
      verifications,
      stats,
    });
  } catch (error) {
    console.error('Error fetching verifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verifications' },
      { status: 500 }
    );
  }
}
