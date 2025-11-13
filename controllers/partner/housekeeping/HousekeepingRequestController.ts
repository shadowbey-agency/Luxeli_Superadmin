import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import HousekeepingRequest from '@/models/housekeeping/HousekeepingRequest';
import { handleApiError } from '@/lib/middleware';

export class HousekeepingRequestController {
  /**
   * Get all housekeeping requests with pagination and filtering
   */
  static async getRequests(query: {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    type?: string;
    priority?: string;
    roomId?: string;
  }, partnerId: string) {
    try {
      await connectDB();

      const page = parseInt(query.page || '1', 10);
      const limit = parseInt(query.limit || '20', 10);
      const skip = (page - 1) * limit;

      // Build filter object - always filter by partnerId
      const filter: any = { partnerId };
      
      if (query.search) {
        filter.$or = [
          { roomName: { $regex: query.search, $options: 'i' } },
          { 'guest.name': { $regex: query.search, $options: 'i' } },
          { requestedFor: { $regex: query.search, $options: 'i' } },
          { notes: { $regex: query.search, $options: 'i' } },
        ];
      }

      if (query.status) {
        filter.status = query.status;
      }

      if (query.type) {
        filter.type = query.type;
      }

      if (query.priority) {
        filter.priority = query.priority;
      }

      if (query.roomId) {
        filter.roomId = query.roomId;
      }

      // Get items with pagination
      const items = await HousekeepingRequest.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      // Get total count
      const total = await HousekeepingRequest.countDocuments(filter);

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
      return handleApiError(error, 'Failed to get housekeeping requests');
    }
  }

