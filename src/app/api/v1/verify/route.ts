import { NextResponse } from 'next/server';
import { validateApiKey, checkRateLimit } from '@/lib/api-keys';
import { analyzeContent, analyzeTextAuthenticity } from '@/lib/gemini';
import { VerificationModel, SourceModel } from '@/lib/models';
import { readC2PA, calculateC2paScore } from '@/lib/c2pa';
import { checkUserRateLimit } from '@/lib/rate-limit';
import { calculateVerdict } from '@/lib/utils';

function getApiKey(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const rateLimit = await checkUserRateLimit();
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', resetAt: rateLimit.resetAt },
        { status: 429 }
      );
    }

    const apiKey = getApiKey(request);
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key required. Use Authorization: Bearer <key> header.' },
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

    const apiRateLimit = checkRateLimit(apiKey);
    if (!apiRateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'API rate limit exceeded',
          resetAt: apiRateLimit.resetAt,
          limits: {
            perMinute: keyInfo.requests_per_minute,
            perDay: keyInfo.requests_per_day,
          }
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { content, type, options } = body;

    if (!content || !type) {
      return NextResponse.json(
        { error: 'content and type are required' },
        { status: 400 }
      );
    }

    const validTypes = ['url', 'text', 'image'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    if (typeof content === 'string' && content.length > 10000) {
      return NextResponse.json(
        { error: 'Content exceeds maximum length of 10000 characters' },
        { status: 400 }
      );
    }

    const result = await verifyContent(content, type, options);

    const response = NextResponse.json({
      success: true,
      data: result,
    });
    
    response.headers.set('X-RateLimit-Remaining', apiRateLimit.remaining.toString());
    response.headers.set('X-RateLimit-Reset', apiRateLimit.resetAt);

    return response;
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

async function verifyContent(content: string, type: string, options: any) {
  const checks = [];
  let trustScore = 50;

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

  trustScore = Math.max(0, Math.min(100, trustScore));

  const verdictResult = calculateVerdict(trustScore);

  return {
    content,
    type,
    trustScore,
    verdict: verdictResult.verdict,
    confidence: verdictResult.confidence,
    checks,
    timestamp: new Date().toISOString(),
  };
}

function isImageUrl(url: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  return imageExtensions.some(ext => url.toLowerCase().includes(ext));
}
