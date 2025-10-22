"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { RiArrowLeftSLine, RiArrowDownSLine, RiAddLine, RiArrowRightSLine } from "react-icons/ri"
import AddItemModal from "../../../../components/add-item-modal"

// Item Card component matching booking settings page style
const ItemCard = ({ 
  id, 
  name, 
  category, 
  price, 
  status, 
  description, 
  image, 
  onEdit, 
  onDelete 
}: {
  id: number
  name: string
  category: string
  price: string
  status: string
  description: string
  image?: string
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
}) => {
  return (
    <div className="border rounded-[10px] overflow-hidden w-full h-full bg-white flex flex-col shadow-lg">
      {/* Image Section */}
      <div className="relative w-full h-[220px] bg-gray-200 flex items-center justify-center flex-shrink-0">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center">
            <div className="text-gray-500 text-sm">Item Image</div>
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
        
        {/* Action Icons */}
        <div className="absolute flex flex-col top-[13px] right-[11.96px] gap-[10px]">
          {/* Delete Box */}
          <button 
            onClick={() => onDelete?.(id)}
            className="flex items-center justify-center w-[32px] h-[32px] rounded bg-white border border-gray-200 shadow-lg"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          
          {/* Edit Box */}
          <button 
            onClick={() => onEdit?.(id)}
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
             {name}
           </div>
           <div 
             className="text-[15px]"
             style={{ color: "#21212199 !important" }}
           >
             {category}
           </div>
         </div>
        
        {/* Description */}
        <p className="text-sm text-[#21212199] flex-1 overflow-y-auto">
          {description}
        </p>
        
        {/* Price */}
        <div className="mt-auto">
          <div 
            className="font-bold text-xl"
            style={{ color: "#4195BF" }}
          >
            {price}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ViewItemsPage() {
  const router = useRouter()
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false)

  const handleEditItem = (id: number) => {
    console.log("Edit item:", id)
    // Handle edit logic here
  }

  const handleDeleteItem = (id: number) => {
    console.log("Delete item:", id)
    // Handle delete logic here
  }

  const handleAddItem = () => {
    setIsAddItemModalOpen(true)
  }

  const handleBack = () => {
    router.back()
  }

  // Sample items data
  const items = [
    {
      id: 1,
      name: "Grilled Chicken",
      category: "Main Course",
      price: "20$",
      status: "Published",
      description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis...",
      image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      name: "Beef Skewers",
      category: "Grilled",
      price: "25$",
      status: "Published",
      description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis...",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      name: "Pasta Carbonara",
      category: "Italian",
      price: "18$",
      status: "Published",
      description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis...",
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&h=200&fit=crop"
    },
    {
      id: 4,
      name: "Fruit Smoothie",
      category: "Beverage",
      price: "12$",
      status: "Published",
      description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis...",
      image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300&h=200&fit=crop"
    },
    {
      id: 5,
      name: "Fresh Salad",
      category: "Healthy",
      price: "15$",
      status: "Published",
      description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis...",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop"
    },
    {
      id: 6,
      name: "Grilled Fish",
      category: "Seafood",
      price: "22$",
      status: "Published",
      description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis...",
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&h=200&fit=crop"
    },
    {
      id: 7,
      name: "Chicken Wrap",
      category: "Fast Food",
      price: "16$",
      status: "Published",
      description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis...",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop"
    },
    {
      id: 8,
      name: "Burrito Bowl",
      category: "Mexican",
      price: "19$",
      status: "Published",
      description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis...",
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&h=200&fit=crop"
    }
  ]

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
           <span className="text-gray-900 font-medium">View items</span>
         </div>
      </div>

      {/* Main Container */}
      <div style={{ borderRadius: "8px", border: "1px solid #00000014", overflow: "hidden" }}>
        {/* Header Section */}
        <div style={{ background: "#FBFAFA", padding: "16px", borderBottom: "1px solid #E7E7E7" }}>
          <h2 className="text-2xl font-bold text-foreground mb-2">Items</h2>
          <p className="text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>

        {/* Controls Section */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200" style={{ background: "#FFFFFF" }}>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{items.length} Items found</span>
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
                <option>Main Course</option>
                <option>Grilled</option>
                <option>Italian</option>
                <option>Beverage</option>
                <option>Healthy</option>
                <option>Seafood</option>
                <option>Fast Food</option>
                <option>Mexican</option>
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
          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <ItemCard
                key={item.id}
                id={item.id}
                name={item.name}
                category={item.category}
                price={item.price}
                status={item.status}
                description={item.description}
                image={item.image}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      <AddItemModal 
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
      />
    </div>
  )
}
