"use client"

import { useState } from "react"
import { RiCloseLine } from "react-icons/ri"

interface AddPaymentMethodModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddPaymentMethodModal({ isOpen, onClose }: AddPaymentMethodModalProps) {
  const [name, setName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expDate, setExpDate] = useState("")
  const [cvv, setCvv] = useState("")

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "") // Remove non-digits
    if (value.length <= 16) {
      // Format as XXXX XXXX XXXX XXXX
      const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ")
      setCardNumber(formatted)
    }
  }

  const handleExpDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "") // Remove non-digits
    if (value.length <= 4) {
      // Format as MM/YY
      const formatted = value.replace(/(\d{2})(?=\d)/g, "$1/")
      setExpDate(formatted)
    }
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "") // Remove non-digits
    if (value.length <= 3) {
      setCvv(value)
    }
  }

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving payment method:", { name, cardNumber, expDate, cvv })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0, 0, 0, 0.4)" }}>
      <div 
        className="bg-white shadow-lg"
        style={{
          width: "600px",
          height: "350px",
          top: "345.51px",
          left: "445px",
          borderRadius: "10px",
          boxShadow: "0px 10px 10px 0px #0000001A",
          overflow: "hidden"
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{
            background: "#FBFAFA",
            borderBottom: "1px solid #21212114"
          }}
        >
          <h2 className="text-lg font-semibold text-gray-900">Add Payment Method</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <RiCloseLine className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 pt-4">
          {/* Name Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Write Here..."
              className="w-full border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{
                width: "560px",
                height: "40px",
                borderRadius: "4px",
                padding: "7.52px 12px",
                background: "#FFFFFF",
                border: "1px solid #CED4DA"
              }}
            />
          </div>

          {/* Card Number, Exp, and CVV Row */}
          <div className="flex gap-4 mb-4">
            {/* Card Number */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card number
              </label>
              <div className="relative">
                <div 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{
                    width: "18px",
                    height: "12px"
                  }}
                >
                  {/* Dollar Sign Icon */}
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{ color: "#797979" }}>
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                  </svg>
                </div>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9876 5432"
                  className="w-full border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{
                    width: "250px",
                    height: "40px",
                    borderRadius: "4px",
                    padding: "7.52px 12px 7.52px 40px",
                    background: "#FFFFFF",
                    border: "1px solid #CED4DA"
                  }}
                  maxLength={19} // 16 digits + 3 spaces
                />
              </div>
            </div>

            {/* Exp Date */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exp
              </label>
              <input
                type="text"
                value={expDate}
                onChange={handleExpDateChange}
                placeholder="07 / 29"
                className="w-full border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{
                  height: "40px",
                  borderRadius: "4px",
                  padding: "7.52px 12px",
                  background: "#FFFFFF",
                  border: "1px solid #CED4DA"
                }}
                maxLength={5} // MM/YY
              />
            </div>

            {/* CVV */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV
              </label>
              <input
                type="text"
                value={cvv}
                onChange={handleCvvChange}
                placeholder="***"
                className="w-full border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{
                  height: "40px",
                  borderRadius: "4px",
                  padding: "7.52px 12px",
                  background: "#FFFFFF",
                  border: "1px solid #CED4DA"
                }}
                maxLength={3}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div 
          className="flex items-center justify-center px-6 py-4"
          style={{
            background: "#FBFAFA",
            borderTop: "1px solid #21212114"
          }}
        >
          <button
            onClick={handleSave}
            className="text-white transition-colors"
            style={{
              width: "560px",
              height: "42px",
              borderRadius: "6px",
              padding: "8.52px 10px",
              background: "#1F2A44"
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
