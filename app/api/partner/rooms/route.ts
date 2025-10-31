import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/middleware'
import { RoomController } from '@/controllers/partner/RoomController'

// GET /api/partner/rooms - list rooms (basic pagination)
export const GET = withAuth(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)
  const query = {
    page: searchParams.get('page') || undefined,
    limit: searchParams.get('limit') || undefined,
  }
  return RoomController.getRooms(query)
})

// POST /api/partner/rooms - create room
export const POST = withAuth(async (req: NextRequest) => {
  const body = await req.json()
  return RoomController.createRoom(body)
})


