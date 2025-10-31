"use client"

import { useState } from "react"
import {
  RiMoreLine,
  RiEyeLine,
  RiEditLine,
  RiUserAddLine,
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
import AssignTicketModal from "@/app/superadmin/components/assign-ticket-modal"
import UnmarkTicketModal from "@/app/superadmin/components/unmark-ticket-modal"
import ContactPartnerModal from "@/app/superadmin/components/contact-partner-modal"
import DeleteTicketModal from "@/app/superadmin/components/delete-ticket-modal"
import { 
  ChangeStatusIcon, 
  AssignTicketIcon, 
  AddReplyIcon, 
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
  }
  dateCreated: string
  dateUpdate: string
  hotelName: string
  hotelEmail: string
  description: string
  isMarkedAsTicket: boolean
}

const mockTickets: Ticket[] = [
  {
    id: "1",
    ticketId: "#22232",
    title: "Login issues with ...",
    status: "open",
    priority: "urgent",
    assignee: { name: "Full Name", avatar: "FN" },
    dateCreated: "Jan 15, 2024, 10:30 AM",
    dateUpdate: "Jan 16, 2024, 02:22 PM",
    hotelName: "Hotel name",
    hotelEmail: "hotel@gmail.com",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    isMarkedAsTicket: true,
  },
  {
    id: "2",
    ticketId: "#22233",
    title: "Login issues with ...",
    status: "sent",
    priority: "medium",
    assignee: { name: "Full Name", avatar: "FN" },
    dateCreated: "Jan 15, 2024, 10:30 AM",
    dateUpdate: "Jan 16, 2024, 02:22 PM",
    hotelName: "Hotel name",
    hotelEmail: "hotel@gmail.com",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    isMarkedAsTicket: false,
  },
  {
    id: "3",
    ticketId: "#22232",
    title: "Login issues with ...",
    status: "reopened",
    priority: "medium",
    assignee: { name: "Full Name", avatar: "FN" },
    dateCreated: "Jan 15, 2024, 10:30 AM",
    dateUpdate: "Jan 16, 2024, 02:22 PM",
    hotelName: "Hotel name",
    hotelEmail: "hotel@gmail.com",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    isMarkedAsTicket: false,
  },
  {
    id: "4",
    ticketId: "#22232",
    title: "Login issues with ...",
    status: "pending",
    priority: "medium",
    assignee: { name: "Full Name", avatar: "FN" },
    dateCreated: "Jan 15, 2024, 10:30 AM",
    dateUpdate: "Jan 16, 2024, 02:22 PM",
    hotelName: "Hotel name",
    hotelEmail: "hotel@gmail.com",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    isMarkedAsTicket: true,
  },
  {
    id: "5",
    ticketId: "#22232",
    title: "Login issues with ...",
    status: "resolved",
    priority: "urgent",
    assignee: { name: "Full Name", avatar: "FN" },
    dateCreated: "Jan 15, 2024, 10:30 AM",
    dateUpdate: "Jan 16, 2024, 02:22 PM",
    hotelName: "Hotel name",
    hotelEmail: "hotel@gmail.com",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    isMarkedAsTicket: true,
  },
  {
    id: "6",
    ticketId: "#22232",
    title: "Login issues with ...",
    status: "canceled",
    priority: "urgent",
    assignee: { name: "Full Name", avatar: "FN" },
    dateCreated: "Jan 15, 2024, 10:30 AM",
    dateUpdate: "Jan 16, 2024, 02:22 PM",
    hotelName: "Hotel name",
    hotelEmail: "hotel@gmail.com",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    isMarkedAsTicket: true,
  },
  {
    id: "7",
    ticketId: "#22238",
    title: "Login issues with ...",
    status: "sent",
    priority: "urgent",
    assignee: { name: "Full Name", avatar: "FN" },
    dateCreated: "Jan 15, 2024, 10:30 AM",
    dateUpdate: "Jan 16, 2024, 02:22 PM",
    hotelName: "Hotel name",
    hotelEmail: "hotel@gmail.com",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    isMarkedAsTicket: true,
  },
  {
    id: "8",
    ticketId: "#22232",
    title: "Login issues with ...",
    status: "resolved",
    priority: "low",
    assignee: { name: "Full Name", avatar: "FN" },
    dateCreated: "Jan 15, 2024, 10:30 AM",
    dateUpdate: "Jan 16, 2024, 02:22 PM",
    hotelName: "Hotel name",
    hotelEmail: "hotel@gmail.com",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    isMarkedAsTicket: true,
  },
  {
    id: "9",
    ticketId: "#22232",
    title: "Login issues with ...",
    status: "open",
    priority: "low",
    assignee: { name: "Full Name", avatar: "FN" },
    dateCreated: "Jan 15, 2024, 10:30 AM",
    dateUpdate: "Jan 16, 2024, 02:22 PM",
    hotelName: "Hotel name",
    hotelEmail: "hotel@gmail.com",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    isMarkedAsTicket: true,
  },
  {
    id: "10",
    ticketId: "#22232",
    title: "Login issues with ...",
    status: "open",
    priority: "low",
    assignee: { name: "Full Name", avatar: "FN" },
    dateCreated: "Jan 15, 2024, 10:30 AM",
    dateUpdate: "Jan 16, 2024, 02:22 PM",
    hotelName: "Hotel name",
    hotelEmail: "hotel@gmail.com",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    isMarkedAsTicket: true,
  },
]

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | Ticket["status"]>("all")
  const [priorityFilter, setPriorityFilter] = useState<"all" | Ticket["priority"]>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
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

  const norm = (v: string) => v.toLowerCase()
  const filteredTickets = tickets.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false
    if (priorityFilter !== "all" && t.priority !== priorityFilter) return false
    if (!searchTerm) return true
    const q = norm(searchTerm)
    return (
      norm(t.title).includes(q) ||
      norm(t.ticketId).includes(q) ||
      norm(t.status).includes(q) ||
      norm(t.priority).includes(q) ||
      norm(t.assignee.name).includes(q) ||
      norm(t.hotelName).includes(q) ||
      norm(t.hotelEmail).includes(q)
    )
  })

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTickets = filteredTickets.slice(startIndex, endIndex)

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

  const confirmStatusChange = (ticketId: string, newStatus: Ticket["status"]) => {
    setTickets(tickets.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t)))
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

  const confirmDeleteTicket = (ticketId: string) => {
    setTickets(tickets.filter((t) => t.id !== ticketId))
  }

  return (
    <div className="p-6">
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
                    Title
                  </span>
                </th>
                <th className="px-4 py-4 text-left">
                  <span style={{ color: "#000", fontSize: "12px", fontWeight: "500", lineHeight: "19.5px" }}>
                    Ticket ID
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
              {currentTickets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-16">
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
                            label: "Change status",
                            icon: <ChangeStatusIcon />,
                            onClick: () => handleChangeStatus(ticket),
                          },
                          {
                            label: "Change assignee",
                            icon: <AssignTicketIcon />,
                            onClick: () => handleAssignTicket(ticket),
                          },
                          {
                            label: "View messages",
                            icon: <AddReplyIcon />,
                            onClick: () => handleContactPartner(ticket),
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
        {filteredTickets.length > 0 && (
          <div className="flex items-center justify-between  py-3 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Displaying {filteredTickets.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredTickets.length)} results out of {filteredTickets.length}
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
    </div>
  )
}