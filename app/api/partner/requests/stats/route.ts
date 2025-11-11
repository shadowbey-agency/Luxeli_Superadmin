import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware'
import connectDB from '@/lib/db'
import HousekeepingRequest from '@/models/housekeeping/HousekeepingRequest'
import BookingInternRequest from '@/models/booking/BookingInternRequest'
import CustomizedServiceRequest from '@/models/customized-services/CustomizedServiceRequest'
import { ActivityRequest } from '@/models/activity-alerts/activities'
import LaundryRequest from '@/models/laundary/laundaryRequest'
import { InRoomDeliveryRequest } from '@/models/room-delivery/InRoomDeliveryRequest'

// GET /api/partner/requests/stats - get request statistics for current and last week
export const GET = withAuth(async (req: NextRequest) => {
  try {
    await connectDB()

    const now = new Date()
    
    // Current week: from Monday 00:00:00 to Sunday 23:59:59
    const currentWeekStart = new Date(now)
    const dayOfWeek = currentWeekStart.getDay()
    const diff = currentWeekStart.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) // Adjust to Monday
    currentWeekStart.setDate(diff)
    currentWeekStart.setHours(0, 0, 0, 0)
    
    const currentWeekEnd = new Date(currentWeekStart)
    currentWeekEnd.setDate(currentWeekStart.getDate() + 6)
    currentWeekEnd.setHours(23, 59, 59, 999)
    
    // Last week: previous Monday to Sunday
    const lastWeekStart = new Date(currentWeekStart)
    lastWeekStart.setDate(currentWeekStart.getDate() - 7)
    
    const lastWeekEnd = new Date(currentWeekStart)
    lastWeekEnd.setDate(currentWeekStart.getDate() - 1)
    lastWeekEnd.setHours(23, 59, 59, 999)

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

    // Count requests for current week from all models
    const [
      currentHousekeeping,
      currentBooking,
      currentCustomized,
      currentActivity,
      currentLaundry,
      currentRoomDelivery
    ] = await Promise.all([
      countRequests(HousekeepingRequest, currentWeekStart, currentWeekEnd),
      countRequests(BookingInternRequest, currentWeekStart, currentWeekEnd),
      countRequests(CustomizedServiceRequest, currentWeekStart, currentWeekEnd),
      countRequests(ActivityRequest, currentWeekStart, currentWeekEnd),
      countRequests(LaundryRequest, currentWeekStart, currentWeekEnd),
      countRequests(InRoomDeliveryRequest, currentWeekStart, currentWeekEnd)
    ])

    // Count requests for last week from all models
    const [
      lastHousekeeping,
      lastBooking,
      lastCustomized,
      lastActivity,
      lastLaundry,
      lastRoomDelivery
    ] = await Promise.all([
      countRequests(HousekeepingRequest, lastWeekStart, lastWeekEnd),
      countRequests(BookingInternRequest, lastWeekStart, lastWeekEnd),
      countRequests(CustomizedServiceRequest, lastWeekStart, lastWeekEnd),
      countRequests(ActivityRequest, lastWeekStart, lastWeekEnd),
      countRequests(LaundryRequest, lastWeekStart, lastWeekEnd),
      countRequests(InRoomDeliveryRequest, lastWeekStart, lastWeekEnd)
    ])

    // Sum up all request types
    const currentWeek = {
      total: currentHousekeeping.total + currentBooking.total + currentCustomized.total + 
             currentActivity.total + currentLaundry.total + currentRoomDelivery.total,
      accepted: currentHousekeeping.accepted + currentBooking.accepted + currentCustomized.accepted + 
                currentActivity.accepted + currentLaundry.accepted + currentRoomDelivery.accepted,
      canceled: currentHousekeeping.canceled + currentBooking.canceled + currentCustomized.canceled + 
                currentActivity.canceled + currentLaundry.canceled + currentRoomDelivery.canceled
    }

    const lastWeek = {
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

    const percentageChange = calculatePercentageChange(currentWeek.total, lastWeek.total)
    const isIncrease = percentageChange >= 0

    return NextResponse.json({
      success: true,
      currentWeek,
      lastWeek,
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


