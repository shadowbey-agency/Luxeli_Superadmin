import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest, getPartnerId } from '@/lib/middleware';
import { CustomizedServiceRequestController } from '@/controllers/partner/customized-services/CustomizedServiceRequestController';

// PATCH /api/partner/customized-service-requests/[id]/status - Update customized service request status
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
      id = segments[segments.length - 2]; // status is last segment, id is before it
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Customized service request ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !['new', 'accepted', 'completed', 'no-show', 'canceled'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Status must be one of: new, accepted, completed, no-show, canceled' },
        { status: 400 }
      );
    }

    return await CustomizedServiceRequestController.updateCustomizedServiceRequestStatus(id, partnerId, status);
  } catch (error: any) {
    console.error('Update Customized Service Request Status API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update customized service request status' },
      { status: 500 }
    );
  }
});




