import { NextRequest, NextResponse } from 'next/server'
import { withAuth, AuthenticatedRequest, getPartnerId } from '@/lib/middleware'
import connectDB from '@/lib/db'
import Room from '@/models/Room'
import RoomHistory from '@/models/RoomHistory'
import Guest from '@/models/Guest'

// GET /api/partner/rooms/daily-stats - get room occupancy stats by period (day/week/month)
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
    const period = searchParams.get('period') || 'day' // day, week, month

    await connectDB()

    // Get all rooms for this partner
    const allRooms = await Room.find({ partnerId }).lean()

    // Get all room history entries for this partner
    const allHistory = await RoomHistory.find({ partnerId })
      .sort({ unassignedAt: -1 })
      .lean()

    // Get all guests (current and historical) for this partner
    const allGuests = await Guest.find({ partnerId }).lean()

    const now = new Date()
    const data: Array<{ label: string; empty: number; full: number; total: number }> = []
    
    if (period === 'day') {
      // Calculate daily stats for the last 7 days
      for (let i = 6; i >= 0; i--) {
      const targetDate = new Date(now)
      targetDate.setDate(now.getDate() - i)
      targetDate.setHours(0, 0, 0, 0) // Start of day
      
      const targetDateEnd = new Date(targetDate)
      targetDateEnd.setHours(23, 59, 59, 999) // End of day
      
      // Format day label (e.g., "Mon 17")
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      const dayLabel = `${dayNames[targetDate.getDay()]} ${targetDate.getDate()}`
      
      let fullCount = 0
      let emptyCount = 0
      let totalCount = 0
      
      // For each room, determine its status on this specific day
      for (const room of allRooms) {
        const roomId = room._id.toString()
        
        // For today (i === 0), include all rooms regardless of creation date
        // For historical days, only include rooms created on or before that day
        if (i > 0) {
          // Check if room has a valid createdAt date
          if (!room.createdAt) {
            // If no createdAt, skip for historical days (but include for today)
            continue
          }
          const roomCreatedAt = new Date(room.createdAt)
          roomCreatedAt.setHours(0, 0, 0, 0) // Normalize to start of day
          
          // Skip if room was created after this day
          if (roomCreatedAt > targetDate) {
            continue
          }
        }
        
        totalCount++
        
        // For today (i === 0), use the current roomStatus field directly
        // For historical days, calculate from guest/history data
        let wasFullOnDate = false
        
        if (i === 0) {
          // Use current roomStatus for today
          wasFullOnDate = room.roomStatus === 'full'
        } else {
          // For historical days, calculate from guest and history data
          // Get all guests for this room (both active and inactive)
          const roomGuests = allGuests.filter(g => g.roomId === roomId)
          
          // Get all history entries for this room
          const roomHistory = allHistory.filter(hist => hist.roomId === roomId)
            .sort((a, b) => new Date(b.unassignedAt).getTime() - new Date(a.unassignedAt).getTime())
          
          // First, check all guests to see if any was active on targetDate
          for (const guest of roomGuests) {
            if (guest.checkInDate) {
              const checkInDate = new Date(guest.checkInDate)
              
              // If guest checked in on or before targetDateEnd (end of day)
              if (checkInDate <= targetDateEnd) {
                // Check if guest was checked out after targetDate (or not checked out yet)
                if (!guest.checkOutDate) {
                  // Guest hasn't checked out, so room was full on targetDate
                  wasFullOnDate = true
                  break
                } else {
                  const checkOutDate = new Date(guest.checkOutDate)
                  // If checkout was after targetDate (start of day), room was full on targetDate
                  if (checkOutDate > targetDate) {
                    wasFullOnDate = true
                    break
                  }
                }
              }
            }
          }
          
          // If not full from guests, check history (for rooms that were unassigned before current guests)
          if (!wasFullOnDate && roomHistory.length > 0) {
            // Find the most recent history entry that was active on targetDate
            for (const hist of roomHistory) {
              if (hist.checkInDate) {
                const checkInDate = new Date(hist.checkInDate)
                const unassignedAt = new Date(hist.unassignedAt)
                
                // If check-in was on or before targetDateEnd and unassignment was after targetDate
                if (checkInDate <= targetDateEnd && unassignedAt > targetDate) {
                  wasFullOnDate = true
                  break
                }
              }
            }
          }
        }
        
        if (wasFullOnDate) {
          fullCount++
        } else {
          emptyCount++
        }
      }

        data.push({
          label: dayLabel,
          empty: emptyCount,
          full: fullCount,
          total: totalCount
        })
      }
    } else if (period === 'week') {
      // Calculate daily stats for the last 7 days (one week)
      for (let i = 6; i >= 0; i--) {
        const targetDate = new Date(now)
        targetDate.setDate(now.getDate() - i)
        targetDate.setHours(0, 0, 0, 0) // Start of day
        
        const targetDateEnd = new Date(targetDate)
        targetDateEnd.setHours(23, 59, 59, 999) // End of day
        
        // Format day label (e.g., "Mon 17")
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        const dayLabel = `${dayNames[targetDate.getDay()]} ${targetDate.getDate()}`
        
        let fullCount = 0
        let emptyCount = 0
        let totalCount = 0
        
        // For each room, determine its status on this specific day
        for (const room of allRooms) {
          const roomId = room._id.toString()
          
          // For today (i === 0), include all rooms regardless of creation date
          // For historical days, only include rooms created on or before that day
          if (i > 0) {
            // Check if room has a valid createdAt date
            if (!room.createdAt) {
              // If no createdAt, skip for historical days (but include for today)
              continue
            }
            const roomCreatedAt = new Date(room.createdAt)
            roomCreatedAt.setHours(0, 0, 0, 0) // Normalize to start of day
            
            // Skip if room was created after this day
            if (roomCreatedAt > targetDate) {
              continue
            }
          }
          
          totalCount++
          
          // For today (i === 0), use the current roomStatus field directly
          // For historical days, calculate from guest/history data
          let wasFullOnDate = false
          
          if (i === 0) {
            // Use current roomStatus for today
            wasFullOnDate = room.roomStatus === 'full'
          } else {
            // For historical days, calculate from guest and history data
            // Get all guests for this room (both active and inactive)
            const roomGuests = allGuests.filter(g => g.roomId === roomId)
            
            // Get all history entries for this room
            const roomHistory = allHistory.filter(hist => hist.roomId === roomId)
              .sort((a, b) => new Date(b.unassignedAt).getTime() - new Date(a.unassignedAt).getTime())
            
            // First, check all guests to see if any was active on targetDate
            for (const guest of roomGuests) {
              if (guest.checkInDate) {
                const checkInDate = new Date(guest.checkInDate)
                
                // If guest checked in on or before targetDateEnd (end of day)
                if (checkInDate <= targetDateEnd) {
                  // Check if guest was checked out after targetDate (or not checked out yet)
                  if (!guest.checkOutDate) {
                    // Guest hasn't checked out, so room was full on targetDate
                    wasFullOnDate = true
                    break
                  } else {
                    const checkOutDate = new Date(guest.checkOutDate)
                    // If checkout was after targetDate (start of day), room was full on targetDate
                    if (checkOutDate > targetDate) {
                      wasFullOnDate = true
                      break
                    }
                  }
                }
              }
            }
            
            // If not full from guests, check history (for rooms that were unassigned before current guests)
            if (!wasFullOnDate && roomHistory.length > 0) {
              // Find the most recent history entry that was active on targetDate
              for (const hist of roomHistory) {
                if (hist.checkInDate) {
                  const checkInDate = new Date(hist.checkInDate)
                  const unassignedAt = new Date(hist.unassignedAt)
                  
                  // If check-in was on or before targetDateEnd and unassignment was after targetDate
                  if (checkInDate <= targetDateEnd && unassignedAt > targetDate) {
                    wasFullOnDate = true
                    break
                  }
                }
              }
            }
          }
          
          if (wasFullOnDate) {
            fullCount++
          } else {
            emptyCount++
          }
        }
        
        data.push({
          label: dayLabel,
          empty: emptyCount,
          full: fullCount,
          total: totalCount
        })
      }
    } else if (period === 'month') {
      // Calculate monthly stats for the last 6 months
      for (let i = 5; i >= 0; i--) {
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999)
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1, 0, 0, 0, 0)
        
        // Format month label (e.g., "Jan 2025")
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const monthLabel = `${months[monthStart.getMonth()]} ${monthStart.getFullYear()}`
        
        let fullCount = 0
        let emptyCount = 0
        let totalCount = 0
        
        // For each room, determine its status at the end of this month
        for (const room of allRooms) {
          const roomId = room._id.toString()
          const roomCreatedAt = new Date(room.createdAt)
          
          // Skip if room was created after this month
          if (roomCreatedAt > monthEnd) {
            continue
          }
          
          totalCount++
          
          // For current month (i === 0), use the current roomStatus field directly
          // For historical months, calculate from guest/history data
          let wasFullAtMonthEnd = false
          
          if (i === 0) {
            // Use current roomStatus for current month
            wasFullAtMonthEnd = room.roomStatus === 'full'
          } else {
            // For historical months, calculate from guest and history data
            // Get all guests for this room
            const roomGuests = allGuests.filter(g => g.roomId === roomId)
            const roomHistory = allHistory.filter(hist => hist.roomId === roomId)
              .sort((a, b) => new Date(b.unassignedAt).getTime() - new Date(a.unassignedAt).getTime())
            
            // Check guests
            for (const guest of roomGuests) {
              if (guest.checkInDate) {
                const checkInDate = new Date(guest.checkInDate)
                if (checkInDate <= monthEnd) {
                  if (!guest.checkOutDate || new Date(guest.checkOutDate) > monthEnd) {
                    wasFullAtMonthEnd = true
                    break
                  }
                }
              }
            }
            
            // Check history
            if (!wasFullAtMonthEnd && roomHistory.length > 0) {
              for (const hist of roomHistory) {
                if (hist.checkInDate) {
                  const checkInDate = new Date(hist.checkInDate)
                  const unassignedAt = new Date(hist.unassignedAt)
                  if (checkInDate <= monthEnd && unassignedAt > monthEnd) {
                    wasFullAtMonthEnd = true
                    break
                  }
                }
              }
            }
          }
          
          if (wasFullAtMonthEnd) {
            fullCount++
          } else {
            emptyCount++
          }
        }
        
        data.push({
          label: monthLabel,
          empty: emptyCount,
          full: fullCount,
          total: totalCount
        })
      }
    }

    return NextResponse.json({
      success: true,
      data: data
    })
  } catch (error: any) {
    console.error('Daily stats error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch daily stats' },
      { status: 500 }
    )
  }
})

