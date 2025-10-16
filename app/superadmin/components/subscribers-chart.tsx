"use client"

const data = [
  { month: "Jan", starter: 40, gold: 60 },
  { month: "Feb", starter: 45, gold: 55 },
  { month: "Mar", starter: 50, gold: 50 },
  { month: "Apr", starter: 35, gold: 45 },
  { month: "May", starter: 55, gold: 60 },
  { month: "Jun", starter: 60, gold: 70 },
  { month: "Jul", starter: 65, gold: 75 },
]

export default function SubscribersChart() {
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
        <h3 className="text-sm font-semibold text-[#212121]">Subscribers by plan</h3>
      </div>

      {/* Content */}
      <div 
        className="flex flex-col justify-between p-4 w-full"
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
        {/* Comparison Header */}
        <div className="flex flex-col  justify-between mt-4 flex-wrap gap-4">
          <p 
            style={{
              color: "#878787",
              fontSize: "13.693px",
              fontStyle: "normal",
              fontWeight: "500",
              lineHeight: "15.59px"
            }}
          >
            Comparison
          </p>
          
          {/* Legend */}
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            {/* Starter pack */}
            <div className="flex items-center gap-2">
              <svg width="13" height="14" viewBox="0 0 13 14" fill="none">
                <rect x="1.94922" y="2.14551" width="9.09426" height="9.09426" rx="2.59836" fill="#56C6FF"/>
              </svg>
              <span 
                style={{
                  color: "#080808",
                  fontSize: "12.693px",
                  fontStyle: "normal",
                  fontWeight: "600",
                  lineHeight: "11.693px"
                }}
              >
                Starter pack
              </span>
            </div>

            {/* Pack Gold */}
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect 
                  x="2.65683" 
                  y="2.4703" 
                  width="8.44467" 
                  height="8.44467" 
                  rx="2.27357" 
                  fill="#EEF9FF" 
                  stroke="#CBEDFF" 
                  strokeWidth="0.64959" 
                  strokeLinecap="square" 
                  strokeDasharray="0.32 2.92"
                />
              </svg>
              <span 
                style={{
                  color: "#080808",
                  fontSize: "12.693px",
                  fontStyle: "normal",
                  fontWeight: "600",
                  lineHeight: "11.693px"
                }}
              >
                Pack Gold
              </span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div 
          className="flex items-end  flex-end w-full"
          style={{
            height: "109.131px",
            marginBottom: "20px",
            gap: "4px"
          }}
        >
          {data.map((item, index) => {
            const maxValue = Math.max(...data.map(d => d.starter + d.gold))
            const starterHeight = (item.starter / maxValue) * 100
            const goldHeight = (item.gold / maxValue) * 100
            const totalHeight = starterHeight + goldHeight

            return (
              <div key={index} className="flex flex-col items-center gap-2 flex-1">
                {/* Bar */}
                <div className="relative w-full max-w-[24px]" style={{ height: "100px" }}>
                  {/* Pack Gold (top) */}
                  <div
                    className="w-full"
                    style={{
                      position: "absolute",
                      bottom: `${starterHeight}%`,
                      height: `${goldHeight}%`,
                      background: "#EEF9FF",
                      border: "0.64959px dashed #CBEDFF",
                      borderRadius: "4.87193px 4.87193px 0 0",
                      minHeight: "2px"
                    }}
                  />
                  
                  {/* Starter pack (bottom) */}
                  <div
                    className="w-full"
                    style={{
                      position: "absolute",
                      bottom: "0",
                    
                      height: `${starterHeight +5}%`,
                      background: "#56C6FF",
                      borderRadius: "5.19672px",
                      minHeight: "2px"
                    }}
                  />
                </div>

                {/* Month Label */}
                <div 
                  className="flex items-center justify-center"
                  style={{
                    padding: "5.197px 2.598px",
                    gap: "2.598px",
                    flex: "1 0 0"
                  }}
                >
                  <span 
                    style={{
                      color: "#878787",
                      fontSize: "10.393px",
                      fontStyle: "normal",
                      fontWeight: "500",
                      lineHeight: "10.393px",
                      textAlign: "center"
                    }}
                  >
                    {item.month}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
