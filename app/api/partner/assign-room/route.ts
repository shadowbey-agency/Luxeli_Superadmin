import { NextRequest, NextResponse } from 'next/server';
import { GuestController } from '@/controllers/GuestController';
import { withAuth, AuthenticatedRequest, getPartnerId } from '@/lib/middleware';

/**
 * POST /api/partner/assign-room
 * Assign a guest to a room and generate QR code
 * Auth: Partner JWT
 */
export const POST = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const partnerId = getPartnerId(request);
    if (!partnerId) {
      return NextResponse.json(
        { success: false, error: 'Partner ID not found in token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.guestName || !body.roomId || !body.roomName) {
      return NextResponse.json(
        { success: false, error: 'guestName, roomId, and roomName are required' },
        { status: 400 }
      );
    }

    return await GuestController.assignRoom(partnerId, {
      guestName: body.guestName,
      guestEmail: body.guestEmail,
      guestPhone: body.guestPhone,
      roomId: body.roomId,
      roomName: body.roomName,
      checkInDate: body.checkInDate ? new Date(body.checkInDate) : undefined,
      checkOutDate: body.checkOutDate ? new Date(body.checkOutDate) : undefined,
    });
  } catch (error: any) {
    console.error('Assign Room API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to assign room' },
      { status: 500 }
    );
  }
});

