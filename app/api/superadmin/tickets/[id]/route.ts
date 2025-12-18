import { NextRequest, NextResponse } from 'next/server';
import { TicketController } from '@/controllers/partner/TicketController';
import { withAuth, AuthenticatedRequest, getPartnerId } from '@/lib/middleware';

// PUT /api/superadmin/tickets/[id] - Update ticket (supports both partner and superadmin)
export const PUT = withAuth(async (request: AuthenticatedRequest) => {
  try {
    // Extract ticket ID from URL
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(segment => segment);
    // URL format: /api/superadmin/tickets/[id]
    // pathSegments: ['api', 'superadmin', 'tickets', 'id']
    const ticketId = pathSegments[pathSegments.length - 1];

    if (!ticketId || ticketId === 'tickets') {
      return NextResponse.json(
        { success: false, error: 'Ticket ID is required' },
        { status: 400 }
      );
    }

    console.log('Extracted ticket ID from URL (PUT):', { 
      url: request.url, 
      pathname: url.pathname, 
      segments: pathSegments, 
      ticketId 
    });

    const body = await request.json();
    const {
      title,
      description,
      priority,
      image,
      status,
      assignee,
      markasticket,
    } = body;

    // Validate priority if provided
    if (priority && !['low', 'medium', 'urgent'].includes(priority)) {
      return NextResponse.json(
        { success: false, error: 'Priority must be either "low", "medium", or "urgent"' },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status && !['open', 'new', 'reopened', 'pending', 'resolved', 'canceled'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (priority !== undefined) updateData.priority = priority;
    if (image !== undefined) updateData.image = image;
    if (status !== undefined) updateData.status = status;
    if (assignee !== undefined) updateData.assignee = assignee;
    if (markasticket !== undefined) updateData.markasticket = markasticket;

    // Check if user is superadmin or partner
    const user = request.user;
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Check user role - superadmin can be role 'superadmin' or 'member', or userType 'superadmin' or 'member'
    const isSuperAdmin = user.role === 'superadmin' || 
                        user.role === 'member' || 
                        user.userType === 'superadmin' || 
                        user.userType === 'member';
    
    const partnerId = getPartnerId(request);

    // If not superadmin and no partnerId, deny access
    if (!isSuperAdmin && !partnerId) {
      return NextResponse.json(
        { success: false, error: 'Partner ID not found in token. Only superadmin or partner can update tickets.' },
        { status: 403 }
      );
    }

    console.log('Update ticket request:', {
      ticketId,
      isSuperAdmin,
      partnerId,
      userRole: user.role,
      userType: user.userType,
      updateData
    });

    const result = await TicketController.updateTicket(ticketId, updateData, isSuperAdmin ? null : partnerId);
    return result;
  } catch (error: any) {
    console.error('Update Ticket API Error:', error);
    const errorMessage = error?.message || error?.error || 'Invalid request body';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: error?.status || 400 }
    );
  }
});

// DELETE /api/superadmin/tickets/[id] - Delete ticket (supports both partner and superadmin)
export const DELETE = withAuth(async (request: AuthenticatedRequest) => {
  try {
    // Extract ticket ID from URL
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(segment => segment);
    // URL format: /api/superadmin/tickets/[id]
    // pathSegments: ['api', 'superadmin', 'tickets', 'id']
    const ticketId = pathSegments[pathSegments.length - 1];

    if (!ticketId || ticketId === 'tickets') {
      return NextResponse.json(
        { success: false, error: 'Ticket ID is required' },
        { status: 400 }
      );
    }

    console.log('Extracted ticket ID from URL (DELETE):', { 
      url: request.url, 
      pathname: url.pathname, 
      segments: pathSegments, 
      ticketId 
    });

    // Check if user is superadmin or partner
    const user = request.user;
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Check user role - superadmin can be role 'superadmin' or 'member', or userType 'superadmin' or 'member'
    const isSuperAdmin = user.role === 'superadmin' || 
                        user.role === 'member' || 
                        user.userType === 'superadmin' || 
                        user.userType === 'member';
    
    const partnerId = getPartnerId(request);

    // If not superadmin and no partnerId, deny access
    if (!isSuperAdmin && !partnerId) {
      return NextResponse.json(
        { success: false, error: 'Partner ID not found in token. Only superadmin or partner can delete tickets.' },
        { status: 403 }
      );
    }

    console.log('Delete ticket request:', {
      ticketId,
      isSuperAdmin,
      partnerId,
      userRole: user.role,
      userType: user.userType
    });

    const result = await TicketController.deleteTicket(ticketId, isSuperAdmin ? null : partnerId);
    return result;
  } catch (error: any) {
    console.error('Delete Ticket API Error:', error);
    const errorMessage = error?.message || error?.error || 'Failed to delete ticket';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: error?.status || 500 }
    );
  }
});

