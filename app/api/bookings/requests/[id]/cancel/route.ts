import { NextRequest, NextResponse } from 'next/server';
import { withGuestAuth, AuthenticatedRequest } from '@/lib/middleware';
import { UserBookingController } from '@/controllers/UserBookingController';

// PATCH /api/bookings/requests/[id]/cancel - Cancel a booking request
export const PATCH = withGuestAuth(async (request: AuthenticatedRequest, { params }: { params: { id: string } }) => {
  try {
    const user = request.user;
    
    if (!user?.userId) {
      return NextResponse.json(
        { success: false, error: 'Invalid token. Missing user information.' },
        { status: 401 }
      );
    }

    return await UserBookingController.cancelRequest(
      user.userId,
      params.id
    );
  } catch (error: any) {
    console.error('Cancel Booking Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to cancel request' },
      { status: 500 }
    );
  }
});