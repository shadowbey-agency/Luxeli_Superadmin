import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { RequestsManagement } from '@/models/housekeeping';

// GET /api/requests-management - Get all published request items for guests (no auth required)
export const GET = async (request: NextRequest) => {
  try {
    await connectDB();

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;
    
    // Filter for published items only
    const filter: any = { 
      status: "published"
    };

    // Get items with pagination
    const items = await RequestsManagement.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('name category description image createdAt')
      .lean();

    // Get total count
    const total = await RequestsManagement.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: {
        items: items.map(item => ({
          id: item._id,
          title: item.name,
          category: item.category,
          description: item.description,
          image: item.image,
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
    console.error('Error fetching requests management items:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch request items' },
      { status: 500 }
    );
  }
};