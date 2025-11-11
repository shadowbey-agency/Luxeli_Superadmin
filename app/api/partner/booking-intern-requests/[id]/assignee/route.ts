import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { BookingInternRequestController } from '@/controllers/partner/booking/BookingInternRequestController';

// PATCH /api/partner/booking-intern-requests/[id]/assignee - Update booking intern request assignee
export const PATCH = withAuth(async (request: AuthenticatedRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) => {
  try {
    let id: string;
    if (context?.params) {
      const params = await Promise.resolve(context.params);
      id = params.id as string;
    } else {
      const url = new URL(request.url);
      const segments = url.pathname.split('/');
      id = segments[segments.length - 2]; // assignee is last segment, id is before it
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Booking intern request ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { assignee } = body;

    // assignee can be null to unassign, or an object with name, staffId, and optional profilePic
    if (assignee !== null && (!assignee?.name || !assignee?.staffId)) {
      return NextResponse.json(
        { success: false, error: 'Assignee must have name and staffId, or be null to unassign' },
        { status: 400 }
      );
    }

    return await BookingInternRequestController.updateBookingInternRequestAssignee(id, assignee);
  } catch (error: any) {
    console.error('Update Booking Intern Request Assignee API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update booking intern request assignee' },
      { status: 500 }
    );
  }
});




