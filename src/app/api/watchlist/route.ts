import { NextResponse } from 'next/server';
import { WatchlistModel, AlertsModel } from '@/lib/watchlist';
import { analyzeVideo } from '@/lib/video';
import { requireAuth } from '@/lib/auth';

// GET - Get user's watchlist
export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'watchlist';
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    if (type === 'alerts') {
      const alerts = AlertsModel.findByUser(user.id, unreadOnly);
      const unreadCount = AlertsModel.getUnreadCount(user.id);
      
      return NextResponse.json({
        alerts,
        unreadCount,
        total: alerts.length,
      });
    }

    const items = WatchlistModel.findByUser(user.id);
    
    return NextResponse.json({
      items,
      total: items.length,
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    console.error('Error fetching watchlist:', error);
    return NextResponse.json({ error: 'Failed to fetch watchlist' }, { status: 500 });
  }
}

// POST - Add to watchlist
export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const { url, label } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    let initialScore = 50;
    let initialVerdict = 'unknown';

    try {
      const isVideo = url.includes('youtube.com') || url.includes('vimeo.com') || url.includes('tiktok.com');
      
      if (isVideo) {
        const result = await analyzeVideo(url);
        initialScore = result.confidence;
        initialVerdict = result.isAuthentic ? 'authentic' : 'suspicious';
      }
    } catch (error) {
      console.error('Error getting initial score:', error);
    }

    let hostname = url;
    try {
      hostname = new URL(url).hostname;
    } catch {}

    const item = WatchlistModel.create({
      userId: user.id,
      url,
      label: label || hostname,
      initialScore,
      initialVerdict,
    });

    return NextResponse.json({ item, message: 'Added to watchlist' });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    console.error('Error adding to watchlist:', error);
    return NextResponse.json({ error: 'Failed to add to watchlist' }, { status: 500 });
  }
}

// PATCH - Update watchlist item
export async function PATCH(request: Request) {
  try {
    const user = await requireAuth();
    const { id, label } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Watchlist ID is required' }, { status: 400 });
    }

    const existing = WatchlistModel.findById(id);
    if (!existing || existing.user_id !== user.id) {
      return NextResponse.json({ error: 'Watchlist item not found' }, { status: 404 });
    }

    const item = WatchlistModel.update(id, { label });

    return NextResponse.json({ item, message: 'Watchlist updated' });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    console.error('Error updating watchlist:', error);
    return NextResponse.json({ error: 'Failed to update watchlist' }, { status: 500 });
  }
}

// DELETE - Remove from watchlist
export async function DELETE(request: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Watchlist ID is required' }, { status: 400 });
    }

    const existing = WatchlistModel.findById(id);
    if (!existing || existing.user_id !== user.id) {
      return NextResponse.json({ error: 'Watchlist item not found' }, { status: 404 });
    }

    WatchlistModel.delete(id);

    return NextResponse.json({ message: 'Removed from watchlist' });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    console.error('Error removing from watchlist:', error);
    return NextResponse.json({ error: 'Failed to remove from watchlist' }, { status: 500 });
  }
}
