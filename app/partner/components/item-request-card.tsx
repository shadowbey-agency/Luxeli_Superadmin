"use client"

interface ItemRequestCardProps {
  id?: string | number
  name: string
  quantity: string
  image?: string
}

export default function ItemRequestCard({
  id,
  name,
  quantity,
  image
}: ItemRequestCardProps) {
  return (
    <div 
      className="flex items-center gap-3 bg-white border border-[#21212114] rounded-[8px] p-3"
      style={{
        width: "170px",
        height: "80px",
    
      }}
    >
      {/* Image */}
      <img 
        src={image || "/placeholder.svg"} 
        alt={name}
        className="object-cover border border-[#F0F0F0] rounded"
        style={{
          width: "45%",
          height: "100%",
          borderRadius: "4px"
        }}
      />

      {/* Content */}
      <div 
        className="flex flex-col"
        style={{
          width: "65px",
          height: "45px",
          gap: "5px"
        }}
      >
        {/* Heading */}
        <span 
          className="font-semibold text-black"
          style={{
            fontWeight: 600,
            fontSize: "13px",
            
          }}
        >
          {name}
        </span>
        
        {/* Oval Quantity Badge */}
        <div 
          className="flex items-center justify-center bg-white border border-[#0000000F] rounded-full"
          style={{
            width: "30px",
            height: "25px",
            padding: "10px",
            gap: "10px"
          }}
        >
          <span 
            className="text-black font-medium"
            style={{
              fontSize: "12px",
              fontWeight: 500
            }}
          >
            {quantity}
          </span>
        </div>
      </div>
    </div>
  )
}
