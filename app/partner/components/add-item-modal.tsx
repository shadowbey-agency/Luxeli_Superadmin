"use client"

import { useState, useEffect, useRef } from "react"
import { RiCloseLine, RiImageLine, RiArrowDownSLine } from "react-icons/ri"
import { getAuthToken } from "@/lib/auth-utils"
import { uploadImageToCloudinary } from "@/lib/cloudinary"

interface RequestItem {
  _id: string
  name: string
  category: string
  status: "published" | "unpublished"
  description: string
  image?: string
  createdAt?: string
  updatedAt?: string
}

interface AddItemModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  item?: RequestItem | null // Item to edit (null for new item)
}

export default function AddItemModal({ isOpen, onClose, onSuccess, item }: AddItemModalProps) {
  const [itemName, setItemName] = useState("")
  const [isPublished, setIsPublished] = useState(true)
  const [category, setCategory] = useState("")
  const [itemDescription, setItemDescription] = useState("")
  const [itemImage, setItemImage] = useState<string>("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Use ref to store uploaded image URL immediately (not async like state)
  const uploadedImageUrlRef = useRef<string>("")

  // Pre-fill form when editing an item
  useEffect(() => {
    if (item && isOpen) {
      setItemName(item.name || "")
      setIsPublished(item.status === "published")
      setCategory(item.category || "")
      setItemDescription(item.description || "")
      setItemImage(item.image || "")
      setImagePreview(item.image || null)
      setError(null)
    } else if (!item && isOpen) {
      // Reset form for new item
      setItemName("")
      setIsPublished(true)
      setCategory("")
      setItemDescription("")
      setItemImage("")
      setImagePreview(null)
      setError(null)
    }
  }, [item, isOpen])

  const handleClose = () => {
    setItemName("")
    setIsPublished(true)
    setCategory("")
    setItemDescription("")
    setItemImage("")
    setImagePreview(null)
    setError(null)
    uploadedImageUrlRef.current = "" // Reset ref too
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
      <div className="bg-white shadow-xl max-w-3xl w-full mx-4" style={{ borderRadius: "10px" }}>
        {/* Header */}
        <div className="flex items-center justify-between pl-6 pr-6 pt-5 pb-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{item ? "Edit item" : "Add new items"}</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <RiCloseLine className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Section 1: Item Details */}
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              {/* Item Name */}
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1" style={{ color: "#212121" }}>
                  Item name
                </label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
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
                  <span className={`text-sm ${isPublished ? 'text-gray-500' : 'text-gray-900'}`}>
                    Published
                  </span>
                  <div
                    className="relative w-11 h-6 rounded-full transition-colors cursor-pointer"
                    style={{
                      backgroundColor: isPublished ? "#E5E7EB" : "#50BE87"
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
                  <span className={`text-sm ${isPublished ? 'text-gray-900' : 'text-gray-500'}`}>
                    Unpublished
                  </span>
                </div>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#212121" }}>
                Category
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 pr-8 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  style={{ borderRadius: "4px" }}
                >
                  <option value="">Select</option>
                  <option value="Pillows">Pillows</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Cleaning">Cleaning</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <RiArrowDownSLine className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Item Description */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#212121" }}>
              Item description
            </label>
            <textarea
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              placeholder="Write Here..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              style={{ borderRadius: "4px" }}
            />
          </div>

          {/* Section 3: Item Image Upload */}
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
            <label className="text-sm font-medium" style={{ color: "#212121" }}>Item image</label>

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
                        setItemImage("")
                        uploadedImageUrlRef.current = ""
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <RiCloseLine className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <RiImageLine className="w-8 h-8 text-gray-400 mb-2" />
                      <div className="text-center">
                        <span className="text-sm text-gray-600">Drag and drop your image here or </span>
                        <span className="text-sm text-blue-600 underline">choose file</span>
                      </div>
                    </label>
                    <input
                      id="image-upload"
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
                              folder: 'requests-management'
                            })

                            // Store Cloudinary URL in BOTH state AND ref
                            // Ref is immediate, state is async
                            console.log('🔧 About to set itemImage state:', {
                              secure_url: result.secure_url,
                              public_id: result.public_id
                            })

                            // Store in ref IMMEDIATELY (synchronous)
                            uploadedImageUrlRef.current = result.secure_url

                            // Also update state (asynchronous, for UI display)
                            setItemImage(result.secure_url)

                            console.log('✅ Image uploaded to Cloudinary:', {
                              url: result.secure_url,
                              public_id: result.public_id,
                              storedInRef: uploadedImageUrlRef.current
                            })
                          } catch (error: any) {
                            console.error('Error uploading image:', error)
                            setError(error.message || 'Failed to upload image. Please try again.')
                            setImagePreview(null)
                            setItemImage("")
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
            onClick={handleClose}
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
              if (!itemName.trim()) {
                setError("Item name is required")
                return
              }
              if (!category.trim()) {
                setError("Category is required")
                return
              }
              if (!itemDescription.trim()) {
                setError("Item description is required")
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
                console.log('🔍 Current itemImage state value:', {
                  state: itemImage,
                  ref: uploadedImageUrlRef.current,
                  type: typeof itemImage,
                  isEmpty: !itemImage,
                })

                // Use ref value if available (most recent upload), otherwise use state
                const imageToSave = uploadedImageUrlRef.current || itemImage

                const requestBody = {
                  name: itemName.trim(),
                  category: category.trim(),
                  status: isPublished ? 'published' : 'unpublished',
                  description: itemDescription.trim(),
                  image: imageToSave,
                }

                console.log('📝 Saving item with data:', {
                  name: itemName.trim(),
                  category: category.trim(),
                  status: isPublished ? 'published' : 'unpublished',
                  description: itemDescription.trim(),
                  imageUrl: imageToSave || 'NO IMAGE PROVIDED',
                  imageLength: imageToSave ? imageToSave.length : 0,
                  hasImageInBody: !!requestBody.image
                })

                console.log('📦 Full request body:', requestBody)

                const isEditMode = !!item
                const url = isEditMode
                  ? `/api/partner/requests-management/${item._id}`
                  : '/api/partner/requests-management'
                const method = isEditMode ? 'PATCH' : 'POST'

                console.log('🚀 Making API request:', {
                  url,
                  method,
                  isEditMode,
                  hasImage: !!itemImage,
                  imageUrl: itemImage ? itemImage.substring(0, 80) + '...' : 'none'
                })

                const response = await fetch(url, {
                  method,
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify(requestBody),
                })

                console.log('Raw response:', {
                  status: response.status,
                  statusText: response.statusText,
                  ok: response.ok,
                  headers: Object.fromEntries(response.headers.entries())
                })

                // Check if response is ok before parsing
                let data;
                try {
                  const text = await response.text()
                  console.log('Response text:', text)
                  data = text ? JSON.parse(text) : {}
                } catch (parseError) {
                  console.error('Failed to parse response as JSON:', parseError)
                  throw new Error('Invalid response from server')
                }

                console.log('Parsed response data:', data)

                // Check if response is successful
                if (!response.ok) {
                  const errorMessage = data.error || data.message || `HTTP ${response.status}: ${response.statusText}` || 'Failed to create item'
                  console.error('Save Item Error (HTTP):', {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorMessage,
                    fullData: data
                  })
                  throw new Error(errorMessage)
                }

                // Check if API returned success
                if (!data.success) {
                  const errorMessage = data.error || data.message || 'Failed to create item'
                  console.error('Save Item Error (API):', {
                    success: data.success,
                    error: errorMessage,
                    fullData: data
                  })
                  throw new Error(errorMessage)
                }

                console.log('✅ Item saved successfully:', data)

                // Verify data was returned and check if image was saved
                if (!data.data || !data.data.request) {
                  console.warn('Save Item Warning: Response missing data.request, but success is true')
                  // Still proceed as the item might have been saved
                } else {
                  console.log('🔍 Saved item data from response:', {
                    _id: data.data.request._id,
                    name: data.data.request.name,
                    image: data.data.request.image,
                    imageUrl: data.data.request.image ? data.data.request.image.substring(0, 80) + '...' : 'NO IMAGE IN DB',
                    hasImage: !!data.data.request.image
                  })
                }

                // Reset form only after successful save
                setItemName("")
                setIsPublished(true)
                setCategory("")
                setItemDescription("")
                setItemImage("")
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
                console.error('❌ Error creating item:', {
                  error: err,
                  message: err.message,
                  stack: err.stack,
                  name: err.name
                })
                const errorMessage = err.message || 'Failed to create item. Please try again.'
                setError(errorMessage)
                // Keep form data so user can retry
              } finally {
                setIsLoading(false)
              }
            }}
            disabled={isLoading || isUploadingImage || !itemName.trim() || !category.trim() || !itemDescription.trim()}
            className="px-4 py-2 text-white hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ borderRadius: "6px", background: "#1F2A44" }}
          >
            {isUploadingImage ? "Uploading Image..." : (isLoading ? (item ? "Updating..." : "Saving...") : (item ? "Update" : "Save"))}
          </button>
        </div>
      </div>
    </div>
  )
}