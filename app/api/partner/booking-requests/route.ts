import { NextRequest, NextResponse } from 'next/server';
import { getBookingRequests, createBookingRequest, updateBookingRequest, deleteBookingRequest } from '@/controllers/partner/booking/BookingRequestController';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

// GET /api/partner/booking-requests - Get all booking requests
export const GET = withAuth(async (request: AuthenticatedRequest) => {
  const { searchParams } = new URL(request.url);
  const query = {
    page: searchParams.get('page') || undefined,
    limit: searchParams.get('limit') || undefined,
    search: searchParams.get('search') || undefined,
    status: searchParams.get('status') || undefined,
    startDate: searchParams.get('startDate') || undefined,
    endDate: searchParams.get('endDate') || undefined,
    userId: searchParams.get('userId') || undefined, // Add userId to query
  };

  return await getBookingRequests(query);
});

// POST /api/partner/booking-requests - Create new booking request
export const POST = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const body = await request.json();
    
    return await createBookingRequest(body);
  } catch (error: any) {
    console.error('Create Booking Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Invalid request body' },
      { status: 400 }
    );
  }
});

// PUT /api/partner/booking-requests/:id - Update a booking request
export const PUT = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Booking request ID is required' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    return await updateBookingRequest(id, body);
  } catch (error: any) {
    console.error('Update Booking Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Invalid request body' },
      { status: 400 }
    );
  }
});

// DELETE /api/partner/booking-requests/:id - Delete a booking request
export const DELETE = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Booking request ID is required' },
        { status: 400 }
      );
    }
    
    return await deleteBookingRequest(id);
  } catch (error: any) {
    console.error('Delete Booking Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Invalid request' },
      { status: 400 }
    );
  }
});