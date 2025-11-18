"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
// Using public folder icons instead of inline SVG components

const menuItems = [
  { isPublicIcon: true, iconProps: { src: "/assets/icons/dashboard.svg", alt: "Dashboard", width: 20, height: 20 }, label: "Dashboard", href: "/superadmin/pages/dashboard", permission: "dashboard" },
  { isPublicIcon: true, iconProps: { src: "/assets/icons/partner.svg", alt: "Partners", width: 20, height: 20 }, label: "Partners", href: "/superadmin/pages/partners", permission: "partner" },
  { isPublicIcon: true, iconProps: { src: "/assets/icons/support.svg", alt: "Support", width: 20, height: 20 }, label: "Support", href: "/superadmin/pages/support", permission: "support" },
  { isPublicIcon: true, iconProps: { src: "/assets/icons/team.svg", alt: "Team", width: 20, height: 20 }, label: "Team", href: "/superadmin/pages/team", permission: "team" },
  { isPublicIcon: true, iconProps: { src: "/assets/icons/star.svg", alt: "Subscription", width: 20, height: 20 }, label: "Subscription", href: "/superadmin/pages/subscription", permission: "billingFinance" },
  { isPublicIcon: true, iconProps: { src: "/assets/icons/settings.svg", alt: "Settings", width: 20, height: 20 }, label: "Settings", href: "/superadmin/pages/settings", permission: "settings" },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { user, userType } = useAuth()

  // Filter menu items based on user permissions
  const getFilteredMenuItems = () => {
    // If user is superadmin, show all items
    if (userType === 'superadmin') {
      return menuItems
    }
    
    // If user is member, filter based on permissions
    if (userType === 'member' && user) {
      // Get permissions from user object
      // For members, permissions are stored in the user object
      const userPermissions = Array.isArray((user as any).permissions) 
        ? (user as any).permissions 
        : []
      
      if (userPermissions.length > 0) {
        return menuItems.filter(item => {
          // Always show settings
          if (item.permission === 'settings') {
            return true
          }
          // Check if user has the required permission (case-insensitive)
          const hasPermission = userPermissions.some((perm: string) => 
            perm.toLowerCase() === item.permission.toLowerCase()
          )
          return hasPermission
        })
      }
    }
    
    // Default: show only settings
    return menuItems.filter(item => 
      item.permission === 'settings'
    )
  }

  const filteredMenuItems = getFilteredMenuItems()

  // Get the first available page for logo link
  const getDefaultPage = () => {
    if (userType === 'superadmin') {
      return '/superadmin/pages/dashboard'
    }
    if (filteredMenuItems.length > 0) {
      return filteredMenuItems[0].href
    }
    return '/superadmin/pages/settings'
  }

  return (
    <aside
      className="flex flex-col items-start self-stretch bg-white transition-all duration-300"
      style={{
        height: "1024px",
        paddingTop: "12px",
        width: isCollapsed ? "80px" : "240px",
      }}
    >
      {/* Logo Section */}
      <div
        className="flex items-center self-stretch  border-b"
        style={{
          padding: "4px 16px 12px 30px",
          justifyContent: "space-between",
        }}
      >
        {!isCollapsed && (
          <Link href={getDefaultPage()} className="flex items-center gap-2">
            <Image
              src="/assets/icons/lexelisidebarlogo.svg"
              alt="Luxeli Logo"
              width={120}
              height={32}
              className="w-auto h-8"
            />
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`hover:bg-muted rounded-lg transition-colors flex items-center justify-center ${isCollapsed ? 'p-2 w-10 h-10' : 'p-2'}`}
        >
          {isCollapsed ? (
            <Image
              src="/assets/icons/lexelibluelogo.svg"
              alt="Luxeli Logo"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          ) : (
            <Image
              src="/assets/icons/sidebarclosing.svg"
              alt="Toggle Sidebar"
              width={20}
              height={20}
              className="w-5 h-5"
            />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <nav
        className="flex flex-col items-start self-stretch mt-8"
        style={{
          padding: "0 var(--spacing-xl, 16px)",
          gap: "10px",
        }}
      >
        {filteredMenuItems.map((item) => {
          const isActive = pathname === item.href
          const strokeColor = isActive ? "white" : "#141B34"

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${
                isActive ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {item.isPublicIcon && (
                <Image
                  src={item.iconProps.src}
                  alt={item.iconProps.alt}
                  width={item.iconProps.width}
                  height={item.iconProps.height}
                  className="flex-shrink-0 transition-all"
                  style={{ 
                    filter: isActive 
                      ? "brightness(0) invert(1)" 
                      : "brightness(0) saturate(100%) invert(20%) sepia(7%) saturate(1000%) hue-rotate(184deg) brightness(94%) contrast(86%)"
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.filter = "brightness(0) saturate(100%) invert(15%) sepia(7%) saturate(1000%) hue-rotate(184deg) brightness(94%) contrast(86%)"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.filter = "brightness(0) saturate(100%) invert(20%) sepia(7%) saturate(1000%) hue-rotate(184deg) brightness(94%) contrast(86%)"
                    }
                  }}
                />
              )}
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
