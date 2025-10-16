"use client"

import StatCard from "@/app/superadmin/components/stat-card"
import Tabs from "@/app/superadmin/components/tabs"
import RevenueChart from "@/app/superadmin/components/revenue-chart"
import SubscribersChart from "@/app/superadmin/components/subscribers-chart"
import RevenueIcon from "@/app/superadmin/components/revenue-icon"
import StaffIcon from "@/app/superadmin/components/staff-icon"
import PlanIcon from "@/app/superadmin/components/plan-icon"
import InvoiceIcon from "@/app/superadmin/components/invoice-icon"
import SubscriptionIcon from "@/app/superadmin/components/subscription-icon"
import { useState, useEffect } from "react"

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("subscriptions")
  const [selectedService, setSelectedService] = useState("Housekeeping")

  // Scroll detection to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["subscriptions", "partners"]
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

  // Services data structure
  const servicesData = {
    "Housekeeping": {
      metrics: {
        "Total requests": "3215",
        "New requests": "1256", 
        "Accepted requests": "1020",
        "No-show requests": "33",
        "Completed requests": "1200",
        "Canceled requests": "26"
      },
      hasVerticalCard: true,
      verticalCardTitle: "Most Requested Items",
      verticalCardItems: [
        { name: "Extra Towels", requests: 80, completed: 55, image: "/placeholder.svg?height=40&width=40" },
        { name: "Room Cleaning", requests: 75, completed: 70, image: "/placeholder.svg?height=40&width=40" },
        { name: "Bed Sheets", requests: 65, completed: 60, image: "/placeholder.svg?height=40&width=40" },
        { name: "Toiletries", requests: 58, completed: 50, image: "/placeholder.svg?height=40&width=40" },
        { name: "Mini Bar", requests: 45, completed: 42, image: "/placeholder.svg?height=40&width=40" }
      ]
    },
    "Bookings interns": {
      metrics: {
        "Total requests": "3215",
        "New requests": "1256",
        "Accepted requests": "1020", 
        "Pending requests": "33",
        "Completed requests": "1200",
        "Canceled requests": "26"
      },
      hasVerticalCard: true,
      verticalCardTitle: "Most Requested services",
      verticalCardItems: [
        { name: "Spa Treatment", requests: 80, completed: 55, image: "/placeholder.svg?height=40&width=40" },
        { name: "Restaurant Booking", requests: 78, completed: 56, image: "/placeholder.svg?height=40&width=40" },
        { name: "Pool Access", requests: 72, completed: 68, image: "/placeholder.svg?height=40&width=40" },
        { name: "Gym Session", requests: 65, completed: 58, image: "/placeholder.svg?height=40&width=40" },
        { name: "Concierge", requests: 58, completed: 52, image: "/placeholder.svg?height=40&width=40" }
      ]
    },
    "Customized services": {
      metrics: {
        "Total requests": "3215",
        "New requests": "1256",
        "Accepted requests": "1020",
        "Pending requests": "33", 
        "Completed requests": "1200",
        "Canceled requests": "26"
      },
      hasVerticalCard: false,
      verticalCardTitle: "",
      verticalCardItems: []
    },
    "Activity alerts": {
      metrics: {
        "Total requests": "3215",
        "New requests": "1256",
        "Accepted requests": "1020",
        "Pending requests": "33",
        "Completed requests": "1200", 
        "Canceled requests": "26"
      },
      hasVerticalCard: true,
      verticalCardTitle: "Most Requested Activities",
      verticalCardItems: [
        { name: "City Tour", requests: 80, completed: 55, image: "/placeholder.svg?height=40&width=40" },
        { name: "Beach Day", requests: 75, completed: 68, image: "/placeholder.svg?height=40&width=40" },
        { name: "Cultural Visit", requests: 70, completed: 62, image: "/placeholder.svg?height=40&width=40" },
        { name: "Adventure Tour", requests: 65, completed: 58, image: "/placeholder.svg?height=40&width=40" },
        { name: "Shopping Trip", requests: 60, completed: 55, image: "/placeholder.svg?height=40&width=40" }
      ]
    },
    "Laundry": {
      metrics: {
        "Total requests": "3215",
        "New requests": "1256",
        "Accepted requests": "1020",
        "No-show requests": "33",
        "Completed requests": "1200",
        "Canceled requests": "26"
      },
      hasVerticalCard: false,
      verticalCardTitle: "",
      verticalCardItems: []
    },
    "In-room delivery": {
      metrics: {
        "Total requests": "3215",
        "New requests": "1256",
        "Accepted requests": "1020",
        "Pending requests": "33",
        "Completed requests": "1200",
        "Canceled requests": "26"
      },
      hasVerticalCard: true,
      verticalCardTitle: "Most Requested items",
      verticalCardItems: [
        { name: "Room Service", requests: 80, completed: 55, image: "/placeholder.svg?height=40&width=40" },
        { name: "Food Delivery", requests: 75, completed: 68, image: "/placeholder.svg?height=40&width=40" },
        { name: "Beverages", requests: 70, completed: 65, image: "/placeholder.svg?height=40&width=40" },
        { name: "Snacks", requests: 65, completed: 60, image: "/placeholder.svg?height=40&width=40" },
        { name: "Amenities", requests: 58, completed: 52, image: "/placeholder.svg?height=40&width=40" }
      ]
    }
  }
  const subscriptionsContent = (
    <div className="space-y-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">General</h2>
          <p className="text-sm text-muted-foreground">
            Get a quick overview of your hotel's key performance and activities.
          </p>
        </div>
        <div className="flex items-center " style={{ border: "0.925px solid #CED4DA" }}>
          <button className="px-4 py-2 bg-primary text-white rounded-[1px] text-sm font-medium hover:bg-primary/90 transition-colors" style={{ borderRight: "0.925px solid #CED4DA" }}>
            Week
          </button>
          <button className="px-4 py-2 bg-[#FFF] text-[rgba(33,33,33,0.60)] rounded-[1px] text-sm font-medium hover:bg-muted/80 transition-colors" style={{ borderRight: "0.925px solid #CED4DA" }}>
            Month
          </button>
          <button className="px-4 py-2 bg-[#FFF] text-[rgba(33,33,33,0.60)] rounded-[1px] text-sm font-medium hover:bg-muted/80 transition-colors" style={{ borderRight: "0.925px solid #CED4DA" }}>
            Day
          </button>
          <button className="px-4 py-2 bg-[#FFF] text-[rgba(33,33,33,0.60)] rounded-[1px] text-sm font-medium hover:bg-muted/80 transition-colors" style={{ borderRight: "0.925px solid #CED4DA" }}>
            Dates range
          </button>
        </div>
      </div>

      <div className="h-px flex-shrink-0 self-stretch w-full">
        <div className="w-full h-px bg-black/[0.08]"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2 6h16v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6zM6 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M8 10h4M8 13h2" stroke="#1F2A44" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>}
          label="Total Room" 
          value="65" 
          change="+2%"
          changeType="positive"
          changeLabel="vs last week" 
        />
        <StatCard
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5l10 10" stroke="#1F2A44" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>}
          label="Empty rooms" 
          value="42"
          change="+2%"
          changeType="positive"
          changeLabel="vs last week" 
        />
        <StatCard
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 0 0 1.946-.806 3.42 3.42 0 0 1 4.438 0 3.42 3.42 0 0 0 1.946.806 3.42 3.42 0 0 1 3.138 3.138 3.42 3.42 0 0 0 .806 1.946 3.42 3.42 0 0 1 0 4.438 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1-3.138 3.138 3.42 3.42 0 0 0-1.946.806 3.42 3.42 0 0 1-4.438 0 3.42 3.42 0 0 0-1.946-.806 3.42 3.42 0 0 1-3.138-3.138 3.42 3.42 0 0 0-.806-1.946 3.42 3.42 0 0 1 0-4.438 3.42 3.42 0 0 0 .806-1.946 3.42 3.42 0 0 1 3.138-3.138z" stroke="#1F2A44" strokeWidth="1.5"/>
          </svg>}
          label="Full rooms" 
          value="23" 
          change="+2%" 
          changeType="positive" 
          changeLabel="vs last week" 
        />
        <StatCard
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M13 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM18 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM14 15a4 4 0 0 0-8 0v3h8v-3zM6 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM16 18v-3a5.972 5.972 0 0 0-.75-2.906A3.005 3.005 0 0 1 19 15v3h-3zM4.75 12.094A5.973 5.973 0 0 0 4 15v3H1v-3a3 3 0 0 1 3.75-2.906z" stroke="#1F2A44" strokeWidth="1.5"/>
          </svg>}
          label="Members" 
          value="12"
          change="+2%"
          changeType="positive"
          changeLabel="vs last week" 
        />
        <StatCard
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5zM8 8h4M8 11h2" stroke="#1F2A44" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>}
          label="Staffs" 
          value="33" 
          change="+2%"
          changeType="positive"
          changeLabel="vs last week" 
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>

        {/* Requests Card */}
        <div className="flex flex-col w-full max-w-[450px]">
          {/* Header */}
          <div className="h-[64px] flex items-center px-4 bg-[#FCFCFC] border border-[#E9EAEB]" style={{ borderRadius: "12px 12px 0 0"}}>
            <h3 className="text-sm font-semibold text-[#212121]">Requests</h3>
          </div>
          {/* Content */}
          <div className="h-[400px] flex flex-col items-center justify-center p-6 bg-white border border-[#E9EAEB] rounded-[14px] mt-[-15px]">
            <div className="text-center mb-6">
              <p className="text-3xl font-bold text-[#212121] mb-2">150 Requests</p>
              <p className="text-sm font-medium text-[#10B981]">+31% vs last week</p>
            </div>

            {/* Circular Progress Chart */}
            <div className="relative w-48 h-48 mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                {/* Background circle */}
                <circle cx="100" cy="100" r="70" fill="none" stroke="#E5E7EB" strokeWidth="12" />
                {/* Accepted segment (130/150 = 86.7%) */}
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="12"
                  strokeDasharray="439.6"
                  strokeDashoffset="58.4"
                  strokeLinecap="round"
                />
                {/* Canceled segment (20/150 = 13.3%) */}
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="12"
                  strokeDasharray="58.4 439.6"
                  strokeDashoffset="-381.2"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#212121]">150</p>
                  <p className="text-xs text-[#6B7280]">Requests</p>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
                  <span className="text-sm text-[#6B7280]">Accepted</span>
                </div>
                <span className="text-sm font-semibold text-[#212121]">130</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
                  <span className="text-sm text-[#6B7280]">Canceled</span>
                </div>
                <span className="text-sm font-semibold text-[#212121]">20</span>
              </div>
            </div>
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">Services</h2>
          <p>Track and analyze all service activities</p>
        </div>
        
        {/* Service Navigation Row */}
        <div className="flex items-center gap-2 p-2 rounded-md border border-[#DDDFE3] bg-[#E9EAEC] max-w-fit">
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
              className={`px-3 py-2 rounded-lg text-sm font-normal transition-colors ${
              service === selectedService 
                  ? "bg-[#1F2A44] text-white" 
                  : "bg-[#E9EAEC] text-[#1F2A44] hover:bg-white border border-[#DDDFE3]"
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
      <div className="flex items-center justify-between">
        <div>
            <h5 className="text-foreground mb-1">{selectedService}</h5>
        </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center" style={{ border: "0.925px solid #CED4DA" }}>
              <button className="px-4 py-2 bg-[#1F2A44] text-white rounded-[1px] text-sm font-medium hover:bg-[#1F2A44]/90 transition-colors" style={{ borderRight: "0.925px solid #CED4DA" }}>
            Week
          </button>
          <button className="px-4 py-2 bg-[#FFF] text-[rgba(33,33,33,0.60)] rounded-[1px] text-sm font-medium hover:bg-muted/80 transition-colors" style={{ borderRight: "0.925px solid #CED4DA" }}>
            Month
          </button>
          <button className="px-4 py-2 bg-[#FFF] text-[rgba(33,33,33,0.60)] rounded-[1px] text-sm font-medium hover:bg-muted/80 transition-colors" style={{ borderRight: "0.925px solid #CED4DA" }}>
            Day
          </button>
          <button className="px-4 py-2 bg-[#FFF] text-[rgba(33,33,33,0.60)] rounded-[1px] text-sm font-medium hover:bg-muted/80 transition-colors" style={{ borderRight: "0.925px solid #CED4DA" }}>
            Dates range
          </button>
        </div>
            {/* Additional filters for In-room delivery */}
            {selectedService === "In-room delivery" && (
              <>
                <select className="px-3 py-2 bg-white border border-gray-300 rounded text-sm">
                  <option>Restaurant</option>
                </select>
                <select className="px-3 py-2 bg-white border border-gray-300 rounded text-sm">
                  <option>Pick up</option>
                </select>
              </>
            )}
          </div>
      </div>

      <div className="h-px flex-shrink-0 self-stretch w-full">
        <div className="w-full h-px bg-black/[0.08]"></div>
      </div>

        {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(servicesData[selectedService as keyof typeof servicesData].metrics).map(([label, value], index) => (
            <StatCard 
              key={index}
              label={label} 
              value={value} 
              change="+2%" 
              changeType="positive" 
              changeLabel="vs last week" 
            />
          ))}
      </div>

        {/* Bottom Row - Line Graph and Optional Vertical Card */}
        <div className={`grid gap-6 ${servicesData[selectedService as keyof typeof servicesData].hasVerticalCard ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {/* Requests Activity Line Graph */}
          <div className={servicesData[selectedService as keyof typeof servicesData].hasVerticalCard ? "lg:col-span-2" : ""}>
          <div className="flex flex-col w-full">
            {/* Header */}
            <div className="h-[64px] flex items-center px-4 bg-[#FCFCFC] border border-[#E9EAEB]" style={{ borderRadius: "12px 12px 0 0"}}>
              <h3 className="text-sm font-semibold text-[#212121]">Requests Activity</h3>
            </div>
            {/* Content */}
              <div className="h-[360px] p-6 bg-white border border-[#E9EAEB] rounded-[14px] mt-[-15px] relative">
              {/* Chart container */}
              <div className="w-full h-full relative">
                {/* Y-axis label */}
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs text-[#6B7280] font-medium">
                  Nbr
                </div>
                
                {/* Chart area */}
                <div className="w-full h-full pl-8 pr-4 pb-8 pt-4">
                  {/* Y-axis values */}
                  <div className="absolute left-6 top-4 flex flex-col justify-between h-[calc(100%-4rem)] text-xs text-[#6B7280]">
                    <span>1,000</span>
                    <span>800</span>
                    <span>600</span>
                    <span>400</span>
                    <span>200</span>
                    <span>0</span>
                  </div>
                  
                  {/* Line chart */}
                  <div className="w-full h-[calc(100%-4rem)] relative ml-10">
                    <svg className="w-full h-full" viewBox="0 0 500 250">
                      {/* Grid lines */}
                      <defs>
                        <pattern id="grid" width="62.5" height="50" patternUnits="userSpaceOnUse">
                          <path d="M 62.5 0 L 0 0 0 50" fill="none" stroke="#F3F4F6" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                      
                      {/* Requests line (blue) */}
                      <polyline
                        points="0,200 62.5,50 125,200 187.5,25 250,150 312.5,200 375,100 437.5,175 500,200"
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      
                      {/* Data points */}
                      <circle cx="0" cy="200" r="4" fill="#2563EB" />
                      <circle cx="62.5" cy="50" r="4" fill="#2563EB" />
                      <circle cx="125" cy="200" r="4" fill="#2563EB" />
                      <circle cx="187.5" cy="25" r="4" fill="#2563EB" />
                      <circle cx="250" cy="150" r="4" fill="#2563EB" />
                      <circle cx="312.5" cy="200" r="4" fill="#2563EB" />
                      <circle cx="375" cy="100" r="4" fill="#2563EB" />
                      <circle cx="437.5" cy="175" r="4" fill="#2563EB" />
                      <circle cx="500" cy="200" r="4" fill="#2563EB" />
                    </svg>
                    
                    {/* X-axis labels */}
                    <div className="absolute bottom-[-2rem] left-0 right-0 flex justify-between text-xs text-[#6B7280]">
                      <span>Sep 21</span>
                      <span>Sep 22</span>
                      <span>Sep 23</span>
                      <span>Sep 24</span>
                      <span>Sep 25</span>
                      <span>Sep 26</span>
                      <span>Sep 27</span>
                      <span>Sep 28</span>
                    </div>
                  </div>
                </div>
                
                {/* X-axis label */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-[#6B7280] font-medium">
                  Week days
                </div>
                
                {/* Legend - positioned at top right */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#2563EB]"></div>
                  <span className="text-sm text-[#6B7280]">Requests</span>
                </div>
              </div>
            </div>
          </div>
        </div>

          {/* Most Requested Items/Services/Activities Card - Only show if hasVerticalCard is true */}
          {servicesData[selectedService as keyof typeof servicesData].hasVerticalCard && (
        <div className="flex flex-col w-full">
          {/* Header */}
          <div className="h-[64px] flex items-center px-4 bg-[#FCFCFC] border border-[#E9EAEB]" style={{ borderRadius: "12px 12px 0 0"}}>
                <h3 className="text-sm font-semibold text-[#212121]">{servicesData[selectedService as keyof typeof servicesData].verticalCardTitle}</h3>
          </div>
          {/* Content */}
              <div className="h-[360px] p-4 bg-white border border-[#E9EAEB] rounded-[14px] mt-[-15px] overflow-y-auto">
            <div className="space-y-0">
                  {servicesData[selectedService as keyof typeof servicesData].verticalCardItems.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center gap-3 py-3">
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
                    <div className="h-px bg-[#E9ECF1] mx-3" />
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
    <div className="p-6">
      {/* Actions Rapide Header */}
      <div 
        className="flex items-center justify-between border-b"
        style={{
          width: "100%",
          height: "77.04000091552734px",
        
          left: "261px",
          borderBottomWidth: "1px",
          justifyContent: "space-between",
          padding: "20px 0px",
      
          opacity: 1,
        }}
      >
        {/* Left side - Actions rapide text */}
        <p 
          className="text-[#212121] font-medium"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: "normal",
          }}
        >
          Actions rapide
        </p>

        {/* Right side - Action buttons */}
        <div className="flex items-center gap-3">
          {/* Add new ticket button */}
          <button 
            className="flex items-center gap-[6px] rounded-md border transition-colors"
            style={{
              height: "37.040000915527344px",
              gap: "6px",
              opacity: 1,
              borderRadius: "6px",
              borderWidth: "1px",
              paddingTop: "8.52px",
              paddingRight: "20px",
              paddingBottom: "8.52px",
              paddingLeft: "20px",
              background: "#E9EAEC",
              border: "1px solid #DDDFE3",
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="#212121" strokeWidth="1.5"/>
              <path d="M8 5v6M5 8h6" stroke="#212121" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="text-sm font-medium text-[#212121]">Add new ticket</span>
          </button>

          {/* Add Member button */}
          <button 
            className="flex items-center gap-[6px] rounded-md border transition-colors"
            style={{
              height: "37.040000915527344px",
              gap: "6px",
              opacity: 1,
              borderRadius: "6px",
              borderWidth: "1px",
              paddingTop: "8.52px",
              paddingRight: "20px",
              paddingBottom: "8.52px",
              paddingLeft: "20px",
              background: "#E9EAEC",
              border: "1px solid #DDDFE3",
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8 10c-2.5 0-5 1.5-5 3.5v1h10v-1c0-2-2.5-3.5-5-3.5Z" stroke="#212121" strokeWidth="1.5"/>
              <path d="M12 8a2 2 0 1 1-4 0M14 12c0-1-1-2-2-2s-2 1-2 2" stroke="#212121" strokeWidth="1.5"/>
            </svg>
            <span className="text-sm font-medium text-[#212121]">Add Member</span>
          </button>

          {/* Add Staff button */}
          <button 
            className="flex items-center gap-[6px] rounded-md border transition-colors"
            style={{
              height: "37.040000915527344px",
              gap: "6px",
              opacity: 1,
              borderRadius: "6px",
              borderWidth: "1px",
              paddingTop: "8.52px",
              paddingRight: "20px",
              paddingBottom: "8.52px",
              paddingLeft: "20px",
              background: "#E9EAEC",
              border: "1px solid #DDDFE3",
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" stroke="#212121" strokeWidth="1.5"/>
              <path d="M6 8h4" stroke="#212121" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="text-sm font-medium text-[#212121]">Add Staff</span>
          </button>

          {/* More button */}
          <button 
            className="flex items-center gap-[6px] rounded-md border transition-colors"
            style={{
              height: "37.040000915527344px",
              gap: "6px",
              opacity: 1,
              borderRadius: "6px",
              borderWidth: "1px",
              paddingTop: "8.52px",
              paddingRight: "20px",
              paddingBottom: "8.52px",
              paddingLeft: "20px",
              background: "#E9EAEC",
              border: "1px solid #DDDFE3",
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M2 8h12M2 12h12" stroke="#212121" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
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
        <div id="partners">
          {servicesContent}
        </div>
      </div>
    </div>
  )
}
