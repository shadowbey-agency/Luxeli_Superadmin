"use client"

import { useState, useEffect } from "react"
import { RiCloseLine, RiImageLine } from "react-icons/ri"
import { getAuthToken } from "@/lib/auth-utils"

interface RestaurantItem {
  itemName: string
  status: "published" | "unpublished"
  category: string
  itemPrice: number
  itemDescription: string
  itemImage?: string
}

interface AddRestaurantItemModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  restaurantId: string
  item?: RestaurantItem | null // Item to edit (null for new item)
  itemIndex?: number // Index of item in restaurant.items array (for editing)
}

export default function AddRestaurantItemModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  restaurantId,
  item,
  itemIndex 
}: AddRestaurantItemModalProps) {
  const [itemName, setItemName] = useState("")
  const [isPublished, setIsPublished] = useState(true)
  const [category, setCategory] = useState("")
  const [itemPrice, setItemPrice] = useState<string>("")
  const [itemDescription, setItemDescription] = useState("")
  const [itemImage, setItemImage] = useState<string>("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Pre-fill form when editing an item
  useEffect(() => {
    if (item && isOpen) {
      setItemName(item.itemName || "")
      setIsPublished(item.status === "published")
      setCategory(item.category || "")
      setItemPrice(item.itemPrice?.toString() || "")
      setItemDescription(item.itemDescription || "")
      setItemImage(item.itemImage || "")
      setImagePreview(item.itemImage || null)
      setError(null)
      setSuccessMessage(null)
    } else if (!item && isOpen) {
      // Reset form for new item
      setItemName("")
      setIsPublished(true)
      setCategory("")
      setItemPrice("")
      setItemDescription("")
      setItemImage("")
      setImagePreview(null)
      setError(null)
      setSuccessMessage(null)
    }
  }, [item, isOpen])

  if (!isOpen) return null

  const handleClose = () => {
    setItemName("")
    setIsPublished(true)
    setCategory("")
    setItemPrice("")
    setItemDescription("")
    setItemImage("")
    setImagePreview(null)
    setError(null)
    setSuccessMessage(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
       <div className="bg-white shadow-xl max-w-3xl w-full mx-4" style={{ borderRadius: "10px" }}>
        {/* Header */}
        <div className="flex items-center justify-between pl-6 pr-6 pt-5 pb-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{item ? "Edit item" : "Add new item"}</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <RiCloseLine className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Row 1: Item Name, Status, Category */}
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

          {/* Row 2: Category and Item Price */}
          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#212121" }}>
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Write Here..."
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-transparent"
                style={{ borderRadius: "4px" }}
              />
            </div>

            {/* Item Price */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#212121" }}>
                Item price
              </label>
              <input
                type="number"
                value={itemPrice}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
                    setItemPrice(value)
                  }
                }}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-transparent"
                style={{ borderRadius: "4px" }}
              />
            </div>
          </div>

          {/* Row 3: Item Description */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#212121" }}>
              Item description
            </label>
            <textarea
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              placeholder="Write Here..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-transparent resize-none"
              style={{ borderRadius: "4px" }}
            />
          </div>

          {/* Row 4: Item Image Upload */}
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
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <RiCloseLine className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <label htmlFor="item-image-upload" className="cursor-pointer">
                      <RiImageLine className="w-8 h-8 text-gray-400 mb-2" />
                      <div className="text-center">
                        <span className="text-sm text-gray-600">Drag and drop your image here or </span>
                        <span className="text-sm text-blue-600 underline">choose file</span>
                      </div>
                    </label>
                    <input
                      id="item-image-upload"
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
                            setItemImage(result) // Store as base64
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
               if (!itemPrice.trim() || isNaN(Number(itemPrice)) || Number(itemPrice) < 0) {
                 setError("Item price must be a valid positive number")
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
                 const requestBody = {
                   itemName: itemName.trim(),
                   status: isPublished ? 'published' : 'unpublished',
                   category: category.trim(),
                   itemPrice: Number(itemPrice),
                   itemDescription: itemDescription.trim(),
                   ...(itemImage && { itemImage }),
                 }

                 const isEditMode = !!item && itemIndex !== undefined
                 let url = ''
                 let method = ''

                 if (isEditMode) {
                   // Update existing item
                   url = `/api/partner/restaurants/${restaurantId}/items/${itemIndex}`
                   method = 'PATCH'
                 } else {
                   // Add new item
                   url = `/api/partner/restaurants/${restaurantId}/items`
                   method = 'POST'
                 }

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
                   throw new Error(data.error || 'Failed to save item')
                 }

                 // Show success message
                 const message = isEditMode ? 'Item updated successfully!' : 'Item created successfully!'
                 setSuccessMessage(message)
                 setError(null)

                 // Reset form only after successful save
                 setItemName("")
                 setIsPublished(true)
                 setCategory("")
                 setItemPrice("")
                 setItemDescription("")
                 setItemImage("")
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
                 console.error('Error saving item:', err)
                 setError(err.message || 'Failed to save item. Please try again.')
               } finally {
                 setIsLoading(false)
               }
             }}
             disabled={isLoading || !itemName.trim() || !category.trim() || !itemPrice.trim() || !itemDescription.trim()}
             className="px-4 py-2 text-white hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
             style={{ borderRadius: "6px", background: "#1F2A44" }}
           >
             {isLoading ? (item ? "Updating..." : "Saving...") : (item ? "Update" : "Save")}
           </button>
        </div>
      </div>
    </div>
  )
}


























