import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Restaurant from '@/models/room-delivery/restaurants';
import { handleApiError } from '@/lib/middleware';

// GET /api/delivery/restaurants - Get all published restaurants for guests (no auth required)
export const GET = async (request: NextRequest) => {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const query = {
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
      search: searchParams.get('search') || undefined,
      status: searchParams.get('status') || undefined,
    };

    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '20', 10);
    const skip = (page - 1) * limit;

    // Only show open restaurants with at least one published item
    const filter: any = {
      status: 'open'
    };
    
    // Check if restaurant has at least one published item
    filter['items.0'] = { $exists: true }; // Has at least one item
    filter['items'] = {
      $elemMatch: {
        status: 'published'
      }
    };

    if (query.search) {
      filter.$or = [
        { restaurantName: { $regex: query.search, $options: 'i' } },
      ];
    }

    if (query.status) {
      filter.status = query.status;
    }

    const [restaurants, total] = await Promise.all([
      Restaurant.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Restaurant.countDocuments(filter),
    ]);

    // Filter out unpublished items from each restaurant
    const filteredRestaurants = restaurants.map(restaurant => {
      const publishedItems = restaurant.items.filter(item => item.status === 'published');
      return {
        ...restaurant,
        items: publishedItems
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        restaurants: filteredRestaurants,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    return handleApiError(error, 'Failed to get restaurants');
  }
};