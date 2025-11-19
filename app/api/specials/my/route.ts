import { NextRequest, NextResponse } from 'next/server';
import { withGuestAuth, AuthenticatedRequest } from '@/lib/middleware';
import { UserSpecialController } from '@/controllers/UserSpecialController';

// GET /api/specials/my - Get guest's redeemed specials
export const GET = withGuestAuth(async (request: AuthenticatedRequest) => {
  try {
    const user = request.user;
    
    if (!user?.userId) {
      return NextResponse.json(
        { success: false, error: 'Invalid token. Missing user information.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    
    return await UserSpecialController.getMySpecials(
      user.userId,
      {
        page: searchParams.get('page') || undefined,
        limit: searchParams.get('limit') || undefined,
        status: searchParams.get('status') || undefined,
      }
    );
  } catch (error: any) {
    console.error('Get My Specials API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch redeemed specials' },
      { status: 500 }
    );
  }
});