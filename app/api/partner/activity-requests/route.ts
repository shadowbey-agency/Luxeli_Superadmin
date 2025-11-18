import { NextRequest, NextResponse } from 'next/server';
import { ActivityRequestController } from '@/controllers/partner/activity-alerts/ActivityRequestController';
import { withAuth, AuthenticatedRequest, getPartnerId } from '@/lib/middleware';
import connectDB from '@/lib/db';
import Guest from '@/models/Guest';
import Room from '@/models/Room';

// GET /api/partner/activity-requests - Get all activity requests
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
    service: searchParams.get('service') || undefined,
  };

  return await ActivityRequestController.getRequests(query);
});

// POST /api/partner/activity-requests - Create new activity request
// Supports both Guest (app) and Partner (web) requests
export const POST = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const user = request.user;
    const body = await request.json();
    
    // Check if it's a guest request (has userId, partnerId, roomId in token)
    const isGuestRequest = user?.userId && user?.partnerId && user?.roomId;
    
    let roomName: string;
    let residentName: string;

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
      residentName = guest.guestName;
    } else {
      // Partner request from web - use provided data
      roomName = body.roomName;
      residentName = body.residentName;
    }

    const {
      service,
      status,
      notes,
      assignee,
    } = body;

    // Validation: required fields
    if (!roomName?.trim() || !residentName?.trim() || !service?.trim()) {
      return NextResponse.json(
        { success: false, error: 'roomName, residentName, and service are required' },
        { status: 400 }
      );
    }

    return await ActivityRequestController.createRequest({
      roomName: roomName.trim(),
      residentName: residentName.trim(),
      service: service.trim(),
      status: status || 'new',
      notes: notes?.trim(),
      assignee,
    });
  } catch (error: any) {
    console.error('Create Activity Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Invalid request body' },
      { status: 400 }
    );
  }
});



