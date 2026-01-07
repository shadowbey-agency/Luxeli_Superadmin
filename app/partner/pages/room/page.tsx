"use client"

import { useState, useEffect } from "react"
import { FaDownload } from "react-icons/fa"
import {
  RiMoreLine,
  RiDeleteBinLine,
  RiAddLine,
  RiHotelBedLine,
  RiUserLine,
  RiDownloadLine,
  RiDashboard2Fill,
} from "react-icons/ri"
import PublicIcon from "@/app/partner/components/public-icon"
import DropdownMenu from "@/app/superadmin/components/dropdown-menu"
import StatCard from "@/app/superadmin/components/stat-card"
import { LeftArrow, RightArrow } from "@/app/superadmin/components/pagination-arrows"
import { getAuthToken } from "@/lib/auth-utils"
import { QRCodeCanvas } from "qrcode.react"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import AlertDialog from "@/app/partner/components/alert-dialog"
import ConfirmationDialog from "@/app/partner/components/confirmation-dialog"

interface Room {
  id: string
  roomNumber: string
  roomName: string
  hotelName: string
  roomType: string
  capacity: string
  status: "Available" | "Occupied"
  price: string
  dateAdded: string
  avatar: string
  resident?: string
  residentEmail?: string
  residentPhoneNo?: string
  checkIn?: string
  checkOut?: string
  qrCodeImage?: string // base64 QR code image from API (contains JWT token)
}

interface RoomHistoryEntry {
  id: string
  name: string
  checkIn: string
  checkOut: string
}

