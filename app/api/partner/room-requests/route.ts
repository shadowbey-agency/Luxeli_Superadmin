import { NextRequest, NextResponse } from 'next/server';
import { RoomRequestController } from '@/controllers/partner/RoomRequestController';

/**
 * GET /api/partner/room-requests
 * Get all room requests with pagination and filters
 * Query params: partnerId, page, limit, status (pending|approved|rejected), roomId
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const partnerId = searchParams.get('partnerId');
    
    // Validate required parameter
    if (!partnerId) {
      return NextResponse.json(
        { success: false, error: 'partnerId is required' },
        { status: 400 }
      );
    }

    const query = {
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
      status: searchParams.get('status') || undefined,
      roomId: searchParams.get('roomId') || undefined,
    };

    return RoomRequestController.getRoomRequests(query, partnerId);
  } catch (error: any) {
    console.error('Get Room Requests API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch room requests' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/partner/room-requests
 * Create a new room request
 * Body: { partnerId, roomId, roomName, guestName, guestPhone }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { partnerId, roomId, roomName, guestName, guestPhone } = body;

    // Validate required fields
    if (!partnerId || !roomId || !roomName || !guestName || !guestPhone) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: partnerId, roomId, roomName, guestName, guestPhone',
        },
        { status: 400 }
      );
    }

    return RoomRequestController.createRoomRequest(partnerId, {
      roomId,
      roomName,
      guestName,
      guestPhone,
    });
  } catch (error: any) {
    console.error('Create Room Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create room request' },
      { status: 500 }
    );
  }
}
