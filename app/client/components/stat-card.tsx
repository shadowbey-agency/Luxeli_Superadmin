import type { ReactNode } from "react"

interface StatCardProps {
  icon?: ReactNode // Made icon optional for cards without icons
  label: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  subtitle?: string
  changeLabel?: string // Added changeLabel for "vs last month" text
}

export default function StatCard({
  icon,
  label,
  value,
  change,
  changeType = "neutral",
  subtitle,
  changeLabel,
}: StatCardProps) {
  const changeColor = {
    positive: "text-[#10B981]", // Using green color for positive changes
    negative: "text-error",
    neutral: "text-muted-foreground",
  }[changeType]

  return (
    <div className="flex h:[144px] p-[19px_16px] flex-col justify-center items-start gap-2.5 flex-1 rounded-lg bg-white shadow-[0_12px_24px_0_rgba(18,38,63,0.03)]">
      {/* First row: Icon + Label */}
      <div className="flex pb-3 items-center gap-3 self-stretch">
        {icon && <div className="flex items-center justify-center">{icon}</div>}
        <h3 className="text-sm font-medium text-[#6B7280]">{label}</h3>
      </div>

      {/* Second row: Value + Subtitle */}
      <div className="flex items-baseline gap-2">
        <p className="text-[32px] font-bold text-[#212121] leading-none">{value}</p>
      </div>

      {/* Third row: Change percentage */}
      {change && (
        <div className="flex items-center gap-1">
          <span className={`text-sm font-medium ${changeColor}`}>{change}</span>
          {subtitle && <span className="text-sm text-[#6B7280]">{subtitle}</span>}
          {changeLabel && <span className="text-sm text-[#6B7280]">{changeLabel}</span>}
        </div>
      )}
    </div>
  )
}
