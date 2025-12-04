"use client"

import { useEffect } from "react"

interface AlertDialogProps {
  isOpen: boolean
  title: string
  message: string
  buttonText?: string
  onClose: () => void
  variant?: "success" | "error" | "warning" | "info"
}

export default function AlertDialog({
  isOpen,
  title,
  message,
  buttonText = "OK",
  onClose,
  variant = "info"
}: AlertDialogProps) {
  useEffect(() => {
    if (isOpen) {
      // Auto-close after 5 seconds for success messages
      if (variant === "success") {
        const timer = setTimeout(() => {
          onClose()
        }, 5000)
        return () => clearTimeout(timer)
      }
    }
  }, [isOpen, variant, onClose])

  if (!isOpen) return null

  const getIcon = () => {
    switch (variant) {
      case "success":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#10B981" }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      case "error":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#EF4444" }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      case "warning":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#F59E0B" }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#3B82F6" }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  const getButtonStyle = () => {
    switch (variant) {
      case "success":
        return {
          background: "#10B981",
          color: "#FFF"
        }
      case "error":
        return {
          background: "#EF4444",
          color: "#FFF"
        }
      case "warning":
        return {
          background: "#F59E0B",
          color: "#FFF"
        }
      default:
        return {
          background: "#1F2A44",
          color: "#FFF"
        }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-80 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
      <div 
        className="bg-white rounded-[10px] mx-4"
        style={{
          width: "509px",
          maxWidth: "90vw"
        }}
      >
        {/* Header */}
        <div 
          className="flex justify-between items-center px-4 py-5 rounded-t-[10px] border-b border-black/4"
          style={{
            borderBottom: "1px solid rgba(0, 0, 0, 0.04)",
            background: "#FFF"
          }}
        >
          <div className="flex items-center gap-3">
            {getIcon()}
            <h2 
              className="text-black font-bold text-xl leading-normal"
              style={{
                fontSize: "20px",
                fontWeight: 700
              }}
            >
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div 
          className="px-4 py-5 border-b border-black/6"
          style={{
            borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
            background: "#FFF"
          }}
        >
          <p 
            className="text-gray-600 text-lg leading-normal"
            style={{
              color: "#525866",
              fontSize: "18px",
              fontWeight: 400
            }}
          >
            {message}
          </p>
        </div>

        {/* Footer */}
        <div 
          className="flex justify-end items-center gap-18 px-4 py-5 rounded-b-[10px] border-t border-black/4"
          style={{
            borderTop: "1px solid rgba(0, 0, 0, 0.04)",
            background: "#FFF",
            gap: "10px"
          }}
        >
          <button
            onClick={onClose}
            className="flex flex-col justify-center items-center px-2.5 py-2 rounded-md text-center font-medium text-sm leading-5 transition-colors"
            style={{
              padding: "8.52px 20px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: "19.5px",
              ...getButtonStyle()
            }}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  )
}

