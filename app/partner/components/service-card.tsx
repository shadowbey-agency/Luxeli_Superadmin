"use client"

import { RiDeleteBin6Line, RiEditLine } from "react-icons/ri"

interface ServiceCardProps {
  id: number
  name: string
  category: string
  location: string
  date: string  
  price: string
  status: string
  description: string
  image?: string
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
}

export default function ServiceCard({
  id,
  name,
  category,
  location,
  date,
  price,
  status,
  description,
  image,
  onEdit,
  onDelete
}: ServiceCardProps) {
  return (
    <div className="border rounded-[10px] overflow-hidden w-full h-auto bg-white">
      {/* Image Section */}
      <div className="relative w-full h-[190px] bg-gray-200 flex items-center justify-center">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-gray-500 text-sm">Service Image</div>
        )}
        
        {/* Status Badge */}
        <div 
          className="absolute flex items-center justify-center"
          style={{
            background: "#17B26A",
            border: "0.5px solid #17B26A40",
            width: "79.92394256591797px",
            height: "22px",
            top: "13px",
            left: "11.96px",
            opacity: 1,
            gap: "4px",
            borderRadius: "4px",
            borderWidth: "0.5px",
            padding: "10px",
            color: "#FFFFFF",
            fontWeight: 600,
            fontSize: "11px",
            lineHeight: "100%",
            letterSpacing: "0%"
          }}
        >
          {status}
        </div>
        
        {/* Action Icons */}
        <div className="absolute flex flex-col" style={{ top: "13px", right: "11.96px", gap: "10px" }}>
          {/* Delete Box */}
          <button 
            onClick={() => onDelete?.(id)}
            className="flex items-center justify-center rounded"
            style={{
              width: "31.969575881958008px",
              height: "32px",
              opacity: 1,
              gap: "7.11px",
              borderRadius: "4px",
              borderWidth: "1px",
              paddingTop: "4.27px",
              paddingRight: "7.82px",
              paddingBottom: "4.27px",
              paddingLeft: "7.82px",
              background: "#FFFFFF",
              border: "1px solid #EAE9E9",
              boxShadow: "0px 0px 48px 4px #161A1D1A"
            }}
          >
            <RiDeleteBin6Line className="w-4 h-4 text-[#525866]" />
          </button>
          
          {/* Edit Box */}
          <button 
            onClick={() => onEdit?.(id)}
            className="flex items-center justify-center rounded"
            style={{
              width: "31.969575881958008px",
              height: "32px",
              opacity: 1,
              gap: "7.11px",
              borderRadius: "4px",
              borderWidth: "1px",
              paddingTop: "4.27px",
              paddingRight: "7.82px",
              paddingBottom: "4.27px",
              paddingLeft: "7.82px",
              background: "#FFFFFF",
              boxShadow: "0px 0px 48px 4px #161A1D1A"
            }}
          >
            <RiEditLine className="w-4 h-4 text-[#525866]" />
          </button>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-4 flex flex-col gap-2">
        {/* Location and Date Row */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm text-[#525866]">{location}</span>
          </div>
          <span className="text-sm text-[#525866]">{date}</span>
        </div>
        
        {/* Service Name and Category Row */}
        <div className="flex justify-between items-center">
          <h3 className="text-[14px] font-bold text-[#212121] truncate flex-1 mr-2">
            {name}
          </h3>
          <span className="text-sm text-[#525866] whitespace-nowrap">{category}</span>
        </div>
        
        {/* Description */}
        <p className="text-xs text-[#21212199] line-clamp-3">
          {description}
        </p>
        
        {/* Price */}
        <div className="flex justify-start mt-1">
          <span className="font-bold text-xl text-[#4195BF]">
            {price}
          </span>
        </div>
      </div>
    </div>
  )
}

