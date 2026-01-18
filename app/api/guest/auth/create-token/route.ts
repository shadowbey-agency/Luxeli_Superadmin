import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Guest from '@/models/Guest';
import Partner from '@/models/Partner';
import Room from '@/models/Room';
import { generateToken } from '@/lib/auth';
import { handleApiError } from '@/lib/middleware';

/**
 * POST /api/guest/auth/create-token
 * Creates a JWT token for a guest
 * 
 * Request body:
 * {
 *   "partnerId": "string",
 *   "roomId": "string",
 *   "guestId": "string"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { partnerId, roomId, guestId } = body;

    // Validate required fields
    if (!partnerId || !roomId || !guestId) {
      return NextResponse.json(
        { error: 'partnerId, roomId, and guestId are required' },
        { status: 400 }
      );
    }

    // Validate that the guest exists
    const guest = await Guest.findById(guestId);
    if (!guest) {
      return NextResponse.json(
        { error: 'Guest not found' },
        { status: 404 }
      );
    }

    // Verify that the guest belongs to the specified partner and room
    if (guest.partnerId.toString() !== partnerId) {
      return NextResponse.json(
        { error: 'Guest does not belong to this partner' },
        { status: 403 }
      );
    }

    if (guest.roomId.toString() !== roomId) {
      return NextResponse.json(
        { error: 'Guest is not assigned to this room' },
        { status: 403 }
      );
    }

    // Verify that the partner exists and is active
    const partner = await Partner.findById(partnerId);
    if (!partner) {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      );
    }

    if (partner.status !== 'active') {
      return NextResponse.json(
        { error: 'Partner account is disabled' },
        { status: 403 }
      );
    }

    // Verify that the room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    // Verify that the guest is active
    if (!guest.isActive) {
      return NextResponse.json(
        { error: 'Guest account is inactive' },
        { status: 403 }
      );
    }

    // Generate token for guest
    const token = generateToken({
      userId: guestId,
      email: guest.guestEmail || '',
      role: 'guest',
      userType: 'guest',
      partnerId: partnerId,
      roomId: roomId,
      roomName: guest.roomName,
      fullName: guest.guestName
    });

    return NextResponse.json({
      message: 'Guest token created successfully',
      token,
      guest: {
        id: guest._id,
        name: guest.guestName,
        email: guest.guestEmail,
        phone: guest.guestPhone,
        room: guest.roomName,
        checkInDate: guest.checkInDate,
        checkOutDate: guest.checkOutDate
      },
      partnerId,
      roomId
    });

  } catch (error) {
    console.error('Create guest token error:', error);
    return handleApiError(error, 'Failed to create guest token');
  }
}
