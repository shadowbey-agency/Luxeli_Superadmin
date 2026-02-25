import { NextRequest } from 'next/server';
import { PartnerMemberController } from '@/controllers/partner/PartnerMemberController';
import { withAuth, AuthenticatedRequest, getPartnerId } from '@/lib/middleware';

export const GET = withAuth(async (request: AuthenticatedRequest) => {
  const partnerId = getPartnerId(request);
  if (!partnerId) {
    return Response.json(
      { success: false, error: 'Partner ID is required' },
      { status: 401 }
    );
  }
  const { searchParams } = new URL(request.url);
  const query = {
    page: searchParams.get('page') || undefined,
    limit: searchParams.get('limit') || undefined,
    search: searchParams.get('search') || undefined,
    status: searchParams.get('status') || undefined,
    partnerId,
  };

  return await PartnerMemberController.getPartnerMembers(query);
});

export const POST = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const partnerId = getPartnerId(request);
    if (!partnerId) {
      return Response.json(
        { success: false, error: 'Partner ID is required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      memberName,
      email,
      phoneNumber,
      memberImage,
      username,
      password,
      status,
      permissions,
    } = body;

    // Validate required fields
    if (!memberName || !email || !phoneNumber || !username || !password) {
      return Response.json(
        { success: false, error: 'memberName, email, phoneNumber, username, and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return Response.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status && !['active', 'disable'].includes(status)) {
      return Response.json(
        { success: false, error: 'Status must be either "active" or "disable"' },
        { status: 400 }
      );
    }

    return await PartnerMemberController.createPartnerMember({
      partnerId,
      memberName: memberName.trim(),
      email: email.toLowerCase().trim(),
      phoneNumber: phoneNumber.trim(),
      memberImage: memberImage || '',
      username: username.trim(),
      password,
      status: status || 'active',
      permissions: permissions || {
        dashboard: false,
        room: {
          rooms: false,
          requests: false,
        },
        support: {
          myTickets: false,
          ticketSaved: false,
        },
        team: {
          members: false,
          staff: false,
        },
        housekeeping: {
          requests: false,
          houseCleaning: false,
          requestManagement: false,
        },
        booking: {
          internalRequests: {
            allCategories: false,
            categoryName: false,
          },
          bookingSetting: false,
        },
        customizedServices: {
          requests: false,
        },
        activityAlert: {
          requests: false,
          activities: false,
        },
        laundry: {
          requests: false,
          setting: false,
        },
        inRoomDelivery: {
          requests: false,
          restaurantName: false,
          restaurantSetting: false,
        },
      },
    });
  } catch (error) {
    console.error('Create Partner Member API Error:', error);
    return Response.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
});












