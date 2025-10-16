"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  RiSettings4Line,
  RiMenuFoldLine,
  RiMenuUnfoldLine,
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
import { useState } from "react"
import DashboardSidebarIcon from "./dashboard-sidebar-icon"
import RoomSidebarIcon from "./room-sidebar-icon"
import PartnersSidebarIcon from "./partners-sidebar-icon"
import SupportSidebarIcon from "./support-sidebar-icon"
import TeamSidebarIcon from "./team-sidebar-icon"
import SubscriptionSidebarIcon from "./subscription-sidebar-icon"

const menuItems = [
  { icon: DashboardSidebarIcon, label: "Dashboard", href: "/partner/pages/dashboard" },
  { icon: RoomSidebarIcon, label: "Rooms", href: "/partner/pages/room" },
  { icon: PartnersSidebarIcon, label: "Partners", href: "/partner/pages/partners" },
  { icon: SupportSidebarIcon, label: "Support", href: "/partner/pages/support" },
  { icon: TeamSidebarIcon, label: "Team", href: "/partner/pages/team" },
  { icon: SubscriptionSidebarIcon, label: "Subscription", href: "/partner/pages/subscription" },
  { icon: RiSettings4Line, label: "Settings", href: "/partner/pages/settings" },
]

const servicesItems = [
  {
    label: "Housekeeping",
    icon: RiHome4Line,
    href: "/partner/pages/housekeeping",
    subItems: [
      { label: "Requests", icon: RiFileList3Line, href: "/partner/pages/housekeeping?tab=requests" },
      { label: "House cleaning", icon: RiHome4Line, href: "/partner/pages/housekeeping?tab=house-cleaning" },
      { label: "Requests management", icon: RiSettings3Line, href: "/partner/pages/housekeeping?tab=requests-management" },
    ]
  },
  {
    label: "Bookings interns",
    icon: RiCalendarLine,
    href: "/partner/pages/bookings-interns",
    subItems: []
  },
  {
    label: "Customized services",
    icon: RiSettings3Line,
    href: "/partner/pages/customized-services",
    subItems: []
  },
  {
    label: "Activity alerts",
    icon: RiNotification3Line,
    href: "/partner/pages/activity-alerts",
    subItems: []
  },
  {
    label: "Laundry",
    icon: RiShirtLine,
    href: "/partner/pages/laundry",
    subItems: []
  },
  {
    label: "In-room delivery",
    icon: RiTruckLine,
    href: "/partner/pages/in-room-delivery",
    subItems: []
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedServices, setExpandedServices] = useState<string[]>([])

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
          <Link href="/partner/pages/dashboard" className="flex items-center gap-1">
            <span className="text-2xl font-bold text-primary">Luxeli</span>
            <span className="text-2xl font-bold text-info">P</span>
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          {isCollapsed ? (
            <RiMenuUnfoldLine className="w-5 h-5 text-muted-foreground" />
          ) : (
            <RiMenuFoldLine className="w-5 h-5 text-muted-foreground" />
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
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          const strokeColor = isActive ? "white" : "#141B34"

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${
                isActive ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon 
                strokeColor={strokeColor} 
                className="w-6 h-6 flex-shrink-0" 
              />
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          )
        })}

        {/* Services Section */}
        <div className="w-full mt-4">
          {!isCollapsed && (
            <div className="px-4 py-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Services</h3>
            </div>
          )}
          
          {servicesItems.map((service) => {
            const Icon = service.icon
            const isExpanded = expandedServices.includes(service.label)
            const hasActiveSubItem = service.subItems.some(subItem => pathname.includes(subItem.href.split('?')[0]))
            const isActive = pathname === service.href || hasActiveSubItem
            const strokeColor = isActive ? "white" : "#141B34"

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
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all cursor-pointer ${
                    isActive ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  onClick={toggleExpanded}
                >
                  <Icon 
                    strokeColor={strokeColor} 
                    className="w-6 h-6 flex-shrink-0" 
                  />
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
                  <div className="ml-4 mt-1 space-y-1">
                    {service.subItems.map((subItem) => {
                      const SubIcon = subItem.icon
                      const isSubActive = pathname.includes(subItem.href.split('?')[0])
                      const subStrokeColor = isSubActive ? "white" : "#141B34"

                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-all text-sm ${
                            isSubActive ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <SubIcon 
                            strokeColor={subStrokeColor} 
                            className="w-5 h-5 flex-shrink-0" 
                          />
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
