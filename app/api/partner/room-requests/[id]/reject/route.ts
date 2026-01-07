import { NextRequest, NextResponse } from 'next/server';
import { RoomRequestController } from '@/controllers/partner/RoomRequestController';

/**
 * POST /api/partner/room-requests/[id]/reject
 * Reject a room request
 * Query params: partnerId
 */
export async function POST(req: NextRequest, { params }: any) {
  try {
    const { id } = params;
    const { searchParams } = new URL(req.url);
    const partnerId = searchParams.get('partnerId');

    // Validate required parameters
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Request ID is required' },
        { status: 400 }
      );
    }

    if (!partnerId) {
      return NextResponse.json(
        { success: false, error: 'partnerId is required' },
        { status: 400 }
      );
    }

    return RoomRequestController.rejectRoomRequest(id, partnerId);
  } catch (error: any) {
    console.error('Reject Room Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to reject room request' },
      { status: 500 }
    );
  }
}
