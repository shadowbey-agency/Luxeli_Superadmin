import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BookingRequestWithUser from '@/models/booking/BookingRequestWithUser';
import Guest from '@/models/Guest';
import Room from '@/models/Room';
import { handleApiError } from '@/lib/middleware';

export class UserBookingController {
  /**
   * Create booking request from guest (Flutter app)
   * POST /api/bookings/requests
   * Auth: Guest JWT
   */
  static async createRequest(
    userId: string,
    partnerId: string,
    roomId: string,
    data: {
      serviceId: string;
      serviceName: string;
      serviceImage: string;
      serviceDescription: string;
      price: number;
      bookingDate: string | Date; // Accept both string and Date
      timeSlot: string;
      customerNotes?: string; // Make this optional
    }
  ) {
    try {
      await connectDB();

      // Log the incoming data for debugging
      console.log('Booking Request Data:', JSON.stringify(data, null, 2));

      // Validate required fields
      if (!data.serviceId || !data.serviceName || !data.bookingDate || !data.timeSlot) {
        return NextResponse.json(
          { success: false, error: 'serviceId, serviceName, bookingDate, and timeSlot are required fields' },
          { status: 400 }
        );
      }

      // Convert bookingDate string to Date object if it's a string
      let bookingDate: Date;
      if (typeof data.bookingDate === 'string') {
        bookingDate = new Date(data.bookingDate);
        // Validate that the date is valid
        if (isNaN(bookingDate.getTime())) {
          return NextResponse.json(
            { success: false, error: 'Invalid bookingDate format. Must be a valid ISO date string.' },
            { status: 400 }
          );
        }
      } else {
        bookingDate = data.bookingDate;
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

      // Create booking request
      const request = new BookingRequestWithUser({
        userId,
        serviceId: data.serviceId,
        serviceName: data.serviceName,
        serviceImage: data.serviceImage,
        serviceDescription: data.serviceDescription,
        price: data.price,
        bookingDate: bookingDate, // Use the converted Date object
        timeSlot: data.timeSlot,
        customerNotes: data.customerNotes?.trim() || '', // Handle undefined case
        status: 'Pending',
      });

      await request.save();

      return NextResponse.json(
        {
          success: true,
          message: 'Booking request created successfully',
          data: { request: request.toJSON() },
        },
        { status: 201 }
      );
    } catch (error) {
      console.error('Create Booking Request Error:', error);
      return handleApiError(error, 'Failed to create booking request');
    }
  }

  /**
   * Get guest's own booking requests
   * GET /api/bookings/requests/my
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
        userId,
      };

      if (query.status) {
        filter.status = query.status;
      }

      // Fetch requests
      const requests = await BookingRequestWithUser.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await BookingRequestWithUser.countDocuments(filter);

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
      return handleApiError(error, 'Failed to fetch booking requests');
    }
  }

  /**
   * Get single request details
   * GET /api/bookings/requests/:id
   * Auth: Guest JWT
   */
  static async getRequestById(
    userId: string,
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
      const request = await BookingRequestWithUser.findById(requestId).lean();
      if (!request) {
        return NextResponse.json(
          { success: false, error: 'Request not found' },
          { status: 404 }
        );
      }

      // Verify request belongs to this guest
      if ((request as any).userId !== userId) {
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
   * PATCH /api/bookings/requests/:id/cancel
   * Auth: Guest JWT
   */
  static async cancelRequest(
    userId: string,
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
      const request = await BookingRequestWithUser.findById(requestId);
      if (!request) {
        return NextResponse.json(
          { success: false, error: 'Request not found' },
          { status: 404 }
        );
      }

      // Verify request belongs to this guest
      if ((request as any).userId !== userId) {
        return NextResponse.json(
          { success: false, error: 'You do not have permission to cancel this request' },
          { status: 403 }
        );
      }

      // Check if request can be canceled
      if (request.status === 'Completed') {
        return NextResponse.json(
          { success: false, error: 'Cannot cancel a completed request' },
          { status: 400 }
        );
      }

      if (request.status === 'Cancelled') {
        return NextResponse.json(
          { success: false, error: 'Request is already canceled' },
          { status: 400 }
        );
      }

      // Update status to canceled
      request.status = 'Cancelled';
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