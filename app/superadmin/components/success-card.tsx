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
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5">
      <div
        className="flex items-center gap-3"
        style={{
          display: "inline-flex",
          padding: "10px 15px 10px 10px",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          borderRadius: "10px 0 0 10px",
          borderTop: "1px solid #13B601",
          borderBottom: "1px solid #13B601",
          borderLeft: "1px solid #13B601",
          background: "#F3FFEA"
        }}
      >
        {/* Success Message Row */}
        <div
          className="flex items-center gap-3"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}
        >
          {/* Success Check Icon */}
          <div
            style={{
              width: "20px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" fill="#13B601" />
              <path
                d="M6 10L9 13L14 7"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-800">{mainMessage}</span>
        </div>

        {/* Secondary Message Row (for name/ticket ID with profile image) */}
        {secondaryMessage && (
          <div
            className="flex items-center gap-3"
            style={{
              display: "flex",
              padding: "10px 13px",
              alignItems: "center",
              gap: "10px",
              alignSelf: "stretch",
              borderRadius: "10px",
              background: "#0B0F18"
            }}
          >
            {/* Profile Image */}
            {profileImage && (
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  background: "#56C6FF",
                  flexShrink: 0,
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#0B0F18"
                }}
              >
                {profileImage.startsWith('http') || profileImage.startsWith('/') ? (
                  <Image
                    src={profileImage}
                    alt="Profile"
                    width={24}
                    height={24}
                    style={{
                      borderRadius: "50%",
                      objectFit: "cover"
                    }}
                  />
                ) : (
                  profileImage
                )}
              </div>
            )}
            <span className="text-sm font-medium text-white">
              {secondaryMessage}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

