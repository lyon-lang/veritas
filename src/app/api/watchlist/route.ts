import { NextResponse } from 'next/server';
import { WatchlistModel, AlertsModel } from '@/lib/watchlist';
import { analyzeVideo } from '@/lib/video';

// GET - Get user's watchlist
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type') || 'watchlist'; // watchlist or alerts
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (type === 'alerts') {
      const alerts = AlertsModel.findByUser(userId, unreadOnly);
      const unreadCount = AlertsModel.getUnreadCount(userId);
      
      return NextResponse.json({
        alerts,
        unreadCount,
        total: alerts.length,
      });
    }

    const items = WatchlistModel.findByUser(userId);
    
    return NextResponse.json({
      items,
      total: items.length,
    });
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch watchlist' },
      { status: 500 }
    );
  }
}

// POST - Add to watchlist
export async function POST(request: Request) {
  try {
    const { userId, url, label } = await request.json();

    if (!userId || !url) {
      return NextResponse.json(
        { error: 'User ID and URL are required' },
        { status: 400 }
      );
    }

    // Get initial verification
    let initialScore = 50;
    let initialVerdict = 'unknown';

    try {
      // Quick verification
      const isVideo = url.includes('youtube.com') || url.includes('vimeo.com') || url.includes('tiktok.com');
      
      if (isVideo) {
        const result = await analyzeVideo(url);
        initialScore = result.confidence;
        initialVerdict = result.isAuthentic ? 'authentic' : 'suspicious';
      }
      // For other content, use default scores
    } catch (error) {
      console.error('Error getting initial score:', error);
    }

    const item = WatchlistModel.create({
      userId,
      url,
      label: label || new URL(url).hostname,
      initialScore,
      initialVerdict,
    });

    return NextResponse.json({
      item,
      message: 'Added to watchlist',
    });
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return NextResponse.json(
      { error: 'Failed to add to watchlist' },
      { status: 500 }
    );
  }
}

// PATCH - Update watchlist item
export async function PATCH(request: Request) {
  try {
    const { id, label, userId } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Watchlist ID is required' },
        { status: 400 }
      );
    }

    const item = WatchlistModel.update(id, { label });

    if (!item) {
      return NextResponse.json(
        { error: 'Watchlist item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      item,
      message: 'Watchlist updated',
    });
  } catch (error) {
    console.error('Error updating watchlist:', error);
    return NextResponse.json(
      { error: 'Failed to update watchlist' },
      { status: 500 }
    );
  }
}

// DELETE - Remove from watchlist
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Watchlist ID is required' },
        { status: 400 }
      );
    }

    WatchlistModel.delete(id);

    return NextResponse.json({
      message: 'Removed from watchlist',
    });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return NextResponse.json(
      { error: 'Failed to remove from watchlist' },
      { status: 500 }
    );
  }
}
