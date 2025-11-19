import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { HousekeepingRequest } from '@/models/housekeeping';

// GET /api/housekeeping-items - Get all item needed requests with images
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;
    
    // Filter for item needed requests only
    const filter: any = { 
      type: "item needed",
      itemImage: { $exists: true, $ne: null }
    };

    // Get items with pagination
    const items: any[] = await HousekeepingRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('requestedFor notes itemImage itemQuantity deliveryDetail createdAt')
      .lean();

    // Get total count
    const total = await HousekeepingRequest.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: {
        items: items.map((item: any) => ({
          id: item._id,
          title: item.requestedFor,
          description: item.notes,
          image: item.itemImage,
          quantity: item.itemQuantity,
          deliveryWindow: item.deliveryDetail?.deliveryWindow,
          createdAt: item.createdAt
        })),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching housekeeping items:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch housekeeping items' },
      { status: 500 }
    );
  }
}