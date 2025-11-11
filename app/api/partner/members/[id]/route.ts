import { NextRequest, NextResponse } from 'next/server';
import { PartnerMemberController } from '@/controllers/partner/PartnerMemberController';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

export const GET = withAuth(async (request: AuthenticatedRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) => {
  try {
    let id: string;
    if (context?.params) {
      const params = await Promise.resolve(context.params);
      id = params.id as string;
    } else {
      const url = new URL(request.url);
      const segments = url.pathname.split('/');
      id = segments[segments.length - 1];
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Member ID is required' },
        { status: 400 }
      );
    }

    return await PartnerMemberController.getPartnerMemberById(id);
  } catch (error: any) {
    console.error('Get Member API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to get member' },
      { status: 500 }
    );
  }
});

export const PUT = withAuth(async (request: AuthenticatedRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) => {
  try {
    let id: string;
    if (context?.params) {
      const params = await Promise.resolve(context.params);
      id = params.id as string;
    } else {
      const url = new URL(request.url);
      const segments = url.pathname.split('/');
      id = segments[segments.length - 1];
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Member ID is required' },
        { status: 400 }
      );
    }
    const body = await request.json();
    const {
      memberName,
      email,
      phoneNumber,
      memberImage,
      username,
      password,
      status,
      permissions,
    } = body;

    // Validate status if provided
    if (status && !['active', 'disable'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Status must be either "active" or "disable"' },
        { status: 400 }
      );
    }

    // Validate password if provided
    if (password && password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    return await PartnerMemberController.updatePartnerMember(id, {
      memberName,
      email,
      phoneNumber,
      memberImage,
      username,
      password,
      status,
      permissions,
    });
  } catch (error: any) {
    console.error('Update Partner Member API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Invalid request body' },
      { status: 400 }
    );
  }
});

export const DELETE = withAuth(async (request: AuthenticatedRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) => {
  try {
    let id: string;
    if (context?.params) {
      const params = await Promise.resolve(context.params);
      id = params.id as string;
    } else {
      const url = new URL(request.url);
      const segments = url.pathname.split('/');
      id = segments[segments.length - 1];
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Member ID is required' },
        { status: 400 }
      );
    }

    return await PartnerMemberController.deletePartnerMember(id);
  } catch (error: any) {
    console.error('Delete Member API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete member' },
      { status: 500 }
    );
  }
});



