import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import LaundryRequest, { ILaundryRequest } from '@/models/laundary/laundaryRequest';
import { handleApiError } from '@/lib/middleware';

export class LaundryRequestController {

  /**
   * Get all laundry requests with pagination and filtering
   */
  static async getRequests(query: {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    priority?: string;
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
          { residentialName: { $regex: query.search, $options: 'i' } },
          { service: { $regex: query.search, $options: 'i' } },
          { notes: { $regex: query.search, $options: 'i' } },
          { 'assigne.name': { $regex: query.search, $options: 'i' } },
        ];
      }

      if (query.status) filter.status = query.status;
      if (query.priority) filter.priority = query.priority;
      if (query.roomName) filter.roomName = query.roomName;
      if (query.service) filter.services = { $in: [query.service] }; // match any of the services

      const items = await LaundryRequest.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await LaundryRequest.countDocuments(filter);

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
      return handleApiError(error, 'Failed to get laundry requests');
    }
  }

  /**
   * Get a single laundry request by ID
   */
  static async getRequestById(requestId: string) {
    try {
      await connectDB();

      const request = await LaundryRequest.findById(requestId).lean();
      if (!request) {
        return NextResponse.json({ success: false, error: 'Laundry request not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: { request } });
    } catch (error) {
      return handleApiError(error, 'Failed to get laundry request');
    }
  }

  /**
   * Create a new laundry request
   */
  static async createRequest(data: {
    roomName: string;
    residentialName: string;
    services: string[];
    piece: number;
    pickup: Date;
    status?: "new" | "accepted" | "completed" | "no-show" | "canceled";
    priority?: "low" | "medium" | "urgent";
    notes?: string;
    assigne?: {
      name: string;
      staffId: string;
      profilePic?: string;
    };
  }) {
    try {
      await connectDB();

      // Validation
      if (!data.roomName || !data.residentialName || !data.services || !data.piece || !data.pickup) {
        return NextResponse.json({ success: false, error: 'Required fields missing' }, { status: 400 });
      }

      const request = new LaundryRequest({
        service: 'laundry',
        roomName: data.roomName.trim(),
        residentialName: data.residentialName.trim(),
        services: data.services,
        piece: data.piece,
        pickup: data.pickup,
        status: data.status || 'new',
        priority: data.priority || 'medium',
        notes: data.notes?.trim(),
        assigne: data.assigne,
      });

      await request.save();

      return NextResponse.json({ success: true, data: { request: request.toJSON() } }, { status: 201 });
    } catch (error) {
      return handleApiError(error, 'Failed to create laundry request');
    }
  }

  /**
   * Update a laundry request by ID
   */
  static async updateRequest(requestId: string, data: {
    roomName?: string;
    residentialName?: string;
    services?: string[];
    piece?: number;
    pickup?: Date;
    status?: "new" | "accepted" | "completed" | "no-show" | "canceled";
    priority?: "low" | "medium" | "urgent";
    notes?: string;
    assigne?: {
      name?: string;
      staffId?: string;
      profilePic?: string;
    };
  }) {
    try {
      await connectDB();

      const request = await LaundryRequest.findById(requestId);
      if (!request) return NextResponse.json({ success: false, error: 'Laundry request not found' }, { status: 404 });

      if (data.roomName !== undefined) request.roomName = data.roomName.trim();
      if (data.residentialName !== undefined) request.residentialName = data.residentialName.trim();
      if (data.services !== undefined) request.services = data.services;
      if (data.piece !== undefined) request.piece = data.piece;
      if (data.pickup !== undefined) request.pickup = data.pickup;
      if (data.status !== undefined) request.status = data.status;
      if (data.priority !== undefined) request.priority = data.priority;
      if (data.notes !== undefined) request.notes = data.notes?.trim();
      if (data.assigne !== undefined) {
        request.assigne = {
          name: data.assigne.name || request.assigne?.name || '',
          staffId: data.assigne.staffId || request.assigne?.staffId || '',
          profilePic: data.assigne.profilePic || request.assigne?.profilePic,
        };
      }

      await request.save();

      return NextResponse.json({ success: true, data: { request: request.toJSON() } });
    } catch (error) {
      return handleApiError(error, 'Failed to update laundry request');
    }
  }

  /**
   * Delete a laundry request by ID
   */
  static async deleteRequest(requestId: string) {
    try {
      await connectDB();

      const request = await LaundryRequest.findByIdAndDelete(requestId);
      if (!request) return NextResponse.json({ success: false, error: 'Laundry request not found' }, { status: 404 });

      return NextResponse.json({ success: true, message: 'Laundry request deleted successfully' });
    } catch (error) {
      return handleApiError(error, 'Failed to delete laundry request');
    }
  }

  /**
   * Update laundry request status
   */
  static async updateRequestStatus(requestId: string, status: "new" | "accepted" | "completed" | "no-show" | "canceled") {
    try {
      await connectDB();

      const request = await LaundryRequest.findByIdAndUpdate(
        requestId,
        { status },
        { new: true }
      );

      if (!request) {
        return NextResponse.json(
          { success: false, error: 'Laundry request not found' },
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
      return handleApiError(error, 'Failed to update laundry request status');
    }
  }

  /**
   * Assign staff to a laundry request
   */
  static async assignStaff(requestId: string, assigne: { name: string; staffId: string; profilePic?: string }) {
    try {
      await connectDB();

      const request = await LaundryRequest.findByIdAndUpdate(
        requestId,
        { 
          assigne,
          status: 'accepted' // Auto-update status to accepted when assigned
        },
        { new: true }
      );

      if (!request) return NextResponse.json({ success: false, error: 'Laundry request not found' }, { status: 404 });

      return NextResponse.json({ success: true, data: { request: request.toJSON() } });
    } catch (error) {
      return handleApiError(error, 'Failed to assign staff to laundry request');
    }
  }
}
