import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/middleware'
import { RoomController } from '@/controllers/partner/RoomController'

// PATCH /api/partner/rooms/[id] - update room fields
export const PATCH = withAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params
  const body = await req.json()
  return RoomController.updateRoom(id, body)
})

// DELETE /api/partner/rooms/[id] - delete a room
export const DELETE = withAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params
  return RoomController.deleteRoom(id)
})


