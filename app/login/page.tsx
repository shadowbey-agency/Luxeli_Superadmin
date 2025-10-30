"use client"

import type React from "react"

import { useState } from "react"
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
  const [userType, setUserType] = useState<"superadmin" | "member" | "partner">("superadmin")
  const [username, setUsername] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    username: "",
    password: "",
    userType: ""
  })

  const clearFieldError = (field: string) => {
    setFieldErrors(prev => ({
      ...prev,
      [field]: ""
    }))
  }

  const validateFields = () => {
    const errors = {
      email: "",
      username: "",
      password: "",
      userType: ""
    }

    if (userType === "partner") {
      if (!username.trim()) {
        errors.username = "This field is remaining"
      }
    } else {
      if (!email.trim()) {
        errors.email = "This field is remaining"
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "Invalid email format"
      }
    }

    if (!password) {
      errors.password = "This field is remaining"
    }

    if (!userType) {
      errors.userType = "This field is remaining"
    }

    setFieldErrors(errors)
    return !Object.values(errors).some(error => error !== "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Use the same validateFields function that works on test button
    const isValid = validateFields()
    
    if (!isValid) {
      console.log("Validation failed, showing errors:", fieldErrors)
      return
    }

    setIsLoading(true)

    try {
      // Handle superadmin, member, and partner login
      const loginData = userType === "partner" 
        ? { username, password }
        : { email, password }
      
      const data = await loginUser(loginData.email || loginData.username, password, userType)
      
      // Store authentication data
      storeAuthData(data.token, data.user, rememberMe)
      
      console.log("Login successful:", data.message)
      console.log("User type:", data.userType)
      
      // Redirect based on user type
      if (data.userType === 'superadmin') {
        router.push("/superadmin/pages/dashboard")
      } else if (data.userType === 'member') {
        router.push("/superadmin/pages/dashboard") // Members also go to superadmin dashboard for now
      } else if (data.userType === 'partner') {
        router.push("/partner/pages/dashboard") // Partners go to partner dashboard
      }
    } catch (error) {
      console.error("Login error:", error)
      setError(error instanceof Error ? error.message : "Network error. Please try again.")
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

              {/* Error Message */}
              {error && (
                <div className="w-full max-w-[470px] bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}


              {/* Form */}
              <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 items-center">
                {/* User Type Selection */}
                <div className="flex flex-col gap-2 w-full max-w-[470px]">
                  <label htmlFor="userType" className="text-[#212121] text-sm font-medium">
                    User Type
                  </label>
                  <div className="relative w-full max-w-[470px]">
                    <select
                      id="userType"
                      value={userType}
                      onChange={(e) => {
                        setUserType(e.target.value as "superadmin" | "member")
                        clearFieldError("userType")
                      }}
                      className="flex w-full px-3 pr-10 flex-col items-start border bg-white rounded focus:outline-none focus:ring-2 transition-colors"
                      style={{
                        padding: "7.52px 12px",
                        paddingRight: "40px",
                        borderColor: fieldErrors.userType ? "#F46A6A" : "#CED4DA",
                        boxShadow: fieldErrors.userType ? "0 0 0 2px rgba(244, 106, 106, 0.2)" : "none",
                      }}
                      onFocus={(e) => {
                        if (fieldErrors.userType) {
                          e.target.style.borderColor = "#F46A6A";
                          e.target.style.boxShadow = "0 0 0 2px rgba(244, 106, 106, 0.2)";
                        } else {
                          e.target.style.borderColor = "#56C6FF";
                          e.target.style.boxShadow = "0 0 0 2px rgba(86, 198, 255, 0.2)";
                        }
                      }}
                      onBlur={(e) => {
                        e.target.style.boxShadow = "none";
                      }}
                      required
                    >
                      <option value="superadmin">Super Admin</option>
                      <option value="member">Member</option>
                      <option value="partner">Partner</option>
                    </select>
                    {fieldErrors.userType && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <PublicIcon src="/assets/icons/status error.svg" alt="Error" width={16} height={16} />
                      </div>
                    )}
                  </div>
                  {fieldErrors.userType && (
                    <p className="text-[#F46A6A] text-xs">{fieldErrors.userType}</p>
                  )}
                </div>

                {/* Email/Username Field */}
                <div className="flex flex-col gap-2 w-full max-w-[470px]">
                  <label htmlFor={userType === "partner" ? "username" : "email"} className="text-[#212121] text-sm font-medium">
                    {userType === "partner" ? "Username" : "Adresse e-mail"}
                  </label>
                  <div className="relative w-full max-w-[470px]">
                    <input
                      id={userType === "partner" ? "username" : "email"}
                      type={userType === "partner" ? "text" : "email"}
                      value={userType === "partner" ? username : email}
                      onChange={(e) => {
                        if (userType === "partner") {
                          setUsername(e.target.value)
                          clearFieldError("username")
                        } else {
                          setEmail(e.target.value)
                          clearFieldError("email")
                        }
                      }}
                      placeholder="Write Here..."
                      className="flex w-full px-3 pr-10 flex-col items-start border bg-white rounded focus:outline-none focus:ring-2 transition-colors"
                      style={{
                        padding: "7.52px 12px",
                        paddingRight: "40px",
                        borderColor: (userType === "partner" ? fieldErrors.username : fieldErrors.email) ? "#F46A6A" : "#CED4DA",
                        boxShadow: (userType === "partner" ? fieldErrors.username : fieldErrors.email) ? "0 0 0 2px rgba(244, 106, 106, 0.2)" : "none",
                      }}
                      onFocus={(e) => {
                        const hasError = userType === "partner" ? fieldErrors.username : fieldErrors.email;
                        if (hasError) {
                          e.target.style.borderColor = "#F46A6A";
                          e.target.style.boxShadow = "0 0 0 2px rgba(244, 106, 106, 0.2)";
                        } else {
                          e.target.style.borderColor = "#56C6FF";
                          e.target.style.boxShadow = "0 0 0 2px rgba(86, 198, 255, 0.2)";
                        }
                      }}
                      onBlur={(e) => {
                        e.target.style.boxShadow = "none";
                      }}
                      required
                    />
                    {(userType === "partner" ? fieldErrors.username : fieldErrors.email) && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <PublicIcon src="/assets/icons/status error.svg" alt="Error" width={16} height={16} />
                      </div>
                    )}
                  </div>
                  {(userType === "partner" ? fieldErrors.username : fieldErrors.email) && (
                    <p className="text-[#F46A6A] text-xs">{userType === "partner" ? fieldErrors.username : fieldErrors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-2 w-full max-w-[470px]">
                  <label htmlFor="password" className="text-[#212121] text-sm font-medium">
                    Password
                  </label>
                  <div className="relative w-full max-w-[470px]">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        clearFieldError("password")
                      }}
                      placeholder="••••••••••"
                      className="flex w-full px-3 pr-20 flex-col items-start border bg-white rounded focus:outline-none focus:ring-2 transition-colors"
                      style={{
                        padding: "7.52px 12px",
                        paddingRight: "60px",
                        borderColor: fieldErrors.password ? "#F46A6A" : "#CED4DA",
                        boxShadow: fieldErrors.password ? "0 0 0 2px rgba(244, 106, 106, 0.2)" : "none",
                      }}
                      onFocus={(e) => {
                        if (fieldErrors.password) {
                          e.target.style.borderColor = "#F46A6A";
                          e.target.style.boxShadow = "0 0 0 2px rgba(244, 106, 106, 0.2)";
                        } else {
                          e.target.style.borderColor = "#56C6FF";
                          e.target.style.boxShadow = "0 0 0 2px rgba(86, 198, 255, 0.2)";
                        }
                      }}
                      onBlur={(e) => {
                        e.target.style.boxShadow = "none";
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
                      color: "#4195BF",
                      hover: "color: #3a7ba8"
                    }}
                    onMouseEnter={(e) => e.target.style.color = "#3a7ba8"}
                    onMouseLeave={(e) => e.target.style.color = "#4195BF"}
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
