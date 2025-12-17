import { NextRequest } from 'next/server';
import { PartnerController } from '@/controllers/PartnerController';
import { withSuperAdminAuth } from '@/lib/middleware';

export const GET = withSuperAdminAuth(async (request: NextRequest) => {
  return await PartnerController.getPartnerServicesStats();
});









