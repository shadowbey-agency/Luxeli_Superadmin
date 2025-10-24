"use client"

interface ServiceCardViewProps {
  id: number
  name: string
  category: string
  location: string
  date: string  
  price: string
  status: string
  description: string
  image?: string
}

export default function ServiceCardView({
  id,
  name,
  category,
  location,
  date,
  price,
  status,
  description,
  image
}: ServiceCardViewProps) {
  // Debug: Log the props to see what's being passed
  console.log('ServiceCardView props:', { id, name, category, location, date, price, status, description, image })
  
  return (
    <div className="border rounded-[10px] overflow-hidden w-full h-auto bg-white">
      {/* Image Section */}
      <div className="relative w-full h-[190px] bg-gray-200 flex items-center justify-center">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-gray-500 text-sm">Service Image</div>
        )}
        
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
            <span className="text-sm text-[#525866]" style={{ color: '#525866' }}>{location || 'Location'}</span>
          </div>
          <span className="text-sm text-[#525866]" style={{ color: '#525866' }}>{date || 'Jan 15, 2025'}</span>
        </div>
        
        {/* Service Name and Category Row */}
        <div className="flex justify-between items-center">
          <h3 className="text-[14px] font-bold text-[#212121] truncate flex-1 mr-2" style={{ color: '#212121' }}>
            {name || 'Service Name'}
          </h3>
          <span className="text-sm text-[#525866] whitespace-nowrap" style={{ color: '#525866' }}>{category || 'Category'}</span>
        </div>
        
        {/* Description */}
        <p className="text-xs text-[#21212199] line-clamp-3" style={{ color: 'rgba(33, 33, 33, 0.6)' }}>
          {description || 'Service description goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
        </p>
        
        {/* Price */}
        <div className="flex justify-start mt-1">
          <span className="font-bold text-xl text-[#4195BF]" style={{ color: '#4195BF' }}>
            {price || '20$'}
          </span>
        </div>
      </div>
    </div>
  )
}
