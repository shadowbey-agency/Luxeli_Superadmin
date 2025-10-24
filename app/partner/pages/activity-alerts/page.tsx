"use client"

import { useRouter } from "next/navigation"
import PublicIcon from "../../components/public-icon"

export default function ActivityAlertsPage() {
  const router = useRouter()

  const tabs = [
    {
      id: "requests",
      label: "Requests",
      icon: <PublicIcon src="/assets/icons/houskeeping-request.svg" alt="Requests" width={16} height={16} />,
      href: "/partner/pages/activity-alerts/requests"
    },
    {
      id: "activities", 
      label: "Activities",
      icon: <PublicIcon src="/assets/icons/menu-01.svg" alt="Activities" width={16} height={16} />,
      href: "/partner/pages/activity-alerts/activities"
    }
  ]

  return (
    <div className="p-6">
      {/* Tab Navigation */}
      <div className="mb-6 rounded-t-lg">
        <div className="flex items-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => router.push(tab.href)}
              className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative focus:outline-none flex-shrink-0 ${
                tab.id === "requests"
                  ? "text-foreground -mb-[2px]"
                  : "text-muted-foreground hover:text-foreground -mb-[2px]"
              }`}
              style={{
                width: "274px",
                borderBottom: tab.id === "requests" ? "2px solid #1F2A44" : "2px solid #EDEDED"
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {/* Main Container */}
        <div style={{ borderRadius: "8px", border: "1px solid #00000014", overflow: "hidden" }}>
          {/* Main Heading Section */}
          <div style={{ background: "#FBFAFA", padding: "16px", borderBottom: "1px solid #E7E7E7" }}>
            <h2 className="text-2xl font-bold text-foreground mb-2">Activity alerts</h2>
            <p className="text-muted-foreground">Jorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>

          {/* Content Area */}
          <div style={{ background: "#FFFFFF", padding: "16px" }}>
            <div className="text-center py-12">
              <PublicIcon src="/assets/icons/notification.svg" alt="Activity Alerts" width={64} height={64} className="mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Activity Alerts</h3>
              <p className="text-gray-500">Select a tab above to view requests or activities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
