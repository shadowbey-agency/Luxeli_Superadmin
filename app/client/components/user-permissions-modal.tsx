"use client"

import React, { useState } from "react"
import { DashboardIcon, PartnersIcon, SupportIcon, ServicesIcon, BillingFinanceIcon } from "./icons"
import EditPermissionsModal from "./edit-permissions-modal"

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
  onEdit: () => void
}

const permissions = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    id: "partners",
    name: "Partners", 
    icon: <PartnersIcon />,
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

export default function UserPermissionsModal({ member, isOpen, onClose, onEdit }: UserPermissionsModalProps) {
  const [currentView, setCurrentView] = useState<'permissions' | 'edit'>('permissions')

  // Reset to permissions view when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setCurrentView('permissions')
    }
  }, [isOpen])

  const handleEditClick = () => {
    setCurrentView('edit')
  }

  const handleBackToPermissions = () => {
    setCurrentView('permissions')
  }

  const handleCloseModal = () => {
    setCurrentView('permissions') // Reset view when closing
    onClose()
  }

  const handleSavePermissions = (permissions: string[]) => {
    console.log("Saving permissions:", permissions)
    // Here you would typically update the user's permissions
    setCurrentView('permissions') // Reset to permissions view after saving
  }

  if (!isOpen || !member) return null

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-80 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
      <div 
        className="bg-white flex flex-col items-center rounded-[10px]"
        style={{
          display: "flex",
          width: currentView === 'edit' ? "509px" : "500px",
          padding: currentView === 'edit' ? "0" : "30px 0",
          flexDirection: "column",
          alignItems: "center",
          gap: currentView === 'edit' ? "0" : "30px",
          borderRadius: "10px",
          background: "#FFF",
          boxShadow: "0 10px 10px 0 rgba(0, 0, 0, 0.10)"
        }}
      >
        {currentView === 'permissions' ? (
          <>
            {/* Header Section */}
            <div 
              className="flex flex-col items-start"
              style={{
                display: "flex",
                padding: "0 40px",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "10px",
                alignSelf: "stretch"
              }}
            >
              <h2 
                className="text-center"
                style={{
                  display: "flex",
                  height: "32px",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignSelf: "stretch",
                  color: "#1F1F1F",
                  textAlign: "center",
                  fontSize: "20px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "32px"
                }}
              >
                User Permissions
              </h2>
              <p className="text-gray-600 text-sm">
                View the permissions assigned to this user. You can edit them if needed.
              </p>
            </div>

            {/* Permissions Options Section */}
            <div 
              className="flex flex-wrap justify-center items-start "
              style={{
                display: "flex",
                padding: "0 20px",
                justifyContent: "center",
                alignItems: "flex-start",
                alignContent: "flex-start",
                gap: "10px",
                alignSelf: "stretch",
                flexWrap: "wrap"
              }}
            >
              {permissions.map((permission) => (
                <div
                  key={permission.id}
                  className="flex items-center gap-2 border rounded-[10px]"
                  style={{
                    display: "flex",
                    width: "200px",
                    height: "43px",
                    padding: "2px 2px 2px 15px",
                    alignItems: "center",
                    gap: "8px",
                    borderRadius: "10px",
                    border: "1px solid rgba(33, 33, 32, 0.06)",
                    background: "#FBFAFA",
                    color: "#0A0A0A",
                    fontSize: "12px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "18px"
                  }}
                >
                  <div 
                    className="flex justify-center items-center flex-shrink-0"
                    style={{
                      display: "flex",
                      width: "16px",
                      height: "16px",
                      padding: "1.333px",
                      justifyContent: "center",
                      alignItems: "center",
                      flexShrink: 0
                    }}
                  >
                    {permission.icon}
                  </div>
                  <span>{permission.name}</span>
                </div>
              ))}
            </div>
            <div className="border-b  border-black/4 w-full "></div>
            

            {/* Footer Section */}
            <div 
              className="flex gap-3 w-full px-5"
              style={{
                display: "flex",
                gap: "10px",
                padding: "0 20px"
              }}
            >
              {/* Edit Button */}
              <button
                onClick={handleEditClick}
                className="flex justify-center items-center flex-1 text-white"
                style={{
                  display: "flex",
                  padding: "8.52px 10px",
                  justifyContent: "center",
                  alignItems: "center",
                  flex: "1 0 0",
                  borderRadius: "6px",
                  border: "1px solid var(--primary, #1F2A44)",
                  background: "var(--Foundation-Blue-Normal, #1F2A44)"
                }}
              >
                Edit
              </button>

              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="flex justify-center items-center flex-1"
                style={{
                  display: "flex",
                  padding: "8.52px 10px",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  flex: "1 0 0",
                  borderRadius: "6px",
                  background: "#FBFAFA"
                }}
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <EditPermissionsModal
            member={member}
            isOpen={true}
            onClose={handleCloseModal}
            onSave={handleSavePermissions}
            showBackButton={true}
            onBack={handleBackToPermissions}
          />
        )}
      </div>
    </div>
  )
}
