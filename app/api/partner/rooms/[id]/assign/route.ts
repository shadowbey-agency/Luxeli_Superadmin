import { NextRequest, NextResponse } from 'next/server'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware'
import { RoomController } from '@/controllers/partner/RoomController'

// POST /api/partner/rooms/[id]/assign - assign resident and set room full
export const POST = withAuth(async (request: AuthenticatedRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) => {
  try {
    let id: string;
    if (context?.params) {
      const params = await Promise.resolve(context.params);
      id = params.id as string;
    } else {
      const url = new URL(request.url);
      const segments = url.pathname.split('/');
      // Find the index of 'rooms' and get the next segment which should be the id
      const roomsIndex = segments.indexOf('rooms');
      id = segments[roomsIndex + 1];
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Room ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    return await RoomController.assignRoom(id, body);
  } catch (error: any) {
    console.error('Assign Room API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to assign room' },
      { status: 500 }
    );
  }
});


