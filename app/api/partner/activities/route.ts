import { NextRequest, NextResponse } from 'next/server';
import { ActivityController } from '@/controllers/partner/activity-alerts/activities/ActivityController';
import { withAuth, AuthenticatedRequest, getPartnerId } from '@/lib/middleware';

// GET /api/partner/activities - Get all activities
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
  };

  return await ActivityController.getActivities(query, partnerId);
});

// POST /api/partner/activities - Create new activity
export const POST = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const partnerId = getPartnerId(request);
    if (!partnerId) {
      return NextResponse.json(
        { success: false, error: 'Partner ID not found' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    const {
      activityTitle,
      status,
      activityDescription,
      activityImage,
      createdBy,
    } = body;

    // Simple validation: required fields
    if (!activityTitle?.trim() || !activityDescription?.trim() || !createdBy?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Activity title, description, and createdBy are required' },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status && !['published', 'unpublished'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Status must be either "published" or "unpublished"' },
        { status: 400 }
      );
    }

    return await ActivityController.createActivity({
      partnerId,
      activityTitle: activityTitle?.trim() || '',
      status: status || 'unpublished',
      activityDescription: activityDescription?.trim() || '',
      activityImage: activityImage || undefined,
      createdBy: createdBy?.trim() || '',
    });
  } catch (error: any) {
    console.error('Create Activity API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Invalid request body' },
      { status: 400 }
    );
  }
});




