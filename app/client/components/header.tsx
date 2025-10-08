"use client"

import { RiSearchLine, RiNotification3Line } from "react-icons/ri"

export default function Header() {
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
        <h1>Dashboard</h1>
        <p className="text-xs text-muted-foreground">welcome to dashboard</p>
      </div>
     

      {/* Right Section */}
      <div className="flex items-center gap-4">
      {/* Search Bar */}
      <div className="flex items-center gap-2 flex-1 max-w-md">
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
        <div className="flex items-center gap-3  border-border">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
            YL
          </div>
          <div >
            <p className="text-sm font-semibold text-foreground">Youssef Lamari</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
          
        </div>
      </div>
    </header>
  )
}
