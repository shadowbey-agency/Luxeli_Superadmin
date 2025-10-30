import { NextRequest } from 'next/server';
import { SuperAdminController } from '@/controllers/SuperAdminController';
import { withSuperAdminAuth } from '@/lib/middleware';

export const GET = withSuperAdminAuth(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const query = {
    page: searchParams.get('page') || undefined,
    limit: searchParams.get('limit') || undefined,
    search: searchParams.get('search') || undefined,
  };

  return await SuperAdminController.getSuperAdmins(query);
});

export const POST = withSuperAdminAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      phoneNumber,
      password,
      profileImage,
    } = body;

    // Validate required fields
    if (!fullName || !email || !phoneNumber || !password) {
      return Response.json(
        { error: 'fullName, email, phoneNumber, and password are required' },
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

    // Validate phone number format (basic validation)
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,20}$/;
    const cleanPhone = phoneNumber.replace(/\s/g, '').replace(/[\(\)\-]/g, '');
    if (!phoneRegex.test(phoneNumber) || cleanPhone.length < 7 || cleanPhone.length > 15) {
      return Response.json(
        { error: 'Invalid phone number format. Please enter a valid phone number (7-15 digits)' },
        { status: 400 }
      );
    }

    // Validate full name
    if (fullName.trim().length < 2) {
      return Response.json(
        { error: 'Full name must be at least 2 characters long' },
        { status: 400 }
      );
    }

    return await SuperAdminController.createSuperAdmin({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phoneNumber: phoneNumber.trim(),
      password,
      profileImage: profileImage || undefined,
    });
  } catch (error) {
    console.error('Create SuperAdmin API Error:', error);
    return Response.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
});


