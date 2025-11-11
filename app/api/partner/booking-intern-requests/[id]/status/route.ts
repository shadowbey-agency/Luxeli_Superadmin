import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { BookingInternRequestController } from '@/controllers/partner/booking/BookingInternRequestController';

// PATCH /api/partner/booking-intern-requests/[id]/status - Update booking intern request status
export const PATCH = withAuth(async (request: AuthenticatedRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) => {
  try {
    let id: string;
    if (context?.params) {
      const params = await Promise.resolve(context.params);
      id = params.id as string;
    } else {
      const url = new URL(request.url);
      const segments = url.pathname.split('/');
      id = segments[segments.length - 2]; // status is last segment, id is before it
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Booking intern request ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !['new', 'accepted', 'completed', 'no-show', 'canceled'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Status must be one of: new, accepted, completed, no-show, canceled' },
        { status: 400 }
      );
    }

    return await BookingInternRequestController.updateBookingInternRequestStatus(id, status);
  } catch (error: any) {
    console.error('Update Booking Intern Request Status API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update booking intern request status' },
      { status: 500 }
    );
  }
});





