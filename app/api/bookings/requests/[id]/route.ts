import { NextRequest, NextResponse } from 'next/server';
import { withGuestAuth, AuthenticatedRequest } from '@/lib/middleware';
import { UserBookingController } from '@/controllers/UserBookingController';

// GET /api/bookings/requests/[id] - Get single booking request details
export const GET = withGuestAuth(async (request: AuthenticatedRequest, { params }: { params: { id: string } }) => {
  try {
    const user = request.user;
    
    if (!user?.userId) {
      return NextResponse.json(
        { success: false, error: 'Invalid token. Missing user information.' },
        { status: 401 }
      );
    }

    return await UserBookingController.getRequestById(
      user.userId,
      params.id
    );
  } catch (error: any) {
    console.error('Get Booking Request Details API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch request details' },
      { status: 500 }
    );
  }
});