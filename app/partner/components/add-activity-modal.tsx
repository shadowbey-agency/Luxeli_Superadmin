"use client"

import { useState, useEffect } from "react"
import { RiCloseLine, RiImageLine } from "react-icons/ri"
import { getAuthToken, getUserData } from "@/lib/auth-utils"

interface Activity {
  _id: string
  activityTitle: string
  status: "published" | "unpublished"
  activityDescription: string
  activityImage?: string
  createdBy: string
  createdAt?: string
  updatedAt?: string
}

interface AddActivityModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  activity?: Activity | null // Activity to edit (null for new activity)
}

export default function AddActivityModal({ isOpen, onClose, onSuccess, activity }: AddActivityModalProps) {
  const [activityTitle, setActivityTitle] = useState("")
  const [activityDescription, setActivityDescription] = useState("")
  const [isPublished, setIsPublished] = useState(true)
  const [activityImage, setActivityImage] = useState<string>("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Pre-fill form when editing an activity
  useEffect(() => {
    if (activity && isOpen) {
      setActivityTitle(activity.activityTitle || "")
      setIsPublished(activity.status === "published")
      setActivityDescription(activity.activityDescription || "")
      setActivityImage(activity.activityImage || "")
      setImagePreview(activity.activityImage || null)
      setError(null)
      setSuccessMessage(null)
    } else if (!activity && isOpen) {
      // Reset form for new activity
      setActivityTitle("")
      setIsPublished(true)
      setActivityDescription("")
      setActivityImage("")
      setImagePreview(null)
      setError(null)
      setSuccessMessage(null)
    }
  }, [activity, isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
       <div className="bg-white shadow-xl max-w-3xl w-full mx-4" style={{ borderRadius: "10px" }}>
        {/* Header */}
        <div className="flex items-center justify-between pl-6 pr-6 pt-5 pb-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{activity ? "Edit activity" : "Add a new activity"}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <RiCloseLine className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Section 1: Activity Details */}
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              {/* Activity Title */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activity title
                </label>
                <input
                  type="text"
                  value={activityTitle}
                  onChange={(e) => setActivityTitle(e.target.value)}
                  placeholder="Write Here..."
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ borderRadius: "4px" }}
                />
              </div>

              {/* Status Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <div className="flex items-center space-x-3">
                  <span className={`text-sm ${!isPublished ? 'text-gray-900' : 'text-gray-500'}`}>
                    Published
                  </span>
                  <div
                    className="relative w-11 h-6 rounded-full transition-colors cursor-pointer"
                    style={{
                      backgroundColor: isPublished ? "#50BE87" : "#E5E7EB"
                    }}
                    onClick={() => setIsPublished(!isPublished)}
                  >
                    <div
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform"
                      style={{
                        transform: isPublished ? "translateX(24px)" : "translateX(4px)"
                      }}
                    />
                  </div>
                  <span className={`text-sm ${isPublished ? 'text-gray-500' : 'text-gray-900'}`}>
                    Unpublished
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Activity Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Activity description
            </label>
            <textarea
              value={activityDescription}
              onChange={(e) => setActivityDescription(e.target.value)}
              placeholder="Write Here..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              style={{ borderRadius: "4px" }}
            />
          </div>

          {/* Section 3: Activity Image Upload */}
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
            <label className="text-sm font-medium text-gray-700">Activity image</label>
            
            <div
              
              className="flex flex-col"
            >
              <div
                style={{
                  width: "100%",
                  height: "150px",
                  gap: "12px",
                  paddingTop: "25px",
                  paddingRight: "13px",
                  paddingBottom: "25px",
                  paddingLeft: "13px",
                  borderRadius: "6.75px",
                  borderWidth: "1px",
                  borderColor: "#0000000F",
                  background: "#FBFAFA"
                }}
                className="flex flex-col items-center justify-center border relative"
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded" />
                    <button
                      onClick={() => {
                        setImagePreview(null)
                        setActivityImage("")
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <RiCloseLine className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <label htmlFor="activity-image-upload" className="cursor-pointer">
                      <RiImageLine className="w-8 h-8 text-gray-400 mb-2" />
                      <div className="text-center">
                        <span className="text-sm text-gray-600">Drag and drop your image here or </span>
                        <span className="text-sm text-blue-600 underline">choose file</span>
                      </div>
                    </label>
                    <input
                      id="activity-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          if (!file.type.startsWith('image/')) {
                            setError("Please select a valid image file")
                            return
                          }
                          if (file.size > 5 * 1024 * 1024) {
                            setError("Image size must be less than 5MB")
                            return
                          }
                          const reader = new FileReader()
                          reader.onloadend = () => {
                            const result = reader.result as string
                            setImagePreview(result)
                            setActivityImage(result) // Store as base64
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                      className="hidden"
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-5 pb-5 pl-6 pr-6 border-t border-gray-200">
           <button
             onClick={onClose}
             disabled={isLoading}
             className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
             style={{ borderRadius: "6px", background: "#FBFAFA" }}
           >
             Annuler
           </button>
           <button
             onClick={async () => {
               // Clear previous errors
               setError(null)

               // Validate required fields
               if (!activityTitle.trim()) {
                 setError("Activity title is required")
                 return
               }
               if (!activityDescription.trim()) {
                 setError("Activity description is required")
                 return
               }

               setIsLoading(true)

               try {
                 const token = getAuthToken()
                 if (!token) {
                   setError("Authentication token not found. Please log in again.")
                   setIsLoading(false)
                   return
                 }

                 // Get user data for createdBy
                 const userData = getUserData()
                 // Extract name from userData - handle different user types
                 let createdBy = 'Unknown User'
                 if (userData) {
                   if ('name' in userData) {
                     createdBy = userData.name || 'Unknown User'
                   } else if ('email' in userData) {
                     createdBy = userData.email || 'Unknown User'
                   } else if ('username' in userData) {
                     createdBy = userData.username || 'Unknown User'
                   }
                 }

                 // Prepare request body
                 const requestBody = {
                   activityTitle: activityTitle.trim(),
                   status: isPublished ? 'published' : 'unpublished',
                   activityDescription: activityDescription.trim(),
                   createdBy,
                   ...(activityImage && { activityImage }),
                 }

                 const isEditMode = !!activity
                 const url = isEditMode 
                   ? `/api/partner/activities/${activity._id}`
                   : '/api/partner/activities'
                 const method = isEditMode ? 'PATCH' : 'POST'

                 const response = await fetch(url, {
                   method,
                   headers: {
                     'Content-Type': 'application/json',
                     'Authorization': `Bearer ${token}`
                   },
                   body: JSON.stringify(requestBody),
                 })

                 const data = await response.json()

                 if (!response.ok || !data.success) {
                   throw new Error(data.error || 'Failed to save activity')
                 }

                 // Show success message
                 const message = isEditMode ? 'Activity updated successfully!' : 'Activity created successfully!'
                 setSuccessMessage(message)
                 setError(null)

                 // Reset form only after successful save
                 setActivityTitle("")
                 setIsPublished(true)
                 setActivityDescription("")
                 setActivityImage("")
                 setImagePreview(null)

                 // Call success callback to refresh the list
                 if (onSuccess) {
                   onSuccess()
                 }

                 // Close modal after showing success message
                 setTimeout(() => {
                   setSuccessMessage(null)
                   onClose()
                 }, 1500)
               } catch (err: any) {
                 console.error('Error saving activity:', err)
                 setError(err.message || 'Failed to save activity. Please try again.')
               } finally {
                 setIsLoading(false)
               }
             }}
             disabled={isLoading || !activityTitle.trim() || !activityDescription.trim()}
             className="px-4 py-2 text-white hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
             style={{ borderRadius: "6px", background: "#1F2A44" }}
           >
             {isLoading ? (activity ? "Updating..." : "Saving...") : (activity ? "Update" : "Save")}
           </button>
        </div>
      </div>
    </div>
  )
}
