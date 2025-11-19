import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { CustomizedServiceRequest } from '@/models/customized-services/CustomizedServiceRequest';
import Guest from '@/models/Guest';
import { handleApiError } from '@/lib/middleware';

export class UserCustomizedServiceController {
  /**
   * Get guest's own customized service requests
   * GET /api/user/customized-service-requests
   * Auth: Guest JWT
   */
  static async getMyRequests(
    userId: string,
    partnerId: string,
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

      // Build filter - include requests that match the userId and partnerId
      const filter: any = {
        partnerId: partnerId,
      };

      // Add email filter to match guest's email
      if (guest.guestEmail) {
        filter.residentEmail = guest.guestEmail;
      }

      if (query.status) {
        filter.status = query.status;
      }

      // Fetch requests
      const requests = await CustomizedServiceRequest.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await CustomizedServiceRequest.countDocuments(filter);

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
      return handleApiError(error, 'Failed to fetch customized service requests');
    }
  }

  /**
   * Create a new customized service request
   * POST /api/user/customized-service-requests
   * Auth: Guest JWT
   */
  static async createRequest(
    userId: string,
    partnerId: string,
    roomId: string,
    roomName: string,
    data: {
      title: string;
      description?: string;
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
      if (!data.title?.trim()) {
        return NextResponse.json(
          { success: false, error: 'Title is required' },
          { status: 400 }
        );
      }

      // Create the request
      const request = new CustomizedServiceRequest({
        partnerId,
        roomName,
        residentEmail: guest.guestEmail || '',
        title: data.title.trim(),
        description: data.description?.trim() || undefined,
        status: 'new',
      });

      await request.save();

      return NextResponse.json(
        {
          success: true,
          message: 'Customized service request created successfully',
          data: { request: request.toJSON() },
        },
        { status: 201 }
      );
    } catch (error) {
      return handleApiError(error, 'Failed to create customized service request');
    }
  }
}