import { NextRequest, NextResponse } from 'next/server';
import { BookingSettingsController } from '@/controllers/partner/booking/BookingSettingsController';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

// GET /api/partner/booking-settings - Get all booking settings
export const GET = withAuth(async (request: AuthenticatedRequest) => {
  const { searchParams } = new URL(request.url);
  const query = {
    page: searchParams.get('page') || undefined,
    limit: searchParams.get('limit') || undefined,
    search: searchParams.get('search') || undefined,
    status: searchParams.get('status') || undefined,
    category: searchParams.get('category') || undefined,
  };

  return await BookingSettingsController.getBookingSettings(query);
});

// POST /api/partner/booking-settings - Create new booking setting
export const POST = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const body = await request.json();
    
    const {
      serviceName,
      category,
      serviceDescription,
      serviceLocation,
      servicePrice,
      startDate,
      endDate,
      status,
      bookDate,
      serviceImage,
    } = body;

    // Simple validation: required fields
    if (!serviceName?.trim() || !category?.trim() || !serviceDescription?.trim() || !serviceLocation?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Service name, category, description, and location are required' },
        { status: 400 }
      );
    }

    if (servicePrice === undefined || servicePrice < 0) {
      return NextResponse.json(
        { success: false, error: 'Service price is required and must be 0 or greater' },
        { status: 400 }
      );
    }

    if (!startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status && !['published', 'unpublished'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Status must be either "published" or "unpublished"' },
        { status: 400 }
      );
    }

    return await BookingSettingsController.createBookingSetting({
      serviceName: serviceName?.trim() || '',
      category: category?.trim() || '',
      serviceDescription: serviceDescription?.trim() || '',
      serviceLocation: serviceLocation?.trim() || '',
      servicePrice: servicePrice,
      startDate: startDate,
      endDate: endDate,
      status: status || 'unpublished',
      bookDate: bookDate || false,
      serviceImage: serviceImage || undefined,
    });
  } catch (error: any) {
    console.error('Create Booking Setting API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Invalid request body' },
      { status: 400 }
    );
  }
});





















