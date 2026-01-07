import { NextRequest, NextResponse } from 'next/server'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware'
import { RoomController } from '@/controllers/partner/RoomController'

// GET /api/partner/rooms/[id] - get room by ID - NO AUTH REQUIRED
export async function GET(request: NextRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) {
  try {
    let id: string;
    if (context?.params) {
      const params = await Promise.resolve(context.params);
      id = params.id as string;
    } else {
      const url = new URL(request.url);
      const segments = url.pathname.split('/');
      id = segments[segments.length - 1];
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Room ID is required' },
        { status: 400 }
      );
    }

    return await RoomController.getRoomById(id);
  } catch (error: any) {
    console.error('Get Room API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to get room' },
      { status: 500 }
    );
  }
}

// PATCH /api/partner/rooms/[id] - update room fields
export const PATCH = withAuth(async (request: AuthenticatedRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) => {
  try {
    let id: string;
    if (context?.params) {
      const params = await Promise.resolve(context.params);
      id = params.id as string;
    } else {
      const url = new URL(request.url);
      const segments = url.pathname.split('/');
      id = segments[segments.length - 1];
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Room ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    return await RoomController.updateRoom(id, body);
  } catch (error: any) {
    console.error('Update Room API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update room' },
      { status: 500 }
    );
  }
});

// DELETE /api/partner/rooms/[id] - delete a room
export const DELETE = withAuth(async (request: AuthenticatedRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) => {
  try {
    let id: string;
    if (context?.params) {
      const params = await Promise.resolve(context.params);
      id = params.id as string;
    } else {
      const url = new URL(request.url);
      const segments = url.pathname.split('/');
      id = segments[segments.length - 1];
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Room ID is required' },
        { status: 400 }
      );
    }

    return await RoomController.deleteRoom(id);
  } catch (error: any) {
    console.error('Delete Room API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete room' },
      { status: 500 }
    );
  }
});


