import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Guest from '@/models/Guest';
import Room from '@/models/Room';
import RoomHistory from '@/models/RoomHistory';
import { verifyToken } from '@/lib/auth';
import { handleApiError } from '@/lib/middleware';
import QRCode from 'qrcode';

export class GuestController {
  /**
   * Assign a guest to a room and generate QR code
   * POST /api/partner/assign-room
   * Auth: Partner JWT
   */
  static async assignRoom(
    partnerId: string,
    data: {
      guestName: string;
      guestEmail?: string;
      guestPhone?: string;
      roomId: string;
      roomName: string;
      checkInDate?: Date;
      checkOutDate?: Date;
    }
  ) {
    try {
      await connectDB();

      // Validate required fields
      if (!data.guestName || !data.roomId || !data.roomName) {
        return NextResponse.json(
          { success: false, error: 'Guest name, roomId, and roomName are required' },
          { status: 400 }
        );
      }

      // Verify room exists and belongs to this partner
      const room = await Room.findById(data.roomId);
      if (!room) {
        return NextResponse.json(
          { success: false, error: 'Room not found' },
          { status: 404 }
        );
      }

      if (room.partnerId !== partnerId) {
        return NextResponse.json(
          { success: false, error: 'Room does not belong to your hotel' },
          { status: 403 }
        );
      }

      // Check if room is already assigned to an active guest
      const existingGuest = await Guest.findOne({
        roomId: data.roomId,
        isActive: true,
      });

      if (existingGuest) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Room is already assigned to an active guest. Please check them out first.' 
          },
          { status: 400 }
        );
      }

      // Create guest record
      const guest = new Guest({
        partnerId,
        roomId: data.roomId,
        roomName: data.roomName,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        isActive: true,
        checkInDate: data.checkInDate || new Date(),
        checkOutDate: data.checkOutDate,
      });

      await guest.save();

      // Update room status to full
      room.roomStatus = 'full';
      await room.save();

      // Generate QR code with only room name and room ID
      const qrCodeData = JSON.stringify({
        roomName: data.roomName,
        roomId: data.roomId,
      });

      // Generate QR code from room data
      const qrCodeDataURL = await QRCode.toDataURL(qrCodeData, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        width: 300,
        margin: 1,
      });

      return NextResponse.json(
        {
          success: true,
          data: {
            userId: guest._id.toString(),
            guestName: data.guestName,
            guestEmail: data.guestEmail,
            roomId: data.roomId,
            roomName: data.roomName,
            qrCode: qrCodeDataURL, // base64 QR code
          },
        },
        { status: 201 }
      );
    } catch (error) {
      return handleApiError(error, 'Failed to assign guest to room');
    }
  }

  /**
   * Login guest using QR code token
   * 
   * Validates the JWT token from QR code and returns guest profile
   * 
   * @param token - JWT token string scanned from QR code
   * @returns NextResponse with guest data or error
   * 
   * Validation Steps:
   * 1. Verify JWT signature and expiration
   * 2. Check token userType is 'guest'
   * 3. Fetch guest from database
   * 4. Verify guest is still active (not checked out)
   * 5. Verify room assignment matches token
   * 6. Return full guest profile with token
   */
  static async loginWithQR(token: string) {
    try {
      await connectDB();

      // Step 1: Verify and decode JWT token
      const payload = verifyToken(token);
      if (!payload) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid or expired QR code token. Please get a new QR code from the front desk.' 
          },
          { status: 401 }
        );
      }

      // Step 2: Verify this is a guest token (not partner/admin)
      if (payload.userType !== 'guest') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid token type. This QR code is not for guest access.' 
          },
          { status: 401 }
        );
      }

      // Step 3: Validate token contains required guest fields
      if (!payload.userId || !payload.partnerId || !payload.roomId) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid token structure. Missing required guest information.' 
          },
          { status: 401 }
        );
      }

      // Step 4: Fetch guest from database
      const guest = await Guest.findById(payload.userId);
      if (!guest) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Guest record not found. Please contact front desk.' 
          },
          { status: 404 }
        );
      }

      // Step 5: Check if guest is still active (not checked out)
      if (!guest.isActive) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'You have been checked out. This QR code is no longer valid.' 
          },
          { status: 403 }
        );
      }

      // Step 6: Verify room assignment hasn't changed
      if (guest.roomId !== payload.roomId) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Your room assignment has changed. Please get a new QR code from the front desk.' 
          },
          { status: 403 }
        );
      }

      // Step 7: Verify partner hasn't changed
      if (guest.partnerId !== payload.partnerId) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid hotel assignment. Please contact front desk.' 
          },
          { status: 403 }
        );
      }

      // Step 8: Return complete guest profile with token
      return NextResponse.json(
        {
          success: true,
          message: 'Login successful',
          data: {
            // Guest identifiers
            userId: guest._id.toString(),
            partnerId: guest.partnerId,
            roomId: guest.roomId,
            roomName: guest.roomName,
            
            // Guest information
            guestName: guest.guestName,
            guestEmail: guest.guestEmail || null,
            guestPhone: guest.guestPhone || null,
            
            // Stay information
            checkInDate: guest.checkInDate,
            checkOutDate: guest.checkOutDate || null,
            isActive: guest.isActive,
            
            // Token for future API calls
            token, // Same token to store in Flutter secure storage
          },
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Login with QR Error:', error);
      return handleApiError(error, 'Failed to login with QR code');
    }
  }

  /**
   * Check out guest and deactivate their access
   * POST /api/partner/checkout-guest
   * Auth: Partner JWT
   */
  static async checkoutGuest(partnerId: string, roomId: string) {
    try {
      await connectDB();

      // Find the active guest in this room
      const guest = await Guest.findOne({
        partnerId,
        roomId,
        isActive: true,
      });

      if (!guest) {
        return NextResponse.json(
          { success: false, error: 'No active guest found in this room' },
          { status: 404 }
        );
      }

      // Get room info before updating
      const room = await Room.findById(roomId);
      if (!room) {
        return NextResponse.json(
          { success: false, error: 'Room not found' },
          { status: 404 }
        );
      }

      // Format date and time for RoomHistory
      const formatTime = (date: Date | null | undefined): string | null => {
        if (!date) return null;
        const d = new Date(date);
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
      };

      const formatDate = (date: Date | null | undefined): Date | null => {
        if (!date) return null;
        const d = new Date(date);
        // Return date with time set to midnight for date-only comparison
        d.setHours(0, 0, 0, 0);
        return d;
      };

      const checkOutDateTime = new Date();
      const checkInDate = formatDate(guest.checkInDate);
      const checkInTime = formatTime(guest.checkInDate);
      const checkOutDate = formatDate(checkOutDateTime);
      const checkOutTime = formatTime(checkOutDateTime);

      // Deactivate guest
      guest.isActive = false;
      guest.checkOutDate = checkOutDateTime;
      await guest.save();

      // Create room history entry
      const roomHistory = new RoomHistory({
        partnerId,
        roomId: roomId,
        roomName: guest.roomName || room.roomName,
        resident: guest.guestName,
        checkInDate: checkInDate,
        checkInTime: checkInTime,
        checkOutDate: checkOutDate,
        checkOutTime: checkOutTime,
        unassignedAt: checkOutDateTime,
      });
      await roomHistory.save();

      // Update room status to empty
      room.roomStatus = 'empty';
      await room.save();

      return NextResponse.json({
        success: true,
        message: 'Guest checked out successfully',
        data: {
          guestId: guest._id.toString(),
          guestName: guest.guestName,
          checkOutDate: guest.checkOutDate,
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to checkout guest');
    }
  }

  /**
   * Get guest profile
   * GET /api/user/profile
   * Auth: Guest JWT
   */
  static async getProfile(userId: string) {
    try {
      await connectDB();

      const guest = await Guest.findById(userId);
      if (!guest) {
        return NextResponse.json(
          { success: false, error: 'Guest not found' },
          { status: 404 }
        );
      }

      if (!guest.isActive) {
        return NextResponse.json(
          { success: false, error: 'Guest has been checked out' },
          { status: 403 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          userId: guest._id.toString(),
          partnerId: guest.partnerId,
          roomId: guest.roomId,
          roomName: guest.roomName,
          guestName: guest.guestName,
          guestEmail: guest.guestEmail,
          guestPhone: guest.guestPhone,
          checkInDate: guest.checkInDate,
          checkOutDate: guest.checkOutDate,
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to get guest profile');
    }
  }

  /**
 * Get active guest by roomId + partnerId
 * Used in QR scan flow when room is FULL
 * Auth: NONE (public, scoped by partner + room)
 *
 * GET /api/public/room/guest
 */
static async getGuestByRoom(
  partnerId: string,
  roomId: string
) {
  try {
    await connectDB();

    const guest = await Guest.findOne({
      partnerId,
      roomId,
      isActive: true,
    }).lean();

    if (!guest) {
      return NextResponse.json({
        success: true,
        data: null, // room empty or no active guest
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        guestId: guest._id.toString(),
        guestName: guest.guestName,
        roomId: guest.roomId,
        roomName: guest.roomName,
        checkInDate: guest.checkInDate,
        checkOutDate: guest.checkOutDate || null,
        isActive: guest.isActive,
      },
    });
  } catch (error) {
    console.error('Get Guest By Room Error:', error);
    return handleApiError(error, 'Failed to fetch guest by room');
  }
}


  
}

