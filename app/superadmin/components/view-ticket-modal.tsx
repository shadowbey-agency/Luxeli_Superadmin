"use client"

import { 
  HotelLogoIcon, 
  ClockIcon, 
  ChangeStatusIcon, 
  AssignTicketIcon, 
  AddReplyIcon, 
  MarkAsTicketIcon 
} from "./icons"
import SupportSidebarIcon from "@/app/partner/components/support-sidebar-icon"

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
}

interface ViewTicketModalProps {
  ticket: Ticket | null
  isOpen: boolean
  onClose: () => void
}

export default function ViewTicketModal({ ticket, isOpen, onClose }: ViewTicketModalProps) {
  if (!isOpen || !ticket) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Background overlay */}
      <div 
        className="fixed inset-0" 
        style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        onClick={onClose}
      />
      
      {/* Slide-out panel */}
      <div className="fixed right-0 top-0 h-full w-1/2 bg-white flex flex-col w-[50vw]">
        {/* Header */}
        <div 
          className="flex justify-between items-center px-5 py-5 border-b border-black/8"
          style={{
            width: "100%",
            padding: "20px",
            borderBottom: "1px solid rgba(0, 0, 0, 0.08)"
          }}
        >
          <h2 className="text-lg font-semibold text-black">View ticket</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Area */}
        <div 
          className="flex-1 p-5 overflow-y-auto"
          style={{
            width: "100%",
            padding: "20px"
          }}
        >
          <div className="flex flex-col gap-5">
            {/* Main Container */}
            <div 
              className="flex flex-col gap-5"
              style={{
                display: "flex",
                width: "100%",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "20px"
              }}
            >
              {/* Header Section with Logo and Hotel Name */}
              <div 
                className="flex items-center gap-2.5"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  alignSelf: "stretch"
                }}
              >
                {/* Hotel Logo */}
                <div className="relative border-r">
                  <HotelLogoIcon />
                </div>
                
                {/* Hotel Info */}
                <div className="flex flex-col">
                  <h3 
                    className="text-black font-bold"
                    style={{
                      color: "#000",
                      fontSize: "25px",
                      fontWeight: 700,
                      lineHeight: "32px"
                    }}
                  >
                    {ticket.hotelName}
                  </h3>
                  <p className="text-sm text-gray-600">{ticket.hotelEmail}</p>
                  <p className="text-xs text-gray-500 mt-1">Ticket ID: {ticket.ticketId}</p>
                </div>

                {/* Status Buttons */}
                <div className="flex items-center gap-2 ml-auto">
                  {/* Status Badge */}
                  <span 
                    className="inline-flex items-center justify-center text-xs font-medium capitalize"
                    style={{
                      width: "80px",
                      height: "22px",
                      gap: "4px",
                      borderRadius: "4px",
                      borderWidth: "0.5px",
                      padding: "10px",
                      background: ticket.status === "reopened" ? "#6457D30D" : "#56C6FF0D",
                      border: `0.5px solid ${ticket.status === "reopened" ? "#6457D340" : "#56C6FF40"}`,
                      color: ticket.status === "reopened" ? "#6457D3" : "#56C6FF",
                      fontSize: "11px",
                      fontWeight: 400,
                      lineHeight: "normal"
                    }}
                  >
                    {ticket.status}
                  </span>
                  
                  {/* Priority Badge */}
                  <span 
                    className="inline-flex items-center justify-center text-xs font-medium capitalize"
                    style={{
                      width: "80px",
                      height: "22px",
                      gap: "4px",
                      borderRadius: "4px",
                      borderWidth: "0.5px",
                      padding: "10px",
                      background: ticket.priority === "urgent" ? "#FF0D0D0D" : ticket.priority === "medium" ? "#D1924F0D" : "#56C6FF0D",
                      border: `0.5px solid ${ticket.priority === "urgent" ? "#FF0D0D40" : ticket.priority === "medium" ? "#D1924F40" : "#56C6FF40"}`,
                      color: ticket.priority === "urgent" ? "#FF0D0D" : ticket.priority === "medium" ? "#D1924F" : "#56C6FF",
                      fontSize: "11px",
                      fontWeight: 400,
                      lineHeight: "normal"
                    }}
                  >
                    {ticket.priority}
                  </span>
                </div>
              </div>

              {/* Date Information Box */}
              <div 
                className="flex flex-col gap-3 p-4 border rounded-lg"
                style={{
                  display: "flex",
                  padding: "16px",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  gap: "12px",
                  alignSelf: "stretch",
                  borderRadius: "8px",
                  border: "1px solid rgba(33, 33, 33, 0.08)",
                  background: "#FBFAFA"
                }}
              >
                {/* Created Date Row */}
                <div 
                  className="flex items-center gap-52"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "210px",
                    alignSelf: "stretch"
                  }}
                >
                  <div className="flex items-center gap-3">
                    <ClockIcon />
                    <span 
                      className="text-sm"
                      style={{
                        color: "#212121",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "19.5px"
                      }}
                    >
                      Created at
                    </span>
                  </div>
                  <span 
                    className="text-sm"
                    style={{
                      color: "#525866",
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "19.5px"
                    }}
                  >
                    {ticket.dateCreated}
                  </span>
                </div>

                {/* Updated Date Row */}
                <div 
                  className="flex items-center gap-52"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "210px",
                    alignSelf: "stretch"
                  }}
                >
                  <div className="flex items-center gap-3">
                    <ClockIcon />
                    <span 
                      className="text-sm"
                      style={{
                        color: "#212121",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "19.5px"
                      }}
                    >
                      Updated at
                    </span>
                  </div>
                  <span 
                    className="text-sm"
                    style={{
                      color: "#525866",
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "19.5px"
                    }}
                  >
                    {ticket.dateUpdate}
                  </span>
                </div>
              </div>

              {/* Ticket Description Section */}
              <div className="space-y-2">
                <h4 
                  className="text-gray-500 font-medium"
                  style={{
                    color: "rgba(0, 0, 0, 0.50)",
                    fontSize: "15px",
                    fontWeight: 500,
                    lineHeight: "21px",
                    
                  }}
                >
                  Ticket description
                </h4>
                <div 
                  className="flex flex-col gap-6 p-4 border rounded-lg"
                  style={{
                    display: "flex",
                    padding: "16px",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    gap: "24px",
                    alignSelf: "stretch",
                    borderRadius: "8px",
                    border: "1px solid rgba(33, 33, 33, 0.08)",
                    background: "#FBFAFA"
                  }}
                >
                  <p 
                    className="text-sm"
                    style={{
                      color: "#000000CC",
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "19.5px"
                    }}
                  >
                    {ticket.description}
                  </p>
                </div>
              </div>

            </div>

            {/* Image Uploaded Section */}
            {ticket.image && (
              <div className="space-y-2">
                <h4 
                  className="text-gray-500 font-medium"
                  style={{
                    color: "rgba(0, 0, 0, 0.50)",
                    fontSize: "15px",
                    fontWeight: 500,
                    lineHeight: "21px",
                  }}
                >
                  Image uploaded
                </h4>
                <div 
                  className="flex flex-col gap-6 p-4 border rounded-lg"
                  style={{
                    display: "flex",
                    padding: "16px",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    gap: "24px",
                    alignSelf: "stretch",
                    borderRadius: "8px",
                    border: "1px solid rgba(33, 33, 33, 0.08)",
                    background: "#FBFAFA"
                  }}
                >
                  <img 
                    src={ticket.image} 
                    alt="Uploaded image"
                    className="w-full h-48 object-cover rounded"
                    style={{
                      width: "100%",
                      height: "192px",
                      objectFit: "cover",
                      borderRadius: "4px"
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Button */}
        <div 
          className="flex justify-end p-5 border-t border-black/8"
          style={{
            padding: "20px",
            borderTop: "1px solid rgba(0, 0, 0, 0.08)"
          }}
        >
          {/* View Reply Button */}
          <button
            className="flex items-center gap-1.5 border rounded transition-colors hover:bg-gray-50"
            style={{
              display: "flex",
              padding: "8.52px 20px",
              justifyContent: "center",
              alignItems: "center",
              gap: "6px",
              borderRadius: "6px",
              border: "1px solid #CED4DA",
              background: "#FBFAFA",
              color: "#000",
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: "19.5px"
            }}
          >
            <SupportSidebarIcon size={16} strokeColor="#141B34" />
            View reply
          </button>
        </div>
      </div>
    </div>
  )
}


