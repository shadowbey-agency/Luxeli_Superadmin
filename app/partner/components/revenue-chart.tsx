"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from "recharts"

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
    <div className="flex flex-col w-full">
      {/* Header */}
      <div 
        className="flex items-center px-4 w-full"
        style={{
          height: "64px",
          flexShrink: 0,
          fill: "#FCFCFC",
          strokeWidth: "1px",
          stroke: "#E9EAEB",
          background: "#FCFCFC",
          border: "1px solid #E9EAEB",
          borderRadius: "12px 12px 0 0"
        }}
      >
        <h3 className="text-sm font-semibold text-[#212121]">Revenue — This year vs last year</h3>
      </div>

      {/* Content */}
      <div 
        className="flex flex-col p-4 w-full"
        style={{
          height: "350px",
          flexShrink: 0,
          fill: "#FFF",
          strokeWidth: "1px",
          stroke: "#E9EAEB",
          background: "#FFF",
          border: "1px solid #E9EAEB",
          borderRadius: "14px",
          marginTop: "-15px"
        }}
      >
        {/* Legend */}
        <div className="flex items-center justify-end mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#1F2A44]"></div>
              <span className="text-sm text-muted-foreground">This year (2025)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#4195BF]"></div>
              <span className="text-sm text-muted-foreground">Last year (2024)</span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="0" stroke="#E5E7EB" horizontal={true} vertical={false} />
          <XAxis 
            dataKey="month" 
            stroke="#535862" 
            fontSize={12}
            tick={{ fill: '#535862', fontSize: '12px', fontFamily: 'Fustat', fontWeight: '500', lineHeight: '18px' }}
            label={{ value: 'Month', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fontSize: '12px', fill: '#535862', fontFamily: 'Fustat', fontWeight: '500', lineHeight: '18px' } }}
          />
          <YAxis 
            stroke="#535862" 
            fontSize={12} 
            domain={[0, 1000]}
            ticks={[0, 200, 400, 600, 800, 1000]}
            tick={{ fill: '#535862', fontSize: '12px', fontFamily: 'Fustat', fontWeight: '500', lineHeight: '18px' }}
            label={{ value: 'Amount', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '12px', fill: '#535862', fontFamily: 'Fustat', fontWeight: '500', lineHeight: '18px' } }}
          />
          <Tooltip />
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1F2A44" stopOpacity={0.3}/>
              <stop offset="100%" stopColor="#4195BF" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="thisYear"
            stroke="none"
            fill="url(#areaGradient)"
            fillOpacity={0.3}
          />
          <Line 
            type="monotone" 
            dataKey="thisYear" 
            stroke="#1F2A44" 
            strokeWidth={0.5} 
            dot={false}
            strokeDasharray="none"
          />
          <Line 
            type="monotone" 
            dataKey="lastYear" 
            stroke="#4195BF" 
            strokeWidth={0.5} 
            dot={false}
            strokeDasharray="none"
          />
        </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
