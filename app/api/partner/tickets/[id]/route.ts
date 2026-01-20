import { NextRequest } from 'next/server';
import { TicketController } from '@/controllers/partner/TicketController';
import { withAuth, getPartnerId } from '@/lib/middleware';

export const DELETE = withAuth(async (request: NextRequest) => {
  try {
    const pathSegments = request.nextUrl.pathname.split('/');
    const ticketId = pathSegments[pathSegments.length - 1];

    if (!ticketId) {
      return Response.json(
        { success: false, error: 'Ticket ID is required' },
        { status: 400 }
      );
    }

    const partnerId = getPartnerId(request as any);
    if (!partnerId) {
      return Response.json(
        { success: false, error: 'Partner ID not found' },
        { status: 401 }
      );
    }

    return await TicketController.deleteTicket(ticketId, partnerId);
  } catch (error) {
    console.error('Delete Ticket API Error:', error);
    return Response.json(
      { success: false, error: 'Failed to delete ticket' },
      { status: 500 }
    );
  }
});
