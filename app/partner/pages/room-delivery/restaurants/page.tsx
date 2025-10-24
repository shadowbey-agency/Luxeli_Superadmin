"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { RiArrowDownSLine, RiCalendarLine, RiAddLine } from "react-icons/ri"
import PublicIcon from "../../../components/public-icon"
import AddRestaurantModal from "../../../components/add-restaurant-modal"

// Custom RestaurantCard component
const RestaurantCard = ({ 
  id, 
  title, 
  type, 
  location, 
  date, 
  status, 
  description, 
  image, 
  itemsCount,
  workTime,
  onEdit, 
  onDelete,
  router
}: {
  id: number
  title: string
  type: string
  location: string
  date: string
  status: string
  description: string
  image?: string
  itemsCount: number
  workTime: string
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
  router: any
}) => {
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <div className="border rounded-[8px] overflow-hidden w-full h-full bg-white flex flex-col shadow-lg">
      {/* Image Section */}
      <div className="relative w-full h-[220px] bg-gray-200 flex items-center justify-center flex-shrink-0">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
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
            backgroundColor: status === "Published" ? "#17B26A" : "#FF0D0D"
          }}
        >
          {status}
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
                      router.push('/partner/pages/room-delivery/restaurants/view-items')
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View items
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">
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
          {title}
        </div>
        
        {/* Items Found and Work Time */}
        <div className="flex flex-col gap-1 mt-auto">
          {/* Items Found Row */}
          <div className="flex justify-between items-center">
            <span className="text-[15px] text-[#21212199]">
              {itemsCount} items found
            </span>
          </div>
          
          {/* Work Time Row */}
          <div className="flex justify-between items-center">
            <span className="text-[15px] text-[#21212199]">
              Work time
            </span>
            <span className="text-[15px] text-[#21212199]">
              {workTime}
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

  const handleEditRestaurant = (id: number) => {
    console.log("Edit restaurant:", id)
    // Handle edit logic here
  }

  const handleDeleteRestaurant = (id: number) => {
    console.log("Delete restaurant:", id)
    // Handle delete logic here
  }

  const handleAddRestaurant = () => {
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

  // Sample restaurant data - matching RestaurantCard structure
  const restaurants = [
    {
      id: 1,
      title: "Restaurant name",
      type: "Italian",
      location: "Downtown",
      date: "Jan 15, 2025",
      status: "Published",
      description: "Authentic Italian cuisine with fresh ingredients and traditional recipes. Perfect for room delivery service with quick preparation times.",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop",
      itemsCount: 12,
      workTime: "7:30AM-12PM"
    },
    {
      id: 2,
      title: "Restaurant name", 
      type: "Asian",
      location: "Midtown",
      date: "Jan 15, 2025",
      status: "Unpublished",
      description: "Modern Asian cuisine blending traditional flavors with contemporary techniques. Specializing in quick delivery and fresh ingredients.",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=200&fit=crop",
      itemsCount: 12,
      workTime: "7:30AM-12PM"
    }
  ]

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
              <span className="text-sm text-muted-foreground">{restaurants.length.toString().padStart(2, '0')} Restaurants found</span>
            </div>
            
            <div className="flex items-center gap-4">
                <input 
                  type="text" 
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
                    <option>Status</option>
                    <option>Published</option>
                    <option>Unpublished</option>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {restaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  id={restaurant.id}
                  title={restaurant.title}
                  type={restaurant.type}
                  location={restaurant.location}
                  date={restaurant.date}
                  status={restaurant.status}
                  description={restaurant.description}
                  image={restaurant.image}
                  itemsCount={restaurant.itemsCount}
                  workTime={restaurant.workTime}
                  onEdit={handleEditRestaurant}
                  onDelete={handleDeleteRestaurant}
                  router={router}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Restaurant Modal */}
      <AddRestaurantModal 
        isOpen={isAddRestaurantModalOpen}
        onClose={() => setIsAddRestaurantModalOpen(false)}
      />
    </div>
  )
}
