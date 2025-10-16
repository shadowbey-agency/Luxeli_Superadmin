import React from 'react';

interface InvoiceIconProps {
  size?: number;
  strokeColor?: string;
  backgroundColor?: string;
}

const InvoiceIcon = ({ size = 16, strokeColor = "#00A991", backgroundColor = "#E6F6F4" }: InvoiceIconProps) => (
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
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 14 16" fill="none" style={{ width: "12px", height: "13.333px", flexShrink: 0 }}>
        <path d="M12.9618 11.2236C12.5243 8.59108 11.1621 6.63078 9.97797 5.47936C9.6334 5.1443 9.46111 4.97677 9.08052 4.82173C8.69994 4.66669 8.3728 4.66669 7.71852 4.66669H6.28148C5.6272 4.66669 5.30006 4.66669 4.91948 4.82173C4.53889 4.97677 4.3666 5.1443 4.02203 5.47936C2.83788 6.63078 1.47574 8.59108 1.03818 11.2236C0.71262 13.1823 2.51951 14.6667 4.53888 14.6667H9.46112C11.4805 14.6667 13.2874 13.1823 12.9618 11.2236Z" stroke={strokeColor} strokeLinecap="round"/>
        <path d="M3.8371 2.96189C3.69956 2.7617 3.5002 2.48998 3.91201 2.42801C4.3353 2.36432 4.77482 2.65407 5.20505 2.64812C5.59426 2.64273 5.79255 2.47011 6.00529 2.22363C6.22931 1.9641 6.57617 1.33331 6.99935 1.33331C7.42253 1.33331 7.76939 1.9641 7.99341 2.22363C8.20615 2.47011 8.40444 2.64273 8.79365 2.64812C9.22388 2.65407 9.6634 2.36432 10.0867 2.42801C10.4985 2.48998 10.2991 2.7617 10.1616 2.96189L9.53971 3.86707C9.27369 4.25429 9.14067 4.44789 8.86231 4.55727C8.58395 4.66665 8.22424 4.66665 7.50482 4.66665H6.49388C5.77446 4.66665 5.41475 4.66665 5.13639 4.55727C4.85803 4.44789 4.72501 4.25429 4.45898 3.86707L3.8371 2.96189Z" stroke={strokeColor}/>
      </svg>
    </div>
  </div>
);

export default InvoiceIcon;
