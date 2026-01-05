"use client"

import { useState } from "react"
import { RiCloseLine, RiImageLine } from "react-icons/ri"
import { getAuthToken } from "@/lib/auth-utils"
import SuccessCard from "@/app/superadmin/components/success-card"
import ErrorCard from "@/app/superadmin/components/error-card"

interface AddStaffModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function AddStaffModal({ isOpen, onClose, onSuccess }: AddStaffModalProps) {
  const [staffName, setStaffName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [role, setRole] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessCard, setShowSuccessCard] = useState(false)
  const [showErrorCard, setShowErrorCard] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const resetForm = () => {
    setStaffName("")
    setEmail("")
    setPhoneNumber("")
    setRole("")
    setUsername("")
    setPassword("")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async () => {
    if (!staffName || !email || !phoneNumber || !role || !username || !password) {
      setErrorMessage('Please fill in all required fields')
      setShowErrorCard(true)
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address')
      setShowErrorCard(true)
      return
    }

    // Validate password strength
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long')
      setShowErrorCard(true)
      return
    }

    setIsLoading(true)
    try {
      const token = getAuthToken()
      if (!token) {
        setErrorMessage('Please log in to add staff')
        setShowErrorCard(true)
        setIsLoading(false)
        return
      }

      const response = await fetch('/api/partner/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          staffName,
          email,
          phoneNumber,
          role,
          username,
          password,
          status: 'active'
        })
      })

      const result = await response.json()
      if (response.ok && result.success) {
        // Reset form
        resetForm()
        
        // Close modal and refresh list
        onClose()
        if (onSuccess) {
          onSuccess()
        }
        // Show success card instead of alert
        setShowSuccessCard(true)
      } else {
        setErrorMessage(result.error || 'Failed to add staff')
        setShowErrorCard(true)
      }
    } catch (error) {
      console.error('Error adding staff:', error)
      setErrorMessage('Failed to add staff. Please try again.')
      setShowErrorCard(true)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
       <div className="bg-white shadow-xl max-w-3xl w-full mx-4" style={{ borderRadius: "10px" }}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200" style={{ padding: "20px 16px" }}>
          <h2 className="text-xl font-semibold text-gray-900">Add Staff</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <RiCloseLine className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-2" style={{ padding: "20px 16px" }}>
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
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    // Only allow numbers, +, spaces, and dashes
                    const value = e.target.value
                    const cleaned = value.replace(/[^\d+\s-]/g, '')
                    setPhoneNumber(cleaned)
                  }}
                  placeholder="Enter phone number"
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
                    <option value="">Select Role</option>
                    <option value="housekeeper">Housekeeper</option>
                    <option value="booking assistant">Booking Assistant</option>
                    <option value="custom service agent">Custom Service Agent</option>
                    <option value="activity supervisor">Activity Supervisor</option>
                    <option value="laundary attendant">Laundary Attendant</option>
                    <option value="delivery staff">Delivery Staff</option>
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
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ borderRadius: "4px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center cursor-pointer hover:opacity-70 transition-opacity"
                    style={{ background: "none", border: "none", padding: "0", marginRight: "12px" }}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0L3 15M6 6l8.41 8.41M6 6l8.41-8.41M17.41 17.41L21 21M17.41 17.41L12 12" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200" style={{ padding: "20px 16px" }}>
           <button
             onClick={handleClose}
             className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
             style={{ borderRadius: "6px", background: "#FBFAFA" }}
           >
             Annuler
           </button>
           <button
             onClick={handleSubmit}
             disabled={isLoading}
             className="px-4 py-2 text-white hover:opacity-90 transition-colors disabled:opacity-50"
             style={{ borderRadius: "6px", background: "#1F2A44" }}
           >
             {isLoading ? 'Adding...' : 'Add Staff'}
           </button>
        </div>
      </div>

      {/* Success Card */}
      <SuccessCard
        isOpen={showSuccessCard}
        message="Staff added successfully"
        onClose={() => setShowSuccessCard(false)}
      />

      {/* Error Card */}
      <ErrorCard
        isOpen={showErrorCard}
        message={errorMessage}
        onClose={() => setShowErrorCard(false)}
      />
    </div>
  )
}
