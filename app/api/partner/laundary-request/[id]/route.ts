import { NextRequest, NextResponse } from 'next/server';
import { LaundryRequestController } from '@/controllers/partner/laundary/LaundaryRequest';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';


// GET /api/partner/laundary-request/[id] - Get single laundry request
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

    return await LaundryRequestController.getRequestById(id);
  } catch (error: any) {
    console.error('Get Laundry Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to get laundry request' },
      { status: 500 }
    );
  }
});

// PATCH /api/partner/laundary-request/[id] - Update laundry request
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
    return await LaundryRequestController.updateRequest(id, body);
  } catch (error: any) {
    console.error('Update Laundry Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update laundry request' },
      { status: 500 }
    );
  }
});

// DELETE /api/partner/laundary-request/[id] - Delete laundry request
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

    return await LaundryRequestController.deleteRequest(id);
  } catch (error: any) {
    console.error('Delete Laundry Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete laundry request' },
      { status: 500 }
    );
  }
});

