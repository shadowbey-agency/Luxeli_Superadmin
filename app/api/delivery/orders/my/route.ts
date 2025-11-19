import { NextRequest, NextResponse } from 'next/server';
import { UserInRoomDeliveryController } from '@/controllers/UserInRoomDeliveryController';
import { withGuestAuth, AuthenticatedRequest } from '@/lib/middleware';

/**
 * GET /api/delivery/orders/my
 * Get guest's own in-room delivery requests
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

    return await UserInRoomDeliveryController.getMyRequests(
      user.userId,
      user.partnerId,
      user.roomId,
      query
    );
  } catch (error: any) {
    console.error('Get My Delivery Requests API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch requests' },
      { status: 500 }
    );
  }
});