import { NextRequest } from 'next/server';
import { TicketController } from '@/controllers/partner/TicketController';
import { withAuth } from '@/lib/middleware';

export const GET = withAuth(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const query = {
    page: searchParams.get('page') || undefined,
    limit: searchParams.get('limit') || undefined,
    search: searchParams.get('search') || undefined,
    status: searchParams.get('status') || undefined,
    priority: searchParams.get('priority') || undefined,
  };

  return await TicketController.getTickets(query);
});

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const {
      title,
      description,
      priority,
      image,
      status,
      assignee,
    } = body;

    // Validate required fields
    if (!title || !description) {
      return Response.json(
        { success: false, error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Validate priority if provided
    if (priority && !['low', 'medium', 'urgent'].includes(priority)) {
      return Response.json(
        { success: false, error: 'Priority must be either "low", "medium", or "urgent"' },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status && !['open', 'new', 'reopened', 'pending', 'resolved', 'canceled'].includes(status)) {
      return Response.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      );
    }

    return await TicketController.createTicket({
      title: title.trim(),
      description: description.trim(),
      priority: priority || 'low',
      image: image || undefined,
      status: status || 'open',
      assignee: assignee || undefined,
    });
  } catch (error) {
    console.error('Create Ticket API Error:', error);
    return Response.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
});

















