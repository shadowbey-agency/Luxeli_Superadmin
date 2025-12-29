"use client"

import { useState } from "react"
import { HotelLogoIcon } from "./icons"
import ChatComponent from "./chat-component"

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

interface ContactPartnerModalProps {
  ticket: Ticket | null
  isOpen: boolean
  onClose: () => void
}

export default function ContactPartnerModal({ ticket, isOpen, onClose }: ContactPartnerModalProps) {
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

        {/* Chat Area - Using ChatComponent */}
        <div className="flex-1 flex flex-col" style={{ minHeight: 0 }}>
          <ChatComponent 
            ticketId={ticket.id}
            partnerId={(ticket as any).partnerId}
            partnerName={ticket.hotelName}
          />
        </div>
      </div>
    </div>
  )
}
