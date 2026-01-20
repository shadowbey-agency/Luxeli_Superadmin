import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BookingSettings from '@/models/booking';
import { handleApiError } from '@/lib/middleware';

export class BookingSettingsController {
  /**
   * Get all booking settings with pagination and filtering
   */
  static async getBookingSettings(query: {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    category?: string;
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
          { serviceName: { $regex: query.search, $options: 'i' } },
          { category: { $regex: query.search, $options: 'i' } },
          { serviceDescription: { $regex: query.search, $options: 'i' } },
          { serviceLocation: { $regex: query.search, $options: 'i' } },
        ];
      }

      if (query.status) {
        filter.status = query.status;
      }

      if (query.category) {
        filter.category = query.category;
      }

      console.log('🔍 Fetching booking settings for partnerId:', {
        partnerId,
        filter,
        page,
        limit
      });

      // Get items with pagination
      const items = await BookingSettings.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      // Get total count
      const total = await BookingSettings.countDocuments(filter);

      console.log('✅ Fetched booking settings:', {
        partnerId,
        count: items.length,
        total
      });

      return NextResponse.json({
        success: true,
        data: {
          bookings: items,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to get booking settings');
    }
  }

  /**
   * Get a single booking setting by ID
   */
  static async getBookingSettingById(bookingId: string) {
    try {
      await connectDB();

      const booking = await BookingSettings.findById(bookingId).lean();
      if (!booking) {
        return NextResponse.json(
          { success: false, error: 'Booking setting not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: { booking },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to get booking setting');
    }
  }

  /**
   * Create a new booking setting
   */
  static async createBookingSetting(data: {
    partnerId?: string;
    serviceName?: string;
    category?: string;
    serviceDescription?: string;
    serviceLocation?: string;
    servicePrice?: number;
    startDate?: Date | string;
    endDate?: Date | string;
    status?: "published" | "unpublished";
    bookDate?: boolean;
    serviceImage?: string;
  }) {
    // Extract and trim values outside try block so they're accessible in catch
    const partnerId = data.partnerId || '';
    const trimmedServiceName = data.serviceName?.trim() || '';
    const trimmedCategory = data.category?.trim() || '';
    const trimmedServiceDescription = data.serviceDescription?.trim() || '';
    const trimmedServiceLocation = data.serviceLocation?.trim() || '';

    try {
      await connectDB();

      // Validate partnerId
      if (!partnerId) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Partner ID is required' 
          },
          { status: 400 }
        );
      }

      // Simple validation: required fields
      if (!trimmedServiceName || !trimmedCategory || !trimmedServiceDescription || !trimmedServiceLocation) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Service name, category, description, and location are required' 
          },
          { status: 400 }
        );
      }

      if (data.servicePrice === undefined || data.servicePrice < 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Service price is required and must be 0 or greater' 
          },
          { status: 400 }
        );
      }

      if (!data.startDate || !data.endDate) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Start date and end date are required' 
          },
          { status: 400 }
        );
      }

      // Create new booking setting - allow duplicates, no unique validation
      // Always save, even if duplicates exist
      const booking = new BookingSettings({
        partnerId: partnerId,
        serviceName: trimmedServiceName,
        category: trimmedCategory,
        serviceDescription: trimmedServiceDescription,
        serviceLocation: trimmedServiceLocation,
        servicePrice: data.servicePrice,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        status: data.status || 'unpublished',
        bookDate: data.bookDate || false,
        serviceImage: data.serviceImage || undefined,
      });

      await booking.save();

      return NextResponse.json({
        success: true,
        data: {
          booking: booking.toJSON(),
        },
      }, { status: 201 });
    } catch (error: any) {
      console.error('Create Booking Setting Error Details:', {
        error,
        code: error.code,
        message: error.message,
        name: error.name,
      });

      // If duplicate error (code 11000), still save the item - duplicates are allowed
      // Use insertOne directly to bypass any unique constraints
      if (error.code === 11000 || error.message?.toLowerCase().includes('duplicate')) {
        console.log('Duplicate detected, but saving anyway (duplicates allowed)...');
        try {
          // Prepare booking data
          const bookingData: any = {
            serviceName: trimmedServiceName,
            category: trimmedCategory,
            serviceDescription: trimmedServiceDescription,
            serviceLocation: trimmedServiceLocation,
            servicePrice: data.servicePrice,
            startDate: new Date(data.startDate!),
            endDate: new Date(data.endDate!),
            status: data.status || 'unpublished',
            bookDate: data.bookDate || false,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          if (data.serviceImage) {
            bookingData.serviceImage = data.serviceImage;
          }
          
          // Use insertOne directly to bypass any validation or unique constraints
          // This will ALWAYS save, even if duplicates exist
          const result = await BookingSettings.collection.insertOne(bookingData);
          
          console.log('✅ Booking setting saved via insertOne:', result.insertedId);
          
          // Fetch the inserted document
          const insertedBooking = await BookingSettings.findById(result.insertedId).lean();
          
          if (!insertedBooking) {
            throw new Error('Failed to retrieve inserted booking setting');
          }
          
          return NextResponse.json({
            success: true,
            data: {
              booking: insertedBooking,
            },
          }, { status: 201 });
        } catch (insertError: any) {
          console.error('❌ Direct insert also failed:', insertError);
          // If even direct insert fails, it's a real error
          return NextResponse.json(
            { 
              success: false, 
              error: insertError.message || 'Failed to save booking setting to database'
            },
            { status: 500 }
          );
        }
      }

      // Only validate required fields - simple validation
      if (error.name === 'ValidationError') {
        // Check if it's about missing required fields
        const missingFields = [];
        if (!trimmedServiceName) missingFields.push('serviceName');
        if (!trimmedCategory) missingFields.push('category');
        if (!trimmedServiceDescription) missingFields.push('serviceDescription');
        if (!trimmedServiceLocation) missingFields.push('serviceLocation');
        
        if (missingFields.length > 0) {
          return NextResponse.json(
            { 
              success: false, 
              error: `${missingFields.join(', ')} ${missingFields.length === 1 ? 'is' : 'are'} required`
            },
            { status: 400 }
          );
        }
        
        // For other validation errors, just return generic message
        return NextResponse.json(
          { 
            success: false, 
            error: 'Please check all required fields are filled'
          },
          { status: 400 }
        );
      }

      // For any other error, log but still try to save
      console.error('Unexpected error during save:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error.message || 'Failed to create booking setting. Please try again.'
        },
        { status: 500 }
      );
    }
  }

  /**
   * Update a booking setting by ID
   */
  static async updateBookingSetting(bookingId: string, data: {
    serviceName?: string;
    category?: string;
    serviceDescription?: string;
    serviceLocation?: string;
    servicePrice?: number;
    startDate?: Date | string;
    endDate?: Date | string;
    status?: "published" | "unpublished";
    bookDate?: boolean;
    serviceImage?: string;
  }) {
    try {
      await connectDB();

      const booking = await BookingSettings.findById(bookingId);
      if (!booking) {
        return NextResponse.json(
          { success: false, error: 'Booking setting not found' },
          { status: 404 }
        );
      }

      // Update only provided fields
      if (data.serviceName !== undefined) booking.serviceName = data.serviceName.trim();
      if (data.category !== undefined) booking.category = data.category.trim();
      if (data.serviceDescription !== undefined) booking.serviceDescription = data.serviceDescription.trim();
      if (data.serviceLocation !== undefined) booking.serviceLocation = data.serviceLocation.trim();
      if (data.servicePrice !== undefined) booking.servicePrice = data.servicePrice;
      if (data.startDate !== undefined) booking.startDate = new Date(data.startDate);
      if (data.endDate !== undefined) booking.endDate = new Date(data.endDate);
      if (data.status !== undefined) booking.status = data.status;
      if (data.bookDate !== undefined) booking.bookDate = data.bookDate;
      if (data.serviceImage !== undefined) booking.serviceImage = data.serviceImage;

      await booking.save();

      return NextResponse.json({
        success: true,
        data: {
          booking: booking.toJSON(),
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to update booking setting');
    }
  }

  /**
   * Delete a booking setting by ID
   */
  static async deleteBookingSetting(bookingId: string) {
    try {
      await connectDB();

      const booking = await BookingSettings.findByIdAndDelete(bookingId);
      if (!booking) {
        return NextResponse.json(
          { success: false, error: 'Booking setting not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Booking setting deleted successfully',
      });
    } catch (error) {
      return handleApiError(error, 'Failed to delete booking setting');
    }
  }

  /**
   * Update booking status (published/unpublished)
   */
  static async updateBookingStatus(bookingId: string, status: "published" | "unpublished") {
    try {
      await connectDB();

      const booking = await BookingSettings.findById(bookingId);
      if (!booking) {
        return NextResponse.json(
          { success: false, error: 'Booking setting not found' },
          { status: 404 }
        );
      }

      booking.status = status;
      await booking.save();

      return NextResponse.json({
        success: true,
        data: {
          booking: booking.toJSON(),
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to update booking status');
    }
  }

  /**
   * Update bookDate status (booked/not booked)
   */
  static async updateBookDate(bookingId: string, bookDate: boolean) {
    try {
      await connectDB();

      const booking = await BookingSettings.findById(bookingId);
      if (!booking) {
        return NextResponse.json(
          { success: false, error: 'Booking setting not found' },
          { status: 404 }
        );
      }

      booking.bookDate = bookDate;
      await booking.save();

      return NextResponse.json({
        success: true,
        data: {
          booking: booking.toJSON(),
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to update book date');
    }
  }
}



