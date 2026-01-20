"use client"

import { useEffect } from "react"
import Image from "next/image"

interface SuccessCardProps {
  isOpen: boolean
  message: string
  onClose: () => void
  autoCloseDelay?: number // in milliseconds, default 5000
  profileImage?: string // Optional profile image URL or initials
}

export default function SuccessCard({
  isOpen,
  message,
  onClose,
  autoCloseDelay = 5000,
  profileImage
}: SuccessCardProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose()
      }, autoCloseDelay)
      return () => clearTimeout(timer)
    }
  }, [isOpen, autoCloseDelay, onClose])

  if (!isOpen) return null

  // Split message by newline to support multi-line messages
  const messageParts = message.split('\n')
  const mainMessage = messageParts[0]
  const secondaryMessage = messageParts.length > 1 ? messageParts.slice(1).join('\n') : null

  return (
    <div className="animate-in slide-in-from-bottom-5" style={{ position: 'relative' }}>
      <div
        className="flex flex-col items-start gap-3"
        style={{
          padding: "10px 15px 10px 10px",
          borderRadius: "10px 0 0 10px",
          borderTop: "1px solid #13B601",
          borderBottom: "1px solid #13B601",
          borderLeft: "1px solid #13B601",
          background: "#F3FFEA",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          minWidth: "300px"
        }}
      >
      {/* Success Message Row */}
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className="w-5 h-5 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" fill="#13B601" />
            <path d="M6 10L9 13L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="text-sm font-medium text-gray-800">{mainMessage}</span>
      </div>

      {/* Secondary Message Row */}
      {secondaryMessage && (
        <div className="flex items-center gap-3 p-[10px_13px] rounded bg-[#0B0F18] w-full">
          {profileImage && (
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[#56C6FF] flex-shrink-0 text-[12px] font-semibold text-[#0B0F18]">
              {profileImage.startsWith('http') || profileImage.startsWith('/') ? (
                <Image src={profileImage} alt="Profile" width={24} height={24} style={{ borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                profileImage
              )}
            </div>
          )}
          <span className="text-sm font-medium text-white">{secondaryMessage}</span>
        </div>
      )}
    </div>
    </div>
  )
}

