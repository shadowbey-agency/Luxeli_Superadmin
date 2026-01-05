"use client"

import { useState, useEffect, useRef } from "react"
import { RiCloseLine, RiImageLine } from "react-icons/ri"
import { getAuthToken } from "@/lib/auth-utils"
import PublicIcon from "./public-icon"
import PermissionDetailModal from "./permission-detail-modal"
import AlertDialog from "./alert-dialog"

interface AddMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function AddMemberModal({ isOpen, onClose, onSuccess }: AddMemberModalProps) {
  const [memberName, setMemberName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPermissions, setSelectedPermissions] = useState<{ [key: string]: any }>({})
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const [selectedPermissionKey, setSelectedPermissionKey] = useState<string>("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  // Alert dialog state
  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    variant: "success" | "error" | "warning" | "info"
  }>({
    isOpen: false,
    title: "",
    message: "",
    variant: "info"
  })

  const showAlert = (title: string, message: string, variant: "success" | "error" | "warning" | "info" = "info") => {
    setAlertDialog({ isOpen: true, title, message, variant })
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  const handleSubmit = async () => {
    if (!memberName || !email || !phoneNumber || !username || !password) {
      showAlert('Validation Error', 'Please fill in all required fields', 'warning')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      showAlert('Validation Error', 'Please enter a valid email address', 'warning')
      return
    }

    // Validate password strength
    if (password.length < 6) {
      showAlert('Validation Error', 'Password must be at least 6 characters long', 'warning')
      return
    }

    setIsLoading(true)
    try {
      const token = getAuthToken()
      if (!token) {
        showAlert('Authentication Required', 'Please log in to add a member', 'warning')
        setIsLoading(false)
        return
      }

      // Build permissions structure from selectedPermissions
      const permissions = {
        dashboard: selectedPermissions.dashboard || false,
        room: selectedPermissions.room || {
          rooms: false,
          requests: false
        },
        support: selectedPermissions.support || {
          myTickets: false,
          ticketSaved: false
        },
        team: selectedPermissions.team || {
          members: false,
          staff: false
        },
        housekeeping: selectedPermissions.housekeeping || {
          requests: false,
          houseCleaning: false,
          requestManagement: false
        },
        booking: selectedPermissions.booking || {
          internalRequests: {
            allCategories: false,
            categoryName: false
          },
          bookingSetting: false
        },
        activityAlert: selectedPermissions.activityAlert || {
          requests: false,
          activities: false
        },
        laundry: selectedPermissions.laundry || {
          requests: false,
          setting: false
        },
        inRoomDelivery: selectedPermissions.inRoomDelivery || {
          requests: false,
          restaurantName: false,
          restaurantSetting: false
        }
      }

      const response = await fetch('/api/partner/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          memberName,
          email,
          phoneNumber,
          username,
          password,
          permissions: permissions
        })
      })

