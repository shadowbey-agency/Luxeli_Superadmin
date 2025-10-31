"use client"

import { useState, useEffect } from "react"
import {
  RiMoreLine,
  RiDeleteBinLine,
  RiAddLine,
  RiHotelBedLine,
  RiUserLine,
  RiDownloadLine,
} from "react-icons/ri"
import PublicIcon from "@/app/partner/components/public-icon"
import DropdownMenu from "@/app/superadmin/components/dropdown-menu"
import StatCard from "@/app/superadmin/components/stat-card"
import { LeftArrow, RightArrow } from "@/app/superadmin/components/pagination-arrows"
import { getAuthToken } from "@/lib/auth-utils"

interface Room {
  id: string
  roomNumber: string
  hotelName: string
  roomType: string
  capacity: string
  status: "Available" | "Occupied"
  price: string
  dateAdded: string
  avatar: string
  resident?: string
  checkIn?: string
  checkOut?: string
}

const mockRooms: Room[] = Array.from({ length: 15 }, (_, i) => ({
  id: `${i + 1}`,
  roomNumber: `${100 + i}`,
  hotelName: "Hotel Name",
  roomType: i % 3 === 0 ? "Deluxe" : i % 3 === 1 ? "Suite" : "Standard",
  capacity: `${2 + (i % 3)}`,
  status: i % 2 === 0 ? "Available" : "Occupied",
  price: `${500 + i * 50} MAD`,
  dateAdded: "15 juin 2025",
  avatar: `R${i + 1}`,
  resident: i % 2 === 0 ? undefined : (i % 3 === 0 ? "Lindsey Stroud" : i % 3 === 1 ? "John Smith" : "Sarah Johnson"),
  checkIn: i % 2 === 0 ? undefined : `Jan ${15 + (i % 10)}, ${10 + (i % 12)}:${30 + (i % 30)} AM`,
  checkOut: i % 2 === 0 ? undefined : `Jan ${15 + (i % 10)}, ${10 + (i % 12)}:${30 + (i % 30)} AM`,
}))

interface RoomHistoryEntry {
  id: string
  name: string
  checkIn: string
  checkOut: string
}

const mockRoomHistory: RoomHistoryEntry[] = Array.from({ length: 105 }, (_, i) => ({
  id: `${i + 1}`,
  name: i % 3 === 0 ? "Lindsey Stroud" : i % 3 === 1 ? "John Smith" : "Sarah Johnson",
  checkIn: `Jan ${15 + (i % 10)}, ${10 + (i % 12)}:${30 + (i % 30)} AM`,
  checkOut: `Jan ${15 + (i % 10)}, ${10 + (i % 12)}:${30 + (i % 30)} AM`,
}))

