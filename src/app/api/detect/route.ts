import { NextResponse } from 'next/server';
import { analyzeContent, analyzeTextAuthenticity } from '@/lib/openai';

// POST - Detect AI-generated content
export async function POST(request: Request) {
  try {
    const { content, type, deepAnalysis } = await request.json();

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
    const { items } = await request.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Items array is required' },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      items.map(async (item: { content: string; type: string }) => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/detect`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
          });
          return response.json();
        } catch {
          return { error: true, item };
        }
      })
    );

    const summary = {
      total: items.length,
      aiGenerated: results.filter(r => r.isAIGenerated).length,
      human: results.filter(r => !r.isAIGenerated && !r.error).length,
      errors: results.filter(r => r.error).length,
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
