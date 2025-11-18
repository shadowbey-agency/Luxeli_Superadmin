import { NextRequest, NextResponse } from 'next/server';
import { StaffController } from '@/controllers/partner/StaffController';
import { withAuth, AuthenticatedRequest, getPartnerId } from '@/lib/middleware';

export const GET = withAuth(async (request: AuthenticatedRequest) => {
  const { searchParams } = new URL(request.url);
  const query = {
    page: searchParams.get('page') || undefined,
    limit: searchParams.get('limit') || undefined,
    search: searchParams.get('search') || undefined,
    role: searchParams.get('role') || undefined,
    status: searchParams.get('status') || undefined,
  };

  return await StaffController.getStaff(query);
});

export const POST = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const partnerId = getPartnerId(request);
    if (!partnerId) {
      return NextResponse.json(
        { success: false, error: 'Partner ID is required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      staffName,
      email,
      phoneNumber,
      role,
      staffImage,
      username,
      password,
      status,
    } = body;

    // Validate required fields
    if (!staffName || !email || !phoneNumber || !role || !username || !password) {
      return NextResponse.json(
        { success: false, error: 'staffName, email, phoneNumber, role, username, and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status && !['active', 'disabled'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Status must be either "active" or "disabled"' },
        { status: 400 }
      );
    }

    return await StaffController.createStaff({
      partnerId,
      staffName: staffName.trim(),
      email: email.toLowerCase().trim(),
      phoneNumber: phoneNumber.trim(),
      role: role.trim(),
      staffImage: staffImage || '',
      username: username.trim(),
      password,
      status: status || 'active',
    });
  } catch (error) {
    console.error('Create Staff API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
});


















