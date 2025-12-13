import { NextRequest } from 'next/server';
import { TicketController } from '@/controllers/partner/TicketController';
import { withSuperAdminAuth } from '@/lib/middleware';

// GET /api/superadmin/tickets/stats - Get ticket statistics for dashboard
export const GET = withSuperAdminAuth(async (request: NextRequest) => {
  return await TicketController.getTicketStats();
});





