import { NextRequest, NextResponse } from 'next/server';
import { InRoomDeliveryRequestController } from '@/controllers/partner/inroomdeliveryrequest/InRoomDeliveryRequestController';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

// GET /api/partner/in-room-delivery-request/[id] - Get single in-room delivery request
export const GET = withAuth(async (request: AuthenticatedRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) => {
  try {
    let id: string;
    if (context?.params) {
      const params = await Promise.resolve(context.params);
      id = params.id as string;
    } else {
      const url = new URL(request.url);
      const segments = url.pathname.split('/');
      id = segments[segments.length - 1];
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Request ID is required' },
        { status: 400 }
      );
    }

    return await InRoomDeliveryRequestController.getRequestById(id);
  } catch (error: any) {
    console.error('Get In-Room Delivery Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to get in-room delivery request' },
      { status: 500 }
    );
  }
});

// PATCH /api/partner/in-room-delivery-request/[id] - Update in-room delivery request
export const PATCH = withAuth(async (request: AuthenticatedRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) => {
  try {
    let id: string;
    if (context?.params) {
      const params = await Promise.resolve(context.params);
      id = params.id as string;
    } else {
      const url = new URL(request.url);
      const segments = url.pathname.split('/');
      id = segments[segments.length - 1];
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Request ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    return await InRoomDeliveryRequestController.updateRequest(id, body);
  } catch (error: any) {
    console.error('Update In-Room Delivery Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update in-room delivery request' },
      { status: 500 }
    );
  }
});

// DELETE /api/partner/in-room-delivery-request/[id] - Delete in-room delivery request
export const DELETE = withAuth(async (request: AuthenticatedRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) => {
  try {
    let id: string;
    if (context?.params) {
      const params = await Promise.resolve(context.params);
      id = params.id as string;
    } else {
      const url = new URL(request.url);
      const segments = url.pathname.split('/');
      id = segments[segments.length - 1];
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Request ID is required' },
        { status: 400 }
      );
    }

    return await InRoomDeliveryRequestController.deleteRequest(id);
  } catch (error: any) {
    console.error('Delete In-Room Delivery Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete in-room delivery request' },
      { status: 500 }
    );
  }
});


