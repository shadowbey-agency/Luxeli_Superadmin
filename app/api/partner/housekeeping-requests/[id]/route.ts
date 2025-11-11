import { NextRequest, NextResponse } from 'next/server';
import { HousekeepingRequestController } from '@/controllers/partner/housekeeping/HousekeepingRequestController';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

// GET /api/partner/housekeeping-requests/[id] - Get single housekeeping request
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

    return await HousekeepingRequestController.getRequestById(id);
  } catch (error: any) {
    console.error('Get Housekeeping Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to get housekeeping request' },
      { status: 500 }
    );
  }
});

// PATCH /api/partner/housekeeping-requests/[id] - Update housekeeping request
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
    return await HousekeepingRequestController.updateRequest(id, body);
  } catch (error: any) {
    console.error('Update Housekeeping Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update housekeeping request' },
      { status: 500 }
    );
  }
});

// DELETE /api/partner/housekeeping-requests/[id] - Delete housekeeping request
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

    return await HousekeepingRequestController.deleteRequest(id);
  } catch (error: any) {
    console.error('Delete Housekeeping Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete housekeeping request' },
      { status: 500 }
    );
  }
});

