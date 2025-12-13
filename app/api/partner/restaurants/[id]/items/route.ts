import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { RestaurantController } from '@/controllers/partner/room-delivery/restaurants/RestaurantController';

// POST /api/partner/restaurants/[id]/items - Add item to restaurant
export const POST = withAuth(async (request: AuthenticatedRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) => {
  try {
    let id: string;
    if (context?.params) {
      const params = await Promise.resolve(context.params);
      id = params.id as string;
    } else {
      const url = new URL(request.url);
      const segments = url.pathname.split('/');
      id = segments[segments.length - 2]; // items is last segment, id is before it
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Restaurant ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    return await RestaurantController.addItem(id, body);
  } catch (error: any) {
    console.error('Add Item API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to add item' },
      { status: 500 }
    );
  }
});






















