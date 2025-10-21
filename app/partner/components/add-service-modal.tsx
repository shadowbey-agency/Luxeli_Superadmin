"use client"

import { useState } from "react"
import { RiCloseLine, RiImageLine, RiCalendarLine } from "react-icons/ri"

interface AddServiceModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddServiceModal({ isOpen, onClose }: AddServiceModalProps) {
  const [serviceName, setServiceName] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [price, setPrice] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isPublished, setIsPublished] = useState(true)
  const [clientCanChooseDate, setClientCanChooseDate] = useState(true)

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
          <h2 className="text-xl font-semibold text-gray-900">Add a new service</h2>
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
              console.log({
                serviceName,
                category,
                description,
                location,
                price,
                startDate,
                endDate,
                isPublished,
                clientCanChooseDate
              })
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
    </>
  )
}
