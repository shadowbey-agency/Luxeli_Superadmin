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
  static async getRooms(query: {
    page?: string;
    limit?: string;
  }) {
    try {
      await connectDB();

      const page = parseInt(query.page || '1', 10);
      const limit = parseInt(query.limit || '20', 10);
      const skip = (page - 1) * limit;

      const [rooms, total] = await Promise.all([
        Room.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Room.countDocuments({}),
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

      const newRoom = new Room({
        partnerId,
        roomName: roomName.trim(),
        roomStatus: roomStatus === 'full' ? 'full' : 'empty',
      });

      await newRoom.save();
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
   */
  static async updateRoom(id: string, body: {
    roomName?: string;
    roomStatus?: 'full' | 'empty' | string;
  }) {
    try {
      await connectDB();

      const update: any = {};
      if (typeof body.roomName === 'string') update.roomName = body.roomName.trim();
      if (typeof body.roomStatus === 'string') update.roomStatus = body.roomStatus === 'full' ? 'full' : 'empty';

      const room = await Room.findByIdAndUpdate(id, update, { new: true });
      if (!room) {
        return NextResponse.json({ error: 'Room not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, room: room.toObject() });
    } catch (error: any) {
      return handleApiError(error, 'Failed to update room');
    }
  }

  /**
   * Update a room by room name
   */
  static async updateRoomByName(originalRoomName: string, body: {
    roomName?: string;
    roomStatus?: 'full' | 'empty' | string;
  }) {
    try {
      await connectDB();

      const update: any = {};
      if (typeof body.roomName === 'string') update.roomName = body.roomName.trim();
      if (typeof body.roomStatus === 'string') update.roomStatus = body.roomStatus === 'full' ? 'full' : 'empty';

      const room = await Room.findOneAndUpdate(
        { roomName: originalRoomName.trim() },
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
   */
  static async getRoomHistory(roomId: string) {
    try {
      await connectDB();

      const history = await RoomHistory.find({ roomId })
        .sort({ unassignedAt: -1 })
        .lean();

      return NextResponse.json({ success: true, history });
    } catch (error: any) {
      return handleApiError(error, 'Failed to fetch room history');
    }
  }
}
