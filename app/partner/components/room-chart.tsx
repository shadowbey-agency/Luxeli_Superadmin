"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { getAuthToken } from "@/lib/auth-utils"

interface RoomStatsData {
  day: string
  empty: number
  full: number
}

interface RoomChartProps {
  period?: "week" | "month" | "day"
}

export default function RoomChart({ period = "day" }: RoomChartProps) {
  const [data, setData] = useState<RoomStatsData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRoomStats()
  }, [period])

  const fetchRoomStats = async () => {
    try {
      setIsLoading(true)
      const token = getAuthToken()
      if (!token) {
        console.error('No auth token found')
        setIsLoading(false)
        return
      }

      // Fetch stats from API with period parameter
      const queryParams = new URLSearchParams({
        period: period
      })
      const response = await fetch(`/api/partner/rooms/daily-stats?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          // Map API response to chart data format
          const chartData: RoomStatsData[] = result.data.map((item: any) => ({
            day: item.label || item.day || item.week || item.month,
            empty: item.empty,
            full: item.full
          }))
          setData(chartData)
        }
      } else {
        console.error('Failed to fetch room stats')
      }
    } catch (error) {
      console.error('Error fetching room stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate max value for Y-axis
  const maxValue = Math.max(
    ...data.flatMap(d => [d.empty, d.full]),
    10 // Minimum of 10
  )
  const yAxisMax = Math.ceil(maxValue / 10) * 10 // Round up to nearest 10
  return (
    <div className="flex flex-col w-full">
      <style jsx>{`
        .recharts-text {
          fill: #535862 !important;
        }
        .recharts-cartesian-axis-tick-value {
          fill: #535862 !important;
        }
        .recharts-cartesian-axis-tick {
          fill: #535862 !important;
        }
        .recharts-label {
          fill: #535862 !important;
        }
      `}</style>
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

        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Loading room data...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No room data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" style={{ outline: 'none' }}>
            <LineChart 
              data={data} 
              style={{ fontFamily: 'inherit' }}
              className="[&_.recharts-text]:!fill-[#535862] [&_.recharts-cartesian-axis-tick-value]:!fill-[#535862] [&_.recharts-cartesian-axis-tick]:!fill-[#535862] [&_.recharts-label]:!fill-[#535862]"
            >
          <CartesianGrid strokeDasharray="0" stroke="#E5E7EB" horizontal={true} vertical={false} />
          <XAxis 
            dataKey="day" 
            stroke="transparent" 
            fontSize={12}
            tick={{ 
              fill: '#535862', 
              fontSize: '12px', 
              fontWeight: '500',
              fontFamily: 'inherit'
            }}
            label={{ 
              value: period === 'month' ? 'Months' : 'Days', 
              position: 'insideBottom', 
              offset: -5, 
              style: {  
                fontSize: '12px', 
                fill: '#535862', 
                fontWeight: '500',
                fontFamily: 'inherit'
              } 
            }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            stroke="transparent" 
            fontSize={12} 
            domain={[0, yAxisMax || 10]}
            tick={{ 
              fill: '#535862', 
              fontSize: '12px', 
              fontWeight: '500',
              fontFamily: 'inherit'
            }}
            label={{ 
              value: 'Quantity', 
              angle: -90, 
              position: 'insideLeft', 
              style: { 
                textAnchor: 'middle', 
                fontSize: '12px', 
                fill: '#535862', 
                fontWeight: '500',
                fontFamily: 'inherit'
              } 
            }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-medium text-gray-800 mb-2">{label}</p>
                    {payload.map((entry, index) => (
                      <p key={index} className="text-sm text-gray-600">
                        <span style={{ color: entry.color }}>●</span> {entry.dataKey === 'empty' ? 'Empty Room' : 'Full Room'}: {entry.value}
                      </p>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Line 
            type="monotone" 
            dataKey="empty" 
            stroke="#4195BF" 
            strokeWidth={2} 
            dot={false}
            strokeDasharray="none"
          />
          <Line 
            type="monotone" 
            dataKey="full" 
            stroke="#1F2A44" 
            strokeWidth={2} 
            dot={false}
            strokeDasharray="none"
          />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
