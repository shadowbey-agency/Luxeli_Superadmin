"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LaundryPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to requests page by default
    router.push('/partner/pages/laundry/requests')
  }, [router])

  return null
}

