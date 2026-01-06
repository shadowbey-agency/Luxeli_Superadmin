import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest, getPartnerId } from '@/lib/middleware';
import connectDB from '@/lib/db';
import Room from '@/models/Room';
import QRCode from 'qrcode';

/**
 * GET /api/partner/rooms/[id]/qr-code
 * Get QR code for a room (contains room name and room ID)
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

    // Generate QR code with only room name and room ID
    const qrCodeData = JSON.stringify({
      roomName: room.roomName,
      roomId: roomId,
    });

    // Generate QR code from room data
    const qrCodeDataURL = await QRCode.toDataURL(qrCodeData, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 1,
    });

    return NextResponse.json({
      success: true,
      data: {
        qrCode: qrCodeDataURL,
        roomName: room.roomName,
        roomId: roomId,
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

