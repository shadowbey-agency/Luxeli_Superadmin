"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { RiFileList3Line, RiHome4Line, RiSettings3Line, RiArrowDownSLine } from "react-icons/ri"
import AddItemModal from "../../../components/add-item-modal"

export default function RequestsManagementPage() {
  const router = useRouter()
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false)

  const tabs = [
    {
      id: "requests",
      label: "Requests",
      icon: <RiFileList3Line className="w-4 h-4" />,
      href: "/partner/pages/housekeeping/requests"
    },
    {
      id: "house-cleaning", 
      label: "House cleaning",
      icon: <RiHome4Line className="w-4 h-4" />,
      href: "/partner/pages/housekeeping/house-cleaning"
    },
    {
      id: "requests-management",
      label: "Requests management", 
      icon: <RiSettings3Line className="w-4 h-4" />,
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
                <span className="text-sm text-muted-foreground">30 Items found</span>
              </div>
              <div className="flex items-center gap-3">
              {/* Search bar */}
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
                  <option>Pillows</option>
                  <option>Kitchen</option>
                  <option>Cleaning</option>
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
              
              {/* Add new item button */}
              <button 
                onClick={() => setIsAddItemModalOpen(true)}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[
            {
              id: 1,
              name: "Item name",
              category: "Category",
              description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis...",
              status: "Published",
              image: "https://png.pngtree.com/png-vector/20240908/ourmid/pngtree-pristine-white-cushion-simplicity-at-its-best-png-image_13793666.png"
            },
            {
              id: 2,
              name: "Item name",
              category: "Category", 
              description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis...",
              status: "Published",
              image: "https://png.pngtree.com/png-vector/20240908/ourmid/pngtree-pristine-white-cushion-simplicity-at-its-best-png-image_13793666.png"
            },
            {
              id: 3,
              name: "Item name",
              category: "Category",
              description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis...",
              status: "Published",
              image: "https://png.pngtree.com/png-vector/20240908/ourmid/pngtree-pristine-white-cushion-simplicity-at-its-best-png-image_13793666.png"
            },
            {
              id: 4,
              name: "Item name",
              category: "Category",
              description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis...",
              status: "Published",
              image: "https://png.pngtree.com/png-vector/20240908/ourmid/pngtree-pristine-white-cushion-simplicity-at-its-best-png-image_13793666.png"
            },
            {
              id: 5,
              name: "Item name",
              category: "Category",
              description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis...",
              status: "Published",
              image: "https://png.pngtree.com/png-vector/20240908/ourmid/pngtree-pristine-white-cushion-simplicity-at-its-best-png-image_13793666.png"
            },
            {
              id: 6,
              name: "Item name",
              category: "Category",
              description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis...",
              status: "Published",
              image: "https://png.pngtree.com/png-vector/20240908/ourmid/pngtree-pristine-white-cushion-simplicity-at-its-best-png-image_13793666.png"
            },
            {
              id: 7,
              name: "Item name",
              category: "Category",
              description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis...",
              status: "Published",
              image: "https://png.pngtree.com/png-vector/20240908/ourmid/pngtree-pristine-white-cushion-simplicity-at-its-best-png-image_13793666.png"
            },
            {
              id: 8,
              name: "Item name",
              category: "Category",
              description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis...",
              status: "Published",
              image: "https://png.pngtree.com/png-vector/20240908/ourmid/pngtree-pristine-white-cushion-simplicity-at-its-best-png-image_13793666.png"
            }
          ].map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full"
              style={{
                height: "304px"
              }}
            >
                {/* Image Section */}
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
                    background: "#17B26A0D",
                    border: "0.5px solid #17B26A40"
                  }}
                >
                  <span className="text-xs font-medium" style={{ color: "#17B26A" }}>
                    {item.status}
                  </span>
                </div>

                {/* Action Icons */}
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                  {/* Delete Icon */}
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  {/* Edit Icon */}
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>

                  {/* Image */}
                  <div 
                    className="flex items-center justify-center"
                    style={{
                      width: "156px",
                      height: "125px",
                    
                      background: "transparent"
                    }}
                  >
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                      style={{ background: "transparent" }}
                    />
                  </div>
              </div>

              {/* Content Section */}
              <div 
                className="p-4"
                style={{
                  height: "78px",
                  gap: "12px",
                  borderBottomLeftRadius:"10px",
                  borderBottomRightRadius:"10px"
                }}
              >
                {/* Heading Row */}
                <div 
                  className="flex items-center justify-between mb-2"
                  
                >
                  <h2 className="font-semibold text-sm text-foreground">{item.name}</h2>
                  <span className="text-xs text-muted-foreground">{item.category}</span>
                </div>
                
                {/* Description */}
                <p 
                  className="text-xs "
                  style={{
                    fontWeight: "400",
                    fontSize: "13px",
                    color: "#21212199"
                  }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          ))}
          </div>
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

