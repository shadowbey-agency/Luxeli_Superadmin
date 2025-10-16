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

  // Scroll detection to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["subscriptions", "partners", "support"]
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
  const subscriptionsContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">Subscriptions & revenue</h2>
          <p className="text-sm text-muted-foreground">Monitor paying partners, renewals, and recurring revenue.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Filter Button */}
          <button className="flex py-[8.52px] px-5 justify-center items-center gap-1.5 rounded-md border border-[#CED4DA] bg-[#FBFAFA]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="w-4 h-4"
            >
              <path
                d="M4 8H12M2 4H14M6 12H10"
                stroke="black"
                strokeWidth="1.11333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm font-medium text-[#212121]">Filter</span>
          </button>
          {/* Export Button */}
          <button className="flex py-[8.52px] px-5 justify-center items-center gap-1.5 rounded-md border border-[#CED4DA] bg-[#FBFAFA]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="16"
              viewBox="0 0 14 16"
              fill="none"
              className="w-[14px] h-4"
            >
              <path
                d="M11.3333 10.6666C11.6705 10.9943 13 11.8665 13 12.3333M11.3333 14C11.6705 13.6723 13 12.8001 13 12.3333M13 12.3333L7.66667 12.3333"
                stroke="#1F2A44"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.33398 14.6666H6.15217C3.97803 14.6666 2.89096 14.6666 2.13603 14.1347C1.91973 13.9823 1.7277 13.8016 1.56578 13.598C1.00065 12.8875 1.00065 11.8644 1.00065 9.81814V8.12117C1.00065 6.14572 1.00065 5.158 1.31328 4.36913C1.81586 3.10091 2.87874 2.10055 4.22622 1.62753C5.0644 1.33329 6.11386 1.33329 8.21277 1.33329C9.41215 1.33329 10.0118 1.33329 10.4908 1.50143C11.2608 1.77172 11.8682 2.34336 12.1553 3.06805C12.334 3.51884 12.334 4.08325 12.334 5.21208V8.66663"
                stroke="#1F2A44"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1.0013 8C1.0013 6.7727 1.99622 5.77778 3.22352 5.77778C3.66738 5.77778 4.19066 5.85555 4.62221 5.73992C5.00565 5.63718 5.30514 5.33768 5.40789 4.95424C5.52352 4.52269 5.44575 3.99941 5.44575 3.55556C5.44575 2.32826 6.44067 1.33333 7.66797 1.33333"
                stroke="#1F2A44"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm font-medium text-[#212121]">Export</span>
          </button>
        </div>
      </div>

      <div className="h-px flex-shrink-0 self-stretch w-full">
        <div className="w-full h-px bg-black/[0.08]"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<RevenueIcon />}
          label="Total Plans Revenue"
          value="1,900.000"
          subtitle="MAD"
          change="+2%"
          changeType="positive"
          changeLabel="vs last month"
        />
        <StatCard
          icon={<StaffIcon />}
          label="Total Users"
          value="42"
          change="+2%"
          changeType="positive"
          changeLabel="vs last month"
        />
        <StatCard
          icon={<SubscriptionIcon />}
          label="New subscriptions"
          value="12"
          change="+2%"
          changeType="positive"
          changeLabel="vs last month"
        />
        <StatCard
          icon={<InvoiceIcon />}
          label="Next Invoices"
          value="45.000"
          subtitle="MAD"
          change="+2%"
          changeType="positive"
          changeLabel="vs last month"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <SubscribersChart />
        </div>
      </div>
    </div>
  )

  const partnersContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">Partners & Services</h2>
          <p className="text-sm text-muted-foreground">
            Monitor hotel activity, partners, staff, rooms, clients, and service demand.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Filter Button */}
          <button className="flex py-[8.52px] px-5 justify-center items-center gap-1.5 rounded-md border border-[#CED4DA] bg-[#FBFAFA]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="w-4 h-4"
            >
              <path
                d="M4 8H12M2 4H14M6 12H10"
                stroke="black"
                strokeWidth="1.11333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm font-medium text-[#212121]">Filter</span>
          </button>
          {/* Export Button */}
          <button className="flex py-[8.52px] px-5 justify-center items-center gap-1.5 rounded-md border border-[#CED4DA] bg-[#FBFAFA]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="16"
              viewBox="0 0 14 16"
              fill="none"
              className="w-[14px] h-4"
            >
              <path
                d="M11.3333 10.6666C11.6705 10.9943 13 11.8665 13 12.3333M11.3333 14C11.6705 13.6723 13 12.8001 13 12.3333M13 12.3333L7.66667 12.3333"
                stroke="#1F2A44"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.33398 14.6666H6.15217C3.97803 14.6666 2.89096 14.6666 2.13603 14.1347C1.91973 13.9823 1.7277 13.8016 1.56578 13.598C1.00065 12.8875 1.00065 11.8644 1.00065 9.81814V8.12117C1.00065 6.14572 1.00065 5.158 1.31328 4.36913C1.81586 3.10091 2.87874 2.10055 4.22622 1.62753C5.0644 1.33329 6.11386 1.33329 8.21277 1.33329C9.41215 1.33329 10.0118 1.33329 10.4908 1.50143C11.2608 1.77172 11.8682 2.34336 12.1553 3.06805C12.334 3.51884 12.334 4.08325 12.334 5.21208V8.66663"
                stroke="#1F2A44"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1.0013 8C1.0013 6.7727 1.99622 5.77778 3.22352 5.77778C3.66738 5.77778 4.19066 5.85555 4.62221 5.73992C5.00565 5.63718 5.30514 5.33768 5.40789 4.95424C5.52352 4.52269 5.44575 3.99941 5.44575 3.55556C5.44575 2.32826 6.44067 1.33333 7.66797 1.33333"
                stroke="#1F2A44"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm font-medium text-[#212121]">Export</span>
          </button>
        </div>
      </div>

      <div className="h-px flex-shrink-0 self-stretch w-full">
        <div className="w-full h-px bg-black/[0.08]"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Partners" value="65" change="+2%" changeType="positive" changeLabel="vs yesterday" />
        <StatCard label="Total Staff" value="42" change="+2%" changeType="positive" changeLabel="vs yesterday" />
        <StatCard label="Total Rooms" value="654" change="+2%" changeType="positive" changeLabel="vs yesterday" />
        <StatCard label="Total Clients" value="125" change="+2%" changeType="positive" changeLabel="vs yesterday" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Total Requests Card */}
        <div className="flex flex-col w-full max-w-[390px]">
          {/* Header */}
          <div className="h-[64px] flex items-center px-4 bg-[#FCFCFC] border border-[#E9EAEB] " style={{ borderRadius: "12px 12px 0 0"}}>
            <h3 className="text-sm font-semibold text-[#212121]">Total requests</h3>
          </div>
          {/* Content */}
          <div className="h-[400px] flex flex-col items-center justify-center p-6 bg-white border border-[#E9EAEB]  rounded-[14px] mt-[-15px]">
            <div className="text-center mb-6">
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <p className="text-5xl font-bold text-[#212121]">1565</p>
                <span className="text-lg font-medium text-[#6B7280]">Client</span>
              </div>
              <p className="text-sm font-medium text-[#10B981]">+31% vs yesterday</p>
            </div>

            {/* Circular Progress */}
            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                {/* Background circle */}
                <circle cx="80" cy="80" r="70" fill="none" stroke="#E5E7EB" strokeWidth="12" />
                {/* Progress circle */}
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="#56C6FF"
                  strokeWidth="12"
                  strokeDasharray="439.6"
                  strokeDashoffset="109.9"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xl font-bold text-[#212121]">15,903</p>
                  <p className="text-xs text-[#6B7280]">Requests</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Card */}
        <div className="flex flex-col w-full max-w-[400px]">
          {/* Header */}
          <div 
            className=" flex items-center px-4"
            style={{
              width: "390px",
              height: "64px",
              flexShrink: 0,
              fill: "#FCFCFC",
              strokeWidth: "1px",
              stroke: "#E9EAEB",
              background: "#FCFCFC",
              border: "1px solid #E9EAEB",
              borderRadius: "12px 12px 0 0"
            }}
          >
            <h3 className="text-sm font-semibold text-[#212121]">Services</h3>
          </div>
          
          {/* Content */}
          <div 
            className="flex flex-col p-4"
            style={{
              width: "390px",
              height: "400px",
              marginTop: "-15px",
              flexShrink: 0,
              background: "#FFF",
              border: "1px solid #E9EAEB",
              borderRadius: "14px"
            }}
          >
            <div className="space-y-0">
              {[
                {
                  name: "Hotel Atlas (Marrakech)",
                  requests: 80,
                  archived: 55,
                  image:
                    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1c12354876432ef7989dd8089db33dee54bc5a38-SVv8DKm93FBf9pa9zRq6uXwknKdcMB.png",
                },
                {
                  name: "Riad Bahia (Fes)",
                  requests: 80,
                  archived: 55,
                  image:
                    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1c12354876432ef7989dd8089db33dee54bc5a38-SVv8DKm93FBf9pa9zRq6uXwknKdcMB.png",
                },
                {
                  name: "Sun Hotel (Agadir)",
                  requests: 80,
                  archived: 55,
                  image:
                    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1c12354876432ef7989dd8089db33dee54bc5a38-SVv8DKm93FBf9pa9zRq6uXwknKdcMB.png",
                },
                {
                  name: "Marina Bay (Tangier)",
                  requests: 80,
                  archived: 55,
                  image:
                    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1c12354876432ef7989dd8089db33dee54bc5a38-SVv8DKm93FBf9pa9zRq6uXwknKdcMB.png",
                },
                {
                  name: "Palm Resort (Casablanca)",
                  requests: 80,
                  archived: 55,
                  image:
                    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1c12354876432ef7989dd8089db33dee54bc5a38-SVv8DKm93FBf9pa9zRq6uXwknKdcMB.png",
                },
                {
                  name: "Riad Joyade (Agadir)",
                  requests: 80,
                  archived: 55,
                  image:
                    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1c12354876432ef7989dd8089db33dee54bc5a38-SVv8DKm93FBf9pa9zRq6uXwknKdcMB.png",
                },
              ].map((service, index) => (
                <div key={index}>
                  <div className="flex items-center gap-3 py-3">
                    <div className="flex-1 min-w-0">
                      <p 
                        className="truncate"
                        style={{
                          color: "#414651",
                          fontFamily: "Inter",
                          fontSize: "12px",
                          fontStyle: "normal",
                          fontWeight: "500",
                          lineHeight: "18px"
                        }}
                      >
                        {service.name}
                      </p>
                      <p className="text-xs text-[#6B7280]">
                        Requests: <span className="font-semibold">{service.requests}</span> | Archived:{" "}
                        <span className="font-semibold">{service.archived}</span>
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0 overflow-hidden">
                      <img
                        src={service.image || "/placeholder.svg"}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  {index < 5 && (
                    <div 
                      style={{
                        width: "422px",
                        height: "0.5px",
                        background: "#E9ECF1",
                        margin: "0 auto"
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Time Card */}
        <div className="flex flex-col w-full max-w-[390px]">
          {/* Header */}
          <div className="h-[64px] flex items-center px-4 bg-[#FCFCFC] border border-[#E9EAEB]" style={{ borderRadius: "12px 12px 0 0"}}>
            <h3 className="text-sm font-semibold text-[#212121]">Order Time</h3>
          </div>
          {/* Content */}
          <div className="h-[400px] flex flex-col items-center justify-center p-6 bg-white border border-[#E9EAEB] rounded-[14px] mt-[-15px]">
            {/* Donut Chart */}
            <div className="relative w-48 h-48 mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                {/* Morning segment (65%) - Blue */}
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="35"
                  strokeDasharray="285.6 439.6"
                  strokeDashoffset="0"
                />
                {/* Afternoon segment (23%) - Dark Blue */}
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="#1E3A8A"
                  strokeWidth="35"
                  strokeDasharray="101.1 439.6"
                  strokeDashoffset="-285.6"
                />
                {/* Evening segment (20%) - Light Blue */}
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="#60A5FA"
                  strokeWidth="35"
                  strokeDasharray="87.9 439.6"
                  strokeDashoffset="-386.7"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#212121]">234</p>
                  <p className="text-xs text-[#6B7280]">Total Requests</p>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#1E3A8A]"></div>
                  <span className="text-sm text-[#6B7280]">Afternoon</span>
                </div>
                <span className="text-sm font-semibold text-[#212121]">23%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#60A5FA]"></div>
                  <span className="text-sm text-[#6B7280]">Evening</span>
                </div>
                <span className="text-sm font-semibold text-[#212121]">20%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#2563EB]"></div>
                  <span className="text-sm text-[#6B7280]">Morning</span>
                </div>
                <span className="text-sm font-semibold text-[#212121]">65%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const supportContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">Support & Tickets</h2>
          <p className="text-sm text-muted-foreground">
            Track ticket volume, workload, and quality for the selected period.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Filter Button */}
          <button className="flex py-[8.52px] px-5 justify-center items-center gap-1.5 rounded-md border border-[#CED4DA] bg-[#FBFAFA]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="w-4 h-4"
            >
              <path
                d="M4 8H12M2 4H14M6 12H10"
                stroke="black"
                strokeWidth="1.11333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm font-medium text-[#212121]">Filter</span>
          </button>
          {/* Export Button */}
          <button className="flex py-[8.52px] px-5 justify-center items-center gap-1.5 rounded-md border border-[#CED4DA] bg-[#FBFAFA]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="16"
              viewBox="0 0 14 16"
              fill="none"
              className="w-[14px] h-4"
            >
              <path
                d="M11.3333 10.6666C11.6705 10.9943 13 11.8665 13 12.3333M11.3333 14C11.6705 13.6723 13 12.8001 13 12.3333M13 12.3333L7.66667 12.3333"
                stroke="#1F2A44"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.33398 14.6666H6.15217C3.97803 14.6666 2.89096 14.6666 2.13603 14.1347C1.91973 13.9823 1.7277 13.8016 1.56578 13.598C1.00065 12.8875 1.00065 11.8644 1.00065 9.81814V8.12117C1.00065 6.14572 1.00065 5.158 1.31328 4.36913C1.81586 3.10091 2.87874 2.10055 4.22622 1.62753C5.0644 1.33329 6.11386 1.33329 8.21277 1.33329C9.41215 1.33329 10.0118 1.33329 10.4908 1.50143C11.2608 1.77172 11.8682 2.34336 12.1553 3.06805C12.334 3.51884 12.334 4.08325 12.334 5.21208V8.66663"
                stroke="#1F2A44"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1.0013 8C1.0013 6.7727 1.99622 5.77778 3.22352 5.77778C3.66738 5.77778 4.19066 5.85555 4.62221 5.73992C5.00565 5.63718 5.30514 5.33768 5.40789 4.95424C5.52352 4.52269 5.44575 3.99941 5.44575 3.55556C5.44575 2.32826 6.44067 1.33333 7.66797 1.33333"
                stroke="#1F2A44"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm font-medium text-[#212121]">Export</span>
          </button>
        </div>
      </div>

      <div className="h-px flex-shrink-0 self-stretch w-full">
        <div className="w-full h-px bg-black/[0.08]"></div>
      </div>

      {/* Tickets Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Tickets" value="1256" change="+2%" changeType="positive" changeLabel="vs yesterday" />
        <StatCard label="New Tickets" value="42" change="+2%" changeType="positive" changeLabel="vs yesterday" />
        <StatCard label="Opened Tickets" value="458" change="+2%" changeType="positive" changeLabel="vs yesterday" />
        <StatCard label="Reopened Tickets" value="36" change="+2%" changeType="positive" changeLabel="vs yesterday" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Pending Tickets" value="75" change="+2%" changeType="positive" changeLabel="vs yesterday" />
        <StatCard label="Resolved Tickets" value="1124" change="+2%" changeType="positive" changeLabel="vs yesterday" />
        <StatCard label="Canceled Tickets" value="10" change="+2%" changeType="positive" changeLabel="vs yesterday" />
        <div className="flex p-[19px_16px] flex-col justify-center items-start gap-2.5 flex-1 rounded-lg bg-white shadow-[0_12px_24px_0_rgba(18,38,63,0.03)]">
          <h3 className="text-sm font-medium text-[#6B7280] pb-3 border-b border-[rgba(0,0,0,0.06)] self-stretch">
            Tickets Priority
          </h3>
          <div className="space-y-2 w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-warning"></div>
                <span className="text-sm text-[#6B7280]">Low</span>
              </div>
              <span className="text-sm font-semibold text-[#212121]">385</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-info"></div>
                <span className="text-sm text-[#6B7280]">Medium</span>
              </div>
              <span className="text-sm font-semibold text-[#212121]">124</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-error"></div>
                <span className="text-sm text-[#6B7280]">Urgent</span>
              </div>
              <span className="text-sm font-semibold text-[#212121]">658</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-6">
      {/* Navigation Buttons (like original tabs but always visible) */}
      <div className="w-full border-b border-black/[0.06]">
        <div className="flex max-w-[1180px] p-5 justify-end items-center gap-4">
          <button 
            onClick={() => {
              setActiveSection("subscriptions")
              document.getElementById("subscriptions")?.scrollIntoView({ behavior: "smooth" })
            }}
            className={`flex p-[10px_30px] flex-col justify-center items-center gap-2.5 flex-1 border-b-2 border-black/10 transition-colors ${
              activeSection === "subscriptions" 
                ? "text-foreground font-semibold" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Subscriptions & revenue
          </button>
          <button 
            onClick={() => {
              setActiveSection("partners")
              document.getElementById("partners")?.scrollIntoView({ behavior: "smooth" })
            }}
            className={`flex p-[10px_30px] flex-col justify-center items-center gap-2.5 flex-1 border-b-2 border-black/10 transition-colors ${
              activeSection === "partners" 
                ? "text-foreground font-semibold" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Partners & Services
          </button>
          <button 
            onClick={() => {
              setActiveSection("support")
              document.getElementById("support")?.scrollIntoView({ behavior: "smooth" })
            }}
            className={`flex p-[10px_30px] flex-col justify-center items-center gap-2.5 flex-1 border-b-2 border-black/10 transition-colors ${
              activeSection === "support" 
                ? "text-foreground font-semibold" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Support & Tickets
          </button>
        </div>
      </div>

      {/* All Sections in Vertical Layout */}
      <div className="space-y-12 mt-6">
        {/* Subscriptions Section */}
        <div id="subscriptions">
          {subscriptionsContent}
        </div>

        {/* Partners Section */}
        <div id="partners">
          {partnersContent}
        </div>

        {/* Support Section */}
        <div id="support">
          {supportContent}
        </div>
      </div>
    </div>
  )
}
