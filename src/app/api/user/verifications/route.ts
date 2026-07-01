import { NextResponse } from 'next/server';

// GET - Get user's verification history
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // TODO: Replace with actual database query
    const verifications = [
      {
        id: '1',
        url: 'https://example.com/article/1',
        type: 'url',
        trustScore: 87,
        verdict: 'authentic',
        confidence: 85,
        domain: 'reuters.com',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        url: 'https://twitter.com/user/status/123',
        type: 'url',
        trustScore: 42,
        verdict: 'suspicious',
        confidence: 60,
        domain: 'twitter.com',
        createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        type: 'text',
        content: 'Breaking news article text...',
        trustScore: 91,
        verdict: 'authentic',
        confidence: 88,
        domain: 'bbc.com',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        type: 'image',
        url: 'https://example.com/image.jpg',
        trustScore: 35,
        verdict: 'fake',
        confidence: 72,
        domain: 'unknown',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      },
    ];

    return NextResponse.json({
      verifications: verifications.slice(offset, offset + limit),
      total: verifications.length,
      hasMore: offset + limit < verifications.length,
      stats: {
        total: verifications.length,
        authentic: verifications.filter(v => v.verdict === 'authentic').length,
        suspicious: verifications.filter(v => v.verdict === 'suspicious').length,
        fake: verifications.filter(v => v.verdict === 'fake').length,
      },
    });
  } catch (error) {
    console.error('Error fetching verifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verifications' },
      { status: 500 }
    );
  }
}

// POST - Save verification
export async function POST(request: Request) {
  try {
    const verification = await request.json();

    if (!verification.trustScore || !verification.verdict) {
      return NextResponse.json(
        { error: 'Trust score and verdict are required' },
        { status: 400 }
      );
    }

    // TODO: Save to database
    const saved = {
      id: Date.now().toString(),
      ...verification,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      verification: saved,
      message: 'Verification saved',
    });
  } catch (error) {
    console.error('Error saving verification:', error);
    return NextResponse.json(
      { error: 'Failed to save verification' },
      { status: 500 }
    );
  }
}

// DELETE - Delete verification
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Verification ID is required' },
        { status: 400 }
      );
    }

    // TODO: Delete from database

    return NextResponse.json({
      message: 'Verification deleted',
      id,
    });
  } catch (error) {
    console.error('Error deleting verification:', error);
    return NextResponse.json(
      { error: 'Failed to delete verification' },
      { status: 500 }
    );
  }
}
