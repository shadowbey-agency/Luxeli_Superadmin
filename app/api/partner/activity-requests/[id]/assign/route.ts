import { NextRequest, NextResponse } from 'next/server';
import { ActivityRequestController } from '@/controllers/partner/activity-alerts/ActivityRequestController';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

// POST /api/partner/activity-requests/[id]/assign - Assign staff to activity request
export const POST = withAuth(async (request: AuthenticatedRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) => {
  try {
    let id: string;
    if (context?.params) {
      const params = await Promise.resolve(context.params);
      id = params.id as string;
    } else {
      const url = new URL(request.url);
      const segments = url.pathname.split('/');
      const index = segments.indexOf('activity-requests');
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

    return await ActivityRequestController.assignStaff(id, assignee);
  } catch (error: any) {
    console.error('Assign Staff to Activity Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to assign staff to activity request' },
      { status: 500 }
    );
  }
});

