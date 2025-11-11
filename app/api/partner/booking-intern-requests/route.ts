import { NextRequest, NextResponse } from 'next/server';
import { BookingInternRequestController } from '@/controllers/partner/booking/BookingInternRequestController';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

// GET /api/partner/booking-intern-requests - Get all booking intern requests
export const GET = withAuth(async (request: AuthenticatedRequest) => {
  const { searchParams } = new URL(request.url);
  const query = {
    page: searchParams.get('page') || undefined,
    limit: searchParams.get('limit') || undefined,
    search: searchParams.get('search') || undefined,
    status: searchParams.get('status') || undefined,
    category: searchParams.get('category') || undefined,
    residentEmail: searchParams.get('residentEmail') || undefined,
    roomName: searchParams.get('roomName') || undefined,
  };

  return await BookingInternRequestController.getBookingInternRequests(query);
});

// POST /api/partner/booking-intern-requests - Create new booking intern request
export const POST = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const body = await request.json();
    
    const {
      roomName,
      residentEmail,
      category,
      status,
      assignee,
      reservation,
      notes,
    } = body;

    // Validation: required fields
    if (!roomName?.trim() || !residentEmail?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Room name and resident email are required' },
        { status: 400 }
      );
    }

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

    // Validate status if provided
    if (status && !['new', 'accepted', 'completed', 'no-show', 'canceled'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status value' },
        { status: 400 }
      );
    }

    return await BookingInternRequestController.createBookingInternRequest({
      roomName: roomName.trim(),
      residentEmail: residentEmail.trim(),
      category,
      status: status || 'new',
      assignee,
      reservation: {
        date: reservation.date,
        time: reservation.time,
      },
      notes: notes?.trim() || undefined,
    });
  } catch (error: any) {
    console.error('Create Booking Intern Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Invalid request body' },
      { status: 400 }
    );
  }
});





