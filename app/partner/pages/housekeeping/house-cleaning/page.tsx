"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { RiFileList3Line, RiHome4Line, RiSettings3Line } from "react-icons/ri"

export default function HouseCleaningPage() {
  const router = useRouter()
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('week')
  const [currentDate, setCurrentDate] = useState(new Date())

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const getDateRange = (date: Date) => {
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay())
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    
    return `${startOfWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
  }

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (calendarView === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
    } else if (calendarView === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
    }
    setCurrentDate(newDate)
  }

  const timeSlots = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM']
  
  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate)
    const dayOfWeek = currentDate.getDay()
    // Adjust so Monday is the first day (0=Sunday becomes 6, 1=Monday becomes 0, etc.)
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    startOfWeek.setDate(currentDate.getDate() - daysToMonday)
    
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      return day
    })
  }

  const getMonthDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({ date: prevMonthLastDay - i, isCurrentMonth: false })
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: i, isCurrentMonth: true })
    }
    // Next month days
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: i, isCurrentMonth: false })
    }
    
    return days
  }

  const tabs = [
    {
      id: "requests",
      label: "Requests",
      icon: <RiFileList3Line className="w-4 h-4" />,
      href: "/partner/pages/housekeeping/requests"
    },
    {
      id: "house-cleaning", 
      label: "House cleaning",
      icon: <RiHome4Line className="w-4 h-4" />,
      href: "/partner/pages/housekeeping/house-cleaning"
    },
    {
      id: "requests-management",
      label: "Requests management", 
      icon: <RiSettings3Line className="w-4 h-4" />,
      href: "/partner/pages/housekeeping/requests-management"
    }
  ]

  return (
    <div className="p-6">
      {/* Tab Navigation */}
      <div className="mb-6 rounded-t-lg">
        <div className="flex items-center border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => router.push(tab.href)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
                tab.id === "house-cleaning"
                  ? "text-foreground border-b-2 border-[#1F2A44] -mb-[2px]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div 
        className="bg-white border border-[#E7E7E7] flex flex-col"
        style={{ 
          borderRadius: "10px",
          padding: "20px",
          gap: "20px"
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-4" style={{ height: "69px" }}>
          {/* Month/Date Box */}
          <div 
            className="relative border border-gray-200"
            style={{ width: "70px", height: "69px", borderRadius: "8px", overflow: "visible" }}
          >
            {/* Hooks on top */}
            <div 
              className="absolute flex"
              style={{ 
                width: "45px", 
                height: "13px", 
                left: "12.5px", 
                top: "-6.5px",
                justifyContent: "space-between"
              }}
            >
              {[1, 2, 3, 4].map((hook) => (
                <div
                  key={hook}
                  style={{
                    width: "6px",
                    height: "13px",
                    borderRadius: "20px",
                    background: "#FFFFFF",
                    border: "1.2px solid #E7E7E7"
                  }}
                />
              ))}
            </div>

            {/* Upper Section - Month */}
            <div 
              className="flex items-center justify-center bg-[#FBFAFA]"
              style={{ 
                width: "100%", 
                height: "50%", 
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px"
              }}
            >
              <span className="text-xs text-gray-500 uppercase">
                {currentDate.toLocaleDateString('en-US', { month: 'short' })}
              </span>
            </div>

            {/* Lower Section - Date */}
            <div 
              className="flex items-center justify-center bg-white"
              style={{ 
                width: "100%", 
                height: "50%", 
                borderBottomLeftRadius: "8px",
                borderBottomRightRadius: "8px"
              }}
            >
              <span className="text-2xl font-bold text-black">
                {currentDate.getDate()}
              </span>
            </div>
          </div>

          {/* Month/Date Range Heading */}
          <div className="flex flex-col gap-1 flex-1">
            <h2 className="text-xl font-bold text-black">
              {getMonthName(currentDate)}
            </h2>
            <p className="text-sm text-gray-500">
              {calendarView === 'week' ? getDateRange(currentDate) : getMonthName(currentDate)}
            </p>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4" style={{ height: "42px" }}>
            {/* Navigation Arrows */}
            <div className="flex items-center" style={{ height: "42px" }}>
              <button
                onClick={() => navigateDate('prev')}
                className="flex items-center justify-center w-14 h-full hover:bg-gray-50"
                style={{ 
                  borderTopLeftRadius: "7px", 
                  borderBottomLeftRadius: "7px", 
                  borderTopRightRadius: "0", 
                  borderBottomRightRadius: "0",
                  border: "1px solid #D1D5DB"
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => navigateDate('next')}
                className="flex items-center justify-center w-14 h-full hover:bg-gray-50"
                style={{ 
                  borderTopLeftRadius: "0", 
                  borderBottomLeftRadius: "0", 
                  borderTopRightRadius: "7px", 
                  borderBottomRightRadius: "7px",
                  border: "1px solid #D1D5DB",
                  borderLeft: "none"
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* View Toggle */}
            <div 
              className="flex items-center p-1 bg-[#EEF0F3]"
              style={{ height: "42px", borderRadius: "10px" }}
            >
              <button
                onClick={() => setCalendarView('month')}
                className={`px-5 py-2 text-sm font-medium transition-all ${
                  calendarView === 'month'
                    ? 'bg-white text-black rounded-lg shadow-sm'
                    : 'text-[#5C5C5C]'
                }`}
                style={{ height: "36px", borderRadius: "8px" }}
              >
                Month
              </button>
              <button
                onClick={() => setCalendarView('week')}
                className={`px-5 py-2 text-sm font-medium transition-all ${
                  calendarView === 'week'
                    ? 'bg-white text-black rounded-lg shadow-sm'
                    : 'text-[#5C5C5C]'
                }`}
                style={{ height: "36px", borderRadius: "8px" }}
              >
                Week
              </button>
              <button
                onClick={() => setCalendarView('day')}
                className={`px-5 py-2 text-sm font-medium transition-all ${
                  calendarView === 'day'
                    ? 'bg-white text-black rounded-lg shadow-sm'
                    : 'text-[#5C5C5C]'
                }`}
                style={{ height: "36px", borderRadius: "8px" }}
              >
                Day
              </button>
            </div>

            {/* Save Changes Button */}
            <button className="px-5 py-2 bg-[#1F2A44] text-white text-sm font-semibold rounded-lg hover:bg-[#1F2A44]/90">
              Save Changes
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        {calendarView === 'week' && (
          <div className="rounded-lg border border-[#E7E7E7] overflow-auto flex-1">
            <div className="grid h-full" style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}>
              {/* Time Column Header */}
              <div className="border-b border-r border-[#E7E7E7]" style={{ background: "#F4F6F8", borderLeft: "1px solid #E7E7E7" }}></div>
              
              {/* Day Headers */}
              {getWeekDays().map((day, index) => (
                <div
                  key={index}
                  className="border-b border-r border-[#E7E7E7] p-2 text-center last:border-r-0"
                >
                  <div className="text-xs text-gray-500">
                    {day.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}, {day.getDate()}
                  </div>
                </div>
              ))}

              {/* Time Slots and Grid */}
              {timeSlots.map((time, timeIndex) => (
                <div key={timeIndex} className="contents">
                  {/* Time Label */}
                  <div
                    className="border-r border-[#E7E7E7] p-2 text-xs text-gray-500"
                    style={{ height: "64px", background: "#F4F6F8", borderLeft: "1px solid #E7E7E7" }}
                  >
                    {time}
                  </div>
                  
                  {/* Day Cells */}
                  {getWeekDays().map((day, dayIndex) => {
                    const showOff = timeIndex >= timeSlots.length - 2 || dayIndex === 6
                    return (
                      <div
                        key={dayIndex}
                        className="border-r border-b border-[#E7E7E7] p-2 hover:bg-gray-50 cursor-pointer last:border-r-0 flex items-center justify-center"
                        style={{ height: "64px", background: showOff ? "#F9F9F9" : "#FFFFFF" }}
                      >
                        {showOff && <div className="text-xs text-center" style={{ color: "#0A0A0A" }}>OFF</div>}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {calendarView === 'month' && (
          <div className="flex-1">
            <div className="grid grid-cols-7">
              {/* Day Headers */}
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, index) => (
                <div 
                  key={day} 
                  className="text-center text-xs font-semibold py-2 px-5"
                  style={{ 
                    height: "38px",
                    borderTop: "1px solid #E7E7E7",
                    borderBottom: "1px solid #E7E7E7",
                    borderLeft: "1px solid #E7E7E7",
                    borderRight: index === 6 ? "1px solid #E7E7E7" : "none",
                    borderTopLeftRadius: index === 0 ? "10px" : "0",
                    borderTopRightRadius: index === 6 ? "10px" : "0",
                    color: "#5C5C5C"
                  }}
                >
                  {day}
                </div>
              ))}

              {/* Calendar Days */}
              {getMonthDays().map((day, index) => {
                const isLastRow = index >= 35
                const isLastCol = (index + 1) % 7 === 0
                const isFirstCol = index % 7 === 0
                
                return (
                  <div
                    key={index}
                    className={`p-2 ${
                      !day.isCurrentMonth ? 'bg-gray-50' : 'hover:bg-gray-50 cursor-pointer'
                    }`}
                    style={{ 
                      minHeight: "90px",
                      borderLeft: "1px solid #E7E7E7",
                      borderRight: isLastCol ? "1px solid #E7E7E7" : "none",
                      borderBottom: "1px solid #E7E7E7",
                      borderBottomLeftRadius: isLastRow && isFirstCol ? "10px" : "0",
                      borderBottomRightRadius: isLastRow && isLastCol ? "10px" : "0"
                    }}
                  >
                    <div className={`text-sm ${day.isCurrentMonth ? 'text-black' : 'text-gray-400'}`}>
                      {day.date}
                    </div>
                    {!day.isCurrentMonth && (
                      <div className="flex items-center justify-center mt-2">
                        <div className="text-xs" style={{ color: "#0A0A0A" }}>OFF</div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {calendarView === 'day' && (
          <div className="rounded-lg border border-[#E7E7E7] overflow-auto flex-1">
            <div className="grid grid-cols-[80px_1fr] h-full">
              {/* Time Column Header */}
              <div className="border-b border-r border-[#E7E7E7]"></div>
              
              {/* Day Header */}
              <div className="border-b border-r border-[#E7E7E7] p-2 text-center">
                <div className="text-xs text-gray-500">
                  {currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()}
                </div>
              </div>

              {/* Time Slots */}
              {timeSlots.map((time, index) => (
                <div key={index} className="contents">
                  <div className="border-r border-b border-[#E7E7E7] p-2 text-xs text-gray-500" style={{ height: "64px" }}>
                    {time}
                  </div>
                  <div className="border-r border-b border-[#E7E7E7] p-2 hover:bg-gray-50 cursor-pointer" style={{ height: "64px" }}>
                    <div className="text-xs text-gray-400 text-center">OFF</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

