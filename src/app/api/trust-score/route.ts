import { NextResponse } from 'next/server';
import { analyzeContent, analyzeTextAuthenticity, extractClaims } from '@/lib/gemini';

// POST - Get trust score
export async function POST(request: Request) {
  try {
    const { content, type } = await request.json();

    if (!content || !type) {
      return NextResponse.json(
        { error: 'Content and type are required' },
        { status: 400 }
      );
    }

    // Analyze content
    let aiResult;
    if (type === 'text') {
      aiResult = await analyzeTextAuthenticity(content);
    } else {
      aiResult = await analyzeContent(content, type);
    }

    // Extract claims if text
    let claims: Array<{ claim: string; verifiable: boolean; confidence: number }> = [];
    if (type === 'text') {
      const claimsResult = await extractClaims(content);
      claims = claimsResult.claims;
    }

    // Calculate trust score
    const breakdown = {
      c2pa: 0, // Will be set if C2PA is present
      aiDetection: aiResult.isAIGenerated ? 20 : 85,
      source: 50, // Default
      community: 50, // Default
    };

    const overall = Math.round(
      (breakdown.c2pa * 0.4) +
      (breakdown.aiDetection * 0.3) +
      (breakdown.source * 0.2) +
      (breakdown.community * 0.1)
    );

    // Generate factors
    const factors = [];

    if (aiResult.isAIGenerated) {
      factors.push({
        name: 'AI Generated',
        impact: 'negative' as const,
        weight: 30,
        description: `Content appears to be AI-generated (${aiResult.confidence}% confidence)`,
      });
    } else {
      factors.push({
        name: 'Human Written',
        impact: 'positive' as const,
        weight: 20,
        description: 'Content appears to be written by a human',
      });
    }

    if (claims.length > 0) {
      const unverifiable = claims.filter(c => !c.verifiable);
      if (unverifiable.length > 0) {
        factors.push({
          name: 'Unverifiable Claims',
          impact: 'negative' as const,
          weight: 15,
          description: `${unverifiable.length} claims cannot be verified`,
        });
      }
    }

    return NextResponse.json({
      overall: Math.max(0, Math.min(100, overall)),
      breakdown,
      factors,
      aiAnalysis: aiResult,
      claims,
    });
  } catch (error) {
    console.error('Error getting trust score:', error);
    return NextResponse.json(
      { error: 'Failed to get trust score' },
      { status: 500 }
    );
  }
}
