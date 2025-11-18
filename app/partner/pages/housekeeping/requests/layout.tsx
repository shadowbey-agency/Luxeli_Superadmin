"use client"

import ProtectedRoute from "@/app/partner/components/ProtectedRoute"

/**
 * Layout wrapper for housekeeping requests page
 * Ensures only users with housekeeping.requests permission can access
 */
export default function HousekeepingRequestsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute requiredRoute="/partner/pages/housekeeping/requests">
      {children}
    </ProtectedRoute>
  )
}

