"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RiArrowDownSLine, RiImageLine } from "react-icons/ri"
import PublicIcon from "../../../components/public-icon"
import AddItemModal from "../../../components/add-item-modal"
import { getAuthToken } from "@/lib/auth-utils"
import Image from "next/image"

interface RequestItem {
  _id: string
  name: string
  category: string
  status: "published" | "unpublished"
  description: string
  image?: string
  createdAt: string
  updatedAt: string
}

export default function RequestsManagementPage() {
  const router = useRouter()
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<RequestItem | null>(null)
  const [items, setItems] = useState<RequestItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)
  const [totalItems, setTotalItems] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")

  // Fetch items from API
  const fetchItems = async () => {
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

      const response = await fetch(`/api/partner/requests-management?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()

      if (data.success && data.data?.requests) {
        setItems(data.data.requests)
        if (data.data.pagination) {
          setTotalItems(data.data.pagination.total)
        }
      }
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery, statusFilter, categoryFilter])

  const handleItemCreated = () => {
    setCurrentPage(1)
    setEditingItem(null)
    fetchItems()
  }

  const handleEditItem = (item: RequestItem) => {
    setEditingItem(item)
    setIsAddItemModalOpen(true)
  }

  const tabs = [
    {
      id: "requests",
      label: "Requests",
      icon: <PublicIcon src="/assets/icons/houskeeping-request.svg" alt="Requests" width={16} height={16} />,
      href: "/partner/pages/housekeeping/requests"
    },
    {
      id: "house-cleaning", 
      label: "House cleaning",
      icon: <PublicIcon src="/assets/icons/housekeeping-cleaning.svg" alt="House cleaning" width={16} height={16} />,
      href: "/partner/pages/housekeeping/house-cleaning"
    },
    {
      id: "requests-management",
      label: "Requests management", 
      icon: <PublicIcon src="/assets/icons/settings.svg" alt="Requests management" width={16} height={16} />,
      href: "/partner/pages/housekeeping/requests-management"
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
                tab.id === "requests-management"
                  ? "text-foreground -mb-[2px]"
                  : "text-muted-foreground hover:text-foreground -mb-[2px]"
              }`}
              style={{
                width: "210px",
                borderBottom: tab.id === "requests-management" ? "2px solid #1F2A44" : "2px solid #EDEDED"
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
            <h2 className="text-2xl font-bold text-foreground mb-2">Requests management</h2>
            <p className="text-muted-foreground">Catalog of amenity items for "Request needed". Publish, edit, or remove products.</p>
          </div>

          {/* Search Bar Row */}
          <div style={{ background: "#FFFFFF", padding: "16px", borderBottom: "1px solid #E7E7E7" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{totalItems} Item{totalItems !== 1 ? 's' : ''} found</span>
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
                  <option value="Pillows">Pillows</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Cleaning">Cleaning</option>
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
              
                     {/* Add new item button */}
                     <button
                       onClick={() => {
                         setEditingItem(null)
                         setIsAddItemModalOpen(true)
                       }}
                className="flex py-[8.52px] px-5 justify-center items-center gap-1.5 rounded-md bg-[#1F2A44] text-white hover:bg-[#1F2A44]/90 transition-colors"
                style={{ borderRadius: "6px" }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm font-medium">Add a new item</span>
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
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-muted-foreground">No items found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item) => (
                  <div 
                    key={item._id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full flex flex-col"
                    style={{
                      minHeight: "304px"
                    }}
                  >
                    {/* Header Section */}
                    <div 
                      className="relative flex items-center justify-center w-full"
                      style={{
                        height: "196px",
                        borderTopLeftRadius: "10px",
                        borderTopRightRadius: "10px",
                        overflow: "hidden",
                        background: "#F9F9F9"
                      }}
                    >
                      {/* Status Badge */}
                      <div 
                        className="absolute top-3 left-3 z-10 flex items-center justify-center"
                        style={{
                          width: "80px",
                          height: "22px",
                          gap: "4px",
                          borderRadius: "4px",
                          borderWidth: "0.5px",
                          padding: "10px",
                          background: item.status === "published" ? "#17B26A0D" : "#1F2A440D",
                          border: item.status === "published" ? "0.5px solid #17B26A40" : "0.5px solid #1F2A4440"
                        }}
                      >
                        <span 
                          className="text-xs font-medium capitalize"
                          style={{ 
                            color: item.status === "published" ? "#17B26A" : "#1F2A44"
                          }}
                        >
                          {item.status}
                        </span>
                      </div>

                      {/* Action Icons */}
                      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                        {/* Delete Icon */}
                        <button 
                          onClick={async () => {
                            if (confirm('Are you sure you want to delete this item?')) {
                              try {
                                const token = getAuthToken()
                                if (!token) return
                                await fetch(`/api/partner/requests-management/${item._id}`, {
                                  method: 'DELETE',
                                  headers: { 'Authorization': `Bearer ${token}` }
                                })
                                fetchItems()
                              } catch (error) {
                                console.error('Error deleting item:', error)
                              }
                            }
                          }}
                          className="p-1.5 bg-white hover:bg-gray-50 rounded shadow-sm border border-gray-200"
                        >
                          <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                        {/* Edit Icon */}
                        <button 
                          onClick={() => handleEditItem(item)}
                          className="p-1.5 bg-white hover:bg-gray-50 rounded shadow-sm border border-gray-200"
                        >
                          <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </div>

                      {/* Item Image */}
                      <div 
                        className="flex items-center justify-center"
                        style={{
                          width: "156px",
                          height: "125px",
                          background: "transparent"
                        }}
                      >
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={156}
                            height={125}
                            className="w-full h-full object-cover rounded"
                            style={{ background: "transparent" }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                            <RiImageLine className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div 
                      className="p-4 flex flex-col flex-1"
                      style={{
                        gap: "12px",
                        borderBottomLeftRadius:"10px",
                        borderBottomRightRadius:"10px"
                      }}
                    >
                      {/* Heading Row */}
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="font-semibold text-sm text-foreground">{item.name}</h2>
                        <span className="text-xs text-muted-foreground">{item.category}</span>
                      </div>
                      
                      {/* Description */}
                      <p 
                        className="text-xs"
                        style={{
                          fontWeight: "400",
                          fontSize: "13px",
                          color: "#21212199",
                          lineHeight: "1.5",
                          wordWrap: "break-word",
                          overflowWrap: "break-word"
                        }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Item Modal */}
      <AddItemModal 
        isOpen={isAddItemModalOpen} 
        onClose={() => {
          setIsAddItemModalOpen(false)
          setEditingItem(null)
        }} 
        onSuccess={handleItemCreated}
        item={editingItem}
      />
    </div>
  )
}

