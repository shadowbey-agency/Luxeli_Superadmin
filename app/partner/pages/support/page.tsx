"use client"

import { useState, useEffect } from "react"
import {
  RiMoreLine,
  RiEyeLine,
  RiUserAddLine,
  RiReplyLine,
  RiCheckboxCircleLine,
  RiDeleteBinLine,
} from "react-icons/ri"
import PublicIcon from "@/app/partner/components/public-icon"
import DropdownMenu from "@/app/superadmin/components/dropdown-menu"
import DropdownArrow from "@/app/superadmin/components/dropdown-arrow"
import SortArrows from "@/app/superadmin/components/sort-arrows"
import { LeftArrow, RightArrow } from "@/app/superadmin/components/pagination-arrows"
import ViewTicketModal from "@/app/superadmin/components/view-ticket-modal"
import ChangeStatusModal from "@/app/superadmin/components/change-status-modal"
import AssignTicketModal from "@/app/superadmin/components/assign-ticket-modal"
import UnmarkTicketModal from "@/app/superadmin/components/unmark-ticket-modal"
import ContactPartnerModal from "@/app/partner/components/contact-partner-modal"
import DeleteTicketModal from "@/app/superadmin/components/delete-ticket-modal"
import SuccessCard from "@/app/superadmin/components/success-card"
import {
  ChangeStatusIcon,
  AssignTicketIcon,
  AddReplyIcon,
  MarkAsTicketIcon
} from "@/app/superadmin/components/icons"
import SupportSidebarIcon from "@/app/partner/components/support-sidebar-icon"
import AddTicketModal from "@/app/partner/components/add-ticket-modal"
import { getAuthToken } from "@/lib/auth-utils"

interface Ticket {
  id: string
  ticketId: string
  title: string
  status: "open" | "reopened" | "pending" | "resolved" | "canceled" | "sent"
  priority: "low" | "medium" | "urgent"
  assignee: {
    name: string
    avatar: string
  }
  dateCreated: string
  dateUpdate: string
  hotelName: string
  hotelEmail: string
  description: string
  isMarkedAsTicket: boolean
  partnerId?: string
}

// Helper functions to get status and priority styles matching the requests page
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

