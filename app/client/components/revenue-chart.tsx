"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", thisYear: 600, lastYear: 500 },
  { month: "Feb", thisYear: 650, lastYear: 520 },
  { month: "Mar", thisYear: 700, lastYear: 550 },
  { month: "Apr", thisYear: 720, lastYear: 580 },
  { month: "May", thisYear: 750, lastYear: 600 },
  { month: "Jun", thisYear: 780, lastYear: 620 },
  { month: "Jul", thisYear: 800, lastYear: 640 },
  { month: "Aug", thisYear: 820, lastYear: 660 },
  { month: "Sep", thisYear: 850, lastYear: 680 },
  { month: "Oct", thisYear: 870, lastYear: 700 },
  { month: "Nov", thisYear: 900, lastYear: 720 },
  { month: "Dec", thisYear: 920, lastYear: 750 },
]

export default function RevenueChart() {
  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-foreground">Revenue — This year vs last year</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#1F2A44]"></div>
            <span className="text-sm text-muted-foreground">This year (2025)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#60A5FA]"></div>
            <span className="text-sm text-muted-foreground">Last year (2024)</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
          <YAxis stroke="#9CA3AF" fontSize={12} />
          <Tooltip />
          <Line type="monotone" dataKey="thisYear" stroke="#1F2A44" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="lastYear" stroke="#60A5FA" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
