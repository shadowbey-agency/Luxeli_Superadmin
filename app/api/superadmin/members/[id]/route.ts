import { NextRequest } from 'next/server';
import { MemberController } from '@/controllers/MemberController';
import { withSuperAdminAuth } from '@/lib/middleware';

interface RouteParams {
  params: {
    id: string;
  };
}

export const GET = withSuperAdminAuth(async (request: NextRequest) => {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();
  if (!id) {
    return Response.json({ error: 'ID parameter is required' }, { status: 400 });
  }
  return await MemberController.getMemberById(id);
});

export const PUT = withSuperAdminAuth(async (request: NextRequest) => {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    if (!id) {
      return Response.json({ error: 'ID parameter is required' }, { status: 400 });
    }

    const body = await request.json();
    const {
      name,
      email,
      phone,
      username,
      password,
      permissions,
      status,
      currentPassword,
      newPassword,
    } = body;

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return Response.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      }
    }

    // Validate password strength if provided
    if (password && password.length < 6) {
      return Response.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Validate permissions if provided
    const validPermissions = ['dashboard', 'partner', 'subscription', 'billingFinance', 'support', 'team', 'settings'];
    if (permissions && Array.isArray(permissions)) {
      const invalidPermissions = permissions.filter(p => !validPermissions.includes(p));
      if (invalidPermissions.length > 0) {
        return Response.json(
          { error: `Invalid permissions: ${invalidPermissions.join(', ')}` },
          { status: 400 }
        );
      }
    }

    // Validate status if provided
    if (status && !['active', 'disable'].includes(status)) {
      return Response.json(
        { error: 'Invalid status. Must be "active" or "disable"' },
        { status: 400 }
      );
    }

    // Handle password change if provided
    if (currentPassword && newPassword) {
      return await MemberController.changeMemberPassword(id, {
        currentPassword,
        newPassword,
      });
    }

    // Handle regular account update
    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.toLowerCase().trim();
    if (phone) updateData.phone = phone.trim();
    if (username) updateData.username = username.trim();
    if (password) updateData.password = password;
    if (permissions) updateData.permissions = permissions;
    if (status) updateData.status = status;

    return await MemberController.updateMember(id, updateData);
  } catch (error) {
    console.error('Update Member API Error:', error);
    return Response.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
});

export const DELETE = withSuperAdminAuth(async (request: NextRequest) => {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();
  if (!id) {
    return Response.json({ error: 'ID parameter is required' }, { status: 400 });
  }
  return await MemberController.deleteMember(id);
});
