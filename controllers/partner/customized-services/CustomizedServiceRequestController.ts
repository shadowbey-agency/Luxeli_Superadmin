import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { CustomizedServiceRequest } from '@/models/customized-services';
import { handleApiError } from '@/lib/middleware';

export class CustomizedServiceRequestController {
  /**
   * Get all customized service requests with pagination and filtering
   */
  static async getCustomizedServiceRequests(query: {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    residentEmail?: string;
    roomName?: string;
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
          { residentEmail: { $regex: query.search, $options: 'i' } },
          { title: { $regex: query.search, $options: 'i' } },
          { description: { $regex: query.search, $options: 'i' } },
          { customId: { $regex: query.search, $options: 'i' } },
          { 'assignee.name': { $regex: query.search, $options: 'i' } },
        ];
      }

      if (query.status) {
        filter.status = query.status;
      }

      if (query.residentEmail) {
        filter.residentEmail = query.residentEmail;
      }

      if (query.roomName) {
        filter.roomName = query.roomName;
      }

      // Get items with pagination
      const items = await CustomizedServiceRequest.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      // Get total count
      const total = await CustomizedServiceRequest.countDocuments(filter);

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
      return handleApiError(error, 'Failed to get customized service requests');
    }
  }

  /**
   * Get a single customized service request by ID
   */
  static async getCustomizedServiceRequestById(requestId: string) {
    try {
      await connectDB();

      const request = await CustomizedServiceRequest.findById(requestId).lean();
      if (!request) {
        return NextResponse.json(
          { success: false, error: 'Customized service request not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: { request },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to get customized service request');
    }
  }

  /**
   * Create a new customized service request
   */
  static async createCustomizedServiceRequest(data: {
    roomName: string;
    residentEmail: string;
    title: string;
    description?: string;
    status?: "new" | "accepted" | "completed" | "no-show" | "canceled";
    assignee?: {
      name: string;
      staffId: string;
      profilePic?: string;
    };
  }) {
    try {
      await connectDB();

      // Validation: required fields
      if (!data.roomName?.trim() || !data.residentEmail?.trim()) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Room name and resident email are required' 
          },
          { status: 400 }
        );
      }

      if (!data.title?.trim()) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Title is required' 
          },
          { status: 400 }
        );
      }

      // Create new customized service request
      const request = new CustomizedServiceRequest({
        roomName: data.roomName.trim(),
        residentEmail: data.residentEmail.trim(),
        title: data.title.trim(),
        description: data.description?.trim() || undefined,
        status: data.status || 'new',
        assignee: data.assignee || undefined,
      });

      await request.save();

      return NextResponse.json({
        success: true,
        data: {
          request: request.toJSON(),
        },
      }, { status: 201 });
    } catch (error: any) {
      console.error('Create Customized Service Request Error:', error);
      return handleApiError(error, 'Failed to create customized service request');
    }
  }

  /**
   * Update a customized service request by ID
   */
  static async updateCustomizedServiceRequest(requestId: string, data: {
    roomName?: string;
    residentEmail?: string;
    title?: string;
    description?: string;
    status?: "new" | "accepted" | "completed" | "no-show" | "canceled";
    assignee?: {
      name: string;
      staffId: string;
      profilePic?: string;
    };
  }) {
    try {
      await connectDB();

      const request = await CustomizedServiceRequest.findById(requestId);
      if (!request) {
        return NextResponse.json(
          { success: false, error: 'Customized service request not found' },
          { status: 404 }
        );
      }

      // Update only provided fields
      if (data.roomName !== undefined) request.roomName = data.roomName.trim();
      if (data.residentEmail !== undefined) request.residentEmail = data.residentEmail.trim();
      if (data.title !== undefined) request.title = data.title.trim();
      if (data.description !== undefined) request.description = data.description?.trim() || undefined;
      if (data.status !== undefined) {
        if (!['new', 'accepted', 'completed', 'no-show', 'canceled'].includes(data.status)) {
          return NextResponse.json(
            { success: false, error: 'Invalid status value' },
            { status: 400 }
          );
        }
        request.status = data.status;
      }
      if (data.assignee !== undefined) {
        request.assignee = data.assignee;
      }

      await request.save();

      return NextResponse.json({
        success: true,
        data: {
          request: request.toJSON(),
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to update customized service request');
    }
  }

  /**
   * Delete a customized service request by ID
   */
  static async deleteCustomizedServiceRequest(requestId: string) {
    try {
      await connectDB();

      const request = await CustomizedServiceRequest.findByIdAndDelete(requestId);
      if (!request) {
        return NextResponse.json(
          { success: false, error: 'Customized service request not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Customized service request deleted successfully',
      });
    } catch (error) {
      return handleApiError(error, 'Failed to delete customized service request');
    }
  }

  /**
   * Update customized service request status
   */
  static async updateCustomizedServiceRequestStatus(
    requestId: string, 
    status: "new" | "accepted" | "completed" | "no-show" | "canceled"
  ) {
    try {
      await connectDB();

      const request = await CustomizedServiceRequest.findById(requestId);
      if (!request) {
        return NextResponse.json(
          { success: false, error: 'Customized service request not found' },
          { status: 404 }
        );
      }

      if (!['new', 'accepted', 'completed', 'no-show', 'canceled'].includes(status)) {
        return NextResponse.json(
          { success: false, error: 'Invalid status value' },
          { status: 400 }
        );
      }

      request.status = status;
      await request.save();

      return NextResponse.json({
        success: true,
        data: {
          request: request.toJSON(),
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to update customized service request status');
    }
  }

  /**
   * Update customized service request assignee
   */
  static async updateCustomizedServiceRequestAssignee(
    requestId: string,
    assignee: {
      name: string;
      staffId: string;
      profilePic?: string;
    } | null
  ) {
    try {
      await connectDB();

      const request = await CustomizedServiceRequest.findById(requestId);
      if (!request) {
        return NextResponse.json(
          { success: false, error: 'Customized service request not found' },
          { status: 404 }
        );
      }

      request.assignee = assignee || undefined;
      
      // Auto-update status to accepted when assigning staff
      if (assignee !== null) {
        request.status = 'accepted';
      }
      
      await request.save();

      return NextResponse.json({
        success: true,
        data: {
          request: request.toJSON(),
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to update customized service request assignee');
    }
  }
}

