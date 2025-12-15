import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { ActivityController } from '@/controllers/partner/activity-alerts/activities/ActivityController';

// PATCH /api/partner/activities/[id]/status - Update activity status
export const PATCH = withAuth(async (request: AuthenticatedRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) => {
  try {
    let id: string;
    if (context?.params) {
      const params = await Promise.resolve(context.params);
      id = params.id as string;
    } else {
      const url = new URL(request.url);
      const segments = url.pathname.split('/');
      id = segments[segments.length - 2]; // status is last segment, id is before it
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Activity ID is required' },
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

    return await ActivityController.updateActivityStatus(id, status);
  } catch (error: any) {
    console.error('Update Activity Status API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update activity status' },
      { status: 500 }
    );
  }
});























