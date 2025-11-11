import { NextRequest, NextResponse } from 'next/server';
import { CustomizedServiceRequestController } from '@/controllers/partner/customized-services/CustomizedServiceRequestController';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

// GET /api/partner/customized-service-requests - Get all customized service requests
export const GET = withAuth(async (request: AuthenticatedRequest) => {
  const { searchParams } = new URL(request.url);
  const query = {
    page: searchParams.get('page') || undefined,
    limit: searchParams.get('limit') || undefined,
    search: searchParams.get('search') || undefined,
    status: searchParams.get('status') || undefined,
    residentEmail: searchParams.get('residentEmail') || undefined,
    roomName: searchParams.get('roomName') || undefined,
  };

  return await CustomizedServiceRequestController.getCustomizedServiceRequests(query);
});

// POST /api/partner/customized-service-requests - Create new customized service request
export const POST = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const body = await request.json();
    
    const {
      roomName,
      residentEmail,
      title,
      description,
      status,
      assignee,
    } = body;

    // Validation: required fields
    if (!roomName?.trim() || !residentEmail?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Room name and resident email are required' },
        { status: 400 }
      );
    }

    if (!title?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status && !['new', 'accepted', 'completed', 'no-show', 'canceled'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status value' },
        { status: 400 }
      );
    }

    return await CustomizedServiceRequestController.createCustomizedServiceRequest({
      roomName: roomName.trim(),
      residentEmail: residentEmail.trim(),
      title: title.trim(),
      description: description?.trim() || undefined,
      status: status || 'new',
      assignee,
    });
  } catch (error: any) {
    console.error('Create Customized Service Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Invalid request body' },
      { status: 400 }
    );
  }
});

