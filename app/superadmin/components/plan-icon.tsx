import React from 'react';

interface PlanIconProps {
  type: 'starter' | 'gold';
  size?: number;
}

export default function PlanIcon({ type, size = 24 }: PlanIconProps) {
  const isStarter = type === 'starter';
  
  const containerStyle = {
    display: "flex",
    width: `${size}px`,
    height: `${size}px`,
    padding: "7.765px 3.529px",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    gap: "7.059px",
    borderRadius: "70.588px",
    border: `0.353px solid ${isStarter ? '#000' : '#D1924F'}`,
    background: isStarter ? 'rgba(0, 0, 0, 0.20)' : 'rgba(209, 146, 79, 0.20)',
    boxShadow: "0 2.471px 3.882px 0 rgba(0, 0, 0, 0.02)"
  };

  const iconStyle = {
    width: "8.471px",
    height: "9.412px",
    flexShrink: 0
  };

  const strokeColor = isStarter ? 'black' : '#D1924F';

  return (
    <div style={containerStyle}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="10" 
        height="12" 
        viewBox="0 0 10 12" 
        fill="none"
        style={iconStyle}
      >
        <path d="M1.0085 5.20266C0.825886 4.69725 0.734577 4.44454 0.773513 4.28261C0.816099 4.10549 0.942058 3.96741 1.10306 3.92134C1.25026 3.87923 1.47925 3.981 1.93723 4.18455C2.34231 4.36459 2.54485 4.45461 2.73515 4.4496C2.94468 4.44409 3.14624 4.36006 3.30658 4.21139C3.4522 4.07636 3.54988 3.86119 3.74523 3.43084L4.17575 2.48242C4.53538 1.69019 4.71519 1.29407 4.99994 1.29407C5.28469 1.29407 5.46451 1.69019 5.82413 2.48242L6.25466 3.43084C6.45001 3.86119 6.54768 4.07636 6.69331 4.21139C6.85365 4.36006 7.05521 4.44409 7.26473 4.4496C7.45503 4.45461 7.65758 4.36459 8.06266 4.18455C8.52064 3.981 8.74962 3.87923 8.89682 3.92134C9.05783 3.96741 9.18379 4.10549 9.22637 4.28261C9.26531 4.44454 9.174 4.69725 8.99138 5.20266L8.20643 7.37509C7.87064 8.30441 7.70275 8.76906 7.3514 9.03157C7.00005 9.29407 6.54602 9.29407 5.63795 9.29407H4.36194C3.45387 9.29407 2.99983 9.29407 2.64849 9.03157C2.29714 8.76906 2.12924 8.30441 1.79346 7.37509L1.0085 5.20266Z" stroke={strokeColor} strokeWidth="0.705882"/>
        <path d="M5 6.94116H5.00423" stroke={strokeColor} strokeWidth="0.941177" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2.64648 10.7058H7.35237" stroke={strokeColor} strokeWidth="0.705882" strokeLinecap="round"/>
      </svg>
    </div>
  );
}
