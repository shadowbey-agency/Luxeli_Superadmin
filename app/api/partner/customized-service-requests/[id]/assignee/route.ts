import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { CustomizedServiceRequestController } from '@/controllers/partner/customized-services/CustomizedServiceRequestController';

// PATCH /api/partner/customized-service-requests/[id]/assignee - Update customized service request assignee
export const PATCH = withAuth(async (request: AuthenticatedRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) => {
  try {
    let id: string;
    if (context?.params) {
      const params = await Promise.resolve(context.params);
      id = params.id as string;
    } else {
      const url = new URL(request.url);
      const segments = url.pathname.split('/');
      id = segments[segments.length - 2]; // assignee is last segment, id is before it
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Customized service request ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { assignee } = body;

    // assignee can be null to unassign, or an object with name, staffId, and optional profilePic
    if (assignee !== null && (!assignee?.name || !assignee?.staffId)) {
      return NextResponse.json(
        { success: false, error: 'Assignee must have name and staffId, or be null to unassign' },
        { status: 400 }
      );
    }

    return await CustomizedServiceRequestController.updateCustomizedServiceRequestAssignee(id, assignee);
  } catch (error: any) {
    console.error('Update Customized Service Request Assignee API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update customized service request assignee' },
      { status: 500 }
    );
  }
});




