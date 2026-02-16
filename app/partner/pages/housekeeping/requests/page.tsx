"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RiHome4Line, RiArrowDownSLine } from "react-icons/ri"
import PublicIcon from "@/app/partner/components/public-icon"
import { LeftArrow, RightArrow } from "@/app/superadmin/components/pagination-arrows"
import DropdownMenu from "@/app/superadmin/components/dropdown-menu"
import ViewHousekeepingModal from "@/app/partner/components/view-housekeeping-modal"
import AssignStaffModal from "@/app/partner/components/assign-staff-modal"
import { getAuthToken } from "@/lib/auth-utils"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import AlertDialog from "@/app/partner/components/alert-dialog"
import ConfirmationDialog from "@/app/partner/components/confirmation-dialog"

interface HousekeepingRequest {
  _id: string
  id?: string
  roomId: string
  roomName: string
  guest: {
    name: string
    email?: string
  }
  type: "custom cleaning" | "item needed"
  cleaningType?: "full room" | "quick refresh" | "custom"
  itemQuantity?: number
  deliveryDetail?: {
    deliveryMethod: string
    deliveryWindow: string
  }
  requestedFor: string
  status: "new" | "accepted" | "completed" | "no-show" | "canceled"
  priority: "urgent" | "medium" | "low"
  assignee?: {
    name: string
    staffId: string
    profilePic?: string
  }
  notes?: string
  createdAt: string
  updatedAt: string
}

