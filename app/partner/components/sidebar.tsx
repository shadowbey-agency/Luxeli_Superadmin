"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  RiArrowUpSLine,
  RiArrowDownSLine,
  RiHome4Line,
  RiFileList3Line,
  RiCalendarLine,
  RiSettings3Line,
  RiNotification3Line,
  RiShirtLine,
  RiTruckLine,
} from "react-icons/ri"
import PublicIcon from "./public-icon"
import { useState, useEffect } from "react"
import React from "react"
import DashboardSidebarIcon from "./dashboard-sidebar-icon"
import TeamSidebarIcon from "./team-sidebar-icon"
import { usePermissions } from "@/hooks/usePermissions"

const menuItems = [
  { icon: DashboardSidebarIcon, label: "Dashboard", href: "/partner/pages/dashboard" },
  { icon: PublicIcon, label: "Rooms", href: "/partner/pages/room", isPublicIcon: true, iconProps: { src: "/assets/icons/bed-bunk.svg", alt: "Rooms", width: 20, height: 20 } },
  { icon: PublicIcon, label: "Support", href: "/partner/pages/support", isPublicIcon: true, iconProps: { src: "/assets/icons/status error.svg", alt: "Support", width: 20, height: 20 } },
  { icon: TeamSidebarIcon, label: "Team", href: "/partner/pages/team" },
  { icon: PublicIcon, label: "Subscription", href: "/partner/pages/subscription", isPublicIcon: true, iconProps: { src: "/assets/icons/dollar-circle.svg", alt: "Subscription", width: 20, height: 20 } },
  { icon: PublicIcon, label: "Settings", href: "/partner/pages/settings", isPublicIcon: true, iconProps: { src: "/assets/icons/settings.svg", alt: "Settings", width: 20, height: 20 } },
]

