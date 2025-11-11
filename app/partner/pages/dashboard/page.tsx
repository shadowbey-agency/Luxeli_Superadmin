"use client"

import StatCard from "@/app/superadmin/components/stat-card"
import PartnerRevenueChart from "@/app/partner/components/partner-revenue-chart"
import PublicIcon from "@/app/partner/components/public-icon"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

import { useState, useEffect } from "react"
import { RiArrowDownSLine } from "react-icons/ri"
import { useRouter } from "next/navigation"
import { getAuthToken } from "@/lib/auth-utils"

export default function DashboardPage() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("subscriptions")
  const [selectedService, setSelectedService] = useState("Housekeeping")
  const [serviceTimePeriod, setServiceTimePeriod] = useState<"week" | "month" | "day" | "custom">("week")
  const [serviceStats, setServiceStats] = useState({
    metrics: {
      "Total requests": "0",
      "New requests": "0",
      "Accepted requests": "0",
      "No-show requests": "0",
      "Completed requests": "0",
      "Canceled requests": "0"
    },
    percentageChanges: {
      "Total requests": 0,
      "New requests": 0,
      "Accepted requests": 0,
      "No-show requests": 0,
      "Completed requests": 0,
      "Canceled requests": 0
    },
    periodLabel: "last week"
  })
  const [serviceTimeSeries, setServiceTimeSeries] = useState<Array<{ date: string; requests: number }>>([])
  const [isLoadingServiceStats, setIsLoadingServiceStats] = useState(true)
  const [roomStats, setRoomStats] = useState({
    totalRooms: 0,
    emptyRooms: 0,
    fullRooms: 0
  })
  const [isLoadingRooms, setIsLoadingRooms] = useState(true)
  const [memberCount, setMemberCount] = useState(0)
  const [isLoadingMembers, setIsLoadingMembers] = useState(true)
  const [staffCount, setStaffCount] = useState(0)
  const [isLoadingStaff, setIsLoadingStaff] = useState(true)
  const [weeklyRoomStats, setWeeklyRoomStats] = useState<Array<{ week: string; empty: number; full: number }>>([])
  const [isLoadingWeeklyStats, setIsLoadingWeeklyStats] = useState(true)
  const [requestStats, setRequestStats] = useState({
    total: 0,
    accepted: 0,
    canceled: 0,
    percentageChange: '0',
    isIncrease: true
  })
  const [isLoadingRequestStats, setIsLoadingRequestStats] = useState(true)

  // Fetch service-specific statistics
  const fetchServiceStats = async () => {
    try {
      setIsLoadingServiceStats(true)
      const token = getAuthToken()
      if (!token) {
        console.error('No auth token found')
        setIsLoadingServiceStats(false)
        return
      }

      const queryParams = new URLSearchParams({
        service: selectedService,
        period: serviceTimePeriod
      })

      const response = await fetch(`/api/partner/services/stats?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          setServiceStats({
            metrics: result.data.metrics,
            percentageChanges: result.data.percentageChanges || {},
            periodLabel: result.data.periodLabel || "last week"
          })
          setServiceTimeSeries(result.data.timeSeries || [])
        }
      } else {
        console.error('Failed to fetch service stats')
      }
    } catch (error) {
      console.error('Error fetching service stats:', error)
    } finally {
      setIsLoadingServiceStats(false)
    }
  }

  // Fetch request statistics
  const fetchRequestStats = async () => {
    try {
      setIsLoadingRequestStats(true)
      const token = getAuthToken()
      if (!token) {
        console.error('No auth token found')
        setIsLoadingRequestStats(false)
        return
      }

      const response = await fetch(`/api/partner/requests/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setRequestStats({
            total: result.currentWeek.total,
            accepted: result.currentWeek.accepted,
            canceled: result.currentWeek.canceled,
            percentageChange: result.percentageChange,
            isIncrease: result.isIncrease
          })
        }
      } else {
        console.error('Failed to fetch request stats')
      }
    } catch (error) {
      console.error('Error fetching request stats:', error)
    } finally {
      setIsLoadingRequestStats(false)
    }
  }

  // Fetch weekly room stats
  const fetchWeeklyRoomStats = async () => {
    try {
      setIsLoadingWeeklyStats(true)
      const token = getAuthToken()
      if (!token) {
        console.error('No auth token found')
        setIsLoadingWeeklyStats(false)
        return
      }

      const response = await fetch(`/api/partner/rooms/weekly-stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.weekly) {
          setWeeklyRoomStats(result.weekly)
        }
      } else {
        console.error('Failed to fetch weekly stats')
      }
    } catch (error) {
      console.error('Error fetching weekly room stats:', error)
    } finally {
      setIsLoadingWeeklyStats(false)
    }
  }

  // Fetch room stats from API
  const fetchRoomStats = async () => {
    try {
      setIsLoadingRooms(true)
      const token = getAuthToken()
      if (!token) {
        console.error('No auth token found')
        setIsLoadingRooms(false)
        return
      }

      // Fetch all rooms with a high limit to get accurate counts
      const response = await fetch(`/api/partner/rooms?page=1&limit=10000`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        const totalRooms = result.total || 0
        const rooms = result.items || []
        
        // Calculate empty and full rooms
        const emptyRooms = rooms.filter((room: any) => room.roomStatus === 'empty').length
        const fullRooms = rooms.filter((room: any) => room.roomStatus === 'full').length

        setRoomStats({
          totalRooms,
          emptyRooms,
          fullRooms
        })
      } else {
        console.error('Failed to fetch rooms')
      }
    } catch (error) {
      console.error('Error fetching room stats:', error)
    } finally {
      setIsLoadingRooms(false)
    }
  }

  // Fetch member count from API
  const fetchMemberCount = async () => {
    try {
      setIsLoadingMembers(true)
      const token = getAuthToken()
      if (!token) {
        console.error('No auth token found')
        setIsLoadingMembers(false)
        return
      }

      // Fetch members with limit 1 just to get total count
      const response = await fetch(`/api/partner/members?page=1&limit=1`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data?.pagination) {
          setMemberCount(result.data.pagination.total || 0)
        }
      } else {
        console.error('Failed to fetch members')
      }
    } catch (error) {
      console.error('Error fetching member count:', error)
    } finally {
      setIsLoadingMembers(false)
    }
  }

  // Fetch staff count from API
  const fetchStaffCount = async () => {
    try {
      setIsLoadingStaff(true)
      const token = getAuthToken()
      if (!token) {
        console.error('No auth token found')
        setIsLoadingStaff(false)
        return
      }

      // Fetch staff with limit 1 just to get total count
      const response = await fetch(`/api/partner/staff?page=1&limit=1`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data?.pagination) {
          setStaffCount(result.data.pagination.total || 0)
        }
      } else {
        console.error('Failed to fetch staff')
      }
    } catch (error) {
      console.error('Error fetching staff count:', error)
    } finally {
      setIsLoadingStaff(false)
    }
  }

  useEffect(() => {
    fetchRoomStats()
    fetchMemberCount()
    fetchStaffCount()
    fetchWeeklyRoomStats()
    fetchRequestStats()
  }, [])

  // Fetch service stats when service or time period changes
  useEffect(() => {
    fetchServiceStats()
  }, [selectedService, serviceTimePeriod])

  // Scroll detection to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["subscriptions", "services"]
      const scrollPosition = window.scrollY + 200 // Offset for header

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Services data structure - static data for vertical cards
  const servicesData = {
    "Housekeeping": {
      hasVerticalCard: true,
      verticalCardTitle: "Most Requested Items",
      verticalCardItems: [
        { name: "Extra Towels", requests: 80, completed: 55, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8ipA6E17y4LoKuHtZWjuJkPWWFPAUIkc5-w&s" },
        { name: "Room Cleaning", requests: 75, completed: 70, image: "https://www.wayfairertravel.com/hs-fs/hubfs/Imported%20sitepage%20images/shutterstock_2398908619_fbl654.jpg?width=1920&height=590&name=shutterstock_2398908619_fbl654.jpg" },
        { name: "Bed Sheets", requests: 65, completed: 60, image: "https://www.moxeemarketing.com/wp-content/uploads/2023/08/Long-boat-and-rocks-on-railay-beach-in-Krabi-Thailand.jpg" },
        { name: "Toiletries", requests: 58, completed: 50, image: "https://image.vietnamnews.vn/uploadvnnews/Article/2025/1/9/396482_Visual.jpeg" },
        { name: "Mini Bar", requests: 45, completed: 42, image: "https://fyi50plus.com/wp-content/uploads/2024/04/grandparents-raising-grandchildren-W-jpg.webp" }
      ]
    },
    "Bookings interns": {
      hasVerticalCard: true,
      verticalCardTitle: "Most Requested services",
      verticalCardItems: [
        { name: "Spa Treatment", requests: 80, completed: 55, image: "https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2015/6/25/1435228611797/b2c7829a-1917-463d-a0ae-c62e944f1e4b-2060x1236.jpeg?width=700&quality=85&auto=format&fit=max&s=37d9b9ac8a60d6882541a8bd2cf85925" },
        { name: "Restaurant Booking", requests: 78, completed: 56, image: "https://www.centralasia-travel.com/upload/tiles/bike-uzbekistan.jpg" },
        { name: "Pool Access", requests: 72, completed: 68, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8ipA6E17y4LoKuHtZWjuJkPWWFPAUIkc5-w&s" },
        { name: "Gym Session", requests: 65, completed: 58, image: "https://www.wayfairertravel.com/hs-fs/hubfs/Imported%20sitepage%20images/shutterstock_2398908619_fbl654.jpg?width=1920&height=590&name=shutterstock_2398908619_fbl654.jpg" },
        { name: "Concierge", requests: 58, completed: 52, image: "https://www.moxeemarketing.com/wp-content/uploads/2023/08/Long-boat-and-rocks-on-railay-beach-in-Krabi-Thailand.jpg" }
      ]
    },
    "Customized services": {
      hasVerticalCard: false,
      verticalCardTitle: "",
      verticalCardItems: []
    },
    "Activity alerts": {
      hasVerticalCard: true,
      verticalCardTitle: "Most Requested Activities",
      verticalCardItems: [
        { name: "City Tour", requests: 80, completed: 55, image: "https://image.vietnamnews.vn/uploadvnnews/Article/2025/1/9/396482_Visual.jpeg" },
        { name: "Beach Day", requests: 75, completed: 68, image: "https://fyi50plus.com/wp-content/uploads/2024/04/grandparents-raising-grandchildren-W-jpg.webp" },
        { name: "Cultural Visit", requests: 70, completed: 62, image: "https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2015/6/25/1435228611797/b2c7829a-1917-463d-a0ae-c62e944f1e4b-2060x1236.jpeg?width=700&quality=85&auto=format&fit=max&s=37d9b9ac8a60d6882541a8bd2cf85925" },
        { name: "Adventure Tour", requests: 65, completed: 58, image: "https://www.centralasia-travel.com/upload/tiles/bike-uzbekistan.jpg" },
        { name: "Shopping Trip", requests: 60, completed: 55, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8ipA6E17y4LoKuHtZWjuJkPWWFPAUIkc5-w&s" }
      ]
    },
    "Laundry": {
      hasVerticalCard: false,
      verticalCardTitle: "",
      verticalCardItems: []
    },
    "In-room delivery": {
      hasVerticalCard: true,
      verticalCardTitle: "Most Requested items",
      verticalCardItems: [
        { name: "Room Service", requests: 80, completed: 55, image: "https://www.wayfairertravel.com/hs-fs/hubfs/Imported%20sitepage%20images/shutterstock_2398908619_fbl654.jpg?width=1920&height=590&name=shutterstock_2398908619_fbl654.jpg" },
        { name: "Food Delivery", requests: 75, completed: 68, image: "https://www.moxeemarketing.com/wp-content/uploads/2023/08/Long-boat-and-rocks-on-railay-beach-in-Krabi-Thailand.jpg" },
        { name: "Beverages", requests: 70, completed: 65, image: "https://image.vietnamnews.vn/uploadvnnews/Article/2025/1/9/396482_Visual.jpeg" },
        { name: "Snacks", requests: 65, completed: 60, image: "https://fyi50plus.com/wp-content/uploads/2024/04/grandparents-raising-grandchildren-W-jpg.webp" },
        { name: "Amenities", requests: 58, completed: 52, image: "https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2015/6/25/1435228611797/b2c7829a-1917-463d-a0ae-c62e944f1e4b-2060x1236.jpeg?width=700&quality=85&auto=format&fit=max&s=37d9b9ac8a60d6882541a8bd2cf85925" }
      ]
    }
  }
  const subscriptionsContent = (
    <div className="space-y-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between px-6">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">General</h2>
          <p className="text-sm text-[#535862] font-normal leading-5">
            Get a quick overview of your hotel's key performance and activities.
          </p>
        </div>
        <div className="flex items-center border border-[#CED4DA] rounded-md">
          <button className="px-4 py-2 bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors rounded-l-md border-r border-[#CED4DA]">
            Week
          </button>
          <button className="px-4 py-2 bg-white text-[rgba(33,33,33,0.60)] text-sm font-medium hover:bg-muted/80 transition-colors border-r border-[#CED4DA]">
            Month
          </button>
          <button className="px-4 py-2 bg-white text-[rgba(33,33,33,0.60)] text-sm font-medium hover:bg-muted/80 transition-colors border-r border-[#CED4DA]">
            Day
          </button>
          <button className="px-4 py-2 bg-white text-[rgba(33,33,33,0.60)] text-sm font-medium hover:bg-muted/80 transition-colors flex items-center gap-2 rounded-r-md">
            <PublicIcon src="/assets/icons/calendar.svg" alt="Calendar" width={16} height={16} />
            Dates range
          </button>
        </div>
      </div>

      <div className="h-px flex-shrink-0 self-stretch w-full">
        <div className="w-full h-px bg-black/[0.08]"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 px-6">
        <StatCard
          icon={
            <div className="flex items-center justify-center rounded-full w-9 h-9 bg-[#E9EAEC]">
              <PublicIcon src="/assets/icons/bed-bunk.svg" alt="Total Room" width={20} height={20} />
            </div>
          }
          label="Total Room" 
          value={roomStats.totalRooms.toString()} 
          change="+2%"
          changeType="positive"
          changeLabel="vs last week" 
          isLoading={isLoadingRooms}
        />
        <StatCard
          icon={
            <div className="flex items-center justify-center rounded-full w-9 h-9 bg-[rgba(23,178,106,0.05)]">
              <PublicIcon src="/assets/icons/close.svg" alt="Empty rooms" width={20} height={20} />
            </div>
          }
          label="Empty rooms" 
          value={roomStats.emptyRooms.toString()}
          change="+2%"
          changeType="positive"
          changeLabel="vs last week" 
          isLoading={isLoadingRooms}
        />
        <StatCard
          icon={
            <div className="flex items-center justify-center rounded-full w-9 h-9 bg-[#EEF2FB]">
              <PublicIcon src="/assets/icons/users-01.svg" alt="Full rooms" width={20} height={20} />
            </div>
          }
          label="Full rooms" 
          value={roomStats.fullRooms.toString()} 
          change="+2%" 
          changeType="positive" 
          changeLabel="vs last week" 
          isLoading={isLoadingRooms}
        />
        <StatCard
          icon={
            <div className="flex items-center justify-center rounded-full w-9 h-9 bg-[rgba(12,151,161,0.05)]">
              <PublicIcon src="/assets/icons/user-group.svg" alt="Members" width={20} height={20} className="brightness-0 saturate-100 invert-[27%] sepia-[51%] saturate-[2878%] hue-rotate-[145deg] brightness-[96%] contrast-[87%]" />
            </div>
          }
          label="Members" 
          value={memberCount.toString()}
          change="+2%"
          changeType="positive"
          changeLabel="vs last week" 
          isLoading={isLoadingMembers}
        />
        <StatCard
          icon={
            <div className="flex items-center justify-center rounded-full w-9 h-9 bg-[rgba(212,122,18,0.05)]">
              <PublicIcon src="/assets/icons/briefcase-06.svg" alt="Staffs" width={20} height={20} />
            </div>
          }
          label="Staffs" 
          value={staffCount.toString()} 
          change="+2%"
          changeType="positive"
          changeLabel="vs last week" 
          isLoading={isLoadingStaff}
        />
      </div>

      {/* Charts */}
      <div className="space-y-6 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <PartnerRevenueChart />
        </div>

        {/* Requests Card */}
        <div className="flex flex-col w-full max-w-[450px] justify-between">
          {/* Header */}
          <div className="h-16 flex items-center py-3 px-4 bg-[#FCFCFC] border border-[#E9EAEB] rounded-t-xl">
            <h3 className="text-sm font-semibold text-[#212121]">Requests</h3>
          </div>
          {/* Content */}
          <div className="h-[280px] flex flex-col p-6 pt-12 bg-white border border-[#E9EAEB] rounded-b-xl -mt-4 " style={{borderTopLeftRadius : '14px', borderTopRightRadius: "14px"}}>
            <div className="text-center items-center mb-8">
              {isLoadingRequestStats ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-gray-500">Loading...</p>
                </div>
              ) : (
                <>
                  <p className="text-4xl font-bold text-[#212121] mb-3">
                    {requestStats.total} <span className="text-[18px]">Requests</span>
                  </p>
                  <p className={`text-sm font-medium ${requestStats.isIncrease ? 'text-[#10B981]' : 'text-[#FF0D0D]'}`}>
                    {requestStats.isIncrease ? '+' : '-'}{requestStats.percentageChange}% vs last week
                  </p>
                </>
              )}
            </div>

            {/* Half Circle Progress Chart with Legend Inside */}
            <div className="w-full h-40 flex items-center justify-center mt-auto relative">
              {isLoadingRequestStats || requestStats.total === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-gray-500">
                    {isLoadingRequestStats ? 'Loading...' : 'No requests data'}
                  </p>
                </div>
              ) : (
                <>
              <svg className="w-4/5 h-full" viewBox="0 0 400 180">
                {/* Background semicircle */}
                <path
                  d="M 50 160 A 150 150 0 0 1 350 160"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="20"
                />
                    {/* Accepted segment - from left to right */}
                    {requestStats.accepted > 0 && (() => {
                      const totalCircumference = 471.2 // Full semicircle circumference
                      const acceptedPercentage = requestStats.accepted / requestStats.total
                      const acceptedLength = totalCircumference * acceptedPercentage
                      return (
                <path
                  d="M 50 160 A 150 150 0 0 1 350 160"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="20"
                          strokeDasharray={`${acceptedLength} ${totalCircumference}`}
                          strokeDashoffset="0"
                  strokeLinecap="round"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ pointerEvents: 'stroke' }}
                  onMouseEnter={(e) => {
                    const tooltip = document.getElementById('chart-tooltip');
                    const tooltipText = document.getElementById('tooltip-text');
                    if (tooltip && tooltipText) {
                              tooltipText.textContent = requestStats.accepted.toString();
                      tooltip.style.display = 'block';
                      const chartContainer = e.currentTarget.closest('.relative');
                      if (chartContainer) {
                        const rect = chartContainer.getBoundingClientRect();
                        const x = e.clientX - rect.left - 17.5;
                        const y = e.clientY - rect.top - 17.5;
                        tooltip.style.left = x + 'px';
                        tooltip.style.top = y + 'px';
                      }
                    }
                  }}
                  onMouseLeave={() => {
                    const tooltip = document.getElementById('chart-tooltip');
                    if (tooltip) {
                      tooltip.style.display = 'none';
                    }
                  }}
                />
                      )
                    })()}
                    {/* Canceled segment - from right to left */}
                    {requestStats.canceled > 0 && (() => {
                      const totalCircumference = 471.2
                      const canceledPercentage = requestStats.canceled / requestStats.total
                      const canceledLength = totalCircumference * canceledPercentage
                      // Position at the right end (end of path) and draw backwards
                      // Offset positions the segment starting from the right end
                      const canceledOffset = -(totalCircumference - canceledLength)
                      return (
                <path
                  d="M 50 160 A 150 150 0 0 1 350 160"
                  fill="none"
                          stroke="rgba(255, 13, 13, 0.5)"
                  strokeWidth="20"
                          strokeDasharray={`${canceledLength} ${totalCircumference}`}
                          strokeDashoffset={canceledOffset}
                  strokeLinecap="round"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ pointerEvents: 'stroke' }}
                  onMouseEnter={(e) => {
                    const tooltip = document.getElementById('chart-tooltip');
                    const tooltipText = document.getElementById('tooltip-text');
                    if (tooltip && tooltipText) {
                              tooltipText.textContent = requestStats.canceled.toString();
                      tooltip.style.display = 'block';
                      const chartContainer = e.currentTarget.closest('.relative');
                      if (chartContainer) {
                        const rect = chartContainer.getBoundingClientRect();
                        const x = e.clientX - rect.left - 17.5;
                        const y = e.clientY - rect.top - 17.5;
                        tooltip.style.left = x + 'px';
                        tooltip.style.top = y + 'px';
                      }
                    }
                  }}
                  onMouseLeave={() => {
                    const tooltip = document.getElementById('chart-tooltip');
                    if (tooltip) {
                      tooltip.style.display = 'none';
                    }
                  }}
                />
                      )
                    })()}
                
                {/* Legend with colored circles */}
                <circle cx="90" cy="130" r="5" fill="#10B981" />
                <text
                  x="100"
                  y="135"
                  textAnchor="start"
                  className="text-medium font-medium fill-[#000000]"
                >
                  Accepted
                </text>

                    <circle cx="230" cy="130" r="5" fill="rgba(255, 13, 13, 0.5)" />
                <text
                  x="240"
                  y="135"
                  textAnchor="start"
                  className="text-medium font-medium fill-[#000000]"
                >
                  Canceled
                </text>
              </svg>
              
              {/* Hover Tooltip */}
              <div
                id="chart-tooltip"
                    className="absolute hidden pointer-events-none z-10 w-[35px] h-[35px] bg-white rounded-full shadow-md border border-[#E5E7EB] flex items-center justify-center text-center"
                  >
                    <span id="tooltip-text" className="text-sm font-semibold text-black leading-none flex items-center justify-center w-full h-full">
                      {requestStats.accepted}
                </span>
              </div>
                </>
              )}
            </div>
          </div>
          </div>
        </div>

        {/* Empty/Full Rooms Weekly Chart */}
        <div className="flex flex-col w-full">
          <div className="h-16 flex items-center py-3 px-4 bg-[#FCFCFC] border border-[#E9EAEB] rounded-t-xl">
            <h3 className="text-sm font-semibold text-[#212121]">Room Occupancy (Weekly)</h3>
          </div>
          <div className="h-[280px] p-6 bg-white border border-[#E9EAEB] rounded-b-xl -mt-4 relative">
            {isLoadingWeeklyStats ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-gray-500">Loading...</p>
              </div>
            ) : weeklyRoomStats.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyRoomStats}>
                    <CartesianGrid strokeDasharray="0" stroke="#E5E7EB" horizontal={true} vertical={false} />
                    <XAxis 
                      dataKey="week" 
                      stroke="transparent" 
                      fontSize={12}
                      tick={{ fill: '#535862', fontSize: '12px', fontWeight: '500' }}
                    />
                    <YAxis 
                      stroke="transparent" 
                      fontSize={12} 
                      tick={{ fill: '#535862', fontSize: '12px', fontWeight: '500' }}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-white border border-[#EFEFEF] rounded-lg shadow-lg p-3">
                              <p className="text-xs font-semibold text-[#080808] mb-2">{data.week}</p>
                              <div className="space-y-1">
                                <p className="text-xs text-[#080808]">
                                  Empty: <span className="font-semibold">{data.empty}</span>
                                </p>
                                <p className="text-xs text-[#080808]">
                                  Full: <span className="font-semibold">{data.full}</span>
                                </p>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Line 
                      type="linear" 
                      dataKey="empty" 
                      stroke="#10B981" 
                      strokeWidth={2.5} 
                      name="Empty"
                      dot={{ fill: '#10B981', stroke: '#FFFFFF', strokeWidth: 1.2, r: 4.8 }}
                    />
                    <Line 
                      type="linear" 
                      dataKey="full" 
                      stroke="#4195BF" 
                      strokeWidth={2.5} 
                      name="Full"
                      dot={{ fill: '#4195BF', stroke: '#FFFFFF', strokeWidth: 1.2, r: 4.8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="absolute bottom-4 left-6 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
                    <span className="text-xs text-[#6B7280]">Empty</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#4195BF]"></div>
                    <span className="text-xs text-[#6B7280]">Full</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-gray-500">No data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const servicesContent = (
    <div className="space-y-6 mb-6">
      <div className="h-px flex-shrink-0 self-stretch w-full">
        <div className="w-full h-px bg-black/[0.08]"></div>
      </div>
      
      {/* Header */}
      <div className="flex items-center justify-between px-6">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">Services</h2>
          <p className="text-sm text-[#535862] font-normal leading-5">
            Track and analyze all service activities
          </p>
        </div>
        
        {/* Service Navigation Row */}
        <div className="flex items-center gap-2 p-2 rounded-xl border border-[#DDDFE3] bg-white max-w-fit">
        {[
          "Housekeeping",
          "Bookings interns", 
          "Customized services",
          "Activity alerts",
          "Laundry",
          "In-room delivery"
          ].map((service) => (
          <button 
            key={service}
            onClick={() => setSelectedService(service)}
              className={`px-3 py-2 rounded-xl text-sm font-normal transition-colors ${
              service === selectedService 
                  ? "bg-[#E9EAEC] text-[#1F2A44] border  border-[#DDDFE3] " 
                  : " text-[#00000099]"
            }`}
          >
            {service}
          </button>
        ))}
      </div>
      </div>

      <div className="h-px flex-shrink-0 self-stretch w-full">
      <div className="w-full h-px bg-black/[0.08]"></div>
       </div>

      {/* Service-specific content */}
    <div className="space-y-4">
        {/* Header with filters */}
      <div className="flex items-center justify-between px-6">
        <div>
            <h5 className="text-foreground mb-1">{selectedService}</h5>
        </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-[#CED4DA] rounded-md">
              <button 
                onClick={() => setServiceTimePeriod("week")}
                className={`px-4 py-2 text-sm font-medium transition-colors rounded-l-md border-r border-[#CED4DA] ${
                  serviceTimePeriod === "week" 
                    ? "bg-[#1F2A44] text-white hover:bg-[#1F2A44]/90" 
                    : "bg-white text-[rgba(33,33,33,0.60)] hover:bg-muted/80"
                }`}
              >
            Week
          </button>
              <button 
                onClick={() => setServiceTimePeriod("month")}
                className={`px-4 py-2 text-sm font-medium transition-colors border-r border-[#CED4DA] ${
                  serviceTimePeriod === "month" 
                    ? "bg-[#1F2A44] text-white hover:bg-[#1F2A44]/90" 
                    : "bg-white text-[rgba(33,33,33,0.60)] hover:bg-muted/80"
                }`}
              >
            Month
          </button>
              <button 
                onClick={() => setServiceTimePeriod("day")}
                className={`px-4 py-2 text-sm font-medium transition-colors border-r border-[#CED4DA] ${
                  serviceTimePeriod === "day" 
                    ? "bg-[#1F2A44] text-white hover:bg-[#1F2A44]/90" 
                    : "bg-white text-[rgba(33,33,33,0.60)] hover:bg-muted/80"
                }`}
              >
            Day
          </button>
              <button 
                onClick={() => setServiceTimePeriod("custom")}
                className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 rounded-r-md border-r border-[#CED4DA] ${
                  serviceTimePeriod === "custom" 
                    ? "bg-[#1F2A44] text-white hover:bg-[#1F2A44]/90" 
                    : "bg-white text-[rgba(33,33,33,0.60)] hover:bg-muted/80"
                }`}
              >
            <PublicIcon src="/assets/icons/calendar.svg" alt="Calendar" width={16} height={16} />
            Dates range
          </button>
        </div>
            {/* Priority dropdown for all services */}
            <div className="relative inline-block">
              <select className="appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 py-[7.52px] px-3 pr-8 rounded border border-[#CED4DA] bg-white text-[rgba(33,33,33,0.60)] text-[13px] font-normal leading-[19.5px]">
                <option>Priority</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <RiArrowDownSLine className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Additional filters for In-room delivery */}
            {selectedService === "In-room delivery" && (
              <>
                {/* Restaurant dropdown */}
                <div className="relative inline-block">
                  <select className="appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 py-[7.52px] px-3 pr-8 rounded border border-[#CED4DA] bg-white text-[rgba(33,33,33,0.60)] text-[13px] font-normal leading-[19.5px]">
                    <option>Restaurant</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <RiArrowDownSLine className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                
                {/* Pick up dropdown */}
                <div className="relative inline-block">
                  <select className="appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 py-[7.52px] px-3 pr-8 rounded border border-[#CED4DA] bg-white text-[rgba(33,33,33,0.60)] text-[13px] font-normal leading-[19.5px]">
                    <option>Pick up</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <RiArrowDownSLine className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </>
            )}
          </div>
      </div>

      <div className="h-px flex-shrink-0 self-stretch w-full">
        <div className="w-full h-px bg-black/[0.08]"></div>
      </div>

        {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-6">
          {isLoadingServiceStats ? (
            Array.from({ length: 6 }).map((_, index) => (
              <StatCard 
                key={index}
                label="Loading..." 
                value="0" 
                showHeadingBorder={true}
              />
            ))
          ) : (
            Object.entries(serviceStats.metrics).map(([label, value], index) => {
              const percentage = (serviceStats.percentageChanges[label as keyof typeof serviceStats.percentageChanges] || 0) as number
              const isPositive = percentage >= 0
              const changeValue = `${isPositive ? '+' : ''}${Math.abs(percentage).toFixed(0)}%`
              const periodLabel = serviceStats.periodLabel || "last week"
              
              return (
            <StatCard 
              key={index}
              label={label} 
              value={value} 
                  change={changeValue}
                  changeType={isPositive ? "positive" : "negative"} 
                  changeLabel={`vs ${periodLabel}`}
              showHeadingBorder={true}
            />
              )
            })
          )}
      </div>

        {/* Bottom Row - Line Graph and Optional Vertical Card */}
        <div className={`grid gap-6 px-6 ${servicesData[selectedService as keyof typeof servicesData].hasVerticalCard ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {/* Requests Activity Line Graph */}
          <div className={servicesData[selectedService as keyof typeof servicesData].hasVerticalCard ? "lg:col-span-2" : ""}>
          <div className="flex flex-col w-full">
            {/* Header */}
            <div className="h-16 flex items-center py-3 px-4 bg-[#FCFCFC] border border-[#E9EAEB] rounded-t-xl">
              <h3 className="text-sm font-semibold text-[#212121]">Requests Activity</h3>
            </div>
            {/* Content */}
              <div className="h-[280px] p-3 bg-white border border-[#E9EAEB] rounded-b-xl -mt-4 relative" style={{borderTopLeftRadius : '14px', borderTopRightRadius: "14px"}}>
              {/* Chart container */}
              <div className="w-full h-full relative">
                {/* Y-axis label */}
              
                
                {/* Chart area */}
                  <div className="w-full h-full ">
                  
                  {/* Line chart - same structure as revenue chart */}
                  <div className="w-full h-[calc(100%-0.1rem)] relative mt-auto" style={{ outline: 'none' }} onFocus={(e) => e.target.blur()}>
                    {isLoadingServiceStats ? (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-gray-500">Loading...</p>
                      </div>
                    ) : serviceTimeSeries.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%" style={{ outline: 'none' }}>
                        <LineChart data={serviceTimeSeries.map(item => ({
                          month: item.date,
                          requests: item.requests,
                          change: "+0%"
                        }))}>
                        <CartesianGrid strokeDasharray="0" stroke="#E5E7EB" horizontal={true} vertical={false} />
                        <XAxis 
                          dataKey="month" 
                          stroke="transparent" 
                          fontSize={12}
                          tick={{ fill: '#535862', fontSize: '12px', fontWeight: '500' }}
                          label={{ 
                            value: serviceTimePeriod === 'day' ? 'Hours' : serviceTimePeriod === 'week' ? 'Week days' : serviceTimePeriod === 'month' ? 'Weeks' : 'Days', 
                            position: 'insideBottom', 
                            offset: -5, 
                            style: { textAnchor: 'middle', fontSize: '12px', fill: '#535862', fontWeight: '500', lineHeight: '18px' } 
                          }}
                        />
                        <YAxis 
                          stroke="transparent" 
                          fontSize={12} 
                          domain={[0, 'auto']}
                          tick={{ fill: '#535862', fontSize: '12px', fontWeight: '500' }}
                          label={{ value: 'Nbr', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '12px', fill: '#535862', fontWeight: '500', lineHeight: '18px' } }}
                        />
                        <Tooltip 
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              const changeValue = data.change;
                              const isPositive = changeValue.startsWith('+');
                              const changeColor = isPositive ? '#1DBF73' : '#FF0D0D';
                              
                              return (
                                <div style={{
                                  width: '170px',
                                  height: '50px',
                                  borderWidth: '1px',
                                  paddingTop: '10px',
                                  paddingRight: '15px',
                                  paddingBottom: '10px',
                                  paddingLeft: '10px',
                                  borderRadius: '10px',
                                  background: '#FFFFFF',
                                  border: '1px solid #EFEFEF',
                                  boxShadow: '0px 1px 3px 0px #00000005, 0px 6px 10px 0px #B1B1B114',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}>
                                  {/* Logo */}
                                  <div style={{
                                    width: '28px',
                                    height: '28px',
                                    gap: '1.5px',
                                    borderWidth: '0.5px',
                                    borderRadius: '50px',
                                    padding: '4px',
                                    background: '#1F2A44',
                                    border: '0.5px solid #E9E9E9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}>
                                    <svg width="12" height="12" viewBox="0 0 8 8" fill="none">
                                      <path d="M1 2h6v4H1V2z" fill="white"/>
                                      <path d="M2 3h4v2H2V3z" fill="#1F2A44"/>
                                      <path d="M3 4h2v1H3V4z" fill="white"/>
                    </svg>
                                  </div>
                                  
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                    {/* Y-axis value */}
                                    <div style={{
                                      width: '80px',
                                      height: '15px',
                                      fontWeight: '600',
                                      fontSize: '11px',
                                      lineHeight: '15px',
                                      letterSpacing: '0%',
                                      textAlign: 'left',
                                      color: '#080808'
                                    }}>
                                      {data.requests} request
                                    </div>
                                    
                                    {/* Change percentage */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                      <span style={{
                                        color: changeColor,
                                        fontWeight: '600',
                                        fontSize: '9px',
                                        lineHeight: '15px',
                                        letterSpacing: '0%',
                                        textAlign: 'center'
                                      }}>
                                        {changeValue}
                                      </span>
                                      <span style={{
                                        color: '#878787',
                                        fontWeight: '600',
                                        fontSize: '9px',
                                        lineHeight: '15px',
                                        letterSpacing: '0%',
                                        textAlign: 'center'
                                      }}>
                                        from last week
                                      </span>
                    </div>
                  </div>
                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Line 
                          type="linear" 
                          dataKey="requests" 
                          stroke="#4195BF" 
                          strokeWidth={2.5} 
                          dot={{ 
                            fill: '#56C6FF', 
                            stroke: '#FFFFFF', 
                            strokeWidth: 1.2, 
                            r: 4.8,
                            style: { 
                              boxShadow: '0px 0px 44px 0px #0000001A'
                            }
                          }}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-gray-500">No data available</p>
                      </div>
                    )}
                  </div>
                </div>
                
                
                {/* Legend - positioned at top right */}
                {!isLoadingServiceStats && serviceTimeSeries.length > 0 && (
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#2563EB]"></div>
                  <span className="text-sm text-[#6B7280]">Requests</span>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>

          {/* Most Requested Items/Services/Activities Card - Only show if hasVerticalCard is true */}
          {servicesData[selectedService as keyof typeof servicesData].hasVerticalCard && (
        <div className="flex flex-col w-full">
          {/* Header */}
          <div className="h-16 flex items-center py-3 px-4 bg-[#FCFCFC] border border-[#E9EAEB] rounded-t-xl">
                <h3 className="text-sm font-semibold text-[#212121]">{servicesData[selectedService as keyof typeof servicesData].verticalCardTitle}</h3>
          </div>
          {/* Content */}
              <div className="h-[280px] p-4 bg-white border border-[#E9EAEB] rounded-b-xl -mt-4 overflow-y-auto" style={{borderTopLeftRadius : '14px', borderTopRightRadius: "14px"}}>
            <div className="space-y-0">
                  {servicesData[selectedService as keyof typeof servicesData].verticalCardItems.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center gap-3 py-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#212121] truncate">
                            {item.name}
                      </p>
                      <p className="text-xs text-[#6B7280]">
                            Requests: <span className="font-semibold">{item.requests}</span> | Completed:{" "}
                            <span className="font-semibold">{item.completed}</span>
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0 overflow-hidden">
                      <img
                            src={item.image}
                            alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                      {index < servicesData[selectedService as keyof typeof servicesData].verticalCardItems.length - 1 && (
                    <div className="h-px bg-[#E9ECF1] w-full" />
                  )}
                </div>
              ))}
            </div>
          </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )


  return (
    <div className="">
      {/* Actions Rapide Header */}
      <div className="flex items-center justify-between border-b w-full h-[77px] px-5 py-2.5">
        {/* Left side - Actions rapide text */}
        <p className="text-[#00000099] font-medium text-sm leading-normal">
          Actions rapide
        </p>

        {/* Right side - Action buttons */}
        <div className="flex items-center gap-3">
          {/* Add new ticket button */}
          <button 
            onClick={() => router.push('/partner/pages/support')}
            className="flex items-center gap-1.5 rounded-md border border-[#DDDFE3] bg-[#E9EAEC] px-5 py-2 transition-colors hover:bg-gray-100"
          >
            <PublicIcon src="/assets/icons/status error.svg" alt="Add new ticket" width={16} height={16} />
            <span className="text-sm font-medium text-[#212121]">Add new ticket</span>
          </button>

          {/* Add Member button */}
          <button 
            onClick={() => router.push('/partner/pages/team')}
            className="flex items-center gap-1.5 rounded-md border border-[#DDDFE3] bg-[#E9EAEC] px-5 py-2 transition-colors hover:bg-gray-100"
          >
            <PublicIcon src="/assets/icons/user-group.svg" alt="Add Member" width={16} height={16} />
            <span className="text-sm font-medium text-[#212121]">Add Member</span>
          </button>

          {/* Add Staff button */}
          <button 
            onClick={() => router.push('/partner/pages/team')}
            className="flex items-center gap-1.5 rounded-md border border-[#DDDFE3] bg-[#E9EAEC] px-5 py-2 transition-colors hover:bg-gray-100"
          >
            <PublicIcon src="/assets/icons/briefcase-06.svg" alt="Add Staff" width={16} height={16} className="brightness-0 saturate-100" />
            <span className="text-sm font-medium text-[#212121]">Add Staff</span>
          </button>

          {/* More button */}
          <button className="flex items-center gap-1.5 rounded-md border border-[#DDDFE3] bg-[#E9EAEC] px-5 py-2 transition-colors">
            <PublicIcon src="/assets/icons/menu-01.svg" alt="More" width={16} height={16} />
            <span className="text-sm font-medium text-[#212121]">More</span>
          </button>
        </div>
      </div>

      {/* All Sections in Vertical Layout */}
      <div className=" mt-6">
        {/* Subscriptions Section */}
        <div id="subscriptions">
          {subscriptionsContent}
        </div>

        {/* Services Section */}
        <div id="services">
          {servicesContent}
        </div>
      </div>
    </div>
  )
}


