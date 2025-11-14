import { NextRequest, NextResponse } from 'next/server';
import { GuestController } from '@/controllers/GuestController';

/**
 * POST /api/user/login-qr
 * 
 * Guest login endpoint using QR code JWT token
 * 
 * Request Body:
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 * 
 * Response Success (200):
 * {
 *   "success": true,
 *   "data": {
 *     "userId": "string",
 *     "partnerId": "string",
 *     "roomId": "string",
 *     "roomName": "string",
 *     "guestName": "string",
 *     "guestEmail": "string",
 *     "guestPhone": "string",
 *     "checkInDate": "ISO date",
 *     "checkOutDate": "ISO date",
 *     "token": "string (same token for storage)"
 *   }
 * }
 * 
 * @auth None (public endpoint - token validation in body)
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate token presence
    if (!body.token || typeof body.token !== 'string') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Token is required and must be a string' 
        },
        { status: 400 }
      );
    }

    // Validate token format (JWT has 3 parts separated by dots)
    const tokenParts = body.token.split('.');
    if (tokenParts.length !== 3) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid token format. Token must be a valid JWT.' 
        },
        { status: 400 }
      );
    }

    // Delegate to controller for business logic
    return await GuestController.loginWithQR(body.token);
  } catch (error: any) {
    console.error('Login QR API Error:', error);
    
    // Handle JSON parsing errors
    if (error.message?.includes('JSON')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid request body. Expected JSON with "token" field.' 
        },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { 
        success: false, 
        error: error?.message || 'Failed to process login request' 
      },
      { status: 500 }
    );
  }
}

