"use client"

import { useState, useEffect } from "react"
import { getAuthToken } from "@/lib/auth-utils"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import {
  RiMoreLine,
  RiEyeLine,
  RiEditLine,
  RiUserAddLine,
  RiUserUnfollowLine,
  RiReplyLine,
  RiCheckboxCircleLine,
  RiDeleteBinLine,
} from "react-icons/ri"
// Helper functions to get status and priority styles matching the partner dashboard
const getStatusStyle = (status: string) => {
  const styles = {
    open: { bg: "#56C6FF0D", border: "#56C6FF40", color: "#56C6FF" },
    reopened: { bg: "#6457D30D", border: "#6457D340", color: "#6457D3" },
    pending: { bg: "#D1924F0D", border: "#D1924F40", color: "#D1924F" },
    resolved: { bg: "#17B26A0D", border: "#17B26A40", color: "#17B26A" },
    canceled: { bg: "#FF0D0D0D", border: "#FF0D0D40", color: "#FF0D0D" },
    sent: { bg: "#D1924F0D", border: "#D1924F40", color: "#D1924F" },
  }
  return styles[status as keyof typeof styles] || styles.open
}

const getPriorityStyle = (priority: string) => {
  const styles = {
    low: { bg: "#56C6FF0D", border: "#56C6FF40", color: "#56C6FF" },
    medium: { bg: "#D1924F0D", border: "#D1924F40", color: "#D1924F" },
    urgent: { bg: "#FF0D0D0D", border: "#FF0D0D40", color: "#FF0D0D" },
  }
  return styles[priority as keyof typeof styles] || styles.low
}
import DropdownMenu from "@/app/superadmin/components/dropdown-menu"
import DropdownArrow from "@/app/superadmin/components/dropdown-arrow"
import SortArrows from "@/app/superadmin/components/sort-arrows"
import { LeftArrow, RightArrow } from "@/app/superadmin/components/pagination-arrows"
import ViewTicketModal from "@/app/superadmin/components/view-ticket-modal"
import ChangeStatusModal from "@/app/superadmin/components/change-status-modal"
import UnmarkTicketModal from "@/app/superadmin/components/unmark-ticket-modal"
import ContactPartnerModal from "@/app/superadmin/components/contact-partner-modal"
import DeleteTicketModal from "@/app/superadmin/components/delete-ticket-modal"
import AssignTicketModal from "@/app/superadmin/components/assign-ticket-modal"
import { 
  ChangeStatusIcon, 
  MarkAsTicketIcon 
} from "@/app/superadmin/components/icons"

