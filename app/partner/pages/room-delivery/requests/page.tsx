"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RiRestaurantLine, RiArrowDownSLine } from "react-icons/ri"
import PublicIcon from "@/app/partner/components/public-icon"
import { LeftArrow, RightArrow } from "@/app/superadmin/components/pagination-arrows"
import DropdownMenu from "@/app/superadmin/components/dropdown-menu"
import ViewRoomDeliveryModal from "@/app/partner/components/view-room-delivery-modal"
import AssignStaffModal from "@/app/partner/components/assign-staff-modal"
import { getAuthToken } from "@/lib/auth-utils"

interface InRoomDeliveryRequest {
  _id: string
  requestId: string
  roomName: string
  residentialName: string
  items: string[]
  restaurant: string
  pickup: string
  status: "new" | "accepted" | "completed" | "no-show" | "canceled"
  assignee?: {
    name: string
    staffId: string
    profilePic?: string
  }
  notes?: string
  createdAt: string | Date
  updatedAt: string | Date
}

export default function RoomDeliveryRequestsPage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [showViewRequest, setShowViewRequest] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [showAssignStaffModal, setShowAssignStaffModal] = useState(false)
  const [requestToAssign, setRequestToAssign] = useState<any>(null)
  const [requests, setRequests] = useState<InRoomDeliveryRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [restaurantFilter, setRestaurantFilter] = useState("")
  const [pickupFilter, setPickupFilter] = useState("")
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false)
  const [requestToChangeStatus, setRequestToChangeStatus] = useState<InRoomDeliveryRequest | null>(null)
  const [newStatus, setNewStatus] = useState<"new" | "accepted" | "completed" | "no-show" | "canceled">("new")

  // Fetch requests from API
  const fetchRequests = async () => {
    try {
      setIsLoading(true)
      const token = getAuthToken()
      if (!token) {
        console.error('No auth token found')
        setIsLoading(false)
        return
      }

      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      })
      
      if (searchQuery) queryParams.append('search', searchQuery)
      if (statusFilter && statusFilter !== "Status") {
        queryParams.append('status', statusFilter.toLowerCase())
      }
      if (restaurantFilter && restaurantFilter !== "Restaurant") {
        queryParams.append('restaurant', restaurantFilter)
      }

      const response = await fetch(`/api/partner/in-room-delivery-request?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()

      if (data.success && data.data?.requests) {
        setRequests(data.data.requests)
        if (data.data.pagination) {
          setTotalItems(data.data.pagination.total)
          setTotalPages(data.data.pagination.pages)
        }
      }
    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage, searchQuery, statusFilter, restaurantFilter])

  // Map API request to UI format
  const mapApiRequestToUI = (apiRequest: InRoomDeliveryRequest, index: number) => {
    const formatDate = (date: Date | string | null) => {
      if (!date) return "N/A"
      const d = new Date(date)
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      const month = months[d.getMonth()]
      const day = d.getDate()
      const hours = d.getHours()
      const minutes = d.getMinutes()
      const ampm = hours >= 12 ? 'PM' : 'AM'
      const displayHour = hours % 12 || 12
      return `${month} ${day}, ${displayHour}:${minutes.toString().padStart(2, '0')} ${ampm}`
    }

    const getStatusStyle = (status: string) => {
      switch (status) {
        case "new":
          return { bg: "#D1924F0D", border: "#D1924F40", color: "#D1924F" }
        case "accepted":
          return { bg: "#6457D30D", border: "#6457D340", color: "#6457D3" }
        case "completed":
          return { bg: "#17B26A0D", border: "#17B26A40", color: "#17B26A" }
        case "no-show":
          return { bg: "#1F2A440D", border: "#1F2A4440", color: "#1F2A44" }
        case "canceled":
          return { bg: "#FF0D0D0D", border: "#FF0D0D40", color: "#FF0D0D" }
        default:
          return { bg: "#D1924F0D", border: "#D1924F40", color: "#D1924F" }
      }
    }

    const statusStyle = getStatusStyle(apiRequest.status)

    // Format items array to readable string
    const itemsText = apiRequest.items?.join(", ") || ""

    // Convert items array to modal format
    const itemsForModal = apiRequest.items?.map((item, idx) => {
      // Try to parse item string (e.g., "2x Pizza" or "Pizza")
      const match = item.match(/^(\d+)x\s*(.+)$/i) || item.match(/^(.+)$/)
      if (match && match.length > 2) {
        return {
          id: `item-${idx}`,
          name: match[2].trim(),
          quantity: `x${match[1]}`,
          image: "/placeholder.svg"
        }
      } else if (match && match.length === 2) {
        return {
          id: `item-${idx}`,
          name: match[1].trim(),
          quantity: "x1",
          image: "/placeholder.svg"
        }
      }
      return {
        id: `item-${idx}`,
        name: item,
        quantity: "x1",
        image: "/placeholder.svg"
      }
    }) || []

    return {
      id: apiRequest.requestId || `#IRD${String(apiRequest._id || index + 1).slice(-3).padStart(3, '0')}`,
      requestId: apiRequest.requestId,
      room: apiRequest.roomName,
      guest: apiRequest.residentialName,
      items: itemsText,
      itemsForModal: itemsForModal, // For modal display
      restaurant: apiRequest.restaurant,
      pickup: apiRequest.pickup,
      created: formatDate(apiRequest.createdAt),
      status: apiRequest.status,
      statusBg: statusStyle.bg,
      statusBorder: statusStyle.border,
      statusColor: statusStyle.color,
      assignee: apiRequest.assignee?.name || "",
      hasAssignee: !!apiRequest.assignee,
      notes: apiRequest.notes,
      note: apiRequest.notes,
      _original: apiRequest // Keep original for API calls
    }
  }

  const handleAssignStaff = async (staffId: string) => {
    if (!requestToAssign?._original) return

    try {
      const token = getAuthToken()
      if (!token) {
        alert('Please log in to assign staff')
        return
      }

      // Fetch staff details to get name
      try {
        const staffResponse = await fetch(`/api/partner/staff?limit=1000`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const staffData = await staffResponse.json()
        
        let staffName = "Staff Member"
        if (staffData.success && staffData.data?.staff) {
          const staff = staffData.data.staff.find((s: any) => s._id === staffId)
          if (staff) {
            staffName = staff.staffName || staffName
          }
        }

        const assignee = {
          name: staffName,
          staffId: staffId,
          profilePic: undefined
        }

        const response = await fetch(`/api/partner/in-room-delivery-request/${requestToAssign._original._id}/assign`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ assignee })
        })

        const result = await response.json()

        if (response.ok && result.success) {
          await fetchRequests()
          setShowAssignStaffModal(false)
          setRequestToAssign(null)
        } else {
          alert(result.error || 'Failed to assign staff')
        }
      } catch (staffError) {
        console.error('Error fetching staff:', staffError)
        alert('Failed to fetch staff details')
      }
    } catch (error) {
      console.error('Error assigning staff:', error)
      alert('Failed to assign staff. Please try again.')
    }
  }

  const handleStatusChange = async (newStatus: "new" | "accepted" | "completed" | "no-show" | "canceled") => {
    if (!requestToChangeStatus) return

    try {
      const token = getAuthToken()
      if (!token) {
        alert('Please log in to update status')
        return
      }

      const response = await fetch(`/api/partner/in-room-delivery-request/${requestToChangeStatus._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        await fetchRequests()
        setShowStatusChangeModal(false)
        setRequestToChangeStatus(null)
      } else {
        alert(result.error || 'Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status. Please try again.')
    }
  }

  const handleDeleteRequest = async (requestId: string) => {
    if (!confirm('Are you sure you want to delete this request?')) {
      return
    }

    try {
      const token = getAuthToken()
      if (!token) {
        alert('Please log in to delete request')
        return
      }

      const response = await fetch(`/api/partner/in-room-delivery-request/${requestId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const result = await response.json()

      if (response.ok && result.success) {
        await fetchRequests()
      } else {
        alert(result.error || 'Failed to delete request')
      }
    } catch (error) {
      console.error('Error deleting request:', error)
      alert('Failed to delete request. Please try again.')
    }
  }


  const tabs = [
    {
      id: "requests",
      label: "Requests",
      icon: <PublicIcon src="/assets/icons/houskeeping-request.svg" alt="Requests" width={16} height={16} />,
      href: "/partner/pages/room-delivery/requests"
    },
    {
      id: "restaurants", 
      label: "Restaurants",
      icon: <PublicIcon src="/assets/icons/resturent.svg" alt="Restaurants" width={16} height={16} />,
      href: "/partner/pages/room-delivery/restaurants"
    }
  ]

  const uiRequests = requests.map((req, idx) => mapApiRequestToUI(req, idx))

  // Get unique restaurants for filter dropdown
  const uniqueRestaurants = Array.from(new Set(requests.map(r => r.restaurant).filter(Boolean)))

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
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value))
                    setCurrentPage(1)
                  }}
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
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
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
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value)
                    setCurrentPage(1)
                  }}
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
                  <option value="">Status</option>
                  <option value="New">New</option>
                  <option value="Accepted">Accepted</option>
                  <option value="No-show">No-show</option>
                  <option value="Completed">Completed</option>
                  <option value="Canceled">Canceled</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <RiArrowDownSLine className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              {/* Restaurant dropdown */}
              <div className="relative inline-block">
                <select
                  value={restaurantFilter}
                  onChange={(e) => {
                    setRestaurantFilter(e.target.value)
                    setCurrentPage(1)
                  }}
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
                  <option value="">Restaurant</option>
                  {uniqueRestaurants.map((restaurant) => (
                    <option key={restaurant} value={restaurant}>{restaurant}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <RiArrowDownSLine className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              {/* Pick up dropdown - Note: This is just for display, not filtering */}
              <div className="relative inline-block">
                <select
                  value={pickupFilter}
                  onChange={(e) => setPickupFilter(e.target.value)}
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
                    minWidth: "100px"
                  }}
                >
                  <option value="">Pick up</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Late Night">Late Night</option>
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
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <p className="text-muted-foreground">Loading requests...</p>
              </div>
            ) : (
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
                    ID
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
                    Items
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider" style={{ color: "#000000" }}>
                  <div className="flex items-center gap-1">
                    Restaurant
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider" style={{ color: "#000000" }}>
                  <div className="flex items-center gap-1">
                    Pick Up
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
                  {uiRequests.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="px-4 py-8 text-center text-muted-foreground">
                        No requests found
                      </td>
                    </tr>
                  ) : (
                    uiRequests.map((row, index) => (
                      <tr key={row._original._id || index} className="hover:bg-muted/50 transition-colors">
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
                  }}>
                    <div className="max-w-xs">
                      <div className="truncate" title={row.items}>
                        {row.items}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4" style={{
                    color: "#525866",
                    fontSize: "12px",
                    fontWeight: "400",
                    lineHeight: "19.5px"
                  }}>{row.restaurant}</td>
                  <td className="px-4 py-4" style={{
                    color: "#525866",
                    fontSize: "12px",
                    fontWeight: "400",
                    lineHeight: "19.5px"
                  }}>{row.pickup}</td>
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
                        width: "auto",
                        minWidth: "80px",
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
                            {row.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
                              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                                {row.assignee.charAt(0).toUpperCase()}
                              </div>
                        {row.assignee}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-4">
                          <DropdownMenu
                            trigger={
                              <button className="p-1 hover:bg-gray-100 rounded">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                            }
                            items={[
                              {
                                label: "View request",
                                icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>,
                                onClick: () => {
                                setSelectedRequest(row)
                                setShowViewRequest(true)
                                },
                              },
                              {
                                label: "Change status",
                                icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 16 17">
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
                                </svg>,
                                onClick: () => {
                                  setRequestToChangeStatus(row._original)
                                  setNewStatus(row.status)
                                  setShowStatusChangeModal(true)
                                },
                              },
                              {
                                label: "Assign to staff",
                                icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 16 15">
                                <path d="M1.33301 6.81348C2.88748 5.18536 5.09516 5.1087 6.66634 6.81348M5.66307 2.48014C5.66307 3.40062 4.91582 4.14681 3.99403 4.14681C3.07224 4.14681 2.32499 3.40062 2.32499 2.48014C2.32499 1.55967 3.07224 0.813477 3.99403 0.813477C4.91582 0.813477 5.66307 1.55967 5.66307 2.48014Z" stroke="#141B34" strokeLinecap="round"/>
                                <path d="M9.33301 14.1465C10.8875 12.5184 13.0952 12.4417 14.6663 14.1465M13.6631 9.81315C13.6631 10.7336 12.9158 11.4798 11.994 11.4798C11.0722 11.4798 10.325 10.7336 10.325 9.81315C10.325 8.89268 11.0722 8.14648 11.994 8.14648C12.9158 8.14648 13.6631 8.89268 13.6631 9.81315Z" stroke="#141B34" strokeLinecap="round"/>
                                <path d="M2 8.81331C2 11.3933 4.08667 13.48 6.66667 13.48L6 12.1466" stroke="#141B34" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M10 1.47998H14M10 3.47998H14M10 5.47998H12.3333" stroke="#141B34" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>,
                                onClick: () => {
                                  setRequestToAssign(row)
                                  setShowAssignStaffModal(true)
                                },
                              },
                              {
                                label: "Delete",
                                icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>,
                                onClick: () => {
                                  handleDeleteRequest(row._original._id)
                                },
                                variant: "danger",
                              },
                            ]}
                          />
                  </td>
                </tr>
                    ))
                  )}
            </tbody>
            </table>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between py-3 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Displaying {uiRequests.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0}-{Math.min(currentPage * itemsPerPage, totalItems)} results out of {totalItems}
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LeftArrow />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
      <ViewRoomDeliveryModal
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

      {/* Status Change Modal */}
      {showStatusChangeModal && requestToChangeStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={() => {
            setShowStatusChangeModal(false)
            setRequestToChangeStatus(null)
          }} />
          <div className="relative bg-white shadow-xl w-full max-w-md mx-4" style={{ borderRadius: "10px" }}>
            <div className="flex justify-between items-center p-5 border-b border-black/8">
              <h2 className="text-lg font-semibold text-black">Change Status</h2>
              <button
                onClick={() => {
                  setShowStatusChangeModal(false)
                  setRequestToChangeStatus(null)
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  style={{ borderRadius: "4px" }}
                >
                  <option value="new">New</option>
                  <option value="accepted">Accepted</option>
                  <option value="completed">Completed</option>
                  <option value="no-show">No-show</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 p-5 border-t border-black/8 justify-end">
              <button
                onClick={() => {
                  setShowStatusChangeModal(false)
                  setRequestToChangeStatus(null)
                }}
                className="px-5 py-2 border border-[#CED4DA] bg-white text-black text-sm font-semibold hover:bg-gray-50 transition-colors"
                style={{ borderRadius: "6px" }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusChange(newStatus)}
                className="px-5 py-2 text-white text-sm font-semibold transition-colors bg-[#1F2A44] hover:bg-[#1F2A44]/90"
                style={{ borderRadius: "6px" }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
