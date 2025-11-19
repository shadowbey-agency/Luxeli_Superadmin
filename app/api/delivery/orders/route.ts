import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { InRoomDeliveryRequest } from '@/models/room-delivery/InRoomDeliveryRequest';
import { handleApiError } from '@/lib/middleware';

// POST /api/delivery/orders - Create new delivery order for guests (no auth required)
export const POST = async (request: NextRequest) => {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validation
    if (!body.roomName || !body.residentialName || !body.items || !body.restaurant || !body.pickup) {
      return NextResponse.json(
        { success: false, error: 'Required fields missing: roomName, residentialName, items, restaurant, pickup' },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Items must be a non-empty array' },
        { status: 400 }
      );
    }

    // Create the order
    const order = new InRoomDeliveryRequest({
      // For guest orders, we'll use a default partnerId
      partnerId: "guest-order",
      roomName: body.roomName.trim(),
      residentialName: body.residentialName.trim(),
      items: body.items,
      restaurant: body.restaurant.trim(),
      pickup: body.pickup.trim(),
      status: 'new',
      notes: body.notes?.trim(),
    });

    await order.save();

    return NextResponse.json(
      { success: true, data: { order: order.toJSON() } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create Delivery Order API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Invalid request body' },
      { status: 400 }
    );
  }
};