interface Ticket {
  id: string
  ticketId: string
  title: string
  status: "open" | "reopened" | "pending" | "resolved" | "canceled" | "sent"
  priority: "low" | "medium" | "urgent"
  assignee: {
    name: string
    avatar: string
  } | null
  dateCreated: string
  dateUpdate: string
  hotelName: string
  hotelEmail: string
  description: string
  image?: string
  isMarkedAsTicket: boolean
  partnerId?: string
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | Ticket["status"]>("all")
  const [priorityFilter, setPriorityFilter] = useState<"all" | Ticket["priority"]>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalTickets, setTotalTickets] = useState(0)
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
  const [showViewTicketModal, setShowViewTicketModal] = useState(false)
  const [viewingTicket, setViewingTicket] = useState<Ticket | null>(null)
  const [openChatOnView, setOpenChatOnView] = useState(false)
  const [showChangeStatusModal, setShowChangeStatusModal] = useState(false)
  const [ticketToChangeStatus, setTicketToChangeStatus] = useState<Ticket | null>(null)
  const [showUnmarkTicketModal, setShowUnmarkTicketModal] = useState(false)
  const [ticketToUnmark, setTicketToUnmark] = useState<Ticket | null>(null)
  const [showContactPartnerModal, setShowContactPartnerModal] = useState(false)
  const [ticketToContact, setTicketToContact] = useState<Ticket | null>(null)
  const [showDeleteTicketModal, setShowDeleteTicketModal] = useState(false)
  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null)
  const [showAssignTicketModal, setShowAssignTicketModal] = useState(false)
  const [ticketToAssign, setTicketToAssign] = useState<Ticket | null>(null)
  const [assigneeOptions, setAssigneeOptions] = useState<Array<{ value: string; label: string; profilePic?: string }>>([])

  // Map API ticket to UI Ticket interface
  const mapApiTicketToTicket = (apiTicket: any): Ticket => {
    const formatDate = (date: Date | string | null) => {
      if (!date) return ''
      try {
        const d = new Date(date)
        return d.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      } catch {
        return ''
      }
    }

    const partner = apiTicket.partner || {}
    const assignee = apiTicket.assignee || null
    const assigneeName = assignee?.name || null
    const assigneeInitials = assigneeName ? assigneeName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : null

    return {
      id: apiTicket._id || apiTicket.id,
      ticketId: apiTicket.superadminTicketId || apiTicket.ticketId || '', // Use superadminTicketId for display in superadmin
      title: apiTicket.title || '',
      status: apiTicket.status || 'open',
      priority: apiTicket.priority || 'low',
      assignee: assigneeName ? {
        name: assigneeName,
        avatar: assigneeInitials || 'UN'
      } : null,
      dateCreated: formatDate(apiTicket.createdAt),
      dateUpdate: formatDate(apiTicket.updatedAt),
      hotelName: partner.hotelName || 'Unknown Hotel',
      hotelEmail: partner.hotelEmail || '',
      description: apiTicket.description || '',
      image: apiTicket.image || undefined,
      isMarkedAsTicket: apiTicket.markasticket ?? false,
      partnerId: apiTicket.partnerId || partner._id || partner.id || undefined
    }
  }

  // Fetch tickets from API
  const fetchTickets = async () => {
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

      if (searchTerm) {
        queryParams.append('search', searchTerm)
      }
      if (statusFilter !== 'all') {
        queryParams.append('status', statusFilter)
      }
      if (priorityFilter !== 'all') {
        queryParams.append('priority', priorityFilter)
      }

      const response = await fetch(`/api/superadmin/tickets?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          const mappedTickets = (result.data.tickets || []).map(mapApiTicketToTicket)
          setTickets(mappedTickets)
          setTotalTickets(result.data.pagination?.total || 0)
        } else {
          setTickets([])
          setTotalTickets(0)
        }
      } else {
        console.error('Failed to fetch tickets')
        setTickets([])
        setTotalTickets(0)
      }
    } catch (error) {
      console.error('Error fetching tickets:', error)
      setTickets([])
      setTotalTickets(0)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch tickets on component mount and when filters change
  useEffect(() => {
    fetchTickets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage, statusFilter, priorityFilter])

  // Fetch team members for assignee dropdown
  useEffect(() => {
    const fetchAssignees = async () => {
      try {
        const token = getAuthToken()
        if (!token) return

        // Fetch members from Luxeli team
        const response = await fetch('/api/superadmin/members?limit=1000', {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        if (response.ok) {
          const data = await response.json().catch(() => ({}))
          // API returns members in data.members
          const members = data.data?.members || data.members || []
          const options = members.map((member: any) => ({
            value: member._id || member.id,
            label: member.name || 'Unknown',
            profilePic: member.profileImage || undefined
          }))
          setAssigneeOptions(options)
        }
      } catch (error) {
        console.error('Error fetching assignees:', error)
      }
    }
    fetchAssignees()
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1)
      fetchTickets()
    }, 500)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm])

  // Simple queue order - tickets are already sorted by creation date from API
  const totalPages = Math.ceil(totalTickets / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTickets = tickets

  const handleStatusChange = async (ticketId: string, newStatus: Ticket["status"]) => {
    try {
      const token = getAuthToken()
      if (!token) {
        console.error('No auth token found')
        alert('Authentication token not found. Please log in again.')
        return
      }

      console.log('Updating ticket:', ticketId, 'to status:', newStatus)

      const response = await fetch(`/api/superadmin/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      const responseData = await response.json().catch(() => ({}))
      
      if (response.ok) {
        console.log('Ticket updated successfully:', responseData)
        // Refresh tickets after update
        await fetchTickets()
      } else {
        console.error('Failed to update ticket status:', {
          status: response.status,
          error: responseData.error || responseData.message || 'Unknown error',
          fullResponse: responseData
        })
        alert(`Failed to update ticket status: ${responseData.error || responseData.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating ticket status:', error)
      alert(`Error updating ticket status: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleViewTicket = (ticket: Ticket, openChat: boolean = false) => {
    setViewingTicket(ticket)
    setOpenChatOnView(openChat)
    setShowViewTicketModal(true)
  }

  const closeViewTicketModal = () => {
    setShowViewTicketModal(false)
    setViewingTicket(null)
    setOpenChatOnView(false)
  }

  const handleChangeStatus = (ticket: Ticket) => {
    setTicketToChangeStatus(ticket)
    setShowChangeStatusModal(true)
  }

  const closeChangeStatusModal = () => {
    setShowChangeStatusModal(false)
    setTicketToChangeStatus(null)
  }

  const confirmStatusChange = async (ticketId: string, newStatus: Ticket["status"]) => {
    try {
      await handleStatusChange(ticketId, newStatus)
      // Close modal after successful update
      closeChangeStatusModal()
    } catch (error) {
      console.error('Error confirming status change:', error)
    }
  }


  const handleDeleteTicket = (ticket: Ticket) => {
    setTicketToDelete(ticket)
    setShowDeleteTicketModal(true)
  }

  const closeDeleteTicketModal = () => {
    setShowDeleteTicketModal(false)
    setTicketToDelete(null)
  }

  const handleUnmarkTicket = (ticket: Ticket) => {
    setTicketToUnmark(ticket)
    setShowUnmarkTicketModal(true)
  }

  const closeUnmarkTicketModal = () => {
    setShowUnmarkTicketModal(false)
    setTicketToUnmark(null)
  }

  const confirmUnmarkTicket = async (ticketId: string) => {
    try {
      const token = getAuthToken()
      if (!token) {
        console.error('No auth token found')
        alert('Authentication token not found. Please log in again.')
        return
      }

      // Find the ticket to get current markasticket status
      const ticket = tickets.find((t) => t.id === ticketId)
      if (!ticket) {
        console.error('Ticket not found')
        return
      }

      // Toggle the markasticket status
      const newMarkasticketStatus = !ticket.isMarkedAsTicket

      console.log('Updating ticket:', ticketId, 'markasticket to:', newMarkasticketStatus)

      const response = await fetch(`/api/superadmin/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ markasticket: newMarkasticketStatus })
      })

      const responseData = await response.json().catch(() => ({}))
      
      if (response.ok) {
        console.log('Ticket updated successfully:', responseData)
        // Close modal after successful update
        closeUnmarkTicketModal()
        // Refresh tickets after update
        await fetchTickets()
      } else {
        console.error('Failed to update ticket markasticket status:', {
          status: response.status,
          error: responseData.error || responseData.message || 'Unknown error',
          fullResponse: responseData
        })
        alert(`Failed to update ticket: ${responseData.error || responseData.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating ticket markasticket status:', error)
      alert(`Error updating ticket: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleContactPartner = (ticket: Ticket) => {
    setTicketToContact(ticket)
    setShowContactPartnerModal(true)
  }

  const closeContactPartnerModal = () => {
    setShowContactPartnerModal(false)
    setTicketToContact(null)
  }


  const handleAssignTicket = (ticket: Ticket) => {
    setTicketToAssign(ticket)
    setShowAssignTicketModal(true)
  }

  const closeAssignTicketModal = () => {
    setShowAssignTicketModal(false)
    setTicketToAssign(null)
  }

  const confirmAssignTicket = async (ticketId: string, assigneeId: string) => {
    try {
      const token = getAuthToken()
      if (!token) {
        console.error('No auth token found')
        alert('Authentication token not found. Please log in again.')
        return
      }

      // Find the assignee from the options
      const assignee = assigneeOptions.find(opt => opt.value === assigneeId)
      if (!assignee) {
        alert('Selected assignee not found')
        return
      }

      console.log('Assigning ticket:', ticketId, 'to:', assignee.label)

      // Prepare assignee object with name and profilePic if available
      const assigneeData: { name: string; profilePic?: string } = {
        name: assignee.label
      }
      
      // Include profilePic if available (from the assigneeOptions)
      if (assignee.profilePic) {
        assigneeData.profilePic = assignee.profilePic
      }

      // When assigning a member, also set status to "open"
      const response = await fetch(`/api/superadmin/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          assignee: assigneeData,
          status: 'open' // Set status to "open" when assigning a member
        })
      })

      const responseData = await response.json().catch(() => ({}))
      
      if (response.ok) {
        console.log('Ticket assigned successfully:', responseData)
        // Refresh tickets after assignment
        await fetchTickets()
        closeAssignTicketModal()
        alert('Ticket assigned successfully')
      } else {
        console.error('Failed to assign ticket:', {
          status: response.status,
          error: responseData.error || responseData.message || 'Unknown error',
          fullResponse: responseData
        })
        alert(`Failed to assign ticket: ${responseData.error || responseData.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error assigning ticket:', error)
      alert(`Error assigning ticket: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleUnassignTicket = async (ticket: Ticket) => {
    try {
      const token = getAuthToken()
      if (!token) {
        console.error('No auth token found')
        alert('Authentication token not found. Please log in again.')
        return
      }

      if (!ticket.assignee) {
        alert('This ticket has no assignee to unassign')
        return
      }

      // Confirm unassignment
      if (!confirm(`Are you sure you want to unassign ${ticket.assignee.name} from this ticket?`)) {
        return
      }

      console.log('Unassigning ticket:', ticket.id)

      const response = await fetch(`/api/superadmin/tickets/${ticket.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          assignee: null // Remove assignee by setting to null
        })
      })

      const responseData = await response.json().catch(() => ({}))
      
      if (response.ok) {
        console.log('Ticket unassigned successfully:', responseData)
        // Refresh tickets after unassignment
        await fetchTickets()
        alert('Ticket unassigned successfully')
      } else {
        console.error('Failed to unassign ticket:', {
          status: response.status,
          error: responseData.error || responseData.message || 'Unknown error',
          fullResponse: responseData
        })
        alert(`Failed to unassign ticket: ${responseData.error || responseData.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error unassigning ticket:', error)
      alert(`Error unassigning ticket: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleExportToExcel = () => {
    try {
      // Prepare data for Excel export
      const exportData = tickets.map((ticket) => ({
        "Ticket ID": ticket.ticketId,
        "Title": ticket.title,
        "Hotel Name": ticket.hotelName,
        "Status": ticket.status,
        "Priority": ticket.priority,
        "Assignee": ticket.assignee ? ticket.assignee.name : "-",
        "Date Created": ticket.dateCreated,
        "Date Update": ticket.dateUpdate,
        "Hotel Email": ticket.hotelEmail,
      }))

      // Create a new workbook
      const wb = XLSX.utils.book_new()
      
      // Convert data to worksheet
      const ws = XLSX.utils.json_to_sheet(exportData)

      // Set column widths for better readability
      const colWidths = [
        { wch: 15 }, // Ticket ID
        { wch: 30 }, // Title
        { wch: 25 }, // Hotel Name
        { wch: 12 }, // Status
        { wch: 12 }, // Priority
        { wch: 20 }, // Assignee
        { wch: 18 }, // Date Created
        { wch: 18 }, // Date Update
        { wch: 30 }, // Hotel Email
      ]
      ws["!cols"] = colWidths

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Tickets")

      // Generate Excel file buffer
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })

      // Create blob and download
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })

      // Generate filename with current date
      const date = new Date()
      const dateStr = date.toISOString().split("T")[0]
      const filename = `tickets_export_${dateStr}.xlsx`

      // Save file
      saveAs(blob, filename)
    } catch (error) {
      console.error("Error exporting to Excel:", error)
      alert("Failed to export tickets to Excel. Please try again.")
    }
  }

  const confirmDeleteTicket = async (ticketId: string) => {
    try {
      const token = getAuthToken()
      if (!token) {
        console.error('No auth token found')
        alert('Authentication token not found. Please log in again.')
        return
      }

      console.log('Deleting ticket:', ticketId)

      const response = await fetch(`/api/superadmin/tickets/${ticketId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const responseData = await response.json().catch(() => ({}))
      
      if (response.ok) {
        console.log('Ticket deleted successfully:', responseData)
        // Close modal after successful deletion
        closeDeleteTicketModal()
        // Refresh tickets after deletion
        await fetchTickets()
      } else {
        console.error('Failed to delete ticket:', {
          status: response.status,
          error: responseData.error || responseData.message || 'Unknown error',
          fullResponse: responseData
        })
        alert(`Failed to delete ticket: ${responseData.error || responseData.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error deleting ticket:', error)
      alert(`Error deleting ticket: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="p-4">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Support</h1>
        <p className="text-sm text-muted-foreground">Last updated on 09/15/2025, 12AM</p>
      </div>

      {/* Tickets List */}
      <div className="bg-card rounded-xl p-4">
        {/* Table Header */}
        <div className="flex items-center justify-between pb-4 ">
          <h3 className="text-base font-semibold text-foreground">Tickets list</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="appearance-none"
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
                <option value={10}>Display 10</option>
                <option value={20}>Display 20</option>
                <option value={50}>Display 50</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <DropdownArrow />
              </div>
            </div>

            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => { setCurrentPage(1); setSearchTerm(e.target.value) }}
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

            <div className="relative">
              <select 
                value={statusFilter}
                onChange={(e) => { setCurrentPage(1); setStatusFilter((e.target.value.toLowerCase() as any) || "all") }}
                className="appearance-none"
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
                <option value="all">Status</option>
                <option value="open">Open</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="sent">Sent</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <DropdownArrow />
              </div>
            </div>

            <div className="relative">
              <select 
                value={priorityFilter}
                onChange={(e) => { setCurrentPage(1); setPriorityFilter((e.target.value.toLowerCase() as any) || "all") }}
                className="appearance-none"
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
                <option value="all">Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="urgent">Urgent</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <DropdownArrow />
              </div>
            </div>

            <div className="relative">
              <select 
                className="appearance-none"
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
                <option>Assignee</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <DropdownArrow />
              </div>
            </div>

            <button 
              onClick={handleExportToExcel}
              disabled={tickets.length === 0}
              className="flex py-[8.52px] px-5 justify-center items-center gap-1.5 border border-[#CED4DA] bg-[#FBFAFA] hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
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
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="w-12 px-4 py-4">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-4 py-4 text-left">
                  <span style={{ color: "#000", fontSize: "12px", fontWeight: "500", lineHeight: "19.5px" }}>
                    Ticket ID
                  </span>
                </th>
                <th className="px-4 py-4 text-left">
                  <span style={{ color: "#000", fontSize: "12px", fontWeight: "500", lineHeight: "19.5px" }}>
                    Title
                  </span>
                </th>
                <th className="px-4 py-4 text-left">
                  <span style={{ color: "#000", fontSize: "12px", fontWeight: "500", lineHeight: "19.5px" }}>
                    Hotel Name
                  </span>
                </th>
                <th className="px-4 py-4 text-left">
                  <span style={{ color: "#000", fontSize: "12px", fontWeight: "500", lineHeight: "19.5px" }}>
                    Status
                  </span>
                </th>
                <th className="px-4 py-4 text-left">
                  <span style={{ color: "#000", fontSize: "12px", fontWeight: "500", lineHeight: "19.5px" }}>
                    Priority
                  </span>
                </th>
                <th className="px-4 py-4 text-left">
                  <span style={{ color: "#000", fontSize: "12px", fontWeight: "500", lineHeight: "19.5px" }}>
                    Assignee
                  </span>
                </th>
                <th className="px-4 py-4 text-left">
                  <span style={{ color: "#000", fontSize: "12px", fontWeight: "500", lineHeight: "19.5px" }}>
                    Date Created
                  </span>
                </th>
                <th className="px-4 py-4 text-left">
                  <span style={{ color: "#000", fontSize: "12px", fontWeight: "500", lineHeight: "19.5px" }}>
                    Date Update
                  </span>
                </th>
                <th className="w-12 px-4 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="px-4 py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                      <p className="text-muted-foreground">Loading tickets...</p>
                    </div>
                  </td>
                </tr>
              ) : currentTickets.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-32 h-32 mb-4 opacity-50">
                        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect
                            x="40"
                            y="60"
                            width="120"
                            height="80"
                            rx="4"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                          />
                          <path
                            d="M60 100L100 130L140 100"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <circle cx="100" cy="90" r="20" fill="currentColor" opacity="0.2" />
                          <path
                            d="M90 85L95 90L105 80"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <p className="text-muted-foreground">No data available</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className={`hover:bg-muted/50 transition-colors ${
                      selectedTicket === ticket.id ? "bg-blue-50 border-l-4 border-l-primary" : ""
                    }`}
                  >
                    <td className="px-4 py-4">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="px-4 py-4" style={{
                      color: "#525866",
                      fontSize: "12px",
                      fontWeight: "400",
                      lineHeight: "19.5px"
                    }}>
                      {ticket.ticketId}
                    </td>
                    <td className="px-4 py-4" style={{
                      color: "#525866",
                      fontSize: "12px",
                      fontWeight: "400",
                      lineHeight: "19.5px"
                    }}>
                      {ticket.title}
                    </td>
                    <td className="px-4 py-4" style={{
                      color: "#525866",
                      fontSize: "12px",
                      fontWeight: "400",
                      lineHeight: "19.5px"
                    }}>
                      {ticket.hotelName}
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
                          background: getStatusStyle(ticket.status).bg,
                          border: `0.5px solid ${getStatusStyle(ticket.status).border}`,
                          color: getStatusStyle(ticket.status).color
                        }}
                      >
                        {ticket.status}
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
                          background: getPriorityStyle(ticket.priority).bg,
                          border: `0.5px solid ${getPriorityStyle(ticket.priority).border}`,
                          color: getPriorityStyle(ticket.priority).color
                        }}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {ticket.assignee ? (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
                          {ticket.assignee.avatar}
                        </div>
                        <span style={{
                          color: "#525866",
                          fontSize: "12px",
                          fontWeight: "400",
                          lineHeight: "19.5px"
                        }}>
                          {ticket.assignee.name}
                        </span>
                      </div>
                      ) : (
                        <span style={{
                          color: "#525866",
                          fontSize: "12px",
                          fontWeight: "400",
                          lineHeight: "19.5px"
                        }}>
                          -
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4" style={{
                      color: "#525866",
                      fontSize: "12px",
                      fontWeight: "400",
                      lineHeight: "19.5px"
                    }}>
                      {ticket.dateCreated}
                    </td>
                    <td className="px-4 py-4" style={{
                      color: "#525866",
                      fontSize: "12px",
                      fontWeight: "400",
                      lineHeight: "19.5px"
                    }}>
                      {ticket.dateUpdate}
                    </td>
                    <td className="px-4 py-4">
                      <DropdownMenu
                        trigger={
                          <button className="p-1 hover:bg-muted rounded transition-colors">
                            <RiMoreLine className="w-5 h-5 text-muted-foreground" />
                          </button>
                        }
                        items={[
                          {
                            label: "View ticket",
                            icon: <RiEyeLine className="w-4 h-4" />,
                            onClick: () => handleViewTicket(ticket),
                          },
                          {
                            label: "View message",
                            icon: <RiReplyLine className="w-4 h-4" />,
                            onClick: () => handleViewTicket(ticket, true),
                          },
                          {
                            label: "Change status",
                            icon: <ChangeStatusIcon />,
                            onClick: () => handleChangeStatus(ticket),
                          },
                          // Show "Unassign" if ticket has assignee, otherwise show "Assign ticket"
                          ticket.assignee ? {
                            label: "Unassign",
                            icon: <RiUserUnfollowLine className="w-4 h-4" />,
                            onClick: () => handleUnassignTicket(ticket),
                          } : {
                            label: "Assign ticket",
                            icon: <RiUserAddLine className="w-4 h-4" />,
                            onClick: () => handleAssignTicket(ticket),
                          },
                          {
                            label: ticket.isMarkedAsTicket ? "Unmark ticket" : "Mark as a ticket",
                            icon: <MarkAsTicketIcon />,
                            onClick: () => handleUnmarkTicket(ticket),
                          },
                          {
                            label: "Supprimer",
                            icon: <RiDeleteBinLine className="w-4 h-4" />,
                            onClick: () => handleDeleteTicket(ticket),
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
        </div>

        {/* Pagination */}
        {totalTickets > 0 && (
          <div className="flex items-center justify-between  py-3 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Displaying {totalTickets === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, totalTickets)} results out of {totalTickets}
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
        )}
      </div>

      {/* View Ticket Modal */}
      <ViewTicketModal
        ticket={viewingTicket}
        isOpen={showViewTicketModal}
        onClose={closeViewTicketModal}
        openChat={openChatOnView}
      />

      {/* Change Status Modal */}
      <ChangeStatusModal
        ticket={ticketToChangeStatus}
        isOpen={showChangeStatusModal}
        onClose={closeChangeStatusModal}
        onConfirm={confirmStatusChange}
      />


      {/* Unmark Ticket Modal */}
      <UnmarkTicketModal
        ticket={ticketToUnmark}
        isOpen={showUnmarkTicketModal}
        onClose={closeUnmarkTicketModal}
        onConfirm={confirmUnmarkTicket}
      />

      {/* Contact Partner Modal */}
      <ContactPartnerModal
        ticket={ticketToContact}
        isOpen={showContactPartnerModal}
        onClose={closeContactPartnerModal}
      />

      {/* Delete Ticket Modal */}
      <DeleteTicketModal
        ticket={ticketToDelete}
        isOpen={showDeleteTicketModal}
        onClose={closeDeleteTicketModal}
        onConfirm={confirmDeleteTicket}
      />

      {/* Assign Ticket Modal */}
      <AssignTicketModal
        ticket={ticketToAssign}
        isOpen={showAssignTicketModal}
        onClose={closeAssignTicketModal}
        onConfirm={confirmAssignTicket}
        assigneeOptions={assigneeOptions}
      />

    </div>
  )
}