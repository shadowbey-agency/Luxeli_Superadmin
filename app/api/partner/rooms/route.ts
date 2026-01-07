import { NextRequest, NextResponse } from 'next/server'
import { withAuth, AuthenticatedRequest, getPartnerId } from '@/lib/middleware'
import { RoomController } from '@/controllers/partner/RoomController'

// GET /api/partner/rooms - list rooms (basic pagination) - NO AUTH REQUIRED
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const partnerId = searchParams.get('partnerId')
  
  if (!partnerId) {
    return NextResponse.json(
      { success: false, error: 'partnerId is required' },
      { status: 400 }
    )
  }
  
  const query = {
    page: searchParams.get('page') || undefined,
    limit: searchParams.get('limit') || undefined,
  }
  return RoomController.getRooms(query, partnerId)
}

// POST /api/partner/rooms - create room
export async function POST(req: NextRequest) {
  return withAuth(async (authReq: AuthenticatedRequest) => {
    try {
      const partnerId = getPartnerId(authReq);
      if (!partnerId) {
        return NextResponse.json(
          { success: false, error: 'Partner ID not found in token' },
          { status: 401 }
        );
      }

      const body = await authReq.json();
      return RoomController.createRoom(partnerId, body);
    } catch (error: any) {
      console.error('Create Room API Error:', error);
      return NextResponse.json(
        { success: false, error: error?.message || 'Failed to create room' },
        { status: 500 }
      );
    }
  })(req);
}
