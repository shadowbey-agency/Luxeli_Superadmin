import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { RestaurantController } from '@/controllers/partner/room-delivery/restaurants/RestaurantController';

// GET /api/partner/restaurants/[id] - Get restaurant by ID
export const GET = withAuth(async (request: AuthenticatedRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) => {
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
        { success: false, error: 'Restaurant ID is required' },
        { status: 400 }
      );
    }

    return await RestaurantController.getRestaurantById(id);
  } catch (error: any) {
    console.error('Get Restaurant API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to get restaurant' },
      { status: 500 }
    );
  }
});

// PATCH /api/partner/restaurants/[id] - Update restaurant
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
        { success: false, error: 'Restaurant ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    return await RestaurantController.updateRestaurant(id, body);
  } catch (error: any) {
    console.error('Update Restaurant API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update restaurant' },
      { status: 500 }
    );
  }
});

// DELETE /api/partner/restaurants/[id] - Delete restaurant
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
        { success: false, error: 'Restaurant ID is required' },
        { status: 400 }
      );
    }

    return await RestaurantController.deleteRestaurant(id);
  } catch (error: any) {
    console.error('Delete Restaurant API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete restaurant' },
      { status: 500 }
    );
  }
});