// Reusable modal component - moved outside to prevent remounting on every render
const RoomModal = ({ 
  isOpen, 
  title, 
  onClose, 
  onSave, 
  children,
  width = "50vw",
  isLoading = false
}: { 
  isOpen: boolean
  title: string
  onClose: () => void
  onSave: () => void
  children: React.ReactNode
  width?: string
  isLoading?: boolean
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
      <div className="bg-white rounded-xl mx-4 max-h-[90vh] overflow-y-auto" style={{ width }}>
        {/* Header */}
        <div className="flex justify-between items-center border-b p-5 rounded-t-xl bg-white">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-black">{title}</h2>
            <p className="text-sm text-gray-500">
              {title === "Add Room" ? "Add a new room to the system" : "Borem ipsum dolor sit amet, consectetur adipiscing elit."}
            </p>
          </div>
          <button 
            onClick={onClose} 
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
              <path d="M18 6.52441L6 18.5244M6 6.52441L18 18.5244" stroke="#525866" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">{children}</div>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center border-t p-5 gap-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isLoading}
            className="px-5 py-2 text-sm font-medium text-white rounded-md hover:bg-primary/90 transition-colors bg-primary disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function RoomPage() {
  const [activeTab, setActiveTab] = useState<'rooms' | 'room-requests'>('rooms')
  const [rooms, setRooms] = useState<Room[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null)
  const [isBulkDelete, setIsBulkDelete] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [showQRModal, setShowQRModal] = useState(false)
  const [roomForQR, setRoomForQR] = useState<Room | null>(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [roomToAssign, setRoomToAssign] = useState<Room | null>(null)
  // Assign room form state
  const [assignResident, setAssignResident] = useState("")
  const [assignResidentEmail, setAssignResidentEmail] = useState("")
  const [assignResidentPhoneNo, setAssignResidentPhoneNo] = useState("")
  const [assignCheckInDate, setAssignCheckInDate] = useState("")
  const [assignCheckInTime, setAssignCheckInTime] = useState("")
  const [assignCheckOutDate, setAssignCheckOutDate] = useState("")
  const [assignCheckOutTime, setAssignCheckOutTime] = useState("")
  const [isAssigning, setIsAssigning] = useState(false)
  const [assignError, setAssignError] = useState<string | null>(null)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [roomForHistory, setRoomForHistory] = useState<Room | null>(null)
  const [roomHistory, setRoomHistory] = useState<RoomHistoryEntry[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [historySearchQuery, setHistorySearchQuery] = useState("")
  const [historyCurrentPage, setHistoryCurrentPage] = useState(1)
  const [historyItemsPerPage] = useState(20)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showUnassignModal, setShowUnassignModal] = useState(false)
  const [roomToUnassign, setRoomToUnassign] = useState<Room | null>(null)
  const [isUnassigning, setIsUnassigning] = useState(false)
  // Two-step add room flow
  const [showAddStepOne, setShowAddStepOne] = useState(false)
  const [newRoomName, setNewRoomName] = useState("")
  const [newRoomStatus, setNewRoomStatus] = useState<"Full" | "Empty">("Empty")
  // Selection state
  const [selectedRooms, setSelectedRooms] = useState<Set<string>>(new Set())
  // Form state for full room details
  const [newResident, setNewResident] = useState("")
  const [newResidentEmail, setNewResidentEmail] = useState("")
  const [newResidentPhoneNo, setNewResidentPhoneNo] = useState("")
  const [newCheckInDate, setNewCheckInDate] = useState("")
  const [newCheckInTime, setNewCheckInTime] = useState("")
  const [newCheckOutDate, setNewCheckOutDate] = useState("")
  const [newCheckOutTime, setNewCheckOutTime] = useState("")
  // Loading state
  const [isLoadingRooms, setIsLoadingRooms] = useState(true)
  // Pagination state
  const [totalRooms, setTotalRooms] = useState(0)
  // Period selection state
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "day">("month")
  // Room stats state with percentages
  const [roomStats, setRoomStats] = useState({
    totalRooms: 0,
    totalRoomsPercentage: "0",
    totalRoomsIsIncrease: true,
    emptyRooms: 0,
    emptyRoomsPercentage: "0",
    emptyRoomsIsIncrease: true,
    fullRooms: 0,
    fullRoomsPercentage: "0",
    fullRoomsIsIncrease: true
  })
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  // Alert and confirmation dialog state
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
  const [confirmationDialog, setConfirmationDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    variant: "danger" | "warning" | "info"
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    variant: "info"
  })

  const showAlert = (title: string, message: string, variant: "success" | "error" | "warning" | "info" = "info") => {
    setAlertDialog({ isOpen: true, title, message, variant })
  }

  const showConfirmation = (
    title: string,
    message: string,
    onConfirm: () => void,
    variant: "danger" | "warning" | "info" = "info"
  ) => {
    setConfirmationDialog({ isOpen: true, title, message, onConfirm, variant })
  }

  const handleRoomSelection = (roomId: string, isSelected: boolean) => {
    const newSelectedRooms = new Set(selectedRooms)
    if (isSelected) {
      newSelectedRooms.add(roomId)
    } else {
      newSelectedRooms.delete(roomId)
    }
    setSelectedRooms(newSelectedRooms)
  }

  const handleSelectAll = () => {
    // Use rooms directly since currentRooms is just an alias
    if (selectedRooms.size === rooms.length && rooms.length > 0) {
      setSelectedRooms(new Set())
    } else {
      setSelectedRooms(new Set(rooms.map(room => room.id)))
    }
  }

  // Map API room to UI Room interface
  const mapApiRoomToRoom = (apiRoom: any): Room => {
    const formatDate = (date: Date | string | null) => {
      if (!date) return undefined
      const d = new Date(date)
      return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    }
    const formatDateTime = (date: Date | string | null, time: string | null) => {
      if (!date) return undefined
      const d = new Date(date)
      const dateStr = formatDate(date)
      return time ? `${dateStr}, ${time}` : dateStr
    }
    
    // Extract guest data from the populated guest field (only if isActive=true)
    const guest = apiRoom.guest || null
    
    return {
      id: apiRoom._id || apiRoom.id,
      roomNumber: apiRoom.roomId || apiRoom.roomName || '',
      roomName: apiRoom.roomName || '',
      hotelName: "Hotel Name", // Could come from API if available
      roomType: "Standard", // Default
      capacity: "2", // Default
      status: apiRoom.roomStatus === 'full' ? 'Occupied' : 'Available',
      price: "500 MAD", // Default
      dateAdded: apiRoom.createdAt ? (formatDate(apiRoom.createdAt) || new Date().toLocaleDateString()) : new Date().toLocaleDateString(),
      avatar: (apiRoom.roomId || apiRoom.roomName || 'R').charAt(0).toUpperCase(),
      // Guest data from the guest object (only active guests)
      resident: guest?.guestName || null,
      residentEmail: guest?.guestEmail || null,
      residentPhoneNo: guest?.guestPhone || null,
      checkIn: guest?.checkInDate ? formatDate(guest.checkInDate) : undefined,
      checkOut: guest?.checkOutDate ? formatDate(guest.checkOutDate) : undefined,
    }
  }

  // Normalize display of room numbers (strip legacy "#" or "R-" prefixes)
  const displayRoomNumber = (roomNumber: string) =>
    (roomNumber || "")
      .replace(/^#/, "")
      .replace(/^R-?/i, "");

  // Fetch rooms from API
  const fetchRooms = async () => {
    try {
      setIsLoadingRooms(true)
      const token = getAuthToken()
      if (!token) {
        console.error('No auth token found')
        setIsLoadingRooms(false)
        return
      }
      const response = await fetch(`/api/partner/rooms?page=${currentPage}&limit=${itemsPerPage}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const result = await response.json()
        const mappedRooms = (result.items || []).map(mapApiRoomToRoom)
        setRooms(mappedRooms)
        setTotalRooms(result.total || 0)
      } else {
        console.error('Failed to fetch rooms')
        setRooms([])
        setTotalRooms(0)
      }
    } catch (error) {
      console.error('Error fetching rooms:', error)
      setRooms([])
    } finally {
      setIsLoadingRooms(false)
    }
  }

  // Fetch room stats with percentages
  const fetchRoomStats = async () => {
    try {
      setIsLoadingStats(true)
      const token = getAuthToken()
      if (!token) {
        console.error('No auth token found')
        setIsLoadingStats(false)
        return
      }

      const queryParams = new URLSearchParams({
        period: selectedPeriod
      })

      const response = await fetch(`/api/partner/general-stats?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          setRoomStats({
            totalRooms: result.data.totalRooms.current,
            totalRoomsPercentage: result.data.totalRooms.percentage,
            totalRoomsIsIncrease: result.data.totalRooms.isIncrease,
            emptyRooms: result.data.emptyRooms.current,
            emptyRoomsPercentage: result.data.emptyRooms.percentage,
            emptyRoomsIsIncrease: result.data.emptyRooms.isIncrease,
            fullRooms: result.data.fullRooms.current,
            fullRoomsPercentage: result.data.fullRooms.percentage,
            fullRoomsIsIncrease: result.data.fullRooms.isIncrease
          })
        }
      } else {
        console.error('Failed to fetch room stats')
      }
    } catch (error) {
      console.error('Error fetching room stats:', error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  // Fetch rooms on mount and when page/limit changes
  useEffect(() => {
    fetchRooms()
  }, [currentPage, itemsPerPage])

  // Fetch room stats when period changes
  useEffect(() => {
    fetchRoomStats()
  }, [selectedPeriod])

  const handleDeleteRoom = (room: Room) => {
    setRoomToDelete(room)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    // Prevent action if nothing selected
    if (isBulkDelete && selectedRooms.size === 0) return
    if (!isBulkDelete && !roomToDelete) return

    setIsDeletingRoom(true)

    try {
      const token = getAuthToken()
      if (!token) {
        showAlert('Authentication Required', 'Please log in to delete room', 'warning')
        return
      }

      if (isBulkDelete) {
        // Delete all selected rooms
        const deletePromises = Array.from(selectedRooms).map(roomId =>
          fetch(`/api/partner/rooms/${roomId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        )

        const results = await Promise.all(deletePromises)
        const failed = results.filter(r => !r.ok)

        if (failed.length === 0) {
          await fetchRooms()
          setShowDeleteModal(false)
          setSelectedRooms(new Set())
          setIsBulkDelete(false)
          showAlert('Success', 'Rooms deleted successfully', 'success')
        } else {
          showAlert('Error', `Failed to delete ${failed.length} room(s). Please try again.`, 'error')
        }
      } else {
        // Single delete
        const response = await fetch(`/api/partner/rooms/${roomToDelete!.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const result = await response.json()
        if (response.ok && result.success) {
          await fetchRooms()
          setShowDeleteModal(false)
          setRoomToDelete(null)
          showAlert('Success', 'Room deleted successfully', 'success')
        } else {
          showAlert('Error', result.error || 'Failed to delete room', 'error')
        }
      }
    } catch (error) {
      console.error('Error deleting room:', error)
      showAlert('Error', 'Failed to delete room. Please try again.', 'error')
    } finally {
      setIsDeletingRoom(false)
    }
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setRoomToDelete(null)
    setIsBulkDelete(false)
  }

  const handleBulkDelete = () => {
    if (selectedRooms.size === 0) {
      showAlert('Selection Required', 'Please select at least one room to delete', 'warning')
      return
    }
    setIsBulkDelete(true)
    setShowDeleteModal(true)
  }

  const handleEditRoom = (room: Room) => {
    setSelectedRoom(room)
    // Pre-fill only room name
    setNewRoomName(room.roomNumber)
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    if (!selectedRoom) return
    if (!newRoomName.trim()) {
      showAlert('Validation Error', 'Please enter a room name', 'warning')
      return
    }
    try {
      setIsUpdatingRoom(true)
      const token = getAuthToken()
      if (!token) {
        showAlert('Authentication Required', 'Please log in to edit room', 'warning')
        setIsUpdatingRoom(false)
        return
      }
      const response = await fetch(`/api/partner/rooms/update-by-name`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          originalRoomName: selectedRoom.roomNumber, // Use room name instead of ID
          roomName: newRoomName.trim(),
        })
      })
      const result = await response.json()
      if (response.ok && result.success) {
        await fetchRooms()
        setShowEditModal(false)
        setSelectedRoom(null)
        setNewRoomName("")
        showAlert('Success', 'Room updated successfully', 'success')
      } else {
        showAlert('Error', result.error || 'Failed to update room', 'error')
      }
    } catch (error) {
      console.error('Error updating room:', error)
      showAlert('Error', 'Failed to update room. Please try again.', 'error')
    } finally {
      setIsUpdatingRoom(false)
    }
  }

  const handleRoomQRCode = async (room: Room) => {
    // If room already has QR code cached, show it
    if (room.qrCodeImage) {
      setRoomForQR(room)
      setShowQRModal(true)
      return
    }

    // Otherwise, fetch the QR code from the API
    try {
      const token = getAuthToken()
      if (!token) {
        showAlert('Authentication Required', 'Please log in to view QR code', 'warning')
        return
      }

      // Call the dedicated QR code endpoint
      const response = await fetch(`/api/partner/rooms/${room.id}/qr-code`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      })

      const result = await response.json()

      if (response.ok && result.success && result.data?.qrCode) {
        // Update room with QR code and show modal
        setRoomForQR({
          ...room,
          qrCodeImage: result.data.qrCode
        })
        setShowQRModal(true)
      } else {
        showAlert('Error', result.error || 'Failed to generate QR code.', 'error')
      }
    } catch (error) {
      console.error('Error fetching QR code:', error)
      showAlert('Error', 'Failed to fetch QR code. Please try again.', 'error')
    }
  }

  const closeQRModal = () => {
    setShowQRModal(false)
    setRoomForQR(null)
  }

  const handleDownloadQR = () => {
    if (!roomForQR) return;
    
    // If we have the QR code image from API, download it directly
    if (roomForQR.qrCodeImage) {
      const downloadLink = document.createElement("a");
      downloadLink.href = roomForQR.qrCodeImage; // base64 image
      downloadLink.download = `${roomForQR.roomName || roomForQR.roomNumber || "room"}_QR.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else {
      showAlert('No QR Code', 'No QR code available to download. Please assign a guest first.', 'warning')
    }
  };

  // Export rooms to Excel
  const handleExportRooms = () => {
    if (!rooms || rooms.length === 0) {
      showAlert('No Data', 'No room data available to export', 'warning')
      return
    }

    // Prepare data for export - map room data to Excel format
    const exportData = rooms.map((room) => ({
      "Room ID": room.roomNumber || room.id,
      "Room Name": `R${room.id}`,
      "Status": room.status === "Available" ? "Empty" : "Full",
      "The Resident": room.status === "Available" ? "-" : (room.resident || "-"),
      "Check In": room.status === "Available" ? "-" : (room.checkIn || "-"),
      "Check Out": room.status === "Available" ? "-" : (room.checkOut || "-"),
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rooms");

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Download file
    const fileName = `rooms-export-${new Date().toISOString().split('T')[0]}.xlsx`;
    saveAs(blob, fileName);
  };

  const handleAssignRoom = (room: Room) => {
    setRoomToAssign(room)
    // Pre-fill form with existing data if room is already assigned
    setAssignResident(room.resident || "")
    setAssignResidentEmail(room.residentEmail || "")
    setAssignResidentPhoneNo(room.residentPhoneNo || "")
    setAssignCheckInDate(room.checkIn ? room.checkIn.split(',')[0] : "")
    setAssignCheckInTime(room.checkIn ? room.checkIn.split(',')[1]?.trim() || "" : "")
    setAssignCheckOutDate(room.checkOut ? room.checkOut.split(',')[0] : "")
    setAssignCheckOutTime(room.checkOut ? room.checkOut.split(',')[1]?.trim() || "" : "")
    setAssignError(null)
    setShowAssignModal(true)
  }

  const closeAssignModal = () => {
    setShowAssignModal(false)
    setRoomToAssign(null)
    setAssignResident("")
    setAssignResidentEmail("")
    setAssignResidentPhoneNo("")
    setAssignCheckInDate("")
    setAssignCheckInTime("")
    setAssignCheckOutDate("")
    setAssignCheckOutTime("")
    setAssignError(null)
  }

  const handleUnassignRoom = (room: Room) => {
    if (!room.resident) {
      showAlert('Room Not Assigned', 'Room is not currently assigned', 'warning')
      return
    }
    setRoomToUnassign(room)
    setShowUnassignModal(true)
  }

  const closeUnassignModal = () => {
    setShowUnassignModal(false)
    setRoomToUnassign(null)
    setIsUnassigning(false)
  }

  const confirmUnassign = async () => {
    if (!roomToUnassign) return

    setIsUnassigning(true)
    try {
      const token = getAuthToken()
      if (!token) {
        showAlert('Authentication Required', 'Please log in to unassign room', 'warning')
        setIsUnassigning(false)
        return
      }

      const response = await fetch(`/api/partner/checkout-guest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          roomId: roomToUnassign.id
        })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        await fetchRooms()
        closeUnassignModal()
        showAlert('Success', 'Guest checked out successfully.', 'success')
      } else {
        showAlert('Error', result.error || 'Failed to checkout guest', 'error')
        setIsUnassigning(false)
      }
    } catch (error) {
      console.error('Error unassigning room:', error)
      showAlert('Error', 'Failed to unassign room. Please try again.', 'error')
      setIsUnassigning(false)
    }
  }

  const handleSaveAssignment = async () => {
    if (!roomToAssign) return

    // Validate required fields
    if (!assignResident.trim()) {
      setAssignError("Resident name is required")
      return
    }

    setIsAssigning(true)
    setAssignError(null)

    try {
      const token = getAuthToken()
      if (!token) {
        setAssignError("Authentication token not found. Please log in again.")
        setIsAssigning(false)
        return
      }

      const response = await fetch(`/api/partner/assign-room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          guestName: assignResident.trim(),
          guestEmail: assignResidentEmail.trim() || undefined,
          guestPhone: assignResidentPhoneNo.trim() || undefined,
          roomId: roomToAssign.id,
          roomName: roomToAssign.roomName,
          checkInDate: assignCheckInDate || undefined,
          checkOutDate: assignCheckOutDate || undefined,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to assign guest to room')
      }

      // Store the QR code from API response
      const qrCodeImage = result.data?.qrCode || null

      // Refresh rooms list
      await fetchRooms()

      // Close assign modal
      closeAssignModal()
      
      // If QR code was generated, show it in the QR modal
      if (qrCodeImage && roomToAssign) {
        // Update the room with QR code and show modal
        setRoomForQR({
          ...roomToAssign,
          resident: assignResident,
          residentEmail: assignResidentEmail,
          residentPhoneNo: assignResidentPhoneNo,
          checkIn: assignCheckInDate,
          checkOut: assignCheckOutDate,
          qrCodeImage: qrCodeImage
        })
        setShowQRModal(true)
        showAlert('Success', 'Guest assigned successfully!', 'success')
      } else {
        showAlert('Error', 'Failed to assign guest', 'error')
      }
    } catch (err: any) {
      console.error('Error assigning room:', err)
      setAssignError(err.message || 'Failed to assign room. Please try again.')
    } finally {
      setIsAssigning(false)
    }
  }

  const handleRoomHistory = async (room: Room) => {
    setRoomForHistory(room)
    setShowHistoryModal(true)
    await fetchRoomHistory(room.id)
  }

  const closeHistoryModal = () => {
    setShowHistoryModal(false)
    setRoomForHistory(null)
    setRoomHistory([])
    setHistorySearchQuery("")
    setHistoryCurrentPage(1)
  }

  // Fetch room history from history API
  const fetchRoomHistory = async (roomId: string) => {
    try {
      setIsLoadingHistory(true)
      const token = getAuthToken()
      if (!token) {
        console.error('No auth token found')
        setIsLoadingHistory(false)
        return
      }

      // Fetch room history
      const response = await fetch(`/api/partner/rooms/${roomId}/history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.history) {
          // Format dates for display
          const formatDate = (date: Date | string | null) => {
            if (!date) return "N/A"
            const d = new Date(date)
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            const month = months[d.getMonth()]
            const day = d.getDate()
            const year = d.getFullYear()
            return `${month} ${day}, ${year}`
          }

          const formatDateTime = (date: Date | string | null, time: string | null) => {
            if (!date) return "N/A"
            const dateStr = formatDate(date)
            if (time) {
              // Format time (e.g., "10:30" -> "10:30 AM")
              const [hours, minutes] = time.split(':')
              const hour = parseInt(hours)
              const ampm = hour >= 12 ? 'PM' : 'AM'
              const displayHour = hour % 12 || 12
              return `${dateStr}, ${displayHour}:${minutes} ${ampm}`
            }
            return dateStr
          }

          // Map history entries to RoomHistoryEntry format
          const history: RoomHistoryEntry[] = result.history.map((entry: any) => ({
            id: entry._id || entry.id || '',
            name: entry.resident,
            checkIn: formatDateTime(entry.checkInDate, entry.checkInTime),
            checkOut: formatDateTime(entry.checkOutDate, entry.checkOutTime),
          }))

          setRoomHistory(history)
        } else {
          setRoomHistory([])
        }
      } else {
        console.error('Failed to fetch room history')
        setRoomHistory([])
      }
    } catch (error) {
      console.error('Error fetching room history:', error)
      setRoomHistory([])
    } finally {
      setIsLoadingHistory(false)
    }
  }

  // Filter history based on search query
  const filteredHistory = roomHistory.filter(entry => 
    entry.name.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
    entry.checkIn.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
    entry.checkOut.toLowerCase().includes(historySearchQuery.toLowerCase())
  )

  // Paginate filtered history
  const historyStartIndex = (historyCurrentPage - 1) * historyItemsPerPage
  const historyEndIndex = historyStartIndex + historyItemsPerPage
  const paginatedHistory = filteredHistory.slice(historyStartIndex, historyEndIndex)
  const historyTotalPages = Math.ceil(filteredHistory.length / historyItemsPerPage)

  const handleAddRoom = () => {
    setNewRoomName("")
    setNewRoomStatus("Empty")
    setShowAddStepOne(true)
  }

  const closeAddStepOne = () => {
    setShowAddStepOne(false)
    setNewRoomName("")
    setNewRoomStatus("Empty")
  }

  const handleSaveStepOne = async () => {
    if (!newRoomName.trim()) {
      showAlert('Validation Error', 'Please enter a room name', 'warning')
      return
    }

    if (newRoomStatus === "Empty") {
      // Save room with empty status immediately (no resident data)
      try {
        setIsSavingStepOne(true)
        const token = getAuthToken()
        if (!token) {
          showAlert('Authentication Required', 'Please log in to add a room', 'warning')
          setIsSavingStepOne(false)
          return
        }
        const response = await fetch('/api/partner/rooms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            roomName: newRoomName.trim(),
            roomStatus: 'empty',
          })
        })
        const result = await response.json()
        if (response.ok && result.success) {
          await fetchRooms()
          closeAddStepOne()
          showAlert('Success', 'Room added successfully', 'success')
        } else {
          showAlert('Error', result.error || 'Failed to add room', 'error')
        }
      } catch (error) {
        console.error('Error adding room:', error)
        showAlert('Error', 'Failed to add room. Please try again.', 'error')
      } finally {
        setIsSavingStepOne(false)
      }
    } else {
      // Status is Full, proceed to full modal
      setIsSavingStepOne(false)
      setShowAddStepOne(false)
      setShowAddModal(true)
    }
  }

  const closeAddModal = () => {
    setShowAddModal(false)
    setNewRoomName("")
    setNewRoomStatus("Empty")
    setNewResident("")
    setNewResidentEmail("")
    setNewResidentPhoneNo("")
    setNewCheckInDate("")
    setNewCheckInTime("")
    setNewCheckOutDate("")
    setNewCheckOutTime("")
  }

  const [isSavingRoom, setIsSavingRoom] = useState(false)
  const [isUpdatingRoom, setIsUpdatingRoom] = useState(false)
  const [isSavingStepOne, setIsSavingStepOne] = useState(false)
  const [isDeletingRoom, setIsDeletingRoom] = useState(false)

  const handleSaveAddRoom = async () => {
    // Validate required fields: Room Name
    if (!newRoomName.trim()) {
      showAlert('Validation Error', 'Please enter room name', 'warning');
      return;
    }

    // If status is Full, validate resident fields
    if (newRoomStatus === 'Full') {
      if (!newResident.trim()) {
        showAlert('Validation Error', 'Please enter resident name', 'warning');
        return;
      }
      if (!newCheckInDate.trim()) {
        showAlert('Validation Error', 'Please enter check-in date', 'warning');
        return;
      }
      if (!newCheckOutDate.trim()) {
        showAlert('Validation Error', 'Please enter check-out date', 'warning');
        return;
      }
    }

    try {
      setIsSavingRoom(true)
      const token = getAuthToken()
      if (!token) {
        showAlert('Authentication Required', 'Please log in to add a room', 'warning')
        setIsSavingRoom(false)
        return
      }

      // Step 1: Create the room (always create with empty status, we'll update it when assigning)
      const createResponse = await fetch('/api/partner/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          roomName: newRoomName.trim(),
          roomStatus: newRoomStatus.toLowerCase() === 'full' ? 'empty' : 'empty', // Create as empty first
        })
      })
      const createResult = await createResponse.json()
      
      if (!createResponse.ok || !createResult.success) {
        showAlert('Error', createResult.error || 'Failed to create room', 'error')
        setIsSavingRoom(false)
        return
      }

      const createdRoom = createResult.room

      // Step 2: If status is Full, assign the resident to the room
      if (newRoomStatus === 'Full') {
        // Combine date and time for check-in and check-out
        const checkInDateTime = newCheckInDate && newCheckInTime 
          ? `${newCheckInDate}T${newCheckInTime}:00`
          : newCheckInDate || undefined
        
        const checkOutDateTime = newCheckOutDate && newCheckOutTime
          ? `${newCheckOutDate}T${newCheckOutTime}:00`
          : newCheckOutDate || undefined

        const assignResponse = await fetch('/api/partner/assign-room', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            guestName: newResident.trim(),
            guestEmail: newResidentEmail.trim() || undefined,
            guestPhone: newResidentPhoneNo.trim() || undefined,
            roomId: createdRoom._id,
            roomName: newRoomName.trim(),
            checkInDate: checkInDateTime || undefined,
            checkOutDate: checkOutDateTime || undefined,
          })
        })

        const assignResult = await assignResponse.json()

        if (!assignResponse.ok || !assignResult.success) {
          // Room was created but assignment failed - still show error
          showAlert('Error', assignResult.error || 'Room created but failed to assign resident', 'error')
          await fetchRooms() // Refresh to show the room
          setIsSavingRoom(false)
          return
        }
      }

      // Success - refresh rooms and close modal
      await fetchRooms()
      closeAddModal()
      setNewRoomName("")
      setNewRoomStatus("Empty")
      setNewResident("")
      setNewResidentEmail("")
      setNewResidentPhoneNo("")
      setNewCheckInDate("")
      setNewCheckInTime("")
      setNewCheckOutDate("")
      setNewCheckOutTime("")
      showAlert('Success', newRoomStatus === 'Full' ? 'Room added and resident assigned successfully' : 'Room added successfully', 'success')
    } catch (error) {
      console.error('Error adding room:', error)
      showAlert('Error', 'Failed to add room. Please try again.', 'error')
    } finally {
      setIsSavingRoom(false)
    }
  }

  const totalPages = Math.ceil(totalRooms / itemsPerPage)
  // Rooms are already paginated from API, no need to slice
  const currentRooms = rooms
  // Calculate display range for pagination info
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalRooms)
  
  // Calculate stats from current rooms data
  // Note: For accurate totals, a separate stats endpoint would be better
  const fullRoomsCount = rooms.filter(r => r.status === 'Occupied').length
  const emptyRoomsCount = rooms.filter(r => r.status === 'Available').length

  // const getStatusStyle = (status: Room["status"]) => {
  //   switch (status) {
  //     case "Available":
  //       return {
  //         border: "0.5px solid rgba(80, 190, 135, 0.25)",
  //         background: "#EEF9F3",
  //         color: "#50BE87",
  //       }
  //     case "Occupied":
  //       return {
  //         border: "0.5px solid rgba(255, 13, 13, 0.25)",
  //         background: "rgba(255, 13, 13, 0.05)",
  //         color: "#FF0D0D",
  //       }
  //   }
  // }

  const getNewStatusStyle = (status: Room["status"]) => {
    if (status === "Occupied") {
      return {
        background: "rgba(100, 87, 211, 0.05)", // #6457D3 with 5% opacity
        border: "0.5px solid rgba(100, 87, 211, 0.25)", // #6457D3 with 25% opacity
        color: "#6457D3",
      }
    } else if (status === "Available") {
      return {
        background: "rgba(23, 178, 106, 0.05)", // #17B26A with 5% opacity
        border: "0.5px solid rgba(23, 178, 106, 0.25)", // #17B26A with 25% opacity
        color: "#17B26A",
      }
    }
    return {
      background: "rgba(206, 148, 29, 0.05)",
      border: "0.5px solid rgba(206, 148, 29, 0.25)",
      color: "#CE941D",
    }
  }

  return (
    <div className="p-4">
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex">
          <button
            onClick={() => setActiveTab('rooms')}
            className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === 'rooms'
                ? 'text-foreground border-b-2 border-primary -mb-[2px]'
                : 'text-muted-foreground hover:text-foreground border-b-2 border-[#EDEDED] -mb-[2px]'
              }`}
            style={{ width: "270px" }}
          >
            Rooms
          </button>
          <button
            onClick={() => setActiveTab('room-requests')}
            className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === 'room-requests'
                ? 'text-foreground border-b-2 border-primary -mb-[2px]'
                : 'text-muted-foreground hover:text-foreground border-b-2 border-[#EDEDED] -mb-[2px]'
              }`}
            style={{ width: "270px" }}
          >
            Room Requests
          </button>
        </div>
      </div>

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{activeTab === 'rooms' ? 'Rooms' : 'Room Requests'}</h1>
            <p className="text-sm text-muted-foreground">Last updated on 09/15/2025, 12AM</p>
          </div>
          <div className="flex items-center" style={{ border: "0.925px solid #CED4DA", borderTopLeftRadius: "6px", borderBottomLeftRadius: "6px",  borderTopRightRadius: "6px", borderBottomRightRadius: "6px"}}>
            <button 
              onClick={() => setSelectedPeriod("week")}
              className={`px-4 py-2 rounded-[1px] text-sm font-medium transition-colors ${selectedPeriod === "week" ? "bg-[#1F2A44] text-white hover:bg-[#1F2A44]/90" : "bg-[#FFF] text-[rgba(33,33,33,0.60)] hover:bg-muted/80"}`}
              style={{ borderRight: "0.925px solid #CED4DA", borderTopLeftRadius: "6px", borderBottomLeftRadius: "6px"}}
            >
              Semaine
            </button>
            <button 
              onClick={() => setSelectedPeriod("month")}
              className={`px-4 py-2 rounded-[1px] text-sm font-medium transition-colors ${selectedPeriod === "month" ? "bg-[#1F2A44] text-white hover:bg-[#1F2A44]/90" : "bg-[#FFF] text-[rgba(33,33,33,0.60)] hover:bg-muted/80"}`}
              style={{ borderRight: "0.925px solid #CED4DA" }}
            >
              Mois
            </button>
            <button 
              onClick={() => setSelectedPeriod("day")}
              className={`px-4 py-2 rounded-[1px] text-sm font-medium transition-colors flex items-center gap-2 ${selectedPeriod === "day" ? "bg-[#1F2A44] text-white hover:bg-[#1F2A44]/90" : "bg-[#FFF] text-[rgba(33,33,33,0.60)] hover:bg-muted/80"}`}
              style={{ borderTopRightRadius: "6px", borderBottomRightRadius: "6px" }}
            >
              <PublicIcon src="/assets/icons/calendar.svg" alt="Calendar" width={16} height={16} />
              Plage de dates
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'rooms' && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCard
              icon={
                <div 
              className="flex items-center justify-center rounded-full"
              style={{
                width: "36px",
                height: "36px",
                backgroundColor: "#E9EAEC"
              }}
            >
              <PublicIcon src="/assets/icons/bed-bunk.svg" alt="Total Rooms" width={20} height={20} />
            </div>
          }
          label="Total Rooms"
          value={isLoadingStats ? "..." : roomStats.totalRooms.toString()}
          change={isLoadingStats ? "..." : `${roomStats.totalRoomsIsIncrease ? '+' : '-'}${roomStats.totalRoomsPercentage}%`}
          changeType={roomStats.totalRoomsIsIncrease ? "positive" : "negative"}
          subtitle={`vs last ${selectedPeriod === "week" ? "week" : selectedPeriod === "month" ? "month" : "day"}`}
        />
        <StatCard
          icon={
            <div 
              className="flex items-center justify-center rounded-full"
              style={{
                width: "36px",
                height: "36px",
                backgroundColor: "#EEF2FB"
              }}
            >
              <PublicIcon src="/assets/icons/users-01.svg" alt="Full Rooms" width={20} height={20} />
            </div>
          }
          label="Full Rooms"
          value={isLoadingStats ? "..." : roomStats.fullRooms.toString()}
          change={isLoadingStats ? "..." : `${roomStats.fullRoomsIsIncrease ? '+' : '-'}${roomStats.fullRoomsPercentage}%`}
          changeType={roomStats.fullRoomsIsIncrease ? "positive" : "negative"}
          subtitle={`vs last ${selectedPeriod === "week" ? "week" : selectedPeriod === "month" ? "month" : "day"}`}
        />
        <StatCard
          icon={
            <div 
              className="flex items-center justify-center rounded-full"
              style={{
                width: "36px",
                height: "36px",
                backgroundColor: "rgba(23, 178, 106, 0.05)"
              }}
            >
              <PublicIcon src="/assets/icons/close.svg" alt="Empty Rooms" width={20} height={20} />
            </div>
          }
          label="Empty Rooms"
          value={isLoadingStats ? "..." : roomStats.emptyRooms.toString()}
          change={isLoadingStats ? "..." : `${roomStats.emptyRoomsIsIncrease ? '+' : '-'}${roomStats.emptyRoomsPercentage}%`}
          changeType={roomStats.emptyRoomsIsIncrease ? "positive" : "negative"}
          subtitle={`vs last ${selectedPeriod === "week" ? "week" : selectedPeriod === "month" ? "month" : "day"}`}
          />
        </div>

        {/* Rooms Section */}
        <div className="bg-card rounded-[4px] p-4">
          {/* Table Header */}
          <div className="flex items-center justify-between pb-4">
            <h3 className="text-base font-semibold text-foreground">Rooms list</h3>
            {selectedRooms.size > 0 ? (
              // Selection controls
              <div className="flex items-center gap-4">
                <button 
                 onClick={() => setSelectedRooms(new Set())}
                 className="flex items-center justify-center w-6 h-6 rounded text-white"
                 style={{ backgroundColor: "#1F2A44" }}
               >
                 <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                   <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                 </svg>
               </button>
               <span style={{ color: "#00000099", fontSize: "14px" }}>
                 {selectedRooms.size} item{selectedRooms.size > 1 ? 's' : ''} selected
               </span>
               <button 
                 onClick={handleSelectAll}
                 style={{ 
                   color: "#212121", 
                   fontSize: "14px", 
                   textDecoration: "underline",
                   fontWeight: "400"
                 }}
               >
                 Select all items
               </button>
               <button 
                 onClick={handleExportRooms}
                 style={{ 
                   color: "#1F2A44", 
                   fontSize: "14px", 
                   textDecoration: "underline",
                   fontWeight: "400",
                   display: "flex",
                   alignItems: "center",
                   gap: "4px"
                 }}
               >
                 <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                   <path d="M11.3333 10.6666C11.6705 10.9943 13 11.8665 13 12.3333M11.3333 14C11.6705 13.6723 13 12.8001 13 12.3333M13 12.3333L7.66667 12.3333" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                   <path d="M6.33398 14.6666H6.15217C3.97803 14.6666 2.89096 14.6666 2.13603 14.1347C1.91973 13.9823 1.7277 13.8016 1.56578 13.598C1.00065 12.8875 1.00065 11.8644 1.00065 9.81814V8.12117C1.00065 6.14572 1.00065 5.158 1.31328 4.36913C1.81586 3.10091 2.87874 2.10055 4.22622 1.62753C5.0644 1.33329 6.11386 1.33329 8.21277 1.33329C9.41215 1.33329 10.0118 1.33329 10.4908 1.50143C11.2608 1.77172 11.8682 2.34336 12.1553 3.06805C12.334 3.51884 12.334 4.08325 12.334 5.21208V8.66663" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                   <path d="M1.0013 8C1.0013 6.7727 1.99622 5.77778 3.22352 5.77778C3.66738 5.77778 4.19066 5.85555 4.62221 5.73992C5.00565 5.63718 5.30514 5.33768 5.40789 4.95424C5.52352 4.52269 5.44575 3.99941 5.44575 3.55556C5.44575 2.32826 6.44067 1.33333 7.66797 1.33333" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
                 Export
               </button>
               <button 
                 onClick={handleBulkDelete}
                 style={{ 
                   color: "#1F2A44", 
                   fontSize: "14px", 
                   textDecoration: "underline",
                   fontWeight: "400",
                   display: "flex",
                   alignItems: "center",
                   gap: "4px"
                 }}
               >
                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                   <path d="M6 2V1C6 0.447715 6.44772 0 7 0H9C9.55228 0 10 0.447715 10 1V2M6 2H2M6 2H10M10 2H14M2 2V13C2 14.1046 2.89543 15 4 15H12C13.1046 15 14 14.1046 14 13V2M4 6V11M8 6V11M12 6V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
                 Delete
               </button>
             </div>
           ) : (
             // Normal controls
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
                 <option value={8}>Display 8</option>
                 <option value={10}>Display 10</option>
                 <option value={20}>Display 20</option>
               </select>
               <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" fill="none">
                   <path d="M1 1L6 6L11 1" stroke="rgba(33, 33, 33, 0.60)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
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
                   lineHeight: "19.5px",
                   minWidth: "100px"
                 }}
               >
                 <option value="">Status</option>
                 <option value="all">All</option>
                 <option value="full">Full</option>
                 <option value="empty">Empty</option>
               </select>
               <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" fill="none">
                   <path d="M1 1L6 6L11 1" stroke="rgba(33, 33, 33, 0.60)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
               </div>
             </div>

             <button 
               onClick={handleExportRooms}
               className="flex py-[8.52px] px-5 justify-center items-center gap-1.5 border border-[#CED4DA] bg-[#FBFAFA] hover:bg-muted/80 transition-colors" 
               style={{ borderRadius: "6px" }}
             >
               <svg
                 xmlns="http://www.w3.org/2000/svg"
                 width="14"
                 height="16"
                 viewBox="0 0 14 16"
                 fill="none"
                 className="w-[14px] h-4"
               >
                 <path
                   d="M11.3333 10.6666C11.6705 10.9943 13 11.8665 13 12.3333M11.3333 14C11.6705 13.6723 13 12.8001 13 12.3333M13 12.3333L7.66667 12.3333"
                   stroke="#1F2A44"
                   strokeLinecap="round"
                   strokeLinejoin="round"
                 />
                 <path
                   d="M6.33398 14.6666H6.15217C3.97803 14.6666 2.89096 14.6666 2.13603 14.1347C1.91973 13.9823 1.7277 13.8016 1.56578 13.598C1.00065 12.8875 1.00065 11.8644 1.00065 9.81814V8.12117C1.00065 6.14572 1.00065 5.158 1.31328 4.36913C1.81586 3.10091 2.87874 2.10055 4.22622 1.62753C5.0644 1.33329 6.11386 1.33329 8.21277 1.33329C9.41215 1.33329 10.0118 1.33329 10.4908 1.50143C11.2608 1.77172 11.8682 2.34336 12.1553 3.06805C12.334 3.51884 12.334 4.08325 12.334 5.21208V8.66663"
                   stroke="#1F2A44"
                   strokeLinecap="round"
                   strokeLinejoin="round"
                 />
                 <path
                   d="M1.0013 8C1.0013 6.7727 1.99622 5.77778 3.22352 5.77778C3.66738 5.77778 4.19066 5.85555 4.62221 5.73992C5.00565 5.63718 5.30514 5.33768 5.40789 4.95424C5.52352 4.52269 5.44575 3.99941 5.44575 3.55556C5.44575 2.32826 6.44067 1.33333 7.66797 1.33333"
                   stroke="#1F2A44"
                   strokeLinecap="round"
                   strokeLinejoin="round"
                 />
               </svg>
               <span className="text-sm font-medium text-[#212121]">Export</span>
             </button>

             <button className="flex py-[8.52px] px-5 justify-center items-center gap-1.5 border border-[#CED4DA] bg-[#FBFAFA] hover:bg-muted/80 transition-colors" style={{ borderRadius: "6px" }}>
               <svg
                 xmlns="http://www.w3.org/2000/svg"
                 width="14"
                 height="16"
                 viewBox="0 0 14 16"
                 fill="none"
                 className="w-[14px] h-4"
               >
                 <path
                   d="M11.3333 10.6666C11.6705 10.9943 13 11.8665 13 12.3333M11.3333 14C11.6705 13.6723 13 12.8001 13 12.3333M13 12.3333L7.66667 12.3333"
                   stroke="#1F2A44"
                   strokeLinecap="round"
                   strokeLinejoin="round"
                 />
                 <path
                   d="M6.33398 14.6666H6.15217C3.97803 14.6666 2.89096 14.6666 2.13603 14.1347C1.91973 13.9823 1.7277 13.8016 1.56578 13.598C1.00065 12.8875 1.00065 11.8644 1.00065 9.81814V8.12117C1.00065 6.14572 1.00065 5.158 1.31328 4.36913C1.81586 3.10091 2.87874 2.10055 4.22622 1.62753C5.0644 1.33329 6.11386 1.33329 8.21277 1.33329C9.41215 1.33329 10.0118 1.33329 10.4908 1.50143C11.2608 1.77172 11.8682 2.34336 12.1553 3.06805C12.334 3.51884 12.334 4.08325 12.334 5.21208V8.66663"
                   stroke="#1F2A44"
                   strokeLinecap="round"
                   strokeLinejoin="round"
                 />
                 <path
                   d="M1.0013 8C1.0013 6.7727 1.99622 5.77778 3.22352 5.77778C3.66738 5.77778 4.19066 5.85555 4.62221 5.73992C5.00565 5.63718 5.30514 5.33768 5.40789 4.95424C5.52352 4.52269 5.44575 3.99941 5.44575 3.55556C5.44575 2.32826 6.44067 1.33333 7.66797 1.33333"
                   stroke="#1F2A44"
                   strokeLinecap="round"
                   strokeLinejoin="round"
                 />
               </svg>
               <span className="text-sm font-medium text-[#212121]">Export room data</span>
             </button>

             <button 
               onClick={handleAddRoom}
               className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary/90 text-sm font-medium transition-colors"
               style={{ borderRadius: "6px" }}
             >
               <RiAddLine className="w-5 h-5" />
               Add Room
             </button>
           </div>
           )}
         </div>

         {/* Table */}
         <div className="overflow-x-auto rounded-[4px]">
           <table className="w-full">
             <thead className="bg-muted/50">
               <tr>
                 <th className="w-12 px-4 py-4">
                   <input 
                     type="checkbox" 
                     className="rounded" 
                     checked={selectedRooms.size === rooms.length && rooms.length > 0}
                     onChange={handleSelectAll}
                     style={{
                       accentColor: "#1F2A44",
                       width: "16px",
                       height: "16px"
                     }}
                   />
                 </th>
                 <th className="px-4 py-4 text-left text-xs font-semibold" style={{ color: "#000000" }}>
                   Room ID
                 </th>
                 <th className="px-4 py-4 text-left text-xs font-semibold" style={{ color: "#000000" }}>
                   Room Name
                 </th>
                 <th className="px-4 py-4 text-left text-xs font-semibold" style={{ color: "#000000" }}>
                   Status
                 </th>
                 <th className="px-4 py-4 text-left text-xs font-semibold" style={{ color: "#000000" }}>
                   The Resident
                 </th>
                 <th className="px-4 py-4 text-left text-xs font-semibold" style={{ color: "#000000" }}>
                   Check In
                 </th>
                 <th className="px-4 py-4 text-left text-xs font-semibold" style={{ color: "#000000" }}>
                   Check Out
                 </th>
                 <th className="w-12 px-4 py-4"></th>
               </tr>
             </thead>
             <tbody className="divide-y divide-border">
               {currentRooms.map((room) => (
                 <tr 
                   key={room.id} 
                   className={`hover:bg-muted/50 transition-colors ${
                     selectedRooms.has(room.id) ? 'bg-muted/30' : ''
                   }`}
                 >
                   <td className="px-4 py-4">
                     <input 
                       type="checkbox" 
                       className="rounded" 
                       checked={selectedRooms.has(room.id)}
                       onChange={(e) => handleRoomSelection(room.id, e.target.checked)}
                       style={{
                         accentColor: "#1F2A44",
                         width: "16px",
                         height: "16px"
                       }}
                     />
                   </td>
                   <td className="px-4 py-4" style={{
                     color: "#525866",
                     fontSize: "12px",
                     fontWeight: "400",
                     lineHeight: "19.5px"
                   }}>
                    {displayRoomNumber(room.roomNumber)}
                   </td>
                   <td className="px-4 py-4" style={{
                     color: "#525866",
                     fontSize: "12px",
                     fontWeight: "400",
                     lineHeight: "19.5px"
                   }}>
                     {room.roomName || `R${room.id}`}
                   </td>
                   <td className="px-4 py-4">
                     <div
                       className="flex items-center justify-center rounded text-xs font-medium"
                       style={{
                         width: "80px",
                         height: "22px",
                         borderRadius: "4px",
                         borderWidth: "0.5px",
                         padding: "10px",
                         gap: "4px",
                         ...getNewStatusStyle(room.status),
                       }}
                     >
                       {room.status === "Available" ? "Empty" : "Full"}
                     </div>
                   </td>
                  <td className="px-4 py-4" style={{
                    color: "#525866",
                    fontSize: "12px",
                    fontWeight: "400",
                    lineHeight: "19.5px"
                  }}>
                    {room.status === "Available" ? "-" : (room.resident || "Lindsey Stroud")}
                  </td>
                  <td className="px-4 py-4" style={{
                    color: "#525866",
                    fontSize: "12px",
                    fontWeight: "400",
                    lineHeight: "19.5px"
                  }}>
                    {room.status === "Available" ? "-" : (room.checkIn || "Jan 15, 10:30 AM")}
                  </td>
                  <td className="px-4 py-4" style={{
                    color: "#525866",
                    fontSize: "12px",
                    fontWeight: "400",
                    lineHeight: "19.5px"
                  }}>
                    {room.status === "Available" ? "-" : (room.checkOut || "Jan 15, 10:30 AM")}
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
                          onClick: () => handleEditRoom(room),
                        },
                        {
                          label: "Room QR code",
                          icon: <PublicIcon src="/assets/icons/qr-code.svg" alt="QR code" width={16} height={16} />,
                          onClick: () => handleRoomQRCode(room),
                        },
                        ...(room.resident ? [] : [{
                          label: "Assign room",
                          icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 16 15">
                            <path d="M1.33301 6.81348C2.88748 5.18536 5.09516 5.1087 6.66634 6.81348M5.66307 2.48014C5.66307 3.40062 4.91582 4.14681 3.99403 4.14681C3.07224 4.14681 2.32499 3.40062 2.32499 2.48014C2.32499 1.55967 3.07224 0.813477 3.99403 0.813477C4.91582 0.813477 5.66307 1.55967 5.66307 2.48014Z" stroke="#141B34" strokeLinecap="round"/>
                            <path d="M9.33301 14.1465C10.8875 12.5184 13.0952 12.4417 14.6663 14.1465M13.6631 9.81315C13.6631 10.7336 12.9158 11.4798 11.994 11.4798C11.0722 11.4798 10.325 10.7336 10.325 9.81315C10.325 8.89268 11.0722 8.14648 11.994 8.14648C12.9158 8.14648 13.6631 8.89268 13.6631 9.81315Z" stroke="#141B34" strokeLinecap="round"/>
                            <path d="M2 8.81331C2 11.3933 4.08667 13.48 6.66667 13.48L6 12.1466" stroke="#141B34" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10 1.47998H14M10 3.47998H14M10 5.47998H12.3333" stroke="#141B34" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>,
                          onClick: () => handleAssignRoom(room),
                        }]),
                        {
                          label: "Room history",
                          icon: <PublicIcon src="/assets/icons/room history.svg" alt="Room history" width={16} height={16} />,
                          onClick: () => handleRoomHistory(room),
                        },
                        ...(room.resident ? [{
                          label: "Unassign",
                          icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 16 15">
                            <path d="M1.33301 6.81348C2.88748 5.18536 5.09516 5.1087 6.66634 6.81348M5.66307 2.48014C5.66307 3.40062 4.91582 4.14681 3.99403 4.14681C3.07224 4.14681 2.32499 3.40062 2.32499 2.48014C2.32499 1.55967 3.07224 0.813477 3.99403 0.813477C4.91582 0.813477 5.66307 1.55967 5.66307 2.48014Z" stroke="#141B34" strokeLinecap="round"/>
                            <path d="M9.33301 14.1465C10.8875 12.5184 13.0952 12.4417 14.6663 14.1465M13.6631 9.81315C13.6631 10.7336 12.9158 11.4798 11.994 11.4798C11.0722 11.4798 10.325 10.7336 10.325 9.81315C10.325 8.89268 11.0722 8.14648 11.994 8.14648C12.9158 8.14648 13.6631 8.89268 13.6631 9.81315Z" stroke="#141B34" strokeLinecap="round"/>
                            <path d="M2 8.81331C2 11.3933 4.08667 13.48 6.66667 13.48L6 12.1466" stroke="#141B34" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10 1.47998H14M10 3.47998H14M10 5.47998H12.3333" stroke="#141B34" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>,
                          onClick: () => handleUnassignRoom(room),
                        }] : []),
                        {
                          label: "Delete",
                          icon: <RiDeleteBinLine className="w-4 h-4" />,
                          onClick: () => handleDeleteRoom(room),
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
        <div className="flex items-center justify-between py-3 border-t">
          <p className="text-sm text-muted-foreground">
            Displaying {startIndex + 1}-{endIndex} results out of {totalRooms}
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

      {/* Edit Room Modal - only room name */}
      <RoomModal
        isOpen={showEditModal}
        title="Edit Room"
        width="480px"
        onClose={() => { 
          setShowEditModal(false)
          setSelectedRoom(null)
          setNewRoomName("")
        }}
        onSave={handleSaveEdit}
        isLoading={isUpdatingRoom}
      >
        {/* Room name only */}
        <div className="col-span-2 flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Room name</label>
          <input
            type="text"
            placeholder="Write Here..."
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </RoomModal>

       {/* Delete Room Modal */}
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
                 Delete Room
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
                   fontSize: "18px",
                   fontWeight: 400
                 }}
               >
                 {isBulkDelete 
                   ? `Are you sure you want to delete ${selectedRooms.size} room${selectedRooms.size > 1 ? 's' : ''} permanently?`
                   : `Are you sure you want to delete room ${roomToDelete?.roomNumber} permanently?`
                 }
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
                  disabled={isDeletingRoom}
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
                  disabled={isDeletingRoom}
                  className="flex flex-col justify-center items-center px-2.5 py-2 rounded-md text-center font-medium text-sm leading-5 transition-colors"
                  style={{
                    padding: "8.52px 10px",
                    borderRadius: "6px",
                    background: "#EB1D1D",
                    color: "#FFF",
                    fontSize: "14px",
                    fontWeight: 500,
                    lineHeight: "19.5px",
                    opacity: isDeletingRoom ? 0.7 : 1,
                    cursor: isDeletingRoom ? "not-allowed" : "pointer"
                  }}
                >
                  {isDeletingRoom ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Deleting...
                    </span>
                  ) : (
                    'Delete'
                  )}
                 </button>
               </div>
             </div>
          </div>
        </div>
      )}

      {/* Unassign Room Modal */}
      {showUnassignModal && roomToUnassign && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-80 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
          <div 
            className="bg-white rounded-lg w-full max-w-md mx-4"
            style={{
              border: "1px solid #56C6FF",
              borderRadius: "10px"
            }}
          >
            {/* Header */}
            <div 
              className="flex justify-between items-center px-6 py-4"
              style={{
                borderBottom: "1px dashed rgba(0, 0, 0, 0.1)"
              }}
            >
              <h2 
                className="text-black font-bold text-xl"
                style={{
                  fontSize: "20px",
                  fontWeight: 700
                }}
              >
                Unassign room
              </h2>
              <button
                onClick={closeUnassignModal}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                disabled={isUnassigning}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              <p 
                className="text-gray-700 text-base leading-relaxed"
                style={{
                  color: "#212121",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "24px"
                }}
              >
                You're about to unassign Room <span className="font-semibold">{roomToUnassign.roomNumber}</span> from <span className="font-semibold">{roomToUnassign.resident}</span>. The room will return to Vacant and remain available for other guests.
              </p>
            </div>

            {/* Footer */}
            <div 
              className="flex justify-end items-center gap-3 px-6 py-4"
              style={{
                borderTop: "1px solid rgba(0, 0, 0, 0.04)"
              }}
            >
              <button
                onClick={closeUnassignModal}
                disabled={isUnassigning}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "#FBFAFA",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: 500
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmUnassign}
                disabled={isUnassigning}
                className="px-4 py-2 text-white rounded-md hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "#1F2A44",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: 500
                }}
              >
                {isUnassigning ? "Unassigning..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Room QR Code Modal */}
      {showQRModal && roomForQR && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-80 flex items-center justify-center z-50 " style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
          <div className="bg-white rounded-lg  flex flex-col rounded-xl w-[450px] min-w-md items-center">
            {/* Heading */}
            <div 
              className="w-full flex items-center justify-center"
              style={{
                height: "32px",
                gap: "10px",
                paddingRight: "20px",
                paddingLeft: "20px",
                marginTop: "20px",
                marginBottom: "0px",
                opacity: 1
              }}
            >
              <h3 
                style={{
                  fontWeight: 600,
                  fontSize: "25px",
                  lineHeight: "32px",
                  letterSpacing: "0px",
                  textAlign: "center",
                  verticalAlign: "middle",
                  color: "#1F1F1F"
                }}
              >
                Room QR code
              </h3>
            </div>

          <div
        className="flex items-center justify-center relative"
        style={{
          width: "300px",
          height: "300px",
          marginTop: "0px",
          marginBottom: "20px",
          opacity: 1,
        }}
      >
        {/* Union Icon Background */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ marginTop: '15px', marginBottom: '15px' }}>
          <PublicIcon 
            src="/assets/icons/Union.svg" 
            alt="Union" 
            width={250} 
            height={250}
            className="w-auto h-auto"
          />
        </div>
        {/* QR Code inside Union Icon - Display QR from API (contains JWT token) */}
        <div className="relative z-10 flex items-center justify-center">
          {roomForQR?.qrCodeImage ? (
            // Display the QR code from API response (base64 image with JWT token)
            <img
              id="room-qr"
              src={roomForQR.qrCodeImage}
              alt="Guest QR Code"
              style={{
                width: '220px',
                height: '220px',
                objectFit: 'contain'
              }}
            />
          ) : (
            // Fallback: Show message if no QR code available
            <div 
              style={{
                width: '220px',
                height: '220px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
                color: '#666'
              }}
            >
              <p>No QR code available. Please assign a guest first.</p>
            </div>
          )}
        </div>
         </div>
         <div className="w-full">

          <div className="flex gap-4 flex-end justify-end border-t p-5">
            <button onClick={handleDownloadQR} className="h-[37px] text-4 p-2 flex items-center text-white bg-primary rounded-[4px]"> <FaDownload size={16} color="white" />download</button>
            <button onClick={closeQRModal} className="bg-[#FBFAFA] h-[37px] text-4 p-2 rounded-[6px]">cancel</button>
          </div>
         </div>
          </div>
        </div>
      )}

      {/* Assign Room Modal */}
      {showAssignModal && roomToAssign && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        >
          <div
            className="bg-white flex flex-col"
            style={{
              width: "704px",
              height: "auto",
              minHeight: "443.1300048828125px",
              top: "290.5px",
              left: "368px",
              opacity: 1,
              borderRadius: "10px",
            }}
          >
            {/* Header Section */}
            <div
              className="flex justify-between items-center border-b"
              style={{
                width: "704px",
                height: "94px",
                justifyContent: "space-between",
                opacity: 1,
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
                borderBottomWidth: "1px",
                paddingTop: "20px",
                paddingRight: "16px",
                paddingBottom: "20px",
                paddingLeft: "16px",
              }}
            >
              <div className="flex flex-col">
                <h2 
                  className="font-semibold text-black mb-1"
                  style={{
                    fontWeight: 600,
                    fontSize: "20px",
                    lineHeight: "100%",
                    width: "128px",
                   
                    opacity: 1,
                  }}
                >
                  Assign room
                </h2>
                <p className="text-sm text-gray-500">
                  Borem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
              <button
                onClick={closeAssignModal}
                className="flex items-center justify-center"
                style={{ width: "24px", height: "24px", aspectRatio: "1/1" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                  <path
                    d="M18 6.52441L6 18.5244M6 6.52441L18 18.5244"
                    stroke="#525866"
                    strokeWidth="1.67"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Error Message */}
            {assignError && (
              <div className="mx-4 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {assignError}
              </div>
            )}

            {/* Input Section */}
            <div
              className="flex flex-col border-b"
              style={{
                width: "704px",
                height: "auto",
                minHeight: "272.0899963378906px",
                gap: "20px",
                opacity: 1,
                borderBottomWidth: "1px",
                paddingTop: "20px",
                paddingRight: "16px",
                paddingBottom: "20px",
                paddingLeft: "16px",
              }}
            >
              <div
                className="flex flex-col"
                style={{
                  width: "672px",
                  height: "auto",
                  minHeight: "232.08999633789062px",
                  gap: "20px",
                  opacity: 1,
                }}
              >
                {/* First Row */}
                <div
                  className="flex justify-between"
                  style={{
                    width: "672px",
                    height: "64.02999877929688px",
                    justifyContent: "space-between",
                    opacity: 1,
                  }}
                >
                  {/* Room name */}
                  <div
                    className="flex flex-col"
                    style={{
                      width: "328px",
                      height: "64.02999877929688px",
                      opacity: 1,
                    }}
                  >
                    <label
                      className="text-sm font-medium mb-1"
                      style={{
                        
                        height: "20px",
                        fontWeight: 500,
                        fontSize: "13px",
                        lineHeight: "19.5px",
                        color: "#212121",
                      }}
                    >
                      Room name
                    </label>
                    <input
                      type="text"
                      value={roomToAssign?.roomNumber || ""}
                      readOnly
                      disabled
                      className="w-full border rounded bg-gray-50 cursor-not-allowed"
                      style={{
                        width: "326px",
                        height: "35.040000915527344px",
                        paddingTop: "7.52px",
                        paddingRight: "12px",
                        paddingBottom: "7.52px",
                        paddingLeft: "12px",
                        borderRadius: "4px",
                        borderWidth: "1px",
                        border: "1px solid #CED4DA",
                        opacity: 1,
                      }}
                    />
                  </div>

                  {/* The resident */}
                  <div
                    className="flex flex-col"
                    style={{
                      width: "328px",
                      height: "64.02999877929688px",
                      opacity: 1,
                    }}
                  >
                    <label
                      className="text-sm font-medium mb-1"
                      style={{
                        height: "20px",
                        fontWeight: 500,
                        fontSize: "13px",
                        lineHeight: "19.5px",
                        color: "#212121",
                      }}
                    >
                      The resident
                    </label>
                    <input
                      type="text"
                      value={assignResident}
                      onChange={(e) => setAssignResident(e.target.value)}
                      placeholder="Write Here..."
                      className="w-full border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      style={{
                        width: "326px",
                        height: "35.040000915527344px",
                        paddingTop: "7.52px",
                        paddingRight: "12px",
                        paddingBottom: "7.52px",
                        paddingLeft: "12px",
                        borderRadius: "4px",
                        borderWidth: "1px",
                        border: "1px solid #CED4DA",
                        opacity: 1,
                      }}
                    />
                  </div>
                </div>

                {/* Second Row - Resident Email and Phone */}
                <div
                  className="flex justify-between"
                  style={{
                    width: "672px",
                    height: "64.02999877929688px",
                    justifyContent: "space-between",
                    opacity: 1,
                  }}
                >
                  {/* Resident Email */}
                  <div
                    className="flex flex-col"
                    style={{
                      width: "328px",
                      height: "64.02999877929688px",
                      opacity: 1,
                    }}
                  >
                    <label
                      className="text-sm font-medium mb-1"
                      style={{
                        height: "20px",
                        fontWeight: 500,
                        fontSize: "13px",
                        lineHeight: "19.5px",
                        color: "#212121",
                      }}
                    >
                      Resident Email
                    </label>
                    <input
                      type="email"
                      value={assignResidentEmail}
                      onChange={(e) => setAssignResidentEmail(e.target.value)}
                      placeholder="Write Here..."
                      className="w-full border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      style={{
                        width: "326px",
                        height: "35.040000915527344px",
                        paddingTop: "7.52px",
                        paddingRight: "12px",
                        paddingBottom: "7.52px",
                        paddingLeft: "12px",
                        borderRadius: "4px",
                        borderWidth: "1px",
                        border: "1px solid #CED4DA",
                        opacity: 1,
                      }}
                    />
                  </div>

                  {/* Resident Phone No */}
                  <div
                    className="flex flex-col"
                    style={{
                      width: "328px",
                      height: "64.02999877929688px",
                      opacity: 1,
                    }}
                  >
                    <label
                      className="text-sm font-medium mb-1"
                      style={{
                        height: "20px",
                        fontWeight: 500,
                        fontSize: "13px",
                        lineHeight: "19.5px",
                        color: "#212121",
                      }}
                    >
                      Resident Phone No
                    </label>
                    <input
                      type="tel"
                      value={assignResidentPhoneNo}
                      onChange={(e) => setAssignResidentPhoneNo(e.target.value)}
                      placeholder="Write Here..."
                      className="w-full border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      style={{
                        width: "326px",
                        height: "35.040000915527344px",
                        paddingTop: "7.52px",
                        paddingRight: "12px",
                        paddingBottom: "7.52px",
                        paddingLeft: "12px",
                        borderRadius: "4px",
                        borderWidth: "1px",
                        border: "1px solid #CED4DA",
                        opacity: 1,
                      }}
                    />
                  </div>
                </div>

                {/* Third Row */}
                <div
                  className="flex justify-between"
                  style={{
                    width: "672px",
                    height: "64.02999877929688px",
                    justifyContent: "space-between",
                    opacity: 1,
                  }}
                >
                  {/* Check in Date */}
                  <div
                    className="flex flex-col"
                    style={{
                      width: "328px",
                      height: "64.02999877929688px",
                      opacity: 1,
                    }}
                  >
                    <label
                      className="text-sm font-medium mb-1"
                      style={{
                        width: "72px",
                        height: "20px",
                        fontWeight: 500,
                        fontSize: "13px",
                        lineHeight: "19.5px",
                        color: "#212121",
                      }}
                    >
                      Check in
                    </label>
                    <input
                      type="date"
                      value={assignCheckInDate}
                      onChange={(e) => setAssignCheckInDate(e.target.value)}
                      className="w-full border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      style={{
                        width: "326px",
                        height: "35.040000915527344px",
                        paddingTop: "7.52px",
                        paddingRight: "12px",
                        paddingBottom: "7.52px",
                        paddingLeft: "12px",
                        borderRadius: "4px",
                        borderWidth: "1px",
                        border: "1px solid #CED4DA",
                        opacity: 1,
                      }}
                    />
                  </div>

                  {/* Check in Time */}
                  <div
                    className="flex flex-col"
                    style={{
                      width: "328px",
                      height: "64.02999877929688px",
                      opacity: 1,
                    }}
                  >
                    <label
                      className="text-sm font-medium mb-1"
                      style={{
                        width: "72px",
                        height: "20px",
                        fontWeight: 500,
                        fontSize: "13px",
                        lineHeight: "19.5px",
                        color: "#212121",
                      }}
                    >
                      Check in
                    </label>
                    <input
                      type="time"
                      value={assignCheckInTime}
                      onChange={(e) => setAssignCheckInTime(e.target.value)}
                      className="w-full border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      style={{
                        width: "326px",
                        height: "35.040000915527344px",
                        paddingTop: "7.52px",
                        paddingRight: "12px",
                        paddingBottom: "7.52px",
                        paddingLeft: "12px",
                        borderRadius: "4px",
                        borderWidth: "1px",
                        border: "1px solid #CED4DA",
                        opacity: 1,
                      }}
                    />
                  </div>
                </div>

                {/* Fourth Row */}
                <div
                  className="flex justify-between"
                  style={{
                    width: "672px",
                    height: "64.02999877929688px",
                    justifyContent: "space-between",
                    opacity: 1,
                  }}
                >
                  {/* Check out Date */}
                  <div
                    className="flex flex-col"
                    style={{
                      width: "328px",
                      height: "64.02999877929688px",
                      opacity: 1,
                    }}
                  >
                    <label
                      className="text-sm font-medium mb-1"
                      style={{
                        width: "72px",
                        height: "20px",
                        fontWeight: 500,
                        fontSize: "13px",
                        lineHeight: "19.5px",
                        color: "#212121",
                      }}
                    >
                      Check out
                    </label>
                    <input
                      type="date"
                      value={assignCheckOutDate}
                      onChange={(e) => setAssignCheckOutDate(e.target.value)}
                      className="w-full border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      style={{
                        width: "326px",
                        height: "35.040000915527344px",
                        paddingTop: "7.52px",
                        paddingRight: "12px",
                        paddingBottom: "7.52px",
                        paddingLeft: "12px",
                        borderRadius: "4px",
                        borderWidth: "1px",
                        border: "1px solid #CED4DA",
                        opacity: 1,
                      }}
                    />
                  </div>

                  {/* Check out Time */}
                  <div
                    className="flex flex-col"
                    style={{
                      width: "328px",
                      height: "64.02999877929688px",
                      opacity: 1,
                    }}
                  >
                    <label
                      className="text-sm font-medium mb-1"
                      style={{
                        width: "72px",
                        height: "20px",
                        fontWeight: 500,
                        fontSize: "13px",
                        lineHeight: "19.5px",
                        color: "#212121",
                      }}
                    >
                      Check out
                    </label>
                    <input
                      type="time"
                      value={assignCheckOutTime}
                      onChange={(e) => setAssignCheckOutTime(e.target.value)}
                      className="w-full border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      style={{
                        width: "326px",
                        height: "35.040000915527344px",
                        paddingTop: "7.52px",
                        paddingRight: "12px",
                        paddingBottom: "7.52px",
                        paddingLeft: "12px",
                        borderRadius: "4px",
                        borderWidth: "1px",
                        border: "1px solid #CED4DA",
                        opacity: 1,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Section */}
            <div
              className="flex justify-end items-center border-t"
              style={{
                width: "704px",
                height: "77.04000091552734px",
                gap: "10px",
                opacity: 1,
                borderBottomRightRadius: "10px",
                borderBottomLeftRadius: "10px",
                borderTopWidth: "1px",
                paddingTop: "20px",
                paddingRight: "16px",
                paddingBottom: "20px",
                paddingLeft: "16px",
              }}
            >
              <div
                className="flex gap-4"
                style={{
                  width: "158px",
                  height: "37.040000915527344px",
                  gap: "16px",
                  opacity: 1,
                }}
              >
                {/* Cancel Button */}
                <button
                  onClick={closeAssignModal}
                  className="flex items-center justify-center border rounded text-black"
                  style={{
                    width: "70px",
                    height: "37.040000915527344px",
                    paddingTop: "8.52px",
                    paddingRight: "10px",
                    paddingBottom: "8.52px",
                    paddingLeft: "10px",
                    borderRadius: "6px",
                    background: "#FBFAFA",
                    border: "1px solid #CED4DA",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "19.5px",
                    textAlign: "center",
                    opacity: 1,
                  }}
                >
                  Cancel
                </button>

                {/* Save Button */}
                <button
                  onClick={handleSaveAssignment}
                  disabled={isAssigning || !assignResident.trim()}
                  className="flex items-center justify-center text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    width: "72px",
                    height: "37.040000915527344px",
                    gap: "6px",
                    paddingTop: "8.52px",
                    paddingRight: "20px",
                    paddingBottom: "8.52px",
                    paddingLeft: "20px",
                    borderRadius: "6px",
                    background: "#1F2A44",
                    opacity: 1,
                  }}
                >
                  {isAssigning ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        </>
      )}

      {/* Room History Modal - Right Slide Popup */}
      {showHistoryModal && roomForHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
          <div className=" bg-white w-[50vw] h-full flex flex-col">
            {/* Header */}
            <div className=" border-gray-200 flex-shrink-0">
              <div className="pt-5 pb-5 pr-6 pl-6 flex items-center justify-between border-b">
                <div className="flex flex-col">
                  <h2 className="text-xl font-semibold text-black">Room History</h2>
                  {roomForHistory && (
                    <p className="text-sm text-gray-500 mt-1">Room: {roomForHistory.roomNumber}</p>
                  )}
                </div>
                <button 
                  onClick={closeHistoryModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                    <path d="M18 6.52441L6 18.5244M6 6.52441L18 18.5244" stroke="#525866" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              {/* Search Row */}
              <div 
                className="p-6 flex justify-between items-center mt-4"
                style={{
                  width: "100%",
                  height: "33.040000915527344px",
                  justifyContent: "space-between",
                  opacity: 1,
                }}
              >
                <p className="text-sm text-gray-600">
                  Found {filteredHistory.length} resident{filteredHistory.length !== 1 ? 's' : ''}
                </p>
                
                {/* Search Bar and Icon */}
                <div 
                  className="flex items-center gap-4"
                  style={{
                    width: "275.0400085449219px",
                    height: "33.040000915527344px",
                    gap: "16px",
                    opacity: 1,
                  }}
                >
                  <input
                    type="text"
                    value={historySearchQuery}
                    onChange={(e) => {
                      setHistorySearchQuery(e.target.value)
                      setHistoryCurrentPage(1) // Reset to first page on search
                    }}
                    placeholder="Search..."
                    className="border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    style={{
                      width: "226px",
                      height: "33px",
                      borderWidth: "1px",
                      borderRadius: "4px",
                      paddingTop: "7.52px",
                      paddingRight: "12px",
                      paddingBottom: "7.52px",
                      paddingLeft: "12px",
                      border: "1px solid #CED4DA",
                      opacity: 1,
                    }}
                  />
                  <button className="p-2 bg-muted hover:bg-muted/80 rounded border border-border transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 4H14M2 8H14M2 12H14" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Room History Cards - Scrollable */}
            <div className="flex-1 p-6 overflow-y-auto">
              {isLoadingHistory ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : paginatedHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-32 h-32 mb-4 opacity-50">
                    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="40" y="60" width="120" height="80" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
                      <path d="M60 100L100 130L140 100" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="text-muted-foreground">
                    {historySearchQuery ? 'No residents found matching your search' : 'No room assignment history available'}
                  </p>
                </div>
              ) : (
                <div 
                  className="grid gap-4"
                  style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
                >
                  {paginatedHistory.map((history) => (
                  <div
                    key={history.id}
                    className="bg-white rounded-lg border flex flex-col"
                    style={{
                      width: "100%",
                      height: "111px",
                      gap: "10px",
                      padding: "20px",
                    //   background: "#0000000F",
                      opacity: 1,
                    }}
                  >
                    {/* Card Content */}
                    <div
                      className="flex flex-col"
                      style={{
                        width: "99%",
                        height: "71px",
                        gap: "10px",
                        justifyContent: "space-between",
                        opacity: 1,
                      }}
                    >
                      {/* Name Row */}
                      <div
                        className="flex justify-between items-center"
                        style={{
                          width: "100%",
                          height: "21px",
                          justifyContent: "space-between",
                          opacity: 1,
                        }}
                      >
                        <span className="text-sm font-medium text-black">Name</span>
                        <span className="text-sm text-gray-600">{history.name}</span>
                      </div>

                      {/* Check In Row */}
                      <div
                        className="flex justify-between items-center"
                        style={{
                          width: "100%",
                          height: "21px",
                          justifyContent: "space-between",
                          opacity: 1,
                        }}
                      >
                        <span className="text-sm font-medium text-black">Check in</span>
                        <span className="text-sm text-gray-600">{history.checkIn}</span>
                      </div>

                      {/* Check Out Row */}
                      <div
                        className="flex justify-between items-center"
                        style={{
                          width: "100%",
                          height: "21px",
                          justifyContent: "space-between",
                          opacity: 1,
                        }}
                      >
                        <span className="text-sm font-medium text-black">Check out</span>
                        <span className="text-sm text-gray-600">{history.checkOut}</span>
                      </div>
                    </div>
                  </div>
                  ))}
                </div>
              )}
            </div>

            {/* Fixed Pagination at Bottom */}
            {filteredHistory.length > 0 && historyTotalPages > 1 && (
              <div className="p-6 border-t border-gray-200 flex-shrink-0">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setHistoryCurrentPage(p => Math.max(1, p - 1))}
                    disabled={historyCurrentPage === 1}
                    className="w-8 h-8 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ‹
                  </button>
                  {Array.from({ length: Math.min(3, historyTotalPages) }, (_, i) => {
                    const page = i + 1
                    return (
                      <button
                        key={page}
                        onClick={() => setHistoryCurrentPage(page)}
                        className={`w-8 h-8 rounded-full text-sm font-medium ${
                          historyCurrentPage === page
                            ? 'bg-primary text-white'
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  })}
                  <button
                    onClick={() => setHistoryCurrentPage(p => Math.min(historyTotalPages, p + 1))}
                    disabled={historyCurrentPage === historyTotalPages}
                    className="w-8 h-8 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ›
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Room Requests Section */}
      {activeTab === 'room-requests' && (
        <div className="bg-card rounded-[4px] p-4">
          <div className="flex items-center justify-between pb-4">
            <h3 className="text-base font-semibold text-foreground">Room Requests list</h3>
            <div className="flex items-center gap-2">
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
                  <option value={10}>Display 10</option>
                  <option value={20}>Display 20</option>
                  <option value={50}>Display 50</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
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
                  fontSize: "13px",
                  fontWeight: "400"
                }}
              />
            </div>
          </div>

          {/* Room Requests Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid #EDEDED" }}>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Room</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Guest Name</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Phone</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #EDEDED" }}>
                  <td colSpan={6} className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mb-3 opacity-50">
                        <rect x="8" y="12" width="32" height="24" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                        <path d="M16 20L24 28L32 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <p className="text-muted-foreground">No room requests available</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
             {/* Add Room Step One Modal - Simple (Room name + Status only) */}
       {showAddStepOne && (
         <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
           <div className="bg-white rounded-xl w-[40vw] mx-4 max-h-[90vh] overflow-y-auto">
             {/* Header */}
             <div className="flex justify-between items-center border-b p-5 rounded-t-xl bg-white">
               <div className="flex flex-col gap-2">
                 <h2 className="text-lg font-semibold text-black">Add Room</h2>
                 <p className="text-sm text-gray-500">
                   Add a new room to the system
                 </p>
               </div>
               <button onClick={closeAddStepOne} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                   <path d="M18 6.52441L6 18.5244M6 6.52441L18 18.5244" stroke="#525866" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
               </button>
             </div>

             {/* Content */}
             <div className="p-6">
               <div className="grid grid-cols-2 gap-4">
                 {/* Room name */}
                 <div className="flex flex-col gap-2">
                   <label className="text-sm font-medium text-gray-700">Room name</label>
                   <input
                     type="text"
                     placeholder="Write Here..."
                     value={newRoomName}
                     onChange={(e) => setNewRoomName(e.target.value)}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   />
                 </div>
                 
                 {/* Status */}
                 <div className="flex flex-col gap-2">
                   <label className="text-sm font-medium text-gray-700">Status</label>
                   <select 
                     value={newRoomStatus}
                     onChange={(e) => setNewRoomStatus(e.target.value as "Full" | "Empty")}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   >
                     <option value="Empty">Empty</option>
                     <option value="Full">Full</option>
                   </select>
                 </div>
               </div>
             </div>

             {/* Footer */}
             <div className="flex justify-end items-center border-t p-5 gap-4">
               <button
                 onClick={closeAddStepOne}
                disabled={isSavingStepOne}
                 className="flex items-center justify-center border rounded text-black"
                 style={{
                   padding: "8.52px 10px",
                   borderRadius: "6px",
                   background: "#FBFAFA",
                   border: "1px solid #CED4DA",
                   fontWeight: 400,
                   fontSize: "14px",
                   lineHeight: "19.5px",
                   textAlign: "center",
                  opacity: isSavingStepOne ? 0.6 : 1,
                 }}
               >
                 Cancel
               </button>
               <button
                 onClick={handleSaveStepOne}
                disabled={isSavingStepOne}
                 className="flex items-center justify-center rounded text-white"
                 style={{
                   padding: "8.52px 20px",
                   borderRadius: "6px",
                   background: "#1F2A44",
                   fontWeight: 400,
                   fontSize: "14px",
                   lineHeight: "19.5px",
                   textAlign: "center",
                  opacity: isSavingStepOne ? 0.7 : 1,
                 }}
               >
                {isSavingStepOne ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Saving...
                  </span>
                ) : (
                  'Save'
                )}
               </button>
             </div>
           </div>
         </div>
       )}

       {/* Add Room Modal - Full Details (shown when status is Full) */}
       <RoomModal
         isOpen={showAddModal}
         title="Add Room"
         onClose={closeAddModal}
         onSave={handleSaveAddRoom}
         isLoading={isSavingRoom}
       >
         {/* First Row - Room name and Status (pre-filled) */}
         <div className="flex flex-col gap-2">
           <label className="text-sm font-medium text-gray-700">Room name</label>
           <input
             type="text"
             placeholder="Write Here..."
             value={newRoomName}
             onChange={(e) => setNewRoomName(e.target.value)}
             className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
           />
         </div>
         <div className="flex flex-col gap-2">
           <label className="text-sm font-medium text-gray-700">Status</label>
           <select 
             value={newRoomStatus}
             onChange={(e) => setNewRoomStatus(e.target.value as "Full" | "Empty")}
             className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
           >
             <option value="Full">Full</option>
             <option value="Empty">Empty</option>
           </select>
         </div>

         {/* Second Row - The resident (full width) */}
         <div className="col-span-2 flex flex-col gap-2">
           <label className="text-sm font-medium text-gray-700">The resident</label>
           <input
             type="text"
             placeholder="Write Here..."
             value={newResident}
             onChange={(e) => setNewResident(e.target.value)}
             className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
           />
         </div>

         {/* Second Row - Resident Email and Phone */}
         <div className="flex flex-col gap-2">
           <label className="text-sm font-medium text-gray-700">Resident Email</label>
           <input
             type="email"
             placeholder="Write Here..."
             value={newResidentEmail}
             onChange={(e) => setNewResidentEmail(e.target.value)}
             className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
           />
         </div>
         <div className="flex flex-col gap-2">
           <label className="text-sm font-medium text-gray-700">Resident Phone No</label>
           <input
             type="tel"
             placeholder="Write Here..."
             value={newResidentPhoneNo}
             onChange={(e) => setNewResidentPhoneNo(e.target.value)}
             className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
           />
         </div>

         {/* Third Row - Check in Date and Time */}
         <div className="flex flex-col gap-2">
           <label className="text-sm font-medium text-gray-700">Check in</label>
           <input
             type="date"
             value={newCheckInDate}
             onChange={(e) => setNewCheckInDate(e.target.value)}
             className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
           />
         </div>
         <div className="flex flex-col gap-2">
           <label className="text-sm font-medium text-gray-700">Check in</label>
           <input
             type="time"
             value={newCheckInTime}
             onChange={(e) => setNewCheckInTime(e.target.value)}
             className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
           />
         </div>

         {/* Fourth Row - Check out Date and Time */}
         <div className="flex flex-col gap-2">
           <label className="text-sm font-medium text-gray-700">Check out</label>
           <input
             type="date"
             value={newCheckOutDate}
             onChange={(e) => setNewCheckOutDate(e.target.value)}
             className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
           />
         </div>
         <div className="flex flex-col gap-2">
           <label className="text-sm font-medium text-gray-700">Check out</label>
           <input
             type="time"
             value={newCheckOutTime}
             onChange={(e) => setNewCheckOutTime(e.target.value)}
             className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
           />
         </div>
       </RoomModal>

      {/* Alert Dialog */}
      <AlertDialog
        isOpen={alertDialog.isOpen}
        title={alertDialog.title}
        message={alertDialog.message}
        variant={alertDialog.variant}
        onClose={() => setAlertDialog({ ...alertDialog, isOpen: false })}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        title={confirmationDialog.title}
        message={confirmationDialog.message}
        variant={confirmationDialog.variant}
        onConfirm={() => {
          confirmationDialog.onConfirm()
          setConfirmationDialog({ ...confirmationDialog, isOpen: false })
        }}
        onCancel={() => setConfirmationDialog({ ...confirmationDialog, isOpen: false })}
      />
     </div>
   )
 }

