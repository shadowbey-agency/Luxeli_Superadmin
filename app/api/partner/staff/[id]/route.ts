import { NextRequest, NextResponse } from 'next/server';
import { StaffController } from '@/controllers/partner/StaffController';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

export const GET = withAuth(async (request: AuthenticatedRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) => {
  let id: string;
  if (context?.params) {
    const params = await Promise.resolve(context.params);
    id = params.id as string;
  } else {
    // Fallback: extract from URL
    const url = new URL(request.url);
    const segments = url.pathname.split('/');
    id = segments[segments.length - 1];
  }
  return await StaffController.getStaffById(id);
});

export const PUT = withAuth(async (request: AuthenticatedRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) => {
  try {
    // Extract id from params (handle both sync and async params)
    let id: string;
    if (context?.params) {
      const params = await Promise.resolve(context.params);
      id = params.id as string;
    } else {
      // Fallback: extract from URL
      const url = new URL(request.url);
      const segments = url.pathname.split('/');
      id = segments[segments.length - 1];
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Staff ID is required' },
        { status: 400 }
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

    console.log('Update Staff API - ID:', id);
    console.log('Update Staff API - Body:', { staffName, email, phoneNumber, role, username, hasPassword: !!password, status });

    // Check if this is a status-only update
    const isStatusOnlyUpdate = status !== undefined && !staffName && !email && !phoneNumber && !role && !username && !password && !staffImage;
    
    // Check if this is a password-only update
    const isPasswordOnlyUpdate = password !== undefined && !staffName && !email && !phoneNumber && !role && !username && !status && !staffImage;

    // Validate password if provided (for both password-only and regular updates)
    if (password && password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }
    
    // For password-only updates, update only password (old password will be replaced)
    if (isPasswordOnlyUpdate) {
      return await StaffController.updateStaff(id, {
        password,
      });
    }

    // Validate status if provided
    if (status && !['active', 'disabled'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Status must be either "active" or "disabled"' },
        { status: 400 }
      );
    }

    // Validate required fields for staff update (only if not a status-only or password-only update)
    if (!isStatusOnlyUpdate && !isPasswordOnlyUpdate && (!staffName || !email || !phoneNumber || !role)) {
      return NextResponse.json(
        { success: false, error: 'staffName, email, phoneNumber, and role are required' },
        { status: 400 }
      );
    }

    // For status-only updates, use the dedicated method
    if (isStatusOnlyUpdate) {
      return await StaffController.updateStaffStatus(id, status as "active" | "disabled");
    }

    const result = await StaffController.updateStaff(id, {
      staffName,
      email,
      phoneNumber,
      role,
      staffImage,
      username,
      password,
      status,
    });

    return result;
  } catch (error: any) {
    console.error('Update Staff API Error:', error);
    console.error('Error stack:', error?.stack);
    
    // Return more specific error information
    const errorMessage = error?.message || 'Failed to update staff';
    const statusCode = error?.status || 500;
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: statusCode }
    );
  }
});

export const DELETE = withAuth(async (request: AuthenticatedRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) => {
  let id: string;
  if (context?.params) {
    const params = await Promise.resolve(context.params);
    id = params.id as string;
  } else {
    // Fallback: extract from URL
    const url = new URL(request.url);
    const segments = url.pathname.split('/');
    id = segments[segments.length - 1];
  }
  return await StaffController.deleteStaff(id);
});



