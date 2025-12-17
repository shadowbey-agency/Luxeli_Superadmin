import { NextRequest } from 'next/server';
import { TicketController } from '@/controllers/partner/TicketController';
import { withSuperAdminAuth } from '@/lib/middleware';

// GET /api/superadmin/tickets - Get all tickets from all partners
export const GET = withSuperAdminAuth(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const query = {
    page: searchParams.get('page') || undefined,
    limit: searchParams.get('limit') || undefined,
    search: searchParams.get('search') || undefined,
    status: searchParams.get('status') || undefined,
    priority: searchParams.get('priority') || undefined,
  };

  return await TicketController.getAllTicketsForSuperAdmin(query);
});









