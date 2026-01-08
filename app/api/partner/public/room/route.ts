import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Guest from '@/models/Guest';

/**
 * GET /api/partner/public/guest/room
 * Query params:
 *  - partnerId
 *  - roomId
 *
 * Used when QR is scanned and room is FULL
 * No authentication required
 */
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const partnerId = searchParams.get('partnerId');
    const roomId = searchParams.get('roomId');

    if (!partnerId || !roomId) {
      return NextResponse.json(
        {
          success: false,
          error: 'partnerId and roomId are required',
        },
        { status: 400 }
      );
    }

    // Find active guest for this room
    const guest = await Guest.findOne({
      partnerId,
      roomId,
      isActive: true,
    }).lean();

    // If room is empty or no active guest
    if (!guest) {
      return NextResponse.json({
        success: true,
        data: null,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        guestId: guest._id.toString(),
        guestName: guest.guestName,
        roomId: guest.roomId,
        roomName: guest.roomName,
        checkInDate: guest.checkInDate,
        checkOutDate: guest.checkOutDate || null,
        isActive: guest.isActive,
      },
    });
  } catch (error) {
    console.error('Public Guest Fetch Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch guest',
      },
      { status: 500 }
    );
  }
}
