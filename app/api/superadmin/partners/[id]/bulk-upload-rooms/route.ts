import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import connectDB from '@/lib/db';
import Room from '@/models/Room';
import * as XLSX from 'xlsx';

export const POST = withAuth(async (request: AuthenticatedRequest, context?: { params?: { [key: string]: string | string[] } | Promise<{ [key: string]: string | string[] }> }) => {
  try {
    let partnerId: string;
    if (context?.params) {
      const params = await Promise.resolve(context.params);
      partnerId = params.id as string;
    } else {
      const url = new URL(request.url);
      const segments = url.pathname.split('/');
      partnerId = segments[segments.length - 3]; // bulk-upload-rooms is last, [id] is before it
    }

    if (!partnerId) {
      return NextResponse.json(
        { success: false, error: 'Partner ID is required' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Read the file
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Excel file is empty or invalid' },
        { status: 400 }
      );
    }

    await connectDB();

    let totalAdded = 0;
    let skipped = 0;

    // Process each row
    for (const row of data) {
      const roomName = (row as any)?.roomName?.toString().trim();

      if (!roomName) {
        skipped++;
        continue;
      }

      // Check if room already exists
      const existingRoom = await Room.findOne({ partnerId, roomName });
      if (existingRoom) {
        skipped++;
        continue;
      }

      // Create new room
      const newRoom = new Room({
        partnerId,
        roomName,
        roomNumber: roomName,
        hotelName: '',
        roomType: '',
        capacity: 0,
        status: 'Available',
        price: 0,
        dateAdded: new Date(),
      });

      await newRoom.save();
      totalAdded++;
    }

    return NextResponse.json({
      success: true,
      total: totalAdded,
      skipped,
    });
  } catch (error: any) {
    console.error('Bulk upload rooms error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to upload rooms' },
      { status: 500 }
    );
  }
});
