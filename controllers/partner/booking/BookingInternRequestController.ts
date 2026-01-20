import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { BookingInternRequest } from '@/models/booking';
import { handleApiError } from '@/lib/middleware';

export class BookingInternRequestController {
  /**
   * Get all booking intern requests with pagination and filtering
   */
  static async getBookingInternRequests(query: {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    category?: string;
    residentEmail?: string;
    roomName?: string;
  }, partnerId: string) {
    try {
      await connectDB();

      const page = parseInt(query.page || '1', 10);
      const limit = parseInt(query.limit || '20', 10);
      const skip = (page - 1) * limit;

      // Build filter object - always include partnerId
      const filter: any = {
        partnerId: partnerId
      };
      
      if (query.search) {
        filter.$or = [
          { roomName: { $regex: query.search, $options: 'i' } },
          { residentEmail: { $regex: query.search, $options: 'i' } },
          { notes: { $regex: query.search, $options: 'i' } },
          { 'assignee.name': { $regex: query.search, $options: 'i' } },
        ];
      }

      if (query.status) {
        filter.status = query.status;
      }

      if (query.category) {
        filter.category = query.category;
      }

      if (query.residentEmail) {
        filter.residentEmail = query.residentEmail;
      }

      if (query.roomName) {
        filter.roomName = query.roomName;
      }

      console.log('🔍 Fetching booking intern requests for partnerId:', {
        partnerId,
        filter,
        page,
        limit
      });

      // Get items with pagination
      const items = await BookingInternRequest.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      // Get total count
      const total = await BookingInternRequest.countDocuments(filter);

      console.log('✅ Fetched booking intern requests:', {
        partnerId,
        count: items.length,
        total
      });

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
      return handleApiError(error, 'Failed to get booking intern requests');
    }
  }

  /**
   * Get a single booking intern request by ID
   */
  static async getBookingInternRequestById(requestId: string) {
    try {
      await connectDB();

      const request = await BookingInternRequest.findById(requestId).lean();
      if (!request) {
        return NextResponse.json(
          { success: false, error: 'Booking intern request not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: { request },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to get booking intern request');
    }
  }

  /**
   * Create a new booking intern request
   */
  static async createBookingInternRequest(data: {
    roomName: string;
    residentEmail: string;
    category: "spa/clubs" | "restaurant";
    status?: "new" | "accepted" | "completed" | "no-show" | "canceled";
    assignee?: {
      name: string;
      staffId: string;
      profilePic?: string;
    };
    reservation: {
      date: string;
      time: string;
    };
    notes?: string;
  }, partnerId: string) {
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

      if (!data.category || !['spa/clubs', 'restaurant'].includes(data.category)) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Category must be either "spa/clubs" or "restaurant"' 
          },
          { status: 400 }
        );
      }

      if (!data.reservation?.date || !data.reservation?.time) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Reservation date and time are required' 
          },
          { status: 400 }
        );
      }

      // Create new booking intern request
      const request = new BookingInternRequest({
        partnerId: partnerId,
        roomName: data.roomName.trim(),
        residentEmail: data.residentEmail.trim(),
        category: data.category,
        status: data.status || 'new',
        assignee: data.assignee || undefined,
        reservation: {
          date: data.reservation.date,
          time: data.reservation.time,
        },
        notes: data.notes?.trim() || undefined,
      });

      await request.save();

      return NextResponse.json({
        success: true,
        data: {
          request: request.toJSON(),
        },
      }, { status: 201 });
    } catch (error: any) {
      console.error('Create Booking Intern Request Error:', error);
      return handleApiError(error, 'Failed to create booking intern request');
    }
  }

  /**
   * Update a booking intern request by ID
   */
  static async updateBookingInternRequest(requestId: string, data: {
    roomName?: string;
    residentEmail?: string;
    category?: "spa/clubs" | "restaurant";
    status?: "new" | "accepted" | "completed" | "no-show" | "canceled";
    assignee?: {
      name: string;
      staffId: string;
      profilePic?: string;
    };
    reservation?: {
      date: string;
      time: string;
    };
    notes?: string;
  }) {
    try {
      await connectDB();

      const request = await BookingInternRequest.findById(requestId);
      if (!request) {
        return NextResponse.json(
          { success: false, error: 'Booking intern request not found' },
          { status: 404 }
        );
      }

      // Update only provided fields
      if (data.roomName !== undefined) request.roomName = data.roomName.trim();
      if (data.residentEmail !== undefined) request.residentEmail = data.residentEmail.trim();
      if (data.category !== undefined) {
        if (!['spa/clubs', 'restaurant'].includes(data.category)) {
          return NextResponse.json(
            { success: false, error: 'Category must be either "spa/clubs" or "restaurant"' },
            { status: 400 }
          );
        }
        request.category = data.category;
      }
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
      if (data.reservation !== undefined) {
        if (data.reservation.date) request.reservation.date = data.reservation.date;
        if (data.reservation.time) request.reservation.time = data.reservation.time;
      }
      if (data.notes !== undefined) request.notes = data.notes?.trim() || undefined;

      await request.save();

      return NextResponse.json({
        success: true,
        data: {
          request: request.toJSON(),
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to update booking intern request');
    }
  }

  /**
   * Delete a booking intern request by ID
   */
  static async deleteBookingInternRequest(requestId: string) {
    try {
      await connectDB();

      const request = await BookingInternRequest.findByIdAndDelete(requestId);
      if (!request) {
        return NextResponse.json(
          { success: false, error: 'Booking intern request not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Booking intern request deleted successfully',
      });
    } catch (error) {
      return handleApiError(error, 'Failed to delete booking intern request');
    }
  }

  /**
   * Update booking intern request status
   */
  static async updateBookingInternRequestStatus(
    requestId: string, 
    status: "new" | "accepted" | "completed" | "no-show" | "canceled"
  ) {
    try {
      await connectDB();

      const request = await BookingInternRequest.findById(requestId);
      if (!request) {
        return NextResponse.json(
          { success: false, error: 'Booking intern request not found' },
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
      return handleApiError(error, 'Failed to update booking intern request status');
    }
  }

  /**
   * Update booking intern request assignee
   */
  static async updateBookingInternRequestAssignee(
    requestId: string,
    assignee: {
      name: string;
      staffId: string;
      profilePic?: string;
    } | null
  ) {
    try {
      await connectDB();

      const request = await BookingInternRequest.findById(requestId);
      if (!request) {
        return NextResponse.json(
          { success: false, error: 'Booking intern request not found' },
          { status: 404 }
        );
      }

      // Update assignee
      request.assignee = assignee || undefined;
      
      // Auto-update status to 'accepted' when staff is assigned (if status is 'new')
      if (assignee && request.status === 'new') {
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
      return handleApiError(error, 'Failed to update booking intern request assignee');
    }
  }
}


