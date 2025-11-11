"use client"

import { useState } from "react"
import { RiCloseLine, RiArrowDownSLine } from "react-icons/ri"
import { getAuthToken } from "@/lib/auth-utils"

interface AddHousekeepingRequestModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function AddHousekeepingRequestModal({ isOpen, onClose, onSuccess }: AddHousekeepingRequestModalProps) {
  const [room, setRoom] = useState("")
  const [guest, setGuest] = useState("")
  const [type, setType] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "urgent" | "">("")
  const [requestedFor, setRequestedFor] = useState("")
  const [cleaningType, setCleaningType] = useState("")
  const [note, setNote] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSaveRequest = async () => {
    if (!room.trim() || !guest.trim() || !type.trim() || !requestedFor.trim() || !cleaningType.trim()) {
      setError("Room, guest, type, requested for, and cleaning type are required")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const token = getAuthToken()
      if (!token) {
        setError("Authentication token not found. Please log in again.")
        setIsLoading(false)
        return
      }

      const response = await fetch('/api/partner/requests-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          room: room.trim(),
          guest: guest.trim(),
          type: type.trim(),
          priority: (priority || 'low') as "low" | "medium" | "urgent",
          requestedFor: requestedFor.trim(),
          cleaningType: cleaningType.trim(),
          note: note.trim() || '',
          status: 'new',
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create request')
      }

      // Reset form
      setRoom("")
      setGuest("")
      setType("")
      setPriority("")
      setRequestedFor("")
      setCleaningType("")
      setNote("")
      setError(null)

      // Call onSuccess callback to refresh the list
      if (onSuccess) {
        onSuccess()
      }

      // Close modal after a brief delay to show success
      setTimeout(() => {
        onClose()
      }, 300)
    } catch (err: any) {
      console.error('Error creating request:', err)
      setError(err.message || 'Failed to create request. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Reset form when modal closes
  const handleClose = () => {
    setRoom("")
    setGuest("")
    setType("")
    setPriority("")
    setRequestedFor("")
    setCleaningType("")
    setNote("")
    setError(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
      <div className="bg-white shadow-xl max-w-3xl w-full mx-4" style={{ borderRadius: "10px" }}>
        {/* Header */}
        <div className="flex items-center justify-between pl-6 pr-6 pt-5 pb-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add new request</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <RiCloseLine className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Section 1: Request Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Room */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room
                </label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="Write Here..."
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ borderRadius: "4px" }}
                />
              </div>

              {/* Guest */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guest
                </label>
                <input
                  type="text"
                  value={guest}
                  onChange={(e) => setGuest(e.target.value)}
                  placeholder="Write Here..."
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ borderRadius: "4px" }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <div className="relative">
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-10"
                    style={{ borderRadius: "4px" }}
                  >
                    <option value="">Select</option>
                    <option value="Custom cleaning">Custom cleaning</option>
                    <option value="Request needed">Request needed</option>
                    <option value="Room cleaning">Room cleaning</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <RiArrowDownSLine className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <div className="relative">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as "low" | "medium" | "urgent" | "")}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-10"
                    style={{ borderRadius: "4px" }}
                  >
                    <option value="">Select</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <RiArrowDownSLine className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Requested For */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requested for
                </label>
                <input
                  type="text"
                  value={requestedFor}
                  onChange={(e) => setRequestedFor(e.target.value)}
                  placeholder="Write Here..."
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ borderRadius: "4px" }}
                />
              </div>

              {/* Cleaning Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cleaning type
                </label>
                <input
                  type="text"
                  value={cleaningType}
                  onChange={(e) => setCleaningType(e.target.value)}
                  placeholder="Write Here..."
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ borderRadius: "4px" }}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write your note here"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              style={{ borderRadius: "4px" }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-5 pb-5 pl-6 pr-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ borderRadius: "6px", background: "#FBFAFA" }}
          >
            Annuler
          </button>
          <button
            onClick={handleSaveRequest}
            disabled={isLoading || !room.trim() || !guest.trim() || !type.trim() || !requestedFor.trim() || !cleaningType.trim()}
            className="px-4 py-2 text-white hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ borderRadius: "6px", background: "#1F2A44" }}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  )
}

