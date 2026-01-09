import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import RoomRequest from '@/models/Roomrequest';
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
 * Delete a room request using JWT token authentication
 * Header: Authorization: Bearer <token>
 */
export async function DELETE(req: NextRequest, { params }: any) {
  try {
    // Get authorization token
    const authHeader = req.headers.get('Authorization');
    console.log('DELETE Request - Auth Header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('DELETE Request - Invalid auth format');
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    
    let user: any;
    try {
      user = jwt.verify(token, secret) as any;
      console.log('DELETE Request - Token verified. User data:', { userId: user.userId, role: user.role });
    } catch (err: any) {
      console.log('DELETE Request - Token verification failed:', err.message);
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // For partner, the partnerId is the user's userId from the token
    const partnerId = user.userId;
    if (!partnerId) {
      console.log('DELETE Request - No userId in token');
      return NextResponse.json(
        { success: false, error: 'Partner ID not found in token' },
        { status: 400 }
      );
    }

    await connectDB();

    const { id } = params;
    if (!id) {
      console.log('DELETE Request - No ID in params');
      return NextResponse.json(
        { success: false, error: 'Request ID is required' },
        { status: 400 }
      );
    }

    console.log('DELETE Request - Looking for room request with ID:', id);
    
    // Find the room request and verify it belongs to this partner
    const roomRequest = await RoomRequest.findById(id);
    
    if (!roomRequest) {
      console.log('DELETE Request - Room request not found');
      return NextResponse.json(
        { success: false, error: 'Room request not found' },
        { status: 404 }
      );
    }

    console.log('DELETE Request - Found room request. RequestPartnerId:', roomRequest.partnerId, 'TokenPartnerId:', partnerId);

    // Verify the request belongs to the authenticated partner
    // Convert both to strings for comparison to handle ObjectId vs string
    if (String(roomRequest.partnerId) !== String(partnerId)) {
      console.log('DELETE Request - Partner mismatch. Database:', String(roomRequest.partnerId), 'Token:', String(partnerId));
      return NextResponse.json(
        { success: false, error: 'Unauthorized - This request does not belong to your partner account' },
        { status: 403 }
      );
    }

    console.log('DELETE Request - Deleting room request...');
    
    // Delete the room request
    const deletedRequest = await RoomRequest.findByIdAndDelete(id);
    console.log('DELETE Request - Successfully deleted:', deletedRequest ? 'Yes' : 'No');

    return NextResponse.json({
      success: true,
      message: 'Room request deleted successfully',
      data: {
        deletedRequestId: id,
      },
    });
  } catch (error: any) {
    console.error('Delete Room Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete room request' },
      { status: 500 }
    );
  }
}
