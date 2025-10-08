"use client"

interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
}

export default function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div
        className={`relative w-11 h-6 rounded-full transition-colors ${checked ? "bg-blue-500" : "bg-gray-300"}`}
        onClick={() => onChange(!checked)}
      >
        <div
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </div>
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </label>
  )
}
