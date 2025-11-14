import { NextRequest, NextResponse } from 'next/server';
import { HousekeepingRequestController } from '@/controllers/partner/housekeeping/HousekeepingRequestController';
import { withAuth, AuthenticatedRequest, getPartnerId } from '@/lib/middleware';

// PATCH /api/partner/housekeeping-requests/[id]/status - Update housekeeping request status
export const PATCH = withAuth(async (request: AuthenticatedRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) => {
  try {
    const partnerId = getPartnerId(request);
    if (!partnerId) {
      return NextResponse.json(
        { success: false, error: 'Partner ID not found in token' },
        { status: 401 }
      );
    }

    let id: string;
    if (context?.params) {
      const params = await Promise.resolve(context.params);
      id = params.id as string;
    } else {
      const url = new URL(request.url);
      const segments = url.pathname.split('/');
      // Find the index of 'housekeeping-requests' and get the next segment which should be the id
      const index = segments.indexOf('housekeeping-requests');
      id = segments[index + 1];
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Request ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !['new', 'accepted', 'completed', 'no-show', 'canceled'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Valid status is required (new, accepted, completed, no-show, canceled)' },
        { status: 400 }
      );
    }

    return await HousekeepingRequestController.updateRequestStatus(id, partnerId, status);
  } catch (error: any) {
    console.error('Update Housekeeping Request Status API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update housekeeping request status' },
      { status: 500 }
    );
  }
});

