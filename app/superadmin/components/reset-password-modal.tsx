"use client"

import { useState, useEffect } from "react"
import { RiCloseLine } from "react-icons/ri"
import { getAuthToken } from "@/lib/auth-utils"

interface ResetPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  memberId?: string
  activeTab?: 'members' | 'staff' | 'partner'
  onSuccess?: () => void
}

export default function ResetPasswordModal({ 
  isOpen, 
  onClose, 
  memberId,
  activeTab = 'members',
  onSuccess
}: ResetPasswordModalProps) {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setNewPassword("")
      setConfirmPassword("")
      setError("")
      setShowNewPassword(false)
      setShowConfirmPassword(false)
    }
  }, [isOpen])

  const handleSave = async () => {
    // Validate inputs
    if (!newPassword || !newPassword.trim()) {
      setError("New password is required")
      return
    }

    if (!confirmPassword || !confirmPassword.trim()) {
      setError("Confirm password is required")
      return
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!memberId) {
      setError("Member/Staff/Partner ID is missing")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      const token = getAuthToken()
      if (!token) {
        setError("Authentication token not found. Please log in again.")
        setIsLoading(false)
        return
      }

      // Determine API endpoint based on active tab
      let endpoint
      let method
      if (activeTab === 'partner') {
        endpoint = `/api/superadmin/partners/${memberId}`
        method = 'PATCH'
      } else {
        endpoint = activeTab === 'staff' 
          ? `/api/partner/staff/${memberId}`
          : `/api/partner/members/${memberId}`
        method = 'PUT'
      }

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          password: newPassword.trim()
        })
      })

      let result
      try {
        result = await response.json()
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError)
        // If response is ok but JSON parsing fails, password might still be updated
        if (response.ok) {
          if (onSuccess) {
            onSuccess()
          }
          onClose()
          setIsLoading(false)
          return
        }
        setError('Invalid response from server')
        setIsLoading(false)
        return
      }

      // Check if response is successful
      if (response.ok) {
        // Password update is successful if response is ok, regardless of result.success
        // Some APIs might return success:true, others might just return 200
        if (result.success !== false) {
          if (onSuccess) {
            onSuccess()
          }
          onClose()
        } else {
          setError(result.error || 'Failed to reset password')
        }
      } else {
        // Response is not ok, check for error message
        setError(result.error || result.message || `Failed to reset password (Status: ${response.status})`)
      }
    } catch (error: any) {
      console.error('Error resetting password:', error)
      // Check if it's a network error or other error
      if (error.message) {
        setError(`Error: ${error.message}`)
      } else {
        setError('An error occurred while resetting the password. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
       <div className="bg-white shadow-xl max-w-3xl w-full mx-4" style={{ borderRadius: "10px" }}>
        {/* Header */}
        <div className="flex items-center justify-between pl-6 pr-6 pt-4 pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Reset password</h2>
            <p className="text-sm text-gray-600 mt-1">Click save when you re done</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <RiCloseLine className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            {/* New Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ borderRadius: "4px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 flex items-center cursor-pointer hover:opacity-70 transition-opacity"
                  style={{ background: "none", border: "none", padding: "0", marginRight: "12px" }}
                >
                  {showNewPassword ? (
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

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ borderRadius: "4px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center cursor-pointer hover:opacity-70 transition-opacity"
                  style={{ background: "none", border: "none", padding: "0", marginRight: "12px" }}
                >
                  {showConfirmPassword ? (
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

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded" style={{ color: "#DC2626" }}>
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 pb-4 pl-6 pr-6 border-t border-gray-200">
           <button
             onClick={onClose}
             className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
             style={{ borderRadius: "6px", background: "#FBFAFA" }}
           >
             Cancel
           </button>
           <button
             onClick={handleSave}
             disabled={isLoading}
             className="px-4 py-2 text-white hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
             style={{ borderRadius: "6px", background: "#1F2A44" }}
           >
             {isLoading ? "Updating..." : "Update"}
           </button>
        </div>
      </div>
    </div>
  )
}
