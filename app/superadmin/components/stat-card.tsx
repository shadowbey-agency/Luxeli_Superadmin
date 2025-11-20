import type { ReactNode } from "react"

interface StatCardProps {
  icon?: ReactNode // Made icon optional for cards without icons
  label: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  subtitle?: string
  changeLabel?: string // Added changeLabel for "vs last month" text
  showHeadingBorder?: boolean // Added prop for heading border
  isLoading?: boolean
}

export default function StatCard({
  icon,
  label,
  value,
  change,
  changeType = "neutral",
  subtitle,
  changeLabel,
  showHeadingBorder = false,
  isLoading = false,
}: StatCardProps) {
  const changeColor = {
    positive: "text-[#079455]", // Using specified green color for positive changes
    negative: "text-error",
    neutral: "text-muted-foreground",
  }[changeType]

  const getChangeBadgeStyle = () => {
    const baseStyle: Record<string, string> = {
      height: "20px",
      gap: "10px",
      paddingRight: "4px",
      paddingLeft: "4px",
      borderRadius: "2px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }

    // Set background color based on change type
    if (changeType === "positive") {
      baseStyle.backgroundColor = "#1EAB750D"
    } else if (changeType === "negative") {
      baseStyle.backgroundColor = "#FEF2F2" // bg-red-50 equivalent
    } else {
      baseStyle.backgroundColor = "#F9FAFB" // bg-gray-50 equivalent
    }

    return baseStyle
  }

  return (
    <div className="flex h:[144px] p-[19px_16px] flex-col justify-center items-start gap-2.5 flex-1 rounded-lg bg-white shadow-[0_12px_24px_0_rgba(18,38,63,0.03)]">
      {/* First row: Icon + Label */}
      <div 
        className="flex pb-3 items-center gap-3 self-stretch"
        style={showHeadingBorder ? { borderBottom: "1px solid #0000000F" } : {}}
      >
        {icon && <div className="flex items-center justify-center">{icon}</div>}
        <h3 className="text-sm font-medium" style={{ color: "#181D27" }}>{label}</h3>
      </div>

      {/* Second row: Value + Subtitle */}
      <div className="flex items-baseline gap-2 min-h-[36px]">
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" aria-label="loading" />
        ) : (
          <p className="text-[32px] font-bold text-[#212121] leading-none">{value}</p>
        )}
      </div>

      {/* Third row: Change percentage */}
      {change && (
        <div className="flex items-center gap-2">
          <span 
            className={`text-sm font-medium px-1 py-0.5 rounded ${changeColor}`}
            style={getChangeBadgeStyle()}
          >
            {change}
          </span>
          
          {subtitle && <span className="text-sm text-[#6B7280]">{subtitle}</span>}
          {changeLabel && <span className="text-sm text-[#6B7280]">{changeLabel}</span>}
        </div>
      )}
    </div>
  )
}
