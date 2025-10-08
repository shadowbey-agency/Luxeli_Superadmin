"use client"

import { useState } from "react"
import {
  RiMoreLine,
  RiDownloadLine,
  RiEyeLine,
  RiEditLine,
  RiUserAddLine,
  RiReplyLine,
  RiCheckboxCircleLine,
  RiDeleteBinLine,
} from "react-icons/ri"
import StatusBadge from "@/app/client/components/status-badge"
import PriorityBadge from "@/app/client/components/priority-badge"
import DropdownMenu from "@/app/client/components/dropdown-menu"

interface Ticket {
  id: string
  ticketId: string
  title: string
  status: "open" | "reopened" | "pending" | "resolved" | "canceled"
  priority: "low" | "medium" | "urgent"
  assignee: {
    name: string
    avatar: string
  }
  dateCreated: string
  dateUpdate: string
}

const mockTickets: Ticket[] = [
  {
    id: "1",
    ticketId: "#22232",
    title: "Login issues with ...",
    status: "open",
    priority: "urgent",
    assignee: { name: "Full Name", avatar: "FN" },
    dateCreated: "Jan 15, 10:30 AM",
    dateUpdate: "Jan 15, 10:30 AM",
  },
  {
    id: "2",
    ticketId: "#22232",
    title: "Login issues with ...",
    status: "open",
    priority: "medium",
    assignee: { name: "Full Name", avatar: "FN" },
    dateCreated: "Jan 15, 10:30 AM",
    dateUpdate: "Jan 15, 10:30 AM",
  },
  {
    id: "3",
    ticketId: "#22232",
    title: "Login issues with ...",
    status: "reopened",
    priority: "medium",
    assignee: { name: "Full Name", avatar: "FN" },
    dateCreated: "Jan 15, 10:30 AM",
    dateUpdate: "Jan 15, 10:30 AM",
  },
  {
    id: "4",
    ticketId: "#22232",
    title: "Login issues with ...",
    status: "pending",
    priority: "medium",
    assignee: { name: "Full Name", avatar: "FN" },
    dateCreated: "Jan 15, 10:30 AM",
    dateUpdate: "Jan 15, 10:30 AM",
  },
  {
    id: "5",
    ticketId: "#22232",
    title: "Login issues with ...",
    status: "resolved",
    priority: "urgent",
    assignee: { name: "Full Name", avatar: "FN" },
    dateCreated: "Jan 15, 10:30 AM",
    dateUpdate: "Jan 15, 10:30 AM",
  },
  {
    id: "6",
    ticketId: "#22232",
    title: "Login issues with ...",
    status: "canceled",
    priority: "urgent",
    assignee: { name: "Full Name", avatar: "FN" },
    dateCreated: "Jan 15, 10:30 AM",
    dateUpdate: "Jan 15, 10:30 AM",
  },
  {
    id: "7",
    ticketId: "#22232",
    title: "Login issues with ...",
    status: "canceled",
    priority: "urgent",
    assignee: { name: "Full Name", avatar: "FN" },
    dateCreated: "Jan 15, 10:30 AM",
    dateUpdate: "Jan 15, 10:30 AM",
  },
  {
    id: "8",
    ticketId: "#22232",
    title: "Login issues with ...",
    status: "resolved",
    priority: "low",
    assignee: { name: "Full Name", avatar: "FN" },
    dateCreated: "Jan 15, 10:30 AM",
    dateUpdate: "Jan 15, 10:30 AM",
  },
  {
    id: "9",
    ticketId: "#22232",
    title: "Login issues with ...",
    status: "open",
    priority: "low",
    assignee: { name: "Full Name", avatar: "FN" },
    dateCreated: "Jan 15, 10:30 AM",
    dateUpdate: "Jan 15, 10:30 AM",
  },
  {
    id: "10",
    ticketId: "#22232",
    title: "Login issues with ...",
    status: "open",
    priority: "low",
    assignee: { name: "Full Name", avatar: "FN" },
    dateCreated: "Jan 15, 10:30 AM",
    dateUpdate: "Jan 15, 10:30 AM",
  },
]

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)

  const totalPages = Math.ceil(tickets.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTickets = tickets.slice(startIndex, endIndex)

  const handleStatusChange = (ticketId: string, newStatus: Ticket["status"]) => {
    setTickets(tickets.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t)))
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
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-3 py-2  border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value={10}>Display 10</option>
              <option value={20}>Display 20</option>
              <option value={50}>Display 50</option>
            </select>

            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2  border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <select className="px-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option>Status</option>
              <option>Open</option>
              <option>Pending</option>
              <option>Resolved</option>
            </select>

            <select className="px-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option>Priority</option>
              <option>Low</option>
              <option>Medium</option>
              <option>Urgent</option>
            </select>

            <select className="px-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option>Assignee</option>
            </select>

            <button className="flex items-center gap-2 px-4 py-2 bg-muted border border-border hover:bg-muted/80 rounded-xl text-sm font-medium transition-colors">
              <RiDownloadLine className="w-4 h-4" />
              Export
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
                <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">Title</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">Ticket ID</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">Priority</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">Assignee</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">
                  Date Created
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">
                  Date Update
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
                    <td className="px-4 py-4 text-sm font-medium text-foreground">{ticket.ticketId}</td>
                    <td className="px-4 py-4 text-sm text-foreground">{ticket.title}</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="px-4 py-4">
                      <PriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
                          {ticket.assignee.avatar}
                        </div>
                        <span className="text-sm text-foreground">{ticket.assignee.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-foreground">{ticket.dateCreated}</td>
                    <td className="px-4 py-4 text-sm text-foreground">{ticket.dateUpdate}</td>
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
                            onClick: () => setSelectedTicket(ticket.id),
                          },
                          {
                            label: "Change status",
                            icon: <RiEditLine className="w-4 h-4" />,
                            onClick: () => console.log("Change status", ticket.id),
                          },
                          {
                            label: "Assign ticket",
                            icon: <RiUserAddLine className="w-4 h-4" />,
                            onClick: () => console.log("Assign", ticket.id),
                          },
                          {
                            label: "Add a reply",
                            icon: <RiReplyLine className="w-4 h-4" />,
                            onClick: () => console.log("Reply", ticket.id),
                          },
                          {
                            label: "Mark it as a ticket",
                            icon: <RiCheckboxCircleLine className="w-4 h-4" />,
                            onClick: () => console.log("Mark", ticket.id),
                          },
                          {
                            label: "Supprimer",
                            icon: <RiDeleteBinLine className="w-4 h-4" />,
                            onClick: () => console.log("Delete", ticket.id),
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
              Displaying {startIndex + 1}-{Math.min(endIndex, tickets.length)} results out of {tickets.length}
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &lt;
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
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
