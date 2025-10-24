"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  RiSettings4Line,
} from "react-icons/ri"
import { useState } from "react"
import DashboardSidebarIcon from "./dashboard-sidebar-icon"
import PartnersSidebarIcon from "./partners-sidebar-icon"
import SupportSidebarIcon from "./support-sidebar-icon"
import TeamSidebarIcon from "./team-sidebar-icon"
import SubscriptionSidebarIcon from "./subscription-sidebar-icon"

const menuItems = [
  { icon: DashboardSidebarIcon, label: "Dashboard", href: "/superadmin/pages/dashboard" },
  { icon: PartnersSidebarIcon, label: "Partners", href: "/superadmin/pages/partners" },
  { icon: SupportSidebarIcon, label: "Support", href: "/superadmin/pages/support" },
  { icon: TeamSidebarIcon, label: "Team", href: "/superadmin/pages/team" },
  { icon: SubscriptionSidebarIcon, label: "Subscription", href: "/superadmin/pages/subscription" },
  { icon: RiSettings4Line, label: "Settings", href: "/superadmin/pages/settings" },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

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
          <Link href="/superadmin/pages/dashboard" className="flex items-center gap-2">
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
      </nav>
    </aside>
  )
}
