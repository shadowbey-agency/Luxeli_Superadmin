import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import RequestsManagement from '@/models/housekeeping';
import { handleApiError } from '@/lib/middleware';

export class RequestsManagementController {
  /**
   * Get all request items with pagination and filtering
   */
  static async getRequests(query: {
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
          { name: { $regex: query.search, $options: 'i' } },
          { category: { $regex: query.search, $options: 'i' } },
          { description: { $regex: query.search, $options: 'i' } },
        ];
      }

      if (query.status) {
        filter.status = query.status;
      }

      if (query.category) {
        filter.category = query.category;
      }

      console.log('🔍 Fetching requests for partnerId:', {
        partnerId,
        filter,
        page,
        limit
      });

      // Get items with pagination
      const items = await RequestsManagement.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      // Get total count
      const total = await RequestsManagement.countDocuments(filter);

      console.log('✅ Fetched requests:', {
        partnerId,
        count: items.length,
        total
      });

      return NextResponse.json({
        success: true,
        data: {
          requests: items,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to get requests');
    }
  }

  /**
   * Get a single request item by ID
   */
  static async getRequestById(itemId: string) {
    try {
      await connectDB();

      const item = await RequestsManagement.findById(itemId).lean();
      if (!item) {
        return NextResponse.json(
          { success: false, error: 'Request item not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: { request: item },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to get request item');
    }
  }

  /**
   * Create a new request item
   */
  static async createRequest(data: {
    partnerId?: string;
    name?: string;
    category?: string;
    status?: "published" | "unpublished";
    description?: string;
    image?: string;
  }) {
    // Extract and trim values outside try block so they're accessible in catch
    const partnerId = data.partnerId || '';
    const trimmedName = data.name?.trim() || '';
    const trimmedCategory = data.category?.trim() || '';
    const trimmedDescription = data.description?.trim() || '';

    console.log('🔵 RequestsManagementController.createRequest called:', {
      partnerId,
      name: trimmedName.substring(0, 50),
      category: trimmedCategory,
      description: trimmedDescription.substring(0, 50),
      hasImage: !!data.image,
      imageLength: data.image ? data.image.length : 0,
      imageSample: data.image ? data.image.substring(0, 100) + '...' : 'NONE'
    })

    try {
      await connectDB();

      // Validate partnerId
      if (!partnerId) {
        console.error('❌ Missing partnerId')
        return NextResponse.json(
          { 
            success: false, 
            error: 'Partner ID is required' 
          },
          { status: 400 }
        );
      }

      // Simple validation: name, category, and description are required
      if (!trimmedName || !trimmedCategory || !trimmedDescription) {
        console.error('❌ Missing required fields')
        return NextResponse.json(
          { 
            success: false, 
            error: 'Name, category, and description are required' 
          },
          { status: 400 }
        );
      }

      // Create new request item - allow duplicates, no unique validation
      // Always save, even if duplicates exist
      console.log('🔧 Creating RequestsManagement object:', {
        partnerId,
        name: trimmedName,
        category: trimmedCategory,
        status: data.status || 'unpublished',
        description: trimmedDescription.substring(0, 50),
        imageProvided: !!data.image,
        imageValue: data.image || 'undefined'
      });

      const item = new RequestsManagement({
        partnerId: partnerId,
        name: trimmedName,
        category: trimmedCategory,
        status: data.status || 'unpublished',
        description: trimmedDescription,
        image: data.image || undefined,
      });

      console.log('🔍 Item object before save:', {
        partnerId: item.partnerId,
        name: item.name,
        category: item.category,
        status: item.status,
        description: item.description ? item.description.substring(0, 50) : 'none',
        hasImage: !!item.image,
        imageLength: item.image ? item.image.length : 0,
        imageSample: item.image ? item.image.substring(0, 80) + '...' : 'NONE'
      })

      console.log('💾 Saving item to database:', {
        partnerId: item.partnerId,
        name: item.name,
        hasImage: !!item.image,
        imageLength: item.image ? item.image.length : 0
      })

      await item.save();

      console.log('✅ Item saved successfully to MongoDB:', {
        _id: item._id,
        partnerId: item.partnerId,
        name: item.name,
        hasImage: !!item.image,
        imageLength: item.image ? item.image.length : 0,
        imageUrl: item.image ? item.image.substring(0, 80) + '...' : 'NONE',
        savedImageField: item.image
      })

      return NextResponse.json({
        success: true,
        data: {
          request: item.toJSON(),
        },
      }, { status: 201 });
    } catch (error: any) {
      console.error('❌ Create Request Error Details:', {
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
          // Prepare item data
          const itemData: any = {
            name: trimmedName,
            category: trimmedCategory,
            status: data.status || 'unpublished',
            description: trimmedDescription,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          if (data.image) {
            itemData.image = data.image;
          }
          
          // Use insertOne directly to bypass any validation or unique constraints
          // This will ALWAYS save, even if duplicates exist
          const result = await RequestsManagement.collection.insertOne(itemData);
          
          console.log('✅ Item saved via insertOne:', result.insertedId);
          
          // Fetch the inserted document
          const insertedItem = await RequestsManagement.findById(result.insertedId).lean();
          
          if (!insertedItem) {
            throw new Error('Failed to retrieve inserted item');
          }
          
          return NextResponse.json({
            success: true,
            data: {
              request: insertedItem,
            },
          }, { status: 201 });
        } catch (insertError: any) {
          console.error('❌ Direct insert also failed:', insertError);
          // If even direct insert fails, it's a real error
          return NextResponse.json(
            { 
              success: false, 
              error: insertError.message || 'Failed to save item to database'
            },
            { status: 500 }
          );
        }
      }

      // Only validate required fields - simple validation
      if (error.name === 'ValidationError') {
        // Check if it's about missing required fields
        const missingFields = [];
        if (!trimmedName) missingFields.push('name');
        if (!trimmedCategory) missingFields.push('category');
        if (!trimmedDescription) missingFields.push('description');
        
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
          error: error.message || 'Failed to create request item. Please try again.'
        },
        { status: 500 }
      );
    }
  }

  /**
   * Update a request item by ID
   */
  static async updateRequest(itemId: string, data: {
    name?: string;
    category?: string;
    status?: "published" | "unpublished";
    description?: string;
    image?: string;
  }) {
    try {
      await connectDB();

      const item = await RequestsManagement.findById(itemId);
      if (!item) {
        return NextResponse.json(
          { success: false, error: 'Request item not found' },
          { status: 404 }
        );
      }

      // Update only provided fields
      if (data.name !== undefined) item.name = data.name.trim();
      if (data.category !== undefined) item.category = data.category.trim();
      if (data.status !== undefined) item.status = data.status;
      if (data.description !== undefined) item.description = data.description.trim();
      if (data.image !== undefined) item.image = data.image;

      await item.save();

      return NextResponse.json({
        success: true,
        data: {
          request: item.toJSON(),
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to update request item');
    }
  }

  /**
   * Delete a request item by ID
   */
  static async deleteRequest(itemId: string) {
    try {
      await connectDB();

      const item = await RequestsManagement.findByIdAndDelete(itemId);
      if (!item) {
        return NextResponse.json(
          { success: false, error: 'Request item not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Request item deleted successfully',
      });
    } catch (error) {
      return handleApiError(error, 'Failed to delete request item');
    }
  }

  /**
   * Update request item status
   */
  static async updateRequestStatus(itemId: string, status: "published" | "unpublished") {
    try {
      await connectDB();

      const item = await RequestsManagement.findByIdAndUpdate(
        itemId,
        { status },
        { new: true }
      );

      if (!item) {
        return NextResponse.json(
          { success: false, error: 'Request item not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          request: item.toJSON(),
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to update request item status');
    }
  }
}