const servicesItems = [
  {
    label: "Housekeeping",
    icon: PublicIcon,
    href: "/partner/pages/housekeeping",
    isPublicIcon: true,
    iconProps: { src: "/assets/icons/housekeeping.svg", alt: "Housekeeping", width: 20, height: 20 },
    subItems: [
      { label: "Requests", icon: PublicIcon, href: "/partner/pages/housekeeping/requests", isPublicIcon: true, iconProps: { src: "/assets/icons/houskeeping-request.svg", alt: "Requests", width: 20, height: 20 } },
      { label: "House cleaning", icon: PublicIcon, href: "/partner/pages/housekeeping/house-cleaning", isPublicIcon: true, iconProps: { src: "/assets/icons/housekeeping-cleaning.svg", alt: "House cleaning", width: 20, height: 20 } },
      { label: "Requests management", icon: PublicIcon, href: "/partner/pages/housekeeping/requests-management", isPublicIcon: true, iconProps: { src: "/assets/icons/settings.svg", alt: "Requests management", width: 20, height: 20 } },
    ]
  },
  {
    label: "Bookings interns",
    icon: PublicIcon,
    href: "/partner/pages/booking",
    isPublicIcon: true,
    iconProps: { src: "/assets/icons/calendar.svg", alt: "Bookings", width: 20, height: 20 },
    subItems: [
      { label: "Requests", icon: PublicIcon, href: "/partner/pages/booking/requests", isPublicIcon: true, iconProps: { src: "/assets/icons/houskeeping-request.svg", alt: "Requests", width: 20, height: 20 } },
      { label: "Bookings setting", icon: PublicIcon, href: "/partner/pages/booking/settings", isPublicIcon: true, iconProps: { src: "/assets/icons/settings.svg", alt: "Bookings setting", width: 20, height: 20 } },
    ]
  },
  {
    label: "Customized services",
    icon: PublicIcon,
    href: "/partner/pages/customized-services",
    isPublicIcon: true,
    iconProps: { src: "/assets/icons/customized service.svg", alt: "Customized services", width: 20, height: 20 },
    subItems: [
      { label: "Requests", icon: PublicIcon, href: "/partner/pages/customized-services/requests", isPublicIcon: true, iconProps: { src: "/assets/icons/houskeeping-request.svg", alt: "Requests", width: 20, height: 20 } }
    ]
  },
  {
    label: "Activity alerts",
    icon: PublicIcon,
    href: "/partner/pages/activity-alerts",
    isPublicIcon: true,
    iconProps: { src: "/assets/icons/activity alert.svg", alt: "Activity alerts", width: 20, height: 20 },
    subItems: [
      { label: "Requests", icon: PublicIcon, href: "/partner/pages/activity-alerts/requests", isPublicIcon: true, iconProps: { src: "/assets/icons/houskeeping-request.svg", alt: "Requests", width: 20, height: 20 } },
      { label: "Activities", icon: PublicIcon, href: "/partner/pages/activity-alerts/activities", isPublicIcon: true, iconProps: { src: "/assets/icons/menu-01.svg", alt: "Activities", width: 20, height: 20 } },
    ]
  },
  {
    label: "Laundry",
    icon: PublicIcon,
    href: "/partner/pages/laundry",
    isPublicIcon: true,
    iconProps: { src: "/assets/icons/laundary.svg", alt: "Laundry", width: 20, height: 20 },
    subItems: [
      { label: "Requests", icon: PublicIcon, href: "/partner/pages/laundry/requests", isPublicIcon: true, iconProps: { src: "/assets/icons/houskeeping-request.svg", alt: "Requests", width: 20, height: 20 } },
      { label: "Laundry settings", icon: PublicIcon, href: "/partner/pages/laundry/settings", isPublicIcon: true, iconProps: { src: "/assets/icons/settings.svg", alt: "Laundry settings", width: 20, height: 20 } },
    ]
  },
  {
    label: "Room delivery",
    icon: PublicIcon,
    href: "/partner/pages/room-delivery",
    isPublicIcon: true,
    iconProps: { src: "/assets/icons/in-room delivery.svg", alt: "Room delivery", width: 20, height: 20 },
    subItems: [
      { label: "Requests", icon: PublicIcon, href: "/partner/pages/room-delivery/requests", isPublicIcon: true, iconProps: { src: "/assets/icons/houskeeping-request.svg", alt: "Requests", width: 20, height: 20 } },
      { label: "Restaurants", icon: PublicIcon, href: "/partner/pages/room-delivery/restaurants", isPublicIcon: true, iconProps: { src: "/assets/icons/resturent.svg", alt: "Restaurants", width: 20, height: 20 } },
    ]
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedServices, setExpandedServices] = useState<string[]>([])
  const { hasPermission, loading } = usePermissions()
  
  // Get current URL with search params (if any)
  const [currentFullPath, setCurrentFullPath] = useState("")
  
  useEffect(() => {
    setCurrentFullPath(window.location.pathname + window.location.search)
  }, [pathname])
  
  // Filter menu items based on permissions
  const visibleMenuItems = loading ? [] : menuItems.filter(item => hasPermission(item.href))
  
  // Filter service items based on permissions
  const visibleServicesItems = loading ? [] : servicesItems.map(service => {
    const visibleSubItems = service.subItems.filter(subItem => hasPermission(subItem.href))
    return { ...service, subItems: visibleSubItems }
  }).filter(service => service.subItems.length > 0) // Only show service if it has visible sub-items

  // Auto-expand service if on one of its sub-pages
  useEffect(() => {
    if (currentFullPath || pathname) {
      servicesItems.forEach((service) => {
        const hasActiveSubItem = service.subItems.some(subItem => {
          // Check exact match with query params or if pathname starts with the subItem href
          return currentFullPath === subItem.href || pathname.startsWith(subItem.href.split('?')[0])
        })
        if (hasActiveSubItem && !expandedServices.includes(service.label)) {
          setExpandedServices(prev => [...prev, service.label])
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFullPath, pathname])

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
          <Link href="/partner/pages/dashboard" className="flex items-center gap-2">
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
          padding: "0 6px",
          gap: "6px",
        }}
      >
        {visibleMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          const strokeColor = isActive ? "white" : "#71717A"

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 w-full px-4 py-2 transition-all ${
                isActive ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              style={{ borderRadius: "8px" }}
            >
              {item.isPublicIcon ? (
                <div style={{ width: "24px", height: "24px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Icon 
                    {...item.iconProps}
                    className="flex-shrink-0"
                    style={{ 
                      width: "20px", 
                      height: "20px",
                      filter: isActive ? "brightness(0) invert(1)" : "brightness(0) saturate(100%) invert(45%) sepia(7%) saturate(1000%) hue-rotate(184deg) brightness(94%) contrast(86%)"
                    }}
                  />
                </div>
              ) : (
                <div style={{ width: "24px", height: "24px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  {React.createElement(Icon as any, { strokeColor: strokeColor, className: "w-6 h-6 flex-shrink-0" })}
                </div>
              )}
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          )
        })}

        {/* Services Section */}
        <div className="w-full mt-4" style={{ gap: "6px", display: "flex", flexDirection: "column" }}>
          {visibleServicesItems.map((service) => {
            const Icon = service.icon
            const isExpanded = expandedServices.includes(service.label)
            const hasActiveSubItem = service.subItems.some(subItem => currentFullPath === subItem.href)
            const isActive = pathname === service.href
            const strokeColor = isActive ? "white" : "#71717A"

            const toggleExpanded = () => {
              if (service.subItems.length > 0) {
                setExpandedServices(prev => 
                  prev.includes(service.label) 
                    ? prev.filter(item => item !== service.label)
                    : [...prev, service.label]
                )
              }
            }

            return (
              <div key={service.label} className="w-full">
                {/* Main Service Item */}
                <div
                  className={`flex items-center gap-3 w-full px-4 py-2 transition-all cursor-pointer ${
                    isActive ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  style={{ borderRadius: "8px" }}
                  onClick={toggleExpanded}
                >
                  {service.isPublicIcon ? (
                    <div style={{ width: "24px", height: "24px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <Icon 
                        {...service.iconProps}
                        className="flex-shrink-0"
                        style={{ 
                          width: "18px", 
                          height: "18px",
                          filter: isActive ? "brightness(0) invert(1)" : "brightness(0) saturate(100%) invert(45%) sepia(7%) saturate(1000%) hue-rotate(184deg) brightness(94%) contrast(86%)"
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{ width: "24px", height: "24px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                      {React.createElement(Icon as any, { strokeColor: strokeColor, className: "w-6 h-6 flex-shrink-0" })}
                    </div>
                  )}
                  {!isCollapsed && (
                    <>
                      <span className="text-sm font-medium flex-1">{service.label}</span>
                      {service.subItems.length > 0 && (
                        isExpanded ? (
                          <RiArrowUpSLine className="w-4 h-4" />
                        ) : (
                          <RiArrowDownSLine className="w-4 h-4" />
                        )
                      )}
                    </>
                  )}
                </div>

                {/* Sub Items */}
                {isExpanded && service.subItems.length > 0 && !isCollapsed && (
                  <div className="ml-4 mt-1" style={{ gap: "6px", display: "flex", flexDirection: "column" }}>
                    {service.subItems.map((subItem) => {
                      const SubIcon = subItem.icon
                      // Check both exact match and pathname match for direct page routes
                      const isSubActive = currentFullPath === subItem.href || pathname === subItem.href.split('?')[0]
                      const subStrokeColor = isSubActive ? "white" : "#71717A"

                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`flex items-center gap-3 w-full px-4 py-1.5 transition-all text-sm ${
                            isSubActive ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                          style={{ borderRadius: "8px" }}
                        >
                          {subItem.isPublicIcon ? (
                            <div style={{ width: "24px", height: "24px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                              <SubIcon 
                                {...subItem.iconProps}
                                className="flex-shrink-0"
                                style={{ 
                                  width: "20px", 
                                  height: "20px",
                                  filter: isSubActive ? "brightness(0) invert(1)" : "brightness(0) saturate(100%) invert(45%) sepia(7%) saturate(1000%) hue-rotate(184deg) brightness(94%) contrast(86%)"
                                }}
                              />
                            </div>
                          ) : (
                            <div style={{ width: "24px", height: "24px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                              {React.createElement(SubIcon as any, { strokeColor: subStrokeColor, className: "w-6 h-6 flex-shrink-0" })}
                            </div>
                          )}
                          <span className="font-medium">{subItem.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}
