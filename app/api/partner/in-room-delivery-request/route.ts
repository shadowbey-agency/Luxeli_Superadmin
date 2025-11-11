import { NextRequest, NextResponse } from 'next/server';
import { InRoomDeliveryRequestController } from '@/controllers/partner/inroomdeliveryrequest/InRoomDeliveryRequestController';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

// GET /api/partner/in-room-delivery-request - Get all in-room delivery requests
export const GET = withAuth(async (request: AuthenticatedRequest) => {
  const { searchParams } = new URL(request.url);
  const query = {
    page: searchParams.get('page') || undefined,
    limit: searchParams.get('limit') || undefined,
    search: searchParams.get('search') || undefined,
    status: searchParams.get('status') || undefined,
    roomName: searchParams.get('roomName') || undefined,
    restaurant: searchParams.get('restaurant') || undefined,
  };

  return await InRoomDeliveryRequestController.getRequests(query);
});

// POST /api/partner/in-room-delivery-request - Create new in-room delivery request
export const POST = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const body = await request.json();
    return await InRoomDeliveryRequestController.createRequest(body);
  } catch (error: any) {
    console.error('Create In-Room Delivery Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Invalid request body' },
      { status: 400 }
    );
  }
});


