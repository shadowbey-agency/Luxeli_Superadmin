"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CustomizedServicesPage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/partner/pages/customized-services/requests")
  }, [router])

  return null
}
