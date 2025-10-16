import React from 'react';

interface CarIconProps {
  size?: number;
  strokeColor?: string;
  backgroundColor?: string;
}

export default function CarIcon({ 
  size = 16, 
  strokeColor = "#56C6FF", 
  backgroundColor = "#EEF9FF" 
}: CarIconProps) {
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
        >
          <path d="M2 4.66663V12C2 13.257 2 13.8856 2.39052 14.2761C2.78105 14.6666 3.40959 14.6666 4.66667 14.6666H11.3333C12.5904 14.6666 13.219 14.6666 13.6095 14.2761C14 13.8856 14 13.257 14 12V4.66663" stroke={strokeColor} strokeWidth="0.833333" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11.3332 4.66671C11.3332 2.82576 9.84079 1.33337 7.99984 1.33337C6.15889 1.33337 4.6665 2.82576 4.6665 4.66671" stroke={strokeColor} strokeWidth="0.833333" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9.33317 14.6667L9.33317 12C9.33317 11.2636 8.73622 10.6666 7.99984 10.6666C7.26346 10.6666 6.6665 11.2636 6.6665 12V14.6667" stroke={strokeColor} strokeWidth="0.833333" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6.00016 2H2.98159C2.77459 2 2.56505 2.05472 2.3989 2.21932C1.90429 2.7093 1.61889 3.52508 1.3335 4.66667H4.66683M10.0002 2H13.0187C13.2257 2 13.4353 2.05472 13.6014 2.21932C14.096 2.7093 14.3814 3.52508 14.6668 4.66667H11.3335" stroke={strokeColor} strokeWidth="0.833333" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4 7.33337H4.33333M4 9.66671H4.33333" stroke={strokeColor} strokeWidth="0.833333" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11.6665 7.33337H11.9998M11.6665 9.66671H11.9998" stroke={strokeColor} strokeWidth="0.833333" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 5.33337V6.33337M7 7.33337V6.33337M9 5.33337V6.33337M9 7.33337V6.33337M7 6.33337H9" stroke={strokeColor} strokeWidth="0.833333" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}
