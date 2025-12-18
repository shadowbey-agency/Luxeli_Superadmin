import { NextRequest } from 'next/server';
import { PartnerController } from '@/controllers/PartnerController';
import { withSuperAdminAuth } from '@/lib/middleware';

// GET /api/superadmin/clients/stats - Get client statistics for dashboard
export const GET = withSuperAdminAuth(async (request: NextRequest) => {
  return await PartnerController.getClientStats();
});











