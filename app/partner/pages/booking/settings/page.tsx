"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RiArrowDownSLine, RiCalendarLine } from "react-icons/ri"
import PublicIcon from "../../../components/public-icon"
import ServiceCard from "../../../components/service-card"
import AddServiceModal from "../../../components/add-service-modal"
import { getAuthToken } from "@/lib/auth-utils"

interface BookingSetting {
  _id: string
  serviceName: string
  category: string
  serviceDescription: string
  serviceLocation: string
  servicePrice: number
  startDate: string
  endDate: string
  status: "published" | "unpublished"
  bookDate: boolean
  serviceImage?: string
  createdAt: string
  updatedAt: string
}

export default function BookingSettingsPage() {
  const router = useRouter()
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<BookingSetting | null>(null)
  const [services, setServices] = useState<BookingSetting[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)
  const [totalServices, setTotalServices] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")

  // Fetch services from API
  const fetchServices = async () => {
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
      if (categoryFilter) queryParams.append('category', categoryFilter)

      const response = await fetch(`/api/partner/booking-settings?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()

      if (data.success && data.data?.bookings) {
        setServices(data.data.bookings)
        if (data.data.pagination) {
          setTotalServices(data.data.pagination.total)
        }
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery, statusFilter, categoryFilter])

  const handleServiceCreated = () => {
    setCurrentPage(1)
    setEditingService(null)
    fetchServices()
  }

  const handleEditService = (service: BookingSetting) => {
    setEditingService(service)
    setIsAddServiceModalOpen(true)
  }

  const handleDeleteService = async (service: BookingSetting) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        const token = getAuthToken()
        if (!token) return
        await fetch(`/api/partner/booking-settings/${service._id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
        fetchServices()
      } catch (error) {
        console.error('Error deleting service:', error)
      }
    }
  }

  const handleAddService = () => {
    setEditingService(null)
    setIsAddServiceModalOpen(true)
  }

  const tabs = [
    {
      id: "requests",
      label: "Requests",
      icon: <PublicIcon src="/assets/icons/houskeeping-request.svg" alt="Requests" width={16} height={16} />,
      href: "/partner/pages/booking/requests"
    },
    {
      id: "bookings-setting", 
      label: "Bookings setting",
      icon: <PublicIcon src="/assets/icons/settings.svg" alt="Bookings setting" width={16} height={16} />,
      href: "/partner/pages/booking/settings"
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
                tab.id === "bookings-setting"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={{
                width: "274px",
                borderBottom: tab.id === "bookings-setting" ? "2px solid #1F2A44" : "none"
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
            <h2 className="text-2xl font-bold text-foreground mb-2">Bookings setting</h2>
            <p className="text-muted-foreground">Jorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>

          {/* Search Bar Row */}
          <div style={{ background: "#FFFFFF", padding: "16px", borderBottom: "1px solid #E7E7E7" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{totalServices} Service{totalServices !== 1 ? 's' : ''} found</span>
              </div>
              <div className="flex items-center gap-3">
                {/* Search bar */}
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  placeholder="Search..." 
                  style={{
                    width: "380px",
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
                
                {/* Category dropdown */}
                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={(e) => {
                      setCategoryFilter(e.target.value)
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
                    <option value="">Category</option>
                    <option value="clubs">Clubs</option>
                    <option value="spa">SPA</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="activities">Activities</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <RiArrowDownSLine className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                
                {/* Status dropdown */}
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
                    <option value="published">Published</option>
                    <option value="unpublished">Unpublished</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <RiArrowDownSLine className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                
                {/* Calendar box */}
                <button 
                  className="flex justify-center items-center hover:bg-muted/50 transition-colors"
                  style={{
                    width: "35px",
                    height: "35.04px",
                    borderRadius: "4px",
                    border: "1px solid #CED4DA",
                    gap: "6px"
                  }}
                >
                  <RiCalendarLine className="w-4 h-4 text-[#1F2A44]" />
                </button>
                
                {/* Add new service button */}
                <button 
                  onClick={handleAddService}
                  className="flex py-[8.52px] px-5 justify-center items-center gap-1.5 rounded-md bg-[#1F2A44] text-white hover:bg-[#1F2A44]/90 transition-colors"
                  style={{ borderRadius: "6px" }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-sm font-medium">Add a new service</span>
                </button>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div style={{ background: "#FFFFFF", padding: "16px" }}>
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : services.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-muted-foreground">No services found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {services.map((service) => (
                  <ServiceCard
                    key={service._id}
                    id={parseInt(service._id.slice(-6), 16)} // Convert to number for ServiceCard
                    name={service.serviceName}
                    category={service.category}
                    location={service.serviceLocation}
                    date={new Date(service.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    price={`${service.servicePrice}$`}
                    status={service.status === "published" ? "Published" : "Unpublished"}
                    description={service.serviceDescription}
                    image={service.serviceImage || ""}
                    onEdit={() => handleEditService(service)}
                    onDelete={() => handleDeleteService(service)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Service Modal */}
      <AddServiceModal 
        isOpen={isAddServiceModalOpen}
        onClose={() => {
          setIsAddServiceModalOpen(false)
          setEditingService(null)
        }}
        onSuccess={handleServiceCreated}
        service={editingService}
      />
    </div>
  )
}
