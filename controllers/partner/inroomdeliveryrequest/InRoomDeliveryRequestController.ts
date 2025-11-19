import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { InRoomDeliveryRequest, IInRoomDeliveryRequest } from '@/models/room-delivery/InRoomDeliveryRequest';
import { handleApiError, AuthenticatedRequest } from '@/lib/middleware';

export class InRoomDeliveryRequestController {
  /**
   * Get all in-room delivery requests with pagination and filtering
   */
  static async getRequests(query: {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    roomName?: string;
    restaurant?: string;
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
          { requestId: { $regex: query.search, $options: 'i' } },
          { roomName: { $regex: query.search, $options: 'i' } },
          { residentialName: { $regex: query.search, $options: 'i' } },
          { restaurant: { $regex: query.search, $options: 'i' } },
          { pickup: { $regex: query.search, $options: 'i' } },
          { notes: { $regex: query.search, $options: 'i' } },
          { 'assignee.name': { $regex: query.search, $options: 'i' } },
        ];
      }

      if (query.status) filter.status = query.status;
      if (query.roomName) filter.roomName = query.roomName;
      if (query.restaurant) filter.restaurant = query.restaurant;

      const requests = await InRoomDeliveryRequest.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await InRoomDeliveryRequest.countDocuments(filter);

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
      return handleApiError(error, 'Failed to get in-room delivery requests');
    }
  }

  /**
   * Get a single in-room delivery request by ID
   */
  static async getRequestById(requestId: string) {
    try {
      await connectDB();

      const request = await InRoomDeliveryRequest.findById(requestId).lean();
      if (!request) {
        return NextResponse.json(
          { success: false, error: 'In-room delivery request not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: { request } });
    } catch (error) {
      return handleApiError(error, 'Failed to get in-room delivery request');
    }
  }

  /**
   * Create a new in-room delivery request
   */
  static async createRequest(request: AuthenticatedRequest, data: {
    roomName: string;
    residentialName: string;
    items: string[];
    restaurant: string;
    pickup: string;
    status?: "new" | "accepted" | "completed" | "no-show" | "canceled";
    assignee?: {
      name: string;
      staffId: string;
      profilePic?: string;
    };
    notes?: string;
  }) {
    try {
      await connectDB();

      // Get partnerId from authenticated user
      const partnerId = request.user?.userId;
      if (!partnerId) {
        return NextResponse.json(
          { success: false, error: 'Partner ID is required' },
          { status: 400 }
        );
      }

      // Validation
      if (!data.roomName || !data.residentialName || !data.items || !data.restaurant || !data.pickup) {
        return NextResponse.json(
          { success: false, error: 'Required fields missing: roomName, residentialName, items, restaurant, pickup' },
          { status: 400 }
        );
      }

      if (!Array.isArray(data.items) || data.items.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Items must be a non-empty array' },
          { status: 400 }
        );
      }

      const requestDoc = new InRoomDeliveryRequest({
        partnerId, // Add partnerId from authenticated user
        roomName: data.roomName.trim(),
        residentialName: data.residentialName.trim(),
        items: data.items,
        restaurant: data.restaurant.trim(),
        pickup: data.pickup.trim(),
        status: data.status || 'new',
        assignee: data.assignee,
        notes: data.notes?.trim(),
      });

      await requestDoc.save();

      return NextResponse.json(
        { success: true, data: { request: requestDoc.toJSON() } },
        { status: 201 }
      );
    } catch (error) {
      return handleApiError(error, 'Failed to create in-room delivery request');
    }
  }

  /**
   * Update an in-room delivery request by ID
   */
  static async updateRequest(requestId: string, data: {
    roomName?: string;
    residentialName?: string;
    items?: string[];
    restaurant?: string;
    pickup?: string;
    status?: "new" | "accepted" | "completed" | "no-show" | "canceled";
    assignee?: {
      name?: string;
      staffId?: string;
      profilePic?: string;
    };
    notes?: string;
  }) {
    try {
      await connectDB();

      const request = await InRoomDeliveryRequest.findById(requestId);
      if (!request) {
        return NextResponse.json(
          { success: false, error: 'In-room delivery request not found' },
          { status: 404 }
        );
      }

      if (data.roomName !== undefined) request.roomName = data.roomName.trim();
      if (data.residentialName !== undefined) request.residentialName = data.residentialName.trim();
      if (data.items !== undefined) {
        if (!Array.isArray(data.items) || data.items.length === 0) {
          return NextResponse.json(
            { success: false, error: 'Items must be a non-empty array' },
            { status: 400 }
          );
        }
        request.items = data.items;
      }
      if (data.restaurant !== undefined) request.restaurant = data.restaurant.trim();
      if (data.pickup !== undefined) request.pickup = data.pickup.trim();
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

      return NextResponse.json({ success: true, data: { request: request.toJSON() } });
    } catch (error) {
      return handleApiError(error, 'Failed to update in-room delivery request');
    }
  }

  /**
   * Delete an in-room delivery request by ID
   */
  static async deleteRequest(requestId: string) {
    try {
      await connectDB();

      const request = await InRoomDeliveryRequest.findByIdAndDelete(requestId);
      if (!request) {
        return NextResponse.json(
          { success: false, error: 'In-room delivery request not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'In-room delivery request deleted successfully',
      });
    } catch (error) {
      return handleApiError(error, 'Failed to delete in-room delivery request');
    }
  }

  /**
   * Update in-room delivery request status
   */
  static async updateRequestStatus(
    requestId: string,
    status: "new" | "accepted" | "completed" | "no-show" | "canceled"
  ) {
    try {
      await connectDB();

      const request = await InRoomDeliveryRequest.findByIdAndUpdate(
        requestId,
        { status },
        { new: true }
      );

      if (!request) {
        return NextResponse.json(
          { success: false, error: 'In-room delivery request not found' },
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
      return handleApiError(error, 'Failed to update in-room delivery request status');
    }
  }

  /**
   * Assign staff to an in-room delivery request
   */
  static async assignStaff(
    requestId: string,
    assignee: { name: string; staffId: string; profilePic?: string }
  ) {
    try {
      await connectDB();

      const request = await InRoomDeliveryRequest.findByIdAndUpdate(
        requestId,
        {
          assignee,
          status: 'accepted', // Auto-update status to accepted when assigned
        },
        { new: true }
      );

      if (!request) {
        return NextResponse.json(
          { success: false, error: 'In-room delivery request not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: { request: request.toJSON() },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to assign staff to in-room delivery request');
    }
  }
}


