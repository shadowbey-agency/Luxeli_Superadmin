import { NextRequest, NextResponse } from 'next/server';
import { UserBookingServiceController } from '@/controllers/UserBookingServiceController';
import { withGuestAuth, AuthenticatedRequest } from '@/lib/middleware';

/**
 * GET /api/user/booking-services
 * Get all published booking services for guests
 * Auth: Guest JWT
 */
export const GET = withGuestAuth(async (request: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const query = {
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
    };

    return await UserBookingServiceController.getBookingServices(query);
  } catch (error: any) {
    console.error('Get Booking Services API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch services' },
      { status: 500 }
    );
  }
});