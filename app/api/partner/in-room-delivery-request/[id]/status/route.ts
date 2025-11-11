import { NextRequest, NextResponse } from 'next/server';
import { InRoomDeliveryRequestController } from '@/controllers/partner/inroomdeliveryrequest/InRoomDeliveryRequestController';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

// PATCH /api/partner/in-room-delivery-request/[id]/status - Update in-room delivery request status
export const PATCH = withAuth(async (request: AuthenticatedRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) => {
  try {
    let id: string;
    if (context?.params) {
      const params = await Promise.resolve(context.params);
      id = params.id as string;
    } else {
      const url = new URL(request.url);
      const segments = url.pathname.split('/');
      const index = segments.indexOf('in-room-delivery-request');
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

    return await InRoomDeliveryRequestController.updateRequestStatus(id, status);
  } catch (error: any) {
    console.error('Update In-Room Delivery Request Status API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update in-room delivery request status' },
      { status: 500 }
    );
  }
});


