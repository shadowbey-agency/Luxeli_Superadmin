"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { RiArrowDownSLine, RiCalendarLine } from "react-icons/ri"
import PublicIcon from "../../../components/public-icon"
import ActivityCard from "../../../components/activity-card"
import AddActivityModal from "../../../components/add-activity-modal"

export default function ActivityAlertsActivitiesPage() {
  const router = useRouter()
  const [isAddActivityModalOpen, setIsAddActivityModalOpen] = useState(false)

  const handleEditActivity = (id: number) => {
    console.log("Edit activity:", id)
    // Handle edit logic here
  }

  const handleDeleteActivity = (id: number) => {
    console.log("Delete activity:", id)
    // Handle delete logic here
  }

  const handleAddActivity = () => {
    setIsAddActivityModalOpen(true)
  }

  const tabs = [
    {
      id: "requests",
      label: "Requests",
      icon: <PublicIcon src="/assets/icons/houskeeping-request.svg" alt="Requests" width={16} height={16} />,
      href: "/partner/pages/activity-alerts/requests"
    },
    {
      id: "activities", 
      label: "Activities",
      icon: <PublicIcon src="/assets/icons/menu-01.svg" alt="Activities" width={16} height={16} />,
      href: "/partner/pages/activity-alerts/activities"
    }
  ]

  // Sample activity data
  const activities = [
    {
      id: 1,
      title: "Security Monitoring",
      type: "Security Alert",
      location: "Hotel Lobby",
      date: "Jan 15, 2025",
      status: "Active",
      description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8ipA6E17y4LoKuHtZWjuJkPWWFPAUIkc5-w&s"
    },
    {
      id: 2,
      title: "System Health Check",
      type: "System Alert",
      location: "Reception",
      date: "Jan 15, 2025",
      status: "Active",
      description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
      image: "https://www.wayfairertravel.com/hs-fs/hubfs/Imported%20sitepage%20images/shutterstock_2398908619_fbl654.jpg?width=1920&height=590&name=shutterstock_2398908619_fbl654.jpg"
    },
    {
      id: 3,
      title: "Maintenance Alert",
      type: "Maintenance Alert",
      location: "Elevator",
      date: "Jan 15, 2025",
      status: "Inactive",
      description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
      image: "https://www.moxeemarketing.com/wp-content/uploads/2023/08/Long-boat-and-rocks-on-railay-beach-in-Krabi-Thailand.jpg"
    },
    {
      id: 4,
      title: "Pool Area Monitoring",
      type: "Activity Alert",
      location: "Pool Area",
      date: "Jan 15, 2025",
      status: "Active",
      description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
      image: "https://image.vietnamnews.vn/uploadvnnews/Article/2025/1/9/396482_Visual.jpeg"
    },
    {
      id: 5,
      title: "Emergency Response",
      type: "Emergency Alert",
      location: "Kitchen",
      date: "Jan 15, 2025",
      status: "Inactive",
      description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
      image: "https://fyi50plus.com/wp-content/uploads/2024/04/grandparents-raising-grandchildren-W-jpg.webp"
    },
    {
      id: 6,
      title: "Guest Activity Tracking",
      type: "Activity Alert",
      location: "Restaurant",
      date: "Jan 15, 2025",
      status: "Active",
      description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
      image: "https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2015/6/25/1435228611797/b2c7829a-1917-463d-a0ae-c62e944f1e4b-2060x1236.jpeg?width=700&quality=85&auto=format&fit=max&s=37d9b9ac8a60d6882541a8bd2cf85925"
    },
    {
      id: 7,
      title: "Network Monitoring",
      type: "System Alert",
      location: "IT Room",
      date: "Jan 15, 2025",
      status: "Active",
      description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
      image: "https://www.centralasia-travel.com/upload/tiles/bike-uzbekistan.jpg"
    },
    {
      id: 8,
      title: "Temperature Alert",
      type: "Maintenance Alert",
      location: "HVAC System",
      date: "Jan 15, 2025",
      status: "Inactive",
      description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8ipA6E17y4LoKuHtZWjuJkPWWFPAUIkc5-w&s"
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
                tab.id === "activities"
                  ? "text-foreground -mb-[2px]"
                  : "text-muted-foreground hover:text-foreground -mb-[2px]"
              }`}
              style={{
                width: "274px",
                borderBottom: tab.id === "activities" ? "2px solid #1F2A44" : "2px solid #EDEDED"
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
            <h2 className="text-2xl font-bold text-foreground mb-2">Activities</h2>
            <p className="text-muted-foreground">Jorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>

          {/* Search Bar Row */}
          <div style={{ background: "#FFFFFF", padding: "16px", borderBottom: "1px solid #E7E7E7" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">8 Activities found</span>
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
                    <option>Activity Alert</option>
                    <option>Security Alert</option>
                    <option>Maintenance Alert</option>
                    <option>System Alert</option>
                    <option>Emergency Alert</option>
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
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Pending</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <RiArrowDownSLine className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                
                {/* Calendar box */}
                <button 
                  className="flex justify-center items-center hover:bg-muted/50 transition-colors"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "6px",
                    border: "1px solid #CED4DA",
                   
                  }}
                >
                  <RiCalendarLine className="w-5 h-5 text-[#1F2A44]" />
                </button>
                
                {/* Add new activity button */}
                <button 
                  onClick={handleAddActivity}
                  className="flex py-[8.52px] px-5 justify-center items-center gap-1.5 rounded-[6px] bg-[#1F2A44] text-white hover:bg-[#1F2A44]/90 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-sm font-medium">Add a new activity</span>
                </button>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div style={{ background: "#FFFFFF", padding: "16px" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {activities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  id={activity.id}
                  title={activity.title}
                  type={activity.type}
                  location={activity.location}
                  date={activity.date}
                  status={activity.status}
                  description={activity.description}
                  image={activity.image}
                  onEdit={handleEditActivity}
                  onDelete={handleDeleteActivity}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Activity Modal */}
      <AddActivityModal 
        isOpen={isAddActivityModalOpen}
        onClose={() => setIsAddActivityModalOpen(false)}
      />
    </div>
  )
}
