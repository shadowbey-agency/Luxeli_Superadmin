"use client"

import { useState } from "react"
import { DashboardIcon, SupportIcon, ServicesIcon, BillingFinanceIcon } from "./icons"

interface TeamMember {
  id: string
  name: string
  email: string
  phone: string
  dateAdded: string
  isActive: boolean
  avatar: string
}

interface EditPermissionsModalProps {
  member: TeamMember | null
  isOpen: boolean
  onClose: () => void
  onSave: (permissions: string[]) => void
  showBackButton?: boolean
  onBack?: () => void
}

const availablePermissions = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    id: "support",
    name: "Support",
    icon: <SupportIcon />,
  },
  {
    id: "services",
    name: "Services",
    icon: <ServicesIcon />,
  },
  {
    id: "billing",
    name: "Billing & Finance",
    icon: <BillingFinanceIcon />,
  },
]

export default function EditPermissionsModal({ member, isOpen, onClose, onSave, showBackButton = false, onBack }: EditPermissionsModalProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(["dashboard", "support"])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  if (!isOpen || !member) return null

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId) 
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    )
    setIsDropdownOpen(false) // Close dropdown after selection
  }

  const handleRemovePermission = (permissionId: string) => {
    setSelectedPermissions(prev => prev.filter(id => id !== permissionId))
  }

  const handleSave = () => {
    onSave(selectedPermissions)
    if (showBackButton && onBack) {
      onBack()
    } else {
    onClose()
    }
  }

  const getPermissionName = (id: string) => {
    return availablePermissions.find(p => p.id === id)?.name || id
  }

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-80 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
      <div 
        className="bg-white flex flex-col items-start rounded-[10px]"
        style={{
          display: "flex",
          width: "509px",
          flexDirection: "column",
          alignItems: "flex-start",
          borderRadius: "10px",
          background: "#FFF"
        }}
      >
        {/* Header Section */}
        <div 
          className="flex justify-between items-center w-full"
          style={{
            display: "flex",
            padding: "20px 16px",
            justifyContent: "space-between",
            alignItems: "center",
            alignSelf: "stretch",
            borderRadius: "10px 10px 0 0",
            borderBottom: "1px solid rgba(0, 0, 0, 0.04)",
            background: "#FFF"
          }}
        >
          <div className="flex items-center gap-3">
            {/* {showBackButton && onBack && (
              <button
                onClick={onBack}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )} */}
          <h2 
            className="text-xl font-semibold"
            style={{
              color: "#000",
              fontSize: "20px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "normal"
            }}
          >
            Edit permissions
          </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Section */}
        <div 
          className="flex flex-col w-full"
          style={{
            display: "flex",
            padding: "20px 16px",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "10px",
            alignSelf: "stretch",
            borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
            background: "#FFF"
          }}
        >
          {/* Permissions Label */}
          <label 
            className="block w-full"
            style={{
              color: "#212121",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "normal",
              alignSelf: "stretch"
            }}
          >
            Permissions
          </label>

          {/* Dropdown Field */}
          <div className="relative w-full">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex justify-between items-center"
              style={{
                display: "flex",
                padding: "7.52px 12px",
                flexDirection: "column",
                alignItems: "flex-start",
                alignSelf: "stretch",
                borderRadius: "4px",
                border: "1px solid #CED4DA",
                background: "#FFF",
                minHeight: "40px"
              }}
            >
              <span className="text-gray-500">Select</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="10" 
                height="6" 
                viewBox="0 0 10 6" 
                fill="none"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <path 
                  d="M1 1.26953L5 5.26953L9 1.26953" 
                  stroke="#212121" 
                  strokeOpacity="0.6" 
                  strokeWidth="1" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Dropdown Options */}
            {isDropdownOpen && (
              <div 
                className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border rounded-md shadow-lg"
                style={{
                  border: "1px solid #CED4DA",
                  borderRadius: "4px",
                  background: "#FFF"
                }}
              >
                {availablePermissions.map((permission) => (
                  <button
                    key={permission.id}
                    onClick={() => handlePermissionToggle(permission.id)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 text-left"
                    style={{
                      display: "flex",
                      padding: "8px 12px",
                      alignItems: "center",
                      gap: "8px",
                      alignSelf: "stretch"
                    }}
                  >
                    <div className="flex justify-center items-center flex-shrink-0">
                      {permission.icon}
                    </div>
                    <span className="text-sm">{permission.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Permissions Chips */}
          {selectedPermissions.length > 0 && (
            <div className="flex flex-wrap gap-2 w-full">
              {selectedPermissions.map((permissionId) => (
                <div
                  key={permissionId}
                  className="flex items-center"
                  style={{
                    display: "flex",
                    height: "30px",
                    paddingRight: "10px",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "5px",
                    borderRadius: "6px",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    background: "#FBFAFA"
                  }}
                >
                  {/* X Box - Left Side */}
                  <div
                    className="flex items-center justify-center cursor-pointer"
                    style={{
                      display: "flex",
                      height: "100%",
                      padding: "10px 6px",
                      alignItems: "center",
                      gap: "10px",
                      background: "var(--Foundation-Blue-Light, #E9EAEC)"
                    }}
                    onClick={() => handleRemovePermission(permissionId)}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="14" 
                      height="14" 
                      viewBox="0 0 14 14" 
                      fill="none"
                    >
                      <path 
                        d="M10.0392 3.68457L3.34668 10.3771M3.34668 3.68457L10.0392 10.3771" 
                        stroke="#1F2A44" 
                        strokeWidth="1.11542" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  {/* Permission Name - Right Side */}
                  <div
                    className="flex items-center justify-center"
                    style={{
                      display: "flex",
                      padding: "0 8px",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <span 
                      style={{
                        color: "#000",
                        fontSize: "12px",
                        fontStyle: "normal",
                        fontWeight: 500,
                        lineHeight: "normal"
                      }}
                    >
                      {getPermissionName(permissionId)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Section */}
        <div 
          className="flex justify-end items-center w-full"
          style={{
            display: "flex",
            padding: "20px 16px",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "10px",
            alignSelf: "stretch",
            borderRadius: "0 0 10px 10px",
            borderTop: "1px solid rgba(0, 0, 0, 0.04)",
            background: "#FFF"
          }}
        >
          <button
            onClick={() => {
              if (showBackButton && onBack) {
                onBack()
              } else {
                onClose()
              }
            }}
            className="flex justify-center items-center px-4 py-2 rounded-md border"
            style={{
              padding: "8.52px 10px",
              borderRadius: "6px",
              background: "#FBFAFA",
              border: "1px solid #CED4DA",
              color: "#000",
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: "19.5px"
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex justify-center items-center px-4 py-2 rounded-md text-white"
            style={{
              padding: "8.52px 10px",
              borderRadius: "6px",
              border: "1px solid var(--primary, #1F2A44)",
              background: "var(--Foundation-Blue-Normal, #1F2A44)",
              color: "#FFF",
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: "19.5px"
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

