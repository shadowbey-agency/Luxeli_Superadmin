import { NextRequest, NextResponse } from 'next/server';
import { UserLaundryController } from '@/controllers/UserLaundryController';
import { withGuestAuth, AuthenticatedRequest } from '@/lib/middleware';

/**
 * POST /api/laundry/requests
 * Create new laundry request
 * Auth: Guest JWT
 */
export const POST = withGuestAuth(async (request: AuthenticatedRequest) => {
  try {
    const user = request.user;
    
    if (!user?.userId || !user?.partnerId || !user?.roomId || !user?.roomName) {
      return NextResponse.json(
        { success: false, error: 'Invalid token. Missing user information.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.residentialName || !body.services || !body.piece || !body.pickup) {
      return NextResponse.json(
        { success: false, error: 'Required fields missing: residentialName, services, piece, pickup' },
        { status: 400 }
      );
    }

    return await UserLaundryController.createRequest(
      user.userId,
      user.partnerId,
      user.roomId,
      user.roomName,
      {
        residentialName: body.residentialName,
        services: body.services,
        piece: body.piece,
        pickup: new Date(body.pickup),
        priority: body.priority,
        notes: body.notes,
      }
    );
  } catch (error: any) {
    console.error('Create Laundry Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Invalid request body' },
      { status: 400 }
    );
  }
});