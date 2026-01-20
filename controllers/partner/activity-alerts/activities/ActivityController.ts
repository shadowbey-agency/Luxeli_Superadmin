import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Activity from '@/models/activity-alerts/activities';
import { handleApiError } from '@/lib/middleware';

export class ActivityController {
  /**
   * Get all activities with pagination and filtering
   */
  static async getActivities(query: {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
  }, partnerId: string) {
    try {
      await connectDB();

      const page = parseInt(query.page || '1', 10);
      const limit = parseInt(query.limit || '20', 10);
      const skip = (page - 1) * limit;

      // Build filter object - always include partnerId
      const filter: any = {
        partnerId: partnerId
      };
      
      if (query.search) {
        filter.$or = [
          { activityTitle: { $regex: query.search, $options: 'i' } },
          { activityDescription: { $regex: query.search, $options: 'i' } },
        ];
      }

      if (query.status) {
        filter.status = query.status;
      }

      console.log('🔍 Fetching activities for partnerId:', {
        partnerId,
        filter,
        page,
        limit
      });

      const [activities, total] = await Promise.all([
        Activity.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Activity.countDocuments(filter),
      ]);

      console.log('✅ Fetched activities:', {
        partnerId,
        count: activities.length,
        total
      });

      return NextResponse.json({
        success: true,
        data: {
          activities,
          pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to get activities');
    }
  }

  /**
   * Get a single activity by ID
   */
  static async getActivityById(activityId: string) {
    try {
      await connectDB();
      const activity = await Activity.findById(activityId).lean();
      
      if (!activity) {
        return NextResponse.json(
          { success: false, error: 'Activity not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: { activity } });
    } catch (error) {
      return handleApiError(error, 'Failed to get activity');
    }
  }

  /**
   * Create a new activity
   */
  static async createActivity(data: {
    partnerId?: string;
    activityTitle?: string;
    status?: "published" | "unpublished";
    activityDescription?: string;
    activityImage?: string;
    createdBy?: string;
  }) {
    try {
      await connectDB();

      const partnerId = data.partnerId || '';
      const title = data.activityTitle?.trim() || '';
      const description = data.activityDescription?.trim() || '';
      const createdBy = data.createdBy?.trim() || '';

      // Validate partnerId
      if (!partnerId) {
        return NextResponse.json(
          { success: false, error: 'Partner ID is required' },
          { status: 400 }
        );
      }

      // Validate required fields
      if (!title || !description || !createdBy) {
        return NextResponse.json(
          { success: false, error: 'Activity title, description, and createdBy are required' },
          { status: 400 }
        );
      }

      // Create and save activity (duplicates allowed)
      const activity = new Activity({
        partnerId: partnerId,
        activityTitle: title,
        status: data.status || 'unpublished',
        activityDescription: description,
        activityImage: data.activityImage,
        createdBy,
      });

      await activity.save();

      return NextResponse.json({
        success: true,
        data: { activity: activity.toJSON() },
      }, { status: 201 });
    } catch (error: any) {
      // Handle duplicate errors - use insertOne directly
      if (error.code === 11000 || error.message?.toLowerCase().includes('duplicate')) {
        try {
          const activityData = {
            activityTitle: data.activityTitle?.trim() || '',
            status: data.status || 'unpublished',
            activityDescription: data.activityDescription?.trim() || '',
            createdBy: data.createdBy?.trim() || '',
            activityImage: data.activityImage,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          const result = await Activity.collection.insertOne(activityData);
          const insertedActivity = await Activity.findById(result.insertedId).lean();

          return NextResponse.json({
            success: true,
            data: { activity: insertedActivity },
          }, { status: 201 });
        } catch (insertError: any) {
          return NextResponse.json(
            { success: false, error: insertError.message || 'Failed to save activity' },
            { status: 500 }
          );
        }
      }

      // Handle validation errors
      if (error.name === 'ValidationError') {
        return NextResponse.json(
          { success: false, error: error.message || 'Validation error' },
          { status: 400 }
        );
      }

      return handleApiError(error, 'Failed to create activity');
    }
  }

  /**
   * Update an activity by ID
   */
  static async updateActivity(activityId: string, data: {
    activityTitle?: string;
    status?: "published" | "unpublished";
    activityDescription?: string;
    activityImage?: string;
    createdBy?: string;
  }) {
    try {
      await connectDB();
      const activity = await Activity.findById(activityId);
      
      if (!activity) {
        return NextResponse.json(
          { success: false, error: 'Activity not found' },
          { status: 404 }
        );
      }

      // Update fields
      if (data.activityTitle !== undefined) activity.activityTitle = data.activityTitle.trim();
      if (data.status !== undefined) activity.status = data.status;
      if (data.activityDescription !== undefined) activity.activityDescription = data.activityDescription.trim();
      if (data.activityImage !== undefined) activity.activityImage = data.activityImage;
      if (data.createdBy !== undefined) activity.createdBy = data.createdBy.trim();

      await activity.save();

      return NextResponse.json({
        success: true,
        data: { activity: activity.toJSON() },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to update activity');
    }
  }

  /**
   * Delete an activity by ID
   */
  static async deleteActivity(activityId: string) {
    try {
      await connectDB();
      const activity = await Activity.findByIdAndDelete(activityId);
      
      if (!activity) {
        return NextResponse.json(
          { success: false, error: 'Activity not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Activity deleted successfully',
      });
    } catch (error) {
      return handleApiError(error, 'Failed to delete activity');
    }
  }

  /**
   * Update activity status (published/unpublished)
   */
  static async updateActivityStatus(activityId: string, status: "published" | "unpublished") {
    try {
      await connectDB();
      const activity = await Activity.findById(activityId);
      
      if (!activity) {
        return NextResponse.json(
          { success: false, error: 'Activity not found' },
          { status: 404 }
        );
      }

      activity.status = status;
      await activity.save();

      return NextResponse.json({
        success: true,
        data: { activity: activity.toJSON() },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to update activity status');
    }
  }
}

