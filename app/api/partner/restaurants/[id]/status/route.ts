import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { RestaurantController } from '@/controllers/partner/room-delivery/restaurants/RestaurantController';

// PATCH /api/partner/restaurants/[id]/status - Update restaurant status
export const PATCH = withAuth(async (request: AuthenticatedRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) => {
  try {
    let id: string;
    if (context?.params) {
      const params = await Promise.resolve(context.params);
      id = params.id as string;
    } else {
      const url = new URL(request.url);
      const segments = url.pathname.split('/');
      id = segments[segments.length - 2]; // status is last segment, id is before it
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Restaurant ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !['open', 'closed'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Status must be either "open" or "closed"' },
        { status: 400 }
      );
    }

    return await RestaurantController.updateRestaurantStatus(id, status);
  } catch (error: any) {
    console.error('Update Restaurant Status API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update restaurant status' },
      { status: 500 }
    );
  }
});









