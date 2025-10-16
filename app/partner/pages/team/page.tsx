"use client"

import { useState } from "react"
import {
  RiMoreLine,
  RiEditLine,
  RiLockPasswordLine,
  RiDeleteBinLine,
  RiUserSettingsLine,
  RiAddLine,
} from "react-icons/ri"
import ToggleSwitch from "@/app/superadmin/components/toggle-switch"
import DropdownMenu from "@/app/superadmin/components/dropdown-menu"
import UserPermissionsModal from "@/app/superadmin/components/user-permissions-modal"
import DropdownArrow from "@/app/superadmin/components/dropdown-arrow"
import SortArrows from "@/app/superadmin/components/sort-arrows"
import { LeftArrow, RightArrow } from "@/app/superadmin/components/pagination-arrows"

interface TeamMember {
  id: string
  name: string
  email: string
  phone: string
  dateAdded: string
  isActive: boolean
  avatar: string
}

const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Full Name",
    email: "contact@maghrebcom.store",
    phone: "+212 632-002529",
    dateAdded: "15 juin 2025",
    isActive: true,
    avatar: "FN",
  },
  {
    id: "2",
    name: "Full Name",
    email: "contact@maghrebcom.store",
    phone: "+212 632-002529",
    dateAdded: "15 juin 2025",
    isActive: true,
    avatar: "FN",
  },
  {
    id: "3",
    name: "Full Name",
    email: "contact@maghrebcom.store",
    phone: "+212 632-002529",
    dateAdded: "15 juin 2025",
    isActive: true,
    avatar: "FN",
  },
  {
    id: "4",
    name: "Full Name",
    email: "contact@maghrebcom.store",
    phone: "+212 632-002529",
    dateAdded: "15 juin 2025",
    isActive: false,
    avatar: "FN",
  },
]

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [showPermissionsModal, setShowPermissionsModal] = useState(false)
  const [memberForPermissions, setMemberForPermissions] = useState<TeamMember | null>(null)

  const handleToggleActive = (id: string) => {
    setTeamMembers(teamMembers.map((m) => (m.id === id ? { ...m, isActive: !m.isActive } : m)))
  }

  const handleDeleteMember = (member: TeamMember) => {
    setMemberToDelete(member)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (memberToDelete) {
      setTeamMembers(teamMembers.filter((m) => m.id !== memberToDelete.id))
      setShowDeleteModal(false)
      setMemberToDelete(null)
    }
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setMemberToDelete(null)
  }

  const handleEditMember = (member: TeamMember) => {
    setSelectedMember(member)
    setShowEditModal(true)
  }

  const handleUserPermissions = (member: TeamMember) => {
    setMemberForPermissions(member)
    setShowPermissionsModal(true)
  }

  const closePermissionsModal = () => {
    setShowPermissionsModal(false)
    setMemberForPermissions(null)
  }

  const handleEditFromPermissions = () => {
    // This handler is no longer needed as the edit permissions modal
    // is now handled directly within the UserPermissionsModal component
  }

  const handleSaveEdit = () => {
    // Handle save logic here
    console.log("Saving changes for:", selectedMember?.id)
    setShowEditModal(false)
    setSelectedMember(null)
  }

  const totalPages = Math.ceil(teamMembers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentMembers = teamMembers.slice(startIndex, endIndex)

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Team</h1>
        <p className="text-sm text-muted-foreground">Last updated on 09/15/2025, 12AM</p>
      </div>

      {/* Members Section */}
      <div className="bg-card rounded-lg p-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-4  border-border">
          <h3 className="text-base font-semibold text-foreground">Members</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="appearance-none"
                style={{
                  padding: "7.52px 12px",
                  paddingRight: "32px",
                  borderRadius: "4px",
                  border: "1px solid #CED4DA",
                  background: "#FFF",
                  color: "rgba(33, 33, 33, 0.60)",
                  fontSize: "13px",
                  fontWeight: "400",
                  lineHeight: "19.5px"
                }}
              >
                <option value={10}>Display 10</option>
                <option value={20}>Display 20</option>
                <option value={50}>Display 50</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <DropdownArrow />
              </div>
            </div>

            <input
              type="text"
              placeholder="Search..."
              style={{
                padding: "7.52px 12px",
                borderRadius: "4px",
                border: "1px solid #CED4DA",
                background: "#FFF",
                color: "rgba(33, 33, 33, 0.60)",
                fontSize: "13px",
                fontWeight: "400",
                lineHeight: "19.5px"
              }}
              className="focus:outline-none focus:ring-2 focus:ring-primary/30"
            />

            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-xl text-sm font-medium transition-colors">
              <RiAddLine className="w-5 h-5" />
              Add Member
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full rounded-lg">
            <thead className="bg-muted/50 border-b rounded-lg">
              <tr>
                <th className="w-12 px-4 py-4">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-4 py-4 text-left">
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <SortArrows sortDirection="none" />
                    <span style={{ 
                      color: "#000", 
                      fontSize: "12px", 
                      fontWeight: "500", 
                      lineHeight: "19.5px" 
                    }}>
                      Member Name
                    </span>
                  </div>
                </th>
                <th className="px-4 py-4 text-left">
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <SortArrows sortDirection="none" />
                    <span style={{ 
                      color: "#000", 
                      fontSize: "12px", 
                      fontWeight: "500", 
                      lineHeight: "19.5px" 
                    }}>
                      Email
                    </span>
                  </div>
                </th>
                <th className="px-4 py-4 text-left">
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <SortArrows sortDirection="none" />
                    <span style={{ 
                      color: "#000", 
                      fontSize: "12px", 
                      fontWeight: "500", 
                      lineHeight: "19.5px" 
                    }}>
                      Phone number
                    </span>
                  </div>
                </th>
                <th className="px-4 py-4 text-left">
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <SortArrows sortDirection="none" />
                    <span style={{ 
                      color: "#000", 
                      fontSize: "12px", 
                      fontWeight: "500", 
                      lineHeight: "19.5px" 
                    }}>
                      Date added
                    </span>
                  </div>
                </th>
                <th className="px-4 py-4 text-left">
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <SortArrows sortDirection="none" />
                    <span style={{ 
                      color: "#000", 
                      fontSize: "12px", 
                      fontWeight: "500", 
                      lineHeight: "19.5px" 
                    }}>
                      Complete
                    </span>
                  </div>
                </th>
                <th className="w-12 px-4 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentMembers.map((member) => (
                <tr key={member.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                        {member.avatar}
                      </div>
                      <span style={{
                        color: "#525866",
                        fontSize: "12px",
                        fontWeight: "400",
                        lineHeight: "19.5px"
                      }}>
                        {member.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4" style={{
                    color: "#525866",
                    fontSize: "12px",
                    fontWeight: "400",
                    lineHeight: "19.5px"
                  }}>
                    {member.email}
                  </td>
                  <td className="px-4 py-4" style={{
                    color: "#525866",
                    fontSize: "12px",
                    fontWeight: "400",
                    lineHeight: "19.5px"
                  }}>
                    {member.phone}
                  </td>
                  <td className="px-4 py-4" style={{
                    color: "#525866",
                    fontSize: "12px",
                    fontWeight: "400",
                    lineHeight: "19.5px"
                  }}>
                    {member.dateAdded}
                  </td>
                  <td className="px-4 py-4">
                    <ToggleSwitch checked={member.isActive} onChange={() => handleToggleActive(member.id)} />
                  </td>
                  <td className="px-4 py-4">
                    <DropdownMenu
                      trigger={
                        <button className="p-1 hover:bg-muted rounded transition-colors">
                          <RiMoreLine className="w-5 h-5 text-muted-foreground" />
                        </button>
                      }
                      items={[
                        {
                          label: "Edit",
                          icon: <RiEditLine className="w-4 h-4" />,
                          onClick: () => handleEditMember(member),
                        },
                        {
                          label: "User Permissions",
                          icon: <RiUserSettingsLine className="w-4 h-4" />,
                          onClick: () => handleUserPermissions(member),
                        },
                        {
                          label: "Reset password",
                          icon: <RiLockPasswordLine className="w-4 h-4" />,
                          onClick: () => console.log("Reset password", member.id),
                        },
                        {
                          label: "Supprimer",
                          icon: <RiDeleteBinLine className="w-4 h-4" />,
                          onClick: () => handleDeleteMember(member),
                          variant: "danger",
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between  py-3 border-t ">
          <p className="text-sm text-muted-foreground">
            Displaying {startIndex + 1}-{Math.min(endIndex, teamMembers.length)} results out of {teamMembers.length}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LeftArrow />
            </button>

            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
              const page = i + 1
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                    currentPage === page ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {page}
                </button>
              )
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RightArrow />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Member Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
          <div className="bg-white rounded-xl w-[50vw] mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div 
              className="flex justify-between items-center border-b"
              style={{
                padding: "20px 16px",
                borderBottom: "1px solid rgba(0, 0, 0, 0.04)",
                borderRadius: "10px 10px 0 0",
                background: "#FFF"
              }}
            >
              <h2 className="text-lg font-semibold text-black">Edit Member</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="flex items-center justify-center"
                style={{ width: "24px", height: "24px", aspectRatio: "1/1" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                  <path d="M18 6.52441L6 18.5244M6 6.52441L18 18.5244" stroke="#525866" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-8">
              {/* General Information Section */}
              <div className="space-y-4">
                <h3 
                  className="font-semibold"
                  style={{ 
                    color: "#000",
                    fontSize: "16px",
                    fontWeight: "600",
                    lineHeight: "normal"
                  }}
                >
                  General information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-[#212121]">Member Name</label>
                      <input
                        type="text"
                        defaultValue={selectedMember?.name}
                        placeholder="Write Here..."
                        className="w-full px-3 py-2 border border-[#CED4DA] rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        style={{
                          padding: "7.52px 12px",
                          border: "1px solid #CED4DA",
                          borderRadius: "4px",
                          background: "#FFF"
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-[#212121]">Phone number</label>
                      <input
                        type="text"
                        defaultValue={selectedMember?.phone}
                        placeholder="Write Here..."
                        className="w-full px-3 py-2 border border-[#CED4DA] rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        style={{
                          padding: "7.52px 12px",
                          border: "1px solid #CED4DA",
                          borderRadius: "4px",
                          background: "#FFF"
                        }}
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-[#212121]">Email</label>
                      <input
                        type="email"
                        defaultValue={selectedMember?.email}
                        placeholder="Write Here..."
                        className="w-full px-3 py-2 border border-[#CED4DA] rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        style={{
                          padding: "7.52px 12px",
                          border: "1px solid #CED4DA",
                          borderRadius: "4px",
                          background: "#FFF"
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-[#212121]">Permissions</label>
                      <div className="relative">
                        <select
                          className="w-full px-3 py-2 border border-[#CED4DA] rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                          style={{
                            padding: "7.52px 12px",
                            border: "1px solid #CED4DA",
                            borderRadius: "4px",
                            background: "#FFF"
                          }}
                        >
                          <option value="">Select</option>
                          <option value="admin">Admin</option>
                          <option value="manager">Manager</option>
                          <option value="user">User</option>
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                            <path d="M1 1.5L6 6.5L11 1.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account & Access Section */}
              <div className="space-y-4">
                <h3 
                  className="font-semibold"
                  style={{ 
                    color: "#000",
                    fontSize: "16px",
                    fontWeight: "600",
                    lineHeight: "normal"
                  }}
                >
                  Account & access
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Left Column */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#212121]">Username</label>
                    <input
                      type="text"
                      placeholder="Write Here..."
                      className="w-full px-3 py-2 border border-[#CED4DA] rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      style={{
                        padding: "7.52px 12px",
                        border: "1px solid #CED4DA",
                        borderRadius: "4px",
                        background: "#FFF"
                      }}
                    />
                  </div>

                  {/* Right Column */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#212121]">Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="Enter password"
                        className="w-full px-3 py-2 pr-10 border border-[#CED4DA] rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        style={{
                          padding: "7.52px 12px",
                          border: "1px solid #CED4DA",
                          borderRadius: "4px",
                          background: "#FFF"
                        }}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M14.3623 5.21847C14.565 5.50268 14.6663 5.64479 14.6663 5.85514C14.6663 6.0655 14.565 6.20761 14.3623 6.49182C13.4516 7.76885 11.1258 10.5218 7.99968 10.5218C4.87353 10.5218 2.54774 7.76885 1.63704 6.49182C1.43435 6.20761 1.33301 6.0655 1.33301 5.85514C1.33301 5.64479 1.43435 5.50268 1.63703 5.21847C2.54774 3.94144 4.87353 1.18848 7.99968 1.18848C11.1258 1.18848 13.4516 3.94144 14.3623 5.21847Z" stroke="#141B34"/>
                          <path d="M10 5.85547C10 4.7509 9.10457 3.85547 8 3.85547C6.89543 3.85547 6 4.7509 6 5.85547C6 6.96004 6.89543 7.85547 8 7.85547C9.10457 7.85547 10 6.96004 10 5.85547Z" stroke="#121212"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div 
              className="flex justify-end items-center border-t"
              style={{
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
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                style={{ 
                  padding: "8.52px 10px", 
                  borderRadius: "6px", 
                  background: "#FBFAFA",
                  border: "1px solid #CED4DA",
                  color: "#525866"
                }}
              >
                Annuler
              </button>
              <button 
                onClick={handleSaveEdit}
                className="px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-primary/90 transition-colors"
                style={{ 
                  padding: "8.52px 20px", 
                  borderRadius: "6px", 
                  background: "#1F2A44" 
                }}
              >
                Add member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Member Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-80 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
          <div className="bg-white rounded-[10px] w-full max-w-md mx-4">
            {/* First Section - Header */}
            <div 
              className="flex justify-between items-center px-4 py-5 rounded-t-[10px] border-b border-black/4"
              style={{
                borderBottom: "1px solid rgba(0, 0, 0, 0.04)",
                background: "#FFF"
              }}
            >
              <h2 
                className="text-black font-bold text-xl leading-normal"
                style={{
                  fontSize: "20px",
                  fontWeight: 700
                }}
              >
                Delete member
              </h2>
              <button
                onClick={cancelDelete}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Second Section - Content */}
            <div 
              className="px-4 py-5 border-b border-black/6"
              style={{
                borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
                background: "#FFF"
              }}
            >
              <p 
                className="text-gray-600 text-lg leading-normal"
                style={{
                  color: "#525866",
                  fontSize: "17px",
                  fontWeight: 400
                }}
              >
                Are you sure you want to remove {memberToDelete?.name} from the team?
                Access will be revoked immediately. Existing tickets/tasks won't be deleted.
              </p>
            
            </div>

            {/* Third Section - Footer */}
            <div 
              className="flex justify-end items-center gap-18 px-4 py-5 rounded-b-[10px] border-t border-black/4"
              style={{
                borderTop: "1px solid rgba(0, 0, 0, 0.04)",
                background: "#FFF",
                gap: "72px"
              }}
            >
              <div className="flex gap-[16px] flex-end">
                <button
                  onClick={cancelDelete}
                  className="flex flex-col justify-center items-center px-2.5 py-2 rounded-md text-center font-medium text-sm leading-5 transition-colors"
                  style={{
                    padding: "8.52px 10px",
                    borderRadius: "6px",
                    background: "#FBFAFA",
                    color: "#000",
                    fontSize: "14px",
                    fontWeight: 500,
                    lineHeight: "19.5px"
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex flex-col justify-center items-center px-2.5 py-2 rounded-md text-center font-medium text-sm leading-5 transition-colors"
                  style={{
                    padding: "8.52px 10px",
                    borderRadius: "6px",
                    background: "#EB1D1D",
                    color: "#FFF",
                    fontSize: "14px",
                    fontWeight: 500,
                    lineHeight: "19.5px"
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Permissions Modal */}
      <UserPermissionsModal
        member={memberForPermissions}
        isOpen={showPermissionsModal}
        onClose={closePermissionsModal}
        onEdit={handleEditFromPermissions}
      />
    </div>
  )
}
