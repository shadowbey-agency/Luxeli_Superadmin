"use client"

interface SimpleToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

export default function SimpleToggleSwitch({ checked, onChange }: SimpleToggleSwitchProps) {
  return (
    <div
      className="relative w-11 h-6 rounded-full transition-colors cursor-pointer"
      style={{
        backgroundColor: checked ? "#1F2A44" : "#E5E7EB"
      }}
      onClick={() => onChange(!checked)}
    >
      <div
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform"
        style={{
          transform: checked ? "translateX(24px)" : "translateX(4px)"
        }}
      />
    </div>
  )
}


