import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { ActivityRequest } from '@/models/activity-alerts/activities/ActivityRequest';
import Guest from '@/models/Guest';
import Room from '@/models/Room';
import { handleApiError } from '@/lib/middleware';

export class UserActivityController {
  /**
   * Create activity request from guest (Flutter app)
   * POST /api/activity-requests
   * Auth: Guest JWT
   */
  static async createRequest(
    userId: string,
    partnerId: string,
    roomId: string,
    data: {
      service: string;
      notes?: string;
    }
  ) {
    try {
      await connectDB();

      // Validate required fields
      if (!data.service) {
        return NextResponse.json(
          { success: false, error: 'service is required field' },
          { status: 400 }
        );
      }

      // Fetch guest details
      const guest = await Guest.findById(userId);
      if (!guest) {
        return NextResponse.json(
          { success: false, error: 'Guest not found' },
          { status: 404 }
        );
      }

      // Verify guest is still active
      if (!guest.isActive) {
        return NextResponse.json(
          { success: false, error: 'Guest has been checked out' },
          { status: 403 }
        );
      }

      // Verify guest's room and partner match token
      if (guest.roomId !== roomId || guest.partnerId !== partnerId) {
        return NextResponse.json(
          { success: false, error: 'Guest assignment mismatch. Please login again.' },
          { status: 403 }
        );
      }

      // Create activity request
      const request = new ActivityRequest({
        partnerId,
        roomName: guest.roomName,
        residentName: guest.guestName,
        service: data.service.trim(),
        notes: data.notes?.trim(),
        status: 'new',
      });

      await request.save();

      return NextResponse.json(
        {
          success: true,
          message: 'Activity request created successfully',
          data: { request: request.toJSON() },
        },
        { status: 201 }
      );
    } catch (error) {
      return handleApiError(error, 'Failed to create activity request');
    }
  }

  /**
   * Get guest's own activity requests
   * GET /api/activity-requests/my
   * Auth: Guest JWT
   */
  static async getMyRequests(
    userId: string,
    partnerId: string,
    roomId: string,
    query: {
      page?: string;
      limit?: string;
      status?: string;
    }
  ) {
    try {
      await connectDB();

      // Verify guest exists and is active
      const guest = await Guest.findById(userId);
      if (!guest) {
        return NextResponse.json(
          { success: false, error: 'Guest not found' },
          { status: 404 }
        );
      }

      if (!guest.isActive) {
        return NextResponse.json(
          { success: false, error: 'Guest has been checked out' },
          { status: 403 }
        );
      }

      // Pagination
      const page = parseInt(query.page || '1', 10);
      const limit = parseInt(query.limit || '20', 10);
      const skip = (page - 1) * limit;

      // Build filter
      const filter: any = {
        partnerId,
        roomId,
        // Note: The ActivityRequest model doesn't have userId field yet
        // For now, we'll filter by room and partner
      };

      if (query.status) {
        filter.status = query.status;
      }

      // Fetch requests
      const requests = await ActivityRequest.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await ActivityRequest.countDocuments(filter);

      return NextResponse.json({
        success: true,
        data: {
          requests,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to fetch activity requests');
    }
  }
}