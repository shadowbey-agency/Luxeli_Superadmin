import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { BookingInternRequestController } from '@/controllers/partner/booking/BookingInternRequestController';

// GET /api/partner/booking-intern-requests/[id] - Get booking intern request by ID
export const GET = withAuth(async (request: AuthenticatedRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) => {
  try {
    let id: string;
    if (context?.params) {
      const params = await Promise.resolve(context.params);
      id = params.id as string;
    } else {
      const url = new URL(request.url);
      const segments = url.pathname.split('/');
      id = segments[segments.length - 1];
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Booking intern request ID is required' },
        { status: 400 }
      );
    }

    return await BookingInternRequestController.getBookingInternRequestById(id);
  } catch (error: any) {
    console.error('Get Booking Intern Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to get booking intern request' },
      { status: 500 }
    );
  }
});

// PATCH /api/partner/booking-intern-requests/[id] - Update booking intern request
export const PATCH = withAuth(async (request: AuthenticatedRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) => {
  try {
    let id: string;
    if (context?.params) {
      const params = await Promise.resolve(context.params);
      id = params.id as string;
    } else {
      const url = new URL(request.url);
      const segments = url.pathname.split('/');
      id = segments[segments.length - 1];
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Booking intern request ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    return await BookingInternRequestController.updateBookingInternRequest(id, body);
  } catch (error: any) {
    console.error('Update Booking Intern Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update booking intern request' },
      { status: 500 }
    );
  }
});

// DELETE /api/partner/booking-intern-requests/[id] - Delete booking intern request
export const DELETE = withAuth(async (request: AuthenticatedRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) => {
  try {
    let id: string;
    if (context?.params) {
      const params = await Promise.resolve(context.params);
      id = params.id as string;
    } else {
      const url = new URL(request.url);
      const segments = url.pathname.split('/');
      id = segments[segments.length - 1];
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Booking intern request ID is required' },
        { status: 400 }
      );
    }

    return await BookingInternRequestController.deleteBookingInternRequest(id);
  } catch (error: any) {
    console.error('Delete Booking Intern Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete booking intern request' },
      { status: 500 }
    );
  }
});





