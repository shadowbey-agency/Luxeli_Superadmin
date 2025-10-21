"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function BookingPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to requests page by default
    router.push("/partner/pages/booking/requests")
  }, [router])

  return null
}

