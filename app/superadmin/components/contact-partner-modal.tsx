"use client"

import { useState } from "react"
import { HotelLogoIcon } from "./icons"

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

interface Message {
  id: string
  text: string
  sender: "hotel" | "partner"
  timestamp: string
  type: "text" | "image"
  imageUrl?: string
}

interface ContactPartnerModalProps {
  ticket: Ticket | null
  isOpen: boolean
  onClose: () => void
}

const mockMessages: Message[] = [
  {
    id: "1",
    text: "Lorem ipsum dolor sit amet consectetur. Risus volutpat magnis amet in leo sit nunc lobortis cursus. Urna tincidunt fermentum eget convallis volutpat. Aliquet eget quis nunc pellentesque fermentum massa ultrices",
    sender: "hotel",
    timestamp: "4 min ago",
    type: "text"
  },
  {
    id: "2",
    text: "Lorem ipsum dolor sit amet consectetur. Risus volutpat magnis amet in leo sit nunc lobortis cursus. Urna tincidunt fermentum",
    sender: "partner",
    timestamp: "4 min ago",
    type: "text"
  },
  {
    id: "3",
    text: "",
    sender: "partner",
    timestamp: "4 min ago",
    type: "image",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"
  }
]

export default function ContactPartnerModal({ ticket, isOpen, onClose }: ContactPartnerModalProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: "partner",
        timestamp: "now",
        type: "text"
      }
      setMessages([...messages, message])
      setNewMessage("")
    }
  }

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
          <h2 className="text-lg font-semibold text-black">Contact Partner</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Secondary Header - Hotel Info */}
        <div 
          className="flex items-center gap-2.5 p-5 border-b border-black/8"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            alignSelf: "stretch",
            padding: "10px 20px",
            borderBottom: "1px solid rgba(0, 0, 0, 0.08)"
          }}
        >
          {/* Hotel Logo */}
          <div className="relative flex flex-start">
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

        {/* Chat Area */}
        <div 
          className="flex-1 p-5 overflow-y-auto"
          style={{
            width: "100%",
            padding: "10px 20px",
            backgroundColor: "#FFF"
          }}
        >
          {/* Today Heading */}
          <div className="text-center mb-3">
            <span 
              className="text-gray-500 text-sm"
              style={{
                color: "rgba(0, 0, 0, 0.50)",
                fontSize: "14px",
                fontWeight: 400
              }}
            >
              Today
            </span>
          </div>

          {/* Messages */}
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-end gap-3 ${message.sender === "partner" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
                  style={{
                    backgroundColor: message.sender === "hotel" ? "#1F2A44" : "#56C6FF",
                    width: "40px",
                    height: "40px"
                  }}
                >
                  {message.sender === "hotel" ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                    </svg>
                  ) : (
                    <span>JD</span>
                  )}
                </div>

                {/* Message Content */}
                <div className={`flex flex-col ${message.sender === "partner" ? "items-end" : "items-start"} flex-1`}>
                  {message.type === "text" ? (
                    <div
                      className={`px-4 py-3 rounded-lg ${
                        message.sender === "partner" 
                          ? "bg-blue-100 text-black" 
                          : "bg-gray-100 text-black"
                      }`}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "11.49px",
                        borderRadius: "18.384px",
                        background: message.sender === "partner" ? "var(--Foundation-Blue-Light, #E9EAEC)" : "#FBFABA",
                        color: "#121212",
                        fontSize: "13px",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "27.576px",
                        padding: "16px",
                        marginLeft: message.sender === "partner" ? "auto" : "0",
                        marginRight: message.sender === "partner" ? "0" : "auto",
                        width: "100%",
                        maxWidth: "571.162px",
                        minHeight: "auto"
                      }}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                  ) : (
                    <div
                      className="rounded-lg overflow-hidden"
                      style={{
                        borderRadius: "12px",
                        maxWidth: "300px"
                      }}
                    >
                      <img
                        src={message.imageUrl}
                        alt="Shared image"
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                  
                  {/* Timestamp */}
                  <span 
                    className="text-xs mt-1"
                    style={{
                      color: "rgba(0, 0, 0, 0.50)",
                      fontSize: "12px",
                      fontWeight: 400
                    }}
                  >
                    {message.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer - Message Input */}
        <div 
          className="border-t border-black/8"
          style={{
            display: "flex",
            width: "100%",
            padding: "20px 16px",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: "16px",
            borderTop: "1px solid rgba(0, 0, 0, 0.08)",
            background: "#FFF"
          }}
        >
          <div className="flex items-center gap-3 w-full">
            {/* Message Input */}
            <div 
              className="relative flex-1"
              style={{
                display: "flex",
                height: "36px",
                padding: "8.182px 13.091px",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: "8.182px",
                flex: "1 0 0",
                borderRadius: "8px",
                border: "0.818px solid rgba(0, 0, 0, 0.08)",
                background: "#FBFAFA"
              }}
            >
              <div 
                className="flex justify-between items-center w-full"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  alignSelf: "stretch"
                }}
              >
                <input
                  type="text"
                  placeholder="Write your message"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="w-full bg-transparent border-none outline-none"
                  style={{
                    color: "rgba(0, 0, 0, 0.60)",
                    fontSize: "11.455px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "normal"
                  }}
                />
                
                {/* Attachment Icon */}
                <button className="text-gray-500 hover:text-gray-700 transition-colors">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="17" 
                    height="16" 
                    viewBox="0 0 17 16" 
                    fill="none"
                    className="w-4 h-4"
                  >
                    <path 
                      d="M15.5755 6.66732V10.0007C15.5755 13.334 14.2422 14.6673 10.9089 14.6673H6.90885C3.57552 14.6673 2.24219 13.334 2.24219 10.0007V6.00065C2.24219 2.66732 3.57552 1.33398 6.90885 1.33398H10.2422M15.5755 6.66732H12.9089C10.9089 6.66732 10.2422 6.00065 10.2422 4.00065V1.33398M15.5755 6.66732L10.2422 1.33398M5.57552 8.66732H9.57552M5.57552 11.334H8.24219" 
                      stroke="#121212" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              className="text-white transition-colors"
              style={{
                display: "flex",
                width: "36px",
                height: "36px",
                justifyContent: "center",
                alignItems: "center",
                gap: "9.045px",
                borderRadius: "8px",
                background: "var(--Foundation-Blue-Normal, #1F2A44)"
              }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 16 16" 
                fill="none"
                className="w-4 h-4 flex-shrink-0"
              >
                <path 
                  d="M3.87334 7.66732L2.60187 10.8381C2.06623 12.1738 1.79841 12.8417 2.12998 13.1533C2.46156 13.4649 3.11154 13.1562 4.41148 12.5387L12.1315 8.87169C13.2304 8.3497 13.7799 8.0887 13.7799 7.66732C13.7799 7.24593 13.2304 6.98494 12.1315 6.46295L4.41148 2.79595C3.11154 2.17848 2.46156 1.86974 2.12998 2.18135C1.79841 2.49295 2.06623 3.16083 2.60187 4.49658L3.87334 7.66732ZM3.87334 7.66732L7.04794 7.66732" 
                  stroke="white" 
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
