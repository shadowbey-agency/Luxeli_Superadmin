import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware'
import connectDB from '@/lib/db'
import Room from '@/models/Room'
import RoomHistory from '@/models/RoomHistory'

// GET /api/partner/rooms/weekly-stats - get weekly room occupancy stats
export const GET = withAuth(async (req: NextRequest) => {
  try {
    await connectDB()

    // Get all rooms to know total count
    const allRooms = await Room.find({}).lean()
    const totalRooms = allRooms.length

    // Get all room history entries
    const allHistory = await RoomHistory.find({})
      .sort({ unassignedAt: -1 })
      .lean()

    // Calculate weekly stats for the last 8 weeks
    const weeks: Array<{ week: string; empty: number; full: number }> = []
    const now = new Date()
    
    for (let i = 7; i >= 0; i--) {
      const weekEnd = new Date(now)
      weekEnd.setDate(now.getDate() - (i * 7))
      weekEnd.setHours(23, 59, 59, 999)
      
      const weekStart = new Date(weekEnd)
      weekStart.setDate(weekEnd.getDate() - 6)
      weekStart.setHours(0, 0, 0, 0)
      
      // Format week label (e.g., "Sep 21 - Sep 28")
      const formatDate = (date: Date) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        return `${months[date.getMonth()]} ${date.getDate()}`
      }
      const weekLabel = `${formatDate(weekStart)} - ${formatDate(weekEnd)}`

      // Calculate room status at the end of this week
      let fullCount = 0
      let emptyCount = 0
      
      // For each room, determine its status at the end of this week
      for (const room of allRooms) {
        const roomId = room._id.toString()
        
        // Get all history entries for this room up to weekEnd
        const roomHistory = allHistory.filter(hist => 
          hist.roomId === roomId && new Date(hist.unassignedAt) <= weekEnd
        ).sort((a, b) => new Date(b.unassignedAt).getTime() - new Date(a.unassignedAt).getTime())
        
        // Check if room has current assignment that was active at weekEnd
        const hasCurrentAssignment = room.roomStatus === 'full' && 
          room.checkInDate && 
          new Date(room.checkInDate) <= weekEnd
        
        // Check if room was unassigned after its current check-in (if any)
        const wasUnassignedAfterCheckIn = roomHistory.length > 0 && 
          room.checkInDate && 
          roomHistory[0].checkInDate &&
          new Date(roomHistory[0].unassignedAt) > new Date(room.checkInDate)
        
        // If room has history, check the most recent assignment before weekEnd
        let wasFullAtWeekEnd = false
        if (roomHistory.length > 0) {
          const mostRecentHistory = roomHistory[0]
          // If there was a check-in before weekEnd and unassignment after weekEnd (or no unassignment)
          if (mostRecentHistory.checkInDate && new Date(mostRecentHistory.checkInDate) <= weekEnd) {
            if (new Date(mostRecentHistory.unassignedAt) > weekEnd) {
              wasFullAtWeekEnd = true
            }
          }
        } else if (hasCurrentAssignment && !wasUnassignedAfterCheckIn) {
          // Room has current assignment that was active at weekEnd
          wasFullAtWeekEnd = true
        }
        
        if (wasFullAtWeekEnd) {
          fullCount++
        } else {
          emptyCount++
        }
      }

      weeks.push({
        week: weekLabel,
        empty: emptyCount,
        full: fullCount
      })
    }

    // Also get current stats
    const currentEmpty = allRooms.filter(r => r.roomStatus === 'empty').length
    const currentFull = allRooms.filter(r => r.roomStatus === 'full').length

    return NextResponse.json({
      success: true,
      weekly: weeks,
      current: {
        total: totalRooms,
        empty: currentEmpty,
        full: currentFull
      }
    })
  } catch (error: any) {
    console.error('Weekly stats error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch weekly stats' },
      { status: 500 }
    )
  }
})

