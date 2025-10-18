"use client"

import { useState } from "react"
import { RiCloseLine, RiImageLine } from "react-icons/ri"

interface AddTicketModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddTicketModal({ isOpen, onClose }: AddTicketModalProps) {
  const [ticketTitle, setTicketTitle] = useState("")
  const [ticketPriority, setTicketPriority] = useState("")
  const [ticketDescription, setTicketDescription] = useState("")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
       <div className="bg-white shadow-xl max-w-3xl w-full mx-4" style={{ borderRadius: "10px" }}>
        {/* Header */}
        <div className="flex items-center justify-between pl-6 pr-6 pt-5 pb-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add a new ticket</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <RiCloseLine className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Section 1: Ticket Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Ticket Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket title
                </label>
                <input
                  type="text"
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  placeholder="Write Here..."
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ borderRadius: "4px" }}
                />
              </div>

              {/* Ticket Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket priority
                </label>
                <div className="relative">
                  <select
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    style={{ borderRadius: "4px" }}
                  >
                    <option value="">Select</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Ticket Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ticket description
            </label>
            <textarea
              value={ticketDescription}
              onChange={(e) => setTicketDescription(e.target.value)}
              placeholder="Write your description here"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              style={{ borderRadius: "4px" }}
            />
          </div>

          {/* Section 3: Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload image
            </label>
            <div
              style={{
                width: "100%",
                height: "229px",
                gap: "12px",
                borderRadius: "12px",
                borderWidth: "1px",
                borderStyle: "dashed",
                borderColor: "#0000001F",
                padding: "25px",
                background: "#FFFFFF"
              }}
              className="flex flex-col"
            >
              <div
                style={{
                  width: "100%",
                  height: "150px",
                  gap: "12px",
                  padding: "25px",
                  borderRadius: "6.75px",
                  borderWidth: "1px",
                  borderColor: "#0000000F",
                  background: "#FBFAFA"
                }}
                className="flex flex-col items-center justify-center border"
              >
                <RiImageLine className="w-8 h-8 text-gray-400 mb-2" />
                <div className="text-center">
                  <span className="text-sm text-gray-600">Drag and drop your image here or </span>
                  <button className="text-sm text-blue-600 underline hover:text-blue-800">
                    choose file
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-5 pb-5 pl-6 pr-6 border-t border-gray-200">
           <button
             onClick={onClose}
             className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
             style={{ borderRadius: "6px", background: "#FBFAFA" }}
           >
             Annuler
           </button>
           <button
             onClick={() => {
               // Handle save logic here
               onClose()
             }}
             className="px-4 py-2 text-white hover:opacity-90 transition-colors"
             style={{ borderRadius: "6px", background: "#1F2A44" }}
           >
             Send
           </button>
        </div>
      </div>
    </div>
  )
}
