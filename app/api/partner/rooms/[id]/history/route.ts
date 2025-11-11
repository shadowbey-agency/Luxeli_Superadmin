import { NextRequest, NextResponse } from 'next/server'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware'
import { RoomController } from '@/controllers/partner/RoomController'

// GET /api/partner/rooms/[id]/history - get room history
export const GET = withAuth(async (request: AuthenticatedRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) => {
  try {
    let id: string;
    if (context?.params) {
      const params = await Promise.resolve(context.params);
      id = params.id as string;
    } else {
      const url = new URL(request.url);
      const segments = url.pathname.split('/');
      const roomsIndex = segments.indexOf('rooms');
      id = segments[roomsIndex + 1];
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Room ID is required' },
        { status: 400 }
      );
    }

    return await RoomController.getRoomHistory(id);
  } catch (error: any) {
    console.error('Get Room History API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to get room history' },
      { status: 500 }
    );
  }
});

