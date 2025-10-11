import React from 'react';

interface StaffIconProps {
  size?: number;
  strokeColor?: string;
  backgroundColor?: string;
}

export default function StaffIcon({ 
  size = 16, 
  strokeColor = "#527EDB",
  backgroundColor = "#EEF2FB"
}: StaffIconProps) {
  return (
    <div style={{
      display: "flex",
      padding: "8px",
      alignItems: "center",
      gap: "10px",
      borderRadius: "6666px",
      background: backgroundColor
    }}>
      <div style={{
        display: "flex",
        width: `${size}px`,
        height: `${size}px`,
        padding: "1.333px",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width={size} 
          height={size} 
          viewBox="0 0 16 16" 
          fill="none"
          style={{
            width: "13.333px",
            height: "13.333px",
            flexShrink: 0
          }}
        >
          <g clipPath="url(#clip0_1_7485)">
            <path d="M14.6668 14V12.6667C14.6668 11.4241 13.817 10.38 12.6668 10.084M10.3335 2.19384C11.3108 2.58943 12.0002 3.54754 12.0002 4.66667C12.0002 5.78579 11.3108 6.7439 10.3335 7.13949M11.3335 14C11.3335 12.7575 11.3335 12.1362 11.1305 11.6462C10.8599 10.9928 10.3407 10.4736 9.68732 10.203C9.19726 10 8.57601 10 7.3335 10H5.3335C4.09099 10 3.46973 10 2.97967 10.203C2.32627 10.4736 1.80713 10.9928 1.53648 11.6462C1.3335 12.1362 1.3335 12.7575 1.3335 14M9.00016 4.66667C9.00016 6.13943 7.80626 7.33333 6.3335 7.33333C4.86074 7.33333 3.66683 6.13943 3.66683 4.66667C3.66683 3.19391 4.86074 2 6.3335 2C7.80626 2 9.00016 3.19391 9.00016 4.66667Z" stroke={strokeColor} strokeWidth="1.11333" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
          <defs>
            <clipPath id="clip0_1_7485">
              <rect width="16" height="16" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  );
}
