import { NextResponse } from 'next/server';
import { validateApiKey, checkRateLimit } from '@/lib/api-keys';
import { analyzeContent, analyzeTextAuthenticity } from '@/lib/openai';
import { VerificationModel, SourceModel } from '@/lib/models';
import { readC2PA, calculateC2paScore } from '@/lib/c2pa';
import { analyzeVideo, calculateVideoScore } from '@/lib/video';

// Middleware to validate API key
function getApiKey(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  const url = new URL(request.url);
  return url.searchParams.get('api_key');
}

// POST /api/v1/verify - Verify content
export async function POST(request: Request) {
  try {
    // Validate API key
    const apiKey = getApiKey(request);
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key required. Include Authorization: Bearer <key> header or api_key query parameter.' },
        { status: 401 }
      );
    }

    const keyInfo = validateApiKey(apiKey);
    if (!keyInfo) {
      return NextResponse.json(
        { error: 'Invalid or revoked API key' },
        { status: 401 }
      );
    }

    // Check rate limit
    const rateLimit = checkRateLimit(apiKey);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          resetAt: rateLimit.resetAt,
          limits: {
            perMinute: keyInfo.requestsPerMinute,
            perDay: keyInfo.requestsPerDay,
          }
        },
        { status: 429 }
      );
    }

    // Parse request
    const body = await request.json();
    const { content, type, options } = body;

    if (!content || !type) {
      return NextResponse.json(
        { error: 'content and type are required' },
        { status: 400 }
      );
    }

    const validTypes = ['url', 'text', 'image', 'video'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Perform verification
    const result = await verifyContent(content, type, options);

    // Add rate limit headers
    const response = NextResponse.json({
      success: true,
      data: result,
    });
    
    response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateLimit.resetAt);

    return response;
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/v1/verify?url=... - Quick verify URL
export async function GET(request: Request) {
  try {
    const apiKey = getApiKey(request);
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key required' },
        { status: 401 }
      );
    }

    const keyInfo = validateApiKey(apiKey);
    if (!keyInfo) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    const rateLimit = checkRateLimit(apiKey);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const text = searchParams.get('text');

    if (!url && !text) {
      return NextResponse.json(
        { error: 'url or text parameter required' },
        { status: 400 }
      );
    }

    const content = url || text!;
    const type = url ? 'url' : 'text';

    const result = await verifyContent(content, type, {});

    const response = NextResponse.json({
      success: true,
      data: result,
    });
    
    response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateLimit.resetAt);

    return response;
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Verify content helper
async function verifyContent(content: string, type: string, options: any) {
  const checks = [];
  let trustScore = 50;
  let verdict: 'authentic' | 'suspicious' | 'fake' | 'unknown' = 'unknown';
  let confidence = 50;

  // Video verification
  if (type === 'video' || isVideoUrl(content)) {
    const videoResult = await analyzeVideo(content);
    const videoScore = calculateVideoScore(videoResult);
    
    return {
      content,
      type: 'video',
      trustScore: videoScore,
      verdict: videoResult.isAuthentic ? 'authentic' : 'suspicious',
      confidence: videoResult.confidence,
      checks: videoResult.checks,
      timestamp: new Date().toISOString(),
    };
  }

  // C2PA Check for images
  if (type === 'image' || isImageUrl(content)) {
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

  return {
    content,
    type,
    trustScore,
    verdict,
    confidence,
    checks,
    timestamp: new Date().toISOString(),
  };
}

function isVideoUrl(url: string): boolean {
  const videoPlatforms = ['youtube.com', 'youtu.be', 'vimeo.com', 'tiktok.com'];
  return videoPlatforms.some(p => url.includes(p));
}

function isImageUrl(url: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  return imageExtensions.some(ext => url.toLowerCase().includes(ext));
}
