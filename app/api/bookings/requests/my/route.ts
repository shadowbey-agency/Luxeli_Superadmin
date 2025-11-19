import { NextRequest, NextResponse } from 'next/server';
import { withGuestAuth, AuthenticatedRequest } from '@/lib/middleware';
import { UserBookingController } from '@/controllers/UserBookingController';

// GET /api/bookings/requests/my - Get guest's own booking requests
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
    
    return await UserBookingController.getMyRequests(
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
    console.error('Get My Booking Requests API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch booking requests' },
      { status: 500 }
    );
  }
});