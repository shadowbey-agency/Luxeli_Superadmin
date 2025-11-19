import { NextRequest, NextResponse } from 'next/server';
import { withGuestAuth, AuthenticatedRequest } from '@/lib/middleware';
import { UserActivityController } from '@/controllers/UserActivityController';

// GET /api/activity-requests/my - Get guest's own activity requests
export const GET = withGuestAuth(async (request: AuthenticatedRequest) => {
  try {
    const user = request.user;
    
    if (!user?.userId || !user?.partnerId || !user?.roomId) {
      return NextResponse.json(
        { success: false, error: 'Invalid token. Missing user information.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    
    return await UserActivityController.getMyRequests(
      user.userId,
      user.partnerId,
      user.roomId,
      {
        page: searchParams.get('page') || undefined,
        limit: searchParams.get('limit') || undefined,
        status: searchParams.get('status') || undefined,
      }
    );
  } catch (error: any) {
    console.error('Get My Activity Requests API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch activity requests' },
      { status: 500 }
    );
  }
});