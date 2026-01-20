"use client"

import { useState, useEffect, useRef } from "react"
import { RiCloseLine, RiImageLine, RiCalendarLine } from "react-icons/ri"
import { getAuthToken } from "@/lib/auth-utils"
import { uploadImageToCloudinary } from "@/lib/cloudinary"

interface BookingSetting {
  _id: string
  serviceName: string
  category: string
  serviceDescription: string
  serviceLocation: string
  servicePrice: number
  startDate: string
  endDate: string
  status: "published" | "unpublished"
  bookDate: boolean
  serviceImage?: string
  createdAt?: string
  updatedAt?: string
}

interface AddServiceModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  service?: BookingSetting | null // Service to edit (null for new service)
}

export default function AddServiceModal({ isOpen, onClose, onSuccess, service }: AddServiceModalProps) {
  const [serviceName, setServiceName] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [price, setPrice] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isPublished, setIsPublished] = useState(true)
  const [clientCanChooseDate, setClientCanChooseDate] = useState(true)
  const [serviceImage, setServiceImage] = useState<string>("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Use ref to store uploaded image URL immediately (not async like state)
  const uploadedImageUrlRef = useRef<string>("")

  // Pre-fill form when editing a service
  useEffect(() => {
    if (service && isOpen) {
      setServiceName(service.serviceName || "")
      setCategory(service.category || "")
      setDescription(service.serviceDescription || "")
      setLocation(service.serviceLocation || "")
      setPrice(service.servicePrice?.toString() || "")
      setStartDate(service.startDate ? new Date(service.startDate).toISOString().split('T')[0] : "")
      setEndDate(service.endDate ? new Date(service.endDate).toISOString().split('T')[0] : "")
      setIsPublished(service.status === "published")
      setClientCanChooseDate(service.bookDate || false)
      setServiceImage(service.serviceImage || "")
      setImagePreview(service.serviceImage || null)
      setError(null)
    } else if (!service && isOpen) {
      // Reset form for new service
      setServiceName("")
      setCategory("")
      setDescription("")
      setLocation("")
      setPrice("")
      setStartDate("")
      setEndDate("")
      setIsPublished(true)
      setClientCanChooseDate(true)
      setServiceImage("")
      setImagePreview(null)
      setError(null)
    }
  }, [service, isOpen])

  if (!isOpen) return null

  return (
    <>
      <style jsx>{`
        .modal-content::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
        <div className="bg-white shadow-xl max-w-4xl w-full mx-4" style={{ borderRadius: "10px" }}>
          {/* Header */}
          <div className="flex items-center justify-between pl-6 pr-6 pt-5 pb-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">{service ? "Edit service" : "Add a new service"}</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <RiCloseLine className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div
            className="p-6 space-y-5 overflow-y-auto modal-content"
            style={{
              maxHeight: "70vh",
              scrollbarWidth: "none",
              msOverflowStyle: "none"
            }}
          >
            {/* First Row: Service Name and Category */}
            <div className="grid grid-cols-2 gap-4">
              {/* Service Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service name
                </label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="Write Here..."
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ borderRadius: "4px" }}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    style={{ borderRadius: "4px" }}
                  >
                    <option value="">Select</option>
                    <option value="clubs">Clubs</option>
                    <option value="spa">Spa</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="activities">Activities</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write Here..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                style={{ borderRadius: "4px" }}
              />
            </div>

            {/* Third Row: 4 Input Fields */}
            <div className="grid grid-cols-4 gap-4">
              {/* Service Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Write Here..."
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ borderRadius: "4px" }}
                />
              </div>

              {/* Service Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service price
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Write Here..."
                    className="w-full px-3 py-2 pr-8 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ borderRadius: "4px" }}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                </div>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 pr-8 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ borderRadius: "4px" }}
                  />
                  <RiCalendarLine className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start end
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 pr-8 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ borderRadius: "4px" }}
                  />
                  <RiCalendarLine className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
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

            {/* Client Can Choose Book Date Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client can chose book date
              </label>
              <div className="flex items-center space-x-3">
                <span className={`text-sm ${!clientCanChooseDate ? 'text-gray-900' : 'text-gray-500'}`}>
                  Yes
                </span>
                <div
                  className="relative w-11 h-6 rounded-full transition-colors cursor-pointer"
                  style={{
                    backgroundColor: clientCanChooseDate ? "#50BE87" : "#E5E7EB"
                  }}
                  onClick={() => setClientCanChooseDate(!clientCanChooseDate)}
                >
                  <div
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform"
                    style={{
                      transform: clientCanChooseDate ? "translateX(24px)" : "translateX(4px)"
                    }}
                  />
                </div>
                <span className={`text-sm ${clientCanChooseDate ? 'text-gray-500' : 'text-gray-900'}`}>
                  No
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Service Image Upload */}
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
              <label className="text-sm font-medium text-gray-700">Service image</label>

              <div className="flex flex-col">
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
                          setServiceImage("")
                          uploadedImageUrlRef.current = ""
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        <RiCloseLine className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <label htmlFor="service-image-upload" className="cursor-pointer">
                        <RiImageLine className="w-8 h-8 text-gray-400 mb-2" />
                        <div className="text-center">
                          <span className="text-sm text-gray-600">Drag and drop your image here or </span>
                          <span className="text-sm text-blue-600 underline">choose file</span>
                        </div>
                      </label>
                      <input
                        id="service-image-upload"
                        type="file"
                        accept="image/*"
                        disabled={isUploadingImage}
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
                                folder: 'customized-services'
                              })

                              // Store Cloudinary URL in BOTH state AND ref
                              uploadedImageUrlRef.current = result.secure_url
                              setServiceImage(result.secure_url)
                              console.log('✅ Image uploaded to Cloudinary:', {
                                url: result.secure_url,
                                public_id: result.public_id
                              })
                            } catch (error: any) {
                              console.error('Error uploading image:', error)
                              setError(error.message || 'Failed to upload image. Please try again.')
                              setImagePreview(null)
                              setServiceImage("")
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
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-5 pb-5 pl-6 pr-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              style={{ borderRadius: "6px", background: "#FBFAFA" }}
            >
              Annuler
            </button>
            <button
              onClick={async () => {
                // Clear previous errors
                setError(null)

                // Validate required fields
                if (!serviceName.trim()) {
                  setError("Service name is required")
                  return
                }
                if (!category.trim()) {
                  setError("Category is required")
                  return
                }
                if (!description.trim()) {
                  setError("Service description is required")
                  return
                }
                if (!location.trim()) {
                  setError("Service location is required")
                  return
                }
                if (!price.trim() || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
                  setError("Service price is required and must be a valid number >= 0")
                  return
                }
                if (!startDate) {
                  setError("Start date is required")
                  return
                }
                if (!endDate) {
                  setError("End date is required")
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

                  // Use ref value if available (most recent upload), otherwise use state
                  const imageToSave = uploadedImageUrlRef.current || serviceImage

                  const requestBody = {
                    serviceName: serviceName.trim(),
                    category: category.trim(),
                    serviceDescription: description.trim(),
                    serviceLocation: location.trim(),
                    servicePrice: parseFloat(price),
                    startDate: startDate,
                    endDate: endDate,
                    status: isPublished ? 'published' : 'unpublished',
                    bookDate: clientCanChooseDate,
                    serviceImage: imageToSave,
                  }

                  const isEditMode = !!service
                  const url = isEditMode
                    ? `/api/partner/booking-settings/${service._id}`
                    : '/api/partner/booking-settings'
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
                    throw new Error(data.error || 'Failed to save service')
                  }

                  // Reset form only after successful save
                  setServiceName("")
                  setCategory("")
                  setDescription("")
                  setLocation("")
                  setPrice("")
                  setStartDate("")
                  setEndDate("")
                  setIsPublished(true)
                  setClientCanChooseDate(true)
                  setServiceImage("")
                  setImagePreview(null)
                  setError(null)

                  // Call success callback to refresh the list
                  if (onSuccess) {
                    onSuccess()
                  }

                  // Close modal after a short delay
                  setTimeout(() => {
                    onClose()
                  }, 300)
                } catch (err: any) {
                  console.error('Error saving service:', err)
                  setError(err.message || 'Failed to save service. Please try again.')
                } finally {
                  setIsLoading(false)
                }
              }}
              disabled={isLoading || isUploadingImage || !serviceName.trim() || !category.trim() || !description.trim() || !location.trim() || !price.trim() || !startDate || !endDate}
              className="px-4 py-2 text-white hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderRadius: "6px", background: "#1F2A44" }}
            >
              {isUploadingImage ? "Uploading Image..." : (isLoading ? (service ? "Updating..." : "Saving...") : (service ? "Update" : "Save"))}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
