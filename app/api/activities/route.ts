import { NextRequest, NextResponse } from 'next/server';
import { withGuestAuth, AuthenticatedRequest } from '@/lib/middleware';
import connectDB from '@/lib/db';
import Activity from '@/models/activity-alerts/activities';

// GET /api/activities - Get all published activities for guests
export const GET = withGuestAuth(async (request: AuthenticatedRequest) => {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const search = searchParams.get('search') || undefined;
    const skip = (page - 1) * limit;

    // Filter for published activities only
    const filter: any = { status: 'published' };
    
    if (search) {
      filter.$or = [
        { activityTitle: { $regex: search, $options: 'i' } },
        { activityDescription: { $regex: search, $options: 'i' } },
      ];
    }

    const [activities, total] = await Promise.all([
      Activity.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Activity.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        activities: activities.map(activity => ({
          id: activity._id,
          activityTitle: activity.activityTitle,
          status: activity.status,
          activityDescription: activity.activityDescription,
          activityImage: activity.activityImage,
          createdBy: activity.createdBy,
          createdAt: activity.createdAt,
          updatedAt: activity.updatedAt,
        })),
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      },
    });
  } catch (error: any) {
    console.error('Get Activities API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to get activities' },
      { status: 500 }
    );
  }
});