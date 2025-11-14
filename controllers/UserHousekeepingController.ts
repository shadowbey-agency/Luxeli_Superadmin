import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import HousekeepingRequest from '@/models/housekeeping/HousekeepingRequest';
import Guest from '@/models/Guest';
import Room from '@/models/Room';
import { handleApiError } from '@/lib/middleware';

export class UserHousekeepingController {
  /**
   * Create housekeeping request from guest (Flutter app)
   * POST /api/housekeeping-requests
   * Auth: Guest JWT
   */
  static async createRequest(
    userId: string,
    partnerId: string,
    roomId: string,
    data: {
      type: "custom cleaning" | "item needed";
      cleaningType?: "full room" | "quick refresh" | "custom";
      itemQuantity?: number;
      deliveryDetail?: {
        deliveryMethod: string;
        deliveryWindow: string;
      };
      requestedFor: string;
      priority?: "urgent" | "medium" | "low";
      notes?: string;
    }
  ) {
    try {
      await connectDB();

      // Validate required fields
      if (!data.type || !data.requestedFor) {
        return NextResponse.json(
          { success: false, error: 'Type and requestedFor are required fields' },
          { status: 400 }
        );
      }

      // Validate type-specific fields
      if (data.type === 'custom cleaning' && !data.cleaningType) {
        return NextResponse.json(
          { success: false, error: 'cleaningType is required for custom cleaning requests' },
          { status: 400 }
        );
      }

      if (data.type === 'item needed') {
        if (!data.itemQuantity || data.itemQuantity <= 0) {
          return NextResponse.json(
            { success: false, error: 'itemQuantity must be greater than 0 for item needed requests' },
            { status: 400 }
          );
        }
        if (!data.deliveryDetail || !data.deliveryDetail.deliveryMethod || !data.deliveryDetail.deliveryWindow) {
          return NextResponse.json(
            { success: false, error: 'deliveryDetail with deliveryMethod and deliveryWindow is required for item needed requests' },
            { status: 400 }
          );
        }
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

      // Fetch room details for roomName
      const room = await Room.findById(roomId);
      if (!room) {
        return NextResponse.json(
          { success: false, error: 'Room not found' },
          { status: 404 }
        );
      }

      // Create housekeeping request
      const request = new HousekeepingRequest({
        partnerId,
        roomId,
        roomName: room.roomName,
        userId,
        guest: {
          name: guest.guestName,
          email: guest.guestEmail,
        },
        type: data.type,
        cleaningType: data.cleaningType,
        itemQuantity: data.itemQuantity,
        deliveryDetail: data.deliveryDetail,
        requestedFor: data.requestedFor,
        status: 'new', // Always new when created by guest
        priority: data.priority || 'medium',
        notes: data.notes?.trim(),
      });

      await request.save();

      return NextResponse.json(
        {
          success: true,
          message: 'Housekeeping request created successfully',
          data: { request: request.toJSON() },
        },
        { status: 201 }
      );
    } catch (error) {
      return handleApiError(error, 'Failed to create housekeeping request');
    }
  }

  /**
   * Get guest's own housekeeping requests
   * GET /api/housekeeping-requests/my
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
        userId,
      };

      if (query.status) {
        filter.status = query.status;
      }

      // Fetch requests
      const requests = await HousekeepingRequest.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await HousekeepingRequest.countDocuments(filter);

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
      return handleApiError(error, 'Failed to fetch housekeeping requests');
    }
  }

  /**
   * Get single request details
   * GET /api/housekeeping-requests/:id
   * Auth: Guest JWT
   */
  static async getRequestById(
    userId: string,
    partnerId: string,
    roomId: string,
    requestId: string
  ) {
    try {
      await connectDB();

      // Verify guest is active
      const guest = await Guest.findById(userId);
      if (!guest || !guest.isActive) {
        return NextResponse.json(
          { success: false, error: 'Guest not found or checked out' },
          { status: 403 }
        );
      }

      // Fetch request
      const request = await HousekeepingRequest.findById(requestId).lean();
      if (!request) {
        return NextResponse.json(
          { success: false, error: 'Request not found' },
          { status: 404 }
        );
      }

      // Verify request belongs to this guest
      if (
        request.partnerId !== partnerId ||
        request.roomId !== roomId ||
        request.userId !== userId
      ) {
        return NextResponse.json(
          { success: false, error: 'You do not have permission to view this request' },
          { status: 403 }
        );
      }

      return NextResponse.json({
        success: true,
        data: { request },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to fetch request details');
    }
  }

  /**
   * Cancel a request (guest can only cancel their own requests)
   * PATCH /api/housekeeping-requests/:id/cancel
   * Auth: Guest JWT
   */
  static async cancelRequest(
    userId: string,
    partnerId: string,
    roomId: string,
    requestId: string
  ) {
    try {
      await connectDB();

      // Verify guest is active
      const guest = await Guest.findById(userId);
      if (!guest || !guest.isActive) {
        return NextResponse.json(
          { success: false, error: 'Guest not found or checked out' },
          { status: 403 }
        );
      }

      // Fetch request
      const request = await HousekeepingRequest.findById(requestId);
      if (!request) {
        return NextResponse.json(
          { success: false, error: 'Request not found' },
          { status: 404 }
        );
      }

      // Verify request belongs to this guest
      if (
        request.partnerId !== partnerId ||
        request.roomId !== roomId ||
        request.userId !== userId
      ) {
        return NextResponse.json(
          { success: false, error: 'You do not have permission to cancel this request' },
          { status: 403 }
        );
      }

      // Check if request can be canceled
      if (request.status === 'completed') {
        return NextResponse.json(
          { success: false, error: 'Cannot cancel a completed request' },
          { status: 400 }
        );
      }

      if (request.status === 'canceled') {
        return NextResponse.json(
          { success: false, error: 'Request is already canceled' },
          { status: 400 }
        );
      }

      // Update status to canceled
      request.status = 'canceled';
      await request.save();

      return NextResponse.json({
        success: true,
        message: 'Request canceled successfully',
        data: { request: request.toJSON() },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to cancel request');
    }
  }
}

