import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import LaundryRequest from '@/models/laundary/laundaryRequest';
import Guest from '@/models/Guest';
import { handleApiError } from '@/lib/middleware';

export class UserLaundryController {
  /**
   * Get guest's own laundry requests
   * GET /api/laundry/requests/my
   * Auth: Guest JWT
   */
  static async getMyRequests(
    userId: string,
    partnerId: string,
    roomId: string,
    query: { page?: string; limit?: string; status?: string }
  ) {
    try {
      await connectDB();

      // Debug logging
      console.log('Fetching laundry requests for:', { userId, partnerId, roomId });

      // Pagination
      const page = parseInt(query.page || '1', 10);
      const limit = parseInt(query.limit || '20', 10);
      const skip = (page - 1) * limit;

      // Build filter - include requests that either match the userId or don't have a userId set
      // Also include requests that match the partnerId for better matching
      const filter: any = {
        partnerId: partnerId, // Always filter by partnerId
        $or: [
          { userId: userId }, // Requests created by this specific user
          { userId: { $exists: false } }, // Requests that don't have userId set (created by partner)
          { userId: null } // Requests with null userId
        ]
      };

      // Only add roomId filter if it exists - make it less strict
      if (roomId) {
        // Use $or to allow requests that match roomId OR don't have roomId set
        filter.$or.push({ roomId: roomId });
        filter.$or.push({ roomId: { $exists: false } });
        filter.$or.push({ roomId: null });
      }

      if (query.status) {
        filter.status = query.status;
      }

      // Debug logging
      console.log('Filter being used:', JSON.stringify(filter, null, 2));

      // Fetch requests
      const requests = await LaundryRequest.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      console.log('Requests found:', requests.length);
      if (requests.length > 0) {
        console.log('Sample request userIds:', requests.map(r => r.userId));
        console.log('Sample request roomIds:', requests.map(r => r.roomId));
        console.log('Sample request partnerIds:', requests.map(r => r.partnerId));
      }

      const total = await LaundryRequest.countDocuments(filter);

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
      return handleApiError(error, 'Failed to fetch laundry requests');
    }
  }

  /**
   * Get single laundry request details
   * GET /api/laundry/requests/:id
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
      // Use less restrictive filtering
      const filter: any = {
        _id: requestId,
        $or: [
          { userId: userId }, // Requests created by this specific user
          { userId: { $exists: false } }, // Requests that don't have userId set (created by partner)
          { userId: null } // Requests with null userId
        ]
      };

      // Add partnerId and roomId filters but make them less strict
      if (partnerId) {
        filter.partnerId = partnerId;
      }
      
      if (roomId) {
        filter.roomId = roomId;
      }

      const request = await LaundryRequest.findOne(filter).lean();

      if (!request) {
        return NextResponse.json(
          { success: false, error: 'Laundry request not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: { request },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to fetch laundry request');
    }
  }

  /**
   * Create a new laundry request
   * POST /api/laundry/requests
   * Auth: Guest JWT
   */
  static async createRequest(
    userId: string,
    partnerId: string,
    roomId: string,
    roomName: string,
    data: {
      residentialName: string;
      services: string[];
      piece: number;
      pickup: Date;
      priority?: "low" | "medium" | "urgent";
      notes?: string;
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

      // Validation
      if (!data.residentialName || !data.services || !data.piece || !data.pickup) {
        return NextResponse.json(
          { success: false, error: 'Required fields missing' },
          { status: 400 }
        );
      }

      // Debug logging
      console.log('Creating laundry request with userId:', userId);

      // Create the request
      const request = new LaundryRequest({
        partnerId,
        service: 'laundry',
        roomName,
        roomId,
        userId,
        residentialName: data.residentialName,
        services: data.services,
        piece: data.piece,
        pickup: data.pickup,
        priority: data.priority || 'medium',
        notes: data.notes?.trim(),
      });

      await request.save();

      // Debug logging
      console.log('Created laundry request with ID:', request._id);
      console.log('Request userId:', request.userId);

      return NextResponse.json(
        {
          success: true,
          message: 'Laundry request created successfully',
          data: { request: request.toJSON() },
        },
        { status: 201 }
      );
    } catch (error) {
      return handleApiError(error, 'Failed to create laundry request');
    }
  }
}