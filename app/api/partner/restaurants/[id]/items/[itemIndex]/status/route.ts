import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { RestaurantController } from '@/controllers/partner/room-delivery/restaurants/RestaurantController';

// PATCH /api/partner/restaurants/[id]/items/[itemIndex]/status - Update item status
export const PATCH = withAuth(async (request: AuthenticatedRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) => {
  try {
    let id: string;
    let itemIndex: number;
    
    if (context?.params) {
      const params = await Promise.resolve(context.params);
      id = params.id as string;
      itemIndex = parseInt(params.itemIndex as string, 10);
    } else {
      const url = new URL(request.url);
      const segments = url.pathname.split('/');
      id = segments[segments.length - 3];
      itemIndex = parseInt(segments[segments.length - 2], 10);
    }

    if (!id || isNaN(itemIndex)) {
      return NextResponse.json(
        { success: false, error: 'Restaurant ID and item index are required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !['published', 'unpublished'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Status must be either "published" or "unpublished"' },
        { status: 400 }
      );
    }

    return await RestaurantController.updateItemStatus(id, itemIndex, status);
  } catch (error: any) {
    console.error('Update Item Status API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update item status' },
      { status: 500 }
    );
  }
});









































