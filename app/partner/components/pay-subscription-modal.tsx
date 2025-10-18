"use client"

import { useState } from "react"
import { RiCloseLine, RiLockLine } from "react-icons/ri"

interface PaySubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PaySubscriptionModal({ isOpen, onClose }: PaySubscriptionModalProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("visa8806")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0, 0, 0, 0.4)" }}>
      <div className="bg-white shadow-lg w-full max-w-lg mx-4 overflow-hidden" style={{ borderRadius: "10px" }}>
        {/* Header */}
        <div className="flex items-center justify-between py-4 px-6 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Pay Subscription</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <RiCloseLine className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Subscription Details Card */}
          <div 
            className="w-full h-20 p-5 flex items-center justify-between"
            style={{
              borderRadius: "10px",
              background: "linear-gradient(90deg, #141B34 0%, #17668E 100%)",
              boxShadow: "0px 4px 10px 0px #0000001A"
            }}
          >
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Pack Gold</h3>
              <p className="text-sm text-white opacity-80">Jan 15,10:30 AM - Jan 15,10:30 AM</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">$19</span>
              <span className="text-sm text-white opacity-80">/month</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            {/* Payment Method 1 */}
            <div 
              className={`w-full flex items-center justify-between cursor-pointer p-4 transition-all ${
                selectedPaymentMethod === "visa8806" 
                  ? "bg-blue-50 border-2 border-blue-400" 
                  : "bg-white border border-gray-300 hover:border-gray-400"
              }`}
              style={{ borderRadius: "10px" }}
              onClick={() => setSelectedPaymentMethod("visa8806")}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="flex items-center justify-center rounded w-16 h-11"
                  style={{
                    background: "linear-gradient(45deg, #141B34 0%, #3C56B3 100%)",
                    boxShadow: "0.92px 1.15px 1.84px 0px #0000000D"
                  }}
                >
                  <span className="text-white font-bold text-sm">VISA</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Visa ending 8806</p>
                  <p className="text-sm text-gray-600">Expires 03/27</p>
                </div>
              </div>
              <input
                type="radio"
                name="paymentMethod"
                value="visa8806"
                checked={selectedPaymentMethod === "visa8806"}
                onChange={() => setSelectedPaymentMethod("visa8806")}
                className="w-4 h-4 text-blue-600"
              />
            </div>

            {/* Payment Method 2 */}
            <div 
              className={`w-full flex items-center justify-between cursor-pointer p-4 transition-all ${
                selectedPaymentMethod === "visa6652" 
                  ? "bg-blue-50 border-2 border-blue-400" 
                  : "bg-white border border-gray-300 hover:border-gray-400"
              }`}
              style={{ borderRadius: "10px" }}
              onClick={() => setSelectedPaymentMethod("visa6652")}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="flex items-center justify-center rounded w-16 h-11"
                  style={{
                    background: "linear-gradient(45deg, #141B34 0%, #3C56B3 100%)",
                    boxShadow: "0.92px 1.15px 1.84px 0px #0000000D"
                  }}
                >
                  <span className="text-white font-bold text-sm">VISA</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Visa ending 6652</p>
                  <p className="text-sm text-gray-600">Expires 03/27</p>
                </div>
              </div>
              <input
                type="radio"
                name="paymentMethod"
                value="visa6652"
                checked={selectedPaymentMethod === "visa6652"}
                onChange={() => setSelectedPaymentMethod("visa6652")}
                className="w-4 h-4 text-blue-600"
              />
            </div>

            {/* Pay with no saved card */}
            <div 
              className={`w-full flex items-center justify-between cursor-pointer p-4 transition-all ${
                selectedPaymentMethod === "new" 
                  ? "bg-blue-50 border-2 border-blue-400" 
                  : "bg-white border border-gray-300 hover:border-gray-400"
              }`}
              style={{ borderRadius: "10px" }}
              onClick={() => setSelectedPaymentMethod("new")}
            >
              <div className="flex items-center gap-4">
                <p className="font-medium text-gray-900">Pay with no saved card</p>
              </div>
              <input
                type="radio"
                name="paymentMethod"
                value="new"
                checked={selectedPaymentMethod === "new"}
                onChange={() => setSelectedPaymentMethod("new")}
                className="w-4 h-4 text-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center p-6 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full text-white font-medium py-3 mb-3 bg-gray-800 hover:bg-gray-900 transition-colors"
            style={{ borderRadius: "10px" }}
          >
            Pay Subscription
          </button>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <RiLockLine className="w-4 h-4 text-orange-500" />
            <span>Secure payment checkout</span>
          </div>
        </div>
      </div>
    </div>
  )
}