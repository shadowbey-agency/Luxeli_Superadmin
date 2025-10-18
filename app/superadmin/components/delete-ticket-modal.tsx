"use client"

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

interface DeleteTicketModalProps {
  ticket: Ticket | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (ticketId: string) => void
}

export default function DeleteTicketModal({ ticket, isOpen, onClose, onConfirm }: DeleteTicketModalProps) {
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
            Delete ticket
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
            Are you sure you want to delete this ticket permanently?
          </p>
        </div>

        {/* Third Section - Footer */}
        <div 
          className="flex justify-end items-center gap-18 px-4 py-5 rounded-b-[10px] border-t border-black/4"
          style={{
            borderTop: "1px solid rgba(0, 0, 0, 0.04)",
            background: "#FFF",
            gap: "72px"
          }}
        >
          <div className="flex gap-[16px] flex-end">
            <button
              onClick={handleCancel}
              className="flex flex-col justify-center items-center px-2.5 py-2 rounded-md text-center font-medium text-sm leading-5 transition-colors"
              style={{
                padding: "8.52px 10px",
                borderRadius: "6px",
                background: "#FBFAFA",
                color: "#000",
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: "19.5px"
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex flex-col justify-center items-center px-2.5 py-2 rounded-md text-center font-medium text-sm leading-5 transition-colors"
              style={{
                padding: "8.52px 10px",
                borderRadius: "6px",
                background: "#EB1D1D",
                color: "#FFF",
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: "19.5px"
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
