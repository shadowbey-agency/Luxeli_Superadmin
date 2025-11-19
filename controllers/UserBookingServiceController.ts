import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BookingSettings from '@/models/booking/BookingSettings';
import { handleApiError } from '@/lib/middleware';

export class UserBookingServiceController {
  /**
   * Get all published booking services for guests
   * GET /api/user/booking-services
   * Auth: Guest JWT
   */
  static async getBookingServices(query: {
    page?: string;
    limit?: string;
    search?: string;
    category?: string;
  }) {
    try {
      await connectDB();

      const page = parseInt(query.page || '1', 10);
      const limit = parseInt(query.limit || '20', 10);
      const skip = (page - 1) * limit;

      // Build filter object - only get published services
      const filter: any = {
        status: 'published'
      };
      
      if (query.search) {
        filter.$or = [
          { serviceName: { $regex: query.search, $options: 'i' } },
          { category: { $regex: query.search, $options: 'i' } },
          { serviceDescription: { $regex: query.search, $options: 'i' } },
          { serviceLocation: { $regex: query.search, $options: 'i' } },
        ];
      }

      if (query.category) {
        filter.category = query.category;
      }

      // Get items with pagination
      const items = await BookingSettings.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      // Get total count
      const total = await BookingSettings.countDocuments(filter);

      return NextResponse.json({
        success: true,
        data: {
          services: items,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to get booking services');
    }
  }
}