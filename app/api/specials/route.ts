import { NextRequest, NextResponse } from 'next/server';
import { withGuestAuth, AuthenticatedRequest } from '@/lib/middleware';
import { UserSpecialController } from '@/controllers/UserSpecialController';

// GET /api/specials - Get available specials for guests
export const GET = withGuestAuth(async (request: AuthenticatedRequest) => {
  try {
    const user = request.user;
    
    if (!user?.userId || !user?.partnerId) {
      return NextResponse.json(
        { success: false, error: 'Invalid token. Missing user information.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    
    return await UserSpecialController.getSpecials(
      user.userId,
      user.partnerId,
      {
        page: searchParams.get('page') || undefined,
        limit: searchParams.get('limit') || undefined,
      }
    );
  } catch (error: any) {
    console.error('Get Specials API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch specials' },
      { status: 500 }
    );
  }
});

// POST /api/specials/:id/redeem - Redeem a special offer
export const POST = withGuestAuth(async (request: AuthenticatedRequest, { params }: { params: { id: string } }) => {
  try {
    const user = request.user;
    
    if (!user?.userId || !user?.partnerId) {
      return NextResponse.json(
        { success: false, error: 'Invalid token. Missing user information.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    return await UserSpecialController.redeemSpecial(
      user.userId,
      user.partnerId,
      params.id,
      body
    );
  } catch (error: any) {
    console.error('Redeem Special API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to redeem special' },
      { status: 500 }
    );
  }
});