import { NextRequest, NextResponse } from 'next/server';
import { HousekeepingRequestController } from '@/controllers/partner/housekeeping/HousekeepingRequestController';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

// POST /api/partner/housekeeping-requests/[id]/assign - Assign staff to housekeeping request
export const POST = withAuth(async (request: AuthenticatedRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) => {
  try {
    let id: string;
    if (context?.params) {
      const params = await Promise.resolve(context.params);
      id = params.id as string;
    } else {
      const url = new URL(request.url);
      const segments = url.pathname.split('/');
      const index = segments.indexOf('housekeeping-requests');
      id = segments[index + 1];
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Request ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { assignee } = body;

    if (!assignee || !assignee.name || !assignee.staffId) {
      return NextResponse.json(
        { success: false, error: 'Assignee name and staffId are required' },
        { status: 400 }
      );
    }

    return await HousekeepingRequestController.assignStaff(id, assignee);
  } catch (error: any) {
    console.error('Assign Staff to Housekeeping Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to assign staff to housekeeping request' },
      { status: 500 }
    );
  }
});