      const result = await response.json()
      if (response.ok && result.success) {
        // Reset form
        setMemberName("")
        setEmail("")
        setPhoneNumber("")
        setUsername("")
        setPassword("")
        setSelectedPermissions({})
        
        // Close modal first
        onClose()
        
        // Refresh list
        if (onSuccess) {
          onSuccess()
        }
        
        // Show success alert
        showAlert('Success', 'Member added successfully', 'success')
      } else {
        showAlert('Error', result.error || 'Failed to add member', 'error')
      }
    } catch (error) {
      console.error('Error adding member:', error)
      showAlert('Error', 'Failed to add member. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const permissionOptions = [
    { key: "dashboard", label: "Dashboard", icon: "/assets/icons/dashboard.svg", hasSubPermissions: false },
    { key: "room", label: "Rooms", icon: "/assets/icons/bed-bunk.svg", hasSubPermissions: true, subOptions: [
      { key: "rooms", label: "Rooms" },
      { key: "requests", label: "Requests" }
    ]},
    { key: "support", label: "Support", icon: "/assets/icons/support.svg", hasSubPermissions: true, subOptions: [
      { key: "myTickets", label: "My Tickets" },
      { key: "ticketSaved", label: "Ticket Saved" }
    ]},
    { key: "team", label: "Team", icon: "/assets/icons/team.svg", hasSubPermissions: true, subOptions: [
      { key: "members", label: "Members" },
      { key: "staff", label: "Staff" }
    ]},
    { key: "housekeeping", label: "Housekeeping", icon: "/assets/icons/housekeeping.svg", hasSubPermissions: true, subOptions: [
      { key: "requests", label: "Requests" },
      { key: "houseCleaning", label: "House Cleaning" },
      { key: "requestManagement", label: "Request Management" }
    ]},
    { key: "booking", label: "Bookings interns", icon: "/assets/icons/calendar.svg", hasSubPermissions: true, subOptions: [
      { key: "requests", label: "Requests", hasSubOptions: true, subSubOptions: [
        { key: "allCategories", label: "All categories" },
        { key: "categoryName", label: "Category name" }
      ]},
      { key: "bookingSetting", label: "Bookings setting" }
    ]},
    { key: "activityAlert", label: "Activity alerts", icon: "/assets/icons/activity alert.svg", hasSubPermissions: true, subOptions: [
      { key: "requests", label: "Requests" },
      { key: "activities", label: "Activities" }
    ]},
    { key: "laundry", label: "Laundry", icon: "/assets/icons/laundary.svg", hasSubPermissions: true, subOptions: [
      { key: "requests", label: "Requests" },
      { key: "setting", label: "Laundry Settings" }
    ]},
    { key: "inRoomDelivery", label: "In-room delivery", icon: "/assets/icons/in-room delivery.svg", hasSubPermissions: true, subOptions: [
      { key: "requests", label: "Requests", hasSubOptions: true, subSubOptions: [
        { key: "restaurantName", label: "Restaurant name" }
      ]},
      { key: "restaurantSetting", label: "Restaurants settings" }
    ]}
  ]

  const handlePermissionSelect = (permissionKey: string) => {
    const permission = permissionOptions.find(p => p.key === permissionKey)
    if (!permission) return

    if (permission.hasSubPermissions && permission.subOptions) {
      // Open modal for sub-permissions
      setSelectedPermissionKey(permissionKey)
      setShowPermissionModal(true)
    } else {
      // Toggle simple permission (like dashboard)
      setSelectedPermissions(prev => ({
        ...prev,
        [permissionKey]: !prev[permissionKey]
      }))
    }
    setIsDropdownOpen(false)
  }

  const handlePermissionModalSave = (checkedItems: { [key: string]: boolean }) => {
    setSelectedPermissions(prev => {
      const newPerms = { ...prev }
      if (selectedPermissionKey === "room") {
        newPerms.room = {
          rooms: checkedItems.rooms || false,
          requests: checkedItems.requests || false
        }
      } else if (selectedPermissionKey === "support") {
        newPerms.support = {
          myTickets: checkedItems.myTickets || false,
          ticketSaved: checkedItems.ticketSaved || false
        }
      } else if (selectedPermissionKey === "team") {
        newPerms.team = {
          members: checkedItems.members || false,
          staff: checkedItems.staff || false
        }
      } else if (selectedPermissionKey === "housekeeping") {
        newPerms.housekeeping = {
          requests: checkedItems.requests || false,
          houseCleaning: checkedItems.houseCleaning || false,
          requestManagement: checkedItems.requestManagement || false
        }
      } else if (selectedPermissionKey === "booking") {
        newPerms.booking = {
          internalRequests: {
            allCategories: checkedItems.allCategories || false,
            categoryName: checkedItems.categoryName || false
          },
          bookingSetting: checkedItems.bookingSetting || false
        }
        // Also set requests flag if any sub-option is checked
        if (checkedItems.allCategories || checkedItems.categoryName) {
          newPerms.booking.internalRequests = {
            allCategories: checkedItems.allCategories || false,
            categoryName: checkedItems.categoryName || false
          }
        }
      } else if (selectedPermissionKey === "activityAlert") {
        newPerms.activityAlert = {
          requests: checkedItems.requests || false,
          activities: checkedItems.activities || false
        }
      } else if (selectedPermissionKey === "laundry") {
        newPerms.laundry = {
          requests: checkedItems.requests || false,
          setting: checkedItems.setting || false
        }
      } else if (selectedPermissionKey === "inRoomDelivery") {
        newPerms.inRoomDelivery = {
          requests: checkedItems.requests || false,
          restaurantName: checkedItems.restaurantName || false,
          restaurantSetting: checkedItems.restaurantSetting || false
        }
        // Set requests flag if restaurant name is checked
        if (checkedItems.restaurantName) {
          newPerms.inRoomDelivery.requests = true
        }
      }
      return newPerms
    })
    setShowPermissionModal(false)
    setSelectedPermissionKey("")
  }

  const isPermissionSelected = (key: string): boolean => {
    if (key === "dashboard") {
      return selectedPermissions.dashboard === true
    }
    const perm = selectedPermissions[key]
    if (!perm) return false
    if (typeof perm === "object") {
      // Check if any sub-permission is selected
      return Object.values(perm).some((val: any) => {
        if (typeof val === "object") {
          return Object.values(val).some((v: any) => v === true)
        }
        return val === true
      })
    }
    return perm === true
  }

  const getSelectedPermissionLabel = (): string => {
    return "Select"
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
       <div className="bg-white shadow-xl max-w-3xl w-full mx-4" style={{ borderRadius: "10px" }}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200" style={{ padding: "20px 16px" }}>
          <h2 className="text-xl font-semibold text-gray-900">Add Member</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <RiCloseLine className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-2" style={{ padding: "20px 16px" }}>
          {/* Section 1: General Information */}
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-gray-900">General information</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Member Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Member Name
                </label>
                <input
                  type="text"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="Write Here..."
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ borderRadius: "4px" }}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Write Here..."
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ borderRadius: "4px" }}
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    // Only allow numbers, +, spaces, and dashes
                    const value = e.target.value
                    const cleaned = value.replace(/[^\d+\s-]/g, '')
                    setPhoneNumber(cleaned)
                  }}
                  placeholder="Enter phone number"
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ borderRadius: "4px" }}
                />
              </div>

              {/* Permission */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permission
                </label>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left flex items-center justify-between"
                    style={{ borderRadius: "4px", background: "#FFF" }}
                  >
                    <span className={getSelectedPermissionLabel() === "Select" ? "text-gray-400" : "text-gray-900"}>
                      {getSelectedPermissionLabel()}
                    </span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isDropdownOpen && (
                    <div 
                      className="absolute z-50 w-full mt-1 bg-white"
                      style={{
                        height: "402px",
                        boxShadow: "0px 0px 32px 4px #161A1D1A",
                        borderRadius: "9px"
                      }}
                    >
                      {permissionOptions.map((permission, index) => (
                        <button
                          key={permission.key}
                          type="button"
                          onClick={() => handlePermissionSelect(permission.key)}
                          className="w-full flex items-center text-left hover:bg-gray-50"
                          style={{
                            height: "41px",
                            gap: "10px",
                            paddingTop: "10px",
                            paddingRight: "12px",
                            paddingBottom: "10px",
                            paddingLeft: "12px",
                            background: "#FFFFFF",
                            borderTopLeftRadius: index === 0 ? "9px" : "0px",
                            borderTopRightRadius: index === 0 ? "10px" : "0px"
                          }}
                        >
                          <div
                            style={{
                              width: "20px",
                              height: "20px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0
                            }}
                          >
                            <PublicIcon 
                              src={permission.icon} 
                              alt={permission.label} 
                              width={20} 
                              height={20}
                              style={{
                                filter: "brightness(0) saturate(100%) invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%)"
                              }}
                            />
                          </div>
                          <span 
                            className="flex-1"
                            style={{ 
                              fontSize: "15px",
                              color: "#000000",
                              lineHeight: "20px",
                              display: "flex",
                              alignItems: "center"
                            }}
                          >
                            {permission.label}
                          </span>
                          {isPermissionSelected(permission.key) && (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Section 2: Member Image */}
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-gray-900">Member image</h3>
            <div
              style={{
                width: "100%",
                height: "180px",
                gap: "8px",
                borderRadius: "12px",
                borderWidth: "1px",
                borderStyle: "dashed",
                borderColor: "#0000001F",
                padding: "20px",
                background: "#FFFFFF"
              }}
              className="flex flex-col"
            >
              <div
                style={{
                  width: "100%",
                  height: "120px",
                  gap: "8px",
                  padding: "20px",
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

          {/* Section 3: Account & Access */}
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-gray-900">Account & access</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Write Here..."
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ borderRadius: "4px" }}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ borderRadius: "4px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center cursor-pointer hover:opacity-70 transition-opacity"
                    style={{ background: "none", border: "none", padding: "0", marginRight: "12px" }}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0L3 15M6 6l8.41 8.41M6 6l8.41-8.41M17.41 17.41L21 21M17.41 17.41L12 12" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200" style={{ padding: "20px 16px" }}>
           <button
             onClick={onClose}
             className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
             style={{ borderRadius: "6px", background: "#FBFAFA" }}
           >
             Annuler
           </button>
           <button
             onClick={handleSubmit}
             disabled={isLoading}
             className="px-4 py-2 text-white hover:opacity-90 transition-colors disabled:opacity-50"
             style={{ borderRadius: "6px", background: "#1F2A44" }}
           >
             {isLoading ? 'Adding...' : 'Add Member'}
           </button>
        </div>
      </div>

      {/* Permission Detail Modal */}
        {selectedPermissionKey && (
          <PermissionDetailModal
            isOpen={showPermissionModal}
            onClose={() => {
              setShowPermissionModal(false)
              setSelectedPermissionKey("")
            }}
            onSave={handlePermissionModalSave}
            permissionKey={selectedPermissionKey}
            permissionLabel={permissionOptions.find(p => p.key === selectedPermissionKey)?.label || ""}
            iconSrc={permissionOptions.find(p => p.key === selectedPermissionKey)?.icon}
            options={permissionOptions.find(p => p.key === selectedPermissionKey)?.subOptions || []}
            initialCheckedItems={(() => {
              const perm = selectedPermissions[selectedPermissionKey]
              if (!perm || typeof perm !== "object") return {}
              
              if (selectedPermissionKey === "room") {
                return {
                  rooms: perm.rooms || false,
                  requests: perm.requests || false
                }
              } else if (selectedPermissionKey === "support") {
                return {
                  myTickets: perm.myTickets || false,
                  ticketSaved: perm.ticketSaved || false
                }
              } else if (selectedPermissionKey === "team") {
                return {
                  members: perm.members || false,
                  staff: perm.staff || false
                }
              } else if (selectedPermissionKey === "housekeeping") {
                return {
                  requests: perm.requests || false,
                  houseCleaning: perm.houseCleaning || false,
                  requestManagement: perm.requestManagement || false
                }
              } else if (selectedPermissionKey === "booking") {
                return {
                  requests: (perm.internalRequests?.allCategories || perm.internalRequests?.categoryName) ? true : false,
                  allCategories: perm.internalRequests?.allCategories || false,
                  categoryName: perm.internalRequests?.categoryName || false,
                  bookingSetting: perm.bookingSetting || false
                }
              } else if (selectedPermissionKey === "activityAlert") {
                return {
                  requests: perm.requests || false,
                  activities: perm.activities || false
                }
              } else if (selectedPermissionKey === "laundry") {
                return {
                  requests: perm.requests || false,
                  setting: perm.setting || false
                }
              } else if (selectedPermissionKey === "inRoomDelivery") {
                return {
                  requests: perm.requests || false,
                  restaurantName: perm.restaurantName || false,
                  restaurantSetting: perm.restaurantSetting || false
                }
              }
              return {}
            })()}
          />
        )}

      {/* Alert Dialog */}
      <AlertDialog
        isOpen={alertDialog.isOpen}
        title={alertDialog.title}
        message={alertDialog.message}
        variant={alertDialog.variant}
        onClose={() => setAlertDialog({ ...alertDialog, isOpen: false })}
      />
    </div>
  )
}
