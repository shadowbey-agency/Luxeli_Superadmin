"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", starter: 400, gold: 600 },
  { month: "Feb", starter: 450, gold: 550 },
  { month: "Mar", starter: 500, gold: 500 },
  { month: "Apr", starter: 350, gold: 450 },
  { month: "May", starter: 550, gold: 600 },
  { month: "Jun", starter: 600, gold: 700 },
  { month: "Jul", starter: 650, gold: 750 },
]

export default function SubscribersChart() {
  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-foreground mb-2">Subscribers by plan</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#60A5FA]"></div>
            <span className="text-sm text-muted-foreground">Starter pack</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#3B82F6]"></div>
            <span className="text-sm text-muted-foreground">Pack Gold</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">500 Users</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
          <YAxis stroke="#9CA3AF" fontSize={12} />
          <Tooltip />
          <Bar dataKey="starter" fill="#60A5FA" radius={[4, 4, 0, 0]} />
          <Bar dataKey="gold" fill="#3B82F6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
