"use client"

import { useEffect } from "react"
import Image from "next/image"

interface ErrorCardProps {
  isOpen: boolean
  message: string
  onClose: () => void
  autoCloseDelay?: number // in milliseconds, default 5000
}

export default function ErrorCard({
  isOpen,
  message,
  onClose,
  autoCloseDelay = 5000
}: ErrorCardProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose()
      }, autoCloseDelay)
      return () => clearTimeout(timer)
    }
  }, [isOpen, autoCloseDelay, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed bottom-6 z-50 animate-in slide-in-from-bottom-5" style={{ right: 0, left: 'auto' }}>
      <div
        className="flex items-center gap-3"
        style={{
          display: "flex",
          padding: "10px 15px 10px 10px",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "10px",
          borderRadius: "10px 0 0 10px",
          borderTop: "1px solid #EF4444",
          borderBottom: "1px solid #EF4444",
          borderLeft: "1px solid #EF4444",
          background: "#FEF2F2"
        }}
      >
        {/* Error Message Row */}
        <div
          className="flex items-center gap-3"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}
        >
          {/* Error Icon */}
          <div
            style={{
              width: "20px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <Image
              src="/assets/icons/cross check.svg"
              alt="Error"
              width={20}
              height={20}
            />
          </div>
          <span className="text-sm font-medium text-gray-800">{message}</span>
        </div>
      </div>
    </div>
  )
}


