import { NextRequest, NextResponse } from 'next/server';
import { withGuestAuth, AuthenticatedRequest } from '@/lib/middleware';
import { UserBookingController } from '@/controllers/UserBookingController';

// POST /api/bookings/requests - Create new booking request from guest
export const POST = withGuestAuth(async (request: AuthenticatedRequest) => {
  try {
    const user = request.user;
    
    if (!user?.userId || !user?.partnerId || !user?.roomId) {
      return NextResponse.json(
        { success: false, error: 'Invalid token. Missing user information.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    return await UserBookingController.createRequest(
      user.userId,
      user.partnerId,
      user.roomId,
      body
    );
  } catch (error: any) {
    console.error('Create Booking Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create booking request' },
      { status: 500 }
    );
  }
});