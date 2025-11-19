import { NextResponse } from 'next/server';
import connectDB from "@/lib/db";
import { BookingRequest } from "@/models/booking";
import { AuthenticatedRequest } from "@/lib/middleware";

// Helper function to validate ObjectId
const isValidObjectId = (id: string) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// GET /api/partner/booking-requests - Get all booking requests for a user
export const getBookingRequests = async (query: any = {}) => {
  try {
    await connectDB();
    
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter: any = {};
    
    // Add userId filter if provided
    if (query.userId) {
      filter.userId = query.userId;
    }
    
    // Add status filter if provided
    if (query.status) {
      filter.status = query.status;
    }
    
    // Add search filter if provided
    if (query.search) {
      filter.$or = [
        { serviceName: { $regex: query.search, $options: 'i' } },
        { serviceDescription: { $regex: query.search, $options: 'i' } },
      ];
    }
    
    // Add date range filters if provided
    if (query.startDate || query.endDate) {
      filter.bookingDate = {};
      if (query.startDate) {
        filter.bookingDate.$gte = new Date(query.startDate as string);
      }
      if (query.endDate) {
        filter.bookingDate.$lte = new Date(query.endDate as string);
      }
    }
    
    const total = await BookingRequest.countDocuments(filter);
    const bookingRequests = await BookingRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    return NextResponse.json({
      success: true,
      data: {
        bookingRequests,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    console.error('Get Booking Requests Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch booking requests' },
      { status: 500 }
    );
  }
};

// POST /api/partner/booking-requests - Create a new booking request
export const createBookingRequest = async (requestData: any) => {
  try {
    await connectDB();
    
    // Validate required fields
    const requiredFields = [
      'userId',
      'serviceId',
      'serviceName',
      'serviceImage',
      'serviceDescription',
      'price',
      'bookingDate',
      'timeSlot'
    ];
    
    for (const field of requiredFields) {
      if (!requestData[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Validate price
    if (typeof requestData.price !== 'number' || requestData.price < 0) {
      return NextResponse.json(
        { success: false, error: 'Price must be a non-negative number' },
        { status: 400 }
      );
    }
    
    // Validate date
    const bookingDate = new Date(requestData.bookingDate);
    if (isNaN(bookingDate.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid booking date' },
        { status: 400 }
      );
    }
    
    // Create the booking request
    // Normalize status value to match enum requirements
    let normalizedStatus = requestData.status || 'Pending';
    if (typeof normalizedStatus === 'string') {
      // Normalize common variations
      switch (normalizedStatus.toLowerCase()) {
        case 'pending':
          normalizedStatus = 'Pending';
          break;
        case 'confirmed':
          normalizedStatus = 'Confirmed';
          break;
        case 'cancelled':
        case 'canceled':
          normalizedStatus = 'Cancelled';
          break;
        case 'completed':
          normalizedStatus = 'Completed';
          break;
        default:
          // If it's not a recognized value, use default
          normalizedStatus = 'Pending';
      }
    } else {
      normalizedStatus = 'Pending';
    }
    
    const bookingRequestData: any = {
      userId: requestData.userId,
      serviceId: requestData.serviceId,
      serviceName: requestData.serviceName,
      serviceImage: requestData.serviceImage,
      serviceDescription: requestData.serviceDescription,
      price: requestData.price,
      bookingDate: bookingDate,
      timeSlot: requestData.timeSlot,
      customerNotes: requestData.customerNotes || '',
      status: normalizedStatus,
    };
    
    const newBookingRequest = new BookingRequest(bookingRequestData);
    const savedBookingRequest = await newBookingRequest.save();
    
    return NextResponse.json({
      success: true,
      data: savedBookingRequest,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create Booking Request Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create booking request' },
      { status: 500 }
    );
  }
};

// PUT /api/partner/booking-requests/:id - Update a booking request
export const updateBookingRequest = async (id: string, updateData: any) => {
  try {
    await connectDB();
    
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid booking request ID' },
        { status: 400 }
      );
    }
    
    // Remove fields that shouldn't be updated
    const { _id, userId, serviceId, createdAt, ...updateFields } = updateData;
    
    // Validate status if provided and normalize it
    if (updateFields.status) {
      // Normalize status value to match enum requirements
      let normalizedStatus = updateFields.status;
      let isValidStatus = true;
      
      if (typeof normalizedStatus === 'string') {
        // Normalize common variations
        switch (normalizedStatus.toLowerCase()) {
          case 'pending':
            normalizedStatus = 'Pending';
            break;
          case 'confirmed':
            normalizedStatus = 'Confirmed';
            break;
          case 'cancelled':
          case 'canceled':
            normalizedStatus = 'Cancelled';
            break;
          case 'completed':
            normalizedStatus = 'Completed';
            break;
          default:
            // If it's not a recognized value, mark as invalid
            isValidStatus = false;
        }
      } else {
        isValidStatus = false;
      }
      
      // If status is invalid, return error
      if (!isValidStatus) {
        return NextResponse.json(
          { success: false, error: 'Invalid status value' },
          { status: 400 }
        );
      }
      
      updateFields.status = normalizedStatus;
    }
    
    const updatedBookingRequest = await BookingRequest.findByIdAndUpdate(
      id,
      { ...updateFields, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!updatedBookingRequest) {
      return NextResponse.json(
        { success: false, error: 'Booking request not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: updatedBookingRequest,
    });
  } catch (error: any) {
    console.error('Update Booking Request Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update booking request' },
      { status: 500 }
    );
  }
};

// DELETE /api/partner/booking-requests/:id - Delete a booking request
export const deleteBookingRequest = async (id: string) => {
  try {
    await connectDB();
    
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid booking request ID' },
        { status: 400 }
      );
    }
    
    const deletedBookingRequest = await BookingRequest.findByIdAndDelete(id);
    
    if (!deletedBookingRequest) {
      return NextResponse.json(
        { success: false, error: 'Booking request not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Booking request deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete Booking Request Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete booking request' },
      { status: 500 }
    );
  }
};