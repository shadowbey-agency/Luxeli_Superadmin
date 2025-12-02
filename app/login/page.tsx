"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { FiEye, FiEyeOff } from "react-icons/fi"
import { loginUser, storeAuthData } from "@/lib/auth-utils"
import PublicIcon from "@/app/partner/components/public-icon"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: ""
  })
  const emailInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)

  // Update border colors when fieldErrors change
  useEffect(() => {
    if (emailInputRef.current) {
      if (fieldErrors.email) {
        emailInputRef.current.style.borderColor = "#F46A6A"
        emailInputRef.current.style.boxShadow = "0 0 0 2px rgba(244, 106, 106, 0.2)"
      } else {
        emailInputRef.current.style.borderColor = "#CED4DA"
        emailInputRef.current.style.boxShadow = "none"
      }
    }
  }, [fieldErrors.email])

  useEffect(() => {
    if (passwordInputRef.current) {
      if (fieldErrors.password) {
        passwordInputRef.current.style.borderColor = "#F46A6A"
        passwordInputRef.current.style.boxShadow = "0 0 0 2px rgba(244, 106, 106, 0.2)"
      } else {
        passwordInputRef.current.style.borderColor = "#CED4DA"
        passwordInputRef.current.style.boxShadow = "none"
      }
    }
  }, [fieldErrors.password])

  const clearFieldError = (field: string) => {
    setFieldErrors(prev => ({
      ...prev,
      [field]: ""
    }))
  }

  const validateFields = () => {
    const errors = {
      email: "",
      password: ""
    }

      if (!email.trim()) {
      errors.email = "This field is required"
    }

    if (!password) {
      errors.password = "This field is required"
    }

    setFieldErrors(errors)
    return !Object.values(errors).some(error => error !== "")
  }

  const parseApiError = (errorMessage: string) => {
    const lowerError = errorMessage.toLowerCase()
    const errors = {
      email: "",
      password: ""
    }

    if (
      lowerError.includes("password") || 
      lowerError.includes("wrong password") ||
      lowerError.includes("incorrect password") ||
      lowerError.includes("password is incorrect") ||
      lowerError.includes("password does not match")
    ) {
      errors.password = errorMessage
    }
    // Check for email/username-related errors
    else if (
      lowerError.includes("email") || 
      lowerError.includes("username") || 
      lowerError.includes("user not found") || 
      lowerError.includes("invalid email") ||
      lowerError.includes("user does not exist") ||
      lowerError.includes("account not found") ||
      lowerError.includes("invalid username")
    ) {
      errors.email = errorMessage
    }
    // For "Invalid credentials" or "authentication failed" - typically means wrong password
    else if (lowerError.includes("invalid credentials") || lowerError.includes("authentication failed")) {
      errors.password = errorMessage
    }
    // If error doesn't match specific fields, show on email field
    else {
      errors.email = errorMessage
    }

    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setFieldErrors({ email: "", password: "" })
    
    // Use the same validateFields function that works on test button
    const isValid = validateFields()
    
    if (!isValid) {
      console.log("Validation failed, showing errors:", fieldErrors)
      return
    }

    setIsLoading(true)

    try {
      // Auto-detect user type - try email first, then username
      // The backend will automatically detect the user type
      const identifier = email.trim()
      const data = await loginUser(identifier, password)
      
      // Store authentication data with userType and permissions
      const userDataWithType = {
        ...data.user,
        userType: data.userType,
        permissions: (data.user as any).permissions || null
      }
      storeAuthData(data.token, userDataWithType as any, rememberMe)
      
      console.log("Login successful:", data.message)
      console.log("User type:", data.userType)
      
      // Redirect based on user type
      if (data.userType === 'superadmin') {
        router.push("/superadmin/pages/dashboard")
      } else if (data.userType === 'member') {
        router.push("/superadmin/pages/dashboard") // Members also go to superadmin dashboard for now
      } else if (data.userType === 'partner') {
        router.push("/partner/pages/dashboard") // Partners go to partner dashboard
      } else if (data.userType === 'partnermember') {
        router.push("/partner/pages/dashboard") // Partner members go to partner dashboard
      } else if (data.userType === 'partnerstaff') {
        router.push("/partner/pages/dashboard") // Partner staff go to partner dashboard
      }
    } catch (error) {
      console.error("Login error:", error)
      const errorMessage = error instanceof Error ? error.message : "Network error. Please try again."
      
      // Parse error and set field-specific errors
      const apiErrors = parseApiError(errorMessage)
      setFieldErrors(apiErrors)
      
      // Also set general error for display at top
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-[100vh] p-12 bg-[#F9FAFB] ">
      <div className="w-full max-w-[1400px] h-full  flex gap-8 items-center">
        {/* Left Side - Image */}
        <div className="hidden lg:block relative flex-shrink-0 w-[50%] h-[100%]" >
          <div className="relative w-[90%] h-full rounded-[24px] overflow-hidden">
            <Image
              src="/assets/images/hotel-pool.jpg"
              alt="Luxury Hotel Resort"
              fill
              className="object-cover"
              priority
            />
            {/* Gradient Overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(158deg, rgba(0, 0, 0, 0.30) 4.37%, rgba(0, 0, 0, 0.25) 55.8%, rgba(0, 0, 0, 0.28) 85.41%)",
              }}
            />
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 h-full flex flex-col">
          {/* Top Right - Need Help Link */}
          <div className="w-full flex justify-end items-start pt-4">
            <button
              type="button"
              className="text-sm transition-colors hover:text-[#56C6FF]"
              style={{ 
                color: "#6B7280"
              }}
            >
              Need help?
            </button>
          </div>
          
        <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-[612.5px] flex flex-col items-center justify-center gap-10">
            {/* Login Form Content */}
            <div className="flex flex-col items-center justify-center gap-10 w-full">
              {/* Header */}
              <div className="flex flex-col gap-3 items-center">
                <h1
                  className="text-[#1F2A44]"
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: "42px",
                    fontWeight: 600,
                    lineHeight: "normal",
                  }}
                >
                  Log in
                </h1>
                <p className="text-[#6B7280] text-base">Enter your email and password to log in.</p>
              </div>

              {/* Form */}
              <form noValidate onSubmit={handleSubmit} className="w-full flex flex-col gap-6 items-center">
                {/* Email/Username Field */}
                <div className="flex flex-col gap-2 w-full max-w-[470px]">
                  <label htmlFor="email" className="text-[#212121] text-sm font-medium">
                    Email or Username
                  </label>
                  <div className="relative w-full max-w-[470px]">
                    <input
                      ref={emailInputRef}
                      id="email"
                      type="text"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        clearFieldError("email")
                      }}
                      placeholder="Enter your email or username"
                      className="flex w-full px-3 pr-10 flex-col items-start border bg-white rounded focus:outline-none transition-colors"
                      style={{
                        padding: "7.52px 12px",
                        paddingRight: "40px",
                        borderColor: fieldErrors.email ? "#F46A6A" : "#CED4DA",
                        boxShadow: fieldErrors.email ? "0 0 0 2px rgba(244, 106, 106, 0.2)" : "none",
                      }}
                      onFocus={(e) => {
                        if (!fieldErrors.email) {
                          e.target.style.borderColor = "#56C6FF";
                          e.target.style.boxShadow = "0 0 0 2px rgba(86, 198, 255, 0.2)";
                        }
                      }}
                      onBlur={(e) => {
                        if (fieldErrors.email) {
                          e.target.style.borderColor = "#F46A6A";
                          e.target.style.boxShadow = "0 0 0 2px rgba(244, 106, 106, 0.2)";
                        } else {
                          e.target.style.borderColor = "#CED4DA";
                          e.target.style.boxShadow = "none";
                        }
                      }}
                      required
                    />
                    {fieldErrors.email && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <PublicIcon src="/assets/icons/status error.svg" alt="Error" width={16} height={16} 
                        className={`${fieldErrors.email ? "text-[#F46A6A]" : "text-[#6B7280]"}`}
                        />
                      </div>
                    )}
                  </div>
                  {fieldErrors.email && (
                    <p className="text-[#F46A6A] text-xs">{fieldErrors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-2 w-full max-w-[470px]">
                  <label htmlFor="password" className="text-[#212121] text-sm font-medium">
                    Password
                  </label>
                  <div className="relative w-full max-w-[470px]">
                    <input
                      ref={passwordInputRef}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        clearFieldError("password")
                      }}
                      placeholder="••••••••••"
                      className="flex w-full px-3 pr-20 flex-col items-start border bg-white rounded focus:outline-none transition-colors"
                      style={{
                        padding: "7.52px 12px",
                        paddingRight: "60px",
                        borderColor: fieldErrors.password ? "#F46A6A" : "#CED4DA",
                        boxShadow: fieldErrors.password ? "0 0 0 2px rgba(244, 106, 106, 0.2)" : "none",
                      }}
                      onFocus={(e) => {
                        if (!fieldErrors.password) {
                          e.target.style.borderColor = "#56C6FF";
                          e.target.style.boxShadow = "0 0 0 2px rgba(86, 198, 255, 0.2)";
                        }
                      }}
                      onBlur={(e) => {
                        if (fieldErrors.password) {
                          e.target.style.borderColor = "#F46A6A";
                          e.target.style.boxShadow = "0 0 0 2px rgba(244, 106, 106, 0.2)";
                        } else {
                          e.target.style.borderColor = "#CED4DA";
                        e.target.style.boxShadow = "none";
                        }
                      }}
                      required
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      {fieldErrors.password && (
                        <PublicIcon src="/assets/icons/status error.svg" alt="Error" width={16} height={16} />
                      )}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[#6B7280] hover:text-[#1F2A44] transition-colors"
                      >
                        {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-[#F46A6A] text-xs">{fieldErrors.password}</p>
                  )}
                </div>

                {/* Remember Me and Forgot Password */}
                <div className="flex justify-between items-center w-full max-w-[470px]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-[#1F2A44] bg-white border border-[#CED4DA] rounded focus:ring-[#1F2A44] focus:ring-2"
                    />
                    <span className="text-[#212121] text-sm">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm transition-colors"
                    style={{ 
                      color: "#4195BF"
                    }}
                    onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.currentTarget.style.color = "#3a7ba8"
                    }}
                    onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.currentTarget.style.color = "#4195BF"
                    }}
                    onClick={() => router.push("/login/forgot-password")}
                  >
                    Forgot password?
                  </button>
                </div>


                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex justify-center items-center gap-1.5 text-white rounded-md transition-colors w-full max-w-[470px] ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-[#1F2A44] hover:bg-[#2a3a5a]'
                  }`}
                  style={{
                    padding: "8.52px 20px",
                    borderRadius: "6px",
                  }}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </button>
              </form>
            </div>
            </div>
            </div>

          {/* Footer pinned bottom */}
          <div className="w-full flex justify-between items-center">
              {/* Logo */}
              <div className="flex items-center">
                <Image
                  src="/assets/icons/lexelisidebarlogo.svg"
                  alt="Luxeli Logo"
                  width={120}
                  height={32}
                  className="w-auto h-8"
                />
              </div>

              {/* Copyright */}
              <p className="text-[#6B7280] text-sm">© 2025 Luxeli</p>
          </div>
        </div>
      </div>
    </div>
  )
}
