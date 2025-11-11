"use client"

import React, { useState, useEffect } from "react"
import { RiCloseLine, RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri"
import PublicIcon from "./public-icon"
import PermissionDetailModal from "./permission-detail-modal"
import { getAuthToken } from "@/lib/auth-utils"

interface TeamMember {
  id: string
  name: string
  email: string
  phone: string
  dateAdded: string
  isActive: boolean
  avatar: string
}

interface UserPermissionsModalProps {
  member: TeamMember | null
  isOpen: boolean
  onClose: () => void
  onEdit?: () => void
}

interface PermissionData {
  dashboard: boolean
  room: {
    rooms: boolean
    requests: boolean
  }
  support: {
    myTickets: boolean
    ticketSaved: boolean
  }
  team: {
    members: boolean
    staff: boolean
  }
  housekeeping: {
    requests: boolean
    houseCleaning: boolean
    requestManagement: boolean
  }
  booking: {
    internalRequests: {
      allCategories: boolean
      categoryName: boolean
    }
    bookingSetting: boolean
  }
  activityAlert: {
    requests: boolean
    activities: boolean
  }
  laundry: {
    requests: boolean
    setting: boolean
  }
  inRoomDelivery: {
    requests: boolean
    restaurantName: boolean
    restaurantSetting: boolean
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

export default function UserPermissionsModal({ member, isOpen, onClose, onEdit }: UserPermissionsModalProps) {
  const [permissions, setPermissions] = useState<PermissionData | null>(null)
  const [loading, setLoading] = useState(false)
  const [expandedPermissions, setExpandedPermissions] = useState<{ [key: string]: boolean }>({})
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedPermissionKey, setSelectedPermissionKey] = useState<string>("")
  const [showPermissionDetailModal, setShowPermissionDetailModal] = useState(false)

  useEffect(() => {
    if (isOpen && member) {
      fetchMemberPermissions()
    }
  }, [isOpen, member])

  const fetchMemberPermissions = async () => {
    if (!member) return
    setLoading(true)
    try {
      const token = getAuthToken()
      if (!token) {
        alert('Please log in to view permissions')
        setLoading(false)
        return
      }

      const response = await fetch(`/api/partner/members/${member.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          const memberData = result.data?.member || result.data
          if (memberData?.permissions) {
            setPermissions(memberData.permissions)
          }
        }
      } else {
        console.error('Failed to fetch member permissions')
      }
    } catch (error) {
      console.error('Error fetching member permissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleExpand = (key: string) => {
    setExpandedPermissions(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleEditPermission = (key: string) => {
    setSelectedPermissionKey(key)
    setShowPermissionDetailModal(true)
  }

  const handleDeletePermission = async (key: string) => {
    if (!member || !confirm(`Are you sure you want to remove ${permissionOptions.find(p => p.key === key)?.label} permission?`)) {
      return
    }

    try {
      const token = getAuthToken()
      if (!token) {
        alert('Please log in to delete permissions')
        return
      }

      // Build updated permissions with the specific permission removed
      const updatedPermissions: any = { ...permissions }
      if (key === "dashboard") {
        updatedPermissions.dashboard = false
      } else if (key === "room") {
        updatedPermissions.room = { rooms: false, requests: false }
      } else if (key === "support") {
        updatedPermissions.support = { myTickets: false, ticketSaved: false }
      } else if (key === "team") {
        updatedPermissions.team = { members: false, staff: false }
      } else if (key === "housekeeping") {
        updatedPermissions.housekeeping = { requests: false, houseCleaning: false, requestManagement: false }
      } else if (key === "booking") {
        updatedPermissions.booking = {
          internalRequests: { allCategories: false, categoryName: false },
          bookingSetting: false
        }
      } else if (key === "activityAlert") {
        updatedPermissions.activityAlert = { requests: false, activities: false }
      } else if (key === "laundry") {
        updatedPermissions.laundry = { requests: false, setting: false }
      } else if (key === "inRoomDelivery") {
        updatedPermissions.inRoomDelivery = { requests: false, restaurantName: false, restaurantSetting: false }
      }

      const response = await fetch(`/api/partner/members/${member.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ permissions: updatedPermissions })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setPermissions(updatedPermissions)
          alert('✅ Permission removed successfully')
        } else {
          alert(`❌ Error: ${result.error || 'Failed to remove permission'}`)
        }
      } else {
        const errorResult = await response.json().catch(() => ({}))
        alert(`❌ Error: ${errorResult.error || 'Failed to remove permission'}`)
      }
    } catch (error) {
      console.error('Error deleting permission:', error)
      alert('Failed to remove permission. Please try again.')
    }
  }

  const handlePermissionModalSave = (checkedItems: { [key: string]: boolean }) => {
    if (!member || !selectedPermissionKey) return

    const updatedPermissions: any = { ...permissions }
    
    if (selectedPermissionKey === "dashboard") {
      updatedPermissions.dashboard = checkedItems.dashboard || false
    } else if (selectedPermissionKey === "room") {
      updatedPermissions.room = {
        rooms: checkedItems.rooms || false,
        requests: checkedItems.requests || false
      }
    } else if (selectedPermissionKey === "support") {
      updatedPermissions.support = {
        myTickets: checkedItems.myTickets || false,
        ticketSaved: checkedItems.ticketSaved || false
      }
    } else if (selectedPermissionKey === "team") {
      updatedPermissions.team = {
        members: checkedItems.members || false,
        staff: checkedItems.staff || false
      }
    } else if (selectedPermissionKey === "housekeeping") {
      updatedPermissions.housekeeping = {
        requests: checkedItems.requests || false,
        houseCleaning: checkedItems.houseCleaning || false,
        requestManagement: checkedItems.requestManagement || false
      }
    } else if (selectedPermissionKey === "booking") {
      updatedPermissions.booking = {
        internalRequests: {
          allCategories: checkedItems.allCategories || false,
          categoryName: checkedItems.categoryName || false
        },
        bookingSetting: checkedItems.bookingSetting || false
      }
      if (checkedItems.allCategories || checkedItems.categoryName) {
        updatedPermissions.booking.internalRequests = {
          allCategories: checkedItems.allCategories || false,
          categoryName: checkedItems.categoryName || false
        }
      }
    } else if (selectedPermissionKey === "activityAlert") {
      updatedPermissions.activityAlert = {
        requests: checkedItems.requests || false,
        activities: checkedItems.activities || false
      }
    } else if (selectedPermissionKey === "laundry") {
      updatedPermissions.laundry = {
        requests: checkedItems.requests || false,
        setting: checkedItems.setting || false
      }
    } else if (selectedPermissionKey === "inRoomDelivery") {
      updatedPermissions.inRoomDelivery = {
        requests: checkedItems.requests || false,
        restaurantName: checkedItems.restaurantName || false,
        restaurantSetting: checkedItems.restaurantSetting || false
      }
      if (checkedItems.restaurantName) {
        updatedPermissions.inRoomDelivery.requests = true
      }
    }

    // Save to API
    const savePermissions = async () => {
      try {
        const token = getAuthToken()
        if (!token) {
          alert('Please log in to update permissions')
          return
        }

        const response = await fetch(`/api/partner/members/${member.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ permissions: updatedPermissions })
        })

        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setPermissions(updatedPermissions)
            setShowPermissionDetailModal(false)
            setSelectedPermissionKey("")
            alert('✅ Permissions updated successfully')
          } else {
            alert(`❌ Error: ${result.error || 'Failed to update permissions'}`)
          }
        } else {
          const errorResult = await response.json().catch(() => ({}))
          alert(`❌ Error: ${errorResult.error || 'Failed to update permissions'}`)
        }
      } catch (error) {
        console.error('Error updating permissions:', error)
        alert('Failed to update permissions. Please try again.')
      }
    }

    savePermissions()
  }

  const isPermissionActive = (key: string): boolean => {
    if (!permissions) return false
    if (key === "dashboard") {
      return permissions.dashboard === true
    }
    const perm = (permissions as any)[key]
    if (!perm || typeof perm !== "object") return false
    return Object.values(perm).some((val: any) => {
      if (typeof val === "object") {
        return Object.values(val).some((v: any) => v === true)
      }
      return val === true
    })
  }

  const getInitialCheckedItems = (key: string): { [key: string]: boolean } => {
    if (!permissions) return {}
    const perm = (permissions as any)[key]
    if (!perm) return {}

    if (key === "dashboard") {
      return { dashboard: perm === true }
    } else if (key === "room") {
      return {
        rooms: perm.rooms || false,
        requests: perm.requests || false
      }
    } else if (key === "support") {
      return {
        myTickets: perm.myTickets || false,
        ticketSaved: perm.ticketSaved || false
      }
    } else if (key === "team") {
      return {
        members: perm.members || false,
        staff: perm.staff || false
      }
    } else if (key === "housekeeping") {
      return {
        requests: perm.requests || false,
        houseCleaning: perm.houseCleaning || false,
        requestManagement: perm.requestManagement || false
      }
    } else if (key === "booking") {
      return {
        requests: (perm.internalRequests?.allCategories || perm.internalRequests?.categoryName) ? true : false,
        allCategories: perm.internalRequests?.allCategories || false,
        categoryName: perm.internalRequests?.categoryName || false,
        bookingSetting: perm.bookingSetting || false
      }
    } else if (key === "activityAlert") {
      return {
        requests: perm.requests || false,
        activities: perm.activities || false
      }
    } else if (key === "laundry") {
      return {
        requests: perm.requests || false,
        setting: perm.setting || false
      }
    } else if (key === "inRoomDelivery") {
      return {
        requests: perm.requests || false,
        restaurantName: perm.restaurantName || false,
        restaurantSetting: perm.restaurantSetting || false
      }
    }
    return {}
  }

  if (!isOpen || !member) return null

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
        <div className="bg-white shadow-xl mx-4" style={{ borderRadius: "10px", width: "500px", maxWidth: "500px", maxHeight: "90vh", overflowY: "auto" }}>
          {/* Header */}
          <div style={{ padding: "30px 40px 10px 40px", textAlign: "center" }}>
            <h2 className="text-xl font-semibold" style={{ color: "#1F1F1F", marginBottom: "10px" }}>
              User Permissions
            </h2>
            <p className="text-sm text-gray-600">
              View the permissions assigned to this user. You can edit them if needed.
            </p>
          </div>

          {/* Content */}
          <div style={{ padding: "10px 20px 20px 20px", display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
            {loading ? (
              <div className="text-center py-8">Loading permissions...</div>
            ) : (
              permissionOptions.map((permission) => {
                const isActive = isPermissionActive(permission.key)
                const isExpanded = expandedPermissions[permission.key]
                const hasSubPermissions = permission.hasSubPermissions

                if (!isActive) return null // Don't show inactive permissions

                return (
                  <div
                    key={permission.key}
        style={{
                      width: "410px",
          display: "flex",
          flexDirection: "column",
                      borderWidth: "1px",
          borderRadius: "10px",
                      background: "#FBFAFA",
                      border: "1px solid #2121200F",
                      overflow: "hidden"
        }}
      >
        <div 
          style={{
                        minHeight: hasSubPermissions ? "50px" : "69px",
            display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: "16px",
                        paddingRight: "15px",
                        paddingBottom: "16px",
                        paddingLeft: "15px"
                      }}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <PublicIcon 
                          src={permission.icon} 
                          alt={permission.label} 
                          width={20} 
                          height={20}
                          style={{
                            filter: "brightness(0) saturate(100%) invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%)"
                          }}
                        />
                        <span style={{ color: "#0A0A0A", fontSize: "15px", fontWeight: "500", display: "flex", alignItems: "center", lineHeight: "20px" }}>
                          {permission.label}
                        </span>
                      </div>

                      {hasSubPermissions ? (
                        <button
                          onClick={() => toggleExpand(permission.key)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          {isExpanded ? (
                            <RiArrowUpSLine className="w-5 h-5 text-gray-500" />
                          ) : (
                            <RiArrowDownSLine className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDeletePermission(permission.key)}
            style={{
                            width: "82px",
                            height: "37px",
                            paddingTop: "8.52px",
                            paddingRight: "20px",
                            paddingBottom: "8.52px",
                            paddingLeft: "20px",
                            borderWidth: "1px",
                            borderRadius: "6px",
                            background: "#FFFFFF",
                            color: "#FF0D0D",
                            fontSize: "15px",
                            border: "1px solid #CED4DA",
                            cursor: "pointer",
              display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          Delete
                        </button>
                      )}
        </div>

                    {/* Expanded permission details */}
                    {isExpanded && hasSubPermissions && permission.subOptions && (
        <div 
          style={{
                          width: "100%",
                          padding: "0 15px 16px 15px"
                        }}
                      >
                        {permission.subOptions.map((subOption) => {
                          const isSubActive = (() => {
                            if (!permissions) return false
                            const perm = (permissions as any)[permission.key]
                            if (!perm) return false
                            
                            if (permission.key === "room") {
                              return subOption.key === "rooms" ? perm.rooms : perm.requests
                            } else if (permission.key === "support") {
                              return subOption.key === "myTickets" ? perm.myTickets : perm.ticketSaved
                            } else if (permission.key === "team") {
                              return subOption.key === "members" ? perm.members : perm.staff
                            } else if (permission.key === "housekeeping") {
                              return subOption.key === "requests" ? perm.requests : 
                                     subOption.key === "houseCleaning" ? perm.houseCleaning : perm.requestManagement
                            } else if (permission.key === "booking") {
                              if (subOption.key === "requests") {
                                return perm.internalRequests?.allCategories || perm.internalRequests?.categoryName
                              }
                              return perm.bookingSetting
                            } else if (permission.key === "activityAlert") {
                              return subOption.key === "requests" ? perm.requests : perm.activities
                            } else if (permission.key === "laundry") {
                              return subOption.key === "requests" ? perm.requests : perm.setting
                            } else if (permission.key === "inRoomDelivery") {
                              if (subOption.key === "requests") {
                                return perm.restaurantName || perm.requests
                              }
                              return perm.restaurantSetting
                            }
                            return false
                          })()

                          if (!isSubActive) return null

                          return (
                            <div key={subOption.key} className="mb-2 last:mb-0">
                              <div className="flex items-center gap-3 mb-2">
                                <div
                                  className="relative flex items-center justify-center"
                                  style={{ width: "16px", height: "16px" }}
                                >
                                  <PublicIcon src="/assets/icons/_Checkbox base.svg" alt="checkbox" width={16} height={16} />
                                  {isSubActive && (
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
                                <span style={{ color: "#525866", fontSize: "14px" }}>{subOption.label}</span>
        </div>

                              {/* Nested sub-options for booking and inRoomDelivery */}
                              {subOption.hasSubOptions && subOption.subSubOptions && isSubActive && (
                                <div className="ml-8 space-y-1">
                                  {subOption.subSubOptions.map((subSubOption) => {
                                    const isSubSubActive = (() => {
                                      if (!permissions) return false
                                      const perm = (permissions as any)[permission.key]
                                      if (!perm) return false
                                      
                                      if (permission.key === "booking" && subOption.key === "requests") {
                                        return subSubOption.key === "allCategories" ? perm.internalRequests?.allCategories :
                                               subSubOption.key === "categoryName" ? perm.internalRequests?.categoryName : false
                                      } else if (permission.key === "inRoomDelivery" && subOption.key === "requests") {
                                        return subSubOption.key === "restaurantName" ? perm.restaurantName : false
                                      }
                                      return false
                                    })()

                                    return (
                                      <div key={subSubOption.key} className="flex items-center gap-3">
                                        <div
                                          className="relative flex items-center justify-center"
                                          style={{ width: "16px", height: "16px" }}
                                        >
                                          <PublicIcon src="/assets/icons/_Checkbox base.svg" alt="checkbox" width={16} height={16} />
                                          {isSubSubActive && (
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
                                        <span style={{ color: isSubSubActive ? "#525866" : "#999", fontSize: "14px" }}>
                                          {subSubOption.label}
                                        </span>
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          )
                        })}

                        <div className="flex justify-end gap-3 mt-4">
          <button
                            onClick={() => handleEditPermission(permission.key)}
            style={{
                              padding: "8.52px 20px",
              borderRadius: "6px",
                              border: "1px solid #CED4DA",
                              background: "#FFFFFF",
                              color: "#0A0A0A",
                              fontSize: "15px",
                              cursor: "pointer"
            }}
          >
            Edit
          </button>
          <button
                            onClick={() => handleDeletePermission(permission.key)}
            style={{
                              padding: "8.52px 20px",
              borderRadius: "6px",
                              border: "1px solid #CED4DA",
                              background: "#FFFFFF",
                              color: "#FF0D0D",
                              fontSize: "15px",
                              cursor: "pointer"
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 border-t border-gray-200" style={{ padding: "20px" }}>
            <button
              onClick={() => {
                // Add new permission functionality
                alert('Add new permission feature to be implemented')
              }}
              className="px-4 py-2 text-white hover:opacity-90 transition-colors flex-1"
              style={{ borderRadius: "6px", background: "#1F2A44", width: "50%" }}
            >
              Add new permission
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors flex-1"
              style={{ borderRadius: "6px", background: "#FBFAFA", width: "50%" }}
          >
            Close
          </button>
        </div>
        </div>
      </div>

      {/* Permission Detail Modal for editing */}
      {selectedPermissionKey && (
        <PermissionDetailModal
          isOpen={showPermissionDetailModal}
          onClose={() => {
            setShowPermissionDetailModal(false)
            setSelectedPermissionKey("")
          }}
          onSave={handlePermissionModalSave}
          permissionKey={selectedPermissionKey}
          permissionLabel={permissionOptions.find(p => p.key === selectedPermissionKey)?.label || ""}
          iconSrc={permissionOptions.find(p => p.key === selectedPermissionKey)?.icon}
          options={permissionOptions.find(p => p.key === selectedPermissionKey)?.subOptions || []}
          initialCheckedItems={getInitialCheckedItems(selectedPermissionKey)}
        />
      )}
    </>
  )
}
