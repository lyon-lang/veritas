import { NextResponse } from 'next/server';
import { AlertsModel } from '@/lib/watchlist';

// GET - Get user's alerts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const alerts = AlertsModel.findByUser(userId, unreadOnly);
    const unreadCount = AlertsModel.getUnreadCount(userId);

    return NextResponse.json({
      alerts,
      unreadCount,
      total: alerts.length,
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

// PATCH - Mark alert as read
export async function PATCH(request: Request) {
  try {
    const { alertId, markAll, userId } = await request.json();

    if (markAll && userId) {
      AlertsModel.markAllAsRead(userId);
      return NextResponse.json({
        message: 'All alerts marked as read',
      });
    }

    if (!alertId) {
      return NextResponse.json(
        { error: 'Alert ID is required' },
        { status: 400 }
      );
    }

    const alert = AlertsModel.markAsRead(alertId);

    if (!alert) {
      return NextResponse.json(
        { error: 'Alert not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      alert,
      message: 'Alert marked as read',
    });
  } catch (error) {
    console.error('Error updating alert:', error);
    return NextResponse.json(
      { error: 'Failed to update alert' },
      { status: 500 }
    );
  }
}
