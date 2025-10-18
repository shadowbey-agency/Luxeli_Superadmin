"use client"

import { useState } from "react"
import { DropdownIcon } from "./icons"

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
}

interface ChangeStatusModalProps {
  ticket: Ticket | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (ticketId: string, newStatus: Ticket["status"]) => void
}

const statusOptions: { value: Ticket["status"]; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "reopened", label: "Reopened" },
  { value: "pending", label: "Pending" },
  { value: "resolved", label: "Resolved" },
  { value: "canceled", label: "Canceled" },
]

export default function ChangeStatusModal({ ticket, isOpen, onClose, onConfirm }: ChangeStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<Ticket["status"] | "">("")

  const handleConfirm = () => {
    if (ticket && selectedStatus) {
      onConfirm(ticket.id, selectedStatus as Ticket["status"])
      setSelectedStatus("")
      onClose()
    }
  }

  const handleCancel = () => {
    setSelectedStatus("")
    onClose()
  }

  if (!isOpen || !ticket) return null

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-80 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
      <div 
        className="bg-white flex flex-col items-start rounded-[10px]"
        style={{
          display: "flex",
          width: "509px",
          flexDirection: "column",
          alignItems: "flex-start"
        }}
      >
        {/* First Section - Header */}
        <div 
          className="flex justify-between items-center"
          style={{
            display: "flex",
            padding: "20px 16px",
            justifyContent: "space-between",
            alignItems: "center",
            alignSelf: "stretch",
            borderRadius: "10px 10px 0 0",
            borderBottom: "1px solid rgba(0, 0, 0, 0.04)",
            background: "#FFF"
          }}
        >
          <h2 
            className="text-black"
            style={{
              color: "#000",
              fontSize: "20px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "normal"
            }}
          >
            Change status
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Second Section - Content */}
        <div 
          className="flex flex-col items-start"
          style={{
            display: "flex",
            padding: "20px 16px",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "5px",
            alignSelf: "stretch",
            borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
            background: "#FFF"
          }}
        >
          <label 
            className="text-black"
            style={{
              color: "#212121",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 500,
              alignSelf: "stretch"
            }}
          >
            Status
          </label>
          <div className="relative w-full">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as Ticket["status"])}
              className="w-full appearance-none focus:outline-none"
              style={{
                display: "flex",
                padding: "7.52px 12px",
                flexDirection: "column",
                alignItems: "flex-start",
                alignSelf: "stretch",
                borderRadius: "4px",
                border: "1px solid #CED4DA",
                background: "#FFF"
              }}
            >
              <option value="">Select</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
              style={{
                width: "16px",
                height: "16px",
                aspectRatio: "1/1"
              }}
            >
              <DropdownIcon />
            </div>
          </div>
        </div>

        {/* Third Section - Footer Buttons */}
        <div 
          className="flex justify-end items-center"
          style={{
            display: "flex",
            padding: "20px 16px",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "10px",
            alignSelf: "stretch",
            borderRadius: "0 0 10px 10px",
            borderTop: "1px solid rgba(0, 0, 0, 0.04)",
            background: "#FFF"
          }}
        >
          <button
            onClick={handleCancel}
            className="flex flex-col justify-center items-center px-2.5 py-2 rounded-md text-center font-medium text-sm leading-5 transition-colors"
            style={{
              padding: "8.52px 16px",
              borderRadius: "6px",
              background: "#FBFAFA",
              color: "#000",
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: "19.5px",
              border: "1px solid #CED4DA"
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedStatus}
            className="flex flex-col justify-center items-center px-2.5 py-2 rounded-md text-center font-medium text-sm leading-5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              padding: "8.52px 16px",
              borderRadius: "6px",
              background: "#1F2A44",
              color: "#FFF",
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: "19.5px"
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
