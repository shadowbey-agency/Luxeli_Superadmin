import { NextRequest, NextResponse } from 'next/server';
import { BookingInternRequestController } from '@/controllers/partner/booking/BookingInternRequestController';
import { withAuth, AuthenticatedRequest, getPartnerId } from '@/lib/middleware';
import connectDB from '@/lib/db';
import Guest from '@/models/Guest';
import Room from '@/models/Room';

// GET /api/partner/booking-intern-requests - Get all booking intern requests
export const GET = withAuth(async (request: AuthenticatedRequest) => {
  const partnerId = getPartnerId(request);
  if (!partnerId) {
    return NextResponse.json(
      { success: false, error: 'Partner ID not found' },
      { status: 401 }
    );
  }

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
// Supports both Guest (app) and Partner (web) requests
export const POST = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const user = request.user;
    const body = await request.json();
    
    // Check if it's a guest request (has userId, partnerId, roomId in token)
    const isGuestRequest = user?.userId && user?.partnerId && user?.roomId;
    
    let roomName: string;
    let residentEmail: string;

    if (isGuestRequest) {
      // Guest request from app - fetch guest and room info
      await connectDB();
      
      const guest = await Guest.findById(user.userId);
      if (!guest) {
        return NextResponse.json(
          { success: false, error: 'Guest not found' },
          { status: 404 }
        );
      }

      if (!guest.isActive) {
        return NextResponse.json(
          { success: false, error: 'Guest has been checked out' },
          { status: 403 }
        );
      }

      // Verify guest's room and partner match token
      if (guest.roomId !== user.roomId || guest.partnerId !== user.partnerId) {
        return NextResponse.json(
          { success: false, error: 'Guest assignment mismatch. Please login again.' },
          { status: 403 }
        );
      }

      const room = await Room.findById(user.roomId);
      if (!room) {
        return NextResponse.json(
          { success: false, error: 'Room not found' },
          { status: 404 }
        );
      }

      // Use guest and room info
      roomName = room.roomName;
      residentEmail = guest.guestEmail || '';
    } else {
      // Partner request from web - use provided data
      roomName = body.roomName;
      residentEmail = body.residentEmail;
    }

    const {
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

    // Get partnerId - from token for guest, from getPartnerId for partner
    const partnerId = isGuestRequest ? user.partnerId : getPartnerId(request);
    if (!partnerId) {
      return NextResponse.json(
        { success: false, error: 'Partner ID not found' },
        { status: 401 }
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
    }, partnerId);
  } catch (error: any) {
    console.error('Create Booking Intern Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Invalid request body' },
      { status: 400 }
    );
  }
});





