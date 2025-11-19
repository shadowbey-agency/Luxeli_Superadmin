import { NextRequest, NextResponse } from 'next/server';
import { UserCustomizedServiceController } from '@/controllers/UserCustomizedServiceController';
import { withGuestAuth, AuthenticatedRequest } from '@/lib/middleware';

/**
 * GET /api/user/customized-service-requests
 * Get guest's own customized service requests
 * Auth: Guest JWT
 */
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
    const query = {
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
      status: searchParams.get('status') || undefined,
    };

    return await UserCustomizedServiceController.getMyRequests(
      user.userId,
      user.partnerId,
      query
    );
  } catch (error: any) {
    console.error('Get My Customized Service Requests API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch requests' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/user/customized-service-requests
 * Create a new customized service request
 * Auth: Guest JWT
 */
export const POST = withGuestAuth(async (request: AuthenticatedRequest) => {
  try {
    const user = request.user;
    
    if (!user?.userId || !user?.partnerId || !user?.roomId || !user?.roomName) {
      return NextResponse.json(
        { success: false, error: 'Invalid token. Missing user information.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    const { title, description } = body;

    // Validation
    if (!title?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }

    return await UserCustomizedServiceController.createRequest(
      user.userId,
      user.partnerId,
      user.roomId,
      user.roomName,
      {
        title: title.trim(),
        description: description?.trim() || undefined,
      }
    );
  } catch (error: any) {
    console.error('Create Customized Service Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create request' },
      { status: 500 }
    );
  }
});