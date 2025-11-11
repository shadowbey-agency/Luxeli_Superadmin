import { NextRequest, NextResponse } from 'next/server'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware'
import { RoomController } from '@/controllers/partner/RoomController'

// PATCH /api/partner/rooms/update-by-name - update room by room name
export const PATCH = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const body = await request.json()
    
    if (!body.originalRoomName || typeof body.originalRoomName !== 'string') {
      return NextResponse.json(
        { success: false, error: 'originalRoomName is required' },
        { status: 400 }
      )
    }

    const { originalRoomName, ...updateData } = body
    return await RoomController.updateRoomByName(originalRoomName, updateData)
  } catch (error: any) {
    console.error('Update Room by Name API Error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update room' },
      { status: 500 }
    )
  }
})