export default function RequestsPage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [showViewRequest, setShowViewRequest] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [showAssignStaffModal, setShowAssignStaffModal] = useState(false)
  const [requestToAssign, setRequestToAssign] = useState<any>(null)
  const [requests, setRequests] = useState<HousekeepingRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false)
  const [requestToChangeStatus, setRequestToChangeStatus] = useState<HousekeepingRequest | null>(null)
  const [statusChangeSuccess, setStatusChangeSuccess] = useState(false)
  // Selection state
  const [selectedRequests, setSelectedRequests] = useState<Set<string>>(new Set())
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isBulkDelete, setIsBulkDelete] = useState(false)
  // Alert and confirmation dialog state
  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    variant: "success" | "error" | "warning" | "info"
  }>({
    isOpen: false,
    title: "",
    message: "",
    variant: "info"
  })

  const showAlert = (title: string, message: string, variant: "success" | "error" | "warning" | "info" = "info") => {
    setAlertDialog({ isOpen: true, title, message, variant })
  }

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
      if (statusFilter) queryParams.append('status', statusFilter.toLowerCase())
      if (priorityFilter) queryParams.append('priority', priorityFilter.toLowerCase())
      if (typeFilter) {
        // Map UI type to API type
        const apiType = typeFilter === "Request needed" ? "item needed" : 
                       typeFilter === "Custom cleaning" ? "custom cleaning" : typeFilter.toLowerCase()
        queryParams.append('type', apiType)
      }

      const response = await fetch(`/api/partner/housekeeping-requests?${queryParams}`, {
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
  }, [currentPage, itemsPerPage, searchQuery, statusFilter, priorityFilter, typeFilter])

  // Map API request to UI format
  const mapApiRequestToUI = (apiRequest: HousekeepingRequest) => {
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

    const getPriorityStyle = (priority: string) => {
      switch (priority) {
        case "urgent":
          return { bg: "#FF0D0D0D", border: "#FF0D0D40", color: "#FF0D0D" }
        case "medium":
          return { bg: "#D1924F0D", border: "#D1924F40", color: "#D1924F" }
        case "low":
          return { bg: "#56C6FF0D", border: "#56C6FF40", color: "#56C6FF" }
        default:
          return { bg: "#D1924F0D", border: "#D1924F40", color: "#D1924F" }
      }
    }

    const statusStyle = getStatusStyle(apiRequest.status)
    const priorityStyle = getPriorityStyle(apiRequest.priority)

    return {
      id: apiRequest._id || apiRequest.id || '',
      requestId: apiRequest._id || apiRequest.id || '',
      room: apiRequest.roomName,
      guest: apiRequest.guest.name,
      type: apiRequest.type === "custom cleaning" ? "Custom cleaning" : "Request needed",
      created: formatDate(apiRequest.createdAt),
      status: apiRequest.status,
      statusBg: statusStyle.bg,
      statusBorder: statusStyle.border,
      statusColor: statusStyle.color,
      priority: apiRequest.priority,
      priorityBg: priorityStyle.bg,
      priorityBorder: priorityStyle.border,
      priorityColor: priorityStyle.color,
      assignee: apiRequest.assignee?.name || "",
      hasAssignee: !!apiRequest.assignee,
      requestedFor: apiRequest.requestedFor,
      cleaningType: apiRequest.cleaningType || "",
      note: apiRequest.notes,
      _original: apiRequest // Keep original for API calls
    }
  }

  const handleAssignStaff = async (staffId: string) => {
    if (!requestToAssign?._original) return

    try {
      const token = getAuthToken()
      if (!token) {
        showAlert('Authentication Required', 'Please log in to assign staff', 'warning')
        return
      }

      // Get staff details (you may need to fetch from staff API)
      // For now, using a placeholder
      const assignee = {
        name: "Staff Member", // This should come from staff API
        staffId: staffId,
        profilePic: undefined
      }

      const response = await fetch(`/api/partner/housekeeping-requests/${requestToAssign._original._id}/assign`, {
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
        showAlert('Success', 'Staff assigned successfully', 'success')
      } else {
        showAlert('Error', result.error || 'Failed to assign staff', 'error')
      }
    } catch (error) {
      console.error('Error assigning staff:', error)
      showAlert('Error', 'Failed to assign staff. Please try again.', 'error')
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

      const response = await fetch(`/api/partner/housekeeping-requests/${requestToChangeStatus._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setStatusChangeSuccess(true)
        await fetchRequests()
        
        // Close modal after showing success message
        setTimeout(() => {
          setShowStatusChangeModal(false)
          setRequestToChangeStatus(null)
          setStatusChangeSuccess(false)
        }, 1500)
      } else {
        showAlert('Error', result.error || 'Failed to update status', 'error')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      showAlert('Error', 'Failed to update status. Please try again.', 'error')
    }
  }

  const handleRequestSelection = (requestId: string, isSelected: boolean) => {
    const newSelectedRequests = new Set(selectedRequests)
    if (isSelected) {
      newSelectedRequests.add(requestId)
    } else {
      newSelectedRequests.delete(requestId)
    }
    setSelectedRequests(newSelectedRequests)
  }

  const handleSelectAll = () => {
    if (selectedRequests.size === requests.length && requests.length > 0) {
      setSelectedRequests(new Set())
    } else {
      setSelectedRequests(new Set(requests.map(req => req._id || req.id || '')))
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

      const response = await fetch(`/api/partner/housekeeping-requests/${requestId}`, {
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

  const handleBulkDelete = () => {
    if (selectedRequests.size === 0) {
      alert('Please select at least one request to delete')
      return
    }
    setIsBulkDelete(true)
    setShowDeleteModal(true)
  }

  const confirmBulkDelete = async () => {
    if (selectedRequests.size === 0) return
    try {
      const token = getAuthToken()
      if (!token) {
        alert('Please log in to delete requests')
        return
      }
      
      // Delete all selected requests
      const deletePromises = Array.from(selectedRequests).map(requestId =>
        fetch(`/api/partner/housekeeping-requests/${requestId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      )
      
      const results = await Promise.all(deletePromises)
      const failed = results.filter(r => !r.ok)
      
      if (failed.length === 0) {
        await fetchRequests()
        setShowDeleteModal(false)
        setSelectedRequests(new Set())
        setIsBulkDelete(false)
      } else {
        alert(`Failed to delete ${failed.length} request(s). Please try again.`)
      }
    } catch (error) {
      console.error('Error deleting requests:', error)
      alert('Failed to delete requests. Please try again.')
    }
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setIsBulkDelete(false)
  }

  // Export housekeeping requests to Excel
  const handleExportRequests = () => {
    if (!requests || requests.length === 0) {
      alert("No request data available to export")
      return
    }

    // Prepare data for export - map request data to Excel format
    const exportData = requests.map((request) => {
      const mapped = mapApiRequestToUI(request)
      return {
        "ID": `#${mapped.id.substring(0, 8)}`,
        "Room": mapped.room,
        "Guest": mapped.guest,
        "Type": mapped.type,
        "Created": mapped.created,
        "Status": mapped.status.charAt(0).toUpperCase() + mapped.status.slice(1),
        "Priority": mapped.priority.charAt(0).toUpperCase() + mapped.priority.slice(1),
        "Assignee": mapped.hasAssignee ? mapped.assignee : "-",
      }
    })

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Housekeeping Requests")

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    })

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })

    // Download file
    const fileName = `housekeeping-requests-export-${new Date().toISOString().split('T')[0]}.xlsx`
    saveAs(blob, fileName)
  }


  const tabs = [
    {
      id: "requests",
      label: "Requests",
      icon: <PublicIcon src="/assets/icons/houskeeping-request.svg" alt="Requests" width={16} height={16} />,
      href: "/partner/pages/housekeeping/requests"
    },
    {
      id: "house-cleaning", 
      label: "House cleaning",
      icon: <PublicIcon src="/assets/icons/housekeeping-cleaning.svg" alt="House cleaning" width={16} height={16} />,
      href: "/partner/pages/housekeeping/house-cleaning"
    },
    {
      id: "requests-management",
      label: "Requests management", 
      icon: <PublicIcon src="/assets/icons/settings.svg" alt="Requests management" width={16} height={16} />,
      href: "/partner/pages/housekeeping/requests-management"
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
                width: "210px",
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
            {selectedRequests.size > 0 ? (
              // Selection controls
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSelectedRequests(new Set())}
                  className="flex items-center justify-center w-6 h-6 rounded text-white"
                  style={{ backgroundColor: "#1F2A44" }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                <span style={{ color: "#00000099", fontSize: "14px" }}>
                  {selectedRequests.size} item{selectedRequests.size > 1 ? 's' : ''} selected
                </span>
                <button 
                  onClick={handleSelectAll}
                  style={{ 
                    color: "#212121", 
                    fontSize: "14px", 
                    textDecoration: "underline",
                    fontWeight: "400"
                  }}
                >
                  Select all items
                </button>
                <button 
                  onClick={handleExportRequests}
                  style={{ 
                    color: "#1F2A44", 
                    fontSize: "14px", 
                    textDecoration: "underline",
                    fontWeight: "400",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                    <path d="M11.3333 10.6666C11.6705 10.9943 13 11.8665 13 12.3333M11.3333 14C11.6705 13.6723 13 12.8001 13 12.3333M13 12.3333L7.66667 12.3333" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.33398 14.6666H6.15217C3.97803 14.6666 2.89096 14.6666 2.13603 14.1347C1.91973 13.9823 1.7277 13.8016 1.56578 13.598C1.00065 12.8875 1.00065 11.8644 1.00065 9.81814V8.12117C1.00065 6.14572 1.00065 5.158 1.31328 4.36913C1.81586 3.10091 2.87874 2.10055 4.22622 1.62753C5.0644 1.33329 6.11386 1.33329 8.21277 1.33329C9.41215 1.33329 10.0118 1.33329 10.4908 1.50143C11.2608 1.77172 11.8682 2.34336 12.1553 3.06805C12.334 3.51884 12.334 4.08325 12.334 5.21208V8.66663" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1.0013 8C1.0013 6.7727 1.99622 5.77778 3.22352 5.77778C3.66738 5.77778 4.19066 5.85555 4.62221 5.73992C5.00565 5.63718 5.30514 5.33768 5.40789 4.95424C5.52352 4.52269 5.44575 3.99941 5.44575 3.55556C5.44575 2.32826 6.44067 1.33333 7.66797 1.33333" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Export
                </button>
                <button 
                  onClick={handleBulkDelete}
                  style={{ 
                    color: "#1F2A44", 
                    fontSize: "14px", 
                    textDecoration: "underline",
                    fontWeight: "400",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 2V1C6 0.447715 6.44772 0 7 0H9C9.55228 0 10 0.447715 10 1V2M6 2H2M6 2H10M10 2H14M2 2V13C2 14.1046 2.89543 15 4 15H12C13.1046 15 14 14.1046 14 13V2M4 6V11M8 6V11M12 6V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Delete
                </button>
              </div>
            ) : (
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
                  <option value="new">New</option>
                  <option value="accepted">Accepted</option>
                  <option value="completed">Completed</option>
                  <option value="no-show">No-show</option>
                  <option value="canceled">Canceled</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <RiArrowDownSLine className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              {/* Priority dropdown */}
              <div className="relative inline-block">
                <select
                  value={priorityFilter}
                  onChange={(e) => {
                    setPriorityFilter(e.target.value)
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
                  <option value="">Priority</option>
                  <option value="urgent">Urgent</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <RiArrowDownSLine className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              {/* Type dropdown */}
              <div className="relative inline-block">
                <select
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value)
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
                  <option value="">Type</option>
                  <option value="Custom cleaning">Custom cleaning</option>
                  <option value="Request needed">Request needed</option>
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
              <button 
                onClick={handleExportRequests}
                className="flex py-[8.52px] px-5 justify-center items-center gap-1.5 border border-[#CED4DA] bg-[#FBFAFA] hover:bg-muted/80 transition-colors" 
                style={{ borderRadius: "6px" }}
              >
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
            )}
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
                  <input 
                    type="checkbox" 
                    className="rounded" 
                    checked={selectedRequests.size === requests.length && requests.length > 0}
                    onChange={handleSelectAll}
                    style={{
                      accentColor: "#1F2A44",
                      width: "16px",
                      height: "16px"
                    }}
                  />
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
                    Type
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
                    Priority
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
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                    No requests found
                  </td>
                </tr>
              ) : (
                requests.map((apiRequest, index) => {
                  const row = mapApiRequestToUI(apiRequest)
                  return (
                <tr 
                  key={index} 
                  className={`hover:bg-muted/50 transition-colors ${
                    selectedRequests.has(apiRequest._id || apiRequest.id || '') ? 'bg-muted/30' : ''
                  }`}
                >
                  <td className="px-4 py-4">
                    <input 
                      type="checkbox" 
                      className="rounded" 
                      checked={selectedRequests.has(apiRequest._id || apiRequest.id || '')}
                      onChange={(e) => handleRequestSelection(apiRequest._id || apiRequest.id || '', e.target.checked)}
                      style={{
                        accentColor: "#1F2A44",
                        width: "16px",
                        height: "16px"
                      }}
                    />
                  </td>
                  <td className="px-4 py-4" style={{
                    color: "#525866",
                    fontSize: "12px",
                    fontWeight: "400",
                    lineHeight: "19.5px"
                  }}>#{row.id.substring(0, 8)}</td>
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
                          label: "Edit",
                          icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>,
                          onClick: () => {
                            // Edit functionality if needed
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
                            setRequestToChangeStatus(apiRequest)
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
                            setRequestToAssign({ ...row, _original: apiRequest })
                            setShowAssignStaffModal(true)
                          },
                        },
                        {
                          label: "Delete",
                          icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>,
                          onClick: () => {
                            handleDeleteRequest(apiRequest._id)
                          },
                          variant: "danger",
                        },
                      ]}
                    />
                  </td>
                </tr>
                  )
                })
              )}
            </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between py-3 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Displaying {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} results out of {totalItems}
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
                let page: number
                if (totalPages <= 5) {
                  page = i + 1
                } else if (currentPage <= 3) {
                  page = i + 1
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i
                } else {
                  page = currentPage - 2 + i
                }
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
      <ViewHousekeepingModal
        request={selectedRequest}
        isOpen={showViewRequest}
        onClose={() => {
          setShowViewRequest(false)
          setSelectedRequest(null)
        }}
        onStatusChange={fetchRequests}
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

      {/* Change Status Modal */}
      {showStatusChangeModal && requestToChangeStatus && (
        <div 
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm"
          onClick={() => {
            if (!statusChangeSuccess) {
              setShowStatusChangeModal(false)
              setRequestToChangeStatus(null)
            }
          }}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all"
            style={{ borderRadius: "12px" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Change Status</h2>
              <button
                onClick={() => {
                  if (!statusChangeSuccess) {
                    setShowStatusChangeModal(false)
                    setRequestToChangeStatus(null)
                  }
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full p-1"
                disabled={statusChangeSuccess}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              {/* Success Message */}
              {statusChangeSuccess && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 ease-in-out">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">Status updated successfully!</span>
                </div>
              )}

              <p className="text-gray-700 mb-4 font-medium">Select new status for this request:</p>
              <div className="space-y-2">
                {(["new", "accepted", "completed", "no-show", "canceled"] as const).map((status) => {
                  const isActive = requestToChangeStatus.status === status
                  return (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      disabled={statusChangeSuccess}
                      className={`
                        w-full text-left px-4 py-3 rounded-lg 
                        transition-all duration-200 
                        capitalize font-medium
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${isActive 
                          ? 'bg-blue-50 text-blue-700 border-2 border-blue-200' 
                          : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100 hover:border-gray-200 active:bg-gray-200'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span>{status.replace('-', ' ')}</span>
                        {isActive && (
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-80 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
          <div className="bg-white rounded-[10px] w-full max-w-md mx-4">
            {/* First Section - Header */}
            <div 
              className="flex justify-between items-center px-4 py-5 rounded-t-[10px] border-b border-black/4"
              style={{
                borderBottom: "1px solid rgba(0, 0, 0, 0.04)",
                background: "#FFF"
              }}
            >
              <h2 
                className="text-black font-bold text-xl leading-normal"
                style={{
                  fontSize: "20px",
                  fontWeight: 700
                }}
              >
                Delete Request{isBulkDelete && selectedRequests.size > 1 ? 's' : ''}
              </h2>
              <button
                onClick={cancelDelete}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Second Section - Content */}
            <div 
              className="px-4 py-5 border-b border-black/6"
              style={{
                borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
                background: "#FFF"
              }}
            >
              <p 
                className="text-gray-600 text-lg leading-normal"
                style={{
                  color: "#525866",
                  fontSize: "18px",
                  fontWeight: 400
                }}
              >
                {isBulkDelete 
                  ? `Are you sure you want to delete ${selectedRequests.size} request${selectedRequests.size > 1 ? 's' : ''} permanently?`
                  : 'Are you sure you want to delete this request permanently?'
                }
              </p>
            </div>

            {/* Third Section - Footer */}
            <div 
              className="flex justify-end items-center gap-18 px-4 py-5 rounded-b-[10px] border-t border-black/4"
              style={{
                borderTop: "1px solid rgba(0, 0, 0, 0.04)",
                background: "#FFF",
                gap: "10px"
              }}
            >
              <div className="flex gap-[16px] flex-end">
                <button
                  onClick={cancelDelete}
                  className="flex flex-col justify-center items-center px-2.5 py-2 rounded-md text-center font-medium text-sm leading-5 transition-colors"
                  style={{
                    padding: "8.52px 10px",
                    borderRadius: "6px",
                    background: "#FBFAFA",
                    color: "#000",
                    fontSize: "14px",
                    fontWeight: 500,
                    lineHeight: "19.5px"
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBulkDelete}
                  className="flex flex-col justify-center items-center px-2.5 py-2 rounded-md text-center font-medium text-sm leading-5 transition-colors"
                  style={{
                    padding: "8.52px 10px",
                    borderRadius: "6px",
                    background: "#EB1D1D",
                    color: "#FFF",
                    fontSize: "14px",
                    fontWeight: 500,
                    lineHeight: "19.5px"
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

