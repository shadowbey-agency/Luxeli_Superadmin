"use client"

import { useState } from "react"

interface Staff {
  id: string
  name: string
  avatar?: string
  available: boolean
}

interface AssignStaffModalProps {
  isOpen: boolean
  onClose: () => void
  onAssign: (staffId: string) => void
}

const mockStaff: Staff[] = [
  { id: "1", name: "Full name", available: false },
  { id: "2", name: "Full name", available: true },
  { id: "3", name: "Full name", available: true },
  { id: "4", name: "Full name", available: true },
  { id: "5", name: "Full name", available: true },
  { id: "6", name: "Full name", available: true },
  { id: "7", name: "Full name", available: false },
  { id: "8", name: "Full name", available: true },
]

export default function   AssignStaffModal({ isOpen, onClose, onAssign }: AssignStaffModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStaff, setSelectedStaff] = useState<string>("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  if (!isOpen) return null

  const filteredStaff = mockStaff.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAssign = () => {
    if (selectedStaff) {
      onAssign(selectedStaff)
      onClose()
    }
  }

  const handleSelectStaff = (staff: Staff) => {
    setSelectedStaff(staff.id)
    setSearchTerm(staff.name)
    setIsDropdownOpen(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white shadow-xl w-full max-w-md mx-4" style={{ borderRadius: "10px" }}>
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-black/8">
          <h2 className="text-lg font-semibold text-black">Assign to staff</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 relative">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Staff</label>
            
            {/* Search/Dropdown Input */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setIsDropdownOpen(true)
                }}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder="Full Name"
                className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
                style={{ borderRadius: "4px" }}
              />
              
              {/* Dropdown Arrow */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : 'rotate-0'
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Dropdown List */}
            {isDropdownOpen && (
              <div 
                className="w-full bg-white border border-gray-200 shadow-lg overflow-y-auto"
                style={{ 
                  borderRadius: "10px",
                  maxHeight: "250px"
                }}
              >
                {filteredStaff.length > 0 ? (
                  filteredStaff.map((staff) => (
                    <button
                      key={staff.id}
                      onClick={() => handleSelectStaff(staff)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-900">{staff.name}</span>
                      </div>
                      
                      {/* Availability Status */}
                      <span
                        className={`text-xs font-medium ${
                          staff.available ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {staff.available ? "Available" : "Unavailable"}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500 text-center">
                    No staff found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-5 border-t border-black/8 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-[#CED4DA] bg-white text-black text-sm font-semibold hover:bg-gray-50 transition-colors"
            style={{ borderRadius: "6px" }}
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedStaff}
            className={`px-5 py-2 text-white text-sm font-semibold transition-colors ${
              selectedStaff
                ? "bg-[#1F2A44] hover:bg-[#1F2A44]/90"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            style={{ borderRadius: "6px" }}
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  )
}

