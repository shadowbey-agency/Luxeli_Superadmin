import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest, getPartnerId } from '@/lib/middleware';
import connectDB from '@/lib/db';
import { HousekeepingItem } from '@/models/housekeeping';

// GET /api/partner/housekeeping-items - Get all active housekeeping items for partner
export const GET = withAuth(async (request: AuthenticatedRequest) => {
  try {
    await connectDB();
    
    const partnerId = getPartnerId(request);
    if (!partnerId) {
      return NextResponse.json(
        { success: false, error: 'Partner ID not found' },
        { status: 401 }
      );
    }

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;
    
    // Build filter object - always filter by partnerId and active status
    const filter: any = { 
      partnerId,
      isActive: true
    };
    
    if (category && category !== 'All') {
      filter.category = category;
    }

    // Get items with pagination
    const items = await HousekeepingItem.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const total = await HousekeepingItem.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: {
        items: items.map(item => ({
          id: item._id,
          title: item.title,
          description: item.description,
          imageUrl: item.imageUrl,
          category: item.category,
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
});

// POST /api/partner/housekeeping-items - Create a new housekeeping item
export const POST = withAuth(async (request: AuthenticatedRequest) => {
  try {
    await connectDB();
    
    const partnerId = getPartnerId(request);
    if (!partnerId) {
      return NextResponse.json(
        { success: false, error: 'Partner ID not found' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.description || !body.imageUrl || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Title, description, image URL, and category are required' },
        { status: 400 }
      );
    }

    // Create new item
    const item = new HousekeepingItem({
      partnerId,
      title: body.title.trim(),
      description: body.description.trim(),
      imageUrl: body.imageUrl.trim(),
      category: body.category,
      isActive: body.isActive !== undefined ? body.isActive : true,
    });

    await item.save();

    return NextResponse.json({
      success: true,
      data: {
        item: {
          id: item._id,
          title: item.title,
          description: item.description,
          imageUrl: item.imageUrl,
          category: item.category,
          isActive: item.isActive,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating housekeeping item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create housekeeping item' },
      { status: 500 }
    );
  }
});