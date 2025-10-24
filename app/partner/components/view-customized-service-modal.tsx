"use client"

import { useState } from "react"
import { ChangeStatusIcon, AssignTicketIcon } from "./icons"
import AssignStaffModal from "./assign-staff-modal"

interface CustomizedServiceRequest {
  id: string
  requestId: string
  room: string
  guest: string
  created: string
  status: "new" | "accepted" | "completed" | "pending" | "canceled"
  assignee: string
  title: string
  requestDescription: string
}

interface ViewCustomizedServiceModalProps {
  request: CustomizedServiceRequest | null
  isOpen: boolean
  onClose: () => void
}

export default function ViewCustomizedServiceModal({ request, isOpen, onClose }: ViewCustomizedServiceModalProps) {
  const [showAssignStaffModal, setShowAssignStaffModal] = useState(false)

  if (!isOpen || !request) return null

  // Debug: Log the request data
  console.log('CustomizedServiceModal request:', request)

  const handleAssignStaff = (staffId: string) => {
    console.log("Assigned staff:", staffId)
    // Handle the assignment logic here
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return { bg: "#D1924F0D", border: "#D1924F40", text: "#D1924F" }
      case "accepted":
        return { bg: "#6457D30D", border: "#6457D340", text: "#6457D3" }
      case "completed":
        return { bg: "#17B26A0D", border: "#17B26A40", text: "#17B26A" }
      case "pending":
        return { bg: "#1F2A440D", border: "#1F2A4440", text: "#1F2A44" }
      case "canceled":
        return { bg: "#FF0D0D0D", border: "#FF0D0D40", text: "#FF0D0D" }
      default:
        return { bg: "#1F2A440D", border: "#1F2A4440", text: "#1F2A44" }
    }
  }

  const statusColor = getStatusColor(request.status)

  const InfoRow = ({ label, value, centerValue = false }: { label: string; value: string | React.ReactNode; centerValue?: boolean }) => (
    <div className="flex items-center w-full">
      <div className="w-24 flex-shrink-0">
        <span className="text-sm font-medium text-[#212121]" style={{ color: '#212121' }}>{label}</span>
      </div>
      <div className="w-[210px] flex-shrink-0"></div>
      <div className="w-40 flex-shrink-0 flex items-center">
        <span className="text-sm text-[#525866]" style={{ color: '#525866' }}>{value}</span>
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
                  <InfoRow label="Title" value={request.title || "Norem ipsum dolor sit amet"} centerValue={false} />
                  <InfoRow label="Request description" value={request.requestDescription || "Rorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero."} centerValue={false} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-2 p-5 border-t border-black/8 justify-end">
          <button
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
    </div>
  )
}