export default function RoomPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [showQRModal, setShowQRModal] = useState(false)
  const [roomForQR, setRoomForQR] = useState<Room | null>(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [roomToAssign, setRoomToAssign] = useState<Room | null>(null)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [roomForHistory, setRoomForHistory] = useState<Room | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  // Two-step add room flow
  const [showAddStepOne, setShowAddStepOne] = useState(false)
  const [newRoomName, setNewRoomName] = useState("")
  const [newRoomStatus, setNewRoomStatus] = useState<"Full" | "Empty">("Empty")
  // Selection state
  const [selectedRooms, setSelectedRooms] = useState<Set<string>>(new Set())
  // Form state for full room details
  const [newResident, setNewResident] = useState("")
  const [newCheckInDate, setNewCheckInDate] = useState("")
  const [newCheckInTime, setNewCheckInTime] = useState("")
  const [newCheckOutDate, setNewCheckOutDate] = useState("")
  const [newCheckOutTime, setNewCheckOutTime] = useState("")
  // Loading state
  const [isLoadingRooms, setIsLoadingRooms] = useState(true)
  // Pagination state
  const [totalRooms, setTotalRooms] = useState(0)

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
    if (selectedRooms.size === currentRooms.length) {
      setSelectedRooms(new Set())
    } else {
      setSelectedRooms(new Set(currentRooms.map(room => room.id)))
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
    return {
      id: apiRoom._id || apiRoom.id,
      roomNumber: apiRoom.roomId || apiRoom.roomName || '',
      hotelName: "Hotel Name", // Could come from API if available
      roomType: "Standard", // Default
      capacity: "2", // Default
      status: apiRoom.roomStatus === 'full' ? 'Occupied' : 'Available',
      price: "500 MAD", // Default
      dateAdded: apiRoom.createdAt ? formatDate(apiRoom.createdAt) : new Date().toLocaleDateString(),
      avatar: (apiRoom.roomId || apiRoom.roomName || 'R').charAt(0).toUpperCase(),
      resident: apiRoom.resident || undefined,
      checkIn: formatDateTime(apiRoom.checkInDate, apiRoom.checkInTime),
      checkOut: formatDateTime(apiRoom.checkOutDate, apiRoom.checkOutTime),
    }
  }

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

  // Fetch rooms on mount and when page/limit changes
  useEffect(() => {
    fetchRooms()
  }, [currentPage, itemsPerPage])

  const handleDeleteRoom = (room: Room) => {
    setRoomToDelete(room)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!roomToDelete) return
    try {
      const token = getAuthToken()
      if (!token) {
        alert('Please log in to delete room')
        return
      }
      const response = await fetch(`/api/partner/rooms/${roomToDelete.id}`, {
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
      } else {
        alert(result.error || 'Failed to delete room')
      }
    } catch (error) {
      console.error('Error deleting room:', error)
      alert('Failed to delete room. Please try again.')
    }
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setRoomToDelete(null)
  }

  const handleEditRoom = (room: Room) => {
    setSelectedRoom(room)
    // Pre-fill fields using the same inputs as Add modal
    setNewRoomName(room.roomNumber)
    setNewRoomStatus(room.status === "Occupied" ? "Full" : "Empty")
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    if (!selectedRoom) return
    try {
      const token = getAuthToken()
      if (!token) {
        alert('Please log in to edit room')
        return
      }
      const response = await fetch(`/api/partner/rooms/${selectedRoom.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          roomName: newRoomName.trim(),
          roomStatus: newRoomStatus.toLowerCase(),
        })
      })
      const result = await response.json()
      if (response.ok && result.success) {
        await fetchRooms()
        setShowEditModal(false)
        setSelectedRoom(null)
      } else {
        alert(result.error || 'Failed to update room')
      }
    } catch (error) {
      console.error('Error updating room:', error)
      alert('Failed to update room. Please try again.')
    }
  }

  const handleRoomQRCode = (room: Room) => {
    setRoomForQR(room)
    setShowQRModal(true)
  }

  const closeQRModal = () => {
    setShowQRModal(false)
    setRoomForQR(null)
  }

  const handleDownloadQR = () => {
    // Handle QR code download logic here
    console.log("Download QR code for room:", roomForQR?.roomNumber)
    // You can implement actual download functionality here
  }

  const handleAssignRoom = (room: Room) => {
    setRoomToAssign(room)
    setShowAssignModal(true)
  }

  const closeAssignModal = () => {
    setShowAssignModal(false)
    setRoomToAssign(null)
  }

  const handleUnassignRoom = (room: Room) => {
    // Handle room unassignment logic here
    console.log("Unassigning room:", room.roomNumber)
    // You can implement actual unassignment functionality here
  }

  const handleSaveAssignment = () => {
    // Handle room assignment save logic here
    console.log("Saving room assignment for:", roomToAssign?.roomNumber)
    setShowAssignModal(false)
    setRoomToAssign(null)
  }

  const handleRoomHistory = (room: Room) => {
    setRoomForHistory(room)
    setShowHistoryModal(true)
  }

  const closeHistoryModal = () => {
    setShowHistoryModal(false)
    setRoomForHistory(null)
  }

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
      alert("Please enter a room name")
      return
    }

    if (newRoomStatus === "Empty") {
      // Save room with empty status immediately (no resident data)
      try {
        const token = getAuthToken()
        if (!token) {
          alert('Please log in to add a room')
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
        } else {
          alert(result.error || 'Failed to add room')
        }
      } catch (error) {
        console.error('Error adding room:', error)
        alert('Failed to add room. Please try again.')
      }
    } else {
      // Status is Full, proceed to full modal
      setShowAddStepOne(false)
      setShowAddModal(true)
    }
  }

  const closeAddModal = () => {
    setShowAddModal(false)
    setNewRoomName("")
    setNewRoomStatus("Empty")
    setNewResident("")
    setNewCheckInDate("")
    setNewCheckInTime("")
    setNewCheckOutDate("")
    setNewCheckOutTime("")
  }

  const handleSaveAddRoom = async () => {
    if (!newRoomName.trim()) {
      alert("Please enter a room name")
      return
    }
    try {
      const token = getAuthToken()
      if (!token) {
        alert('Please log in to add a room')
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
          roomStatus: 'full',
          resident: newResident.trim() || null,
          checkInDate: newCheckInDate || null,
          checkInTime: newCheckInTime || null,
          checkOutDate: newCheckOutDate || null,
          checkOutTime: newCheckOutTime || null,
        })
      })
      const result = await response.json()
      if (response.ok && result.success) {
        await fetchRooms()
        closeAddModal()
        setNewResident("")
        setNewCheckInDate("")
        setNewCheckInTime("")
        setNewCheckOutDate("")
        setNewCheckOutTime("")
      } else {
        alert(result.error || 'Failed to add room')
      }
    } catch (error) {
      console.error('Error adding room:', error)
      alert('Failed to add room. Please try again.')
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

  const getStatusStyle = (status: Room["status"]) => {
    switch (status) {
      case "Available":
        return {
          border: "0.5px solid rgba(80, 190, 135, 0.25)",
          background: "#EEF9F3",
          color: "#50BE87",
        }
      case "Occupied":
        return {
          border: "0.5px solid rgba(255, 13, 13, 0.25)",
          background: "rgba(255, 13, 13, 0.05)",
          color: "#FF0D0D",
        }
    }
  }

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

  // Reusable modal component
  const RoomModal = ({ 
    isOpen, 
    title, 
    onClose, 
    onSave, 
    children 
  }: { 
    isOpen: boolean
    title: string
    onClose: () => void
    onSave: () => void
    children: React.ReactNode
  }) => {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
        <div className="bg-white rounded-xl w-[50vw] mx-4 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center border-b p-5 rounded-t-xl bg-white">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-black">{title}</h2>
              <p className="text-sm text-gray-500">
                {title === "Add Room" ? "Add a new room to the system" : "Borem ipsum dolor sit amet, consectetur adipiscing elit."}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                <path d="M18 6.52441L6 18.5244M6 6.52441L18 18.5244" stroke="#525866" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">{children}</div>
          </div>

          {/* Footer */}
          <div className="flex justify-end items-center border-t p-5 gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="px-5 py-2 text-sm font-medium text-white rounded-md hover:bg-primary/90 transition-colors bg-primary"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Rooms</h1>
            <p className="text-sm text-muted-foreground">Last updated on 09/15/2025, 12AM</p>
          </div>
          <div className="flex items-center" style={{ border: "0.925px solid #CED4DA", borderTopLeftRadius: "6px", borderBottomLeftRadius: "6px",  borderTopRightRadius: "6px", borderBottomRightRadius: "6px"}}>
            <button className="px-4 py-2 bg-[#1F2A44] text-white rounded-[1px] text-sm font-medium hover:bg-[#1F2A44]/90 transition-colors" style={{ borderRight: "0.925px solid #CED4DA", borderTopLeftRadius: "6px", borderBottomLeftRadius: "6px"}}>
              Semaine
            </button>
            <button className="px-4 py-2 bg-[#FFF] text-[rgba(33,33,33,0.60)] rounded-[1px] text-sm font-medium hover:bg-muted/80 transition-colors" style={{ borderRight: "0.925px solid #CED4DA",  borderTopRightRadius: "6px", borderBottomRightRadius: "6px" }}>
              Mois
            </button>
            <button className="px-4 py-2 bg-[#FFF] text-[rgba(33,33,33,0.60)] rounded-[1px] text-sm font-medium hover:bg-muted/80 transition-colors" style={{ borderRight: "0.925px solid #CED4DA",  borderTopRightRadius: "6px", borderBottomRightRadius: "6px" }}>
              Plage de dates
            </button>
          </div>
        </div>
      </div>

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
          value={totalRooms.toString()}
          change="+5%"
          changeType="positive"
          subtitle="vs last month"
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
          value={fullRoomsCount.toString()}
          change="+12%"
          changeType="positive"
          subtitle="vs last month"
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
          value={emptyRoomsCount.toString()}
          change="-8%"
          changeType="negative"
          subtitle="vs last month"
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
                     checked={selectedRooms.size === currentRooms.length && currentRooms.length > 0}
                     onChange={(e) => handleSelectAll(e.target.checked)}
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
                     #{room.roomNumber}
                   </td>
                   <td className="px-4 py-4" style={{
                     color: "#525866",
                     fontSize: "12px",
                     fontWeight: "400",
                     lineHeight: "19.5px"
                   }}>
                     {`R${room.id}`}
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

      {/* Edit Room Modal - reuse the same modal UI as Add Room */}
      <RoomModal
        isOpen={showEditModal}
        title="Edit Room"
        onClose={() => { setShowEditModal(false); setSelectedRoom(null) }}
        onSave={handleSaveEdit}
      >
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Room name</label>
          <input
            type="text"
            placeholder="Write Here..."
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <select 
            value={newRoomStatus}
            onChange={(e) => setNewRoomStatus(e.target.value as "Full" | "Empty")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Full">Full</option>
            <option value="Empty">Empty</option>
          </select>
        </div>
        <div className="col-span-2 flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">The resident</label>
          <input
            type="text"
            placeholder="Write Here..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            defaultValue={selectedRoom?.resident || ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Check in</label>
          <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Check in</label>
          <input type="time" defaultValue="00:00" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Check out</label>
          <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Check out</label>
          <input type="time" defaultValue="00:00" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
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
                 Are you sure you want to delete room {roomToDelete?.roomNumber} permanently?
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

      {/* Room QR Code Modal */}
      {showQRModal && roomForQR && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        >
          <div
            className="bg-white flex flex-col items-center"
            style={{
              width: "500px",
              height: "451.0395202636719px",
              top: "286px",
              left: "470px",
              borderRadius: "10px",
              paddingTop: "30px",
              paddingBottom: "30px",
              gap: "30px",
              opacity: 1,
            }}
          >
            {/* Heading Section */}
            <div
              className="flex items-center justify-center"
              style={{
                width: "500px",
                height: "32px",
                paddingRight: "20px",
                paddingLeft: "20px",
                gap: "10px",
                opacity: 1,
              }}
            >
              <h2 className="text-lg font-semibold text-black">Room QR code</h2>
            </div>

            {/* QR Code Section */}
            <div
              className="flex items-center justify-center"
              style={{
                width: "231.99978637695312px",
                height: "231.99951171875px",
                opacity: 1,
              }}
            >
              {/* QR Code Pattern */}
              <div
                className="bg-black"
                style={{
                  width: "189.7466583251953px",
                  height: "189.7452850341797px",
                  marginTop: "20.82px",
                  marginLeft: "21.14px",
                  opacity: 1,
                  // Simple QR code pattern representation
                  backgroundImage: `
                    linear-gradient(90deg, transparent 0%, transparent 10%, black 10%, black 20%, transparent 20%, transparent 30%, black 30%, black 40%, transparent 40%, transparent 50%, black 50%, black 60%, transparent 60%, transparent 70%, black 70%, black 80%, transparent 80%, transparent 90%, black 90%, black 100%),
                    linear-gradient(0deg, transparent 0%, transparent 10%, black 10%, black 20%, transparent 20%, transparent 30%, black 30%, black 40%, transparent 40%, transparent 50%, black 50%, black 60%, transparent 60%, transparent 70%, black 70%, black 80%, transparent 80%, transparent 90%, black 90%, black 100%)
                  `,
                  backgroundSize: "20px 20px",
                }}
              />
            </div>

            {/* Border */}
            <div
              style={{
                width: "500px",
                height: "0px",
                borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                opacity: 1,
              }}
            />

            {/* Buttons Row */}
            <div
              className="flex items-center justify-end gap-3"
              style={{
                width: "500px",
                height: "37.040000915527344px",
                paddingRight: "20px",
                paddingLeft: "20px",
                gap: "10px",
                opacity: 1,
              }}
            >
              {/* Download Button */}
              <button
                onClick={handleDownloadQR}
                className="flex items-center gap-4 text-white rounded"
                style={{
                  width: "107px",
                  height: "37.040000915527344px",
                  gap: "16px",
                  background: "#1F2A44",
                  borderRadius: "6px",
                  padding: "8.52px 10px",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="w-4 h-4"
                >
                  <path
                    d="M8 1V11M8 11L4 7M8 11L12 7M1 15H15"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-sm font-medium">Download</span>
              </button>

              {/* Cancel Button */}
              <button
                onClick={closeQRModal}
                className="flex items-center justify-center border rounded"
                style={{
                  width: "66px",
                  height: "37.040000915527344px",
                  borderRadius: "6px",
                  paddingTop: "8.52px",
                  paddingRight: "10px",
                  paddingBottom: "8.52px",
                  paddingLeft: "10px",
                  gap: "6px",
                  background: "#FBFAFA",
                  border: "1px solid #CED4DA",
                  color: "#000",
                }}
              >
                <span className="text-sm font-medium">Cancel</span>
              </button>
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
              height: "443.1300048828125px",
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

            {/* Input Section */}
            <div
              className="flex flex-col border-b"
              style={{
                width: "704px",
                height: "272.0899963378906px",
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
                  height: "232.08999633789062px",
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
                      defaultValue={roomToAssign?.roomNumber}
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

                {/* Second Row */}
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
                      type="text"
                      placeholder="mm/dd/yyyy"
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
                      type="text"
                      defaultValue="00:00 AM"
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
                      type="text"
                      placeholder="mm/dd/yyyy"
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
                      type="text"
                      defaultValue="00:00 AM"
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
                  className="flex items-center justify-center text-white rounded"
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
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Room History Modal - Right Slide Popup */}
      {showHistoryModal && roomForHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
          <div className=" bg-white w-[50vw] h-full flex flex-col">
            {/* Header */}
            <div className=" border-gray-200 flex-shrink-0">
              <div className="pt-5 pb-5 pr-6 pl-6 flex items-center justify-between border-b">
                <h2 className="text-xl font-semibold text-black">Room History</h2>
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
                  Found {mockRoomHistory.length} resident
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
              <div 
                className="grid gap-4"
                style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
              >
                {mockRoomHistory.slice(0, 20).map((history) => (
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
            </div>

            {/* Fixed Pagination at Bottom */}
            <div className="p-6 border-t border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-end gap-2">
                <button className="w-8 h-8 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-100">‹</button>
                <button className="w-8 h-8 rounded-full text-sm font-medium bg-primary text-white">1</button>
                <button className="w-8 h-8 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-100">2</button>
                <button className="w-8 h-8 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-100">3</button>
                <button className="w-8 h-8 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-100">›</button>
              </div>
            </div>
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
                     className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                   />
                 </div>
                 
                 {/* Status */}
                 <div className="flex flex-col gap-2">
                   <label className="text-sm font-medium text-gray-700">Status</label>
                   <select 
                     value={newRoomStatus}
                     onChange={(e) => setNewRoomStatus(e.target.value as "Full" | "Empty")}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
                   opacity: 1,
                 }}
               >
                 Cancel
               </button>
               <button
                 onClick={handleSaveStepOne}
                 className="flex items-center justify-center rounded text-white"
                 style={{
                   padding: "8.52px 20px",
                   borderRadius: "6px",
                   background: "#1F2A44",
                   fontWeight: 400,
                   fontSize: "14px",
                   lineHeight: "19.5px",
                   textAlign: "center",
                   opacity: 1,
                 }}
               >
                 Save
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
         
       >
         {/* First Row - Room name and Status (pre-filled) */}
         <div className="flex flex-col gap-2">
           <label className="text-sm font-medium text-gray-700">Room name</label>
           <input
             type="text"
             placeholder="Write Here..."
             value={newRoomName}
             onChange={(e) => setNewRoomName(e.target.value)}
             className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
           />
         </div>
         <div className="flex flex-col gap-2">
           <label className="text-sm font-medium text-gray-700">Status</label>
           <select 
             value={newRoomStatus}
             onChange={(e) => setNewRoomStatus(e.target.value as "Full" | "Empty")}
             className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
             className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
           />
         </div>

         {/* Third Row - Check in Date and Time */}
         <div className="flex flex-col gap-2">
           <label className="text-sm font-medium text-gray-700">Check in</label>
           <input
             type="date"
             value={newCheckInDate}
             onChange={(e) => setNewCheckInDate(e.target.value)}
             className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
           />
         </div>
         <div className="flex flex-col gap-2">
           <label className="text-sm font-medium text-gray-700">Check in</label>
           <input
             type="time"
             value={newCheckInTime}
             onChange={(e) => setNewCheckInTime(e.target.value)}
             className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
           />
         </div>

         {/* Fourth Row - Check out Date and Time */}
         <div className="flex flex-col gap-2">
           <label className="text-sm font-medium text-gray-700">Check out</label>
           <input
             type="date"
             value={newCheckOutDate}
             onChange={(e) => setNewCheckOutDate(e.target.value)}
             className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
           />
         </div>
         <div className="flex flex-col gap-2">
           <label className="text-sm font-medium text-gray-700">Check out</label>
           <input
             type="time"
             value={newCheckOutTime}
             onChange={(e) => setNewCheckOutTime(e.target.value)}
             className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
           />
         </div>
       </RoomModal>
     </div>
   )
 }

