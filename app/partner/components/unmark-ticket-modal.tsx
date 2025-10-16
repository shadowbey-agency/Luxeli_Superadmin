"use client"

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
  isMarkedAsTicket: boolean
}

interface UnmarkTicketModalProps {
  ticket: Ticket | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (ticketId: string) => void
}

export default function UnmarkTicketModal({ ticket, isOpen, onClose, onConfirm }: UnmarkTicketModalProps) {
  const handleConfirm = () => {
    if (ticket) {
      onConfirm(ticket.id)
      onClose()
    }
  }

  const handleCancel = () => {
    onClose()
  }

  if (!isOpen || !ticket) return null

  // Determine the action and message based on current state
  const isMarkedAsTicket = ticket.isMarkedAsTicket
  const headerTitle = isMarkedAsTicket ? "Unmark ticket" : "Mark as a ticket"
  const confirmMessage = isMarkedAsTicket 
    ? "Convert this conversation/message into a support ticket. Message and attachment will be kept"
    : "Convert this support ticket back to a conversation/message. Message and attachment will be kept"

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-80 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
      <div 
        className="bg-white rounded-[10px] mx-4"
        style={{
          width: "509px"
        }}
      >
        {/* First Section - Header */}
        <div 
          className="flex justify-between items-center px-4 py-5 rounded-t-[10px] border-b border-black/4"
          style={{
            borderBottom: "1px solid rgba(0, 0, 0, 0.04)",
            background: "#FFF"
          }}
        >
          <h2 
            className="text-black font-bold text-xl leading-normal"
            style={{
              fontSize: "20px",
              fontWeight: 700
            }}
          >
            {headerTitle}
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
          className="px-4 py-5 border-b border-black/6"
          style={{
            borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
            background: "#FFF"
          }}
        >
          <p 
            className="text-gray-600 text-lg leading-normal"
            style={{
              color: "#525866",
              fontSize: "18px",
              fontWeight: 400
            }}
          >
            {confirmMessage}
          </p>
        </div>

        {/* Third Section - Footer Buttons */}
        <div 
          className="flex justify-end gap-3 px-4 py-4 rounded-b-[10px] border-t border-black/4"
          style={{
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
            className="flex flex-col justify-center items-center px-2.5 py-2 rounded-md text-center font-medium text-sm leading-5 transition-colors"
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
