import { NextRequest, NextResponse } from 'next/server';
import { UserHousekeepingController } from '@/controllers/UserHousekeepingController';
import { HousekeepingRequestController } from '@/controllers/partner/housekeeping/HousekeepingRequestController';
import { withAuth, AuthenticatedRequest, getPartnerId } from '@/lib/middleware';

/**
 * GET /api/partner/housekeeping-requests
 * Get all housekeeping requests for partner
 * Auth: Partner JWT
 */
export const GET = withAuth(async (request: AuthenticatedRequest) => {
  const partnerId = getPartnerId(request);
  if (!partnerId) {
    return NextResponse.json(
      { success: false, error: 'Partner ID not found' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = {
    page: searchParams.get('page') || undefined,
    limit: searchParams.get('limit') || undefined,
    search: searchParams.get('search') || undefined,
    status: searchParams.get('status') || undefined,
    type: searchParams.get('type') || undefined,
    priority: searchParams.get('priority') || undefined,
    roomId: searchParams.get('roomId') || undefined,
  };

  return await HousekeepingRequestController.getRequests(query, partnerId);
});

/**
 * POST /api/partner/housekeeping-requests
 * Create housekeeping request
 * Supports both Guest (app) and Partner (web) requests
 * Auth: Guest JWT or Partner JWT
 */
export const POST = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const user = request.user;
    const body = await request.json();
    
    // Check if it's a guest request (has userId, partnerId, roomId in token)
    const isGuestRequest = user?.userId && user?.partnerId && user?.roomId;
    
    if (isGuestRequest) {
      // Guest request from app - use UserHousekeepingController
      if (!user?.userId || !user?.partnerId || !user?.roomId) {
        return NextResponse.json(
          { success: false, error: 'Invalid token. Missing user information.' },
          { status: 401 }
        );
      }

      // Validate required fields
      if (!body.type || !body.requestedFor) {
        return NextResponse.json(
          { success: false, error: 'type and requestedFor are required fields' },
          { status: 400 }
        );
      }

      // Validate type value
      if (!['custom cleaning', 'item needed'].includes(body.type)) {
        return NextResponse.json(
          { success: false, error: 'type must be either "custom cleaning" or "item needed"' },
          { status: 400 }
        );
      }

      return await UserHousekeepingController.createRequest(
        user.userId,
        user.partnerId,
        user.roomId,
        {
          type: body.type,
          cleaningType: body.cleaningType,
          itemQuantity: body.itemQuantity,
          deliveryDetail: body.deliveryDetail,
          requestedFor: body.requestedFor,
          priority: body.priority,
          notes: body.notes,
        }
      );
    } else {
      // Partner request from web - use HousekeepingRequestController
      const partnerId = getPartnerId(request);
      if (!partnerId) {
        return NextResponse.json(
          { success: false, error: 'Partner ID not found' },
          { status: 401 }
        );
      }

      // Validate required fields
      if (!body.roomId || !body.roomName || !body.guest?.name || !body.type) {
        return NextResponse.json(
          { success: false, error: 'roomId, roomName, guest.name, and type are required' },
          { status: 400 }
        );
      }

      // Validate type value
      if (!['custom cleaning', 'item needed'].includes(body.type)) {
        return NextResponse.json(
          { success: false, error: 'type must be either "custom cleaning" or "item needed"' },
          { status: 400 }
        );
      }

      return await HousekeepingRequestController.createRequest(
        {
          roomId: body.roomId,
          roomName: body.roomName,
          guest: body.guest,
          type: body.type,
          cleaningType: body.cleaningType,
          itemQuantity: body.itemQuantity,
          deliveryDetail: body.deliveryDetail,
          requestedFor: body.requestedFor,
          status: body.status || 'new',
          priority: body.priority,
          assignee: body.assignee,
          notes: body.notes,
        },
        partnerId
      );
    }
  } catch (error: any) {
    console.error('Create Housekeeping Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create request' },
      { status: 500 }
    );
  }
});
