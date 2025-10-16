import React from 'react';

interface SubscriptionSidebarIconProps {
  size?: number;
  strokeColor?: string;
}

const SubscriptionSidebarIcon = ({ size = 20, strokeColor = "#141B34" }: SubscriptionSidebarIconProps) => (
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
      <path d="M10.4395 1.87023L11.906 4.82748C12.106 5.23914 12.6393 5.634 13.0892 5.70961L15.7473 6.15488C17.4471 6.44052 17.847 7.68391 16.6222 8.91049L14.5557 10.994C14.2058 11.3469 14.0141 12.0274 14.1225 12.5146L14.7141 15.0938C15.1807 17.1353 14.1058 17.9251 12.3143 16.8581L9.82294 15.3711C9.37299 15.1022 8.6314 15.1022 8.17312 15.3711L5.68173 16.8581C3.89859 17.9251 2.81538 17.1269 3.28199 15.0938L3.87359 12.5146C3.98191 12.0274 3.79027 11.3469 3.44031 10.994L1.37387 8.91049C0.157337 7.68391 0.548961 6.44052 2.24877 6.15488L4.90681 5.70961C5.34843 5.634 5.8817 5.23914 6.08168 4.82748L7.54819 1.87023C8.3481 0.265587 9.64796 0.265587 10.4395 1.87023Z" stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

export default SubscriptionSidebarIcon;
