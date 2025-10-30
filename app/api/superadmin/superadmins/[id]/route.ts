import { NextRequest } from 'next/server';
import { SuperAdminController } from '@/controllers/SuperAdminController';
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
  return await SuperAdminController.getSuperAdminById(id);
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
      fullName,
      email,
      phoneNumber,
      profileImage,
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

    // Validate phone number format if provided
    if (phoneNumber) {
      // More flexible phone validation - accepts various formats
      const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,20}$/;
      const cleanPhone = phoneNumber.replace(/\s/g, '').replace(/[\(\)\-]/g, '');
      if (!phoneRegex.test(phoneNumber) || cleanPhone.length < 7 || cleanPhone.length > 15) {
        return Response.json(
          { error: 'Invalid phone number format. Please enter a valid phone number (7-15 digits)' },
          { status: 400 }
        );
      }
    }

    // Validate full name if provided
    if (fullName && fullName.trim().length < 2) {
      return Response.json(
        { error: 'Full name must be at least 2 characters long' },
        { status: 400 }
      );
    }

    // Handle password change if provided
    if (currentPassword && newPassword) {
      return await SuperAdminController.changeSuperAdminPassword(id, {
        currentPassword,
        newPassword,
      });
    }

    // Handle regular account update
    const updateData: any = {};
    if (fullName) updateData.fullName = fullName.trim();
    if (email) updateData.email = email.toLowerCase().trim();
    if (phoneNumber) updateData.phoneNumber = phoneNumber.trim();
    if (profileImage !== undefined) updateData.profileImage = profileImage;

    return await SuperAdminController.updateSuperAdmin(id, updateData);
  } catch (error) {
    console.error('Update SuperAdmin API Error:', error);
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
  return await SuperAdminController.deleteSuperAdmin(id);
});


