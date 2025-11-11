import { NextRequest, NextResponse } from 'next/server';
import { ActivityRequestController } from '@/controllers/partner/activity-alerts/ActivityRequestController';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

// GET /api/partner/activity-requests - Get all activity requests
export const GET = withAuth(async (request: AuthenticatedRequest) => {
  const { searchParams } = new URL(request.url);
  const query = {
    page: searchParams.get('page') || undefined,
    limit: searchParams.get('limit') || undefined,
    search: searchParams.get('search') || undefined,
    status: searchParams.get('status') || undefined,
    roomName: searchParams.get('roomName') || undefined,
    service: searchParams.get('service') || undefined,
  };

  return await ActivityRequestController.getRequests(query);
});

// POST /api/partner/activity-requests - Create new activity request
export const POST = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const body = await request.json();
    return await ActivityRequestController.createRequest(body);
  } catch (error: any) {
    console.error('Create Activity Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Invalid request body' },
      { status: 400 }
    );
  }
});



