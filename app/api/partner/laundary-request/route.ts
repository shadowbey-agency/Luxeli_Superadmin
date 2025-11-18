import { NextRequest, NextResponse } from 'next/server';
import { LaundryRequestController } from '@/controllers/partner/laundary/LaundaryRequest';
import { withAuth, AuthenticatedRequest, getPartnerId } from '@/lib/middleware';
import connectDB from '@/lib/db';
import Guest from '@/models/Guest';
import Room from '@/models/Room';

// GET /api/partner/laundry-requests - Get all laundry requests
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
    priority: searchParams.get('priority') || undefined,
    roomName: searchParams.get('roomName') || undefined,        
    service: searchParams.get('service') || undefined,
  };

  return await LaundryRequestController.getRequests(query);
});

// POST /api/partner/laundry-requests - Create new laundry request
// Supports both Guest (app) and Partner (web) requests
export const POST = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const user = request.user;
    const body = await request.json();
    
    // Check if it's a guest request (has userId, partnerId, roomId in token)
    const isGuestRequest = user?.userId && user?.partnerId && user?.roomId;
    
    let roomName: string;
    let residentialName: string;

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
      residentialName = guest.guestName;
    } else {
      // Partner request from web - use provided data
      roomName = body.roomName;
      residentialName = body.residentialName;
    }

    const {
      services,
      piece,
      pickup,
      status,
      priority,
      notes,
      assigne,
    } = body;

    // Validation: required fields
    if (!roomName?.trim() || !residentialName?.trim() || !services || !piece || !pickup) {
      return NextResponse.json(
        { success: false, error: 'Required fields missing: roomName, residentialName, services, piece, pickup' },
        { status: 400 }
      );
    }

    if (!Array.isArray(services) || services.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Services must be a non-empty array' },
        { status: 400 }
      );
    }

    return await LaundryRequestController.createRequest({
      roomName: roomName.trim(),
      residentialName: residentialName.trim(),
      services,
      piece,
      pickup: new Date(pickup),
      status: status || 'new',
      priority: priority || 'medium',
      notes: notes?.trim(),
      assigne,
    });
  } catch (error: any) {
    console.error('Create Laundry Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Invalid request body' },
      { status: 400 }
    );
  }
});
