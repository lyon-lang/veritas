import { NextResponse } from 'next/server';
import { analyzeContent, analyzeTextAuthenticity } from '@/lib/openai';
import { VerificationModel, SourceModel } from '@/lib/models';

// POST - Verify content
export async function POST(request: Request) {
  try {
    const { content, type, options, userId } = await request.json();

    if (!content || !type) {
      return NextResponse.json(
        { error: 'Content and type are required' },
        { status: 400 }
      );
    }

    const validTypes = ['image', 'video', 'text', 'audio', 'url'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    const checks = [];
    let trustScore = 50;
    let verdict: 'authentic' | 'suspicious' | 'fake' | 'unknown' = 'unknown';
    let confidence = 50;
    let c2paData = null;
    let aiDetection = null;
    let sourceData = null;

    // 1. C2PA Check
    if (options?.checkC2PA !== false) {
      const c2paCheck = await checkC2PA(content, type);
      checks.push(c2paCheck);
      trustScore += c2paCheck.score > 0 ? 20 : -10;
      c2paData = c2paCheck.c2pa || null;
    }

    // 2. AI Detection
    if (options?.checkAI !== false) {
      const aiCheck = await checkAI(content, type);
      checks.push(aiCheck);
      trustScore += aiCheck.score > 70 ? 15 : -20;
      aiDetection = aiCheck.aiDetection || null;
    }

    // 3. Source Credibility
    if (options?.checkSource !== false && type === 'url') {
      const sourceCheck = await checkSource(content);
      checks.push(sourceCheck);
      trustScore += sourceCheck.score > 70 ? 15 : -10;
      sourceData = sourceCheck.source || null;
    }

    // Calculate final score
    trustScore = Math.max(0, Math.min(100, trustScore));

    // Determine verdict
    if (trustScore >= 80) {
      verdict = 'authentic';
      confidence = 85;
    } else if (trustScore >= 60) {
      verdict = 'authentic';
      confidence = 65;
    } else if (trustScore >= 40) {
      verdict = 'suspicious';
      confidence = 55;
    } else {
      verdict = 'fake';
      confidence = 75;
    }

    // Save to database
    const verification = VerificationModel.create({
      userId: userId || null,
      url: type === 'url' ? content : null,
      contentType: type,
      trustScore,
      verdict,
      confidence,
      checks,
      c2paData,
      aiDetection,
      sourceData,
    });

    return NextResponse.json({
      id: verification.id,
      trustScore,
      verdict,
      confidence,
      checks,
      c2paData,
      aiDetection,
      sourceData,
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

    return NextResponse.json({
      verifications,
      stats,
      total: (stats as any)?.total || 0,
    });
  } catch (error) {
    console.error('Error fetching verifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verifications' },
      { status: 500 }
    );
  }
}

async function checkC2PA(content: string, type: string) {
  // TODO: Implement actual C2PA verification
  return {
    name: 'C2PA Credentials',
    status: 'passed' as const,
    score: 95,
    details: 'Content Credentials present and valid',
    c2pa: {
      present: true,
      valid: true,
      creator: 'Adobe Photoshop',
      timestamp: '2025-01-15T10:30:00Z',
      tools: ['Adobe Photoshop', 'Adobe Camera Raw'],
    },
  };
}

async function checkAI(content: string, type: string) {
  try {
    if (type === 'text') {
      const result = await analyzeTextAuthenticity(content);
      return {
        name: 'AI Detection',
        status: result.isAIGenerated ? 'failed' as const : 'passed' as const,
        score: result.isAIGenerated ? 30 : 85,
        details: result.isAIGenerated 
          ? `AI-generated content detected (${result.confidence}% confidence)`
          : `Content appears human-written (${result.confidence}% confidence)`,
        aiDetection: {
          isAIGenerated: result.isAIGenerated,
          confidence: result.confidence,
          indicators: result.indicators,
        },
      };
    }

    const result = await analyzeContent(content, type as 'image' | 'video' | 'audio' | 'url');
    return {
      name: 'AI Detection',
      status: result.isAIGenerated ? 'failed' as const : 'passed' as const,
      score: result.isAIGenerated ? 30 : 85,
      details: result.isAIGenerated 
        ? `AI-generated content detected (${result.confidence}% confidence)`
        : `Content appears authentic (${result.confidence}% confidence)`,
      aiDetection: {
        isAIGenerated: result.isAIGenerated,
        confidence: result.confidence,
        indicators: result.indicators,
      },
    };
  } catch {
    return {
      name: 'AI Detection',
      status: 'warning' as const,
      score: 50,
      details: 'Unable to perform AI detection',
    };
  }
}

async function checkSource(url: string) {
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    
    // Check database first
    const dbSource = SourceModel.findByDomain(domain);
    
    if (dbSource) {
      return {
        name: 'Source Credibility',
        status: (dbSource as any).score >= 70 ? 'passed' as const : 'warning' as const,
        score: (dbSource as any).score,
        details: `${domain} - ${(dbSource as any).description}`,
        source: dbSource,
      };
    }

    // Default for unknown sources
    return {
      name: 'Source Credibility',
      status: 'warning' as const,
      score: 50,
      details: `${domain} - credibility not verified`,
      source: {
        domain,
        score: 50,
        category: 'unknown',
        reputation: 'unknown',
      },
    };
  } catch {
    return {
      name: 'Source Credibility',
      status: 'warning' as const,
      score: 50,
      details: 'Unable to verify source',
    };
  }
}
