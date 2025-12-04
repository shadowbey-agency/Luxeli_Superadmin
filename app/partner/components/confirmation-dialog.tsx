"use client"

interface ConfirmationDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: "danger" | "warning" | "info"
}

export default function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "info"
}: ConfirmationDialogProps) {
  if (!isOpen) return null

  const getConfirmButtonStyle = () => {
    switch (variant) {
      case "danger":
        return {
          background: "#EB1D1D",
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
          <h2 
            className="text-black font-bold text-xl leading-normal"
            style={{
              fontSize: "20px",
              fontWeight: 700
            }}
          >
            {title}
          </h2>
          <button
            onClick={onCancel}
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
          <div className="flex gap-[16px] flex-end">
            <button
              onClick={onCancel}
              className="flex flex-col justify-center items-center px-2.5 py-2 rounded-md text-center font-medium text-sm leading-5 transition-colors"
              style={{
                padding: "8.52px 10px",
                borderRadius: "6px",
                background: "#FBFAFA",
                color: "#000",
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: "19.5px"
              }}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="flex flex-col justify-center items-center px-2.5 py-2 rounded-md text-center font-medium text-sm leading-5 transition-colors"
              style={{
                padding: "8.52px 10px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: "19.5px",
                ...getConfirmButtonStyle()
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

