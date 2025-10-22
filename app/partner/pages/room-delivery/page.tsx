"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function RoomDeliveryPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to requests page by default
    router.push("/partner/pages/room-delivery/requests")
  }, [router])

  return null
}
