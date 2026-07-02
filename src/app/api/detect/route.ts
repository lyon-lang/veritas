import { NextResponse } from 'next/server';
import { analyzeContent, analyzeTextAuthenticity } from '@/lib/gemini';
import { checkUserRateLimit } from '@/lib/rate-limit';

const MAX_CONTENT_LENGTH = 10000;
const MAX_BATCH_SIZE = 10;

// POST - Detect AI-generated content
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

    const validTypes = ['image', 'video', 'text', 'audio'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    if (typeof content === 'string' && content.length > MAX_CONTENT_LENGTH) {
      return NextResponse.json(
        { error: `Content exceeds maximum length of ${MAX_CONTENT_LENGTH} characters` },
        { status: 400 }
      );
    }

    let result;

    if (type === 'text') {
      result = await analyzeTextAuthenticity(content);
      
      return NextResponse.json({
        type: 'text',
        isAIGenerated: result.isAIGenerated,
        confidence: result.confidence,
        style: result.style,
        indicators: result.indicators,
        breakdown: {
          patterns: result.indicators.filter(i => i.includes('pattern')),
          vocabulary: result.indicators.filter(i => i.includes('vocabulary') || i.includes('word')),
          structure: result.indicators.filter(i => i.includes('structure') || i.includes('sentence')),
        },
      });
    } else {
      result = await analyzeContent(content, type);
      
      return NextResponse.json({
        type,
        isAIGenerated: result.isAIGenerated,
        confidence: result.confidence,
        indicators: result.indicators,
        breakdown: {
          artifacts: result.indicators.filter(i => i.includes('artifact')),
          inconsistencies: result.indicators.filter(i => i.includes('inconsisten')),
          patterns: result.indicators.filter(i => i.includes('pattern')),
        },
      });
    }
  } catch (error) {
    console.error('Error detecting AI content:', error);
    return NextResponse.json(
      { error: 'Failed to detect AI content' },
      { status: 500 }
    );
  }
}

// PUT - Batch detect AI content
export async function PUT(request: Request) {
  try {
    const rateLimit = await checkUserRateLimit();
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again later.', resetAt: rateLimit.resetAt },
        { status: 429 }
      );
    }

    const { items } = await request.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Items array is required' },
        { status: 400 }
      );
    }

    if (items.length > MAX_BATCH_SIZE) {
      return NextResponse.json(
        { error: `Batch size exceeds maximum of ${MAX_BATCH_SIZE} items` },
        { status: 400 }
      );
    }

    const results = [];
    for (const item of items) {
      try {
        if (!item.content || !item.type) {
          results.push({ error: true, message: 'Missing content or type', item });
          continue;
        }

        if (typeof item.content === 'string' && item.content.length > MAX_CONTENT_LENGTH) {
          results.push({ error: true, message: 'Content too long', item });
          continue;
        }

        let result;
        if (item.type === 'text') {
          result = await analyzeTextAuthenticity(item.content);
        } else {
          result = await analyzeContent(item.content, item.type);
        }
        results.push({ type: item.type, ...result });
      } catch {
        results.push({ error: true, item });
      }
    }

    const summary = {
      total: items.length,
      aiGenerated: results.filter((r: any) => r.isAIGenerated).length,
      human: results.filter((r: any) => !r.isAIGenerated && !r.error).length,
      errors: results.filter((r: any) => r.error).length,
    };

    return NextResponse.json({ results, summary });
  } catch (error) {
    console.error('Error batch detecting:', error);
    return NextResponse.json(
      { error: 'Failed to batch detect content' },
      { status: 500 }
    );
  }
}
