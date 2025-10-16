import React from 'react';

interface DashboardSidebarIconProps {
  size?: number;
  strokeColor?: string;
}

const DashboardSidebarIcon = ({ size = 20, strokeColor = "#141B34" }: DashboardSidebarIconProps) => (
  <div
    style={{
      display: "flex",
      width: `${size}px`,
      height: `${size}px`,
      padding: "1.667px",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ width: "16.667px", height: "16.667px", flexShrink: 0 }}>
      <path d="M7.33301 14L10.6663 14" stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M0.95933 10.0113C0.665147 8.09695 0.518055 7.13978 0.879975 6.29123C1.24189 5.44268 2.04486 4.86211 3.65079 3.70097L4.85066 2.83341C6.84841 1.38897 7.84729 0.666748 8.99984 0.666748C10.1524 0.666748 11.1513 1.38897 13.149 2.83341L14.3489 3.70097C15.9548 4.86211 16.7578 5.44268 17.1197 6.29123C17.4816 7.13978 17.3345 8.09695 17.0403 10.0113L16.7895 11.6437C16.3724 14.3575 16.1639 15.7144 15.1907 16.5239C14.2174 17.3334 12.7946 17.3334 9.94885 17.3334H8.05082C5.20511 17.3334 3.78226 17.3334 2.809 16.5239C1.83575 15.7144 1.62723 14.3575 1.21019 11.6437L0.95933 10.0113Z" stroke={strokeColor} strokeWidth="1.25" strokeLinejoin="round"/>
    </svg>
  </div>
);

export default DashboardSidebarIcon;
