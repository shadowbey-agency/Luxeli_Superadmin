import { NextRequest, NextResponse } from 'next/server';
import { InRoomDeliveryRequestController } from '@/controllers/partner/inroomdeliveryrequest/InRoomDeliveryRequestController';
import { withAuth, AuthenticatedRequest, getPartnerId } from '@/lib/middleware';
import connectDB from '@/lib/db';
import Guest from '@/models/Guest';
import Room from '@/models/Room';

// GET /api/partner/in-room-delivery-request - Get all in-room delivery requests
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
    roomName: searchParams.get('roomName') || undefined,
    restaurant: searchParams.get('restaurant') || undefined,
  };

  return await InRoomDeliveryRequestController.getRequests(query);
});

// POST /api/partner/in-room-delivery-request - Create new in-room delivery request
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
      items,
      restaurant,
      pickup,
      status,
      notes,
      assignee,
    } = body;

    // Validation: required fields
    if (!roomName?.trim() || !residentialName?.trim() || !items || !restaurant || !pickup) {
      return NextResponse.json(
        { success: false, error: 'Required fields missing: roomName, residentialName, items, restaurant, pickup' },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Items must be a non-empty array' },
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

    return await InRoomDeliveryRequestController.createRequest({
      roomName: roomName.trim(),
      residentialName: residentialName.trim(),
      items,
      restaurant: restaurant.trim(),
      pickup: pickup.trim(),
      status: status || 'new',
      notes: notes?.trim(),
      assignee,
    }, partnerId);
  } catch (error: any) {
    console.error('Create In-Room Delivery Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Invalid request body' },
      { status: 400 }
    );
  }
});


