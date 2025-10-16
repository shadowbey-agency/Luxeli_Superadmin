import type React from "react"
import Sidebar from "@/app/superadmin/components/sidebar"
import Header from "@/app/superadmin/components/header"

export default function SuperadminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto bg-[#F9FAFB]">{children}</main>
      </div>
    </div>
  )
}
