"use client"

import { useState } from "react"
import { RiCloseLine, RiImageLine } from "react-icons/ri"

interface AddStaffModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddStaffModal({ isOpen, onClose }: AddStaffModalProps) {
  const [staffName, setStaffName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [role, setRole] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
       <div className="bg-white shadow-xl max-w-3xl w-full mx-4" style={{ borderRadius: "10px" }}>
        {/* Header */}
        <div className="flex items-center justify-between pl-6 pr-6 pt-4 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Staff</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <RiCloseLine className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 pt-3 space-y-2">
          {/* Section 1: General Information */}
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-gray-900">General information</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Staff Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Staff Name
                </label>
                <input
                  type="text"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  placeholder="Write Here..."
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ borderRadius: "4px" }}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Write Here..."
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ borderRadius: "4px" }}
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone number
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Write Here..."
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ borderRadius: "4px" }}
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    style={{ borderRadius: "4px" }}
                  >
                    <option value="">Select</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="staff">Staff</option>
                    <option value="receptionist">Receptionist</option>
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

          {/* Section 2: Staff Image */}
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-gray-900">Staff image</h3>
            <div
              style={{
                width: "100%",
                height: "180px",
                gap: "8px",
                borderRadius: "12px",
                borderWidth: "1px",
                borderStyle: "dashed",
                borderColor: "#0000001F",
                padding: "20px",
                background: "#FFFFFF"
              }}
              className="flex flex-col"
            >
              <div
                style={{
                  width: "100%",
                  height: "120px",
                  gap: "8px",
                  padding: "20px",
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

          {/* Section 3: Account & Access */}
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-gray-900">Account & access</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Write Here..."
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ borderRadius: "4px" }}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ borderRadius: "4px" }}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 pb-4 pl-6 pr-6 border-t border-gray-200">
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
             Add Staff
           </button>
        </div>
      </div>
    </div>
  )
}
