interface PriorityBadgeProps {
  priority: "low" | "medium" | "urgent"
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const styles = {
    low: "bg-blue-100 text-blue-700 ",
    medium: "bg-orange-100 text-orange-700",
    urgent: "bg-red-100 text-red-700",
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium border border-borde ${styles[priority]}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  )
}
