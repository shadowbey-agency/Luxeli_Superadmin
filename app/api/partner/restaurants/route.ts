import { NextRequest, NextResponse } from 'next/server';
import { RestaurantController } from '@/controllers/partner/room-delivery/restaurants/RestaurantController';
import { withAuth, AuthenticatedRequest, getPartnerId } from '@/lib/middleware';

// GET /api/partner/restaurants - Get all restaurants
export const GET = withAuth(async (request: AuthenticatedRequest) => {
  const partnerId = getPartnerId(request);
  if (!partnerId) {
    return NextResponse.json(
      { success: false, error: 'Partner ID not found' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = {
    page: searchParams.get('page') || undefined,
    limit: searchParams.get('limit') || undefined,
    search: searchParams.get('search') || undefined,
    status: searchParams.get('status') || undefined,
  };

  return await RestaurantController.getRestaurants(query, partnerId);
});

// POST /api/partner/restaurants - Create new restaurant
export const POST = withAuth(async (request: AuthenticatedRequest) => {
  const partnerId = getPartnerId(request);
  if (!partnerId) {
    return NextResponse.json(
      { success: false, error: 'Partner ID not found' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    
    const {
      restaurantName,
      status,
      startWork,
      endWork,
      restaurantImage,
      items,
    } = body;

    // Simple validation: required fields
    if (!restaurantName?.trim() || !startWork?.trim() || !endWork?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Restaurant name, start work time, and end work time are required' },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status && !['open', 'closed'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Status must be either "open" or "closed"' },
        { status: 400 }
      );
    }

    return await RestaurantController.createRestaurant({
      partnerId,
      restaurantName: restaurantName?.trim() || '',
      status: status || 'open',
      startWork: startWork?.trim() || '',
      endWork: endWork?.trim() || '',
      restaurantImage: restaurantImage || undefined,
      items: items || [],
    });
  } catch (error: any) {
    console.error('Create Restaurant API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Invalid request body' },
      { status: 400 }
    );
  }
});









































