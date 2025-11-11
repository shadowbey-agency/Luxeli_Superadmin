import { NextRequest, NextResponse } from 'next/server';
import { ActivityRequestController } from '@/controllers/partner/activity-alerts/ActivityRequestController';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

// GET /api/partner/activity-requests/[id] - Get single laundary request
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

    return await ActivityRequestController.getRequestById(id);
  } catch (error: any) {
    console.error('Get Activity Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to get activity request' },
      { status: 500 }
    );
  }
});

// PATCH /api/partner/activity-requests/[id] - Update laundary request
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
    return await ActivityRequestController.updateRequest(id, body);
  } catch (error: any) {
    console.error('Update Activity Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update activity request' },
      { status: 500 }
    );
  }
});

// DELETE /api/partner/activity-requests/[id] - Delete laundary request
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

    return await ActivityRequestController.deleteRequest(id);
  } catch (error: any) {
    console.error('Delete Activity Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete activity request' },
      { status: 500 }
    );
  }
});

