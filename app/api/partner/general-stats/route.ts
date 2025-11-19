import { NextRequest, NextResponse } from 'next/server'
import { withAuth, AuthenticatedRequest, getPartnerId } from '@/lib/middleware'
import connectDB from '@/lib/db'
import Room from '@/models/Room'
import PartnerMember from '@/models/PartnerMember'
import Staff from '@/models/Staff'

// GET /api/partner/general-stats - get general statistics with percentage changes
export const GET = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const partnerId = getPartnerId(request)
    if (!partnerId) {
      return NextResponse.json(
        { success: false, error: 'Partner ID not found' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'week' // week, month, day

    await connectDB()

    const now = new Date()
    let currentStart: Date
    let currentEnd: Date
    let lastStart: Date
    let lastEnd: Date

    if (period === 'day') {
      // Current day: today 00:00:00 to 23:59:59
      currentStart = new Date(now)
      currentStart.setHours(0, 0, 0, 0)
      currentEnd = new Date(now)
      currentEnd.setHours(23, 59, 59, 999)
      
      // Last day: yesterday
      lastStart = new Date(now)
      lastStart.setDate(now.getDate() - 1)
      lastStart.setHours(0, 0, 0, 0)
      lastEnd = new Date(now)
      lastEnd.setDate(now.getDate() - 1)
      lastEnd.setHours(23, 59, 59, 999)
    } else if (period === 'week') {
      // Current week: Monday to Sunday
      currentStart = new Date(now)
      const dayOfWeek = currentStart.getDay()
      const diff = currentStart.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
      currentStart.setDate(diff)
      currentStart.setHours(0, 0, 0, 0)
      currentEnd = new Date(currentStart)
      currentEnd.setDate(currentStart.getDate() + 6)
      currentEnd.setHours(23, 59, 59, 999)
      
      // Last week
      lastStart = new Date(currentStart)
      lastStart.setDate(currentStart.getDate() - 7)
      lastEnd = new Date(currentEnd)
      lastEnd.setDate(currentEnd.getDate() - 7)
    } else { // month
      // Current month
      currentStart = new Date(now.getFullYear(), now.getMonth(), 1)
      currentStart.setHours(0, 0, 0, 0)
      currentEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      currentEnd.setHours(23, 59, 59, 999)
      
      // Last month
      lastStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      lastStart.setHours(0, 0, 0, 0)
      lastEnd = new Date(now.getFullYear(), now.getMonth(), 0)
      lastEnd.setHours(23, 59, 59, 999)
    }

    // Get current stats
    const currentRooms = await Room.find({ partnerId }).lean()
    const currentTotalRooms = currentRooms.length
    const currentEmptyRooms = currentRooms.filter(r => r.roomStatus === 'empty').length
    const currentFullRooms = currentRooms.filter(r => r.roomStatus === 'full').length

    // Count total members (all created up to now vs all created up to last period end)
    const currentMembers = await PartnerMember.countDocuments({
      partnerId,
      createdAt: { $lte: currentEnd }
    })
    const lastMembers = await PartnerMember.countDocuments({
      partnerId,
      createdAt: { $lte: lastEnd }
    })

    // Count total staff (all created up to now vs all created up to last period end)
    const currentStaff = await Staff.countDocuments({
      partnerId,
      createdAt: { $lte: currentEnd }
    })
    const lastStaff = await Staff.countDocuments({
      partnerId,
      createdAt: { $lte: lastEnd }
    })

    // For rooms, count rooms that existed in the last period
    const lastTotalRooms = await Room.countDocuments({
      partnerId,
      createdAt: { $lte: lastEnd }
    })
    
    // For empty/full room percentages, we'll use the average from the period
    // This is a simplified approach - in production you'd want historical snapshots
    const lastPeriodRooms = await Room.find({ 
      partnerId,
      createdAt: { $lte: lastEnd }
    }).lean()
    const lastEmptyRooms = lastPeriodRooms.filter(r => r.roomStatus === 'empty').length
    const lastFullRooms = lastPeriodRooms.filter(r => r.roomStatus === 'full').length

    // Calculate percentage changes
    const calculatePercentage = (current: number, last: number): { percentage: string, isIncrease: boolean } => {
      if (last === 0) {
        return { 
          percentage: current > 0 ? '100' : '0', 
          isIncrease: current > 0 
        }
      }
      const change = ((current - last) / last) * 100
      return {
        percentage: Math.abs(change).toFixed(0),
        isIncrease: change >= 0
      }
    }

    const totalRoomsChange = calculatePercentage(currentTotalRooms, lastTotalRooms)
    const emptyRoomsChange = calculatePercentage(currentEmptyRooms, lastEmptyRooms)
    const fullRoomsChange = calculatePercentage(currentFullRooms, lastFullRooms)
    const membersChange = calculatePercentage(currentMembers, lastMembers)
    const staffChange = calculatePercentage(currentStaff, lastStaff)

    return NextResponse.json({
      success: true,
      data: {
        totalRooms: {
          current: currentTotalRooms,
          percentage: totalRoomsChange.percentage,
          isIncrease: totalRoomsChange.isIncrease
        },
        emptyRooms: {
          current: currentEmptyRooms,
          percentage: emptyRoomsChange.percentage,
          isIncrease: emptyRoomsChange.isIncrease
        },
        fullRooms: {
          current: currentFullRooms,
          percentage: fullRoomsChange.percentage,
          isIncrease: fullRoomsChange.isIncrease
        },
        members: {
          current: currentMembers,
          percentage: membersChange.percentage,
          isIncrease: membersChange.isIncrease
        },
        staff: {
          current: currentStaff,
          percentage: staffChange.percentage,
          isIncrease: staffChange.isIncrease
        }
      }
    })
  } catch (error: any) {
    console.error('General stats error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch general stats' },
      { status: 500 }
    )
  }
})

