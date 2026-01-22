import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, TokenPayload } from '@/lib/auth';

export interface AuthenticatedRequest extends NextRequest {
  user?: TokenPayload;
}

/**
 * Middleware to protect API routes
 * Supports both handlers with and without params
 */
export function withAuth(
  handler: (
    req: AuthenticatedRequest,
    context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }
  ) => Promise<NextResponse>
) {
  return async (
    req: NextRequest,
    context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }
  ): Promise<NextResponse> => {
    try {
      const authHeader = req.headers.get('authorization');
      const token = authHeader?.replace('Bearer ', '');

      if (!token) {
        return NextResponse.json(
          { error: 'Access token required' },
          { status: 401 }
        );
      }

      const payload = verifyToken(token);
      if (!payload) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }

      // Add user info to request
      const authenticatedReq = req as AuthenticatedRequest;
      authenticatedReq.user = payload;

      // Pass through params if provided
      return handler(authenticatedReq, context);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }
  };
}

/**
 * Middleware to check if user is superadmin
 */
export function withSuperAdminAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const authHeader = req.headers.get('authorization');
      const token = authHeader?.replace('Bearer ', '');

      if (!token) {
        return NextResponse.json(
          { error: 'Access token required' },
          { status: 401 }
        );
      }

      const payload = verifyToken(token);
      if (!payload) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }

      if (payload.role !== 'superadmin' && payload.role !== 'member') {
        return NextResponse.json(
          { error: 'Superadmin or Member access required' },
          { status: 403 }
        );
      }

      // Add user info to request
      const authenticatedReq = req as AuthenticatedRequest;
      authenticatedReq.user = payload;

      return handler(authenticatedReq);
    } catch (error) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }
  };
}

/**
 * Get partner ID from authenticated request
 * For partner users, userId in token is the partnerId
 * For partner members and staff, partnerId is in the token payload
 */
export function getPartnerId(request: AuthenticatedRequest): string | null {
  const user = request.user;
  if (!user) return null;

  // If user is a partner, userId is the partnerId
  if (user.role === 'partner' || user.userType === 'partner') {
    return user.userId;
  }

  // If user is a partner member or staff, partnerId is in the token
  if (user.userType === 'partnermember' || user.userType === 'partnerstaff') {
    return user.partnerId || null;
  }

  // If user is a guest, partnerId is in the token
  if (user.userType === 'guest') {
    return user.partnerId || null;
  }

  return null;
}

/**
 * Middleware to protect guest/user API routes
 * Verifies guest JWT token
 */
export function withGuestAuth(
  handler: (
    req: AuthenticatedRequest,
    context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }
  ) => Promise<NextResponse>
) {
  return async (
    req: NextRequest,
    context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }
  ): Promise<NextResponse> => {
    try {
      const authHeader = req.headers.get('authorization');
      const token = authHeader?.replace('Bearer ', '');

      if (!token) {
        return NextResponse.json(
          { error: 'Access token required' },
          { status: 401 }
        );
      }

      const payload = verifyToken(token);
      if (!payload) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }

      // Verify user type is guest
      if (payload.userType !== 'guest') {
        return NextResponse.json(
          { error: 'Guest access required' },
          { status: 403 }
        );
      }

      // Verify guest has required fields
      if (!payload.partnerId || !payload.roomId) {
        return NextResponse.json(
          { error: 'Invalid guest token. Missing partner or room information.' },
          { status: 401 }
        );
      }

      // Add user info to request
      const authenticatedReq = req as AuthenticatedRequest;
      authenticatedReq.user = payload;

      // Pass through params if provided
      return handler(authenticatedReq, context);
    } catch (error) {
      console.error('Guest auth middleware error:', error);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }
  };
}

/**
 * Error handler utility
 */
export function handleApiError(error: any, message: string = 'Internal server error') {
  console.error('API Error:', error);

  if (error.name === 'ValidationError') {
    // Extract validation error messages
    const errorMessages = error.errors
      ? Object.values(error.errors).map((e: any) => e.message).join(', ')
      : error.message || 'Validation error';
    return NextResponse.json(
      { success: false, error: errorMessages, details: error.errors },
      { status: 400 }
    );
  }

  if (error.name === 'CastError') {
    return NextResponse.json(
      { error: 'Invalid ID format' },
      { status: 400 }
    );
  }

  if (error.code === 11000) {
    return NextResponse.json(
      { error: 'Duplicate entry found' },
      { status: 409 }
    );
  }

  return NextResponse.json(
    { error: message },
    { status: 500 }
  );
}
