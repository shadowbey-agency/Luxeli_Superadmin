import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware'
import connectDB from '@/lib/db'
import HousekeepingRequest from '@/models/housekeeping/HousekeepingRequest'
import BookingInternRequest from '@/models/booking/BookingInternRequest'
import CustomizedServiceRequest from '@/models/customized-services/CustomizedServiceRequest'
import { ActivityRequest } from '@/models/activity-alerts/activities'
import LaundryRequest from '@/models/laundary/laundaryRequest'
import { InRoomDeliveryRequest } from '@/models/room-delivery/InRoomDeliveryRequest'

// GET /api/partner/requests/stats - get request statistics by period (week/month/day)
export const GET = withAuth(async (req: NextRequest) => {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const period = searchParams.get('period') || 'week' // week, month, day

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
      // Current week: from Monday 00:00:00 to Sunday 23:59:59
      currentStart = new Date(now)
      const dayOfWeek = currentStart.getDay()
      const diff = currentStart.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) // Adjust to Monday
      currentStart.setDate(diff)
      currentStart.setHours(0, 0, 0, 0)
      
      currentEnd = new Date(currentStart)
      currentEnd.setDate(currentStart.getDate() + 6)
      currentEnd.setHours(23, 59, 59, 999)
      
      // Last week: previous Monday to Sunday
      lastStart = new Date(currentStart)
      lastStart.setDate(currentStart.getDate() - 7)
      
      lastEnd = new Date(currentStart)
      lastEnd.setDate(currentStart.getDate() - 1)
      lastEnd.setHours(23, 59, 59, 999)
    } else { // month
      // Current month: first day to last day
      currentStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
      currentEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
      
      // Last month: previous month
      lastStart = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0)
      lastEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)
    }

    // Helper function to count requests by status in a date range
    const countRequests = async (model: any, startDate: Date, endDate: Date) => {
      const filter = {
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      }
      
      const total = await model.countDocuments(filter)
      const accepted = await model.countDocuments({ ...filter, status: 'accepted' })
      const canceled = await model.countDocuments({ ...filter, status: 'canceled' })
      
      return { total, accepted, canceled }
    }

    // Count requests for current period from all models
    const [
      currentHousekeeping,
      currentBooking,
      currentCustomized,
      currentActivity,
      currentLaundry,
      currentRoomDelivery
    ] = await Promise.all([
      countRequests(HousekeepingRequest, currentStart, currentEnd),
      countRequests(BookingInternRequest, currentStart, currentEnd),
      countRequests(CustomizedServiceRequest, currentStart, currentEnd),
      countRequests(ActivityRequest, currentStart, currentEnd),
      countRequests(LaundryRequest, currentStart, currentEnd),
      countRequests(InRoomDeliveryRequest, currentStart, currentEnd)
    ])

    // Count requests for last period from all models
    const [
      lastHousekeeping,
      lastBooking,
      lastCustomized,
      lastActivity,
      lastLaundry,
      lastRoomDelivery
    ] = await Promise.all([
      countRequests(HousekeepingRequest, lastStart, lastEnd),
      countRequests(BookingInternRequest, lastStart, lastEnd),
      countRequests(CustomizedServiceRequest, lastStart, lastEnd),
      countRequests(ActivityRequest, lastStart, lastEnd),
      countRequests(LaundryRequest, lastStart, lastEnd),
      countRequests(InRoomDeliveryRequest, lastStart, lastEnd)
    ])

    // Sum up all request types
    const current = {
      total: currentHousekeeping.total + currentBooking.total + currentCustomized.total + 
             currentActivity.total + currentLaundry.total + currentRoomDelivery.total,
      accepted: currentHousekeeping.accepted + currentBooking.accepted + currentCustomized.accepted + 
                currentActivity.accepted + currentLaundry.accepted + currentRoomDelivery.accepted,
      canceled: currentHousekeeping.canceled + currentBooking.canceled + currentCustomized.canceled + 
                currentActivity.canceled + currentLaundry.canceled + currentRoomDelivery.canceled
    }

    const last = {
      total: lastHousekeeping.total + lastBooking.total + lastCustomized.total + 
             lastActivity.total + lastLaundry.total + lastRoomDelivery.total,
      accepted: lastHousekeeping.accepted + lastBooking.accepted + lastCustomized.accepted + 
                lastActivity.accepted + lastLaundry.accepted + lastRoomDelivery.accepted,
      canceled: lastHousekeeping.canceled + lastBooking.canceled + lastCustomized.canceled + 
                lastActivity.canceled + lastLaundry.canceled + lastRoomDelivery.canceled
    }

    // Calculate percentage change
    const calculatePercentageChange = (current: number, last: number) => {
      if (last === 0) return current > 0 ? 100 : 0
      return ((current - last) / last) * 100
    }

    const percentageChange = calculatePercentageChange(current.total, last.total)
    const isIncrease = percentageChange >= 0

    return NextResponse.json({
      success: true,
      current,
      last,
      percentageChange: Math.abs(percentageChange).toFixed(0),
      isIncrease
    })
  } catch (error: any) {
    console.error('Request stats error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch request stats' },
      { status: 500 }
    )
  }
})


