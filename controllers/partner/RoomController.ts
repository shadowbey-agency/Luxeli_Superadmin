import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Room from '@/models/Room';
import RoomHistory from '@/models/RoomHistory';
import Guest from '@/models/Guest';
import { handleApiError } from '@/lib/middleware';

export class RoomController {
  /**
   * Get all rooms with pagination
   */
  static async getRooms(
    query: {
      page?: string;
      limit?: string;
    },
    partnerId: string
  ) {
    try {
      await connectDB();

      const page = parseInt(query.page || '1', 10);
      const limit = parseInt(query.limit || '20', 10);
      const skip = (page - 1) * limit;

      const [rooms, total] = await Promise.all([
        Room.find({ partnerId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Room.countDocuments({ partnerId }),
      ]);

      // For each room, fetch the active guest if any
      const roomsWithGuests = await Promise.all(
        rooms.map(async (room) => {
          const guest = await Guest.findOne({
            roomId: room._id.toString(),
            isActive: true, // Only show active guests
          }).lean();

          return {
            ...room,
            guest: guest ? {
              _id: guest._id,
              guestName: guest.guestName,
              guestEmail: guest.guestEmail,
              guestPhone: guest.guestPhone,
              checkInDate: guest.checkInDate,
              checkOutDate: guest.checkOutDate,
            } : null,
          };
        })
      );

      return NextResponse.json({ items: roomsWithGuests, total, page, limit });
    } catch (error: any) {
      return handleApiError(error, 'Failed to fetch rooms');
    }
  }

  /**
   * Get a single room by ID
   */
  static async getRoomById(id: string) {
    try {
      await connectDB();

      const room = await Room.findById(id).lean();
      if (!room) {
        return NextResponse.json({ error: 'Room not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, room });
    } catch (error: any) {
      return handleApiError(error, 'Failed to fetch room');
    }
  }

  /**
   * Create a new room
   */
  static async createRoom(partnerId: string, body: {
    roomName: string;
    roomStatus?: 'full' | 'empty';
  }) {
    try {
      await connectDB();

      const { roomName, roomStatus } = body;

      if (!roomName || typeof roomName !== 'string') {
        return NextResponse.json({ error: 'roomName is required' }, { status: 400 });
      }

      // Check if room with same name already exists for this partner
      const existingRoom = await Room.findOne({
        partnerId,
        roomName: roomName.trim()
      }).lean();

      if (existingRoom) {
        return NextResponse.json(
          { success: false, error: 'Room with this name already exists for this partner' },
          { status: 409 }
        );
      }

      let newRoom = new Room({
        partnerId,
        roomName: roomName.trim(),
        roomStatus: roomStatus === 'full' ? 'full' : 'empty',
      });

      try {
        await newRoom.save();
      } catch (error: any) {
        // If a duplicate roomId slipped through due to a stale index, regenerate once
        if (error?.code === 11000 && error?.keyPattern?.roomId) {
          newRoom.roomId = undefined as any;
          await newRoom.save();
        } else {
          throw error;
        }
      }
      return NextResponse.json({ success: true, room: newRoom.toObject() }, { status: 201 });
    } catch (error: any) {
      // Handle duplicate entry errors
      if (error.code === 11000) {
        let duplicateField = 'roomId';
        if (error.keyPattern) {
          if (error.keyPattern.roomName) {
            duplicateField = 'roomName';
          } else if (error.keyPattern.roomId) {
            duplicateField = 'roomId';
          }
        }
        return NextResponse.json(
          { success: false, error: `Room with this ${duplicateField} already exists for this partner` },
          { status: 409 }
        );
      }
      return handleApiError(error, 'Failed to create room');
    }
  }

  /**
   * Update a room by ID
   * Can update room details (roomName, roomStatus) or guest details (resident, checkIn, checkOut)
   */
  static async updateRoom(id: string, body: {
    roomName?: string;
    roomStatus?: 'full' | 'empty' | string;
    resident?: string;
    checkIn?: string;
    checkOut?: string;
  }) {
    try {
      await connectDB();

      // Update room basic fields
      const roomUpdate: any = {};
      if (typeof body.roomName === 'string') roomUpdate.roomName = body.roomName.trim();
      if (typeof body.roomStatus === 'string') roomUpdate.roomStatus = body.roomStatus === 'full' ? 'full' : 'empty';

      const room = await Room.findByIdAndUpdate(id, roomUpdate, { new: true });
      if (!room) {
        return NextResponse.json({ error: 'Room not found' }, { status: 404 });
      }

      // If guest/resident data is provided, update or create guest record
      if (body.resident !== undefined || body.checkIn !== undefined || body.checkOut !== undefined) {
        // Find active guest for this room
        let guest = await Guest.findOne({
          roomId: id,
          isActive: true,
        });

        if (!guest && body.resident) {
          // Create new guest if one doesn't exist and resident name is provided
          guest = new Guest({
            partnerId: room.partnerId,
            roomId: id,
            roomName: room.roomName,
            guestName: body.resident.trim(),
            checkInDate: body.checkIn ? new Date(body.checkIn) : new Date(),
            checkOutDate: body.checkOut ? new Date(body.checkOut) : undefined,
            isActive: true,
          });
        } else if (guest) {
          // Update existing guest
          if (body.resident !== undefined) guest.guestName = body.resident.trim();
          if (body.checkIn !== undefined) guest.checkInDate = body.checkIn ? new Date(body.checkIn) : new Date();
          if (body.checkOut !== undefined) guest.checkOutDate = body.checkOut ? new Date(body.checkOut) : undefined;
        }

        if (guest) {
          await guest.save();
        }
      }

      return NextResponse.json({ success: true, room: room.toObject() });
    } catch (error: any) {
      return handleApiError(error, 'Failed to update room');
    }
  }

  /**
   * Update a room by room name
   */
  static async updateRoomByName(
    partnerId: string,
    originalRoomName: string,
    body: {
      roomName?: string;
      roomStatus?: 'full' | 'empty' | string;
    }
  ) {
    try {
      await connectDB();

      const update: any = {};
      if (typeof body.roomName === 'string') update.roomName = body.roomName.trim();
      if (typeof body.roomStatus === 'string') update.roomStatus = body.roomStatus === 'full' ? 'full' : 'empty';

      const room = await Room.findOneAndUpdate(
        { partnerId, roomName: originalRoomName.trim() },
        update,
        { new: true }
      );
      if (!room) {
        return NextResponse.json({ error: 'Room not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, room: room.toObject() });
    } catch (error: any) {
      return handleApiError(error, 'Failed to update room');
    }
  }

  /**
   * Delete a room by ID
   */
  static async deleteRoom(id: string) {
    try {
      await connectDB();

      const result = await Room.findByIdAndDelete(id);
      if (!result) {
        return NextResponse.json({ error: 'Room not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true });
    } catch (error: any) {
      return handleApiError(error, 'Failed to delete room');
    }
  }


  /**
   * Get room history by room ID
   * Verifies room belongs to partner for security
   */
  static async getRoomHistory(roomId: string, partnerId: string) {
    try {
      await connectDB();

      // Verify room exists and belongs to this partner
      const room = await Room.findById(roomId).lean();
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

      // Filter history by both roomId and partnerId for security
      const history = await RoomHistory.find({ roomId, partnerId })
        .sort({ unassignedAt: -1 })
        .lean();

      return NextResponse.json({ success: true, history });
    } catch (error: any) {
      return handleApiError(error, 'Failed to fetch room history');
    }
  }

  /**
   * Bulk upload rooms from Excel file
   */
  static async bulkUploadRooms(partnerId: string, rows: any[]) {
    try {
      await connectDB();

      if (!rows || rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Excel file is empty. Please add at least one room.' },
          { status: 400 }
        );
      }

      // Validate and transform rows
      const roomsToInsert: any[] = [];
      const errors: string[] = [];

      // Normalize room names - remove extra spaces, hidden chars, etc.
      const normalizeRoomName = (value: any) =>
        value
          .toString()
          .trim()
          .replace(/\s+/g, ' ')        // remove extra spaces
          .replace(/\u00A0/g, '')      // remove non-breaking space
          .replace(/[\r\n\t]/g, '')    // remove hidden chars
          .toLowerCase();

      rows.forEach((row: any, index: number) => {
        // Try multiple header name variations
        const rawRoomName = row['Room name'] || 
                           row['Room Name'] || 
                           row.roomName || 
                           row['room_name'] ||
                           row['Roomname'] ||
                           Object.values(row)[0]; // Fallback to first column value
        
        if (!rawRoomName || (typeof rawRoomName === 'string' && rawRoomName.trim() === '')) {
          errors.push(`Row ${index + 1}: Room name is required`);
          return;
        }

        roomsToInsert.push({
          partnerId,
          roomName: normalizeRoomName(rawRoomName),
          roomStatus: 'empty', // All uploaded rooms start as empty
        });
      });

      // If there were validation errors, return them
      if (errors.length > 0) {
        return NextResponse.json(
          { success: false, error: `Validation error: ${errors[0]}` },
          { status: 400 }
        );
      }

      if (roomsToInsert.length === 0) {
        return NextResponse.json(
          { success: false, error: 'No valid rooms found in the file' },
          { status: 400 }
        );
      }

      // Check for duplicate room names within the upload (after normalization)
      const roomNames = roomsToInsert.map(r => r.roomName);
      const uniqueNames = new Set(roomNames);
      if (uniqueNames.size !== roomNames.length) {
        const duplicates = roomNames.filter((name, index) => roomNames.indexOf(name) !== index);
        const uniqueDuplicates = [...new Set(duplicates)];
        return NextResponse.json( 
          { success: false, error: `Duplicate room names in file: ${uniqueDuplicates.join(', ')}. Each room name must be unique.` },
          { status: 400 }
        );
      }

      // Check for existing room names for this partner (case-insensitive)
      const existingRooms = await Room.find({
        partnerId,
        roomName: { 
          $in: roomsToInsert.map(r => new RegExp(`^${r.roomName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'))
        }
      }).lean();

      // Separate new rooms from existing ones (case-insensitive comparison)
      const existingRoomNames = new Set(existingRooms.map(r => r.roomName.toLowerCase()));
      const newRooms = roomsToInsert.filter(r => !existingRoomNames.has(r.roomName.toLowerCase()));
      const skippedRooms = existingRooms.map(r => r.roomName);

      if (newRooms.length === 0) {
        return NextResponse.json(
          { success: false, error: `All rooms already exist: ${skippedRooms.join(', ')}. No new rooms to add.` },
          { status: 409 }
        );
      }

      // Insert rooms
      try {
        const result = await Room.insertMany(newRooms, { ordered: false });

        // Build success message with details
        let message = `${result.length} room${result.length !== 1 ? 's' : ''} added successfully`;
        if (skippedRooms.length > 0) {
          message += ` (${skippedRooms.length} room${skippedRooms.length !== 1 ? 's' : ''} skipped - already existed: ${skippedRooms.join(', ')})`;
        }

        return NextResponse.json({
          success: true,
          message: message,
          total: result.length,
          skipped: skippedRooms.length,
          skippedRooms: skippedRooms,
          createdRooms: result,
        }, { status: 201 });
      } catch (insertError: any) {
        // Handle duplicate key errors from MongoDB
        if (insertError.code === 11000) {
          const field = Object.keys(insertError.keyValue || {})[0];
          const value = insertError.keyValue?.[field];
          if (field === 'roomName') {
            return NextResponse.json(
              { success: false, error: `Room "${value}" already exists in your system. Please use a different room name.` },
              { status: 409 }
            );
          }
        }
        throw insertError;
      }
    } catch (error: any) {
      return handleApiError(error, 'Failed to upload rooms');
    }
  }
}