// Helper function to format date
const formatDate = (date: Date | string) => {
  const d = new Date(date)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const month = months[d.getMonth()]
  const day = d.getDate()
  const year = d.getFullYear()
  const hours = d.getHours()
  const minutes = d.getMinutes()
  const ampm = hours >= 12 ? "PM" : "AM"
  const displayHours = hours % 12 || 12
  const displayMinutes = minutes.toString().padStart(2, "0")
  return `${month} ${day}, ${year}, ${displayHours}:${displayMinutes} ${ampm}`
}

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<'my-tickets' | 'tickets-saved'>('my-tickets')
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalTickets, setTotalTickets] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
  const [showViewTicketModal, setShowViewTicketModal] = useState(false)
  const [viewingTicket, setViewingTicket] = useState<Ticket | null>(null)
  const [showChangeStatusModal, setShowChangeStatusModal] = useState(false)
  const [ticketToChangeStatus, setTicketToChangeStatus] = useState<Ticket | null>(null)
  const [showAssignTicketModal, setShowAssignTicketModal] = useState(false)
  const [ticketToAssign, setTicketToAssign] = useState<Ticket | null>(null)
  const [showUnmarkTicketModal, setShowUnmarkTicketModal] = useState(false)
  const [ticketToUnmark, setTicketToUnmark] = useState<Ticket | null>(null)
  const [showContactPartnerModal, setShowContactPartnerModal] = useState(false)
  const [ticketToContact, setTicketToContact] = useState<Ticket | null>(null)
  const [showDeleteTicketModal, setShowDeleteTicketModal] = useState(false)
  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null)
  const [showAddTicketModal, setShowAddTicketModal] = useState(false)
  const [showSuccessCard, setShowSuccessCard] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [successProfileImage, setSuccessProfileImage] = useState("")

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

      // If viewing saved tickets, fetch all saved tickets from all partners
      // Otherwise, fetch only this partner's tickets
      const url = activeTab === 'tickets-saved'
        ? `/api/partner/tickets?page=${currentPage}&limit=${itemsPerPage}&saved=true`
        : `/api/partner/tickets?page=${currentPage}&limit=${itemsPerPage}`

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()

      if (data.success && data.data?.tickets) {
        // Transform API response to match Ticket interface
        const transformedTickets: Ticket[] = data.data.tickets.map((ticket: any) => {
          // For saved tickets, use partner info from API response
          // For regular tickets, use default values
          const partner = ticket.partner || {}

          return {
            id: ticket._id || ticket.id,
            ticketId: ticket.superadminTicketId || ticket.ticketId || `TCKT-${ticket._id?.slice(-6)}`,
            title: ticket.title,
            status: ticket.status as Ticket["status"],
            priority: ticket.priority as Ticket["priority"],
            assignee: ticket.assignee ? {
              name: ticket.assignee.name || "Unassigned",
              avatar: ticket.assignee.profilePic || (ticket.assignee.name ? ticket.assignee.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : "U")
            } : { name: "Unassigned", avatar: "U" },
            dateCreated: formatDate(ticket.createdAt || new Date()),
            dateUpdate: formatDate(ticket.updatedAt || ticket.createdAt || new Date()),
            hotelName: partner.hotelName || "Hotel name",
            hotelEmail: partner.hotelEmail || "hotel@gmail.com",
            description: ticket.description,
            isMarkedAsTicket: ticket.markasticket ?? false,
            partnerId: partner._id || partner.id,
          }
        })
        setTickets(transformedTickets)

        // Update pagination info from API
        if (data.data.pagination) {
          setTotalTickets(data.data.pagination.total)
          setTotalPages(data.data.pagination.pages)
        }
      }
    } catch (error) {
      console.error('Error fetching tickets:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [currentPage, itemsPerPage, activeTab])

  // Refresh tickets after creating a new one
  const handleTicketCreated = () => {
    // Reset to first page and refresh
    setCurrentPage(1)
    fetchTickets()
  }

  // No need to filter on frontend anymore - API handles it
  // For saved tickets, API returns only markasticket: true from all partners
  // For my tickets, API returns only this partner's tickets
  const currentTickets = tickets
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + currentTickets.length, totalTickets)

  const handleStatusChange = (ticketId: string, newStatus: Ticket["status"]) => {
    setTickets(tickets.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t)))
  }

  const handleViewTicket = (ticket: Ticket) => {
    setViewingTicket(ticket)
    setShowViewTicketModal(true)
  }

  const closeViewTicketModal = () => {
    setShowViewTicketModal(false)
    setViewingTicket(null)
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
      const token = getAuthToken()
      if (!token) {
        console.error('No auth token found')
        alert('Authentication token not found. Please log in again.')
        return
      }

      // Find the ticket to get the ticketId for display
      const ticket = tickets.find((t) => t.id === ticketId)
      const displayTicketId = ticket?.ticketId || ticketId

      const response = await fetch(`/api/partner/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      const responseData = await response.json().catch(() => ({}))

      if (response.ok) {
        // Show success card with ticket ID and avatar
        const ticketData = tickets.find((t) => t.id === ticketId)
        setSuccessProfileImage(ticketData?.assignee?.avatar || 'T')
        setSuccessMessage(`Status changed successfully.\nTicket ID : ${displayTicketId}`)
        setShowSuccessCard(true)
        // Update local state and refresh
        setTickets(tickets.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t)))
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

  const handleAssignTicket = (ticket: Ticket) => {
    setTicketToAssign(ticket)
    setShowAssignTicketModal(true)
  }

  const closeAssignTicketModal = () => {
    setShowAssignTicketModal(false)
    setTicketToAssign(null)
  }

  const confirmAssignTicket = (ticketId: string, newAssignee: string) => {
    const assigneeName = newAssignee.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    setTickets(tickets.map((t) => (t.id === ticketId ? {
      ...t,
      assignee: {
        name: assigneeName,
        avatar: assigneeName.split(' ').map(n => n[0]).join('').toUpperCase()
      }
    } : t)))
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

  const confirmUnmarkTicket = (ticketId: string) => {
    // Toggle the isMarkedAsTicket status
    setTickets(tickets.map((t) => (t.id === ticketId ? { ...t, isMarkedAsTicket: !t.isMarkedAsTicket } : t)))
  }

  const handleContactPartner = (ticket: Ticket) => {
    setTicketToContact(ticket)
    setShowContactPartnerModal(true)
  }

  const closeContactPartnerModal = () => {
    setShowContactPartnerModal(false)
    setTicketToContact(null)
  }

  const confirmDeleteTicket = async (ticketId: string) => {
    setTickets(tickets.filter((t) => t.id !== ticketId))
  }

  return (
    <div className="p-6">
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex">
          <button
            onClick={() => setActiveTab('my-tickets')}
            className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === 'my-tickets'
                ? 'text-foreground border-b-2 border-primary -mb-[2px]'
                : 'text-muted-foreground hover:text-foreground border-b-2 border-[#EDEDED] -mb-[2px]'
              }`}
            style={{ width: "270px" }}
          >
            My Tickets
          </button>
          <button
            onClick={() => setActiveTab('tickets-saved')}
            className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === 'tickets-saved'
                ? 'text-foreground border-b-2 border-primary -mb-[2px]'
                : 'text-muted-foreground hover:text-foreground border-b-2 border-[#EDEDED] -mb-[2px]'
              }`}
            style={{ width: "270px" }}
          >
            Tickets saved
          </button>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-card rounded-xl p-4">
        {activeTab === 'my-tickets' ? (
          <>
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
                    <option>Status</option>
                    <option>Open</option>
                    <option>Pending</option>
                    <option>Resolved</option>
                    <option>Sent</option>
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
                    <option>Priority</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>Urgent</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <DropdownArrow />
                  </div>
                </div>

                <button
                  onClick={() => setShowAddTicketModal(true)}
                  className="flex py-[8.52px] px-5 justify-center items-center gap-1.5 bg-[#1F2A44] text-white hover:bg-[#1F2A44]/90 transition-colors"
                  style={{ borderRadius: "6px" }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-sm font-medium">Add new ticket</span>
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
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <span style={{
                          color: "#000",
                          fontSize: "12px",
                          fontWeight: "500",
                          lineHeight: "19.5px"
                        }}>
                          Ticket ID
                        </span>
                      </div>
                    </th>
                    <th className="px-4 py-4 text-left">
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <span style={{
                          color: "#000",
                          fontSize: "12px",
                          fontWeight: "500",
                          lineHeight: "19.5px"
                        }}>
                          Title
                        </span>
                      </div>
                    </th>
                    <th className="px-4 py-4 text-left">
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <span style={{
                          color: "#000",
                          fontSize: "12px",
                          fontWeight: "500",
                          lineHeight: "19.5px"
                        }}>
                          Status
                        </span>
                      </div>
                    </th>
                    <th className="px-4 py-4 text-left">
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <span style={{
                          color: "#000",
                          fontSize: "12px",
                          fontWeight: "500",
                          lineHeight: "19.5px"
                        }}>
                          Priority
                        </span>
                      </div>
                    </th>
                    <th className="px-4 py-4 text-left">
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <span style={{
                          color: "#000",
                          fontSize: "12px",
                          fontWeight: "500",
                          lineHeight: "19.5px"
                        }}>
                          Date Created
                        </span>
                      </div>
                    </th>
                    <th className="px-4 py-4 text-left">
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <span style={{
                          color: "#000",
                          fontSize: "12px",
                          fontWeight: "500",
                          lineHeight: "19.5px"
                        }}>
                          Date Update
                        </span>
                      </div>
                    </th>
                    <th className="w-12 px-4 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-16">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                          <p className="text-muted-foreground">Loading tickets...</p>
                        </div>
                      </td>
                    </tr>
                  ) : currentTickets.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-16">
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
                          <p className="text-muted-foreground">No tickets available</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentTickets.map((ticket) => (
                      <tr
                        key={ticket.id}
                        className={`hover:bg-muted/50 transition-colors ${selectedTicket === ticket.id ? "bg-blue-50 border-l-4 border-l-primary" : ""
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
                                onClick: () => handleContactPartner(ticket),
                              },
                              {
                                label: "Delete",
                                icon: <RiDeleteBinLine className="w-4 h-4" style={{ color: "#FF0D0D" }} />,
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
            {tickets.length > 0 && (
              <div className="flex items-center justify-between  py-3 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Displaying {startIndex + 1}-{endIndex} results out of {totalTickets}
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
                        className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${currentPage === page ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
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
          </>
        ) : (
          <>
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
                    <option>Status</option>
                    <option>Open</option>
                    <option>Pending</option>
                    <option>Resolved</option>
                    <option>Sent</option>
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
                    <option>Priority</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>Urgent</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <DropdownArrow />
                  </div>
                </div>

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
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <span style={{
                          color: "#000",
                          fontSize: "12px",
                          fontWeight: "500",
                          lineHeight: "19.5px"
                        }}>
                          Ticket ID
                        </span>
                      </div>
                    </th>
                    <th className="px-4 py-4 text-left">
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <span style={{
                          color: "#000",
                          fontSize: "12px",
                          fontWeight: "500",
                          lineHeight: "19.5px"
                        }}>
                          Title
                        </span>
                      </div>
                    </th>
                    <th className="px-4 py-4 text-left">
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <span style={{
                          color: "#000",
                          fontSize: "12px",
                          fontWeight: "500",
                          lineHeight: "19.5px"
                        }}>
                          Status
                        </span>
                      </div>
                    </th>
                    <th className="px-4 py-4 text-left">
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <span style={{
                          color: "#000",
                          fontSize: "12px",
                          fontWeight: "500",
                          lineHeight: "19.5px"
                        }}>
                          Priority
                        </span>
                      </div>
                    </th>
                    <th className="px-4 py-4 text-left">
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <span style={{
                          color: "#000",
                          fontSize: "12px",
                          fontWeight: "500",
                          lineHeight: "19.5px"
                        }}>
                          Date Created
                        </span>
                      </div>
                    </th>
                    <th className="px-4 py-4 text-left">
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <span style={{
                          color: "#000",
                          fontSize: "12px",
                          fontWeight: "500",
                          lineHeight: "19.5px"
                        }}>
                          Date Update
                        </span>
                      </div>
                    </th>
                    <th className="w-12 px-4 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-16">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                          <p className="text-muted-foreground">Loading tickets...</p>
                        </div>
                      </td>
                    </tr>
                  ) : currentTickets.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-16">
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
                          <h3 className="text-lg font-medium text-muted-foreground mb-2">No tickets found</h3>
                          <p className="text-sm text-muted-foreground">Create your first ticket to get started.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentTickets.map((ticket) => (
                      <tr
                        key={ticket.id}
                        className={`hover:bg-muted/50 transition-colors ${selectedTicket === ticket.id ? "bg-muted/30" : ""
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
                                icon: <RiEyeLine className="w-4 h-4" style={{ width: "16px", height: "16px" }} />,
                                onClick: () => handleViewTicket(ticket),
                              },
                              {
                                label: "View reply",
                                icon: <SupportSidebarIcon size={16} strokeColor="#141B34" />,
                                onClick: () => handleContactPartner(ticket),
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
            {tickets.length > 0 && (
              <div className="flex items-center justify-between pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Displaying {startIndex + 1}-{endIndex} results out of {totalTickets}
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
                        className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${currentPage === page ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
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
          </>
        )}
      </div>

      {/* View Ticket Modal */}
      <ViewTicketModal
        ticket={viewingTicket}
        isOpen={showViewTicketModal}
        onClose={closeViewTicketModal}
      />

      {/* Change Status Modal */}
      <ChangeStatusModal
        ticket={ticketToChangeStatus}
        isOpen={showChangeStatusModal}
        onClose={closeChangeStatusModal}
        onConfirm={confirmStatusChange}
      />

      {/* Assign Ticket Modal */}
      <AssignTicketModal
        ticket={ticketToAssign}
        isOpen={showAssignTicketModal}
        onClose={closeAssignTicketModal}
        onConfirm={confirmAssignTicket}
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

      {/* Add Ticket Modal */}
      <AddTicketModal
        isOpen={showAddTicketModal}
        onClose={() => setShowAddTicketModal(false)}
        onSuccess={handleTicketCreated}
      />

      {/* Success Card */}
      <SuccessCard
        isOpen={showSuccessCard}
        message={successMessage}
        profileImage={successProfileImage}
        onClose={() => {
          setShowSuccessCard(false)
          setSuccessMessage("")
          setSuccessProfileImage("")
        }}
      />
    </div>
  )
}