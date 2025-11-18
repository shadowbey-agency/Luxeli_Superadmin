import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { BookingSettingsController } from '@/controllers/partner/booking/BookingSettingsController';

// GET /api/partner/booking-settings/[id] - Get booking setting by ID
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
        { success: false, error: 'Booking setting ID is required' },
        { status: 400 }
      );
    }

    return await BookingSettingsController.getBookingSettingById(id);
  } catch (error: any) {
    console.error('Get Booking Setting API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to get booking setting' },
      { status: 500 }
    );
  }
});

// PATCH /api/partner/booking-settings/[id] - Update booking setting
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
        { success: false, error: 'Booking setting ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    return await BookingSettingsController.updateBookingSetting(id, body);
  } catch (error: any) {
    console.error('Update Booking Setting API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update booking setting' },
      { status: 500 }
    );
  }
});

// DELETE /api/partner/booking-settings/[id] - Delete booking setting
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
        { success: false, error: 'Booking setting ID is required' },
        { status: 400 }
      );
    }

    return await BookingSettingsController.deleteBookingSetting(id);
  } catch (error: any) {
    console.error('Delete Booking Setting API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete booking setting' },
      { status: 500 }
    );
  }
});















