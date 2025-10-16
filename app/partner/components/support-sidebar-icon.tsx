import React from 'react';

interface SupportSidebarIconProps {
  size?: number;
  strokeColor?: string;
}

const SupportSidebarIcon = ({ size = 20, strokeColor = "#141B34" }: SupportSidebarIconProps) => (
  <div
    style={{
      display: "flex",
      width: `${size}px`,
      height: `${size}px`,
      padding: "1.667px 1.666px 1.667px 1.667px",
      justifyContent: "center",
      alignItems: "center",
      position: "relative"
    }}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ width: "16.667px", height: "16.667px", flexShrink: 0 }}>
      <path d="M9.43463 1.5H8.59962C8.13056 1.50697 7.66351 1.52569 7.20464 1.55614C3.71177 1.7879 0.929528 4.60449 0.700593 8.14047C0.655792 8.83244 0.655792 9.54904 0.700593 10.241C0.783974 11.5289 1.35457 12.7213 2.02632 13.7281C2.41635 14.433 2.15895 15.3128 1.75269 16.0813C1.45976 16.6354 1.3133 16.9124 1.4309 17.1125C1.5485 17.3127 1.81118 17.3191 2.33654 17.3318C3.3755 17.3571 4.07609 17.0631 4.6322 16.6537C4.94761 16.4216 5.10531 16.3055 5.214 16.2921C5.3227 16.2788 5.5366 16.3667 5.96432 16.5426C6.34876 16.7006 6.79513 16.7982 7.20464 16.8253C8.39385 16.9042 9.63798 16.9044 10.8296 16.8253C14.1811 16.603 16.9186 14.0007 17.3337 10.6667" stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11.992 6.20685C11.468 6.51398 10.0942 7.1411 10.9309 7.92585C11.3397 8.30919 11.795 8.58335 12.3673 8.58335H15.6333C16.2057 8.58335 16.661 8.30919 17.0697 7.92585C17.9065 7.1411 16.5326 6.51398 16.0086 6.20685C14.7799 5.48663 13.2208 5.48663 11.992 6.20685Z" stroke={strokeColor} strokeWidth="1.25"/>
      <path d="M15.667 2.33335C15.667 3.25383 14.9208 4.00002 14.0003 4.00002C13.0799 4.00002 12.3337 3.25383 12.3337 2.33335C12.3337 1.41288 13.0799 0.666687 14.0003 0.666687C14.9208 0.666687 15.667 1.41288 15.667 2.33335Z" stroke={strokeColor} strokeWidth="1.25"/>
      <path d="M6.08301 11.5H11.9163M6.08301 7.33333H7.74967" stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    
    {/* Small icon at top right */}
    <div
      style={{
        position: "absolute",
        top: "0px",
        right: "0px",
        width: "6.667px",
        height: "7.917px",
        flexShrink: 0
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="8" height="10" viewBox="0 0 8 10" fill="none" style={{ width: "6.667px", height: "7.917px", flexShrink: 0 }}>
        <path d="M1.99202 6.20685C1.46803 6.51398 0.0941642 7.1411 0.930941 7.92585C1.3397 8.30919 1.79495 8.58335 2.36731 8.58335H5.63334C6.2057 8.58335 6.66095 8.30919 7.06971 7.92585C7.90649 7.1411 6.53262 6.51398 6.00863 6.20685C4.77989 5.48663 3.22077 5.48663 1.99202 6.20685Z" stroke={strokeColor} strokeWidth="1.25"/>
        <path d="M5.66699 2.33335C5.66699 3.25383 4.9208 4.00002 4.00033 4.00002C3.07985 4.00002 2.33366 3.25383 2.33366 2.33335C2.33366 1.41288 3.07985 0.666687 4.00033 0.666687C4.9208 0.666687 5.66699 1.41288 5.66699 2.33335Z" stroke={strokeColor} strokeWidth="1.25"/>
      </svg>
    </div>
  </div>
);

export default SupportSidebarIcon;
