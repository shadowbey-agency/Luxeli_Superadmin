import { NextRequest, NextResponse } from 'next/server';
import { RequestsManagementController } from '@/controllers/partner/housekeeping/RequestsManagementController';
import { withAuth, AuthenticatedRequest, getPartnerId } from '@/lib/middleware';

// GET /api/partner/requests-management - Get all request items
export const GET = withAuth(async (request: AuthenticatedRequest) => {
  const partnerId = getPartnerId(request);
  if (!partnerId) {
    return NextResponse.json(
      { success: false, error: 'Partner ID not found' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = {
    page: searchParams.get('page') || undefined,
    limit: searchParams.get('limit') || undefined,
    search: searchParams.get('search') || undefined,
    status: searchParams.get('status') || undefined,
    category: searchParams.get('category') || undefined,
  };

  return await RequestsManagementController.getRequests(query, partnerId);
});

// POST /api/partner/requests-management - Create new request item
export const POST = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const partnerId = getPartnerId(request);
    if (!partnerId) {
      return NextResponse.json(
        { success: false, error: 'Partner ID not found' },
        { status: 401 }
      );
    }

    console.log('📥 POST /api/partner/requests-management - Request received');
    console.log('Request headers:', {
      authorization: request.headers.get('authorization') ? 'Present' : 'Missing',
      contentType: request.headers.get('content-type'),
      partnerId: partnerId
    });

    const body = await request.json();
    console.log('📦 Request body received:', {
      name: body.name,
      category: body.category,
      status: body.status,
      description: body.description ? body.description.substring(0, 50) + '...' : 'none',
      imageProvided: !!body.image,
      imageType: typeof body.image,
      imageLength: body.image ? body.image.length : 0,
      imageUrlStart: body.image ? body.image.substring(0, 100) + '...' : 'none'
    });
    
    const {
      name,
      category,
      status,
      description,
      image,
    } = body;

    // Simple validation: name, category, and description are required
    if (!name?.trim() || !category?.trim() || !description?.trim()) {
      console.log('❌ Validation failed: Missing required fields');
      return NextResponse.json(
        { success: false, error: 'Name, category, and description are required' },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status && !['published', 'unpublished'].includes(status)) {
      console.log('❌ Validation failed: Invalid status');
      return NextResponse.json(
        { success: false, error: 'Status must be either "published" or "unpublished"' },
        { status: 400 }
      );
    }

    console.log('✅ Validation passed, calling controller...');
    console.log('🔧 Passing to controller:', {
      partnerId,
      hasImage: !!image,
      imageLength: image ? image.length : 0,
      imageUrl: image ? image.substring(0, 100) + '...' : 'undefined'
    });
    const result = await RequestsManagementController.createRequest({
      partnerId,
      name: name?.trim() || '',
      category: category?.trim() || '',
      status: status || 'unpublished',
      description: description?.trim() || '',
      image: image || undefined,
    });

    console.log('✅ Controller returned:', {
      status: result.status,
      hasData: !!result.body,
    });

    return result;
  } catch (error: any) {
    console.error('❌ Create Request Item API Error:', {
      error,
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    });
    return NextResponse.json(
      { success: false, error: error?.message || 'Invalid request body' },
      { status: 400 }
    );
  }
});

