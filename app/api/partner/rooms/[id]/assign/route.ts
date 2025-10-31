import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/middleware'
import { RoomController } from '@/controllers/partner/RoomController'

// POST /api/partner/rooms/[id]/assign - assign resident and set room full
export const POST = withAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params
  const body = await req.json()
  return RoomController.assignRoom(id, body)
})


