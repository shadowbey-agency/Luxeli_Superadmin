"use client"

import { useState } from "react"
import { RiCloseLine, RiImageLine, RiFileUploadLine } from "react-icons/ri"

interface AddItemModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddItemModal({ isOpen, onClose }: AddItemModalProps) {
  const [itemName, setItemName] = useState("")
  const [category, setCategory] = useState("")
  const [isPublished, setIsPublished] = useState(true)
  const [description, setDescription] = useState("")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
       <div className="bg-white shadow-xl max-w-3xl w-full mx-4" style={{ borderRadius: "10px" }}>
        {/* Header */}
        <div className="flex items-center justify-between pl-6 pr-6 pt-5 pb-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add a new item</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <RiCloseLine className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Section 1: Item Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {/* Item Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item name
                </label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
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
                    <option value="pillows">Pillows</option>
                    <option value="kitchen">Kitchen</option>
                    <option value="cleaning">Cleaning</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

               {/* Status Toggle */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
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

          {/* Section 2: Item Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write Here..."
              rows={4}
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
            <label className="text-sm font-medium text-gray-700">Item image</label>
            
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
             onClick={() => {
               // Handle save logic here
               onClose()
             }}
             className="px-4 py-2 text-white hover:opacity-90 transition-colors"
             style={{ borderRadius: "6px", background: "#1F2A44" }}
           >
             Save
           </button>
        </div>
      </div>
    </div>
  )
}
