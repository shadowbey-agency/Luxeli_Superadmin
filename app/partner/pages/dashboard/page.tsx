"use client"

import StatCard from "@/app/superadmin/components/stat-card"
import RevenueChart from "@/app/superadmin/components/revenue-chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

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
        { name: "Extra Towels", requests: 80, completed: 55, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8ipA6E17y4LoKuHtZWjuJkPWWFPAUIkc5-w&s" },
        { name: "Room Cleaning", requests: 75, completed: 70, image: "https://www.wayfairertravel.com/hs-fs/hubfs/Imported%20sitepage%20images/shutterstock_2398908619_fbl654.jpg?width=1920&height=590&name=shutterstock_2398908619_fbl654.jpg" },
        { name: "Bed Sheets", requests: 65, completed: 60, image: "https://www.moxeemarketing.com/wp-content/uploads/2023/08/Long-boat-and-rocks-on-railay-beach-in-Krabi-Thailand.jpg" },
        { name: "Toiletries", requests: 58, completed: 50, image: "https://image.vietnamnews.vn/uploadvnnews/Article/2025/1/9/396482_Visual.jpeg" },
        { name: "Mini Bar", requests: 45, completed: 42, image: "https://fyi50plus.com/wp-content/uploads/2024/04/grandparents-raising-grandchildren-W-jpg.webp" }
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
        { name: "Spa Treatment", requests: 80, completed: 55, image: "https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2015/6/25/1435228611797/b2c7829a-1917-463d-a0ae-c62e944f1e4b-2060x1236.jpeg?width=700&quality=85&auto=format&fit=max&s=37d9b9ac8a60d6882541a8bd2cf85925" },
        { name: "Restaurant Booking", requests: 78, completed: 56, image: "https://www.centralasia-travel.com/upload/tiles/bike-uzbekistan.jpg" },
        { name: "Pool Access", requests: 72, completed: 68, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8ipA6E17y4LoKuHtZWjuJkPWWFPAUIkc5-w&s" },
        { name: "Gym Session", requests: 65, completed: 58, image: "https://www.wayfairertravel.com/hs-fs/hubfs/Imported%20sitepage%20images/shutterstock_2398908619_fbl654.jpg?width=1920&height=590&name=shutterstock_2398908619_fbl654.jpg" },
        { name: "Concierge", requests: 58, completed: 52, image: "https://www.moxeemarketing.com/wp-content/uploads/2023/08/Long-boat-and-rocks-on-railay-beach-in-Krabi-Thailand.jpg" }
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
        { name: "City Tour", requests: 80, completed: 55, image: "https://image.vietnamnews.vn/uploadvnnews/Article/2025/1/9/396482_Visual.jpeg" },
        { name: "Beach Day", requests: 75, completed: 68, image: "https://fyi50plus.com/wp-content/uploads/2024/04/grandparents-raising-grandchildren-W-jpg.webp" },
        { name: "Cultural Visit", requests: 70, completed: 62, image: "https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2015/6/25/1435228611797/b2c7829a-1917-463d-a0ae-c62e944f1e4b-2060x1236.jpeg?width=700&quality=85&auto=format&fit=max&s=37d9b9ac8a60d6882541a8bd2cf85925" },
        { name: "Adventure Tour", requests: 65, completed: 58, image: "https://www.centralasia-travel.com/upload/tiles/bike-uzbekistan.jpg" },
        { name: "Shopping Trip", requests: 60, completed: 55, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8ipA6E17y4LoKuHtZWjuJkPWWFPAUIkc5-w&s" }
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
          <p 
            className="text-sm"
            style={{
              color: "#535862",
              fontWeight: 400,
              fontStyle: "Regular",
              fontSize: "14px",
              lineHeight: "20px",
              letterSpacing: "0%"
            }}
          >
            Get a quick overview of your hotel's key performance and activities.
          </p>
        </div>
        <div className="flex items-center " style={{ border: "0.925px solid #CED4DA" ,borderTopLeftRadius: "6px", borderBottomLeftRadius: "6px",  borderTopRightRadius: "6px", borderBottomRightRadius: "6px",}}>
          <button className="px-4 py-2 bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors" style={{ borderRight: "0.925px solid #CED4DA",borderTopLeftRadius: "6px", borderBottomLeftRadius: "6px", }}>
            Week
          </button>
          <button className="px-4 py-2 bg-[#FFF] text-[rgba(33,33,33,0.60)] rounded-[1px] text-sm font-medium hover:bg-muted/80 transition-colors" style={{ borderRight: "0.925px solid #CED4DA" }}>
            Month
          </button>
          <button className="px-4 py-2 bg-[#FFF] text-[rgba(33,33,33,0.60)] rounded-[1px] text-sm font-medium hover:bg-muted/80 transition-colors" style={{ borderRight: "0.925px solid #CED4DA" }}>
            Day
          </button>
          <button className="px-4 py-2 bg-[#FFF] text-[rgba(33,33,33,0.60)] rounded-[1px] text-sm font-medium hover:bg-muted/80 transition-colors" style={{ borderTopRightRadius: "6px", borderBottomRightRadius: "6px",  }}>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6">
        {/* Revenue Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>

        {/* Requests Card */}
        <div className="flex flex-col w-full max-w-[450px] justify-between">
          {/* Header */}
          <div className="h-[64px] flex items-center px-4 bg-[#FCFCFC] border border-[#E9EAEB]" style={{ borderRadius: "12px 12px 0 0"}}>
            <h3 className="text-sm font-semibold text-[#212121]">Requests</h3>
          </div>
          {/* Content */}
          <div className="h-[280px] flex flex-col p-6 bg-white border border-[#E9EAEB] rounded-[14px] mt-[-15px]">
            <div className="text-center mb-12">
              <p className="text-3xl font-bold text-[#212121] mb-2">150 Requests</p>
              <p className="text-sm font-medium text-[#10B981]">+31% vs last week</p>
            </div>

            {/* Half Circle Progress Chart with Legend Inside */}
            <div className="w-full h-32 flex items-center justify-center mt-auto">
              <svg className="w-4/5 h-full" viewBox="0 0 400 160">
                {/* Background semicircle */}
                <path
                  d="M 50 150 A 150 150 0 0 1 350 150"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="20"
                />
                {/* Accepted segment (130/150 = 86.7%) */}
                <path
                  d="M 50 150 A 150 150 0 0 1 350 150"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="20"
                  strokeDasharray="471.2"
                  strokeDashoffset="62.8"
                  strokeLinecap="round"
                />
                {/* Canceled segment (20/150 = 13.3%) */}
                <path
                  d="M 50 150 A 150 150 0 0 1 350 150"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="20"
                  strokeDasharray="62.8 471.2"
                  strokeDashoffset="-408.4"
                  strokeLinecap="round"
                />
                
                {/* Legend inside semicircle */}
                <text
                  x="120"
                  y="120"
                  textAnchor="middle"
                  className="text-sm font-medium fill-[#10B981]"
                >
                  Accepted
                </text>
                
                <text
                  x="280"
                  y="120"
                  textAnchor="middle"
                  className="text-sm font-medium fill-[#EF4444]"
                >
                  Canceled
                </text>
              </svg>
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
      <div className="flex items-center justify-between px-6">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">Services</h2>
          <p 
            className="text-sm"
            style={{
              color: "#535862",
              fontWeight: 400,
              fontStyle: "Regular",
              fontSize: "14px",
              lineHeight: "20px",
              letterSpacing: "0%"
            }}
          >
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
            <div className="flex items-center" style={{ border: "0.925px solid #CED4DA", borderTopLeftRadius: "6px", borderBottomLeftRadius: "6px",  borderTopRightRadius: "6px", borderBottomRightRadius: "6px"}}>
              <button className="px-4 py-2 bg-[#1F2A44] text-white rounded-[1px] text-sm font-medium hover:bg-[#1F2A44]/90 transition-colors" style={{ borderRight: "0.925px solid #CED4DA", borderTopLeftRadius: "6px", borderBottomLeftRadius: "6px"}}>
            Week
          </button>
          <button className="px-4 py-2 bg-[#FFF] text-[rgba(33,33,33,0.60)] rounded-[1px] text-sm font-medium hover:bg-muted/80 transition-colors" style={{ borderRight: "0.925px solid #CED4DA" }}>
            Month
          </button>
          <button className="px-4 py-2 bg-[#FFF] text-[rgba(33,33,33,0.60)] rounded-[1px] text-sm font-medium hover:bg-muted/80 transition-colors" style={{ borderRight: "0.925px solid #CED4DA" }}>
            Day
          </button>
          <button className="px-4 py-2 bg-[#FFF] text-[rgba(33,33,33,0.60)] rounded-[1px] text-sm font-medium hover:bg-muted/80 transition-colors" style={{ borderRight: "0.925px solid #CED4DA",  borderTopRightRadius: "6px", borderBottomRightRadius: "6px" }}>
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-6">
          {Object.entries(servicesData[selectedService as keyof typeof servicesData].metrics).map(([label, value], index) => (
            <StatCard 
              key={index}
              label={label} 
              value={value} 
              change="+2%" 
              changeType="positive" 
              changeLabel="vs last week" 
              showHeadingBorder={true}
            />
          ))}
      </div>

        {/* Bottom Row - Line Graph and Optional Vertical Card */}
        <div className={`grid gap-6 px-6 ${servicesData[selectedService as keyof typeof servicesData].hasVerticalCard ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {/* Requests Activity Line Graph */}
          <div className={servicesData[selectedService as keyof typeof servicesData].hasVerticalCard ? "lg:col-span-2" : ""}>
          <div className="flex flex-col w-full">
            {/* Header */}
            <div className="h-[64px] flex items-center px-4 bg-[#FCFCFC] border border-[#E9EAEB]" style={{ borderRadius: "12px 12px 0 0"}}>
              <h3 className="text-sm font-semibold text-[#212121]">Requests Activity</h3>
            </div>
            {/* Content */}
              <div className="h-[280px] p-3 bg-white border border-[#E9EAEB] rounded-[14px] mt-[-15px] relative">
              {/* Chart container */}
              <div className="w-full h-full relative">
                {/* Y-axis label */}
              
                
                {/* Chart area */}
                  <div className="w-full h-full ">
                  
                  {/* Line chart - same structure as revenue chart */}
                  <div className="w-full h-[calc(100%-0.1rem)] relative mt-auto" style={{ outline: 'none' }} onFocus={(e) => e.target.blur()}>
                    <ResponsiveContainer width="100%" height="100%" style={{ outline: 'none' }}>
                        <LineChart data={[
                          { month: "Sep 21", requests: 200, change: "+12%" },
                          { month: "Sep 22", requests: 400, change: "+8%" },
                          { month: "Sep 23", requests: 200, change: "-15%" },
                          { month: "Sep 24", requests: 800, change: "+25%" },
                          { month: "Sep 25", requests: 150, change: "-30%" },
                          { month: "Sep 26", requests: 400, change: "+5%" },
                          { month: "Sep 27", requests: 800, change: "+18%" },
                          { month: "Sep 28", requests: 200, change: "-10%" }
                        ]}>
                        <CartesianGrid strokeDasharray="0" stroke="#E5E7EB" horizontal={true} vertical={false} />
                        <XAxis 
                          dataKey="month" 
                          stroke="transparent" 
                          fontSize={12}
                          tick={{ fill: '#535862', fontSize: '12px', fontWeight: '500' }}
                          label={{ value: 'Week days', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fontSize: '12px', fill: '#535862', fontWeight: '500', lineHeight: '18px' } }}
                        />
                        <YAxis 
                          stroke="transparent" 
                          fontSize={12} 
                          domain={[0, 1000]}
                          ticks={[0, 200, 400, 600, 800, 1000]}
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
                  </div>
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
              <div className="h-[280px] p-4 bg-white border border-[#E9EAEB] rounded-[14px] mt-[-15px] overflow-y-auto">
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
      <div 
        className="flex items-center justify-between border-b "
        style={{
          width: "100%",
          height: "77px",
          left: "261px",
          borderBottomWidth: "1px",
          justifyContent: "space-between",
          padding: "10px 20px",
      
          opacity: 1,
        }}
      >
        {/* Left side - Actions rapide text */}
        <p 
          className="text-[#00000099] font-medium"
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


