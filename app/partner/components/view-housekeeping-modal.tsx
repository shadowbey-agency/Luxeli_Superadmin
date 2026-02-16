"use client"

import { useState } from "react"
import { ChangeStatusIcon, AssignTicketIcon } from "./icons"
import AssignStaffModal from "./assign-staff-modal"
import { getAuthToken } from "@/lib/auth-utils"

interface HousekeepingRequest {
  id: string
  requestId: string
  room: string
  guest: string
  type: string
  created: string
  status: "new" | "accepted" | "completed" | "pending" | "canceled" | "no-show"
  priority: "low" | "medium" | "urgent"
  assignee: string
  requestedFor: string
  cleaningType: string
  note?: string
  _original?: any // Original API request object with _id
}

interface ViewHousekeepingModalProps {
  request: HousekeepingRequest | null
  isOpen: boolean
  onClose: () => void
  onStatusChange?: () => void // Callback to refresh parent after status change
}

export default function ViewHousekeepingModal({ request, isOpen, onClose, onStatusChange }: ViewHousekeepingModalProps) {
  const [showAssignStaffModal, setShowAssignStaffModal] = useState(false)
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false)
  const [statusChangeSuccess, setStatusChangeSuccess] = useState(false)

  if (!isOpen || !request) return null

  const handleAssignStaff = (staffId: string) => {
    console.log("Assigned staff:", staffId)
    // Handle the assignment logic here
  }

  const handleStatusChange = async (newStatus: "new" | "accepted" | "completed" | "no-show" | "canceled") => {
    if (!request) return

    try {
      const token = getAuthToken()
      if (!token) {
        alert('Please log in to update status')
        return
      }

      // Use _original._id if available, otherwise use id or requestId
      const requestId = request._original?._id || request.id || request.requestId
      if (!requestId) {
        alert('Request ID not found')
        return
      }

      const response = await fetch(`/api/partner/housekeeping-requests/${requestId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setStatusChangeSuccess(true)
        
        // Call parent callback to refresh data
        if (onStatusChange) {
          onStatusChange()
        }
        
        // Close modal after showing success message
        setTimeout(() => {
          setShowStatusChangeModal(false)
          setStatusChangeSuccess(false)
        }, 1500)
      } else {
        alert(result.error || 'Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status. Please try again.')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return { bg: "#D1924F0D", border: "#D1924F40", text: "#D1924F" }
      case "accepted":
        return { bg: "#6457D30D", border: "#6457D340", text: "#6457D3" }
      case "completed":
        return { bg: "#17B26A0D", border: "#17B26A40", text: "#17B26A" }
      case "no-show":
        return { bg: "#1F2A440D", border: "#1F2A4440", text: "#1F2A44" }
      case "canceled":
        return { bg: "#FF0D0D0D", border: "#FF0D0D40", text: "#FF0D0D" }
      default:
        return { bg: "#1F2A440D", border: "#1F2A4440", text: "#1F2A44" }
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return { bg: "#FF0D0D0D", border: "#FF0D0D40", text: "#FF0D0D" }
      case "medium":
        return { bg: "#D1924F0D", border: "#D1924F40", text: "#D1924F" }
      case "low":
        return { bg: "#17B26A0D", border: "#17B26A40", text: "#17B26A" }
      default:
        return { bg: "#1F2A440D", border: "#1F2A4440", text: "#1F2A44" }
    }
  }

  const statusColor = getStatusColor(request.status)
  const priorityColor = getPriorityColor(request.priority)

  const InfoRow = ({ label, value, centerValue = false }: { label: string; value: string | React.ReactNode; centerValue?: boolean }) => (
    <div className="flex items-center w-full">
      <div className="w-24 flex-shrink-0">
        <span className="text-sm font-medium text-[#212121]">{label}</span>
      </div>
      <div className="w-[210px] flex-shrink-0"></div>
      <div className="w-40 flex-shrink-0 flex items-center">
        <span className="text-sm text-[#525866]">{value}</span>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      
      {/* Slide-out panel */}
      <div className="fixed right-0 top-0 h-full w-[40vw] bg-white flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-black/8">
          <h2 className="text-lg font-semibold text-black">View request</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-5 overflow-y-auto">
          <div className="flex flex-col gap-3">
            {/* General Info Section */}
            <div>
              <h3 className="text-[15px] font-medium text-black/50 mb-3 leading-[21px]">
                General info
              </h3>
              
              <div className="w-full rounded-[8px] border p-4 bg-[#FBFAFA]" style={{ borderColor: "#21212114" }}>
                <div className="flex flex-col gap-2.5">
                  <InfoRow label="ID" value={request.requestId || request.id} centerValue={true} />
                  <InfoRow label="Room" value={request.room} centerValue={true} />
                  <InfoRow label="Guest" value={request.guest} centerValue={true} />
                  <InfoRow label="Type" value={request.type} centerValue={true} />
                  <InfoRow label="Created" value={request.created} centerValue={true} />
                  <InfoRow 
                    label="Status" 
                    value={
                      <span 
                        className="px-3 py-1 rounded text-xs font-medium capitalize"
                        style={{
                          background: statusColor.bg,
                          border: `0.5px solid ${statusColor.border}`,
                          color: statusColor.text
                        }}
                      >
                        {request.status}
                      </span>
                    } 
                    centerValue={true}
                  />
                  <InfoRow 
                    label="Priority" 
                    value={
                      <span 
                        className="px-3 py-1 rounded text-xs font-medium capitalize"
                        style={{
                          background: priorityColor.bg,
                          border: `0.5px solid ${priorityColor.border}`,
                          color: priorityColor.text
                        }}
                      >
                        {request.priority}
                      </span>
                    } 
                    centerValue={true}
                  />
                  <InfoRow label="Assignee" value={request.assignee && request.assignee.trim() !== '' ? request.assignee : '-'} centerValue={true} />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-black/8 mb-3 mt-4" />

            {/* Request Details Section */}
            <div>
              <h3 className="text-[15px] font-medium text-black/50 mb-3 leading-[21px]">
                Request details
              </h3>
              
              <div className="w-full rounded-[8px] border p-4 bg-[#FBFAFA]" style={{ borderColor: "#21212114" }}>
                <div className="flex flex-col gap-2.5">
                  <InfoRow label="Requested for" value={request.requestedFor} centerValue={false} />
                  <InfoRow label="Cleaning type" value={request.cleaningType} centerValue={false} />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-black/8 mb-3 mt-4" />

            {/* Notes Section */}
            <div>
              <h3 className="text-[15px] font-medium text-black/50 mb-3 leading-[21px]">
                Note
              </h3>
              
              <div className="w-full rounded-[8px] border p-4 bg-[#FBFAFA]" style={{ borderColor: "#21212114" }}>
                <p className="text-sm" style={{ color: "#000000CC" }}>
                  {request.note || "Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-2 p-5 border-t border-black/8 justify-end">
          <button
            onClick={() => setShowStatusChangeModal(true)}
            className="flex items-center gap-1.5 px-5 py-2 border border-[#CED4DA] bg-[#FBFAFA] text-black text-sm font-semibold hover:bg-gray-50 transition-colors"
            style={{ borderRadius: "6px" }}
          >
            <ChangeStatusIcon />
            Change status
          </button>

          <button
            onClick={() => setShowAssignStaffModal(true)}
            className="flex items-center gap-1.5 px-5 py-2 border border-[#CED4DA] bg-[#FBFAFA] text-black text-sm font-semibold hover:bg-gray-50 transition-colors"
            style={{ borderRadius: "6px" }}
          >
            <AssignTicketIcon />
            Assign to staff
          </button>
        </div>
      </div>

      {/* Assign Staff Modal */}
      <AssignStaffModal
        isOpen={showAssignStaffModal}
        onClose={() => setShowAssignStaffModal(false)}
        onAssign={handleAssignStaff}
      />

      {/* Change Status Modal */}
      {showStatusChangeModal && (
        <div 
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] backdrop-blur-sm"
          onClick={() => {
            if (!statusChangeSuccess) {
              setShowStatusChangeModal(false)
            }
          }}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all"
            style={{ borderRadius: "12px" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Change Status</h2>
              <button
                onClick={() => {
                  if (!statusChangeSuccess) {
                    setShowStatusChangeModal(false)
                  }
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full p-1"
                disabled={statusChangeSuccess}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              {/* Success Message */}
              {statusChangeSuccess && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 ease-in-out">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">Status updated successfully!</span>
                </div>
              )}

              <p className="text-gray-700 mb-4 font-medium">Select new status for this request:</p>
              <div className="space-y-2">
                {(["new", "accepted", "completed", "no-show", "canceled"] as const).map((status) => {
                  const isActive = request.status === status
                  return (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      disabled={statusChangeSuccess}
                      className={`
                        w-full text-left px-4 py-3 rounded-lg 
                        transition-all duration-200 
                        capitalize font-medium
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${isActive 
                          ? 'bg-blue-50 text-blue-700 border-2 border-blue-200' 
                          : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100 hover:border-gray-200 active:bg-gray-200'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span>{status.replace('-', ' ')}</span>
                        {isActive && (
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
