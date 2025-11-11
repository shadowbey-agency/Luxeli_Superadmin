import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { CustomizedServiceRequestController } from '@/controllers/partner/customized-services/CustomizedServiceRequestController';

// GET /api/partner/customized-service-requests/[id] - Get customized service request by ID
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
        { success: false, error: 'Customized service request ID is required' },
        { status: 400 }
      );
    }

    return await CustomizedServiceRequestController.getCustomizedServiceRequestById(id);
  } catch (error: any) {
    console.error('Get Customized Service Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to get customized service request' },
      { status: 500 }
    );
  }
});

// PATCH /api/partner/customized-service-requests/[id] - Update customized service request
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
        { success: false, error: 'Customized service request ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    return await CustomizedServiceRequestController.updateCustomizedServiceRequest(id, body);
  } catch (error: any) {
    console.error('Update Customized Service Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update customized service request' },
      { status: 500 }
    );
  }
});

// DELETE /api/partner/customized-service-requests/[id] - Delete customized service request
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
        { success: false, error: 'Customized service request ID is required' },
        { status: 400 }
      );
    }

    return await CustomizedServiceRequestController.deleteCustomizedServiceRequest(id);
  } catch (error: any) {
    console.error('Delete Customized Service Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete customized service request' },
      { status: 500 }
    );
  }
});




