import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest, getPartnerId } from '@/lib/middleware';
import connectDB from '@/lib/db';
import Guest from '@/models/Guest';
import Room from '@/models/Room';
import { generateGuestToken } from '@/lib/auth';
import QRCode from 'qrcode';

/**
 * GET /api/partner/rooms/[id]/qr-code
 * Get QR code for an existing guest assigned to a room
 * Auth: Partner JWT
 */
export const GET = withAuth(async (req: AuthenticatedRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) => {
  try {
    await connectDB();

    const partnerId = getPartnerId(req);
    if (!partnerId) {
      return NextResponse.json(
        { success: false, error: 'Partner ID not found in token' },
        { status: 401 }
      );
    }

    // Get room ID from URL params
    let roomId: string;
    if (context?.params) {
      const params = await Promise.resolve(context.params);
      roomId = params.id as string;
    } else {
      const url = new URL(req.url);
      const segments = url.pathname.split('/');
      const index = segments.indexOf('rooms');
      roomId = segments[index + 1];
    }

    if (!roomId) {
      return NextResponse.json(
        { success: false, error: 'Room ID is required' },
        { status: 400 }
      );
    }

    // Verify room exists and belongs to this partner
    const room = await Room.findById(roomId);
    if (!room) {
      return NextResponse.json(
        { success: false, error: 'Room not found' },
        { status: 404 }
      );
    }

    if (room.partnerId !== partnerId) {
      return NextResponse.json(
        { success: false, error: 'Room does not belong to your hotel' },
        { status: 403 }
      );
    }

    // Find active guest for this room
    const guest = await Guest.findOne({
      roomId: roomId,
      partnerId: partnerId,
      isActive: true,
    });

    if (!guest) {
      return NextResponse.json(
        { success: false, error: 'No active guest found in this room' },
        { status: 404 }
      );
    }

    // Generate JWT token for guest
    const token = generateGuestToken({
      userId: guest._id.toString(),
      guestName: guest.guestName,
      guestEmail: guest.guestEmail,
      partnerId: partnerId,
      roomId: roomId,
      roomName: room.roomName,
    });

    // Generate QR code from token
    const qrCodeDataURL = await QRCode.toDataURL(token, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 1,
    });

    return NextResponse.json({
      success: true,
      data: {
        qrCode: qrCodeDataURL,
        guestName: guest.guestName,
        guestEmail: guest.guestEmail,
        guestPhone: guest.guestPhone,
        roomName: room.roomName,
        checkInDate: guest.checkInDate,
        checkOutDate: guest.checkOutDate,
      },
    });
  } catch (error: any) {
    console.error('Get Room QR Code Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to generate QR code' },
      { status: 500 }
    );
  }
});

