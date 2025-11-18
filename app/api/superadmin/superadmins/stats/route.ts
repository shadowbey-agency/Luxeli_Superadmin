import { NextRequest } from 'next/server';
import { SuperAdminController } from '@/controllers/SuperAdminController';
import { withSuperAdminAuth } from '@/lib/middleware';

export const GET = withSuperAdminAuth(async (request: NextRequest) => {
  return await SuperAdminController.getSuperAdminStats();
});






















