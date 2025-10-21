"use client"

import { RiDeleteBin6Line, RiEditLine, RiNotification3Line } from "react-icons/ri"

interface ActivityCardProps {
  id: number
  title: string
  type: string
  location: string
  date: string
  status: string
  description: string
  image?: string
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
}

export default function ActivityCard({
  id,
  title,
  type,
  location,
  date,
  status,
  description,
  image,
  onEdit,
  onDelete
}: ActivityCardProps) {
  return (
    <div className="border rounded-[10px] overflow-hidden w-full h-full bg-white flex flex-col">
      {/* Image Section */}
      <div className="relative w-full h-[220px] bg-gray-200 flex items-center justify-center flex-shrink-0">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center">
            <RiNotification3Line className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <div className="text-gray-500 text-sm">Activity Alert</div>
          </div>
        )}
        
        {/* Status Badge */}
        <div 
          className={`absolute flex items-center justify-center top-[13px] left-[11.96px] w-[79.92px] h-[22px] px-[10px] rounded text-white text-[11px] font-semibold ${
            status === "Active" ? "bg-green-500 border border-green-500/40" : "bg-gray-500 border border-gray-500/40"
          }`}
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
            <RiDeleteBin6Line className="w-4 h-4 text-gray-600" />
          </button>
          
          {/* Edit Box */}
          <button 
            onClick={() => onEdit?.(id)}
            className="flex items-center justify-center w-[32px] h-[32px] rounded bg-white shadow-lg"
          >
            <RiEditLine className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-5 flex flex-col gap-2 flex-1">
        {/* Title */}
        <div className="font-bold text-[17px] text-[#212121]">
          {title}
        </div>
        
        {/* Description */}
        <p className="text-sm text-[#21212199] flex-1 overflow-y-auto">
          {description}
        </p>
        
        {/* Created At and Created By */}
        <div className="flex flex-col gap-1 mt-auto">
          {/* Created At Row */}
          <div className="flex justify-between items-center">
            <span className="text-[15px] text-[#21212199]">
              Created at
            </span>
            <span className="text-[15px] text-[#21212199]">
              {date}
            </span>
          </div>
          
          {/* Created By Row */}
          <div className="flex justify-between items-center">
            <span className="text-[15px] text-[#21212199]">
              Created by
            </span>
            <span className="text-[15px] text-[#21212199]">
              Lindsey Stroud
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
