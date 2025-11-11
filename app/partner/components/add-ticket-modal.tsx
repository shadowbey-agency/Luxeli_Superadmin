"use client"

import { useState } from "react"
import { RiCloseLine, RiImageLine } from "react-icons/ri"
import { getAuthToken } from "@/lib/auth-utils"

interface AddTicketModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function AddTicketModal({ isOpen, onClose, onSuccess }: AddTicketModalProps) {
  const [ticketTitle, setTicketTitle] = useState("")
  const [ticketPriority, setTicketPriority] = useState<"low" | "medium" | "urgent" | "">("")
  const [ticketDescription, setTicketDescription] = useState("")
  const [ticketImage, setTicketImage] = useState<string>("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSaveTicket = async () => {
    if (!ticketTitle.trim() || !ticketDescription.trim()) {
      setError("Title and description are required")
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

      const response = await fetch('/api/partner/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: ticketTitle.trim(),
          description: ticketDescription.trim(),
          priority: (ticketPriority || 'low') as "low" | "medium" | "urgent",
          image: ticketImage || undefined,
          status: 'open',
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create ticket')
      }

      // Reset form
      setTicketTitle("")
      setTicketPriority("")
      setTicketDescription("")
      setTicketImage("")
      setImagePreview(null)
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
      console.error('Error creating ticket:', err)
      setError(err.message || 'Failed to create ticket. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file")
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB")
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        setTicketImage(result) // Store as base64 for now (you can upload to cloud storage later)
      }
      reader.readAsDataURL(file)
    }
  }

  // Remove image
  const handleRemoveImage = () => {
    setTicketImage("")
    setImagePreview(null)
  }

  // Reset form when modal closes
  const handleClose = () => {
    setTicketTitle("")
    setTicketPriority("")
    setTicketDescription("")
    setTicketImage("")
    setImagePreview(null)
    setError(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
       <div className="bg-white shadow-xl max-w-3xl w-full mx-4" style={{ borderRadius: "10px" }}>
        {/* Header */}
        <div className="flex items-center justify-between pl-6 pr-6 pt-5 pb-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add a new ticket</h2>
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
          {/* Section 1: Ticket Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Ticket Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket title
                </label>
                <input
                  type="text"
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  placeholder="Write Here..."
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ borderRadius: "4px" }}
                />
              </div>

              {/* Ticket Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket priority
                </label>
                <div className="relative">
                  <select
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    style={{ borderRadius: "4px" }}
                  >
                    <option value="">Select</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="urgent">Urgent</option>
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

          {/* Section 2: Ticket Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ticket description
            </label>
            <textarea
              value={ticketDescription}
              onChange={(e) => setTicketDescription(e.target.value)}
              placeholder="Write your description here"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              style={{ borderRadius: "4px" }}
            />
          </div>

          {/* Section 3: Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload image (optional)
            </label>
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <RiCloseLine className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "229px",
                  gap: "12px",
                  borderRadius: "12px",
                  borderWidth: "1px",
                  borderStyle: "dashed",
                  borderColor: "#0000001F",
                  padding: "25px",
                  background: "#FFFFFF"
                }}
                className="flex flex-col"
              >
                <label
                  htmlFor="ticket-image-upload"
                  style={{
                    width: "100%",
                    height: "150px",
                    gap: "12px",
                    padding: "25px",
                    borderRadius: "6.75px",
                    borderWidth: "1px",
                    borderColor: "#0000000F",
                    background: "#FBFAFA",
                    cursor: "pointer"
                  }}
                  className="flex flex-col items-center justify-center border hover:bg-gray-50 transition-colors"
                >
                  <input
                    id="ticket-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <RiImageLine className="w-8 h-8 text-gray-400 mb-2" />
                  <div className="text-center">
                    <span className="text-sm text-gray-600">Drag and drop your image here or </span>
                    <span className="text-sm text-blue-600 underline">choose file</span>
                  </div>
                </label>
              </div>
            )}
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
            onClick={handleSaveTicket}
            disabled={isLoading || !ticketTitle.trim() || !ticketDescription.trim()}
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
