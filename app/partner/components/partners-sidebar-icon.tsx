import React from 'react';

interface PartnersSidebarIconProps {
  size?: number;
  strokeColor?: string;
  backgroundColor?: string;
}

const PartnersSidebarIcon = ({ size = 20, strokeColor = "#141B34" }: PartnersSidebarIconProps) => (
  <div
    style={{
      display: "flex",
      width: `${size}px`,
      height: `${size}px`,
      padding: "1.667px 1.666px 1.667px 1.667px",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ width: "16.667px", height: "16.667px", flexShrink: 0 }}>
      <path d="M1.5 4.83331V14C1.5 15.5713 1.5 16.357 1.98816 16.8452C2.47631 17.3333 3.26198 17.3333 4.83333 17.3333H13.1667C14.738 17.3333 15.5237 17.3333 16.0118 16.8452C16.5 16.357 16.5 15.5713 16.5 14V4.83331" stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.1663 4.83335C13.1663 2.53217 11.3009 0.666687 8.99967 0.666687C6.69849 0.666687 4.83301 2.53217 4.83301 4.83335" stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.6663 17.3334L10.6663 14C10.6663 13.0795 9.92015 12.3333 8.99967 12.3333C8.0792 12.3333 7.33301 13.0795 7.33301 14V17.3334" stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.50033 1.5H2.72711C2.46836 1.5 2.20644 1.56841 1.99875 1.77415C1.38048 2.38662 1.02374 3.40635 0.666992 4.83333H4.83366M11.5003 1.5H15.2735C15.5323 1.5 15.7942 1.56841 16.0019 1.77415C16.6202 2.38662 16.9769 3.40635 17.3337 4.83333H13.167" stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 8.16669H4.41667M4 11.0834H4.41667" stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.583 8.16669H13.9997M13.583 11.0834H13.9997" stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.75 5.66669V6.91669M7.75 8.16669V6.91669M10.25 5.66669V6.91669M10.25 8.16669V6.91669M7.75 6.91669H10.25" stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

export default PartnersSidebarIcon;
