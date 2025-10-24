"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { FiEye, FiEyeOff } from "react-icons/fi"
import { FiArrowLeft } from "react-icons/fi"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleGetVerificationCode = () => {
    if (email) {
      setStep(2)
    }
  }

  const handleVerify = () => {
    if (otp.every(digit => digit !== "")) {
      setStep(3)
    }
  }

  const handleResetPassword = () => {
    if (newPassword && confirmPassword && newPassword === confirmPassword) {
      setStep(4)
    }
  }

  const handleContinueToLogin = () => {
    router.push("/login")
  }

  return (
    <div className="h-screen w-screen bg-white relative overflow-hidden flex flex-col justify-center items-center">
      {/* Main Content Area - Centered with 100px spacing */}
      <div className="flex flex-col items-center justify-center relative w-full h-full" style={{ paddingTop: "120px", paddingBottom: "120px" }}>
        {/* Left Border - Centered Vertically with Gradient */}
        <div 
          className="absolute z-0"
          style={{
            width: "1px",
            height: "calc(100vh - 175px)",
            top: "90px",
            left: "calc(50% - 366px)",
            background: `linear-gradient(to top, 
              rgba(86, 198, 255, 0.1) 0%, 
              rgba(86, 198, 255, 0.2) 5%, 
              rgba(86, 198, 255, 0.3) 10%, 
              rgba(86, 198, 255, 0.4) 20%, 
              rgba(86, 198, 255, 0.6) 35%, 
              rgba(86, 198, 255, 0.7) 75%,
              rgba(86, 198, 255, 0.6) 85%,
              rgba(86, 198, 255, 0.4) 95%,
              rgba(86, 198, 255, 0.1) 99%,
              rgba(86, 198, 255, 0.8) 100%)`
          }}
        />

        {/* Right Border - Centered Vertically with Gradient */}
        <div 
          className="absolute z-0"
          style={{
            width: "1px",
            height: "calc(100vh - 175px)",
            top: "90px",
            right: "calc(50% - 366px)",
            background: `linear-gradient(to bottom, 
              rgba(86, 198, 255, 0.1) 0%, 
              rgba(86, 198, 255, 0.2) 5%, 
              rgba(86, 198, 255, 0.3) 10%, 
              rgba(86, 198, 255, 0.4) 20%, 
              rgba(86, 198, 255, 0.6) 35%, 
              rgba(86, 198, 255, 0.7) 75%,
              rgba(86, 198, 255, 0.6) 85%,
              rgba(86, 198, 255, 0.4) 95%,
              rgba(86, 198, 255, 0.1) 99%,
              rgba(86, 198, 255, 0.8) 100%)`
          }}
        />

        {/* Top Center Border - Above Content */}
        <div 
          className="relative z-10"
          style={{ 
            width: "100%",
            height: "1px",
            border: "1px solid #FAFAFA",
            backgroundColor: "#FAFAFA"
          }}
        />
        
        {/* Logo - Centered */}
        <div className="flex items-center justify-center mb-[40px] mt-[50px]">
          <Image
            src="/assets/icons/lexelisidebarlogo.svg"
            alt="Luxeli Logo"
            width={120}
            height={32}
            className="w-auto h-8"
          />
        </div>
        
        {/* Content Card */}
        <div 
          className="w-full max-w-[392px]  flex flex-col justify-center items-center"
          style={{
           
            gap: "10px"
          }}
        >
          {step === 1 && (
            <>
              {/* Step 1: Forgot Password */}
              <div 
                className="flex flex-col items-center"
                style={{
                  paddingBottom: "10px",
                  gap: "10px"
                }}
              >
                {/* Lock Icon */}
                <div 
                  className="flex items-center justify-center rounded-full mb-3"
                  style={{
                    width: "50px",
                    height: "50px"
                  }}
                >
                  <Image
                    src="/assets/icons/passwordlock.svg"
                    alt="Password Lock"
                    width={40}
                    height={40}
                    className="w-10 h-10"
                  />
                </div>

                {/* Heading */}
                <h1 
                  className="text-center"
                  style={{
                    fontWeight: "700",
                    fontSize: "20px",
                    lineHeight: "28px",
                    color: "#0A0A0A"
                  }}
                >
                  Forgot your password?
                </h1>

                {/* Description */}
                <p 
                  className="text-center mb-3"
                  style={{
                    fontWeight: "400",
                    fontSize: "14px",
                    lineHeight: "22px",
                    color: "#717182"
                  }}
                >
                  Enter your email to get a verification code
                </p>
              </div>

              {/* Email Input */}
              <div className="flex flex-col gap-2 w-full mb-3">
                <label className="text-[#212121] text-sm font-medium">
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Write Here.."
                  className="w-full  py-2 border border-[#CED4DA] bg-white rounded"
                  style={{
                    padding: "7.52px 12px"
                  }}
                />
              </div>

              {/* Get Verification Code Button */}
              <button
                onClick={handleGetVerificationCode}
                className="w-full py-2 bg-[#1F2A44] text-white rounded-md hover:bg-[#2a3a5a] transition-colors"
                style={{
                  padding: "8.52px 20px",
                  borderRadius: "6px"
                }}
              >
                Get verification code
              </button>

              {/* Back to Login */}
              <div className="flex items-center justify-center mt-4">
                <button
                  onClick={() => router.push("/login")}
                  className="flex items-center gap-1 text-[#717182] text-sm hover:text-[#1F2A44] transition-colors"
                >
                  <FiArrowLeft className="w-4 h-4" />
                  Back to login
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              {/* Step 2: Verify Email */}
              <div 
                className="flex flex-col items-center mb-6"
                style={{
                  paddingBottom: "10px",
                  gap: "10px"
                }}
              >
                {/* Mail Icon */}
                <div 
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: "50px",
                    height: "50px"
                  }}
                >
                  <Image
                    src="/assets/icons/passwordverifymail.svg"
                    alt="Verify Mail"
                    width={40}
                    height={40}
                    className="w-10 h-10"
                  />
                </div>

                {/* Heading */}
                <h1 
                  className="text-center"
                  style={{
                    fontWeight: "700",
                    fontSize: "20px",
                    lineHeight: "28px",
                    color: "#0A0A0A"
                  }}
                >
                  Verify your email
                </h1>

                {/* Description */}
                <p 
                  className="text-center"
                  style={{
                    fontWeight: "400",
                    fontSize: "14px",
                    lineHeight: "22px",
                    color: "#717182"
                  }}
                >
                  Enter the verification code we sent you.
                </p>
              </div>

              {/* OTP Input Boxes */}
              <div className="flex gap-2 justify-center mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="text-center border rounded"
                    style={{
                      width: "57px",
                      height: "55px",
                      padding: "12px 13px",
                      borderWidth: "1px",
                      borderRadius: "6.75px",
                      background: "#FBFAFA",
                      borderColor: "#E6E6E6",
                      fontSize: "18px",
                      fontWeight: "600"
                    }}
                    maxLength={1}
                  />
                ))}
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerify}
                className="w-full py-2 bg-[#1F2A44] text-white rounded-md hover:bg-[#2a3a5a] transition-colors mb-4"
                style={{
                  padding: "8.52px 20px",
                  borderRadius: "6px"
                }}
              >
                Verify
              </button>

              {/* Back to Login */}
              <div className="flex items-center justify-center">
                <button
                  onClick={() => router.push("/login")}
                  className="flex items-center gap-1 text-[#717182] text-sm hover:text-[#1F2A44] transition-colors"
                >
                  <FiArrowLeft className="w-4 h-4" />
                  Back to login
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              {/* Step 3: Create New Password */}
              <div 
                className="flex flex-col items-center mb-6"
                style={{
                  paddingBottom: "10px",
                  gap: "10px"
                }}
              >
               
                {/* Heading */}
                <h1 
                  className="text-center"
                  style={{
                    fontWeight: "700",
                    fontSize: "20px",
                    lineHeight: "28px",
                    color: "#0A0A0A"
                  }}
                >
                  Create new password
                </h1>

                {/* Description */}
                <p 
                  className="text-center"
                  style={{
                    fontWeight: "400",
                    fontSize: "14px",
                    lineHeight: "22px",
                    color: "#717182"
                  }}
                >
                  Enter your new password to reset it.
                </p>
              </div>

              {/* New Password Input */}
              <div className="flex flex-col gap-2 mb-3 w-full">
                <label className="text-[#212121] text-sm font-medium">
                  New password
                </label>
                <div className="relative w-full">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="w-full px-3 pr-10 py-2 border border-[#CED4DA] bg-white rounded"
                    style={{
                      padding: "7.52px 12px",
                      paddingRight: "40px"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1F2A44] transition-colors"
                  >
                    {showNewPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="flex flex-col gap-2 mb-3 w-full">
                <label className="text-[#212121] text-sm font-medium">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="w-full px-3 pr-10 py-2 border border-[#CED4DA] bg-white rounded"
                    style={{
                      padding: "7.52px 12px",
                      paddingRight: "40px"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1F2A44] transition-colors"
                  >
                    {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Reset Password Button */}
              <button
                onClick={handleResetPassword}
                className="w-full py-2 bg-[#1F2A44] text-white rounded-md hover:bg-[#2a3a5a] transition-colors mb-4"
                style={{
                  padding: "8.52px 20px",
                  borderRadius: "6px"
                }}
              >
                Reset password
              </button>

              {/* Back to Login */}
              <div className="flex items-center justify-center">
                <button
                  onClick={() => router.push("/login")}
                  className="flex items-center gap-1 text-[#717182] text-sm hover:text-[#1F2A44] transition-colors"
                >
                  <FiArrowLeft className="w-4 h-4" />
                  Back to login
                </button>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              {/* Step 4: Password Reset Success */}
              <div 
                className="flex flex-col items-center mb-6"
                style={{
                  paddingBottom: "10px",
                  gap: "10px"
                }}
              >
                {/* Success Icon */}
                <div 
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: "50px",
                    height: "50px"
                  }}
                >
                  <Image
                    src="/assets/icons/passwordresetok.svg"
                    alt="Password Reset OK"
                    width={40}
                    height={40}
                    className="w-10 h-10"
                  />
                </div>

                {/* Heading */}
                <h1 
                  className="text-center"
                  style={{
                    fontWeight: "700",
                    fontSize: "20px",
                    lineHeight: "28px",
                    color: "#0A0A0A"
                  }}
                >
                  Password reset
                </h1>

                {/* Description */}
                <p 
                  className="text-center"
                  style={{
                    fontWeight: "400",
                    fontSize: "14px",
                    lineHeight: "22px",
                    color: "#717182"
                  }}
                >
                  Your password has been successfully reset. Please login to your account to continue.
                </p>
              </div>

              {/* Continue to Login Button */}
              <button
                onClick={handleContinueToLogin}
                className="w-full py-2 bg-[#1F2A44] text-white rounded-md hover:bg-[#2a3a5a] transition-colors"
                style={{
                  padding: "8.52px 20px",
                  borderRadius: "6px"
                }}
              >
                Continue to login
              </button>
            </>
          )}
        </div>

        {/* Bottom Center Border - After Content */}
        <div 
          className="relative z-10"
          style={{ 
            width: "100%",
            height: "1px",
            border: "1px solid #FAFAFA",
            marginTop: "5%",
            backgroundColor: "#FAFAFA"
          }}
        />
      </div>
    </div>
  )
}