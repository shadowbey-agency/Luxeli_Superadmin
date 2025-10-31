import { NextRequest } from 'next/server';
import { SuperAdminController } from '@/controllers/SuperAdminController';
import { withSuperAdminAuth } from '@/lib/middleware';

interface RouteParams {
  params: {
    id: string;
  };
}

export const POST = withSuperAdminAuth(async (request: NextRequest, { params }: RouteParams) => {
  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return Response.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    // Validate new password strength
    if (newPassword.length < 6) {
      return Response.json(
        { error: 'New password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if new password is different from current
    if (currentPassword === newPassword) {
      return Response.json(
        { error: 'New password must be different from current password' },
        { status: 400 }
      );
    }

    return await SuperAdminController.changeSuperAdminPassword(params.id, {
      currentPassword,
      newPassword,
    });
  } catch (error) {
    console.error('Change SuperAdmin Password API Error:', error);
    return Response.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
});





