import { NextRequest, NextResponse } from 'next/server';
import { UserHousekeepingController } from '@/controllers/UserHousekeepingController';
import { withGuestAuth, AuthenticatedRequest } from '@/lib/middleware';

/**
 * PATCH /api/partner/housekeeping-requests/[id]/cancel
 * Cancel a housekeeping request
 * Auth: Guest JWT
 */
export const PATCH = withGuestAuth(async (request: AuthenticatedRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) => {
  try {
    const user = request.user;
    
    if (!user?.userId || !user?.partnerId || !user?.roomId) {
      return NextResponse.json(
        { success: false, error: 'Invalid token. Missing user information.' },
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
      const index = segments.indexOf('housekeeping-requests');
      id = segments[index + 1];
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Request ID is required' },
        { status: 400 }
      );
    }

    return await UserHousekeepingController.cancelRequest(
      user.userId,
      user.partnerId,
      user.roomId,
      id
    );
  } catch (error: any) {
    console.error('Cancel Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to cancel request' },
      { status: 500 }
    );
  }
});

