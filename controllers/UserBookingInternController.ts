import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { BookingInternRequest } from '@/models/booking/BookingInternRequest';
import Guest from '@/models/Guest';
import { handleApiError } from '@/lib/middleware';

export class UserBookingInternController {
  /**
   * Get guest's own booking intern requests
   * GET /api/user/booking-intern-requests
   * Auth: Guest JWT
   */
  static async getMyRequests(
    userId: string,
    partnerId: string,
    query: {
      page?: string;
      limit?: string;
      status?: string;
      category?: string;
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

      // Build filter - include requests that match the partnerId and guest's email
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

      if (query.category) {
        filter.category = query.category;
      }

      // Fetch requests
      const requests = await BookingInternRequest.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await BookingInternRequest.countDocuments(filter);

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
      return handleApiError(error, 'Failed to fetch booking intern requests');
    }
  }

  /**
   * Create a new booking intern request
   * POST /api/user/booking-intern-requests
   * Auth: Guest JWT
   */
  static async createRequest(
    userId: string,
    partnerId: string,
    roomId: string,
    roomName: string,
    data: {
      category: "spa/clubs" | "restaurant";
      reservation: {
        date: string;
        time: string;
      };
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
      if (!data.category || !['spa/clubs', 'restaurant'].includes(data.category)) {
        return NextResponse.json(
          { success: false, error: 'Category must be either "spa/clubs" or "restaurant"' },
          { status: 400 }
        );
      }

      if (!data.reservation?.date || !data.reservation?.time) {
        return NextResponse.json(
          { success: false, error: 'Reservation date and time are required' },
          { status: 400 }
        );
      }

      // Create the request
      const request = new BookingInternRequest({
        partnerId,
        roomName,
        residentEmail: guest.guestEmail || '',
        category: data.category,
        reservation: {
          date: data.reservation.date,
          time: data.reservation.time,
        },
        notes: data.notes?.trim() || undefined,
        status: 'new',
      });

      await request.save();

      return NextResponse.json(
        {
          success: true,
          message: 'Booking intern request created successfully',
          data: { request: request.toJSON() },
        },
        { status: 201 }
      );
    } catch (error) {
      return handleApiError(error, 'Failed to create booking intern request');
    }
  }
}