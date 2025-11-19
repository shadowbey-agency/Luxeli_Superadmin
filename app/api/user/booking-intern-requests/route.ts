import { NextRequest, NextResponse } from 'next/server';
import { UserBookingInternController } from '@/controllers/UserBookingInternController';
import { withGuestAuth, AuthenticatedRequest } from '@/lib/middleware';

/**
 * GET /api/user/booking-intern-requests
 * Get guest's own booking intern requests
 * Auth: Guest JWT
 */
export const GET = withGuestAuth(async (request: AuthenticatedRequest) => {
  try {
    const user = request.user;
    
    if (!user?.userId || !user?.partnerId) {
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
      category: searchParams.get('category') || undefined,
    };

    return await UserBookingInternController.getMyRequests(
      user.userId,
      user.partnerId,
      query
    );
  } catch (error: any) {
    console.error('Get My Booking Intern Requests API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch requests' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/user/booking-intern-requests
 * Create a new booking intern request
 * Auth: Guest JWT
 */
export const POST = withGuestAuth(async (request: AuthenticatedRequest) => {
  try {
    const user = request.user;
    
    if (!user?.userId || !user?.partnerId || !user?.roomId || !user?.roomName) {
      return NextResponse.json(
        { success: false, error: 'Invalid token. Missing user information.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    const { category, reservation, notes } = body;

    // Validation
    if (!category || !['spa/clubs', 'restaurant'].includes(category)) {
      return NextResponse.json(
        { success: false, error: 'Category must be either "spa/clubs" or "restaurant"' },
        { status: 400 }
      );
    }

    if (!reservation?.date || !reservation?.time) {
      return NextResponse.json(
        { success: false, error: 'Reservation date and time are required' },
        { status: 400 }
      );
    }

    return await UserBookingInternController.createRequest(
      user.userId,
      user.partnerId,
      user.roomId,
      user.roomName,
      {
        category,
        reservation: {
          date: reservation.date,
          time: reservation.time,
        },
        notes: notes?.trim() || undefined,
      }
    );
  } catch (error: any) {
    console.error('Create Booking Intern Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create request' },
      { status: 500 }
    );
  }
});