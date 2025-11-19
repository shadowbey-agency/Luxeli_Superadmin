import { NextRequest, NextResponse } from 'next/server';
import { withGuestAuth, AuthenticatedRequest } from '@/lib/middleware';
import connectDB from '@/lib/db';
import { ActivityRequest } from '@/models/activity-alerts/activities/ActivityRequest';
import Guest from '@/models/Guest';

// POST /api/activity-requests - Create new activity request from guest
export const POST = withGuestAuth(async (request: AuthenticatedRequest) => {
  try {
    const user = request.user;
    
    if (!user?.userId || !user?.partnerId || !user?.roomId) {
      return NextResponse.json(
        { success: false, error: 'Invalid token. Missing user information.' },
        { status: 401 }
      );
    }

    // Get guest details
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

    const body = await request.json();
    
    // Validation - required fields
    if (!body.service) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'service is required' 
        },
        { status: 400 }
      );
    }

    // Create new request
    const activityRequest = new ActivityRequest({
      partnerId: user.partnerId,
      roomName: guest.roomName,
      residentName: guest.guestName,
      service: body.service.trim(),
      notes: body.notes?.trim(),
      status: 'new',
    });

    await activityRequest.save();

    return NextResponse.json({
      success: true,
      message: 'Activity request created successfully',
      data: {
        request: activityRequest.toJSON(),
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create Activity Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create activity request' },
      { status: 500 }
    );
  }
});