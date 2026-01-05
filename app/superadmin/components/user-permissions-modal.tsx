"use client"

import React, { useEffect, useState } from "react"
import { DashboardIcon, PartnersIcon, SupportIcon, BillingFinanceIcon } from "./icons"
import { getAuthToken } from "@/lib/auth-utils"
import EditPermissionsModal from "./edit-permissions-modal"

interface TeamMember {
  id: string
  name: string
  email: string
  phone: string
  dateAdded: string
  status: string
  avatar: string
}

interface UserPermissionsModalProps {
  member: TeamMember | null
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
  onSuccess?: (message: string) => void
}

const availablePermissions = [
  { id: "dashboard", name: "Dashboard", icon: <DashboardIcon /> },
  { id: "partner", name: "Partner", icon: <PartnersIcon /> },
  { id: "subscription", name: "Subscription", icon: <SupportIcon /> },
  { id: "support", name: "Support", icon: <SupportIcon /> },
  { id: "billingFinance", name: "Billing Finance", icon: <BillingFinanceIcon /> },
  { id: "team", name: "Team", icon: <SupportIcon /> },
]

export default function UserPermissionsModal({ member, isOpen, onClose, onEdit, onSuccess }: UserPermissionsModalProps) {
  const [currentView, setCurrentView] = useState<'permissions' | 'edit'>('permissions')
  const [memberPermissions, setMemberPermissions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset to permissions view when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentView('permissions')
      // Load current permissions
      void (async () => {
        if (!member) return
        try {
          setLoading(true)
          setError(null)
          const token = getAuthToken()
          if (!token) {
            setError('Please log in to view permissions')
            setLoading(false)
            return
          }
          const res = await fetch(`/api/superadmin/members/${member.id}` , {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          if (!res.ok) {
            const e = await res.json().catch(() => ({}))
            throw new Error(e.error || 'Failed to load permissions')
          }
          const data = await res.json()
          const perms: string[] = data?.data?.member?.permissions || data?.member?.permissions || data?.permissions || []
          setMemberPermissions(perms)
        } catch (e: any) {
          setError(e.message || 'Failed to load permissions')
        } finally {
          setLoading(false)
        }
      })()
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

  const handleSavePermissions = async (permissions: string[]) => {
    if (!member) return
    try {
      const token = getAuthToken()
      if (!token) {
        alert('Please log in to update permissions')
        return
      }
      const res = await fetch(`/api/superadmin/members/${member.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ permissions })
      })
      const result = await res.json().catch(() => ({}))
      if (!res.ok || (result as any).success === false) {
        alert(`❌ Error: ${(result as any).error || 'Failed to update permissions'}`)
        return
      }
      setMemberPermissions(permissions)
      // Use success callback if provided, otherwise fallback to alert
      if (onSuccess) {
        onSuccess('Permissions updated successfully')
      } else {
        alert('✅ Permissions updated successfully')
      }
      setCurrentView('permissions')
    } catch (e) {
      alert('Failed to update permissions. Please try again.')
    }
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
          {loading ? (
            <div className="py-6 text-sm text-muted-foreground">Loading permissions...</div>
          ) : error ? (
            <div className="py-6 text-sm text-red-600">{error}</div>
          ) : memberPermissions.length === 0 ? (
            <div className="py-6 text-sm text-muted-foreground">No permissions assigned</div>
          ) : memberPermissions.map((pid) => {
            const normId = pid === 'partners' ? 'partner' : (pid === 'billing' ? 'billingFinance' : pid)
            const permission = availablePermissions.find(p => p.id === normId)
            const label = permission ? permission.name : (pid.charAt(0).toUpperCase() + pid.slice(1))
            const Icon = permission?.icon
            return (
            <div
              key={pid}
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
                {Icon}
              </div>
              <span>{label}</span>
            </div>
            )
          })}
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
        initialPermissions={memberPermissions}
      />
        )}
      </div>
    </div>
  )
}
