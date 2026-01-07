import { NextRequest, NextResponse } from 'next/server';
import { RoomRequestController } from '@/controllers/partner/RoomRequestController';

/**
 * GET /api/partner/room-requests/stats/overview
 * Get room request statistics
 * Query params: partnerId
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

    return RoomRequestController.getRequestStats(partnerId);
  } catch (error: any) {
    console.error('Get Request Stats API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch request statistics' },
      { status: 500 }
    );
  }
}
