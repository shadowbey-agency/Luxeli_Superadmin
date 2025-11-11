"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RiArrowDownSLine, RiCalendarLine, RiAddLine, RiRestaurantLine } from "react-icons/ri"
import PublicIcon from "../../../components/public-icon"
import AddRestaurantModal from "../../../components/add-restaurant-modal"
import { getAuthToken } from "@/lib/auth-utils"

interface Restaurant {
  _id: string
  restaurantName: string
  status: "open" | "closed"
  startWork: string
  endWork: string
  restaurantImage?: string
  items: Array<{
    itemName: string
    status: "published" | "unpublished"
    category: string
    itemPrice: number
    itemDescription: string
    itemImage?: string
  }>
  createdAt: string
  updatedAt: string
}

// Custom RestaurantCard component
const RestaurantCard = ({ 
  restaurant,
  onEdit, 
  onDelete,
  router
}: {
  restaurant: Restaurant
  onEdit?: (restaurant: Restaurant) => void
  onDelete?: (restaurant: Restaurant) => void
  router: any
}) => {
  const formatTime = (time: string) => {
    if (!time) return ""
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes}${ampm}`
  }
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <div className="border rounded-[8px] overflow-hidden w-full h-full bg-white flex flex-col shadow-lg">
      {/* Image Section */}
      <div className="relative w-full h-[220px] bg-gray-200 flex items-center justify-center flex-shrink-0">
        {restaurant.restaurantImage ? (
          <img src={restaurant.restaurantImage} alt={restaurant.restaurantName} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center">
            <RiRestaurantLine className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <div className="text-gray-500 text-sm">Restaurant</div>
          </div>
        )}
        
        {/* Status Badge */}
        <div 
          className="absolute flex items-center justify-center top-[13px] left-[11.96px] w-[79.92px] h-[22px] px-[10px] rounded text-white text-[11px] font-semibold"
          style={{
            backgroundColor: restaurant.status === "open" ? "#17B26A" : "#FF0D0D"
          }}
        >
          {restaurant.status === "open" ? "Open" : "Closed"}
        </div>
        
        {/* Three Dot Menu */}
        <div className="absolute top-[13px] right-[11.96px]">
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center justify-center w-[32px] h-[32px] rounded bg-white border border-gray-200 shadow-lg"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-[8px] shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => {
                      setShowDropdown(false)
                      router.push(`/partner/pages/room-delivery/restaurants/view-items?id=${restaurant._id}`)
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View items
                  </button>
                  <button 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => {
                      setShowDropdown(false)
                      onEdit?.(restaurant)
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                    onClick={() => {
                      setShowDropdown(false)
                      onDelete?.(restaurant)
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-5 flex flex-col gap-2 flex-1">
        {/* Restaurant Name */}
        <div className="font-bold text-[17px] text-[#212121]">
          {restaurant.restaurantName}
        </div>
        
        {/* Items Found and Work Time */}
        <div className="flex flex-col gap-1 mt-auto">
          {/* Items Found Row */}
          <div className="flex justify-between items-center">
            <span className="text-[15px] text-[#21212199]">
              {restaurant.items?.length || 0} items found
            </span>
          </div>
          
          {/* Work Time Row */}
          <div className="flex justify-between items-center">
            <span className="text-[15px] text-[#21212199]">
              Work time
            </span>
            <span className="text-[15px] text-[#21212199]">
              {formatTime(restaurant.startWork)} - {formatTime(restaurant.endWork)}
            </span>
          </div>
        </div>

        {/* Add New Items Button */}
        <button 
          className="w-full flex items-center justify-center gap-[6px] rounded-[6px] border border-[#DDDFE3] text-center"
          style={{
            height: "37.040000915527344px",
            paddingTop: "8.52px",
            paddingRight: "20px",
            paddingBottom: "8.52px",
            paddingLeft: "20px",
            background: "#E9EAEC",
            borderWidth: "1px",
            fontWeight: "500",
            fontSize: "14px",
            lineHeight: "19.5px",
            color: "#1F2A44",
            verticalAlign: "middle"
          }}
        >
          <RiAddLine className="w-4 h-4" />
          Add new items
        </button>
      </div>
    </div>
  )
}

export default function RoomDeliveryRestaurantsPage() {
  const router = useRouter()
  const [isAddRestaurantModalOpen, setIsAddRestaurantModalOpen] = useState(false)
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)
  const [totalRestaurants, setTotalRestaurants] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  // Fetch restaurants from API
  const fetchRestaurants = async () => {
    try {
      setIsLoading(true)
      const token = getAuthToken()
      if (!token) {
        console.error('No auth token found')
        setIsLoading(false)
        return
      }

      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      })
      
      if (searchQuery) queryParams.append('search', searchQuery)
      if (statusFilter) queryParams.append('status', statusFilter)

      const response = await fetch(`/api/partner/restaurants?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()

      if (data.success && data.data?.restaurants) {
        setRestaurants(data.data.restaurants)
        if (data.data.pagination) {
          setTotalRestaurants(data.data.pagination.total)
        }
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRestaurants()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery, statusFilter])

  const handleRestaurantCreated = () => {
    setCurrentPage(1)
    setEditingRestaurant(null)
    fetchRestaurants()
  }

  const handleEditRestaurant = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant)
    setIsAddRestaurantModalOpen(true)
  }

  const handleDeleteRestaurant = async (restaurant: Restaurant) => {
    if (confirm('Are you sure you want to delete this restaurant?')) {
      try {
        const token = getAuthToken()
        if (!token) return
        await fetch(`/api/partner/restaurants/${restaurant._id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
        fetchRestaurants()
      } catch (error) {
        console.error('Error deleting restaurant:', error)
      }
    }
  }

  const handleAddRestaurant = () => {
    setEditingRestaurant(null)
    setIsAddRestaurantModalOpen(true)
  }

  const tabs = [
    {
      id: "requests",
      label: "Requests",
      icon: <PublicIcon src="/assets/icons/houskeeping-request.svg" alt="Requests" width={16} height={16} />,
      href: "/partner/pages/room-delivery/requests"
    },
    {
      id: "restaurants", 
      label: "Restaurants",
      icon: <PublicIcon src="/assets/icons/resturent.svg" alt="Restaurants" width={16} height={16} />,
      href: "/partner/pages/room-delivery/restaurants"
    }
  ]

  // Format time from HH:MM to HH:MM AM/PM
  const formatTime = (time: string) => {
    if (!time) return ""
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes}${ampm}`
  }

  return (
    <div className="p-6">
      {/* Tab Navigation */}
      <div className="mb-6 rounded-t-lg">
        <div className="flex items-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => router.push(tab.href)}
              className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative focus:outline-none flex-shrink-0 ${
                tab.id === "restaurants"
                  ? "text-foreground -mb-[2px]"
                  : "text-muted-foreground hover:text-foreground -mb-[2px]"
              }`}
              style={{
                width: "274px",
                borderBottom: tab.id === "restaurants" ? "2px solid #1F2A44" : "2px solid #EDEDED"
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {/* Main Container */}
        <div style={{ borderRadius: "8px", border: "1px solid #00000014", overflow: "hidden" }}>
          {/* Main Heading Section */}
          <div style={{ background: "#FBFAFA", padding: "16px", borderBottom: "1px solid #E7E7E7" }}>
            <h2 className="text-2xl font-bold text-foreground mb-2">Restaurants</h2>
            <p className="text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>

          {/* Controls Section */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200" style={{ background: "#FFFFFF" }}>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{totalRestaurants} Restaurant{totalRestaurants !== 1 ? 's' : ''} found</span>
            </div>
            
            <div className="flex items-center gap-4">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  placeholder="Search..." 
                  className="w-80 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
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
                />
              
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30"
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
                    <option value="">Status</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <RiArrowDownSLine className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              
              {/* Add new restaurant button */}
              <button 
                onClick={handleAddRestaurant}
                className="flex py-[8.52px] px-5 justify-center items-center gap-1.5 rounded-[6px] bg-[#1F2A44] text-white hover:bg-[#1F2A44]/90 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm font-medium">Add a new restaurant</span>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div style={{ background: "#FFFFFF", padding: "16px" }}>

            {/* Cards Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : restaurants.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-muted-foreground">No restaurants found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {restaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant._id}
                    restaurant={restaurant}
                    onEdit={handleEditRestaurant}
                    onDelete={handleDeleteRestaurant}
                    router={router}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Restaurant Modal */}
      <AddRestaurantModal 
        isOpen={isAddRestaurantModalOpen}
        onClose={() => {
          setIsAddRestaurantModalOpen(false)
          setEditingRestaurant(null)
        }}
        onSuccess={handleRestaurantCreated}
        restaurant={editingRestaurant}
      />
    </div>
  )
}
