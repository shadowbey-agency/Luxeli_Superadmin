"use client"

import { useState } from "react"
import { ChangeStatusIcon, AssignTicketIcon } from "./icons"
import AssignStaffModal from "./assign-staff-modal"
import ActivityCard from "./activity-card"

interface Request {
  id: string
  requestId: string
  room: string
  guest: string
  category: string
  created: string
  status: "new" | "accepted" | "completed" | "pending" | "canceled"
  assignee: string
  requestedFor: string
  serviceName: string
  location: string
  price: string
  note?: string
}

interface ViewRequestModalProps {
  request: Request | null
  isOpen: boolean
  onClose: () => void
}

export default function ViewRequestModal({ request, isOpen, onClose }: ViewRequestModalProps) {
  const [showAssignStaffModal, setShowAssignStaffModal] = useState(false)

  if (!isOpen || !request) return null

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

  const InfoRow = ({ label, value }: { label: string; value: string | React.ReactNode }) => (
    <div className="flex items-center justify-between w-full">
      <span className="text-sm font-medium text-[#212121]">{label}</span>
      <span className="text-sm text-[#525866]">{value}</span>
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
              <h3 className="text-[15px] font-medium text-black/50 mb-4 leading-[21px]">
                General info
              </h3>
              
              <div className="w-full rounded-lg border p-4 bg-[#FBFAFA]" style={{ borderColor: "#21212114" }}>
                <div className="flex flex-col gap-2.5">
                  <InfoRow label="ID" value={request.requestId} />
                  <InfoRow label="Room" value={request.room} />
                  <InfoRow label="Guest" value={request.guest} />
                  <InfoRow label="Category" value={request.category} />
                  <InfoRow label="Created" value={request.created} />
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
                  />
                  <InfoRow label="Assignee" value={request.assignee && request.assignee.trim() !== '' ? request.assignee : '-'} />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-black/8 mb-4" />

            {/* Main Content Section - Two Columns */}
            <div className="flex gap-4 " style={{ width: "100%", }}>
              {/* Left Column - Request Details Card */}
              <div 
                className="flex flex-col"
                style={{ 
                  width: "55%", 
                  height: "449.47265625px",
                  gap: "10px",
                  borderRight: "1px solid #0000001F",
                  paddingRight: "16px"
                }}
              >
                {/* Request Detail Heading */}
                <div 
                  className="flex items-center "
                  style={{ 
                    width: "100%", 
                    height: "21px",
                    fontSize: "15px",
                    fontWeight: "500",
                    lineHeight: "21px",
                    color: "#00000080",
                    textAlign: "center"
                  }}
                >
                  Request detail
                </div>

                {/* Activity Card for Activity Alerts */}
                {request.serviceName ? (
                  <div className="flex-1">
                    <ActivityCard
                      id={parseInt(request.id.replace('#', ''))}
                      title={request.serviceName}
                      type={request.category}
                      location={request.location}
                      date={request.created}
                      status={request.status === 'new' ? 'Active' : request.status === 'completed' ? 'Active' : 'Inactive'}
                      description={request.note || "Activity alert description"}
                      image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8ipA6E17y4LoKuHtZWjuJkPWWFPAUIkc5-w&s"
                    />
                  </div>
                ) : (
                  /* Original Image Card for Booking Requests */
                  <div 
                    className="border rounded-[10px] overflow-hidden"
                    style={{ 
                      width: "100%", 
                      height: "400px",
                      border: "1px solid #2121211A"
                    }}
                  >
                    {/* Image */}
                    <div 
                      className="w-full bg-gray-200 flex items-center justify-center"
                      style={{ 
                        height: "190px",
                        borderTopLeftRadius: "10px",
                        borderTopRightRadius: "10px",
                        borderBottom: "1px solid #2121211A"
                      }}
                    >
                      <div className="text-gray-500 text-sm">Service Image</div>
                    </div>
                    
                    {/* Content Area */}
                    <div 
                      className="p-4 flex flex-col gap-2"
                      style={{ 
                        width: "100%", 
                      }}
                    >
                      {/* Location and Date Row */}
                      <div 
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm text-[#525866]">Location</span>
                        <span className="text-sm text-[#525866]">Jan 15, 2025</span>
                      </div>
                      
                      {/* Service Name and Category Row */}
                      <div 
                        className="flex justify-between items-center"
                      >
                        <span className="text-[14px] font-bold text-[#212121]">Service name</span>
                        <span className="text-sm text-[#525866]">Category</span>
                      </div>
                      
                      {/* Description Text */}
                      <div 
                        className="text-xs text-[#21212199]"
                      >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
                      </div>
                      
                      {/* Price Row */}
                      <div 
                        className="flex justify-between items-center"
                      >
                        <span 
                          className="font-bold text-xl "
                          style={{
                            color: "#4195BF",
                          }}
                        >
                          20$
                        </span>
                </div>
              </div>
                  </div>
                )}
            </div>

              {/* Right Column - Notes Box */}
              <div className="flex flex-col " style={{ width: "45%", height: "449px" }}>
                {/* Notes Heading */}
                <div 
                  className="flex items-center  "
                  style={{ 
                    width: "100%", 
                    height: "21px",
                    // background: "#00000080",
                    fontSize: "15px",
                    fontWeight: "500",
                    lineHeight: "21px",
                    color: "#00000080",
                    textAlign: "center",
                    marginBottom: "10px"
                  }}
                >
                  Notes
                </div>
                
                {/* Notes Content Box */}
                <div 
                  className="border  p-3 bg-[#FBFAFA] flex-1 rounded-[10px]"
                  style={{ 
                    border: "1px solid #21212114"
                  }}
                >
                  <h4 className="text-sm font-medium text-[#212121] mb-3">Note</h4>
                <p 
                  className="text-sm"
                  style={{ 
                    color: "#000000CC",
                    lineHeight: "22px"
                  }}
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
                </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-2 p-5 border-t border-black/8 justify-end">
          <button
            className="flex items-center gap-1.5 px-5 py-2 rounded-md border border-[#CED4DA] bg-[#FBFAFA] text-black text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            <ChangeStatusIcon />
            Change status
          </button>

          <button
            onClick={() => setShowAssignStaffModal(true)}
            className="flex items-center gap-1.5 px-5 py-2 rounded-md border border-[#CED4DA] bg-[#FBFAFA] text-black text-sm font-semibold hover:bg-gray-50 transition-colors"
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
