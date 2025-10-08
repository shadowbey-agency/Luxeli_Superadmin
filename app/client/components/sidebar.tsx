"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  RiDashboardLine,
  RiTeamLine,
  RiCustomerService2Line,
  RiGroupLine,
  RiFileList3Line,
  RiSettings4Line,
  RiMenuFoldLine,
  RiMenuUnfoldLine,
} from "react-icons/ri"
import { useState } from "react"

const menuItems = [
  { icon: RiDashboardLine, label: "Dashboard", href: "/client/pages/dashboard" },
  { icon: RiGroupLine, label: "Partners", href: "/client/pages/partners" },
  { icon: RiCustomerService2Line, label: "Support", href: "/client/pages/support" },
  { icon: RiTeamLine, label: "Team", href: "/client/pages/team" },
  { icon: RiFileList3Line, label: "Subscription", href: "/client/pages/subscription" },
  { icon: RiSettings4Line, label: "Settings", href: "/client/pages/settings" },
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
          <Link href="/client/pages/dashboard" className="flex items-center gap-1">
            <span className="text-2xl font-bold text-primary">Luxeli</span>
            <span className="text-2xl font-bold text-info">A</span>
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

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${
                isActive ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
