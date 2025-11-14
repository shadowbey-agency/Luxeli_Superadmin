import { NextRequest, NextResponse } from 'next/server';
import { GuestController } from '@/controllers/GuestController';
import { withAuth, AuthenticatedRequest, getPartnerId } from '@/lib/middleware';

/**
 * POST /api/partner/checkout-guest
 * Checkout a guest and deactivate their access
 * Auth: Partner JWT
 */
export const POST = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const partnerId = getPartnerId(request);
    if (!partnerId) {
      return NextResponse.json(
        { success: false, error: 'Partner ID not found in token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    if (!body.roomId) {
      return NextResponse.json(
        { success: false, error: 'roomId is required' },
        { status: 400 }
      );
    }

    return await GuestController.checkoutGuest(partnerId, body.roomId);
  } catch (error: any) {
    console.error('Checkout Guest API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to checkout guest' },
      { status: 500 }
    );
  }
});

