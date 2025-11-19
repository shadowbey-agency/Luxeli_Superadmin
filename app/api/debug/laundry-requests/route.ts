import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { LaundryRequest } from '@/models/laundary/laundaryRequest';
import { withSuperAdminAuth } from '@/lib/middleware';

/**
 * GET /api/debug/laundry-requests
 * Debug endpoint to list all laundry requests
 * Auth: Superadmin only
 */
export const GET = withSuperAdminAuth(async (request: NextRequest) => {
  try {
    await connectDB();

    // Fetch all laundry requests
    const requests = await LaundryRequest.find({}).sort({ createdAt: -1 }).limit(50).lean();
    
    // Count total requests
    const total = await LaundryRequest.countDocuments({});

    return NextResponse.json({
      success: true,
      data: {
        requests,
        total,
      },
    });
  } catch (error: any) {
    console.error('Debug Laundry Requests API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch requests' },
      { status: 500 }
    );
  }
});