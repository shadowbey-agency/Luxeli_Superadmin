"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RiArrowDownSLine, RiCalendarLine } from "react-icons/ri"
import PublicIcon from "../../../components/public-icon"
import ActivityCard from "../../../components/activity-card"
import AddActivityModal from "../../../components/add-activity-modal"
import { getAuthToken } from "@/lib/auth-utils"

interface Activity {
  _id: string
  activityTitle: string
  status: "published" | "unpublished"
  activityDescription: string
  activityImage?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export default function ActivityAlertsActivitiesPage() {
  const router = useRouter()
  const [isAddActivityModalOpen, setIsAddActivityModalOpen] = useState(false)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)
  const [totalActivities, setTotalActivities] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  // Fetch activities from API
  const fetchActivities = async () => {
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

      const response = await fetch(`/api/partner/activities?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()

      if (data.success && data.data?.activities) {
        setActivities(data.data.activities)
        if (data.data.pagination) {
          setTotalActivities(data.data.pagination.total)
        }
      }
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery, statusFilter])

  const handleActivityCreated = () => {
    setCurrentPage(1)
    setEditingActivity(null)
    fetchActivities()
  }

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity)
    setIsAddActivityModalOpen(true)
  }

  const handleDeleteActivity = async (activity: Activity) => {
    if (confirm('Are you sure you want to delete this activity?')) {
      try {
        const token = getAuthToken()
        if (!token) return
        await fetch(`/api/partner/activities/${activity._id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
        fetchActivities()
      } catch (error) {
        console.error('Error deleting activity:', error)
      }
    }
  }

  const handleAddActivity = () => {
    setEditingActivity(null)
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
                <span className="text-sm text-muted-foreground">{totalActivities} Activit{totalActivities !== 1 ? 'ies' : 'y'} found</span>
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
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-muted-foreground">No activities found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {activities.map((activity) => (
                  <ActivityCard
                    key={activity._id}
                    id={parseInt(activity._id.slice(-6), 16)} // Convert to number for ActivityCard
                    title={activity.activityTitle}
                    type="Activity Alert" // Default type since model doesn't have type field
                    location="General" // Default location since model doesn't have location field
                    date={new Date(activity.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    status={activity.status === "published" ? "Published" : "Unpublished"}
                    description={activity.activityDescription}
                    image={activity.activityImage || ""}
                    onEdit={() => handleEditActivity(activity)}
                    onDelete={() => handleDeleteActivity(activity)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Activity Modal */}
      <AddActivityModal 
        isOpen={isAddActivityModalOpen}
        onClose={() => {
          setIsAddActivityModalOpen(false)
          setEditingActivity(null)
        }}
        onSuccess={handleActivityCreated}
        activity={editingActivity}
      />
    </div>
  )
}
