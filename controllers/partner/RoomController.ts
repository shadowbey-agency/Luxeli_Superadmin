import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Room from '@/models/Room';
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

      const [items, total] = await Promise.all([
        Room.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Room.countDocuments({}),
      ]);

      return NextResponse.json({ items, total, page, limit });
    } catch (error: any) {
      return handleApiError(error, 'Failed to fetch rooms');
    }
  }

  /**
   * Create a new room
   */
  static async createRoom(body: {
    roomName: string;
    roomStatus?: 'full' | 'empty';
    resident?: string | null;
    checkInDate?: string | null;
    checkInTime?: string | null;
    checkOutDate?: string | null;
    checkOutTime?: string | null;
  }) {
    try {
      await connectDB();

      const {
        roomName,
        roomStatus,
        resident,
        checkInDate,
        checkInTime,
        checkOutDate,
        checkOutTime,
      } = body;

      if (!roomName || typeof roomName !== 'string') {
        return NextResponse.json({ error: 'roomName is required' }, { status: 400 });
      }

      const newRoom = new Room({
        roomName: roomName.trim(),
        roomStatus: roomStatus === 'full' ? 'full' : 'empty',
        resident: resident?.trim?.() || null,
        checkInDate: checkInDate ? new Date(checkInDate) : null,
        checkInTime: checkInTime || null,
        checkOutDate: checkOutDate ? new Date(checkOutDate) : null,
        checkOutTime: checkOutTime || null,
      });

      await newRoom.save();
      return NextResponse.json({ success: true, room: newRoom.toObject() }, { status: 201 });
    } catch (error: any) {
      return handleApiError(error, 'Failed to create room');
    }
  }

  /**
   * Update a room by ID
   */
  static async updateRoom(id: string, body: {
    roomName?: string;
    roomStatus?: 'full' | 'empty' | string;
    resident?: string | null;
    checkInDate?: string | null;
    checkInTime?: string | null;
    checkOutDate?: string | null;
    checkOutTime?: string | null;
  }) {
    try {
      await connectDB();

      const update: any = {};
      if (typeof body.roomName === 'string') update.roomName = body.roomName.trim();
      if (typeof body.roomStatus === 'string') update.roomStatus = body.roomStatus === 'full' ? 'full' : 'empty';
      if (typeof body.resident === 'string' || body.resident === null) update.resident = body.resident ?? null;
      if (body.checkInDate !== undefined) update.checkInDate = body.checkInDate ? new Date(body.checkInDate) : null;
      if (body.checkInTime !== undefined) update.checkInTime = body.checkInTime || null;
      if (body.checkOutDate !== undefined) update.checkOutDate = body.checkOutDate ? new Date(body.checkOutDate) : null;
      if (body.checkOutTime !== undefined) update.checkOutTime = body.checkOutTime || null;

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
   * Assign a resident to a room (sets room to full)
   */
  static async assignRoom(id: string, body: {
    resident: string;
    checkInDate?: string;
    checkInTime?: string | null;
    checkOutDate?: string | null;
    checkOutTime?: string | null;
  }) {
    try {
      await connectDB();

      const { resident, checkInDate, checkInTime, checkOutDate, checkOutTime } = body;

      if (!resident || typeof resident !== 'string') {
        return NextResponse.json({ error: 'resident is required' }, { status: 400 });
      }

      const update = {
        roomStatus: 'full' as const,
        resident: resident.trim(),
        checkInDate: checkInDate ? new Date(checkInDate) : new Date(),
        checkInTime: checkInTime || null,
        checkOutDate: checkOutDate ? new Date(checkOutDate) : null,
        checkOutTime: checkOutTime || null,
      };

      const room = await Room.findByIdAndUpdate(id, update, { new: true });
      if (!room) {
        return NextResponse.json({ error: 'Room not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, room: room.toObject() });
    } catch (error: any) {
      return handleApiError(error, 'Failed to assign room');
    }
  }
}
