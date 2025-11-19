import { NextRequest, NextResponse } from 'next/server'
import { withAuth, AuthenticatedRequest, getPartnerId } from '@/lib/middleware'
import connectDB from '@/lib/db'
import HousekeepingRequest from '@/models/housekeeping/HousekeepingRequest'
import BookingInternRequest from '@/models/booking/BookingInternRequest'
import CustomizedServiceRequest from '@/models/customized-services/CustomizedServiceRequest'
import { ActivityRequest } from '@/models/activity-alerts/activities'
import LaundryRequest from '@/models/laundary/laundaryRequest'
import { InRoomDeliveryRequest } from '@/models/room-delivery/InRoomDeliveryRequest'
import Ticket from '@/models/Ticket'

// GET /api/partner/requests/stats - get request statistics by period (week/month/day)
export const GET = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const partnerId = getPartnerId(request)
    if (!partnerId) {
      return NextResponse.json(
        { success: false, error: 'Partner ID not found' },
        { status: 401 }
      )
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
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
    const countRequests = async (model: any, startDate: Date, endDate: Date, isTicket: boolean = false) => {
      const filter = {
        partnerId: partnerId, // Filter by partnerId
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      }
      
      const total = await model.countDocuments(filter)
      
      // For tickets, use 'resolved' as accepted status; for other requests, use 'accepted'
      const acceptedStatus = isTicket ? 'resolved' : 'accepted'
      // Only count requests with status 'accepted' (or 'resolved' for tickets) as accepted
      const accepted = await model.countDocuments({ ...filter, status: acceptedStatus })
      // Only count requests with status 'canceled' as canceled
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
      currentRoomDelivery,
      currentTicket
    ] = await Promise.all([
      countRequests(HousekeepingRequest, currentStart, currentEnd, false),
      countRequests(BookingInternRequest, currentStart, currentEnd, false),
      countRequests(CustomizedServiceRequest, currentStart, currentEnd, false),
      countRequests(ActivityRequest, currentStart, currentEnd, false),
      countRequests(LaundryRequest, currentStart, currentEnd, false),
      countRequests(InRoomDeliveryRequest, currentStart, currentEnd, false),
      countRequests(Ticket, currentStart, currentEnd, true)
    ])

    // Count requests for last period from all models
    const [
      lastHousekeeping,
      lastBooking,
      lastCustomized,
      lastActivity,
      lastLaundry,
      lastRoomDelivery,
      lastTicket
    ] = await Promise.all([
      countRequests(HousekeepingRequest, lastStart, lastEnd, false),
      countRequests(BookingInternRequest, lastStart, lastEnd, false),
      countRequests(CustomizedServiceRequest, lastStart, lastEnd, false),
      countRequests(ActivityRequest, lastStart, lastEnd, false),
      countRequests(LaundryRequest, lastStart, lastEnd, false),
      countRequests(InRoomDeliveryRequest, lastStart, lastEnd, false),
      countRequests(Ticket, lastStart, lastEnd, true)
    ])

    // Sum up all request types
    // Calculate accepted and canceled counts
    const currentAccepted = currentHousekeeping.accepted + currentBooking.accepted + currentCustomized.accepted + 
                             currentActivity.accepted + currentLaundry.accepted + currentRoomDelivery.accepted + currentTicket.accepted
    const currentCanceled = currentHousekeeping.canceled + currentBooking.canceled + currentCustomized.canceled + 
                            currentActivity.canceled + currentLaundry.canceled + currentRoomDelivery.canceled + currentTicket.canceled
    
    const lastAccepted = lastHousekeeping.accepted + lastBooking.accepted + lastCustomized.accepted + 
                         lastActivity.accepted + lastLaundry.accepted + lastRoomDelivery.accepted + lastTicket.accepted
    const lastCanceled = lastHousekeeping.canceled + lastBooking.canceled + lastCustomized.canceled + 
                         lastActivity.canceled + lastLaundry.canceled + lastRoomDelivery.canceled + lastTicket.canceled

    // Total should only include accepted + canceled for the graph
    // But we also need the actual total for percentage calculation
    const currentTotalAll = currentHousekeeping.total + currentBooking.total + currentCustomized.total + 
                            currentActivity.total + currentLaundry.total + currentRoomDelivery.total + currentTicket.total
    const lastTotalAll = lastHousekeeping.total + lastBooking.total + lastCustomized.total + 
                        lastActivity.total + lastLaundry.total + lastRoomDelivery.total + lastTicket.total

    const current = {
      total: currentAccepted + currentCanceled, // Only accepted + canceled for graph
      accepted: currentAccepted,
      canceled: currentCanceled,
      totalAll: currentTotalAll // Keep actual total for percentage calculation
    }

    const last = {
      total: lastAccepted + lastCanceled, // Only accepted + canceled for graph
      accepted: lastAccepted,
      canceled: lastCanceled,
      totalAll: lastTotalAll // Keep actual total for percentage calculation
    }

    // Calculate percentage change
    const calculatePercentageChange = (current: number, last: number) => {
      if (last === 0) {
        // If last period had 0, show 100% if current > 0, otherwise 0%
        return current > 0 ? 100 : 0
      }
      const change = ((current - last) / last) * 100
      return change
    }

    // Calculate percentage change based on total requests (all statuses), not just accepted + canceled
    const percentageChange = calculatePercentageChange(current.totalAll, last.totalAll)
    const isIncrease = percentageChange >= 0
    const percentageValue = Math.abs(percentageChange).toFixed(0)

    return NextResponse.json({
      success: true,
      current,
      last,
      percentageChange: percentageValue,
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


