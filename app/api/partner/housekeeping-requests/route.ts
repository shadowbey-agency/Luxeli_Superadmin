import { NextRequest, NextResponse } from 'next/server';
import { HousekeepingRequestController } from '@/controllers/partner/housekeeping/HousekeepingRequestController';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

// GET /api/partner/housekeeping-requests - Get all housekeeping requests
export const GET = withAuth(async (request: AuthenticatedRequest) => {
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

  return await HousekeepingRequestController.getRequests(query);
});

// POST /api/partner/housekeeping-requests - Create new housekeeping request
export const POST = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const body = await request.json();
    return await HousekeepingRequestController.createRequest(body);
  } catch (error: any) {
    console.error('Create Housekeeping Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Invalid request body' },
      { status: 400 }
    );
  }
});

