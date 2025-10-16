import React from 'react';

interface TeamSidebarIconProps {
  size?: number;
  strokeColor?: string;
}

const TeamSidebarIcon = ({ size = 20, strokeColor = "#141B34" }: TeamSidebarIconProps) => (
  <div
    style={{
      display: "flex",
      width: `${size}px`,
      height: `${size}px`,
      padding: "3.333px 0.833px",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="none" style={{ width: "18.333px", height: "13.333px", flexShrink: 0 }}>
      <path d="M17.3117 13C17.9361 13 18.4328 12.6071 18.8787 12.0576C19.7916 10.9329 18.2928 10.034 17.7211 9.59383C17.14 9.14635 16.4912 8.89285 15.8333 8.83333M15 7.16667C16.1506 7.16667 17.0833 6.23393 17.0833 5.08333C17.0833 3.93274 16.1506 3 15 3" stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round"/>
      <path d="M2.68846 13C2.06404 13 1.56739 12.6071 1.12145 12.0576C0.20857 10.9329 1.70739 10.034 2.27903 9.59383C2.86014 9.14635 3.50898 8.89285 4.16683 8.83333M4.5835 7.16667C3.4329 7.16667 2.50016 6.23393 2.50016 5.08333C2.50016 3.93274 3.4329 3 4.5835 3" stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round"/>
      <path d="M6.73667 10.5927C5.88518 11.1192 3.65265 12.1943 5.01241 13.5396C5.67665 14.1968 6.41643 14.6667 7.34652 14.6667H12.6538C13.5839 14.6667 14.3237 14.1968 14.9879 13.5396C16.3477 12.1943 14.1151 11.1192 13.2637 10.5927C11.2669 9.35808 8.73338 9.35808 6.73667 10.5927Z" stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12.9168 4.24992C12.9168 5.86075 11.611 7.16659 10.0002 7.16659C8.38933 7.16659 7.0835 5.86075 7.0835 4.24992C7.0835 2.63909 8.38933 1.33325 10.0002 1.33325C11.611 1.33325 12.9168 2.63909 12.9168 4.24992Z" stroke={strokeColor} strokeWidth="1.25"/>
    </svg>
  </div>
);

export default TeamSidebarIcon;
