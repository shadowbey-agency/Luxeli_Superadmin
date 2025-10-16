"use client"

import { type ReactNode, useState } from "react"

interface Tab {
  id: string
  label: string
  content: ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
}

export default function Tabs({ tabs, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  return (
    <div className="w-full">
      <div className="flex max-w-[1180px] p-5 justify-end items-center gap-4 border-b border-black/[0.06]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex p-[10px_30px] flex-col justify-center items-center gap-2.5 flex-1 border-b-2 border-black/10 transition-colors ${
              activeTab === tab.id ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">{tabs.find((tab) => tab.id === activeTab)?.content}</div>
    </div>
  )
}
