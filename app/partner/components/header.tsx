"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { RiSearchLine, RiNotification3Line } from "react-icons/ri"
import Image from "next/image"

export default function Header() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Get page name and description based on pathname
  const getPageInfo = () => {
    const path = pathname?.split('/').filter(Boolean) || []
    const currentPage = path[path.length - 1] || 'dashboard'
    
    // Capitalize first letter of page name
    const pageName = currentPage.charAt(0).toUpperCase() + currentPage.slice(1)
    
    // Get current date and time for non-dashboard pages
    const now = new Date()
    const formattedDate = now.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    }).replace(/\//g, '/')
    
    const hours = now.getHours()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const formattedTime = `${hours % 12 || 12}${ampm}`
    
    const lastUpdated = `Last updated on ${formattedDate}, ${formattedTime}`
    
    return {
      title: pageName,
      description: currentPage === 'dashboard' 
        ? `Welcome to ${pageName}` 
        : lastUpdated
    }
  }

  const pageInfo = getPageInfo()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  return (
    <header
      className="flex items-center bg-white border-b border-border border-l"
      style={{
        width: "100%",
        padding: "12px 24px",
        justifyContent: "space-between",
      }}
    >
      <div>
        <h1>{pageInfo.title}</h1>
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground">{pageInfo.description}</p>
          {pathname === '/partner/pages/dashboard' && (
            <Image
              src="/assets/icons/dashboard hand.svg"
              alt="Dashboard Hand"
              width={16}
              height={16}
              className="w-4 h-4"
            />
          )}
        </div>
      </div>
     

      {/* Right Section */}
      <div className="flex items-center gap-4">
      {/* Search Bar */}
      <div className="flex items-center gap-2" style={{ width: "370px" }}>
        <div className="relative w-full">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
        {/* Notifications */}
        <button className="relative p-2 bg-muted rounded-xl border border-border transition-colors">
          <RiNotification3Line className="w-5 h-5 text-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
        </button>

         {/* User Profile */}
         <div className="relative" ref={dropdownRef}>
           <div className="flex  gap-3 border-border  rounded-lg">
             <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
               YL
             </div>
             <div className="flex items-center gap-2">
               <div>
                 <p className="text-sm font-semibold text-foreground">Youssef Lamari</p>
                 <p className="text-xs text-muted-foreground">Admin</p>
               </div>
               <button 
                 onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                 style={{
                   display: "flex",
                   width: "16px",
                   height: "10px",
                   padding: "0 2px",
                   justifyContent: "end",
                   alignItems: "end",
                   transform: showProfileDropdown ? "rotate(180deg)" : "rotate(0deg)",
                   transition: "transform 0.2s ease-in-out",
                   background: "transparent",
                   border: "none",
                   cursor: "pointer"
                 }}
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none">
                   <path d="M1 0.99997C1 0.99997 3.94596 4.99993 5.00003 4.99994C6.05411 4.99995 9 0.99994 9 0.99994" stroke="black" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
               </button>
             </div>
           </div>

           {/* Dropdown Menu */}
           {showProfileDropdown && (
             <div 
               className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px] overflow-hidden"
               style={{
                 animation: "dropdownFadeIn 0.2s ease-out"
               }}
             >
               {/* Language Item */}
               <button 
                 className="w-full hover:bg-gray-50 transition-colors"
                 style={{
                   display: "flex",
                   padding: "10px 16px",
                   alignItems: "center",
                   gap: "6px",
                   alignSelf: "stretch"
                 }}
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ width: "16px", height: "16px", aspectRatio: "1/1" }}>
                   <path d="M3.33398 5.33331L6.66732 8.66665M2.66732 9.33331L6.66732 5.33331L8.00065 3.33331M1.33398 3.33331H9.33398M4.66732 1.33331H5.33398M8.60935 11.3333H13.392M8.60935 11.3333L7.33398 14M8.60935 11.3333L10.5195 7.33933C10.6734 7.01749 10.7504 6.85658 10.8557 6.80572C10.9473 6.7615 11.054 6.7615 11.1456 6.80572C11.2509 6.85658 11.3279 7.01749 11.4818 7.33933L13.392 11.3333M13.392 11.3333L14.6673 14" stroke="#626878" strokeWidth="1.11333" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
                 <span style={{
                   color: "#626878",
                   fontFamily: "Fustat",
                   fontSize: "14px",
                   fontStyle: "normal",
                   fontWeight: "600",
                   lineHeight: "normal",
                   textTransform: "capitalize"
                 }}>
                   Langue
                 </span>
               </button>

               {/* Settings Item */}
               <button 
                 className="w-full hover:bg-gray-50 transition-colors"
                 style={{
                   display: "flex",
                   padding: "10px 16px",
                   alignItems: "center",
                   gap: "6px",
                   alignSelf: "stretch"
                 }}
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ width: "16px", height: "16px", aspectRatio: "1/1" }}>
                   <g clipPath="url(#clip0_1_18501)">
                     <path d="M8.00065 9.99998C9.10522 9.99998 10.0007 9.10455 10.0007 7.99998C10.0007 6.89541 9.10522 5.99998 8.00065 5.99998C6.89608 5.99998 6.00065 6.89541 6.00065 7.99998C6.00065 9.10455 6.89608 9.99998 8.00065 9.99998Z" stroke="#626878" strokeWidth="1.11333" strokeLinecap="round" strokeLinejoin="round"/>
                     <path d="M12.4855 9.81816C12.4048 10.001 12.3808 10.2037 12.4164 10.4003C12.4521 10.5969 12.5458 10.7784 12.6855 10.9212L12.7219 10.9576C12.8346 11.0701 12.924 11.2038 12.985 11.351C13.046 11.4981 13.0774 11.6558 13.0774 11.8151C13.0774 11.9744 13.046 12.1322 12.985 12.2793C12.924 12.4265 12.8346 12.5601 12.7219 12.6727C12.6093 12.7854 12.4756 12.8748 12.3285 12.9358C12.1813 12.9968 12.0236 13.0282 11.8643 13.0282C11.705 13.0282 11.5473 12.9968 11.4001 12.9358C11.253 12.8748 11.1193 12.7854 11.0067 12.6727L10.9703 12.6363C10.8275 12.4966 10.6461 12.4029 10.4495 12.3673C10.2529 12.3316 10.0501 12.3557 9.86732 12.4363C9.68806 12.5132 9.53519 12.6407 9.4275 12.8033C9.31982 12.9659 9.26204 13.1565 9.26126 13.3515V13.4545C9.26126 13.776 9.13355 14.0843 8.90623 14.3116C8.67892 14.5389 8.37061 14.6666 8.04914 14.6666C7.72766 14.6666 7.41935 14.5389 7.19204 14.3116C6.96472 14.0843 6.83701 13.776 6.83701 13.4545V13.4C6.83232 13.1994 6.76739 13.0048 6.65066 12.8416C6.53393 12.6784 6.37079 12.5541 6.18247 12.4848C5.99967 12.4042 5.7969 12.3801 5.60029 12.4157C5.40369 12.4514 5.22227 12.5451 5.07944 12.6848L5.04308 12.7212C4.9305 12.8339 4.79682 12.9233 4.64967 12.9843C4.50252 13.0453 4.34479 13.0767 4.1855 13.0767C4.02621 13.0767 3.86848 13.0453 3.72133 12.9843C3.57418 12.9233 3.4405 12.8339 3.32792 12.7212C3.21523 12.6086 3.12582 12.4749 3.06482 12.3278C3.00382 12.1806 2.97242 12.0229 2.97242 11.8636C2.97242 11.7043 3.00382 11.5466 3.06482 11.3994C3.12582 11.2523 3.21523 11.1186 3.32792 11.006L3.36429 10.9697C3.50401 10.8268 3.59773 10.6454 3.63338 10.4488C3.66903 10.2522 3.64496 10.0494 3.56429 9.86665C3.48746 9.68739 3.3599 9.53452 3.1973 9.42683C3.0347 9.31915 2.84416 9.26136 2.64914 9.26059H2.54611C2.22463 9.26059 1.91632 9.13288 1.68901 8.90556C1.46169 8.67825 1.33398 8.36994 1.33398 8.04846C1.33398 7.72699 1.46169 7.41868 1.68901 7.19137C1.91632 6.96405 2.22463 6.83634 2.54611 6.83634H2.60065C2.80125 6.83165 2.99581 6.76672 3.15901 6.64999C3.32222 6.53325 3.44654 6.37012 3.5158 6.1818C3.59648 5.999 3.62054 5.79623 3.5849 5.59962C3.54925 5.40302 3.45552 5.2216 3.3158 5.07877L3.27944 5.0424C3.16674 4.92983 3.07734 4.79615 3.01634 4.649C2.95534 4.50185 2.92394 4.34412 2.92394 4.18483C2.92394 4.02554 2.95534 3.86781 3.01634 3.72066C3.07734 3.57351 3.16674 3.43983 3.27944 3.32725C3.39201 3.21455 3.5257 3.12515 3.67284 3.06415C3.81999 3.00315 3.97772 2.97175 4.13701 2.97175C4.29631 2.97175 4.45404 3.00315 4.60118 3.06415C4.74833 3.12515 4.88202 3.21455 4.99459 3.32725L5.03095 3.36362C5.17379 3.50334 5.35521 3.59706 5.55181 3.63271C5.74841 3.66836 5.95119 3.64429 6.13398 3.56362H6.18247C6.36172 3.48679 6.5146 3.35923 6.62228 3.19663C6.72997 3.03403 6.78775 2.84349 6.78853 2.64846V2.54543C6.78853 2.22396 6.91624 1.91565 7.14355 1.68834C7.37087 1.46102 7.67918 1.33331 8.00065 1.33331C8.32213 1.33331 8.63043 1.46102 8.85775 1.68834C9.08507 1.91565 9.21277 2.22396 9.21277 2.54543V2.59998C9.21355 2.795 9.27134 2.98554 9.37902 3.14814C9.4867 3.31074 9.63958 3.43831 9.81883 3.51513C10.0016 3.59581 10.2044 3.61987 10.401 3.58422C10.5976 3.54858 10.779 3.45485 10.9219 3.31513L10.9582 3.27877C11.0708 3.16607 11.2045 3.07666 11.3516 3.01566C11.4988 2.95467 11.6565 2.92327 11.8158 2.92327C11.9751 2.92327 12.1328 2.95467 12.28 3.01566C12.4271 3.07666 12.5608 3.16607 12.6734 3.27877C12.7861 3.39134 12.8755 3.52502 12.9365 3.67217C12.9975 3.81932 13.0289 3.97705 13.0289 4.13634C13.0289 4.29563 12.9975 4.45336 12.9365 4.60051C12.8755 4.74766 12.7861 4.88135 12.6734 4.99392L12.637 5.03028C12.4973 5.17312 12.4036 5.35453 12.3679 5.55114C12.3323 5.74774 12.3563 5.95052 12.437 6.13331V6.1818C12.5138 6.36105 12.6414 6.51393 12.804 6.62161C12.9666 6.72929 13.1571 6.78708 13.3522 6.78786H13.4552C13.7767 6.78786 14.085 6.91556 14.3123 7.14288C14.5396 7.3702 14.6673 7.67851 14.6673 7.99998C14.6673 8.32145 14.5396 8.62976 14.3123 8.85708C14.085 9.0844 13.7767 9.2121 13.4552 9.2121H13.4007C13.2056 9.21288 13.0151 9.27067 12.8525 9.37835C12.6899 9.48603 12.5623 9.63891 12.4855 9.81816Z" stroke="#626878" strokeWidth="1.11333" strokeLinecap="round" strokeLinejoin="round"/>
                   </g>
                   <defs>
                     <clipPath id="clip0_1_18501">
                       <rect width="16" height="16" fill="white"/>
                     </clipPath>
                   </defs>
                 </svg>
                 <span style={{
                   color: "#626878",
                   fontFamily: "Fustat",
                   fontSize: "14px",
                   fontStyle: "normal",
                   fontWeight: "600",
                   lineHeight: "normal",
                   textTransform: "capitalize"
                 }}>
                   Paramètres
                 </span>
               </button>

               {/* Logout Item */}
               <button 
                 className="w-full hover:bg-gray-50 transition-colors"
                 style={{
                   display: "flex",
                   padding: "16px",
                   alignItems: "center",
                   gap: "6px",
                   alignSelf: "stretch",
                   borderTop: "1px solid rgba(0, 0, 0, 0.06)"
                 }}
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ width: "16px", height: "16px", aspectRatio: "1/1" }}>
                   <path d="M12.0007 5.33333L14.6673 8M14.6673 8L12.0007 10.6667M14.6673 8H6.00065M10.0007 2.80269C9.15082 2.29218 8.16415 2 7.11176 2C3.92078 2 1.33398 4.68629 1.33398 8C1.33398 11.3137 3.92078 14 7.11176 14C8.16415 14 9.15082 13.7078 10.0007 13.1973" stroke="#FF0D0D" strokeWidth="1.11333" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
                 <span style={{
                   color: "#FF0D0D",
                   fontSize: "14px",
                   fontStyle: "normal",
                   fontWeight: "600",
                   lineHeight: "normal",
                   textTransform: "capitalize"
                 }}>
                   Se déconnecter
                 </span>
               </button>
             </div>
           )}
         </div>
      </div>
    </header>
  )
}
