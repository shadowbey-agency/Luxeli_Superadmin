import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { ActivityController } from '@/controllers/partner/activity-alerts/activities/ActivityController';

// GET /api/partner/activities/[id] - Get activity by ID
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
        { success: false, error: 'Activity ID is required' },
        { status: 400 }
      );
    }

    return await ActivityController.getActivityById(id);
  } catch (error: any) {
    console.error('Get Activity API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to get activity' },
      { status: 500 }
    );
  }
});

// PATCH /api/partner/activities/[id] - Update activity
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
        { success: false, error: 'Activity ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    return await ActivityController.updateActivity(id, body);
  } catch (error: any) {
    console.error('Update Activity API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update activity' },
      { status: 500 }
    );
  }
});

// DELETE /api/partner/activities/[id] - Delete activity
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
        { success: false, error: 'Activity ID is required' },
        { status: 400 }
      );
    }

    return await ActivityController.deleteActivity(id);
  } catch (error: any) {
    console.error('Delete Activity API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete activity' },
      { status: 500 }
    );
  }
});

















