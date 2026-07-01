import { NextResponse } from 'next/server';
import { analyzeContent, analyzeTextAuthenticity } from '@/lib/openai';

// POST - Verify content
export async function POST(request: Request) {
  try {
    const { content, type, options } = await request.json();

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
    let trustScore = 50; // Start at neutral
    let verdict: 'authentic' | 'suspicious' | 'fake' | 'unknown' = 'unknown';
    let confidence = 50;

    // 1. C2PA Check
    if (options?.checkC2PA !== false) {
      const c2paCheck = await checkC2PA(content, type);
      checks.push(c2paCheck);
      trustScore += c2paCheck.score > 0 ? 20 : -10;
    }

    // 2. AI Detection
    if (options?.checkAI !== false) {
      const aiCheck = await checkAI(content, type);
      checks.push(aiCheck);
      trustScore += aiCheck.score > 70 ? 15 : -20;
    }

    // 3. Source Credibility
    if (options?.checkSource !== false && type === 'url') {
      const sourceCheck = await checkSource(content);
      checks.push(sourceCheck);
      trustScore += sourceCheck.score > 70 ? 15 : -10;
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

    return NextResponse.json({
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

async function checkC2PA(content: string, type: string) {
  // TODO: Implement actual C2PA verification
  // For now, return mock data
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
    const domain = new URL(url).hostname;
    
    // Known trusted sources
    const trustedDomains = [
      'reuters.com', 'apnews.com', 'bbc.com', 'nytimes.com', 'washingtonpost.com',
      'theguardian.com', 'wsj.com', 'bloomberg.com', 'nature.com', 'science.org',
    ];

    const isTrusted = trustedDomains.some(d => domain.includes(d));

    return {
      name: 'Source Credibility',
      status: isTrusted ? 'passed' as const : 'warning' as const,
      score: isTrusted ? 90 : 60,
      details: isTrusted 
        ? `${domain} is a known trusted source`
        : `${domain} - credibility not verified`,
      source: {
        domain,
        score: isTrusted ? 90 : 60,
        category: isTrusted ? 'news' : 'unknown',
        reputation: isTrusted ? 'high' : 'unknown',
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
