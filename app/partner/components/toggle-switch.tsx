"use client"

interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
}

export default function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  return (
    <div className="flex items-center gap-2">
      <span style={{
        color: "#525866",
        fontSize: "12px",
        fontWeight: "400",
        lineHeight: "19.5px"
      }}>
        Active
      </span>
      <div
        className="relative w-11 h-6 rounded-full transition-colors cursor-pointer"
        style={{
          backgroundColor: checked ? "#50BE87" : "#FF0D0D"
        }}
        onClick={() => onChange(!checked)}
      >
        <div
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform"
          style={{
            transform: checked ? "translateX(4px)" : "translateX(24px)"
          }}
        />
      </div>
      <span style={{
        color: "#525866",
        fontSize: "12px",
        fontWeight: "400",
        lineHeight: "19.5px"
      }}>
        Disable
      </span>
    </div>
  )
}
