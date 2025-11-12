import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { RequestsManagementController } from '@/controllers/partner/housekeeping/RequestsManagementController';

// GET /api/partner/requests-management/[id] - Get request by ID
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

    return await RequestsManagementController.getRequestById(id);
  } catch (error: any) {
    console.error('Get Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to get request' },
      { status: 500 }
    );
  }
});

// PATCH /api/partner/requests-management/[id] - Update request
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
    return await RequestsManagementController.updateRequest(id, body);
  } catch (error: any) {
    console.error('Update Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update request' },
      { status: 500 }
    );
  }
});

// DELETE /api/partner/requests-management/[id] - Delete request
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

    return await RequestsManagementController.deleteRequest(id);
  } catch (error: any) {
    console.error('Delete Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete request' },
      { status: 500 }
    );
  }
});











