"use client"

import { 
  HotelLogoIcon, 
  ClockIcon, 
  ChangeStatusIcon, 
  AssignTicketIcon, 
  AddReplyIcon, 
  MarkAsTicketIcon 
} from "./icons"

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
  hotelName: string
  hotelEmail: string
  description: string
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
                </div>

                {/* Status Buttons */}
                <div className="flex items-center gap-2 ml-auto">
                  {/* Open Button */}
                  <button
                    className="flex items-center justify-center gap-1 border rounded"
                    style={{
                      display: "flex",
                      width: "80px",
                      height: "24px",
                      padding: "10px",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "4px",
                      borderRadius: "4px",
                      border: "0.5px solid rgba(31, 42, 68, 0.25)",
                      background: "rgba(31, 42, 68, 0.05)",
                      color: "#1F2A44",
                      fontSize: "11px",
                      fontWeight: 400,
                      lineHeight: "normal"
                    }}
                  >
                    Open
                  </button>
                  
                  {/* Urgent Button */}
                  <button
                    className="flex items-center justify-center gap-1 border rounded"
                    style={{
                      display: "flex",
                      width: "80px",
                      height: "24px",
                      padding: "10px",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "4px",
                      borderRadius: "4px",
                      border: "0.5px solid rgba(255, 13, 13, 0.25)",
                      background: "rgba(255, 13, 13, 0.05)",
                      color: "#FF0D0D",
                      fontSize: "11px",
                      fontWeight: 400,
                      lineHeight: "normal"
                    }}
                  >
                    Urgent
                  </button>
                </div>
              </div>

              {/* Date Information Box */}
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
                    <span className="text-sm text-gray-700">Created at</span>
                  </div>
                  <span className="text-sm text-black">{ticket.dateCreated}</span>
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
                    <span className="text-sm text-gray-700">Updated at</span>
                  </div>
                  <span className="text-sm text-black">{ticket.dateUpdate}</span>
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
                  <p className="text-sm text-black">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div 
          className="flex gap-2 p-5 border-t border-black/8 flex justify-between"
          style={{
            padding: "20px",
            borderTop: "1px solid rgba(0, 0, 0, 0.08)"
          }}
        >
          {/* Change Status Button */}
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
            <ChangeStatusIcon />
            Change status
          </button>

          {/* Assign Ticket Button */}
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
            <AssignTicketIcon />
            Assign ticket
          </button>

          {/* Add Reply Button */}
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
            <AddReplyIcon />
            Add a reply
          </button>

          {/* Mark as Ticket Button */}
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
            <MarkAsTicketIcon />
            Mark it as a ticket
          </button>
        </div>
      </div>
    </div>
  )
}


