import { NextRequest, NextResponse } from 'next/server';
import { CustomizedServiceRequestController } from '@/controllers/partner/customized-services/CustomizedServiceRequestController';
import { withAuth, AuthenticatedRequest, getPartnerId } from '@/lib/middleware';
import connectDB from '@/lib/db';
import Guest from '@/models/Guest';
import Room from '@/models/Room';

// GET /api/partner/customized-service-requests - Get all customized service requests
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
    residentEmail: searchParams.get('residentEmail') || undefined,
    roomName: searchParams.get('roomName') || undefined,
  };

  return await CustomizedServiceRequestController.getCustomizedServiceRequests(partnerId, query);
});

// POST /api/partner/customized-service-requests - Create new customized service request
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
      title,
      description,
      status,
      assignee,
    } = body;

    // Validation: required fields
    if (!roomName?.trim() || !residentEmail?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Room name and resident email are required' },
        { status: 400 }
      );
    }

    if (!title?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
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

    return await CustomizedServiceRequestController.createCustomizedServiceRequest({
      roomName: roomName.trim(),
      residentEmail: residentEmail.trim(),
      title: title.trim(),
      description: description?.trim() || undefined,
      status: status || 'new',
      assignee,
    }, partnerId);
  } catch (error: any) {
    console.error('Create Customized Service Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Invalid request body' },
      { status: 400 }
    );
  }
});

