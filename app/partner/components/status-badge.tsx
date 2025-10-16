interface StatusBadgeProps {
  status: "open" | "reopened" | "pending" | "resolved" | "canceled"
  label?: string
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const styles = {
    open: "bg-blue-100 text-blue-700 border-blue-200",
    reopened: "bg-purple-100 text-purple-700 border-purple-200",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    resolved: "bg-green-100 text-green-700 border-green-200",
    canceled: "bg-red-100 text-red-700 border-red-200",
  }

  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1)

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium border border-borde ${styles[status]}`}>
      {displayLabel}
    </span>
  )
}
