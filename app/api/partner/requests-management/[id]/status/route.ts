import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { RequestsManagementController } from '@/controllers/partner/housekeeping/RequestsManagementController';

// PATCH /api/partner/requests-management/[id]/status - Update request status
export const PATCH = withAuth(async (request: AuthenticatedRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) => {
  try {
    let id: string;
    if (context?.params) {
      const params = await Promise.resolve(context.params);
      id = params.id as string;
    } else {
      const url = new URL(request.url);
      const segments = url.pathname.split('/');
      const index = segments.indexOf('requests-management');
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

    if (!status || !['published', 'unpublished'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Status must be either "published" or "unpublished"' },
        { status: 400 }
      );
    }

    return await RequestsManagementController.updateRequestStatus(id, status);
  } catch (error: any) {
    console.error('Update Request Status API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update request status' },
      { status: 500 }
    );
  }
});

