import { NextRequest, NextResponse } from 'next/server';
import { UserLaundryController } from '@/controllers/UserLaundryController';
import { withGuestAuth, AuthenticatedRequest } from '@/lib/middleware';

/**
 * GET /api/laundry/requests/my
 * Get guest's own laundry requests
 * Auth: Guest JWT
 */
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
    const query = {
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
      status: searchParams.get('status') || undefined,
    };

    return await UserLaundryController.getMyRequests(
      user.userId,
      user.partnerId,
      user.roomId,
      query
    );
  } catch (error: any) {
    console.error('Get My Laundry Requests API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch requests' },
      { status: 500 }
    );
  }
});