  /**
   * Get a single housekeeping request by ID
   */
  static async getRequestById(requestId: string) {
    try {
      await connectDB();

      const request = await HousekeepingRequest.findById(requestId).lean();
      if (!request) {
        return NextResponse.json(
          { success: false, error: 'Housekeeping request not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: { request },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to get housekeeping request');
    }
  }

  /**
   * Create a new housekeeping request
   */
  static async createRequest(data: {
    roomId: string;
    roomName: string;
    guest: {
      name: string;
      email?: string;
    };
    type: "custom cleaning" | "item needed";
    cleaningType?: "full room" | "quick refresh" | "custom";
    itemQuantity?: number;
    deliveryDetail?: {
      deliveryMethod: string;
      deliveryWindow: string;
    };
    requestedFor?: string;
    status?: "new" | "accepted" | "completed" | "no-show" | "canceled";
    priority?: "urgent" | "medium" | "low";
    assignee?: {
      name: string;
      staffId: string;
      profilePic?: string;
    };
    notes?: string;
  }, partnerId: string) {
    try {
      await connectDB();

      // Common validation - always required
      if (!data.roomId || !data.roomName || !data.guest?.name || !data.type) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'roomId, roomName, guest.name, and type are required' 
          },
          { status: 400 }
        );
      }

      // Validate type enum
      if (data.type !== "custom cleaning" && data.type !== "item needed") {
        return NextResponse.json(
          { 
            success: false, 
            error: `Invalid type: "${data.type}". Type must be either "custom cleaning" or "item needed"` 
          },
          { status: 400 }
        );
      }

      // Type-specific validation and requestedFor determination
      let requestedFor: string = '';
      
      if (data.type === "custom cleaning") {
        // For custom cleaning, requestedFor is required
        if (!data.requestedFor || !data.requestedFor.trim()) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'requestedFor is required for custom cleaning requests' 
            },
            { status: 400 }
          );
        }
        requestedFor = data.requestedFor.trim();
      } else if (data.type === "item needed") {
        // For item needed, itemQuantity and deliveryDetail are required
        if (!data.itemQuantity || data.itemQuantity <= 0) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'itemQuantity is required and must be greater than 0 for item needed requests' 
            },
            { status: 400 }
          );
        }
        if (!data.deliveryDetail || !data.deliveryDetail.deliveryMethod || !data.deliveryDetail.deliveryWindow) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'deliveryDetail with deliveryMethod and deliveryWindow is required for item needed requests' 
            },
            { status: 400 }
          );
        }
        // For item needed, use deliveryWindow as requestedFor
        requestedFor = data.deliveryDetail.deliveryWindow.trim();
      }

      // Create new request
      const request = new HousekeepingRequest({
        partnerId: partnerId,
        roomId: data.roomId.trim(),
        roomName: data.roomName.trim(),
        guest: {
          name: data.guest.name.trim(),
          email: data.guest.email?.trim(),
        },
        type: data.type,
        cleaningType: data.cleaningType,
        itemQuantity: data.itemQuantity,
        deliveryDetail: data.deliveryDetail,
        requestedFor: requestedFor,
        status: data.status || 'new',
        priority: data.priority || 'medium',
        assignee: data.assignee,
        notes: data.notes?.trim(),
      });

      await request.save();

      return NextResponse.json({
        success: true,
        data: {
          request: request.toJSON(),
        },
      }, { status: 201 });
    } catch (error: any) {
      return handleApiError(error, 'Failed to create housekeeping request');
    }
  }

  /**
   * Update a housekeeping request by ID
   */
  static async updateRequest(requestId: string, data: {
    roomId?: string;
    roomName?: string;
    guest?: {
      name?: string;
      email?: string;
    };
    type?: "custom cleaning" | "item needed";
    cleaningType?: "full room" | "quick refresh" | "custom";
    itemQuantity?: number;
    deliveryDetail?: {
      deliveryMethod?: string;
      deliveryWindow?: string;
    };
    requestedFor?: string;
    status?: "new" | "accepted" | "completed" | "no-show" | "canceled";
    priority?: "urgent" | "medium" | "low";
    assignee?: {
      name?: string;
      staffId?: string;
      profilePic?: string;
    };
    notes?: string;
  }) {
    try {
      await connectDB();

      const request = await HousekeepingRequest.findById(requestId);
      if (!request) {
        return NextResponse.json(
          { success: false, error: 'Housekeeping request not found' },
          { status: 404 }
        );
      }

      // Update only provided fields
      if (data.roomId !== undefined) request.roomId = data.roomId.trim();
      if (data.roomName !== undefined) request.roomName = data.roomName.trim();
      if (data.guest) {
        if (data.guest.name !== undefined) request.guest.name = data.guest.name.trim();
        if (data.guest.email !== undefined) request.guest.email = data.guest.email?.trim();
      }
      if (data.type !== undefined) request.type = data.type;
      if (data.cleaningType !== undefined) request.cleaningType = data.cleaningType;
      if (data.itemQuantity !== undefined) request.itemQuantity = data.itemQuantity;
      if (data.deliveryDetail !== undefined) {
        request.deliveryDetail = {
          deliveryMethod: data.deliveryDetail.deliveryMethod || request.deliveryDetail?.deliveryMethod || '',
          deliveryWindow: data.deliveryDetail.deliveryWindow || request.deliveryDetail?.deliveryWindow || '',
        };
      }
      if (data.requestedFor !== undefined) request.requestedFor = data.requestedFor.trim();
      if (data.status !== undefined) request.status = data.status;
      if (data.priority !== undefined) request.priority = data.priority;
      if (data.assignee !== undefined) {
        request.assignee = {
          name: data.assignee.name || request.assignee?.name || '',
          staffId: data.assignee.staffId || request.assignee?.staffId || '',
          profilePic: data.assignee.profilePic || request.assignee?.profilePic,
        };
      }
      if (data.notes !== undefined) request.notes = data.notes?.trim();

      await request.save();

      return NextResponse.json({
        success: true,
        data: {
          request: request.toJSON(),
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to update housekeeping request');
    }
  }

  /**
   * Delete a housekeeping request by ID
   */
  static async deleteRequest(requestId: string) {
    try {
      await connectDB();

      const request = await HousekeepingRequest.findByIdAndDelete(requestId);
      if (!request) {
        return NextResponse.json(
          { success: false, error: 'Housekeeping request not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Housekeeping request deleted successfully',
      });
    } catch (error) {
      return handleApiError(error, 'Failed to delete housekeeping request');
    }
  }

  /**
   * Update housekeeping request status
   */
  static async updateRequestStatus(requestId: string, status: "new" | "accepted" | "completed" | "no-show" | "canceled") {
    try {
      await connectDB();

      const request = await HousekeepingRequest.findByIdAndUpdate(
        requestId,
        { status },
        { new: true }
      );

      if (!request) {
        return NextResponse.json(
          { success: false, error: 'Housekeeping request not found' },
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
      return handleApiError(error, 'Failed to update housekeeping request status');
    }
  }

  /**
   * Assign staff to a housekeeping request
   */
  static async assignStaff(requestId: string, assignee: {
    name: string;
    staffId: string;
    profilePic?: string;
  }) {
    try {
      await connectDB();

      const request = await HousekeepingRequest.findByIdAndUpdate(
        requestId,
        { 
          assignee,
          status: 'accepted' // Auto-update status to accepted when assigned
        },
        { new: true }
      );

      if (!request) {
        return NextResponse.json(
          { success: false, error: 'Housekeeping request not found' },
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
      return handleApiError(error, 'Failed to assign staff to housekeeping request');
    }
  }
}

