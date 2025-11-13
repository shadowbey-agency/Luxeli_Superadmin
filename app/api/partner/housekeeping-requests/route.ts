import { NextRequest, NextResponse } from 'next/server';
import { HousekeepingRequestController } from '@/controllers/partner/housekeeping/HousekeepingRequestController';
import { withAuth, AuthenticatedRequest, getPartnerId } from '@/lib/middleware';

// GET /api/partner/housekeeping-requests - Get all housekeeping requests
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
    type: searchParams.get('type') || undefined,
    priority: searchParams.get('priority') || undefined,
    roomId: searchParams.get('roomId') || undefined,
  };

  return await HousekeepingRequestController.getRequests(query, partnerId);
});

// POST /api/partner/housekeeping-requests - Create new housekeeping request
export const POST = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const partnerId = getPartnerId(request);
    if (!partnerId) {
      return NextResponse.json(
        { success: false, error: 'Partner ID not found' },
        { status: 401 }
      );
    }

    const body = await request.json();
    return await HousekeepingRequestController.createRequest(body, partnerId);
  } catch (error: any) {
    console.error('Create Housekeeping Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Invalid request body' },
      { status: 400 }
    );
  }
});

