import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { ActivityRequest } from '@/models/activity-alerts/activities';
import { handleApiError } from '@/lib/middleware';

export class ActivityRequestController {
  
  /**
   * Get all activity requests with pagination and filtering
   */
  static async getRequests(query: {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    roomName?: string;
    service?: string;
  }) {
    try {
      await connectDB();

      const page = parseInt(query.page || '1', 10);
      const limit = parseInt(query.limit || '20', 10);
      const skip = (page - 1) * limit;

      // Build filter object
      const filter: any = {};
      
      if (query.search) {
        filter.$or = [
          { roomName: { $regex: query.search, $options: 'i' } },
          { residentName: { $regex: query.search, $options: 'i' } },
          { service: { $regex: query.search, $options: 'i' } },
          { notes: { $regex: query.search, $options: 'i' } },
          { 'assignee.name': { $regex: query.search, $options: 'i' } },
        ];
      }

      if (query.status) {
        filter.status = query.status;
      }

      if (query.roomName) {
        filter.roomName = query.roomName;
      }

      if (query.service) {
        filter.service = query.service;
      }

      // Get items with pagination
      const items = await ActivityRequest.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      // Get total count
      const total = await ActivityRequest.countDocuments(filter);

      return NextResponse.json({
        success: true,
        data: {
          requests: items,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to get activity requests');
    }
  }

  /**
   * Get a single activity request by ID
   */
  static async getRequestById(requestId: string) {
    try {
      await connectDB();

      const request = await ActivityRequest.findById(requestId).lean();
      if (!request) {
        return NextResponse.json(
          { success: false, error: 'Activity request not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: { request },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to get activity request');
    }
  }

  /**
   * Create a new activity request
   */
  static async createRequest(data: {
    roomName: string;
    residentName: string;
    service: string;
    status?: "new" | "accepted" | "completed" | "no-show" | "canceled";
    notes?: string;
    assignee?: {
      name: string;
      staffId: string;
      profilePic?: string;
    };
  }) {
    try {
      await connectDB();

      // Validation - required fields
      if (!data.roomName || !data.residentName || !data.service) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'roomName, residentName, and service are required' 
          },
          { status: 400 }
        );
      }

      // Create new request
      const request = new ActivityRequest({
        roomName: data.roomName.trim(),
        residentName: data.residentName.trim(),
        service: data.service.trim(),
        status: data.status || 'new',
        notes: data.notes?.trim(),
        assignee: data.assignee,
      });

      await request.save();

      return NextResponse.json({
        success: true,
        data: {
          request: request.toJSON(),
        },
      }, { status: 201 });
    } catch (error: any) {
      return handleApiError(error, 'Failed to create activity request');
    }
  }

  /**
   * Update an activity request by ID
   */
  static async updateRequest(requestId: string, data: {
    roomName?: string;
    residentName?: string;
    service?: string;
    status?: "new" | "accepted" | "completed" | "no-show" | "canceled";
    notes?: string;
    assignee?: {
      name?: string;
      staffId?: string;
      profilePic?: string;
    };
  }) {
    try {
      await connectDB();

      const request = await ActivityRequest.findById(requestId);
      console.log(request);
      if (!request) {
        return NextResponse.json(
          { success: false, error: 'Activity request not found' },
          { status: 404 }
        );
      }

      // Update only provided fields
      if (data.roomName !== undefined) request.roomName = data.roomName.trim();
      if (data.residentName !== undefined) request.residentName = data.residentName.trim();
      if (data.service !== undefined) request.service = data.service.trim();
      if (data.status !== undefined) request.status = data.status;
      if (data.notes !== undefined) request.notes = data.notes?.trim();
      if (data.assignee !== undefined) {
        request.assignee = {
          name: data.assignee.name || request.assignee?.name || '',
          staffId: data.assignee.staffId || request.assignee?.staffId || '',
          profilePic: data.assignee.profilePic || request.assignee?.profilePic,
        };
      }

      await request.save();

      return NextResponse.json({
        success: true,
        data: {
          request: request.toJSON(),
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to update activity request');
    }
  }

  /**
   * Delete an activity request by ID
   */
  static async deleteRequest(requestId: string) {
    try {
      await connectDB();

      const request = await ActivityRequest.findByIdAndDelete(requestId);
      if (!request) {
        return NextResponse.json(
          { success: false, error: 'Activity request not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Activity request deleted successfully',
      });
    } catch (error) {
      return handleApiError(error, 'Failed to delete activity request');
    }
  }

  /**
   * Update activity request status
   */
  static async updateRequestStatus(requestId: string, status: "new" | "accepted" | "completed" | "no-show" | "canceled") {
    try {
      await connectDB();

      const request = await ActivityRequest.findByIdAndUpdate(
        requestId,
        { status },
        { new: true }
      );

      if (!request) {
        return NextResponse.json(
          { success: false, error: 'Activity request not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          request: request.toJSON(),
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to update activity request status');
    }
  }

  /**
   * Assign staff to an activity request
   */
  static async assignStaff(requestId: string, assignee: {
    name: string;
    staffId: string;
    profilePic?: string;
  }) {
    try {
      await connectDB();

      const request = await ActivityRequest.findByIdAndUpdate(
        requestId,
        { 
          assignee,
          status: 'accepted' // Auto-update status to accepted when assigned
        },
        { new: true }
      );

      if (!request) {
        return NextResponse.json(
          { success: false, error: 'Activity request not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          request: request.toJSON(),
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to assign staff to activity request');
    }
  }
}

