import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { BookingSettingsController } from '@/controllers/partner/booking/BookingSettingsController';

// PATCH /api/partner/booking-settings/[id]/status - Update booking setting status
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
        { success: false, error: 'Booking setting ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !['published', 'unpublished'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Status must be either "published" or "unpublished"' },
        { status: 400 }
      );
    }

    return await BookingSettingsController.updateBookingStatus(id, status);
  } catch (error: any) {
    console.error('Update Booking Status API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update booking status' },
      { status: 500 }
    );
  }
});


















