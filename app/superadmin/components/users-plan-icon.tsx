import React from 'react';

interface UsersPlanIconProps {
  size?: number;
  strokeColor?: string;
}

export default function UsersPlanIcon({ 
  size = 16, 
  strokeColor = "#141B34"
}: UsersPlanIconProps) {
  return (
    <div style={{
      display: "flex",
      width: `${size}px`,
      height: `${size}px`,
      padding: "1.333px 1.334px 1.333px 1.333px",
      justifyContent: "center",
      alignItems: "center",
      flexShrink: 0
    }}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 16 16" 
        fill="none"
        style={{
          width: "13.333px",
          height: "13.333px",
          flexShrink: 0
        }}
      >
        <path d="M1.33301 7.33337C2.88748 5.70526 5.09516 5.6286 6.66634 7.33337M5.66307 3.00004C5.66307 3.92052 4.91582 4.66671 3.99403 4.66671C3.07224 4.66671 2.32499 3.92052 2.32499 3.00004C2.32499 2.07957 3.07224 1.33337 3.99403 1.33337C4.91582 1.33337 5.66307 2.07957 5.66307 3.00004Z" stroke={strokeColor} strokeLinecap="round"/>
        <path d="M9.33301 14.6666C10.8875 13.0385 13.0952 12.9618 14.6663 14.6666M13.6631 10.3333C13.6631 11.2538 12.9158 12 11.994 12C11.0722 12 10.325 11.2538 10.325 10.3333C10.325 9.41282 11.0722 8.66663 11.994 8.66663C12.9158 8.66663 13.6631 9.41282 13.6631 10.3333Z" stroke={strokeColor} strokeLinecap="round"/>
        <path d="M10 2H14M10 4H14M10 6H12.3333" stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}
