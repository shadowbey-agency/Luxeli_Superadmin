interface RoomSidebarIconProps {
  strokeColor?: string
  className?: string
}

export default function RoomSidebarIcon({ strokeColor = "#141B34", className = "" }: RoomSidebarIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <path
        d="M2.5 7.5H17.5M2.5 10H17.5M5 17.5V7.5M15 17.5V7.5M7.5 2.5V7.5M12.5 2.5V7.5M3.75 17.5H16.25C16.9404 17.5 17.5 16.9404 17.5 16.25V3.75C17.5 3.05964 16.9404 2.5 16.25 2.5H3.75C3.05964 2.5 2.5 3.05964 2.5 3.75V16.25C2.5 16.9404 3.05964 17.5 3.75 17.5Z"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

