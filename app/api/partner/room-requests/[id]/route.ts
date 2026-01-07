import { NextRequest, NextResponse } from 'next/server';
import { RoomRequestController } from '@/controllers/partner/RoomRequestController';

/**
 * GET /api/partner/room-requests/[id]
 * Get a specific room request by ID
 * Query params: partnerId
 */
export async function GET(req: NextRequest, { params }: any) {
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

    return RoomRequestController.getRoomRequestById(id, partnerId);
  } catch (error: any) {
    console.error('Get Room Request By ID API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch room request' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/partner/room-requests/[id]
 * Update room request status
 * Query params: partnerId
 * Body: { requestStatus: 'pending' | 'approved' | 'rejected' }
 */
export async function PATCH(req: NextRequest, { params }: any) {
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

    const body = await req.json();
    return RoomRequestController.updateRoomRequestStatus(id, partnerId, body);
  } catch (error: any) {
    console.error('Update Room Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update room request' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/partner/room-requests/[id]
 * Delete a room request
 * Query params: partnerId
 */
export async function DELETE(req: NextRequest, { params }: any) {
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

    return RoomRequestController.deleteRoomRequest(id, partnerId);
  } catch (error: any) {
    console.error('Delete Room Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete room request' },
      { status: 500 }
    );
  }
}
