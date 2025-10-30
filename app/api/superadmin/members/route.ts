import { NextRequest } from 'next/server';
import { MemberController } from '@/controllers/MemberController';
import { withSuperAdminAuth } from '@/lib/middleware';

export const GET = withSuperAdminAuth(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const query = {
    page: searchParams.get('page') || undefined,
    limit: searchParams.get('limit') || undefined,
    search: searchParams.get('search') || undefined,
    permissions: searchParams.get('permissions') || undefined,
  };

  return await MemberController.getMembers(query);
});

export const POST = withSuperAdminAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      username,
      password,
      permissions,
    } = body;

    // Validate required fields
    if (!name || !email || !phone || !username || !password) {
      return Response.json(
        { error: 'Name, email, phone, username, and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return Response.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Validate permissions if provided
    const validPermissions = ['dashboard', 'partners', 'support', 'services', 'billingFinance', 'team', 'settings'];
    if (permissions && Array.isArray(permissions)) {
      const invalidPermissions = permissions.filter(p => !validPermissions.includes(p));
      if (invalidPermissions.length > 0) {
        return Response.json(
          { error: `Invalid permissions: ${invalidPermissions.join(', ')}` },
          { status: 400 }
        );
      }
    }

    return await MemberController.createMember({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      username: username.trim(),
      password,
      permissions: permissions || [],
    });
  } catch (error) {
    console.error('Create Member API Error:', error);
    return Response.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
});
