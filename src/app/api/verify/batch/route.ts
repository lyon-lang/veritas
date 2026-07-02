import { NextResponse } from 'next/server';
import { analyzeContent, analyzeTextAuthenticity } from '@/lib/gemini';
import { VerificationModel, SourceModel } from '@/lib/models';
import { readC2PA, calculateC2paScore } from '@/lib/c2pa';
import { analyzeVideo, calculateVideoScore } from '@/lib/video';

interface VerificationRequest {
  content: string;
  type: 'url' | 'text' | 'image' | 'video';
}

interface VerificationResult {
  id: string;
  content: string;
  type: string;
  trustScore: number;
  verdict: string;
  confidence: number;
  checks: any[];
  error?: string;
}

// POST - Batch verify multiple items
export async function POST(request: Request) {
  try {
    const { items, userId } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items array is required and must not be empty' },
        { status: 400 }
      );
    }

    if (items.length > 50) {
      return NextResponse.json(
        { error: 'Maximum 50 items per batch' },
        { status: 400 }
      );
    }

    // Process items in parallel with concurrency limit
    const results: VerificationResult[] = [];
    const concurrency = 5; // Process 5 at a time

    for (let i = 0; i < items.length; i += concurrency) {
      const batch = items.slice(i, i + concurrency);
      const batchResults = await Promise.all(
        batch.map(async (item: VerificationRequest) => {
          try {
            return await verifySingleItem(item, userId);
          } catch (error) {
            return {
              id: crypto.randomUUID(),
              content: item.content,
              type: item.type,
              trustScore: 0,
              verdict: 'error',
              confidence: 0,
              checks: [],
              error: error instanceof Error ? error.message : 'Verification failed',
            };
          }
        })
      );
      results.push(...batchResults);
    }

    // Calculate summary
    const summary = {
      total: results.length,
      successful: results.filter(r => !r.error).length,
      failed: results.filter(r => r.error).length,
      authentic: results.filter(r => r.verdict === 'authentic').length,
      suspicious: results.filter(r => r.verdict === 'suspicious').length,
      fake: results.filter(r => r.verdict === 'fake').length,
      avgScore: results.length > 0 
        ? Math.round(results.reduce((sum, r) => sum + r.trustScore, 0) / results.length)
        : 0,
    };

    return NextResponse.json({
      results,
      summary,
    });
  } catch (error) {
    console.error('Error in batch verification:', error);
    return NextResponse.json(
      { error: 'Failed to process batch verification' },
      { status: 500 }
    );
  }
}

async function verifySingleItem(item: VerificationRequest, userId?: string): Promise<VerificationResult> {
  const { content, type } = item;
  const checks = [];
  let trustScore = 50;
  let verdict: 'authentic' | 'suspicious' | 'fake' | 'unknown' = 'unknown';
  let confidence = 50;

  // Video verification
  if (type === 'video' || (type === 'url' && isVideoUrl(content))) {
    const videoResult = await analyzeVideo(content);
    const videoScore = calculateVideoScore(videoResult);
    
    return {
      id: crypto.randomUUID(),
      content,
      type: 'video',
      trustScore: videoScore,
      verdict: videoResult.isAuthentic ? 'authentic' : 'suspicious',
      confidence: videoResult.confidence,
      checks: videoResult.checks,
    };
  }

  // C2PA Check for images
  if (type === 'image' || (type === 'url' && isImageUrl(content))) {
    try {
      const c2paResult = await readC2PA(content);
      const c2paScore = calculateC2paScore(c2paResult);
      checks.push({
        name: 'C2PA',
        status: c2paResult.hasCredentials ? 'passed' : 'failed',
        score: c2paScore,
        details: c2paResult.hasCredentials ? 'Credentials found' : 'No credentials',
      });
      trustScore += c2paScore > 0 ? 20 : -10;
    } catch {
      checks.push({
        name: 'C2PA',
        status: 'warning',
        score: 0,
        details: 'Unable to check',
      });
    }
  }

  // AI Detection for text
  if (type === 'text') {
    try {
      const aiResult = await analyzeTextAuthenticity(content);
      checks.push({
        name: 'AI Detection',
        status: aiResult.isAIGenerated ? 'failed' : 'passed',
        score: aiResult.isAIGenerated ? 30 : 85,
        details: aiResult.isAIGenerated ? 'AI-generated detected' : 'Human-written',
      });
      trustScore += aiResult.isAIGenerated ? -20 : 15;
    } catch {
      checks.push({
        name: 'AI Detection',
        status: 'warning',
        score: 50,
        details: 'Unable to analyze',
      });
    }
  }

  // Source credibility for URLs
  if (type === 'url') {
    try {
      const domain = new URL(content).hostname.replace('www.', '');
      const source = SourceModel.findByDomain(domain);
      
      if (source) {
        checks.push({
          name: 'Source',
          status: source.score >= 70 ? 'passed' : 'warning',
          score: source.score,
          details: `${domain} - ${source.description}`,
        });
        trustScore += source.score >= 70 ? 15 : -10;
      } else {
        checks.push({
          name: 'Source',
          status: 'warning',
          score: 50,
          details: `${domain} - unknown credibility`,
        });
      }
    } catch {
      checks.push({
        name: 'Source',
        status: 'warning',
        score: 50,
        details: 'Unable to verify source',
      });
    }
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
    userId: userId || undefined,
    url: type === 'url' ? content : undefined,
    contentType: type,
    trustScore,
    verdict,
    confidence,
    checks,
  });

  return {
    id: verification.id,
    content,
    type,
    trustScore,
    verdict,
    confidence,
    checks,
  };
}

function isVideoUrl(url: string): boolean {
  const videoPlatforms = ['youtube.com', 'youtu.be', 'vimeo.com', 'tiktok.com', 'twitter.com', 'x.com'];
  return videoPlatforms.some(p => url.includes(p));
}

function isImageUrl(url: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  return imageExtensions.some(ext => url.toLowerCase().includes(ext));
}
