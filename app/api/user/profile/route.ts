import { NextRequest, NextResponse } from 'next/server';
import { GuestController } from '@/controllers/GuestController';
import { withGuestAuth, AuthenticatedRequest } from '@/lib/middleware';

/**
 * GET /api/user/profile
 * Get guest profile
 * Auth: Guest JWT
 */
export const GET = withGuestAuth(async (request: AuthenticatedRequest) => {
  try {
    const userId = request.user?.userId;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID not found in token' },
        { status: 401 }
      );
    }

    return await GuestController.getProfile(userId);
  } catch (error: any) {
    console.error('Get Profile API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to get profile' },
      { status: 500 }
    );
  }
});

