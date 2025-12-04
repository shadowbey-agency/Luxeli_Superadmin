"use client"

import type React from "react"
import Sidebar from "@/app/superadmin/components/sidebar"
import Header from "@/app/superadmin/components/header"
import { AuthProvider } from "@/lib/auth-context"
import { SidebarProvider, useSidebar } from "@/app/superadmin/components/sidebar-context"

function SuperadminLayoutContent({ children }: { children: React.ReactNode }) {
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

export default function SuperadminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <SuperadminLayoutContent>{children}</SuperadminLayoutContent>
      </SidebarProvider>
    </AuthProvider>
  )
}
