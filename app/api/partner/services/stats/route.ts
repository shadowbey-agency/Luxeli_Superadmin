import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware'
import connectDB from '@/lib/db'
import HousekeepingRequest from '@/models/housekeeping/HousekeepingRequest'
import BookingInternRequest from '@/models/booking/BookingInternRequest'
import CustomizedServiceRequest from '@/models/customized-services/CustomizedServiceRequest'
import { ActivityRequest } from '@/models/activity-alerts/activities'
import LaundryRequest from '@/models/laundary/laundaryRequest'
import { InRoomDeliveryRequest } from '@/models/room-delivery/InRoomDeliveryRequest'

// GET /api/partner/services/stats - get service-specific statistics
export const GET = withAuth(async (req: NextRequest) => {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const service = searchParams.get('service') || 'Housekeeping'
    const period = searchParams.get('period') || 'week' // week, month, day, custom
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Map service name to model
    const serviceModelMap: { [key: string]: any } = {
      'Housekeeping': HousekeepingRequest,
      'Bookings interns': BookingInternRequest,
      'Customized services': CustomizedServiceRequest,
      'Activity alerts': ActivityRequest,
      'Laundry': LaundryRequest,
      'In-room delivery': InRoomDeliveryRequest
    }

    const model = serviceModelMap[service]
    if (!model) {
      return NextResponse.json(
        { success: false, error: `Invalid service name: ${service}` },
        { status: 400 }
      )
    }

    const now = new Date()
    let start: Date
    let end: Date

    // Calculate date range based on period
    if (period === 'day') {
      start = new Date(now)
      start.setHours(0, 0, 0, 0)
      end = new Date(now)
      end.setHours(23, 59, 59, 999)
    } else if (period === 'week') {
      // Current week: Monday to Sunday
      start = new Date(now)
      const dayOfWeek = start.getDay()
      const diff = start.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
      start.setDate(diff)
      start.setHours(0, 0, 0, 0)
      end = new Date(start)
      end.setDate(start.getDate() + 6)
      end.setHours(23, 59, 59, 999)
    } else if (period === 'month') {
      // Current month
      start = new Date(now.getFullYear(), now.getMonth(), 1)
      start.setHours(0, 0, 0, 0)
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      end.setHours(23, 59, 59, 999)
    } else if (period === 'custom' && startDate && endDate) {
      start = new Date(startDate)
      start.setHours(0, 0, 0, 0)
      end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
    } else {
      // Default to week
      start = new Date(now)
      const dayOfWeek = start.getDay()
      const diff = start.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
      start.setDate(diff)
      start.setHours(0, 0, 0, 0)
      end = new Date(start)
      end.setDate(start.getDate() + 6)
      end.setHours(23, 59, 59, 999)
    }

    // Base filter for date range
    const dateFilter = {
      createdAt: {
        $gte: start,
        $lte: end
      }
    }

    // Calculate previous period dates for comparison
    let previousStart: Date
    let previousEnd: Date

    if (period === 'day') {
      // Previous day
      previousStart = new Date(start)
      previousStart.setDate(start.getDate() - 1)
      previousStart.setHours(0, 0, 0, 0)
      previousEnd = new Date(previousStart)
      previousEnd.setHours(23, 59, 59, 999)
    } else if (period === 'week') {
      // Previous week
      previousStart = new Date(start)
      previousStart.setDate(start.getDate() - 7)
      previousEnd = new Date(start)
      previousEnd.setDate(start.getDate() - 1)
      previousEnd.setHours(23, 59, 59, 999)
    } else if (period === 'month') {
      // Previous month
      previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      previousStart.setHours(0, 0, 0, 0)
      previousEnd = new Date(now.getFullYear(), now.getMonth(), 0)
      previousEnd.setHours(23, 59, 59, 999)
    } else {
      // For custom, calculate based on date range difference
      const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      previousStart = new Date(start)
      previousStart.setDate(start.getDate() - daysDiff)
      previousStart.setHours(0, 0, 0, 0)
      previousEnd = new Date(start)
      previousEnd.setDate(start.getDate() - 1)
      previousEnd.setHours(23, 59, 59, 999)
    }

    const previousDateFilter = {
      createdAt: {
        $gte: previousStart,
        $lte: previousEnd
      }
    }

    // Get counts by status for current period
    const [total, newCount, accepted, noShow, completed, canceled] = await Promise.all([
      model.countDocuments(dateFilter),
      model.countDocuments({ ...dateFilter, status: 'new' }),
      model.countDocuments({ ...dateFilter, status: 'accepted' }),
      model.countDocuments({ ...dateFilter, status: 'no-show' }),
      model.countDocuments({ ...dateFilter, status: 'completed' }),
      model.countDocuments({ ...dateFilter, status: 'canceled' })
    ])

    // Get counts for previous period
    const [prevTotal, prevNewCount, prevAccepted, prevNoShow, prevCompleted, prevCanceled] = await Promise.all([
      model.countDocuments(previousDateFilter),
      model.countDocuments({ ...previousDateFilter, status: 'new' }),
      model.countDocuments({ ...previousDateFilter, status: 'accepted' }),
      model.countDocuments({ ...previousDateFilter, status: 'no-show' }),
      model.countDocuments({ ...previousDateFilter, status: 'completed' }),
      model.countDocuments({ ...previousDateFilter, status: 'canceled' })
    ])

    // Calculate percentage change
    const calculatePercentage = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0
      return ((current - previous) / previous) * 100
    }

    const percentageChanges = {
      total: calculatePercentage(total, prevTotal),
      new: calculatePercentage(newCount, prevNewCount),
      accepted: calculatePercentage(accepted, prevAccepted),
      noShow: calculatePercentage(noShow, prevNoShow),
      completed: calculatePercentage(completed, prevCompleted),
      canceled: calculatePercentage(canceled, prevCanceled)
    }

    // Generate time-series data for graph
    const timeSeriesData: Array<{ date: string; requests: number }> = []

    if (period === 'day') {
      // Hourly data for the day
      for (let hour = 0; hour < 24; hour++) {
        const hourStart = new Date(start)
        hourStart.setHours(hour, 0, 0, 0)
        const hourEnd = new Date(hourStart)
        hourEnd.setHours(hour + 1, 0, 0, 0)
        
        const count = await model.countDocuments({
          createdAt: {
            $gte: hourStart,
            $lt: hourEnd
          }
        })
        
        timeSeriesData.push({
          date: `${hour.toString().padStart(2, '0')}:00`,
          requests: count
        })
      }
    } else if (period === 'week') {
      // Daily data for the week
      for (let day = 0; day < 7; day++) {
        const dayStart = new Date(start)
        dayStart.setDate(start.getDate() + day)
        dayStart.setHours(0, 0, 0, 0)
        const dayEnd = new Date(dayStart)
        dayEnd.setHours(23, 59, 59, 999)
        
        const count = await model.countDocuments({
          createdAt: {
            $gte: dayStart,
            $lte: dayEnd
          }
        })
        
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const dayLabel = `${months[dayStart.getMonth()]} ${dayStart.getDate()}`
        timeSeriesData.push({
          date: dayLabel,
          requests: count
        })
      }
    } else if (period === 'month') {
      // Weekly data for the month
      const weeksInMonth = Math.ceil((end.getDate() - start.getDate() + 1) / 7)
      for (let week = 0; week < weeksInMonth; week++) {
        const weekStart = new Date(start)
        weekStart.setDate(start.getDate() + (week * 7))
        weekStart.setHours(0, 0, 0, 0)
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)
        weekEnd.setHours(23, 59, 59, 999)
        
        // Don't go beyond month end
        if (weekEnd > end) {
          weekEnd.setTime(end.getTime())
        }
        
        const count = await model.countDocuments({
          createdAt: {
            $gte: weekStart,
            $lte: weekEnd
          }
        })
        
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const weekLabel = `Week ${week + 1} (${months[weekStart.getMonth()]} ${weekStart.getDate()})`
        timeSeriesData.push({
          date: weekLabel,
          requests: count
        })
      }
    } else if (period === 'custom' && startDate && endDate) {
      // Daily data for custom range (max 30 days)
      const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      const interval = daysDiff > 30 ? Math.ceil(daysDiff / 30) : 1
      
      for (let day = 0; day < daysDiff; day += interval) {
        const dayStart = new Date(start)
        dayStart.setDate(start.getDate() + day)
        dayStart.setHours(0, 0, 0, 0)
        const dayEnd = new Date(dayStart)
        dayEnd.setDate(dayStart.getDate() + interval - 1)
        dayEnd.setHours(23, 59, 59, 999)
        
        if (dayEnd > end) {
          dayEnd.setTime(end.getTime())
        }
        
        const count = await model.countDocuments({
          createdAt: {
            $gte: dayStart,
            $lte: dayEnd
          }
        })
        
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const dayLabel = `${months[dayStart.getMonth()]} ${dayStart.getDate()}`
        timeSeriesData.push({
          date: dayLabel,
          requests: count
        })
      }
    }

    // Determine period label for comparison
    let periodLabel = 'week'
    if (period === 'day') periodLabel = 'yesterday'
    else if (period === 'week') periodLabel = 'last week'
    else if (period === 'month') periodLabel = 'last month'
    else periodLabel = 'previous period'

    return NextResponse.json({
      success: true,
      data: {
        metrics: {
          'Total requests': total.toString(),
          'New requests': newCount.toString(),
          'Accepted requests': accepted.toString(),
          'No-show requests': noShow.toString(),
          'Completed requests': completed.toString(),
          'Canceled requests': canceled.toString()
        },
        percentageChanges: {
          'Total requests': percentageChanges.total,
          'New requests': percentageChanges.new,
          'Accepted requests': percentageChanges.accepted,
          'No-show requests': percentageChanges.noShow,
          'Completed requests': percentageChanges.completed,
          'Canceled requests': percentageChanges.canceled
        },
        periodLabel,
        timeSeries: timeSeriesData
      }
    })
  } catch (error: any) {
    console.error('Service stats error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch service stats' },
      { status: 500 }
    )
  }
})

