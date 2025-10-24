"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RiArrowDownSLine } from "react-icons/ri"
import PublicIcon from "@/app/partner/components/public-icon"
import { LeftArrow, RightArrow } from "@/app/superadmin/components/pagination-arrows"
import ViewActivityAlertModal from "../../../components/view-activity-alert-modal"
import AssignStaffModal from "../../../components/assign-staff-modal"

export default function ActivityAlertsRequestsPage() {
  const router = useRouter()
  const [showDropdown, setShowDropdown] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 3
  const [showViewRequest, setShowViewRequest] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [showAssignStaffModal, setShowAssignStaffModal] = useState(false)
  const [requestToAssign, setRequestToAssign] = useState<any>(null)

  const handleAssignStaff = (staffId: string) => {
    console.log("Assigned staff:", staffId, "to request:", requestToAssign)
    // Handle the assignment logic here
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.dropdown-container')) {
        setShowDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const tabs = [
    {
      id: "requests",
      label: "Requests",
      icon: <PublicIcon src="/assets/icons/houskeeping-request.svg" alt="Requests" width={16} height={16} />,
      href: "/partner/pages/activity-alerts/requests"
    },
    {
      id: "activities", 
      label: "Activities",
      icon: <PublicIcon src="/assets/icons/menu-01.svg" alt="Activities" width={16} height={16} />,
      href: "/partner/pages/activity-alerts/activities"
    }
  ]

  // Sample data for activity alerts requests
  const requests = [
    {
      id: "#22232",
      requestId: "#22232",
      room: "R1 E3 A3",
      guest: "Lindsey Stroud",
      title: "Torem ipsum dolo...",
      created: "Jan 15, 10:30 AM",
      status: "new",
      statusBg: "#D1924F0D",
      statusBorder: "#D1924F40",
      statusColor: "#D1924F",
      assignee: "",
      hasAssignee: false,
      requestedFor: "Today 14:00-16:00",
      serviceName: "Activity Alert",
      location: "Hotel Lobby",
      price: "15$",
      note: "Please monitor the activity in the lobby area."
    },
    {
      id: "#22233",
      requestId: "#22233",
      room: "R2 E4 A5",
      guest: "John Smith",
      title: "Security alert...",
      created: "Jan 15, 11:15 AM",
      status: "accepted",
      statusBg: "#8B5CF60D",
      statusBorder: "#8B5CF640",
      statusColor: "#8B5CF6",
      assignee: "Full Name",
      hasAssignee: true,
      requestedFor: "Today 15:00-17:00",
      serviceName: "Security Alert",
      location: "Pool Area",
      price: "25$",
      note: "Security monitoring required for pool area."
    },
    {
      id: "#22234",
      requestId: "#22234",
      room: "R3 E5 A6",
      guest: "Sarah Johnson",
      title: "Maintenance alert...",
      created: "Jan 15, 12:00 PM",
      status: "pending",
      statusBg: "#6B72800D",
      statusBorder: "#6B728040",
      statusColor: "#6B7280",
      assignee: "",
      hasAssignee: false,
      requestedFor: "Today 16:00-18:00",
      serviceName: "Maintenance Alert",
      location: "Elevator",
      price: "30$",
      note: "Elevator maintenance alert needs attention."
    },
    {
      id: "#22235",
      requestId: "#22235",
      room: "R4 E6 A7",
      guest: "Mike Wilson",
      title: "System alert...",
      created: "Jan 15, 01:30 PM",
      status: "completed",
      statusBg: "#10B9810D",
      statusBorder: "#10B98140",
      statusColor: "#10B981",
      assignee: "Full Name",
      hasAssignee: true,
      requestedFor: "Today 17:00-19:00",
      serviceName: "System Alert",
      location: "Reception",
      price: "20$",
      note: "System monitoring alert resolved."
    },
    {
      id: "#22236",
      requestId: "#22236",
      room: "R5 E7 A8",
      guest: "Emma Davis",
      title: "Emergency alert...",
      created: "Jan 15, 02:45 PM",
      status: "canceled",
      statusBg: "#EF44440D",
      statusBorder: "#EF444440",
      statusColor: "#EF4444",
      assignee: "Full Name",
      hasAssignee: true,
      requestedFor: "Today 18:00-20:00",
      serviceName: "Emergency Alert",
      location: "Kitchen",
      price: "35$",
      note: "Emergency alert was canceled."
    }
  ]

  return (
    <div className="p-6">
      {/* Tab Navigation */}
      <div className="mb-6 rounded-t-lg">
        <div className="flex items-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => router.push(tab.href)}
              className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative focus:outline-none flex-shrink-0 ${
                tab.id === "requests"
                  ? "text-foreground -mb-[2px]"
                  : "text-muted-foreground hover:text-foreground -mb-[2px]"
              }`}
              style={{
                width: "274px",
                borderBottom: tab.id === "requests" ? "2px solid #1F2A44" : "2px solid #EDEDED"
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg" style={{ 
        borderRadius: "8px",
        boxShadow: "0px 12px 24px 0px #12263F08"
      }}>
        {/* Header Section */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between mb-6" style={{ 
            width: "100%", 
            height: "37.04px" 
          }}>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">Requests list</h2>
            </div>
            <div className="flex items-center gap-2">
              {/* Display dropdown */}
              <div className="relative">
                <select
                  className="appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                  style={{
                    padding: "7.52px 12px",
                    paddingRight: "32px",
                    borderRadius: "4px",
                    border: "1px solid #CED4DA",
                    background: "#FFF",
                    color: "rgba(33, 33, 33, 0.60)",
                    fontSize: "13px",
                    fontWeight: "400",
                    lineHeight: "19.5px"
                  }}
                >
                  <option value={8}>Display 8</option>
                  <option value={10}>Display 10</option>
                  <option value={20}>Display 20</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <RiArrowDownSLine className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              {/* Search */}
              <input 
                type="text" 
                placeholder="Search..." 
                style={{
                  padding: "7.52px 12px",
                  borderRadius: "4px",
                  border: "1px solid #CED4DA",
                  background: "#FFF",
                  color: "rgba(33, 33, 33, 0.60)",
                  fontSize: "13px",
                  fontWeight: "400",
                  lineHeight: "19.5px"
                }}
                className="focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              
              {/* Status dropdown */}
              <div className="relative inline-block">
                <select
                  className="appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                  style={{
                    padding: "7.52px 12px",
                    paddingRight: "32px",
                    borderRadius: "4px",
                    border: "1px solid #CED4DA",
                    background: "#FFF",
                    color: "rgba(33, 33, 33, 0.60)",
                    fontSize: "13px",
                    fontWeight: "400",
                    lineHeight: "19.5px",
                    width: "auto",
                    minWidth: "90px"
                  }}
                >
                  <option>Status</option>
                  <option>New</option>
                  <option>Accepted</option>
                  <option>Completed</option>
                  <option>Pending</option>
                  <option>Canceled</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <RiArrowDownSLine className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              {/* Type dropdown */}
              <div className="relative inline-block">
                <select
                  className="appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                  style={{
                    padding: "7.52px 12px",
                    paddingRight: "32px",
                    borderRadius: "4px",
                    border: "1px solid #CED4DA",
                    background: "#FFF",
                    color: "rgba(33, 33, 33, 0.60)",
                    fontSize: "13px",
                    fontWeight: "400",
                    lineHeight: "19.5px",
                    width: "auto",
                    minWidth: "120px"
                  }}
                >
                  <option>Type</option>
                  <option>Activity Alert</option>
                  <option>Security Alert</option>
                  <option>Maintenance Alert</option>
                  <option>System Alert</option>
                  <option>Emergency Alert</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <RiArrowDownSLine className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              {/* Icon Box Button */}
              <button 
                className="flex justify-center items-center hover:bg-muted/50 transition-colors"
                style={{
                  width: "35px",
                  height: "35.04px",
                  borderRadius: "6px",
                  border: "1px solid #CED4DA",
                  gap: "6px"
                }}
              >
                <PublicIcon src="/assets/icons/calendar.svg" alt="Calendar" width={16} height={16} style={{ filter: "brightness(0) saturate(100%)" }} />
              </button>
              
              {/* Export button */}
              <button className="flex py-[8.52px] px-5 justify-center items-center gap-1.5 border border-[#CED4DA] bg-[#FBFAFA] hover:bg-muted/80 transition-colors" style={{ borderRadius: "6px" }}>
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
        </div>

        {/* Table and Pagination Container */}
        <div className="px-6">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
            <thead style={{
              background: "#FBFAFA",
            }}>
              <tr>
                <th className="w-12 px-4 py-3">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-4 py-1 text-left text-xs font-semibold tracking-wider" style={{ color: "#000000" }}>
                  <div className="flex items-center gap-1">
                    Id
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider" style={{ color: "#000000" }}>
                  <div className="flex items-center gap-1">
                    Room
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider" style={{ color: "#000000" }}>
                  <div className="flex items-center gap-1">
                    Guest
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider" style={{ color: "#000000" }}>
                  <div className="flex items-center gap-1">
                    Title
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider" style={{ color: "#000000" }}>
                  <div className="flex items-center gap-1">
                    Created
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider" style={{ color: "#000000" }}>
                  <div className="flex items-center gap-1">
                    Status
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider" style={{ color: "#000000" }}>
                  <div className="flex items-center gap-1">
                    Assignee
                  </div>
                </th>
                <th className="w-12 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Sample data rows */}
              {[
                {
                  id: "#22232",
                  requestId: "#22232",
                  room: "R1 E3 A3",
                  guest: "Lindsey Stroud",
                  title: "Torem ipsum dolo...",
                  created: "Jan 15, 10:30 AM",
                  status: "new",
                  statusBg: "#D1924F0D",
                  statusBorder: "#D1924F40",
                  statusColor: "#D1924F",
                  assignee: "",
                  hasAssignee: false,
                  requestedFor: "Today 14:00-16:00",
                  serviceName: "Activity Alert",
                  location: "Hotel Lobby",
                  price: "15$",
                  note: "Please monitor the activity in the lobby area."
                },
                {
                  id: "#22233",
                  requestId: "#22233",
                  room: "R2 E4 A5",
                  guest: "John Smith",
                  title: "Security alert...",
                  created: "Jan 15, 11:15 AM",
                  status: "accepted",
                  statusBg: "#8B5CF60D",
                  statusBorder: "#8B5CF640",
                  statusColor: "#8B5CF6",
                  assignee: "",
                  hasAssignee: false,
                  requestedFor: "Today 15:00-17:00",
                  serviceName: "Security Alert",
                  location: "Pool Area",
                  price: "25$",
                  note: "Security monitoring required for pool area."
                },
                {
                  id: "#22234",
                  requestId: "#22234",
                  room: "R3 E5 A6",
                  guest: "Sarah Johnson",
                  title: "Maintenance alert...",
                  created: "Jan 15, 12:00 PM",
                  status: "pending",
                  statusBg: "#6B72800D",
                  statusBorder: "#6B728040",
                  statusColor: "#6B7280",
                  assignee: "",
                  hasAssignee: false,
                  requestedFor: "Today 16:00-18:00",
                  serviceName: "Maintenance Alert",
                  location: "Elevator",
                  price: "30$",
                  note: "Elevator maintenance alert needs attention."
                },
                {
                  id: "#22235",
                  requestId: "#22235",
                  room: "R4 E6 A7",
                  guest: "Mike Wilson",
                  title: "System alert...",
                  created: "Jan 15, 01:30 PM",
                  status: "completed",
                  statusBg: "#10B9810D",
                  statusBorder: "#10B98140",
                  statusColor: "#10B981",
                  assignee: "Full Name",
                  hasAssignee: true,
                  requestedFor: "Today 17:00-19:00",
                  serviceName: "System Alert",
                  location: "Reception",
                  price: "20$",
                  note: "System monitoring alert resolved."
                },
                {
                  id: "#22236",
                  requestId: "#22236",
                  room: "R5 E7 A8",
                  guest: "Emma Davis",
                  title: "Emergency alert...",
                  created: "Jan 15, 02:45 PM",
                  status: "canceled",
                  statusBg: "#EF44440D",
                  statusBorder: "#EF444440",
                  statusColor: "#EF4444",
                  assignee: "Full Name",
                  hasAssignee: true,
                  requestedFor: "Today 18:00-20:00",
                  serviceName: "Emergency Alert",
                  location: "Kitchen",
                  price: "35$",
                  note: "Emergency alert was canceled."
                }
              ].map((row, index) => (
                <tr key={index} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-4 py-4" style={{
                    color: "#525866",
                    fontSize: "12px",
                    fontWeight: "400",
                    lineHeight: "19.5px"
                  }}>{row.id}</td>
                  <td className="px-4 py-4" style={{
                    color: "#525866",
                    fontSize: "12px",
                    fontWeight: "400",
                    lineHeight: "19.5px"
                  }}>{row.room}</td>
                  <td className="px-4 py-4" style={{
                    color: "#525866",
                    fontSize: "12px",
                    fontWeight: "400",
                    lineHeight: "19.5px"
                  }}>{row.guest}</td>
                  <td className="px-4 py-4" style={{
                    color: "#525866",
                    fontSize: "12px",
                    fontWeight: "400",
                    lineHeight: "19.5px"
                  }}>{row.title}</td>
                  <td className="px-4 py-4" style={{
                    color: "#525866",
                    fontSize: "12px",
                    fontWeight: "400",
                    lineHeight: "19.5px"
                  }}>{row.created}</td>
                  <td className="px-4 py-4">
                    <span 
                      className="inline-flex items-center justify-center text-xs font-medium capitalize"
                      style={{
                        width: "80px",
                        height: "22px",
                        gap: "4px",
                        borderRadius: "4px",
                        borderWidth: "0.5px",
                        padding: "10px",
                        background: row.statusBg,
                        border: `0.5px solid ${row.statusBorder}`,
                        color: row.statusColor
                      }}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-4" style={{
                    color: "#525866",
                    fontSize: "12px",
                    fontWeight: "400",
                    lineHeight: "19.5px"
                  }}>
                    {row.hasAssignee ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                        {row.assignee}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="relative dropdown-container">
                      <button 
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() => setShowDropdown(showDropdown === index ? null : index)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                      
                      {/* Dropdown Menu */}
                      {showDropdown === index && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                          <div className="py-1">
                            <button 
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              onClick={() => {
                                setSelectedRequest(row)
                                setShowViewRequest(true)
                                setShowDropdown(null)
                              }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View request
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 16 17">
                                <g clipPath="url(#clip0_1_12740)">
                                  <path d="M2.66699 12.4827C2.66699 12.8364 2.80747 13.1755 3.05752 13.4256C3.30756 13.6756 3.6467 13.8161 4.00033 13.8161C4.35395 13.8161 4.69309 13.6756 4.94313 13.4256C5.19318 13.1755 5.33366 12.8364 5.33366 12.4827C5.33366 12.1291 5.19318 11.79 4.94313 11.5399C4.69309 11.2899 4.35395 11.1494 4.00033 11.1494C3.6467 11.1494 3.30756 11.2899 3.05752 11.5399C2.80747 11.79 2.66699 12.1291 2.66699 12.4827Z" stroke="#2B2829" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M10.667 12.4827C10.667 12.8364 10.8075 13.1755 11.0575 13.4256C11.3076 13.6756 11.6467 13.8161 12.0003 13.8161C12.3539 13.8161 12.6931 13.6756 12.9431 13.4256C13.1932 13.1755 13.3337 12.8364 13.3337 12.4827C13.3337 12.1291 13.1932 11.79 12.9431 11.5399C12.6931 11.2899 12.3539 11.1494 12.0003 11.1494C11.6467 11.1494 11.3076 11.2899 11.0575 11.5399C10.8075 11.79 10.667 12.1291 10.667 12.4827Z" stroke="#2B2829" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M4 8.48275V7.14941C4 6.08855 4.42143 5.07113 5.17157 4.32099C5.92172 3.57084 6.93913 3.14941 8 3.14941C9.06087 3.14941 10.0783 3.57084 10.8284 4.32099C11.5786 5.07113 12 6.08855 12 7.14941V8.48275" stroke="#2B2829" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M10 6.47998L12 8.47998L14 6.47998" stroke="#2B2829" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                                </g>
                                <defs>
                                  <clipPath id="clip0_1_12740">
                                    <rect width="16" height="16" fill="white" transform="translate(0 0.47998)"/>
                                  </clipPath>
                                </defs>
                              </svg>
                              Change status
                            </button>
                            <button 
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              onClick={() => {
                                setRequestToAssign(row)
                                setShowAssignStaffModal(true)
                                setShowDropdown(null)
                              }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 16 15">
                                <path d="M1.33301 6.81348C2.88748 5.18536 5.09516 5.1087 6.66634 6.81348M5.66307 2.48014C5.66307 3.40062 4.91582 4.14681 3.99403 4.14681C3.07224 4.14681 2.32499 3.40062 2.32499 2.48014C2.32499 1.55967 3.07224 0.813477 3.99403 0.813477C4.91582 0.813477 5.66307 1.55967 5.66307 2.48014Z" stroke="#141B34" strokeLinecap="round"/>
                                <path d="M9.33301 14.1465C10.8875 12.5184 13.0952 12.4417 14.6663 14.1465M13.6631 9.81315C13.6631 10.7336 12.9158 11.4798 11.994 11.4798C11.0722 11.4798 10.325 10.7336 10.325 9.81315C10.325 8.89268 11.0722 8.14648 11.994 8.14648C12.9158 8.14648 13.6631 8.89268 13.6631 9.81315Z" stroke="#141B34" strokeLinecap="round"/>
                                <path d="M2 8.81331C2 11.3933 4.08667 13.48 6.66667 13.48L6 12.1466" stroke="#141B34" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M10 1.47998H14M10 3.47998H14M10 5.47998H12.3333" stroke="#141B34" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Assign to staff
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between py-3 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Displaying {((currentPage - 1) * 10) + 1}-{Math.min(currentPage * 10, 30)} results out of 30
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LeftArrow />
              </button>

              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                const page = i + 1
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                      currentPage === page ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {page}
                  </button>
                )
              })}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RightArrow />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Request Modal */}
      <ViewActivityAlertModal
        request={selectedRequest}
        isOpen={showViewRequest}
        onClose={() => {
          setShowViewRequest(false)
          setSelectedRequest(null)
        }}
      />

      {/* Assign Staff Modal */}
      <AssignStaffModal
        isOpen={showAssignStaffModal}
        onClose={() => {
          setShowAssignStaffModal(false)
          setRequestToAssign(null)
        }}
        onAssign={handleAssignStaff}
      />
    </div>
  )
}
