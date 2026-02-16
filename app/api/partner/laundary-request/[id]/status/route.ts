import { NextRequest, NextResponse } from 'next/server';
import { LaundryRequestController } from '@/controllers/partner/laundary/LaundaryRequest';
import { withAuth, AuthenticatedRequest, getPartnerId } from '@/lib/middleware';

// PATCH /api/partner/laundary-request/[id]/status - Update laundry request status
export const PATCH = withAuth(async (request: AuthenticatedRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) => {
  try {
    const partnerId = getPartnerId(request);
    if (!partnerId) {
      return NextResponse.json(
        { success: false, error: 'Partner ID not found' },
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
      const index = segments.indexOf('laundary-request');
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

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      );
    }

    const validStatuses = ['new', 'accepted', 'completed', 'no-show', 'canceled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status. Must be one of: new, accepted, completed, no-show, canceled' },
        { status: 400 }
      );
    }

    return await LaundryRequestController.updateRequestStatus(id, partnerId, status);
  } catch (error: any) {
    console.error('Update Laundry Request Status API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update laundry request status' },
      { status: 500 }
    );
  }
});

