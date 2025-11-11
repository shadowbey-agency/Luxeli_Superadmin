"use client"

import { useState, useEffect } from "react"
import { RiCloseLine } from "react-icons/ri"
import PublicIcon from "./public-icon"

interface PermissionDetailModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (checkedItems: { [key: string]: boolean }) => void
  permissionKey: string
  permissionLabel: string
  iconSrc?: string
  options: { key: string; label: string; hasSubOptions?: boolean; subSubOptions?: { key: string; label: string }[] }[]
  initialCheckedItems?: { [key: string]: boolean }
}

export default function PermissionDetailModal({
  isOpen,
  onClose,
  onSave,
  permissionKey,
  permissionLabel,
  iconSrc,
  options,
  initialCheckedItems
}: PermissionDetailModalProps) {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    if (isOpen) {
      // Initialize with existing checked items or default to unchecked
      const initial: { [key: string]: boolean } = {}
      options.forEach(option => {
        initial[option.key] = initialCheckedItems?.[option.key] || false
        // Initialize nested sub-options if they exist
        if (option.hasSubOptions && option.subSubOptions) {
          option.subSubOptions.forEach(subOption => {
            initial[subOption.key] = initialCheckedItems?.[subOption.key] || false
          })
        }
      })
      setCheckedItems(initial)
    }
  }, [isOpen, options, initialCheckedItems])

  const handleCheckboxChange = (key: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSave = () => {
    onSave(checkedItems)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
      <div className="bg-white shadow-xl mx-4" style={{ borderRadius: "10px", width: "550px", maxWidth: "550px" }}>
        {/* Header */}
        <div className="border-b border-gray-200" style={{ padding: "20px 16px" }}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold" style={{ color: "#000000" }}>{permissionLabel} permissions</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <RiCloseLine className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          <p className="text-sm" style={{ color: "#535862" }}>
            Select the specific access rights you want to grant to this member
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: "20px 16px" }}>
          <div className="space-y-1">
            {options.map((option) => (
              <div key={option.key}>
                <label
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <div 
                    className="relative flex items-center justify-center cursor-pointer"
                    style={{ width: "16px", height: "16px" }}
                  >
                    <PublicIcon 
                      src="/assets/icons/_Checkbox base.svg" 
                      alt="checkbox" 
                      width={16} 
                      height={16} 
                    />
                    {checkedItems[option.key] && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        style={{ 
                          background: "#1F2A44",
                          borderRadius: "2px"
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M10 3L4.5 8.5L2 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    checked={checkedItems[option.key] || false}
                    onChange={() => handleCheckboxChange(option.key)}
                    className="hidden"
                  />
                  <span className="text-sm" style={{ color: "#525866" }}>{option.label}</span>
                </label>
                {/* Nested sub-options */}
                {option.hasSubOptions && option.subSubOptions && checkedItems[option.key] && (
                  <div className="ml-8 space-y-1">
                    {option.subSubOptions.map((subOption, subIndex) => (
                      <div key={subOption.key}>
                        <label
                          className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                        >
                          <div 
                            className="relative flex items-center justify-center cursor-pointer"
                            style={{ width: "16px", height: "16px" }}
                          >
                            <PublicIcon 
                              src="/assets/icons/_Checkbox base.svg" 
                              alt="checkbox" 
                              width={16} 
                              height={16} 
                            />
                            {checkedItems[subOption.key] && (
                              <div 
                                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                style={{ 
                                  background: "#1F2A44",
                                  borderRadius: "2px"
                                }}
                              >
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                  <path d="M10 3L4.5 8.5L2 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                            )}
                          </div>
                          <input
                            type="checkbox"
                            checked={checkedItems[subOption.key] || false}
                            onChange={() => handleCheckboxChange(subOption.key)}
                            className="hidden"
                          />
                          <span className="text-sm" style={{ color: "#525866" }}>{subOption.label}</span>
                        </label>
                        {/* Border after last sub-option */}
                        {option.subSubOptions && subIndex === option.subSubOptions.length - 1 && (
                          <div 
                            style={{
                              width: "40%",
                              paddingBottom: "12px",
                              borderBottom: "1px solid #0000001F"
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200" style={{ padding: "20px 16px" }}>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
            style={{ borderRadius: "6px", background: "#FBFAFA" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
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

