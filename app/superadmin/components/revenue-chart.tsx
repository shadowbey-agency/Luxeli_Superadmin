"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from "recharts"

const data = [
  { month: "Sep 21", thisYear: 600, lastYear: 500 },
  { month: "Sep 22", thisYear: 650, lastYear: 520 },
  { month: "Sep 23", thisYear: 700, lastYear: 550 },
  { month: "Sep 24", thisYear: 720, lastYear: 580 },
  { month: "Sep 25", thisYear: 750, lastYear: 600 },
  { month: "Sep 26", thisYear: 780, lastYear: 620 },
  { month: "Sep 27", thisYear: 800, lastYear: 640 },
  { month: "Sep 28", thisYear: 820, lastYear: 660 },
]

export default function RevenueChart() {
  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div 
        className="flex py-[12px] px-4 w-full"
        style={{
          height: "65px",
          flexShrink: 0,
          fill: "#FCFCFC",
          strokeWidth: "1px",
          stroke: "#E9EAEB",
          background: "#FCFCFC",
          border: "1px solid #E9EAEB",
          borderRadius: "12px 12px 0 0"
        }}
      >
        <h3 className="text-sm font-semibold text-[#212121]">Empty vs Full Room</h3>
      </div>

      {/* Content */}
      <div 
        className="flex flex-col p-4 w-full"
        style={{
          height: "280px",
          flexShrink: 0,
          fill: "#FFF",
          strokeWidth: "1px",
          stroke: "#E9EAEB",
          background: "#FFF",
          border: "1px solid #E9EAEB",
          borderRadius: "14px",
          marginTop: "-15px",
          outline: 'none'
        }}
        onFocus={(e) => e.target.blur()}
      >
        {/* Legend */}
        <div className="flex items-center justify-end mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-[10px] h-[10px] rounded-full bg-[#4195BF]"></div>
              <span className="text-medium text-muted-foreground">Empty Room</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[10px] h-[10px] rounded-full bg-[#1F2A44]"></div>
              <span className="text-medium text-muted-foreground">Full Room</span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height="100%" style={{ outline: 'none' }}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="0" stroke="#E5E7EB" horizontal={true} vertical={false} />
          <XAxis 
            dataKey="month" 
            stroke="transparent" 
            fontSize={12}
            tick={{ fill: '#535862', fontSize: '12px', fontWeight: '500' }}
            label={{ value: 'Week days', position: 'insideBottom', offset: -5, style: {  fontSize: '12px', fill: '#535862', fontWeight: '500' } }}
          />
          <YAxis 
            stroke="transparent" 
            fontSize={12} 
            domain={[0, 1000]}
            ticks={[0, 200, 400, 600, 800, 1000]}
            tick={{ fill: '#535862', fontSize: '12px', fontWeight: '500' }}
            label={{ value: 'Nbr', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '12px', fill: '#535862', fontWeight: '500' } }}
          />
          <Tooltip />
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#126F48" stopOpacity={1}/>
              <stop offset="50%" stopColor="#126F48" stopOpacity={0.5}/>
              <stop offset="100%" stopColor="#126F48" stopOpacity={0.2}/>
            </linearGradient>
          </defs>
          <Line 
            type="monotone" 
            dataKey="thisYear" 
            stroke="#1F2A44" 
            strokeWidth={2} 
            dot={false}
            strokeDasharray="none"
          />
          <Line 
            type="monotone" 
            dataKey="lastYear" 
            stroke="#4195BF" 
            strokeWidth={2} 
            dot={false}
            strokeDasharray="none"
          />
          <Area
            type="monotone"
            dataKey="thisYear"
            stroke="none"
            fill="url(#areaGradient)"
            fillOpacity={1}
            connectNulls={false}
          />
        </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
