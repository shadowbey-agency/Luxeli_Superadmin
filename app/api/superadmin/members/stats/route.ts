import { NextRequest } from 'next/server';
import { MemberController } from '@/controllers/MemberController';
import { withSuperAdminAuth } from '@/lib/middleware';

export const GET = withSuperAdminAuth(async (request: NextRequest) => {
  return await MemberController.getMemberStats();
});



























