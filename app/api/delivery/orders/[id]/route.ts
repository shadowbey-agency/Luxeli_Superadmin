import { NextRequest, NextResponse } from 'next/server';
import { UserInRoomDeliveryController } from '@/controllers/UserInRoomDeliveryController';
import { withGuestAuth, AuthenticatedRequest } from '@/lib/middleware';

/**
 * GET /api/delivery/orders/[id]
 * Get single delivery request details
 * Auth: Guest JWT
 */
export const GET = withGuestAuth(async (request: AuthenticatedRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) => {
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
      id = segments[segments.length - 1];
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Request ID is required' },
        { status: 400 }
      );
    }

    return await UserInRoomDeliveryController.getRequestById(
      user.userId,
      user.partnerId,
      user.roomId,
      id
    );
  } catch (error: any) {
    console.error('Get Delivery Request Details API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch request' },
      { status: 500 }
    );
  }
});