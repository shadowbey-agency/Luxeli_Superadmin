import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Restaurant from '@/models/room-delivery/restaurants';
import { handleApiError } from '@/lib/middleware';

export class RestaurantController {
  /**
   * Get all restaurants with pagination and filtering by partnerId
   */
  static async getRestaurants(query: {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
  }, partnerId: string) {
    try {
      await connectDB();

      const page = parseInt(query.page || '1', 10);
      const limit = parseInt(query.limit || '20', 10);
      const skip = (page - 1) * limit;

      const filter: any = { partnerId };
      
      if (query.search) {
        filter.$or = [
          { restaurantName: { $regex: query.search, $options: 'i' } },
        ];
      }

      if (query.status) {
        filter.status = query.status;
      }

      const [restaurants, total] = await Promise.all([
        Restaurant.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Restaurant.countDocuments(filter),
      ]);

      return NextResponse.json({
        success: true,
        data: {
          restaurants,
          pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to get restaurants');
    }
  }

  /**
   * Get a single restaurant by ID
   */
  static async getRestaurantById(restaurantId: string) {
    try {
      await connectDB();
      const restaurant = await Restaurant.findById(restaurantId).lean();
      
      if (!restaurant) {
        return NextResponse.json(
          { success: false, error: 'Restaurant not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: { restaurant } });
    } catch (error) {
      return handleApiError(error, 'Failed to get restaurant');
    }
  }

  /**
   * Create a new restaurant
   */
  static async createRestaurant(data: {
    partnerId: string;
    restaurantName?: string;
    status?: "open" | "closed";
    startWork?: string;
    endWork?: string;
    restaurantImage?: string;
    items?: Array<{
      itemName: string;
      status?: "published" | "unpublished";
      category: string;
      itemPrice: number;
      itemDescription: string;
      itemImage?: string;
    }>;
  }) {
    try {
      await connectDB();

      const restaurantName = data.restaurantName?.trim() || '';
      const startWork = data.startWork?.trim() || '';
      const endWork = data.endWork?.trim() || '';

      // Validate required fields
      if (!restaurantName || !startWork || !endWork) {
        return NextResponse.json(
          { success: false, error: 'Restaurant name, start work time, and end work time are required' },
          { status: 400 }
        );
      }

      // Validate items if provided
      if (data.items && Array.isArray(data.items)) {
        for (const item of data.items) {
          if (!item.itemName?.trim() || !item.category?.trim() || !item.itemDescription?.trim()) {
            return NextResponse.json(
              { success: false, error: 'Item name, category, and description are required for all items' },
              { status: 400 }
            );
          }
          if (typeof item.itemPrice !== 'number' || item.itemPrice < 0) {
            return NextResponse.json(
              { success: false, error: 'Item price must be a valid positive number' },
              { status: 400 }
            );
          }
        }
      }

      // Create and save restaurant
      const restaurant = new Restaurant({
        partnerId: data.partnerId,
        restaurantName,
        status: data.status || 'open',
        startWork,
        endWork,
        restaurantImage: data.restaurantImage,
        items: data.items || [],
      });

      await restaurant.save();

      return NextResponse.json({
        success: true,
        data: { restaurant: restaurant.toJSON() },
      }, { status: 201 });
    } catch (error: any) {
      // Handle duplicate errors - use insertOne directly
      if (error.code === 11000 || error.message?.toLowerCase().includes('duplicate')) {
        try {
          const restaurantData = {
            partnerId: data.partnerId,
            restaurantName: data.restaurantName?.trim() || '',
            status: data.status || 'open',
            startWork: data.startWork?.trim() || '',
            endWork: data.endWork?.trim() || '',
            restaurantImage: data.restaurantImage,
            items: data.items || [],
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          const result = await Restaurant.collection.insertOne(restaurantData);
          const insertedRestaurant = await Restaurant.findById(result.insertedId).lean();

          return NextResponse.json({
            success: true,
            data: { restaurant: insertedRestaurant },
          }, { status: 201 });
        } catch (insertError: any) {
          return NextResponse.json(
            { success: false, error: insertError.message || 'Failed to save restaurant' },
            { status: 500 }
          );
        }
      }

      // Handle validation errors
      if (error.name === 'ValidationError') {
        return NextResponse.json(
          { success: false, error: error.message || 'Validation error' },
          { status: 400 }
        );
      }

      return handleApiError(error, 'Failed to create restaurant');
    }
  }

  /**
   * Update a restaurant by ID
   */
  static async updateRestaurant(restaurantId: string, partnerId: string, data: {
    restaurantName?: string;
    status?: "open" | "closed";
    startWork?: string;
    endWork?: string;
    restaurantImage?: string;
  }) {
    try {
      await connectDB();
      const restaurant = await Restaurant.findOne({ _id: restaurantId, partnerId });
      
      if (!restaurant) {
        return NextResponse.json(
          { success: false, error: 'Restaurant not found' },
          { status: 404 }
        );
      }

      // Update fields
      if (data.restaurantName !== undefined) restaurant.restaurantName = data.restaurantName.trim();
      if (data.status !== undefined) restaurant.status = data.status;
      if (data.startWork !== undefined) restaurant.startWork = data.startWork.trim();
      if (data.endWork !== undefined) restaurant.endWork = data.endWork.trim();
      if (data.restaurantImage !== undefined) restaurant.restaurantImage = data.restaurantImage;

      await restaurant.save();

      return NextResponse.json({
        success: true,
        data: { restaurant: restaurant.toJSON() },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to update restaurant');
    }
  }

  /**
   * Delete a restaurant by ID
   */
  static async deleteRestaurant(restaurantId: string, partnerId: string) {
    try {
      await connectDB();
      const restaurant = await Restaurant.findOneAndDelete({ _id: restaurantId, partnerId });
      
      if (!restaurant) {
        return NextResponse.json(
          { success: false, error: 'Restaurant not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Restaurant deleted successfully',
      });
    } catch (error) {
      return handleApiError(error, 'Failed to delete restaurant');
    }
  }

  /**
   * Update restaurant status (open/closed)
   */
  static async updateRestaurantStatus(restaurantId: string, partnerId: string, status: "open" | "closed") {
    try {
      await connectDB();
      const restaurant = await Restaurant.findOne({ _id: restaurantId, partnerId });
      
      if (!restaurant) {
        return NextResponse.json(
          { success: false, error: 'Restaurant not found' },
          { status: 404 }
        );
      }

      restaurant.status = status;
      await restaurant.save();

      return NextResponse.json({
        success: true,
        data: { restaurant: restaurant.toJSON() },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to update restaurant status');
    }
  }

  /**
   * Add item to restaurant
   */
  static async addItem(restaurantId: string, partnerId: string, itemData: {
    itemName: string;
    status?: "published" | "unpublished";
    category: string;
    itemPrice: number;
    itemDescription: string;
    itemImage?: string;
  }) {
    try {
      await connectDB();
      const restaurant = await Restaurant.findOne({ _id: restaurantId, partnerId });
      
      if (!restaurant) {
        return NextResponse.json(
          { success: false, error: 'Restaurant not found' },
          { status: 404 }
        );
      }

      // Validate item data
      if (!itemData.itemName?.trim() || !itemData.category?.trim() || !itemData.itemDescription?.trim()) {
        return NextResponse.json(
          { success: false, error: 'Item name, category, and description are required' },
          { status: 400 }
        );
      }

      if (typeof itemData.itemPrice !== 'number' || itemData.itemPrice < 0) {
        return NextResponse.json(
          { success: false, error: 'Item price must be a valid positive number' },
          { status: 400 }
        );
      }

      // Add item to restaurant
      restaurant.items.push({
        itemName: itemData.itemName.trim(),
        status: itemData.status || 'unpublished',
        category: itemData.category.trim(),
        itemPrice: itemData.itemPrice,
        itemDescription: itemData.itemDescription.trim(),
        itemImage: itemData.itemImage,
      });

      await restaurant.save();

      return NextResponse.json({
        success: true,
        data: { restaurant: restaurant.toJSON() },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to add item');
    }
  }

  /**
   * Update item in restaurant
   */
  static async updateItem(restaurantId: string, partnerId: string, itemIndex: number, itemData: {
    itemName?: string;
    status?: "published" | "unpublished";
    category?: string;
    itemPrice?: number;
    itemDescription?: string;
    itemImage?: string;
  }) {
    try {
      await connectDB();
      const restaurant = await Restaurant.findOne({ _id: restaurantId, partnerId });
      
      if (!restaurant) {
        return NextResponse.json(
          { success: false, error: 'Restaurant not found' },
          { status: 404 }
        );
      }

      if (itemIndex < 0 || itemIndex >= restaurant.items.length) {
        return NextResponse.json(
          { success: false, error: 'Item not found' },
          { status: 404 }
        );
      }

      // Update item fields
      const item = restaurant.items[itemIndex];
      if (itemData.itemName !== undefined) item.itemName = itemData.itemName.trim();
      if (itemData.status !== undefined) item.status = itemData.status;
      if (itemData.category !== undefined) item.category = itemData.category.trim();
      if (itemData.itemPrice !== undefined) {
        if (typeof itemData.itemPrice !== 'number' || itemData.itemPrice < 0) {
          return NextResponse.json(
            { success: false, error: 'Item price must be a valid positive number' },
            { status: 400 }
          );
        }
        item.itemPrice = itemData.itemPrice;
      }
      if (itemData.itemDescription !== undefined) item.itemDescription = itemData.itemDescription.trim();
      if (itemData.itemImage !== undefined) item.itemImage = itemData.itemImage;

      await restaurant.save();

      return NextResponse.json({
        success: true,
        data: { restaurant: restaurant.toJSON() },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to update item');
    }
  }

  /**
   * Delete item from restaurant
   */
  static async deleteItem(restaurantId: string, partnerId: string, itemIndex: number) {
    try {
      await connectDB();
      const restaurant = await Restaurant.findOne({ _id: restaurantId, partnerId });
      
      if (!restaurant) {
        return NextResponse.json(
          { success: false, error: 'Restaurant not found' },
          { status: 404 }
        );
      }

      if (itemIndex < 0 || itemIndex >= restaurant.items.length) {
        return NextResponse.json(
          { success: false, error: 'Item not found' },
          { status: 404 }
        );
      }

      restaurant.items.splice(itemIndex, 1);
      await restaurant.save();

      return NextResponse.json({
        success: true,
        data: { restaurant: restaurant.toJSON() },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to delete item');
    }
  }

  /**
   * Update item status in restaurant
   */
  static async updateItemStatus(restaurantId: string, partnerId: string, itemIndex: number, status: "published" | "unpublished") {
    try {
      await connectDB();
      const restaurant = await Restaurant.findOne({ _id: restaurantId, partnerId });
      
      if (!restaurant) {
        return NextResponse.json(
          { success: false, error: 'Restaurant not found' },
          { status: 404 }
        );
      }

      if (itemIndex < 0 || itemIndex >= restaurant.items.length) {
        return NextResponse.json(
          { success: false, error: 'Item not found' },
          { status: 404 }
        );
      }

      restaurant.items[itemIndex].status = status;
      await restaurant.save();

      return NextResponse.json({
        success: true,
        data: { restaurant: restaurant.toJSON() },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to update item status');
    }
  }
}


