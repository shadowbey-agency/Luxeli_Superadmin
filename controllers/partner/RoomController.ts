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

    // Validate input
    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Excel file is empty. Please add at least one room.' },
        { status: 400 }
      );
    }

    console.log('📁 Starting bulk upload for partner:', partnerId);
    console.log('📊 Total rows received:', rows.length);

    // Normalize room names for comparison
    const normalizeRoomName = (value: any) =>
      value
        .toString()
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/\u00A0/g, '')
        .replace(/[\r\n\t]/g, '')
        .toLowerCase();

    // Parse and validate rows
    const roomsToInsert: any[] = [];
    const errors: string[] = [];
    const normalizedNamesMap = new Map<string, string>();

    rows.forEach((row: any, index: number) => {
      // Try multiple header variations
      const rawRoomName = row['Room name'] || 
                         row['Room Name'] || 
                         row.roomName || 
                         row['room_name'] ||
                         row['Roomname'] ||
                         Object.values(row)[0];
      
      if (!rawRoomName || (typeof rawRoomName === 'string' && rawRoomName.trim() === '')) {
        errors.push(`Row ${index + 2}: Room name is required`);
        return;
      }

      // Clean the room name
      const cleanedName = rawRoomName
        .toString()
        .trim()
        .replace(/\u00A0/g, '')
        .replace(/[\r\n\t]/g, '')
        .replace(/\s+/g, ' ');
      
      const normalizedName = normalizeRoomName(cleanedName);

      // Check for duplicates within the Excel file
      if (normalizedNamesMap.has(normalizedName)) {
        errors.push(`Row ${index + 2}: Duplicate room name "${cleanedName}"`);
        return;
      }

      normalizedNamesMap.set(normalizedName, cleanedName);
      roomsToInsert.push(cleanedName); // Store just the name for now
    });

    console.log('✅ Valid rooms:', roomsToInsert.length);
    console.log('❌ Errors:', errors.length);

    // Return validation errors if any
    if (errors.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          errors: errors.slice(0, 10),
          totalErrors: errors.length
        },
        { status: 400 }
      );
    }

    if (roomsToInsert.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid rooms found in the file' },
        { status: 400 }
      );
    }

    // Fetch existing rooms for this partner
    console.log('🔍 Checking existing rooms...');
    const existingRooms = await Room.find({ partnerId }).lean();
    console.log('Found existing rooms:', existingRooms.length);

    // Create normalized name set for quick lookup
    const existingNormalizedNames = new Set(
      existingRooms.map(r => normalizeRoomName(r.roomName))
    );

    // Filter out rooms that already exist
    const newRoomNames: string[] = [];
    const skippedRooms: string[] = [];

    roomsToInsert.forEach(roomName => {
      const normalized = normalizeRoomName(roomName);
      
      if (existingNormalizedNames.has(normalized)) {
        const existingRoom = existingRooms.find(
          r => normalizeRoomName(r.roomName) === normalized
        );
        skippedRooms.push(existingRoom?.roomName || roomName);
      } else {
        newRoomNames.push(roomName);
        existingNormalizedNames.add(normalized);
      }
    });

    console.log('New rooms to insert:', newRoomNames.length);
    console.log('Skipped (duplicates):', skippedRooms.length);

    // If all rooms already exist
    if (newRoomNames.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'All rooms already exist',
          error: `All ${skippedRooms.length} room(s) already exist in your system.`,
          skippedRooms: skippedRooms,
          totalSkipped: skippedRooms.length
        },
        { status: 409 }
      );
    }

    // ⚠️ CRITICAL: Use individual .save() instead of insertMany
    // This ensures the pre("save") hook runs to generate roomId
    console.log('💾 Inserting rooms one by one to trigger hooks...');
    
    const insertedRooms: any[] = [];
    const insertErrors: string[] = [];

    for (const roomName of newRoomNames) {
      try {
        const newRoom = new Room({
          partnerId,
          roomName,
          roomStatus: 'empty'
        });
        
        const savedRoom = await newRoom.save();
        insertedRooms.push(savedRoom);
        console.log(`✅ Inserted: ${roomName} with roomId: ${savedRoom.roomId}`);
      } catch (err: any) {
        console.error(`❌ Failed to insert "${roomName}":`, err.message);
        
        if (err.code === 11000) {
          // Duplicate key error
          if (err.message.includes('roomName')) {
            insertErrors.push(`"${roomName}" already exists`);
          } else {
            insertErrors.push(`Failed to insert "${roomName}" (duplicate)`);
          }
        } else {
          insertErrors.push(`Failed to insert "${roomName}": ${err.message}`);
        }
      }
    }

    console.log('✅ Insert complete!');
    console.log('  Successfully inserted:', insertedRooms.length);
    console.log('  Failed:', insertErrors.length);

    // Build response
    if (insertedRooms.length === 0 && insertErrors.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to insert any rooms',
          errors: insertErrors,
          skippedRooms: skippedRooms
        },
        { status: 500 }
      );
    }

    const message = skippedRooms.length > 0
      ? `Successfully added ${insertedRooms.length} room(s). ${skippedRooms.length} room(s) were skipped (already exist).`
      : `Successfully added ${insertedRooms.length} room(s).`;

    return NextResponse.json({
      success: true,
      message: message,
      inserted: insertedRooms.length,
      skipped: skippedRooms.length,
      failed: insertErrors.length,
      skippedRooms: skippedRooms,
      failedRooms: insertErrors.length > 0 ? insertErrors : undefined,
      insertedRooms: insertedRooms.map(r => ({
        id: r._id,
        roomId: r.roomId,
        roomName: r.roomName,
        roomStatus: r.roomStatus
      }))
    }, { status: 201 });

  } catch (error: any) {
    console.error('💥 Bulk upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to upload rooms',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
}
