import { NextRequest, NextResponse } from 'next/server';
import { LaundryRequestController } from '@/controllers/partner/laundary/LaundaryRequest';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

// GET /api/partner/laundry-requests - Get all laundry requests
export const GET = withAuth(async (request: AuthenticatedRequest) => {
  const { searchParams } = new URL(request.url);
  const query = {
    page: searchParams.get('page') || undefined,
    limit: searchParams.get('limit') || undefined,
    search: searchParams.get('search') || undefined,
    status: searchParams.get('status') || undefined,
    priority: searchParams.get('priority') || undefined,
    roomName: searchParams.get('roomName') || undefined,        
    service: searchParams.get('service') || undefined,
  };

  return await LaundryRequestController.getRequests(query);
});

// POST /api/partner/laundry-requests - Create new laundry request
export const POST = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const body = await request.json();
    return await LaundryRequestController.createRequest(request, body);
  } catch (error: any) {
    console.error('Create Laundry Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Invalid request body' },
      { status: 400 }
    );
  }
});