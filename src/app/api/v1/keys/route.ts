import { NextResponse } from 'next/server';
import { createApiKey, getUserApiKeys, revokeApiKey, getUsageStats } from '@/lib/api-keys';
import { requireAuth } from '@/lib/auth';

// GET - Get user's API keys
export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'usage') {
      const key = searchParams.get('key');
      if (!key) {
        return NextResponse.json(
          { error: 'API key is required for usage stats' },
          { status: 400 }
        );
      }
      const stats = getUsageStats(key);
      return NextResponse.json({ stats });
    }

    const keys = getUserApiKeys(user.id);
    
    // Mask keys for security
    const maskedKeys = keys.map(k => ({
      id: k.id,
      name: k.name,
      tier: k.tier,
      keyPreview: k.key.substring(0, 12) + '...' + k.key.substring(k.key.length - 4),
      requestsPerDay: k.requests_per_day,
      requestsPerMinute: k.requests_per_minute,
      totalRequests: k.total_requests,
      createdAt: k.created_at,
      lastUsedAt: k.last_used_at,
      active: k.active === 1,
    }));

    return NextResponse.json({ keys: maskedKeys });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}

// POST - Create new API key
export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const { name, tier } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const validTiers = ['free', 'pro', 'enterprise'];
    if (tier && !validTiers.includes(tier)) {
      return NextResponse.json(
        { error: `Invalid tier. Must be one of: ${validTiers.join(', ')}` },
        { status: 400 }
      );
    }

    const apiKey = createApiKey(user.id, name, tier || 'free');

    return NextResponse.json({
      key: apiKey.key,
      id: apiKey.id,
      name: apiKey.name,
      tier: apiKey.tier,
      limits: {
        perDay: apiKey.requests_per_day,
        perMinute: apiKey.requests_per_minute,
      },
      message: 'API key created. Save it securely - it won\'t be shown again.',
    });
  } catch (error) {
    console.error('Error creating API key:', error);
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    );
  }
}

// DELETE - Revoke API key
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    const revoked = revokeApiKey(key);

    if (!revoked) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'API key revoked successfully',
    });
  } catch (error) {
    console.error('Error revoking API key:', error);
    return NextResponse.json(
      { error: 'Failed to revoke API key' },
      { status: 500 }
    );
  }
}
