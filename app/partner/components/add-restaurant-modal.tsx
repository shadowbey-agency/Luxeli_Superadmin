"use client"

import { useState, useEffect, useRef } from "react"
import { RiCloseLine, RiImageLine, RiTimeLine } from "react-icons/ri"
import { getAuthToken } from "@/lib/auth-utils"
import { uploadImageToCloudinary } from "@/lib/cloudinary"

interface Restaurant {
  _id: string
  restaurantName: string
  status: "open" | "closed"
  startWork: string
  endWork: string
  restaurantImage?: string
  items: Array<{
    itemName: string
    status: "published" | "unpublished"
    category: string
    itemPrice: number
    itemDescription: string
    itemImage?: string
  }>
  createdAt?: string
  updatedAt?: string
}

interface AddRestaurantModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  restaurant?: Restaurant | null // Restaurant to edit (null for new restaurant)
}

export default function AddRestaurantModal({ isOpen, onClose, onSuccess, restaurant }: AddRestaurantModalProps) {
  const [restaurantName, setRestaurantName] = useState("")
  const [isOpenStatus, setIsOpenStatus] = useState(true) // open/closed status
  const [startWork, setStartWork] = useState("")
  const [endWork, setEndWork] = useState("")
  const [restaurantImage, setRestaurantImage] = useState<string>("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  // Use ref to store uploaded image URL immediately (not async like state)
  const uploadedImageUrlRef = useRef<string>("")

  // Pre-fill form when editing a restaurant
  useEffect(() => {
    if (restaurant && isOpen) {
      setRestaurantName(restaurant.restaurantName || "")
      setIsOpenStatus(restaurant.status === "open")
      setStartWork(restaurant.startWork || "")
      setEndWork(restaurant.endWork || "")
      setRestaurantImage(restaurant.restaurantImage || "")
      setImagePreview(restaurant.restaurantImage || null)
      setError(null)
      setSuccessMessage(null)
    } else if (!restaurant && isOpen) {
      // Reset form for new restaurant
      setRestaurantName("")
      setIsOpenStatus(true)
      setStartWork("")
      setEndWork("")
      setRestaurantImage("")
      setImagePreview(null)
      setError(null)
      setSuccessMessage(null)
    }
  }, [restaurant, isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
       <div className="bg-white shadow-xl max-w-3xl w-full mx-4" style={{ borderRadius: "10px" }}>
        {/* Header */}
        <div className="flex items-center justify-between pl-6 pr-6 pt-5 pb-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{restaurant ? "Edit restaurant" : "Add new restaurant"}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <RiCloseLine className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Section 1: Restaurant Details */}
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              {/* Restaurant Name */}
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1" style={{ color: "#212121" }}>
                  Restaurant name
                </label>
                <input
                  type="text"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  placeholder="Write Here..."
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-transparent"
                  style={{ borderRadius: "4px" }}
                />
              </div>

              {/* Status Toggle */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#212121" }}>
                  Status
                </label>
                <div className="flex items-center space-x-3">
                  <span className={`text-sm ${!isOpenStatus ? 'text-gray-900' : 'text-gray-500'}`}>
                    Open
                  </span>
                  <div
                    className="relative w-11 h-6 rounded-full transition-colors cursor-pointer"
                    style={{
                      backgroundColor: isOpenStatus ? "#50BE87" : "#E5E7EB"
                    }}
                    onClick={() => setIsOpenStatus(!isOpenStatus)}
                  >
                    <div
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform"
                      style={{
                        transform: isOpenStatus ? "translateX(24px)" : "translateX(4px)"
                      }}
                    />
                  </div>
                  <span className={`text-sm ${isOpenStatus ? 'text-gray-500' : 'text-gray-900'}`}>
                    Closed
                  </span>
                </div>
              </div>
            </div>

            {/* Work Hours */}
            <div className="grid grid-cols-2 gap-4">
              {/* Start Work */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#212121" }}>
                  Start work
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={startWork}
                    onChange={(e) => setStartWork(e.target.value)}
                    placeholder="Choose"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ 
                      borderRadius: "4px",
                      WebkitAppearance: "none",
                      MozAppearance: "textfield"
                    }}
                  />
                  <RiTimeLine className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* End Work */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#212121" }}>
                  End work
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={endWork}
                    onChange={(e) => setEndWork(e.target.value)}
                    placeholder="Choose"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ 
                      borderRadius: "4px",
                      WebkitAppearance: "none",
                      MozAppearance: "textfield"
                    }}
                  />
                  <RiTimeLine className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Restaurant Image Upload */}
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
            <label className="text-sm font-medium" style={{ color: "#212121" }}>Restaurant image</label>
            
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
                        setRestaurantImage("")
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <RiCloseLine className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <label htmlFor="restaurant-image-upload" className="cursor-pointer">
                      <RiImageLine className="w-8 h-8 text-gray-400 mb-2" />
                      <div className="text-center">
                        <span className="text-sm text-gray-600">Drag and drop your image here or </span>
                        <span className="text-sm text-blue-600 underline">choose file</span>
                      </div>
                    </label>
                    <input
                      id="restaurant-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          if (!file.type.startsWith('image/')) {
                            setError("Please select a valid image file")
                            return
                          }
                          if (file.size > 10 * 1024 * 1024) {
                            setError("Image size must be less than 10MB")
                            return
                          }

                          setIsUploadingImage(true)
                          setError(null)

                          try {
                            // Show preview immediately using Promise
                            await new Promise<void>((resolve) => {
                              const reader = new FileReader()
                              reader.onloadend = () => {
                                setImagePreview(reader.result as string)
                                resolve()
                              }
                              reader.readAsDataURL(file)
                            })

                            // Upload to Cloudinary
                            const result = await uploadImageToCloudinary(file, {
                              folder: 'restaurants'
                            })

                            // Store Cloudinary URL
                            setRestaurantImage(result.secure_url)
                            console.log('✅ Image uploaded to Cloudinary:', {
                              url: result.secure_url,
                              public_id: result.public_id
                            })
                          } catch (error: any) {
                            console.error('Error uploading image:', error)
                            setError(error.message || 'Failed to upload image. Please try again.')
                            setImagePreview(null)
                            setRestaurantImage("")
                          } finally {
                            setIsUploadingImage(false)
                          }
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
               if (!restaurantName.trim()) {
                 setError("Restaurant name is required")
                 return
               }
               if (!startWork.trim()) {
                 setError("Start work time is required")
                 return
               }
               if (!endWork.trim()) {
                 setError("End work time is required")
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

                 // Prepare request body
                 const requestBody = {
                   restaurantName: restaurantName.trim(),
                   status: isOpenStatus ? 'open' : 'closed',
                   startWork: startWork.trim(),
                   endWork: endWork.trim(),
                   ...(restaurantImage && { restaurantImage }),
                 }

                 const isEditMode = !!restaurant
                 const url = isEditMode 
                   ? `/api/partner/restaurants/${restaurant._id}`
                   : '/api/partner/restaurants'
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
                   throw new Error(data.error || 'Failed to save restaurant')
                 }

                 // Show success message
                 const message = isEditMode ? 'Restaurant updated successfully!' : 'Restaurant created successfully!'
                 setSuccessMessage(message)
                 setError(null)

                 // Reset form only after successful save
                 setRestaurantName("")
                 setIsOpenStatus(true)
                 setStartWork("")
                 setEndWork("")
                 setRestaurantImage("")
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
                 console.error('Error saving restaurant:', err)
                 setError(err.message || 'Failed to save restaurant. Please try again.')
               } finally {
                 setIsLoading(false)
               }
             }}
             disabled={isLoading || !restaurantName.trim() || !startWork.trim() || !endWork.trim()}
             className="px-4 py-2 text-white hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
             style={{ borderRadius: "6px", background: "#1F2A44" }}
           >
             {isLoading ? (restaurant ? "Updating..." : "Saving...") : (restaurant ? "Update" : "Save")}
           </button>
        </div>
      </div>
    </div>
  )
}
