"use client"

 import { useState, useEffect } from "react"
import { getAuthToken } from "@/lib/auth-utils"
import {
  RiMoreLine,
  RiDeleteBinLine,
  RiAddLine,
} from "react-icons/ri"
import ToggleSwitch from "@/app/superadmin/components/toggle-switch"
import DropdownMenu from "@/app/superadmin/components/dropdown-menu"
import UserPermissionsModal from "@/app/partner/components/user-permissions-modal"
import DropdownArrow from "@/app/superadmin/components/dropdown-arrow"
import SortArrows from "@/app/superadmin/components/sort-arrows"
import { LeftArrow, RightArrow } from "@/app/superadmin/components/pagination-arrows"
import AddStaffModal from "@/app/partner/components/add-staff-modal"
import AddMemberModal from "@/app/partner/components/add-member-modal"
import ResetPasswordModal from "@/app/partner/components/reset-password-modal"
import PublicIcon from "@/app/partner/components/public-icon"

interface TeamMember {
  id: string
  name: string
  email: string
  phone: string
  dateAdded: string
  isActive: boolean
  avatar: string
}

interface StaffMember {
  id: string
  name: string
  email: string
  phone: string
  role: string
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

const mockStaffMembers: StaffMember[] = [
  {
    id: "1",
    name: "Full Name",
    email: "Email@gamail.com",
    phone: "+212 632-002529",
    role: "Role",
    dateAdded: "15 juin 2025",
    isActive: true,
    avatar: "FN",
  },
  {
    id: "2",
    name: "Full Name",
    email: "Email@gamail.com",
    phone: "+212 632-002529",
    role: "Role",
    dateAdded: "15 juin 2025",
    isActive: true,
    avatar: "FN",
  },
  {
    id: "3",
    name: "Full Name",
    email: "Email@gamail.com",
    phone: "+212 632-002529",
    role: "Role",
    dateAdded: "15 juin 2025",
    isActive: true,
    avatar: "FN",
  },
  {
    id: "4",
    name: "Full Name",
    email: "Email@gamail.com",
    phone: "+212 632-002529",
    role: "Role",
    dateAdded: "15 juin 2025",
    isActive: false,
    avatar: "FN",
  },
]

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState<'members' | 'staff'>('members')
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | StaffMember | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | StaffMember | null>(null)
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    username: '',
    password: '',
    status: 'active' as 'active' | 'disabled'
  })
  const [isSavingEdit, setIsSavingEdit] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showPermissionsModal, setShowPermissionsModal] = useState(false)
  const [memberForPermissions, setMemberForPermissions] = useState<TeamMember | StaffMember | null>(null)
  const [showAddStaffModal, setShowAddStaffModal] = useState(false)
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)
  const [memberForPasswordReset, setMemberForPasswordReset] = useState<TeamMember | StaffMember | null>(null)
  const [isLoadingMembers, setIsLoadingMembers] = useState(true)
  const [isLoadingStaff, setIsLoadingStaff] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch partner members from API
  const fetchMembers = async () => {
    try {
      setIsLoadingMembers(true)
      const token = getAuthToken()
      if (!token) {
        console.error('No auth token found')
        setIsLoadingMembers(false)
        return
      }

      const searchParam = searchQuery.trim() ? `&search=${encodeURIComponent(searchQuery.trim())}` : ''
      const response = await fetch(`/api/partner/members?page=${currentPage}&limit=${itemsPerPage}${searchParam}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data && result.data.members) {
          const transformedMembers: TeamMember[] = result.data.members.map((member: any) => ({
            id: member._id,
            name: member.memberName,
            email: member.email,
            phone: member.phoneNumber,
            dateAdded: new Date(member.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }),
            isActive: member.status === 'active',
            avatar: member.memberName ? member.memberName.split(' ').map((n: string) => n.charAt(0)).join('').toUpperCase().slice(0, 2) : 'M'
          }))
          setTeamMembers(transformedMembers)
        } else {
          setTeamMembers([])
        }
      } else {
        console.error('Failed to fetch members')
        setTeamMembers([])
      }
    } catch (error) {
      console.error('Error fetching members:', error)
      setTeamMembers([])
    } finally {
      setIsLoadingMembers(false)
    }
  }

  // Fetch staff from API
  const fetchStaff = async () => {
    try {
      setIsLoadingStaff(true)
      const token = getAuthToken()
      if (!token) {
        console.error('No auth token found')
        setIsLoadingStaff(false)
        return
      }

      const searchParam = searchQuery.trim() ? `&search=${encodeURIComponent(searchQuery.trim())}` : ''
      const response = await fetch(`/api/partner/staff?page=${currentPage}&limit=${itemsPerPage}${searchParam}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data && result.data.staff) {
          const transformedStaff: StaffMember[] = result.data.staff.map((staff: any) => ({
            id: staff._id,
            name: staff.staffName,
            email: staff.email,
            phone: staff.phoneNumber,
            role: staff.role || '',
            dateAdded: new Date(staff.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }),
            isActive: staff.status === 'active',
            avatar: staff.staffName ? staff.staffName.split(' ').map((n: string) => n.charAt(0)).join('').toUpperCase().slice(0, 2) : 'S'
          }))
          setStaffMembers(transformedStaff)
        } else {
          setStaffMembers([])
        }
      } else {
        console.error('Failed to fetch staff')
        setStaffMembers([])
      }
    } catch (error) {
      console.error('Error fetching staff:', error)
      setStaffMembers([])
    } finally {
      setIsLoadingStaff(false)
    }
  }

  // Reset page to 1 when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // Load data when component mounts or tab changes
  useEffect(() => {
    if (activeTab === 'members') {
      fetchMembers()
    } else {
      fetchStaff()
    }
  }, [activeTab, currentPage, itemsPerPage, searchQuery])

  const handleToggleActive = async (id: string) => {
    try {
      const token = getAuthToken()
      if (!token) {
        alert('Please log in to update member status')
        return
      }

      if (activeTab === 'members') {
        const member = teamMembers.find(m => m.id === id)
        if (!member) return
        
        const newStatus = member.isActive ? 'disable' : 'active'
        const response = await fetch(`/api/partner/members/${id}`, {
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
            setTeamMembers(teamMembers.map((m) => (m.id === id ? { ...m, isActive: !m.isActive } : m)))
            alert(`✅ Member status updated`)
          } else {
            alert(`❌ Error: ${result.error}`)
          }
        }
      } else {
        // Staff status toggle - same functionality as members
        const staff = staffMembers.find(m => m.id === id)
        if (!staff) {
          console.error('Staff not found:', id)
          return
        }
        
        const newStatus = staff.isActive ? 'disabled' : 'active'
        console.log('Toggling staff status:', { id, currentStatus: staff.isActive, newStatus })
        
        const response = await fetch(`/api/partner/staff/${id}`, {
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
            // Update local state immediately
            setStaffMembers(prev => prev.map((m) => 
              m.id === id ? { ...m, isActive: newStatus === 'active' } : m
            ))
            alert(`✅ Staff status updated to ${newStatus}`)
            // Refresh the list to ensure consistency with server
            fetchStaff()
          } else {
            alert(`❌ Error: ${result.error || 'Failed to update staff status'}`)
          }
        } else {
          const errorResult = await response.json().catch(() => ({}))
          console.error('Staff status update failed:', { status: response.status, error: errorResult })
          alert(`❌ Error: ${errorResult.error || `Failed to update staff status (${response.status})`}`)
        }
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status. Please try again.')
    }
  }

  const handleDeleteMember = (member: TeamMember | StaffMember) => {
    setMemberToDelete(member)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!memberToDelete) return
    
    try {
      const token = getAuthToken()
      if (!token) {
        alert('Please log in to delete member')
        return
      }

      if (activeTab === 'members') {
        const response = await fetch(`/api/partner/members/${memberToDelete.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        const result = await response.json()
        if (response.ok && result.success) {
          setTeamMembers(teamMembers.filter((m) => m.id !== memberToDelete.id))
          setShowDeleteModal(false)
          setMemberToDelete(null)
          alert('✅ Member deleted successfully')
        } else {
          alert(result.error || 'Failed to delete member')
        }
      } else {
        const response = await fetch(`/api/partner/staff/${memberToDelete.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        const result = await response.json()
        if (response.ok && result.success) {
          setStaffMembers(staffMembers.filter((m) => m.id !== memberToDelete.id))
          setShowDeleteModal(false)
          setMemberToDelete(null)
          alert('✅ Staff deleted successfully')
        } else {
          alert(result.error || 'Failed to delete staff')
        }
      }
    } catch (error) {
      console.error('Error deleting member:', error)
      alert('Failed to delete. Please try again.')
    }
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setMemberToDelete(null)
  }

  const handleEditMember = async (member: TeamMember | StaffMember) => {
    setSelectedMember(member)
    setEditFormData({
      name: member.name || '',
      email: member.email || '',
      phone: member.phone || '',
      role: 'role' in member ? (member as StaffMember).role : '',
      username: '',
      password: '',
      status: member.isActive ? 'active' : 'disabled'
    })
    
    // Fetch full data to get username (for both staff and members)
    try {
      const token = getAuthToken()
      if (token) {
        const endpoint = activeTab === 'staff' 
          ? `/api/partner/staff/${member.id}`
          : `/api/partner/members/${member.id}`
        
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const result = await response.json()
          
          if (activeTab === 'staff') {
            if (result.success && result.data?.staff) {
              const staffData = result.data.staff
              console.log('Fetched staff data:', staffData)
              console.log('Staff status from API:', staffData.status)
              setEditFormData(prev => ({
                ...prev,
                username: staffData.username || '',
                // Update other fields in case they changed
                name: staffData.staffName || prev.name,
                email: staffData.email || prev.email,
                phone: staffData.phoneNumber || prev.phone,
                role: staffData.role || prev.role,
                status: (staffData.status === 'active' || staffData.status === 'disabled') ? staffData.status : (prev.status || 'active')
              }))
              console.log('Updated form data with status:', (staffData.status === 'active' || staffData.status === 'disabled') ? staffData.status : 'active')
            } else {
              console.warn('Failed to load staff details, using existing data')
            }
          } else {
            // Member data
            if (result.success && result.data?.member) {
              const memberData = result.data.member
              console.log('Fetched member data:', memberData)
              setEditFormData(prev => ({
                ...prev,
                username: memberData.username || '',
                // Update other fields in case they changed
                name: memberData.memberName || prev.name,
                email: memberData.email || prev.email,
                phone: memberData.phoneNumber || prev.phone,
                status: (memberData.status === 'active' || memberData.status === 'disable') 
                  ? (memberData.status === 'disable' ? 'disabled' : 'active') 
                  : (prev.status || 'active')
              }))
            } else {
              console.warn('Failed to load member details, using existing data')
            }
          }
        } else {
          console.warn(`Failed to fetch ${activeTab} details, status:`, response.status)
        }
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab} details:`, error)
      // Don't prevent modal from opening if fetch fails
    }
    
    setShowEditModal(true)
  }

  const handleUserPermissions = (member: TeamMember | StaffMember) => {
    setMemberForPermissions(member)
    setShowPermissionsModal(true)
  }

  const handleResetPassword = (member: TeamMember | StaffMember) => {
    setMemberForPasswordReset(member)
    setShowResetPasswordModal(true)
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
    if (!selectedMember) {
      alert('No staff member selected')
      return
    }

    // Trim and validate required fields
    const name = editFormData.name?.trim()
    const email = editFormData.email?.trim()
    const phone = editFormData.phone?.trim()
    const role = editFormData.role?.trim()
    const username = editFormData.username?.trim()
    const password = editFormData.password?.trim()

    if (!name || !email || !phone) {
      alert('Please fill in all required fields (Name, Email, Phone)')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address')
      return
    }

    // Validate role for staff
    if (activeTab === 'staff' && !role) {
      alert('Please select a role for staff')
      return
    }

    // Validate password if provided
    if (password && password.length < 6) {
      alert('Password must be at least 6 characters long')
      return
    }

    setIsSavingEdit(true)
    try {
      const token = getAuthToken()
      if (!token) {
        alert('Please log in to update')
        setIsSavingEdit(false)
        return
      }

      if (activeTab === 'members') {
        // Update member
        const memberData: any = {
          memberName: name,
          email: email.toLowerCase(),
          phoneNumber: phone
        }
        
        // Only include password if it's provided
        if (password) {
          memberData.password = password
        }

        const response = await fetch(`/api/partner/members/${selectedMember.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(memberData)
        })

        // Read response text once
        const responseText = await response.text()
        const contentType = response.headers.get('content-type')
        const isJson = contentType?.includes('application/json')

        let result: any = {}
        
        if (isJson && responseText) {
          try {
            result = JSON.parse(responseText)
          } catch (parseError) {
            console.error('Failed to parse JSON response:', parseError)
            console.error('Response status:', response.status)
            console.error('Response text:', responseText)
            
            if (!response.ok) {
              throw new Error(`Server error (${response.status}): ${response.statusText || 'Unknown error'}`)
            }
            throw new Error('Invalid JSON response from server')
          }
        } else if (!response.ok) {
          // Non-JSON error response
          console.error('Non-JSON error response:', responseText)
          throw new Error(`Server error (${response.status}): ${response.statusText || responseText || 'Unknown error'}`)
        }

        if (response.ok && result.success) {
          setTeamMembers(prev => prev.map(m => 
            m.id === selectedMember.id 
              ? { ...m, name, email: email.toLowerCase(), phone }
              : m
          ))
          alert('✅ Member updated successfully')
          setEditFormData({ name: '', email: '', phone: '', role: '', username: '', password: '', status: 'active' })
    setShowEditModal(false)
    setSelectedMember(null)
          fetchMembers() // Refresh the list
        } else {
          const errorMsg = result?.error || result?.message || 'Failed to update member'
          alert(`❌ Error: ${errorMsg}`)
        }
      } else {
        // Update staff - build data object carefully
        const updateData: any = {
          staffName: name,
          email: email.toLowerCase(),
          phoneNumber: phone,
          role: role
          // Note: Status is not updated via edit modal, only via toggle switch
        }
        
        // Only include username if it's provided and not empty (to avoid overwriting with empty string)
        if (username && username.trim().length > 0) {
          updateData.username = username.trim()
        }
        
        // Only include password if it's provided and not empty (optional field)
        if (password && password.trim().length > 0) {
          updateData.password = password.trim()
        }

        console.log('Updating staff:', selectedMember.id, updateData)
        
        const response = await fetch(`/api/partner/staff/${selectedMember.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updateData)
        })
        
        console.log('Response status:', response.status, response.statusText)

        // Read response text once
        const responseText = await response.text()
        const contentType = response.headers.get('content-type')
        const isJson = contentType?.includes('application/json')

        console.log('Response content-type:', contentType)
        console.log('Response text length:', responseText?.length)
        console.log('Response text preview:', responseText?.substring(0, 200))

        let result: any = {}
        
        if (isJson && responseText) {
          try {
            result = JSON.parse(responseText)
            console.log('Parsed result:', result)
          } catch (parseError: any) {
            console.error('Failed to parse JSON response:', parseError)
            console.error('Response status:', response.status)
            console.error('Response text:', responseText)
            console.error('Response headers:', Object.fromEntries(response.headers.entries()))
            
            if (!response.ok) {
              const errorMsg = `Server error (${response.status}): ${response.statusText || 'Unknown error'}`
              console.error(errorMsg)
              throw new Error(errorMsg)
            }
            throw new Error(`Invalid JSON response from server: ${parseError.message}`)
          }
        } else if (!response.ok) {
          // Non-JSON error response
          console.error('Non-JSON error response. Status:', response.status)
          console.error('Response text:', responseText)
          
          // Try to extract error message if it's HTML
          let errorMessage = response.statusText || 'Unknown error'
          if (responseText) {
            // Check if it's an HTML error page
            if (responseText.includes('<')) {
              errorMessage = `Server returned HTML error page (${response.status})`
            } else {
              errorMessage = responseText.substring(0, 200)
            }
          }
          
          throw new Error(`Server error (${response.status}): ${errorMessage}`)
        } else if (!isJson && response.ok && !responseText) {
          // Empty successful response
          console.warn('Empty response received, assuming success')
          result = { success: true }
        }

        if (response.ok && result.success) {
          // Update local state
          setStaffMembers(prev => prev.map(m => 
            m.id === selectedMember.id 
              ? { 
                  ...m, 
                  name, 
                  email: email.toLowerCase(), 
                  phone,
                  role,
                  isActive: editFormData.status === 'active'
                }
              : m
          ))
          alert('✅ Staff updated successfully')
          setEditFormData({ name: '', email: '', phone: '', role: '', username: '', password: '', status: 'active' })
          setShowEditModal(false)
          setSelectedMember(null)
          
          // Refresh the list to ensure we have latest data
          await fetchStaff()
        } else {
          // Handle different error scenarios
          const errorMsg = result?.error || result?.message || `Failed to update staff (Status: ${response.status})`
          alert(`❌ Error: ${errorMsg}`)
          console.error('Update failed:', { status: response.status, result })
        }
      }
    } catch (error: any) {
      console.error('Error updating:', error)
      const errorMsg = error?.message || 'Network error or server unavailable. Please try again.'
      alert(`❌ Error: ${errorMsg}`)
    } finally {
      setIsSavingEdit(false)
    }
  }

  const currentData = activeTab === 'members' ? teamMembers : staffMembers
  const totalPages = Math.ceil(currentData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentMembers = currentData.slice(startIndex, endIndex)

  return (
    <div className="p-6">
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex">
          <button
            onClick={() => setActiveTab('members')}
            className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'members'
                ? 'text-foreground border-b-2 border-primary -mb-[2px]'
                : 'text-muted-foreground hover:text-foreground border-b-2 border-[#EDEDED] -mb-[2px]'
            }`}
            style={{ width: "270px" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Members
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'staff'
                ? 'text-foreground border-b-2 border-primary -mb-[2px]'
                : 'text-muted-foreground hover:text-foreground border-b-2 border-[#EDEDED] -mb-[2px]'
            }`}
            style={{ width: "270px" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7h-4V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM10 5h4v2h-4V5z" />
            </svg>
            Staff
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-card rounded-lg p-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-4  border-border">
          <h3 className="text-base font-semibold text-foreground">
            {activeTab === 'members' ? 'Members' : 'Staff list'}
          </h3>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

            {activeTab === 'staff' && (
              <div className="relative">
                <select
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
                  <option value="">Role</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="staff">Staff</option>
                  <option value="receptionist">Receptionist</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <DropdownArrow />
                </div>
              </div>
            )}

            <button 
              onClick={() => activeTab === 'members' ? setShowAddMemberModal(true) : setShowAddStaffModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary/90 text-sm font-medium transition-colors"
              style={{ borderRadius: "6px" }}
            >
              <RiAddLine className="w-5 h-5" />
              {activeTab === 'members' ? 'Add Member' : 'Add Staff'}
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
                    <span style={{ 
                      color: "#000", 
                      fontSize: "12px", 
                      fontWeight: "500", 
                      lineHeight: "19.5px" 
                    }}>
                      {activeTab === 'members' ? 'Member Name' : 'Staff Name'}
                    </span>
                  </div>
                </th>
                <th className="px-4 py-4 text-left">
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
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
                {activeTab === 'staff' && (
                  <th className="px-4 py-4 text-left">
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ 
                        color: "#000", 
                        fontSize: "12px", 
                        fontWeight: "500", 
                        lineHeight: "19.5px" 
                      }}>
                        Role
                      </span>
                    </div>
                  </th>
                )}
                <th className="px-4 py-4 text-left">
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
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
                    <span style={{ 
                      color: "#000", 
                      fontSize: "12px", 
                      fontWeight: "500", 
                      lineHeight: "19.5px" 
                    }}>
                      {activeTab === 'members' ? 'Complete' : 'Compte'}
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
                  {activeTab === 'staff' && (
                    <td className="px-4 py-4" style={{
                      color: "#525866",
                      fontSize: "12px",
                      fontWeight: "400",
                      lineHeight: "19.5px"
                    }}>
                      {'role' in member ? (member as StaffMember).role : ''}
                    </td>
                  )}
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
                      items={
                        activeTab === 'staff'
                          ? [
                              {
                                label: "Edit",
                                icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>,
                                onClick: () => handleEditMember(member),
                              },
                              {
                                label: "Reset password",
                                icon: <PublicIcon src="/assets/icons/resset password.svg" alt="Reset password" width={16} height={16} />,
                                onClick: () => handleResetPassword(member),
                              },
                              {
                                label: "Supprimer",
                                icon: <RiDeleteBinLine className="w-4 h-4" style={{ color: "#FF0D0D" }} />,
                                onClick: () => handleDeleteMember(member),
                                variant: "danger",
                              },
                            ]
                          : [
                        {
                          label: "Edit",
                          icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>,
                          onClick: () => handleEditMember(member),
                        },
                        {
                          label: "User Permissions",
                          icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>,
                          onClick: () => handleUserPermissions(member),
                        },
                        {
                          label: "Reset password",
                          icon: <PublicIcon src="/assets/icons/resset password.svg" alt="Reset password" width={16} height={16} />,
                                onClick: () => handleResetPassword(member),
                        },
                        {
                          label: "Supprimer",
                                icon: <RiDeleteBinLine className="w-4 h-4" style={{ color: "#FF0D0D" }} />,
                          onClick: () => handleDeleteMember(member),
                          variant: "danger",
                        },
                            ]
                      }
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
            Displaying {startIndex + 1}-{Math.min(endIndex, currentData.length)} results out of {currentData.length}
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
              <h2 className="text-lg font-semibold text-black">
                {activeTab === 'staff' ? 'Edit Staff' : 'Edit Member'}
              </h2>
              <button 
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedMember(null)
                  setShowPassword(false)
                  setEditFormData({ name: '', email: '', phone: '', role: '', username: '', password: '', status: 'active' })
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
            <div className="space-y-6" style={{ padding: "20px 16px" }}>
              {/* General Information Section */}
              <div className="space-y-3">
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
                      <label className="text-sm font-medium text-[#212121]">
                        {activeTab === 'staff' ? 'Staff Name' : 'Member Name'}
                      </label>
                      <input
                        type="text"
                        value={editFormData.name}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Write Here..."
                        className="w-full px-3 py-2 border border-[#CED4DA] rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        value={editFormData.phone}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Write Here..."
                        className="w-full px-3 py-2 border border-[#CED4DA] rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        value={editFormData.email}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Write Here..."
                        className="w-full px-3 py-2 border border-[#CED4DA] rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        style={{
                          padding: "7.52px 12px",
                          border: "1px solid #CED4DA",
                          borderRadius: "4px",
                          background: "#FFF"
                        }}
                      />
                    </div>
                    {activeTab === 'staff' ? (
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-[#212121]">Role</label>
                        <div className="relative">
                          <select
                            value={editFormData.role}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, role: e.target.value }))}
                            className="w-full px-3 py-2 border border-[#CED4DA] rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
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
                            <option value="staff">Staff</option>
                            <option value="receptionist">Receptionist</option>
                          </select>
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                              <path d="M1 1.5L6 6.5L11 1.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    ) : (
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
                    )}
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
                      value={editFormData.username}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="Write Here..."
                      className="w-full px-3 py-2 border border-[#CED4DA] rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    <label className="text-sm font-medium text-[#212121]">Password (leave blank to keep current)</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={editFormData.password}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Enter new password (optional)"
                        className="w-full px-3 py-2 pr-10 border border-[#CED4DA] rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        style={{
                          padding: "7.52px 12px",
                          border: "1px solid #CED4DA",
                          borderRadius: "4px",
                          background: "#FFF"
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer hover:opacity-70 transition-opacity"
                        style={{ background: "none", border: "none", padding: "0" }}
                      >
                        {showPassword ? (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M2.66667 2.66667L13.3333 13.3333M9.33333 9.33333L8 10.6667M6.66667 6.66667L4 4M12 12L10.6667 10.6667M7.99967 3.33333C10.6667 3.33333 13.3333 6 13.3333 8C13.3333 8.66667 13.3333 9.33333 12.6667 10M9.33333 11.3333C8.66667 11.6667 8.33333 12 7.99967 12C5.33333 12 2.66667 9.33333 2.66667 6.66667C2.66667 5.33333 3.33333 4.66667 4 4" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M14.3623 5.21847C14.565 5.50268 14.6663 5.64479 14.6663 5.85514C14.6663 6.0655 14.565 6.20761 14.3623 6.49182C13.4516 7.76885 11.1258 10.5218 7.99968 10.5218C4.87353 10.5218 2.54774 7.76885 1.63704 6.49182C1.43435 6.20761 1.33301 6.0655 1.33301 5.85514C1.33301 5.64479 1.43435 5.50268 1.63703 5.21847C2.54774 3.94144 4.87353 1.18848 7.99968 1.18848C11.1258 1.18848 13.4516 3.94144 14.3623 5.21847Z" stroke="#141B34"/>
                          <path d="M10 5.85547C10 4.7509 9.10457 3.85547 8 3.85547C6.89543 3.85547 6 4.7509 6 5.85547C6 6.96004 6.89543 7.85547 8 7.85547C9.10457 7.85547 10 6.96004 10 5.85547Z" stroke="#121212"/>
                        </svg>
                        )}
                      </button>
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
                  setSelectedMember(null)
                  setShowPassword(false)
                  setEditFormData({ name: '', email: '', phone: '', role: '', username: '', password: '', status: 'active' })
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
                disabled={isSavingEdit}
                className="px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                style={{ 
                  padding: "8.52px 20px", 
                  borderRadius: "6px", 
                  background: "#1F2A44" 
                }}
              >
                {isSavingEdit 
                  ? 'Updating...' 
                  : activeTab === 'staff' 
                    ? 'Update Staff' 
                    : 'Update Member'
                }
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
      />

      {/* Add Staff Modal */}
      <AddStaffModal
        isOpen={showAddStaffModal}
        onClose={() => setShowAddStaffModal(false)}
        onSuccess={fetchStaff}
      />

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        onSuccess={fetchMembers}
      />

      {/* Reset Password Modal */}
      <ResetPasswordModal
        isOpen={showResetPasswordModal}
        onClose={() => {
          setShowResetPasswordModal(false)
          setMemberForPasswordReset(null)
        }}
        memberId={memberForPasswordReset?.id}
        activeTab={activeTab}
        onSuccess={() => {
          // Refresh the data after password reset
          if (activeTab === 'staff') {
            fetchStaff()
          } else {
            fetchMembers()
          }
        }}
      />
    </div>
  )
}
