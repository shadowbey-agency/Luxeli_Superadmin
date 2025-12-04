import type React from "react"
import Sidebar from "@/app/partner/components/sidebar"
import Header from "@/app/partner/components/header"
import { AuthProvider } from "@/lib/auth-context"
import { SidebarProvider, useSidebar } from "@/app/partner/components/sidebar-context"

function PartnerLayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()
  const sidebarWidth = isCollapsed ? 80 : 240

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col transition-all duration-300" style={{ marginLeft: `${sidebarWidth}px` }}>
        <Header />
        <main className="flex-1 bg-[#F9FAFB] overflow-auto" style={{ marginTop: "80px", padding: "24px", minHeight: "calc(100vh - 80px)" }}>{children}</main>
      </div>
    </div>
  )
}

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <PartnerLayoutContent>{children}</PartnerLayoutContent>
      </SidebarProvider>
    </AuthProvider>
  )
}
