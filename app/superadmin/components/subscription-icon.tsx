import React from 'react';

interface SubscriptionIconProps {
  size?: number;
  strokeColor?: string;
  backgroundColor?: string;
}

const SubscriptionIcon = ({ size = 16, strokeColor = "#FF7900", backgroundColor = "#FFF2E6" }: SubscriptionIconProps) => (
  <div
    style={{
      display: "flex",
      padding: "8px",
      alignItems: "center",
      gap: "10px",
      borderRadius: "6666px",
      background: backgroundColor
    }}
  >
    <div style={{
      display: "flex",
      width: `${size}px`,
      height: `${size}px`,
      padding: "1.333px",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ width: "13.333px", height: "13.333px", flexShrink: 0 }}>
        <path d="M9.15241 2.2961L10.3256 4.6619C10.4856 4.99123 10.9122 5.30711 11.2722 5.3676L13.3986 5.72382C14.7585 5.95233 15.0784 6.94704 14.0985 7.92831L12.4454 9.59512C12.1654 9.8774 12.0121 10.4218 12.0987 10.8116L12.572 12.875C12.9453 14.5082 12.0854 15.14 10.6522 14.2864L8.65913 13.0968C8.29917 12.8817 7.7059 12.8817 7.33928 13.0968L5.34616 14.2864C3.91965 15.14 3.05308 14.5015 3.42637 12.875L3.89966 10.8116C3.98631 10.4218 3.833 9.8774 3.55303 9.59512L1.89988 7.92831C0.926651 6.94704 1.23995 5.95233 2.5998 5.72382L4.72623 5.3676C5.07953 5.30711 5.50615 4.99123 5.66613 4.6619L6.83933 2.2961C7.47926 1.01238 8.51915 1.01238 9.15241 2.2961Z" stroke={strokeColor} strokeWidth="0.833333" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  </div>
);

export default SubscriptionIcon;
