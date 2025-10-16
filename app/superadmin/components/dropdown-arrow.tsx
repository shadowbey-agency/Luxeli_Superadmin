export default function DropdownArrow({ className = "" }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="10" 
      height="6" 
      viewBox="0 0 10 6" 
      fill="none"
      className={className}
      style={{
        width: "10px",
        height: "6px",
        flexShrink: 0
      }}
    >
      <path 
        d="M1 0.52002L5 4.52002L9 0.52002" 
        stroke="#212121" 
        strokeOpacity="0.6" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )
}

