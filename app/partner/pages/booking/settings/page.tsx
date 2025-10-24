"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { RiArrowDownSLine, RiCalendarLine } from "react-icons/ri"
import PublicIcon from "../../../components/public-icon"
import ServiceCard from "../../../components/service-card"
import AddServiceModal from "../../../components/add-service-modal"

export default function BookingSettingsPage() {
  const router = useRouter()
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false)

  const handleEditService = (id: number) => {
    console.log("Edit service:", id)
    // Handle edit logic here
  }

  const handleDeleteService = (id: number) => {
    console.log("Delete service:", id)
    // Handle delete logic here
  }

  const handleAddService = () => {
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

  // Sample service data
  const services = [
    {
      id: 1,
      name: "Kayaking Adventure",
      category: "Clubs",
      location: "Lake Resort",
      date: "Jan 15, 2025",
      price: "20$",
      status: "Published",
      description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
      image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/587978734.jpg?k=2e9f4bc2a6a8f574e14cb70b1392ece864fa25e4042172dcf3b0ce83315a3b87&o=&hp=1"
    },
    {
      id: 2,
      name: "Relaxing Massage",
      category: "SPA",
      location: "SPA Center",
      date: "Jan 15, 2025",
      price: "50$",
      status: "Published",
      description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
      image: "https://img.freepik.com/free-photo/forehead-massage_23-2147638154.jpg"
    },
    {
      id: 3,
      name: "Facial Treatment",
      category: "SPA",
      location: "SPA Center",
      date: "Jan 15, 2025",
      price: "35$",
      status: "Published",
      description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
      image: "https://img.grouponcdn.com/iam_raw/tVdtift3qfeHqDLvAZE6/zs-5616x3744/v1/t2124x1284.webp"
    },
    {
      id: 4,
      name: "Room Service Dinner",
      category: "Restaurant",
      location: "Restaurant",
      date: "Jan 15, 2025",
      price: "25$",
      status: "Published",
      description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoV7hzmu6HKh30hkUevHJeecGWNiY254TyCA&s"
    },
    {
      id: 5,
      name: "Wine Tasting",
      category: "Restaurant",
      location: "Restaurant",
      date: "Jan 15, 2025",
      price: "30$",
      status: "Published",
      description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
      image: "https://images.squarespace-cdn.com/content/v1/5f24290fd0d0910ecab2b02e/b2b65c78-ad81-42a1-a304-8b696750716d/shutterstock_611011652-222.jpg"
    },
    {
      id: 6,
      name: "Hot Stone Therapy",
      category: "SPA",
      location: "SPA Center",
      date: "Jan 15, 2025",
      price: "60$",
      status: "Published",
      description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
      image: "https://img.freepik.com/free-photo/person-enjoying-time-nature_23-2151262753.jpg?semt=ais_hybrid&w=740&q=80"
    },
    {
      id: 7,
      name: "Breakfast in Bed",
      category: "Restaurant",
      location: "Restaurant",
      date: "Jan 15, 2025",
      price: "18$",
      status: "Published",
      description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
      image: "https://www.zingbus.com/blog/wp-content/uploads/2023/04/couple-family-traveling-together-min-scaled.jpg"
    },
    {
      id: 8,
      name: "Aromatherapy Session",
      category: "SPA",
      location: "SPA Center",
      date: "Jan 15, 2025",
      price: "40$",
      status: "Published",
      description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
      image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/587978734.jpg?k=2e9f4bc2a6a8f574e14cb70b1392ece864fa25e4042172dcf3b0ce83315a3b87&o=&hp=1"
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
                <span className="text-sm text-muted-foreground">30 Services found</span>
              </div>
              <div className="flex items-center gap-3">
                {/* Search bar */}
                <input 
                  type="text" 
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
                    <option>Category</option>
                    <option>Clubs</option>
                    <option>SPA</option>
                    <option>Restaurant</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <RiArrowDownSLine className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                
                {/* Status dropdown */}
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
                    <option>Draft</option>
                    <option>Archived</option>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  id={service.id}
                  name={service.name}
                  category={service.category}
                  location={service.location}
                  date={service.date}
                  price={service.price}
                  status={service.status}
                  description={service.description}
                  image={service.image}
                  onEdit={handleEditService}
                  onDelete={handleDeleteService}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Service Modal */}
      <AddServiceModal 
        isOpen={isAddServiceModalOpen}
        onClose={() => setIsAddServiceModalOpen(false)}
      />
    </div>
  )
}
