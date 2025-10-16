"use client"

import { useState, useEffect } from "react"
import { RiFileList3Line, RiHome4Line, RiSettings3Line, RiArrowDownSLine } from "react-icons/ri"
import { LeftArrow, RightArrow } from "@/app/superadmin/components/pagination-arrows"

export default function HousekeepingPage() {
  const [activeTab, setActiveTab] = useState<"requests" | "house-cleaning" | "requests-management">("requests")
  const [showDropdown, setShowDropdown] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 3

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
      icon: <RiFileList3Line className="w-4 h-4" />
    },
    {
      id: "house-cleaning", 
      label: "House cleaning",
      icon: <RiHome4Line className="w-4 h-4" />
    },
    {
      id: "requests-management",
      label: "Requests management", 
      icon: <RiSettings3Line className="w-4 h-4" />
    }
  ]

  const RequestsContent = () => (
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
                <option>No-show</option>
                <option>Canceled</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <RiArrowDownSLine className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            {/* Priority dropdown */}
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
                <option>Priority</option>
                <option>Urgent</option>
                <option>Medium</option>
                <option>Low</option>
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
                <option>Custom cleaning</option>
                <option>Request needed</option>
                <option>Room cleaning</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <RiArrowDownSLine className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            {/* Export button */}
            <button className="flex py-[8.52px] px-5 justify-center items-center gap-1.5 rounded-md border border-[#CED4DA] bg-[#FBFAFA] hover:bg-muted/80 transition-colors">
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
              <th className="px-4 py-1 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#000000" }}>
                <div className="flex items-center gap-1">
                  ID
                  
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#000000" }}>
                <div className="flex items-center gap-1">
                  Room
                  
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#000000" }}>
                <div className="flex items-center gap-1">
                  Guest
                  
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#000000" }}>
                <div className="flex items-center gap-1">
                  Type
                  
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#000000" }}>
                <div className="flex items-center gap-1">
                  Created
                  
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#000000" }}>
                <div className="flex items-center gap-1">
                  Status
                  
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#000000" }}>
                <div className="flex items-center gap-1">
                  Priority
                  
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#000000" }}>
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
                room: "R1 E3 A3",
                guest: "Lindsey Stroud",
                type: "Custom cleaning",
                created: "Jan 15, 10:30 AM",
                status: "New",
                statusBg: "#D1924F0D",
                statusBorder: "#D1924F40",
                statusColor: "#D1924F",
                priority: "Urgent",
                priorityBg: "#FF0D0D0D",
                priorityBorder: "#FF0D0D40",
                priorityColor: "#FF0D0D",
                assignee: "Full Name",
                hasAssignee: true
              },
              {
                id: "#22233",
                room: "R2 E3 A3",
                guest: "Lindsey Stroud",
                type: "Request needed",
                created: "Jan 15, 10:30 AM",
                status: "Accepted",
                statusBg: "#6457D30D",
                statusBorder: "#6457D340",
                statusColor: "#6457D3",
                priority: "Medium",
                priorityBg: "#D1924F0D",
                priorityBorder: "#D1924F40",
                priorityColor: "#D1924F",
                assignee: "",
                hasAssignee: false
              },
              {
                id: "#22234",
                room: "R3 E3 A3",
                guest: "Lindsey Stroud",
                type: "Custom cleaning",
                created: "Jan 15, 10:30 AM",
                status: "Completed",
                statusBg: "#17B26A0D",
                statusBorder: "#17B26A40",
                statusColor: "#17B26A",
                priority: "Low",
                priorityBg: "#56C6FF0D",
                priorityBorder: "#56C6FF40",
                priorityColor: "#56C6FF",
                assignee: "Full Name",
                hasAssignee: true
              },
              {
                id: "#22235",
                room: "R4 E3 A3",
                guest: "Lindsey Stroud",
                type: "Request needed",
                created: "Jan 15, 10:30 AM",
                status: "No-show",
                statusBg: "#1F2A440D",
                statusBorder: "#1F2A4440",
                statusColor: "#1F2A44",
                priority: "Medium",
                priorityBg: "#D1924F0D",
                priorityBorder: "#D1924F40",
                priorityColor: "#D1924F",
                assignee: "",
                hasAssignee: false
              },
              {
                id: "#22236",
                room: "R5 E3 A3",
                guest: "Lindsey Stroud",
                type: "Custom cleaning",
                created: "Jan 15, 10:30 AM",
                status: "Canceled",
                statusBg: "#FF0D0D0D",
                statusBorder: "#FF0D0D40",
                statusColor: "#FF0D0D",
                priority: "Low",
                priorityBg: "#56C6FF0D",
                priorityBorder: "#56C6FF40",
                priorityColor: "#56C6FF",
                assignee: "Full Name",
                hasAssignee: true
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
                }}>{row.type}</td>
                <td className="px-4 py-4" style={{
                  color: "#525866",
                  fontSize: "12px",
                  fontWeight: "400",
                  lineHeight: "19.5px"
                }}>{row.created}</td>
                <td className="px-4 py-4">
                  <span 
                    className="inline-flex items-center justify-center text-xs font-medium"
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
                <td className="px-4 py-4">
                  <span 
                    className="inline-flex items-center justify-center text-xs font-medium"
                    style={{
                      width: "80px",
                      height: "22px",
                      gap: "4px",
                      borderRadius: "4px",
                      borderWidth: "0.5px",
                      padding: "10px",
                      background: row.priorityBg,
                      border: `0.5px solid ${row.priorityBorder}`,
                      color: row.priorityColor
                    }}
                  >
                    {row.priority}
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
                    
                    {/* Dropdown Menu - Show for any row */}
                    {showDropdown === index && (
                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                        <div className="py-1">
                          <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View request
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Change status
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
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
  )

  const HouseCleaningContent = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">House cleaning content</h2>
      <p>House cleaning page content will be implemented here.</p>
    </div>
  )

  const RequestsManagementContent = () => (
    <div className="space-y-6">
      {/* Main Heading Section */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Requests management</h2>
        <p className="text-muted-foreground">Catalog of amenity items for "Request needed". Publish, edit, or remove products.</p>
      </div>

      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">30 Items found</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Search bar */}
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
          
          {/* Category dropdown */}
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
              <option>Category</option>
              <option>Pillows</option>
              <option>Kitchen</option>
              <option>Cleaning</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <RiArrowDownSLine className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          
          {/* Status dropdown */}
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
              <option>Status</option>
              <option>Published</option>
              <option>Draft</option>
              <option>Archived</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <RiArrowDownSLine className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          
          {/* Add new item button */}
          <button className="flex py-[8.52px] px-5 justify-center items-center gap-1.5 rounded-md bg-[#1F2A44] text-white hover:bg-[#1F2A44]/90 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm font-medium">Add a new item</span>
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[
          {
            id: 1,
            name: "Item name",
            category: "Category",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis...",
            status: "Published",
            image: "/placeholder.svg?height=131&width=146"
          },
          {
            id: 2,
            name: "Item name",
            category: "Category", 
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis...",
            status: "Published",
            image: "/placeholder.svg?height=131&width=146"
          },
          {
            id: 3,
            name: "Item name",
            category: "Category",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis...",
            status: "Published",
            image: "/placeholder.svg?height=131&width=146"
          },
          {
            id: 4,
            name: "Item name",
            category: "Category",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis...",
            status: "Published",
            image: "/placeholder.svg?height=131&width=146"
          },
          {
            id: 5,
            name: "Item name",
            category: "Category",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis...",
            status: "Published",
            image: "/placeholder.svg?height=131&width=146"
          },
          {
            id: 6,
            name: "Item name",
            category: "Category",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis...",
            status: "Published",
            image: "/placeholder.svg?height=131&width=146"
          },
          {
            id: 7,
            name: "Item name",
            category: "Category",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis...",
            status: "Published",
            image: "/placeholder.svg?height=131&width=146"
          },
          {
            id: 8,
            name: "Item name",
            category: "Category",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis...",
            status: "Published",
            image: "/placeholder.svg?height=131&width=146"
          }
        ].map((item) => (
          <div 
            key={item.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full"
            style={{
              height: "304px"
            }}
          >
            {/* Image Section */}
            <div 
              className="relative flex items-center justify-center w-full"
              style={{
                height: "196px"
              }}
            >
              {/* Status Badge */}
              <div 
                className="absolute top-3 left-3 z-10 flex items-center justify-center"
                style={{
                  width: "80px",
                  height: "22px",
                  gap: "4px",
                  borderRadius: "4px",
                  borderWidth: "0.5px",
                  padding: "10px",
                  background: "#17B26A0D",
                  border: "0.5px solid #17B26A40"
                }}
              >
                <span className="text-xs font-medium" style={{ color: "#17B26A" }}>
                  {item.status}
                </span>
              </div>

              {/* Action Icons */}
              <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                {/* Delete Icon */}
                <button className="p-1 hover:bg-gray-100 rounded">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                {/* Edit Icon */}
                <button className="p-1 hover:bg-gray-100 rounded">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>

              {/* Image */}
              <div 
                className="flex items-center justify-center"
                style={{
                  width: "146px",
                  height: "131px",
                  mixBlendMode: "darken"
                }}
              >
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover rounded"
                />
              </div>
            </div>

            {/* Content Section */}
            <div 
              className="p-4"
              style={{
                height: "76px",
                gap: "12px"
              }}
            >
              {/* Heading Row */}
              <div 
                className="flex items-center justify-between mb-3"
                style={{
                  height: "20px"
                }}
              >
                <h3 className="font-semibold text-sm text-foreground">{item.name}</h3>
                <span className="text-xs text-muted-foreground">{item.category}</span>
              </div>
              
              {/* Description */}
              <p 
                className="text-xs leading-tight"
                style={{
                  fontWeight: "400",
                  fontSize: "11px",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "#21212199"
                }}
              >
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="p-6">
      {/* Tab Navigation */}
      <div className="mb-6  rounded-t-lg">
        <div className="flex items-center border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
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

      {/* Content */}
      <div>
        {activeTab === "requests" && <RequestsContent />}
        {activeTab === "house-cleaning" && <HouseCleaningContent />}
        {activeTab === "requests-management" && <RequestsManagementContent />}
      </div>
    </div>
  )
}
