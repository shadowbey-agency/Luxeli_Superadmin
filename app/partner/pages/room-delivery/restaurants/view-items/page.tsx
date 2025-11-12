"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { RiArrowLeftSLine, RiArrowDownSLine, RiAddLine, RiArrowRightSLine } from "react-icons/ri"
import { getAuthToken } from "@/lib/auth-utils"
import AddRestaurantItemModal from "../../../../components/add-restaurant-item-modal"

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic'

interface RestaurantItem {
  itemName: string
  status: "published" | "unpublished"
  category: string
  itemPrice: number
  itemDescription: string
  itemImage?: string
}

interface Restaurant {
  _id: string
  restaurantName: string
  status: "open" | "closed"
  startWork: string
  endWork: string
  restaurantImage?: string
  items: RestaurantItem[]
  createdAt: string
  updatedAt: string
}

// Item Card component matching booking settings page style
const ItemCard = ({ 
  item,
  itemIndex,
  restaurantId,
  onEdit, 
  onDelete,
  onRefresh
}: {
  item: RestaurantItem
  itemIndex: number
  restaurantId: string
  onEdit?: (item: RestaurantItem, itemIndex: number) => void
  onDelete?: (itemIndex: number) => void
  onRefresh?: () => void
}) => {
  return (
    <div className="border rounded-[10px] overflow-hidden w-full h-full bg-white flex flex-col shadow-lg">
      {/* Image Section */}
      <div className="relative w-full h-[220px] bg-gray-200 flex items-center justify-center flex-shrink-0">
        {item.itemImage ? (
          <img src={item.itemImage} alt={item.itemName} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center">
            <div className="text-gray-500 text-sm">Item Image</div>
          </div>
        )}
        
        {/* Status Badge */}
        <div 
          className="absolute flex items-center justify-center top-[13px] left-[11.96px] w-[79.92px] h-[22px] px-[10px] rounded text-white text-[11px] font-semibold"
          style={{
            backgroundColor: item.status === "published" ? "#17B26A" : "#FF0D0D"
          }}
        >
          {item.status === "published" ? "Published" : "Unpublished"}
        </div>
        
        {/* Action Icons */}
        <div className="absolute flex flex-col top-[13px] right-[11.96px] gap-[10px]">
          {/* Delete Box */}
          <button 
            onClick={async () => {
              if (confirm('Are you sure you want to delete this item?')) {
                try {
                  const token = getAuthToken()
                  if (!token) return
                  const response = await fetch(`/api/partner/restaurants/${restaurantId}/items/${itemIndex}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                  })
                  if (response.ok) {
                    onRefresh?.()
                  }
                } catch (error) {
                  console.error('Error deleting item:', error)
                }
              }
            }}
            className="flex items-center justify-center w-[32px] h-[32px] rounded bg-white border border-gray-200 shadow-lg"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          
          {/* Edit Box */}
          <button 
            onClick={() => onEdit?.(item, itemIndex)}
            className="flex items-center justify-center w-[32px] h-[32px] rounded bg-white shadow-lg"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-5 flex flex-col gap-2 flex-1">
         {/* Name and Category */}
         <div className="flex justify-between items-center">
           <div className="font-bold text-[17px] text-[#212121]">
             {item.itemName}
           </div>
           <div 
             className="text-[15px]"
             style={{ color: "#21212199 !important" }}
           >
             {item.category}
           </div>
         </div>
        
        {/* Description */}
        <p className="text-sm text-[#21212199] flex-1 overflow-y-auto">
          {item.itemDescription}
        </p>
        
        {/* Price */}
        <div className="mt-auto">
          <div 
            className="font-bold text-xl"
            style={{ color: "#4195BF" }}
          >
            ${item.itemPrice}
          </div>
        </div>
      </div>
    </div>
  )
}

function ViewItemsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const restaurantId = searchParams?.get('id') || null
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<{ item: RestaurantItem; index: number } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")

  // Fetch restaurant data
  const fetchRestaurant = async () => {
    if (!restaurantId) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const token = getAuthToken()
      if (!token) {
        console.error('No auth token found')
        setIsLoading(false)
        return
      }

      const response = await fetch(`/api/partner/restaurants/${restaurantId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()

      if (data.success && data.data?.restaurant) {
        setRestaurant(data.data.restaurant)
      }
    } catch (error) {
      console.error('Error fetching restaurant:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRestaurant()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId])

  // Filter items based on search and filters, preserving original index
  const filteredItems = restaurant?.items
    ?.map((item, index) => ({ item, originalIndex: index }))
    .filter(({ item }) => {
      const matchesSearch = !searchQuery || 
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.itemDescription.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = !statusFilter || item.status === statusFilter
      const matchesCategory = !categoryFilter || item.category === categoryFilter
      return matchesSearch && matchesStatus && matchesCategory
    }) || []

  // Get unique categories for filter dropdown
  const categories = Array.from(new Set(restaurant?.items?.map(item => item.category) || []))

  const handleEditItem = (item: RestaurantItem, itemIndex: number) => {
    setEditingItem({ item, index: itemIndex })
    setIsAddItemModalOpen(true)
  }

  const handleDeleteItem = async (itemIndex: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        const token = getAuthToken()
        if (!token || !restaurantId) return
        const response = await fetch(`/api/partner/restaurants/${restaurantId}/items/${itemIndex}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.ok) {
          fetchRestaurant()
        }
      } catch (error) {
        console.error('Error deleting item:', error)
      }
    }
  }

  const handleAddItem = () => {
    setEditingItem(null)
    setIsAddItemModalOpen(true)
  }

  const handleItemCreated = () => {
    fetchRestaurant()
    setIsAddItemModalOpen(false)
    setEditingItem(null)
  }

  const handleBack = () => {
    router.push('/partner/pages/room-delivery/restaurants')
  }

  return (
    <div className="p-6">
      {/* Navigation Section */}
      <div 
        className="w-full flex items-center justify-start mb-3"
        style={{
          height: "58px",
          borderBottom: "1px solid #21212114",
          gap: "20px",
          paddingRight: "20px"
        }}
      >
        {/* Back Arrow Button */}
        <button 
          onClick={handleBack}
          className="flex items-center justify-center w-[32px] h-[32px] rounded bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
        >
          <RiArrowLeftSLine className="w-4 h-4 text-gray-600" />
        </button>
        
         {/* Breadcrumb */}
         <div className="flex items-center gap-2 text-sm text-gray-600">
           <span>Restaurants</span>
           <RiArrowRightSLine className="w-3 h-4 text-gray-400" />
           <span className="text-gray-900 font-medium">{restaurant?.restaurantName || 'View items'}</span>
         </div>
      </div>

      {/* Main Container */}
      <div style={{ borderRadius: "8px", border: "1px solid #00000014", overflow: "hidden" }}>
        {/* Header Section */}
        <div style={{ background: "#FBFAFA", padding: "16px", borderBottom: "1px solid #E7E7E7" }}>
          <h2 className="text-2xl font-bold text-foreground mb-2">Items</h2>
          <p className="text-muted-foreground">{restaurant?.restaurantName ? `Items for ${restaurant.restaurantName}` : 'Loading restaurant items...'}</p>
        </div>

        {/* Controls Section */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200" style={{ background: "#FFFFFF" }}>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{filteredItems.length} Item{filteredItems.length !== 1 ? 's' : ''} found</span>
          </div>
          
          <div className="flex items-center gap-4">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                onChange={(e) => setStatusFilter(e.target.value)}
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

            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
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
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <RiArrowDownSLine className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            {/* Add new items button */}
            <button 
              onClick={handleAddItem}
              className="flex py-[8.52px] px-5 justify-center items-center gap-1.5 rounded-[6px] bg-[#1F2A44] text-white hover:bg-[#1F2A44]/90 transition-colors"
            >
              <RiAddLine className="w-4 h-4" />
              <span className="text-sm font-medium">Add new items</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ background: "#FFFFFF", padding: "16px" }}>
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : !restaurant ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-muted-foreground">Restaurant not found</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-muted-foreground">No items found</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map(({ item, originalIndex }) => (
              <ItemCard
                  key={`${item.itemName}-${originalIndex}`}
                  item={item}
                  itemIndex={originalIndex}
                  restaurantId={restaurantId || ''}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
                  onRefresh={fetchRestaurant}
              />
            ))}
          </div>
          )}
        </div>
      </div>

      {/* Add/Edit Item Modal */}
      {restaurantId && (
        <AddRestaurantItemModal 
          isOpen={isAddItemModalOpen}
          onClose={() => {
            setIsAddItemModalOpen(false)
            setEditingItem(null)
          }}
          onSuccess={handleItemCreated}
          restaurantId={restaurantId}
          item={editingItem?.item || null}
          itemIndex={editingItem?.index}
        />
      )}
    </div>
  )
}

export default function ViewItemsPage() {
  return (
    <Suspense fallback={
      <div className="p-6">
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    }>
      <ViewItemsPageContent />
    </Suspense>
  )
}
