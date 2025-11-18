import { NextRequest, NextResponse } from 'next/server';
import { UserHousekeepingController } from '@/controllers/UserHousekeepingController';
import { HousekeepingRequestController } from '@/controllers/partner/housekeeping/HousekeepingRequestController';
import { withGuestAuth, withAuth, AuthenticatedRequest, getPartnerId } from '@/lib/middleware';

/**
 * GET /api/partner/housekeeping-requests/[id]
 * Get single request details
 * Supports both Guest JWT and Partner JWT
 */
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

    // Check if it's a partner request (has partnerId in token)
    const partnerId = getPartnerId(request);
    if (partnerId) {
      // Partner/admin access
      return await HousekeepingRequestController.getRequestById(id, partnerId);
    } else {
      // Guest access - try guest auth
      const user = request.user;
      if (!user?.userId || !user?.partnerId || !user?.roomId) {
        return NextResponse.json(
          { success: false, error: 'Invalid token. Missing user information.' },
          { status: 401 }
        );
      }
      return await UserHousekeepingController.getRequestById(
        user.userId,
        user.partnerId,
        user.roomId,
        id
      );
    }
  } catch (error: any) {
    console.error('Get Request Details API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch request' },
      { status: 500 }
    );
  }
});

// PATCH /api/partner/housekeeping-requests/[id] - Update housekeeping request
export const PATCH = withAuth(async (request: AuthenticatedRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) => {
  try {
    const partnerId = getPartnerId(request);
    if (!partnerId) {
      return NextResponse.json(
        { success: false, error: 'Partner ID not found in token' },
        { status: 401 }
      );
    }

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
    return await HousekeepingRequestController.updateRequest(id, partnerId, body);
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
    const partnerId = getPartnerId(request);
    if (!partnerId) {
      return NextResponse.json(
        { success: false, error: 'Partner ID not found in token' },
        { status: 401 }
      );
    }

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

    return await HousekeepingRequestController.deleteRequest(id, partnerId);
  } catch (error: any) {
    console.error('Delete Housekeeping Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete housekeeping request' },
      { status: 500 }
    );
  }
});
