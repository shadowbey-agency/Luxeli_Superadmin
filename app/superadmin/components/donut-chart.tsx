"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const data = [
  { name: "Morning", value: 65, color: "#3B82F6" },
  { name: "Afternoon", value: 23, color: "#60A5FA" },
  { name: "Evening", value: 20, color: "#1F2A44" },
]

export default function DonutChart() {
  return (
    <div className="bg-card rounded-xl p-6 border border-border h-full">
      <h3 className="text-base font-semibold text-foreground mb-4">Order Time</h3>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="flex flex-col gap-2 mt-4">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-sm text-muted-foreground">{entry.name}</span>
            </div>
            <span className="text-sm font-semibold text-foreground">{entry.value}%</span>
          </div>
        ))}
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <p className="text-3xl font-bold text-foreground">234</p>
        <p className="text-xs text-muted-foreground">Total orders</p>
      </div>
    </div>
  )
}
