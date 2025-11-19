import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { InRoomDeliveryRequest } from '@/models/room-delivery/InRoomDeliveryRequest';
import Guest from '@/models/Guest';
import { handleApiError } from '@/lib/middleware';

export class UserInRoomDeliveryController {
  /**
   * Get guest's own in-room delivery requests
   * GET /api/delivery/orders/my
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
        // For guest orders, we'll use a default partnerId
        $or: [
          { userId }, // Regular guest requests
          { partnerId: "guest-order" } // Guest orders without userId
        ]
      };

      if (query.status) {
        filter.status = query.status;
      }

      // Fetch requests
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
      return handleApiError(error, 'Failed to fetch in-room delivery requests');
    }
  }

  /**
   * Get single request details
   * GET /api/delivery/orders/:id
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

      // Verify guest exists and is active
      const guest = await Guest.findById(userId);
      if (!guest || !guest.isActive) {
        return NextResponse.json(
          { success: false, error: 'Guest not found or inactive' },
          { status: 404 }
        );
      }

      // Find request that belongs to this guest
      const request = await InRoomDeliveryRequest.findOne({
        _id: requestId,
        partnerId,
        roomId,
        $or: [
          { userId }, // Regular guest requests
          { partnerId: "guest-order" } // Guest orders without userId
        ]
      }).lean();

      if (!request) {
        return NextResponse.json(
          { success: false, error: 'Delivery request not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: { request },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to fetch delivery request');
    }
  }
}