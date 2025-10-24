"use client"

import { RiNotification3Line } from "react-icons/ri"

interface ActivityCardViewProps {
  id: number
  title: string
  type: string
  location: string
  date: string
  status: string
  description: string
  image?: string
}

export default function ActivityCardView({
  id,
  title,
  type,
  location,
  date,
  status,
  description,
  image
}: ActivityCardViewProps) {
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
      </div>
    </div>
  )
}
