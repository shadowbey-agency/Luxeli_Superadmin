"use client"

import { useState } from "react"
import { RiCloseLine, RiImageLine } from "react-icons/ri"
import { getAuthToken } from "@/lib/auth-utils"

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
      alert('Please fill in all required fields')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address')
      return
    }

    // Validate Moroccan phone number format
    const phoneRegex = /^(\+212\s?[56]\d{2}[- ]?\d{6}|0[56]\d{2}[- ]?\d{6})$/
    const cleanedPhone = phoneNumber.replace(/\s|-/g, '')
    if (!phoneRegex.test(cleanedPhone)) {
      alert('Please enter a valid Moroccan phone number (Format: +212 6XX-XXXXXX or 06XX-XXXXXX)')
      return
    }

    // Validate password strength
    if (password.length < 6) {
      alert('Password must be at least 6 characters long')
      return
    }

    setIsLoading(true)
    try {
      const token = getAuthToken()
      if (!token) {
        alert('Please log in to add staff')
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
        alert('✅ Staff added successfully')
      } else {
        alert(result.error || 'Failed to add staff')
      }
    } catch (error) {
      console.error('Error adding staff:', error)
      alert('Failed to add staff. Please try again.')
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
                    const value = e.target.value
                    // Remove all non-digit characters except + and spaces
                    let cleaned = value.replace(/[^\d+\s-]/g, '')
                    
                    // If starts with +212, allow max 12 digits (country code + 9 digits)
                    if (cleaned.startsWith('+212')) {
                      const digits = cleaned.replace(/\D/g, '')
                      if (digits.length <= 12) {
                        // Format: +212 6XX-XXXXXX
                        if (digits.length > 5) {
                          cleaned = `+212 ${digits.slice(3, 5)}-${digits.slice(5)}`
                        } else if (digits.length > 3) {
                          cleaned = `+212 ${digits.slice(3)}`
                        }
                      } else {
                        return // Don't update if exceeds max length
                      }
                    }
                    // If starts with 0, allow max 10 digits (0 + 9 digits)
                    else if (cleaned.startsWith('0')) {
                      const digits = cleaned.replace(/\D/g, '')
                      if (digits.length <= 10) {
                        // Format: 0XXX-XXXXXX
                        if (digits.length > 3) {
                          cleaned = `${digits.slice(0, 3)}-${digits.slice(3)}`
                        }
                      } else {
                        return // Don't update if exceeds max length
                      }
                    }
                    // If starts with +, keep as is (for +212)
                    else if (cleaned.startsWith('+')) {
                      if (cleaned.length <= 4) {
                        // Allow +212
                        cleaned = cleaned.slice(0, 4)
                      } else {
                        return
                      }
                    }
                    // If starts with digit, allow max 10 digits
                    else if (/^\d/.test(cleaned)) {
                      const digits = cleaned.replace(/\D/g, '')
                      if (digits.length <= 10) {
                        // Format: 0XXX-XXXXXX
                        if (digits.length > 3) {
                          cleaned = `0${digits.slice(0, 2)}-${digits.slice(2)}`
                        } else if (digits.length > 0) {
                          cleaned = `0${digits}`
                        }
                      } else {
                        return
                      }
                    }
                    
                    setPhoneNumber(cleaned)
                  }}
                  placeholder="+212 6XX-XXXXXX or 06XX-XXXXXX"
                  maxLength={15}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ borderRadius: "4px" }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: +212 6XX-XXXXXX or 06XX-XXXXXX
                </p>
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
    </div>
  )
}
