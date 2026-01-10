"use client"

import React, { useState, useRef, useEffect } from "react"
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
import { getAuthToken } from "@/lib/auth-utils"
import AlertDialog from "@/app/partner/components/alert-dialog"
import ResetPasswordModal from "@/app/superadmin/components/reset-password-modal"
import SuccessCard from "@/app/superadmin/components/success-card"

interface TeamMember {
  id: string
  name: string
  email: string
  phone: string
  role: string
  dateAdded: string
  status: string
  avatar: string
  permissions: string[]
}

const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Full Name",
    email: "contact@maghrebcom.store",
    phone: "+212 632-002529",
    role: "Manager",
    dateAdded: "15 juin 2025",
    status: "active",
    avatar: "FN",
  },
  {
    id: "2",
    name: "Full Name",
    email: "contact@maghrebcom.store",
    phone: "+212 632-002529",
    role: "Staff",
    dateAdded: "15 juin 2025",
    status: "active",
    avatar: "FN",
  },
  {
    id: "3",
    name: "Full Name",
    email: "contact@maghrebcom.store",
    phone: "+212 632-002529",
    role: "Staff",
    dateAdded: "15 juin 2025",
    status: "active",
    avatar: "FN",
  },
  {
    id: "4",
    name: "Full Name",
    email: "contact@maghrebcom.store",
    phone: "+212 632-002529",
    role: "Staff",
    dateAdded: "15 juin 2025",
    status: "disable",
    avatar: "FN",
  },
]

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)
  const [memberIdForReset, setMemberIdForReset] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', username: '', password: '', permissions: [] as string[] })
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPermissionsModal, setShowPermissionsModal] = useState(false)
  const [memberForPermissions, setMemberForPermissions] = useState<TeamMember | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMembers, setIsLoadingMembers] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showPermissionsDropdown, setShowPermissionsDropdown] = useState(false)
  const permissionsDropdownRef = React.useRef<HTMLDivElement | null>(null)
  const [showSuccessCard, setShowSuccessCard] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [successProfileImage, setSuccessProfileImage] = useState("")
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    permissions: [] as string[]
  })

  // Show alert dialog helper
  const showAlert = (title: string, message: string, variant: "success" | "error" | "warning" | "info" = "info") => {
    setAlertDialog({ isOpen: true, title, message, variant })
  }

  const availablePermissions = [
    { id: "dashboard", name: "Dashboard" },
    { id: "partner", name: "Partner" },
    { id: "subscription", name: "Subscription" },
    { id: "support", name: "Support" },
    { id: "billingFinance", name: "Billing Finance" },
  ]

  // Fetch members from API
  const fetchMembers = async () => {
    try {
      setIsLoadingMembers(true)
      const token = getAuthToken()
      if (!token) {
        console.error('No auth token found')
        setIsLoadingMembers(false)
        return
      }

      console.log('Fetching members from API...')
      const response = await fetch('/api/superadmin/members', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('Members API response status:', response.status)
      console.log('Members API response ok:', response.ok)

      if (response.ok) {
        const result = await response.json()
        console.log('Members API result:', result)
        
        if (result.success && result.data && result.data.members) {
          // Transform API data to match TeamMember interface
          const transformedMembers: TeamMember[] = result.data.members.map((member: any) => ({
            id: member._id,
            name: member.name,
            email: member.email,
            phone: member.phone,
            username: member.username,
            role: member.role || 'member',
            dateAdded: new Date(member.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }),
            status: member.status || 'active',
            avatar: member.name ? member.name.split(' ').map((n: string) => n.charAt(0)).join('').toUpperCase().slice(0, 2) : 'M',
            permissions: member.permissions || []
          }))
          
          console.log('Transformed members:', transformedMembers)
          setTeamMembers(transformedMembers)
        } else {
          console.error('Members API returned error:', result.error)
          setTeamMembers([])
        }
      } else {
        const errorResult = await response.json()
        console.error('Members API error response:', errorResult)
        setTeamMembers([])
      }
    } catch (error) {
      console.error('Error fetching members:', error)
      setTeamMembers([])
    } finally {
      setIsLoadingMembers(false)
    }
  }

  // Load members on component mount
  React.useEffect(() => {
    fetchMembers()
  }, [])

  const handleToggleActive = async (id: string) => {
    try {
      const token = getAuthToken()
      if (!token) {
        showAlert('Authentication Required', 'Please log in to update member status', 'warning')
        return
      }

      const member = teamMembers.find(m => m.id === id)
      if (!member) return

      // Fix: Toggle should save the opposite of current status
      const newStatus = member.status === 'active' ? 'disable' : 'active'
      
      const response = await fetch(`/api/superadmin/members/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Update local state
          setTeamMembers(teamMembers.map((m) => 
            m.id === id ? { ...m, status: newStatus } : m
          ))
          await fetchMembers() // Refresh the list
          console.log(`Member status updated to: ${newStatus}`)
          showAlert('Success', `Member status updated to ${newStatus}`, 'success')
        } else {
          console.error('API Error:', result.error)
          showAlert('Error', `Error updating status: ${result.error}`, 'error')
        }
      } else {
        const errorResult = await response.json()
        console.error('API Error:', errorResult.error)
        showAlert('Error', `Error updating status: ${errorResult.error}`, 'error')
      }
    } catch (error) {
      console.error('Error updating member status:', error)
      showAlert('Error', 'Failed to update member status. Please try again.', 'error')
    }
  }

  const handleDeleteMember = (member: TeamMember) => {
    setMemberToDelete(member)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!memberToDelete) return
    try {
      const token = getAuthToken()
      if (!token) {
        showAlert('Authentication Required', 'Please log in to delete a member', 'warning')
        return
      }

      const response = await fetch(`/api/superadmin/members/${memberToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const result = await response.json().catch(() => ({} as any))
        if ((result as any).success !== false) {
          setTeamMembers(teamMembers.filter((m) => m.id !== memberToDelete.id))
          showAlert('Success', 'Member deleted successfully', 'success')
        } else {
          showAlert('Error', `${(result as any).error || 'Failed to delete member'}`, 'error')
        }
      } else {
        const err = await response.json().catch(() => ({}))
        showAlert('Error', `${err.error || 'Failed to delete member'}`, 'error')
      }
    } catch (error) {
      console.error('Error deleting member:', error)
      showAlert('Error', 'Failed to delete member. Please try again.', 'error')
    } finally {
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
    setEditForm({ name: member.name, email: member.email, phone: member.phone, username: member.username || '', password: '', permissions: member.permissions || [] })
    setShowPermissionsDropdown(false)
  }

  const handleResetPassword = (member: TeamMember) => {
    setMemberIdForReset(member.id)
    setShowResetPasswordModal(true)
  }

  const handleAddMember = () => {
    setSelectedMember(null)
    setShowAddModal(true)
    setShowPermissionsDropdown(false)
    // Reset form data when opening add modal
    setFormData({
      name: '',
      email: '',
      phone: '',
      username: '',
      password: '',
      permissions: []
    })
    setEditForm({ name: '', email: '', phone: '', username: '', password: '', permissions: [] as string[] })
  }

  const handleUserPermissions = (member: TeamMember) => {
    setMemberForPermissions(member)
    setShowPermissionsModal(true)
  }

  // Handle form input changes
  const handleInputChange = (field: string, value: string | string[]) => {
    console.log(`Updating field ${field} with value:`, value)
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Save member function
  const saveMember = async () => {
    console.log('Form data before sending:', formData)
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'username', 'password']
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData])
    
    if (missingFields.length > 0) {
      showAlert('Validation Error', `Please fill in all required fields: ${missingFields.join(', ')}`, 'warning')
      return
    }
    
    setIsLoading(true)
    try {
      // Get authentication token using the proper utility
      const token = getAuthToken()
      console.log('Token found:', token ? 'Yes' : 'No')
      
      // Fallback: try to get token directly if utility function fails
      const fallbackToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
      const finalToken = token || fallbackToken
      
      if (!finalToken) {
        showAlert('Authentication Required', 'Please log in to create a member', 'warning')
        setIsLoading(false)
        return
      }

      const response = await fetch('/api/superadmin/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${finalToken}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          username: formData.username,
          password: formData.password,
          permissions: formData.permissions || []
        })
      })

      const result = await response.json()
      console.log('API Response:', result)

      if (result.success) {
        // Add the new member to the list
        const memberData = result.data.member || result.data;
        const newMember: TeamMember = {
          id: memberData._id,
          name: memberData.name,
          email: memberData.email,
          phone: memberData.phone,
          username: memberData.username,
          role: memberData.role || 'member',
          dateAdded: new Date(memberData.createdAt).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          status: memberData.status || "active",
          avatar: memberData.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
          permissions: memberData.permissions || []
        }
        
        setTeamMembers(prev => [newMember, ...prev])
        setShowAddModal(false)
        setShowPermissionsDropdown(false)
        
        // Reset form data
        setFormData({
          name: '',
          email: '',
          phone: '',
          username: '',
          password: '',
          permissions: []
        })
        
        // Show success card with member name
        const memberInitials = memberData.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
        setSuccessProfileImage(memberInitials)
        setSuccessMessage(`Member added successfully.\n${memberData.name}`)
        setShowSuccessCard(true)
        // Refresh the members list
        await fetchMembers()
      } else {
        console.error('API Error:', result.error)
        
        // Handle specific error types
        if (result.error && result.error.includes('already exists')) {
          showAlert('Error', `${result.error}`, 'error')
        } else if (result.error && result.error.includes('required')) {
          showAlert('Validation Error', `${result.error}`, 'error')
        } else {
          showAlert('Error', `${result.error}`, 'error')
        }
      }
    } catch (error) {
      console.error('Error saving member:', error)
      showAlert('Error', 'Failed to save member. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const closePermissionsModal = () => {
    setShowPermissionsModal(false)
    setMemberForPermissions(null)
  }

  const handleEditFromPermissions = () => {
    // This handler is no longer needed as the edit permissions modal
    // is now handled directly within the UserPermissionsModal component
  }

  const handleSaveEdit = async () => {
    if (!selectedMember) return
    try {
      const token = getAuthToken()
      if (!token) {
        showAlert('Authentication Required', 'Please log in to update member', 'warning')
        return
      }
      const response = await fetch(`/api/superadmin/members/${selectedMember.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editForm.name,
          email: editForm.email,
          phone: editForm.phone,
          username: editForm.username,
          ...(editForm.password ? { password: editForm.password } : {}),
        })
      })
      if (response.ok) {
        const result = await response.json().catch(() => ({}))
        if ((result as any).success === false) {
          showAlert('Error', `${(result as any).error || 'Failed to update member'}`, 'error')
        } else {
          setTeamMembers(prev => prev.map(m => m.id === selectedMember.id ? { ...m, name: editForm.name, email: editForm.email, phone: editForm.phone, username: editForm.username } : m))
          // Show success card with member name
          const memberInitials = editForm.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
          setSuccessProfileImage(memberInitials)
          setSuccessMessage(`Member updated successfully.\n${editForm.name}`)
          setShowSuccessCard(true)
          setShowEditModal(false)
          setShowPermissionsDropdown(false)
          setSelectedMember(null)
          await fetchMembers() // Refresh the list
        }
      } else {
        const err = await response.json().catch(() => ({}))
        showAlert('Error', `${err.error || 'Failed to update member'}`, 'error')
      }
    } catch (e) {
      console.error('Error updating member:', e)
      showAlert('Error', 'Failed to update member. Please try again.', 'error')
    }
  }


  const norm = (v: string) => v.toLowerCase()
  const filteredMembers = teamMembers.filter((m) => {
    if (!searchTerm) return true
    const q = norm(searchTerm)
    return (
      norm(m.name).includes(q) ||
      norm(m.email).includes(q) ||
      norm(m.phone).includes(q) ||
      ((m as any).username && norm((m as any).username).includes(q))
    )
  })

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentMembers = filteredMembers.slice(startIndex, endIndex)

  return (
    <div className="p-4">
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
              value={searchTerm}
              onChange={(e) => { setCurrentPage(1); setSearchTerm(e.target.value) }}
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

            <button 
              onClick={handleAddMember}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary/90 text-sm font-medium transition-colors" 
              style={{ borderRadius: "6px" }}
            >
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
                <th className="px-4 py-4 text-left">
                  <span style={{ color: "#000", fontSize: "12px", fontWeight: "500", lineHeight: "19.5px" }}>
                    Member Name
                  </span>
                </th>
                <th className="px-4 py-4 text-left">
                  <span style={{ color: "#000", fontSize: "12px", fontWeight: "500", lineHeight: "19.5px" }}>
                    Email
                  </span>
                </th>
                <th className="px-4 py-4 text-left">
                  <span style={{ color: "#000", fontSize: "12px", fontWeight: "500", lineHeight: "19.5px" }}>
                    Phone number
                  </span>
                </th>
                <th className="px-4 py-4 text-left">
                  <span style={{ color: "#000", fontSize: "12px", fontWeight: "500", lineHeight: "19.5px" }}>
                    Date added
                  </span>
                </th>
                <th className="px-4 py-4 text-left">
                  <span style={{ color: "#000", fontSize: "12px", fontWeight: "500", lineHeight: "19.5px" }}>
                    Complete
                  </span>
                </th>
                <th className="w-12 px-4 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoadingMembers ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      Loading members...
                    </div>
                  </td>
                </tr>
              ) : currentMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No members found
                  </td>
                </tr>
              ) : (
                currentMembers.map((member) => (
                <tr key={member.id} className="hover:bg-muted/50 transition-colors">
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
                    <ToggleSwitch checked={member.status === 'active'} onChange={() => handleToggleActive(member.id)} />
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
                          icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>,
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
                          onClick: () => handleResetPassword(member),
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
                ))
              )}
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
                onClick={() => {
                  setShowEditModal(false)
                  setShowPermissionsDropdown(false)
                }}
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
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
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
                        value={editForm.phone}
                        onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
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
                        value={editForm.email}
                        onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
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
                    <div className="flex flex-col gap-2 relative" ref={permissionsDropdownRef}>
                      <label className="text-sm font-medium text-[#212121]">Permissions</label>
                      <div className="relative">
                        <div
                          onClick={() => setShowPermissionsDropdown(!showPermissionsDropdown)}
                          className="w-full px-3 py-2 border rounded pr-10 cursor-pointer flex items-center"
                          style={{
                            padding: "7.52px 12px",
                            borderRadius: "4px",
                            border: "1px solid #CED4DA",
                            background: "#FFF",
                            minHeight: "36px"
                          }}
                        >
                          {editForm.permissions && Array.isArray(editForm.permissions) && editForm.permissions.length > 0 ? (
                            <span className="text-sm" style={{ color: "#212121" }}>
                              {editForm.permissions.length} permission{editForm.permissions.length > 1 ? 's' : ''} selected
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">Select permissions</span>
                          )}
                        </div>
                        <svg
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none transition-transform"
                          style={{ 
                            color: "#D9D9D9",
                            transform: showPermissionsDropdown ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%)'
                          }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        {showPermissionsDropdown && (
                          <div
                            className="absolute z-50 w-full mt-1 bg-white border rounded shadow-lg"
                            style={{
                              borderRadius: "4px",
                              border: "1px solid #CED4DA",
                              background: "#FFF",
                              maxHeight: "200px",
                              overflowY: "auto",
                              top: "100%",
                              marginTop: "4px"
                            }}
                          >
                            <div className="flex flex-col gap-1 p-2">
                              {availablePermissions.map((permission) => (
                                <label
                                  key={permission.id}
                                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                                  style={{
                                    padding: "4px 8px",
                                    borderRadius: "4px"
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <input
                                    type="checkbox"
                                    checked={editForm.permissions && Array.isArray(editForm.permissions) && editForm.permissions.includes(permission.id)}
                                    onChange={(e) => {
                                      e.stopPropagation()
                                      const currentPerms = (editForm.permissions && Array.isArray(editForm.permissions)) ? editForm.permissions : []
                                      if (e.target.checked) {
                                        setEditForm(prev => ({ ...prev, permissions: [...currentPerms, permission.id] }))
                                      } else {
                                        setEditForm(prev => ({ ...prev, permissions: currentPerms.filter((p: string) => p !== permission.id) }))
                                      }
                                    }}
                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                    style={{
                                      accentColor: "#1F2A44"
                                    }}
                                  />
                                  <span className="text-sm" style={{ color: "#212121" }}>
                                    {permission.name}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
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
                      value={showEditModal ? (editForm.username || '') : (formData.username || '')}
                      onChange={(e) => {
                        if (showEditModal) {
                          setEditForm(prev => ({ ...prev, username: e.target.value }))
                        } else {
                          handleInputChange('username', e.target.value)
                        }
                      }}
                      autoComplete="off"
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
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={showEditModal ? (editForm.password || '') : (formData.password || '')}
                        onChange={(e) => {
                          if (showEditModal) {
                            setEditForm(prev => ({ ...prev, password: e.target.value }))
                          } else {
                            handleInputChange('password', e.target.value)
                          }
                        }}
                        autoComplete="new-password"
                        className="w-full px-3 py-2 pr-10 border border-[#CED4DA] rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        style={{
                          padding: "7.52px 12px",
                          border: "1px solid #CED4DA",
                          borderRadius: "4px",
                          background: "#FFF"
                        }}
                      />
                      <div onClick={() => setShowPassword(prev => !prev)} className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
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
                onClick={() => {
                  setShowEditModal(false)
                  setShowPermissionsDropdown(false)
                }}
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

      {/* Add Member Modal */}
      {showAddModal && (
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
              <h2 className="text-lg font-semibold text-black">Add Member</h2>
              <button 
                onClick={() => {
                  setShowAddModal(false)
                  setShowPermissionsDropdown(false)
                }}
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
                        placeholder="Write Here..."
                      value={editForm.username ?? formData.username ?? ''}
                      onChange={(e) => {
                        if (showEditModal) {
                          setEditForm(prev => ({ ...prev, username: e.target.value }))
                        } else {
                          handleInputChange('username', e.target.value)
                        }
                      }}
                        className="w-full px-3 py-2 border border-[#CED4DA] rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        style={{
                          padding: "7.52px 12px",
                          border: "1px solid #CED4DA",
                          borderRadius: "4px",
                          background: "#FFF"
                        }}
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-[#212121]">Phone number</label>
                      <input
                        type="text"
                        placeholder="Write Here..."
                      value={editForm.username ?? formData.username ?? ''}
                      onChange={(e) => {
                        if (showEditModal) {
                          setEditForm(prev => ({ ...prev, username: e.target.value }))
                        } else {
                          handleInputChange('username', e.target.value)
                        }
                      }}
                        className="w-full px-3 py-2 border border-[#CED4DA] rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        style={{
                          padding: "7.52px 12px",
                          border: "1px solid #CED4DA",
                          borderRadius: "4px",
                          background: "#FFF"
                        }}
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-[#212121]">Email</label>
                      <input
                        type="email"
                        placeholder="Write Here..."
                      value={editForm.username ?? formData.username ?? ''}
                      onChange={(e) => {
                        if (showEditModal) {
                          setEditForm(prev => ({ ...prev, username: e.target.value }))
                        } else {
                          handleInputChange('username', e.target.value)
                        }
                      }}
                        className="w-full px-3 py-2 border border-[#CED4DA] rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        style={{
                          padding: "7.52px 12px",
                          border: "1px solid #CED4DA",
                          borderRadius: "4px",
                          background: "#FFF"
                        }}
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-2 relative" ref={permissionsDropdownRef}>
                      <label className="text-sm font-medium text-[#212121]">Permissions</label>
                      <div className="relative">
                        <div
                          onClick={() => setShowPermissionsDropdown(!showPermissionsDropdown)}
                          className="w-full px-3 py-2 border rounded pr-10 cursor-pointer flex items-center"
                          style={{
                            padding: "7.52px 12px",
                            borderRadius: "4px",
                            border: "1px solid #CED4DA",
                            background: "#FFF",
                            minHeight: "36px"
                          }}
                        >
                          {formData.permissions.length === 0 ? (
                            <span className="text-gray-400 text-sm">Select permissions</span>
                          ) : (
                            <span className="text-sm" style={{ color: "#212121" }}>
                              {formData.permissions.length} permission{formData.permissions.length > 1 ? 's' : ''} selected
                            </span>
                          )}
                        </div>
                        <svg
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none transition-transform"
                          style={{ 
                            color: "#D9D9D9",
                            transform: showPermissionsDropdown ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%)'
                          }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        {showPermissionsDropdown && (
                          <div
                            className="absolute z-50 w-full mt-1 bg-white border rounded shadow-lg"
                            style={{
                              borderRadius: "4px",
                              border: "1px solid #CED4DA",
                              background: "#FFF",
                              maxHeight: "200px",
                              overflowY: "auto",
                              top: "100%",
                              marginTop: "4px"
                            }}
                          >
                            <div className="flex flex-col gap-1 p-2">
                              {availablePermissions.map((permission) => (
                                <label
                                  key={permission.id}
                                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                                  style={{
                                    padding: "4px 8px",
                                    borderRadius: "4px"
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <input
                                    type="checkbox"
                                    checked={formData.permissions.includes(permission.id)}
                                    onChange={(e) => {
                                      e.stopPropagation()
                                      if (e.target.checked) {
                                        handleInputChange('permissions', [...formData.permissions, permission.id])
                                      } else {
                                        handleInputChange('permissions', formData.permissions.filter(p => p !== permission.id))
                                      }
                                    }}
                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                    style={{
                                      accentColor: "#1F2A44"
                                    }}
                                  />
                                  <span className="text-sm" style={{ color: "#212121" }}>
                                    {permission.name}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
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
                      value={showEditModal ? (editForm.username || '') : (formData.username || '')}
                      onChange={(e) => {
                        if (showEditModal) {
                          setEditForm(prev => ({ ...prev, username: e.target.value }))
                        } else {
                          handleInputChange('username', e.target.value)
                        }
                      }}
                      autoComplete="off"
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
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={showEditModal ? (editForm.password || '') : (formData.password || '')}
                        onChange={(e) => {
                          if (showEditModal) {
                            setEditForm(prev => ({ ...prev, password: e.target.value }))
                          } else {
                            handleInputChange('password', e.target.value)
                          }
                        }}
                        autoComplete="new-password"
                        className="w-full px-3 py-2 pr-10 border border-[#CED4DA] rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        style={{
                          padding: "7.52px 12px",
                          border: "1px solid #CED4DA",
                          borderRadius: "4px",
                          background: "#FFF"
                        }}
                      />
                      <div onClick={() => setShowPassword(prev => !prev)} className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
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
                borderTop: "1px solid rgba(0, 0, 0, 0.04)",
                borderRadius: "0 0 10px 10px",
                background: "#FFF"
              }}
            >
              <button 
                onClick={() => {
                  setShowAddModal(false)
                  setShowPermissionsDropdown(false)
                }}
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
                onClick={saveMember}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                style={{ 
                  padding: "8.52px 20px", 
                  borderRadius: "6px", 
                  background: "#1F2A44" 
                }}
              >
                {isLoading ? 'Adding...' : 'Add member'}
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
                gap: "10px"
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
        onSuccess={(message) => {
          setShowSuccessCard(true)
          setSuccessMessage(message)
        }}
      />

      {/* Reset Password Modal */}
      <ResetPasswordModal
        isOpen={showResetPasswordModal}
        onClose={() => {
          setShowResetPasswordModal(false)
          setMemberIdForReset(null)
        }}
        memberId={memberIdForReset || undefined}
        activeTab="members"
        onSuccess={() => {
          setShowResetPasswordModal(false)
          setMemberIdForReset(null)
          // Show success card instead of alert
          setShowSuccessCard(true)
          setSuccessMessage('Password updated successfully')
          // Optionally refresh members list
          fetchMembers()
        }}
      />

      {/* Success Card */}
      <SuccessCard
        isOpen={showSuccessCard}
        message={successMessage}
        profileImage={successProfileImage}
        onClose={() => {
          setShowSuccessCard(false)
          setSuccessMessage("")
          setSuccessProfileImage("")
        }}
      />

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
