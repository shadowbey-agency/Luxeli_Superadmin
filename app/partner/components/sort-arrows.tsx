export default function SortArrows({ sortDirection }: { sortDirection: 'up' | 'down' | 'none' }) {
  if (sortDirection === 'up') {
    return (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="6" 
        height="5" 
        viewBox="0 0 6 5" 
        fill="none"
        style={{
          height: "6px",
          alignSelf: "stretch"
        }}
      >
        <path d="M3 0L5.59808 4.5H0.401924L3 0Z" fill="#D9D9D9"/>
      </svg>
    )
  }
  
  if (sortDirection === 'down') {
    return (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="6" 
        height="5" 
        viewBox="0 0 6 5" 
        fill="none"
        style={{
          height: "6px",
          alignSelf: "stretch"
        }}
      >
        <path d="M3 5L0.5 0.5L5.5 0.5L3 5Z" fill="#000"/>
      </svg>
    )
  }
  
  // Default state (none) - show up arrow with gray color
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="6" 
      height="5" 
      viewBox="0 0 6 5" 
      fill="none"
      style={{
        height: "6px",
        alignSelf: "stretch"
      }}
    >
      <path d="M3 0L5.59808 4.5H0.401924L3 0Z" fill="#D9D9D9"/>
    </svg>
  )
}
