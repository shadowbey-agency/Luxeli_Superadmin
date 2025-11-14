import { NextRequest, NextResponse } from 'next/server';
import { UserHousekeepingController } from '@/controllers/UserHousekeepingController';
import { withGuestAuth, AuthenticatedRequest } from '@/lib/middleware';

/**
 * POST /api/housekeeping-requests
 * Create housekeeping request from guest (Flutter app)
 * Auth: Guest JWT
 */
export const POST = withGuestAuth(async (request: AuthenticatedRequest) => {
  try {
    const user = request.user;
    
    if (!user?.userId || !user?.partnerId || !user?.roomId) {
      return NextResponse.json(
        { success: false, error: 'Invalid token. Missing user information.' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.type || !body.requestedFor) {
      return NextResponse.json(
        { success: false, error: 'type and requestedFor are required fields' },
        { status: 400 }
      );
    }

    // Validate type value
    if (!['custom cleaning', 'item needed'].includes(body.type)) {
      return NextResponse.json(
        { success: false, error: 'type must be either "custom cleaning" or "item needed"' },
        { status: 400 }
      );
    }

    return await UserHousekeepingController.createRequest(
      user.userId,
      user.partnerId,
      user.roomId,
      {
        type: body.type,
        cleaningType: body.cleaningType,
        itemQuantity: body.itemQuantity,
        deliveryDetail: body.deliveryDetail,
        requestedFor: body.requestedFor,
        priority: body.priority,
        notes: body.notes,
      }
    );
  } catch (error: any) {
    console.error('Create Housekeeping Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create request' },
      { status: 500 }
    );
  }
});

