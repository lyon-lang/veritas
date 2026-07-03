import { NextResponse } from 'next/server';
import { AlertsModel } from '@/lib/watchlist';
import { requireAuth, requireCsrf } from '@/lib/auth';
import { AlertUpdateSchema } from '@/lib/validation';
import { validateRequest } from '@/lib/validate';

// GET - Get user's alerts
export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const alerts = AlertsModel.findByUser(user.id, unreadOnly);
    const unreadCount = AlertsModel.getUnreadCount(user.id);

    return NextResponse.json({
      alerts,
      unreadCount,
      total: alerts.length,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    console.error('Error fetching alerts:', error);
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
  }
}

// PATCH - Mark alert as read
export async function PATCH(request: Request) {
  try {
    const user = await requireAuth();
    await requireCsrf(request);
    
    const body = await request.json();
    const validation = validateRequest(AlertUpdateSchema, body);
    if (!validation.success) {
      return validation.response;
    }

    const { alertId, markAll } = validation.data;

    if (markAll) {
      AlertsModel.markAllAsRead(user.id);
      return NextResponse.json({ message: 'All alerts marked as read' });
    }

    if (!alertId) {
      return NextResponse.json({ error: 'Alert ID is required' }, { status: 400 });
    }

    const alert = AlertsModel.markAsRead(alertId);

    if (!alert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    return NextResponse.json({ alert, message: 'Alert marked as read' });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    if (error.message === 'CSRF_INVALID') {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
    }
    console.error('Error updating alert:', error);
    return NextResponse.json({ error: 'Failed to update alert' }, { status: 500 });
  }
}
