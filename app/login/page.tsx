"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { FiEye, FiEyeOff } from "react-icons/fi"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Login attempt:", { email, password: "***" })
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
        <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-[612.5px] flex flex-col items-center justify-center gap-10">
            {/* Login Form Content */}
            <div className="flex flex-col items-center justify-center gap-10 w-full">
              {/* Header */}
              <div className="flex flex-col gap-3 items-center">
                <h1
                  className="text-[#1F2A44]"
                  style={{
                    fontFamily: "Fustat, sans-serif",
                    fontSize: "42px",
                    fontWeight: 800,
                    lineHeight: "normal",
                  }}
                >
                  Log in
                </h1>
                <p className="text-[#6B7280] text-base">Enter your email and password to log in.</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 items-center">
                {/* Email Field */}
                <div className="flex flex-col gap-2 w-full max-w-[470px]">
                  <label htmlFor="email" className="text-[#212121] text-sm font-medium">
                    Adresse e-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Write Here..."
                    className="flex w-full max-w-[470px] px-3 flex-col items-start border border-[#CED4DA] bg-white rounded"
                    style={{
                      padding: "7.52px 12px",
                    }}
                    required
                  />
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
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••"
                      className="flex w-full px-3 pr-10 flex-col items-start border border-[#CED4DA] bg-white rounded"
                      style={{
                        padding: "7.52px 12px",
                        paddingRight: "40px",
                      }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1F2A44] transition-colors"
                    >
                      {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="flex justify-center items-center gap-1.5 bg-[#1F2A44] text-white rounded-md hover:bg-[#2a3a5a] transition-colors w-full max-w-[470px]"
                  style={{
                    padding: "8.52px 20px",
                    borderRadius: "6px",
                  }}
                >
                  Login
                </button>
              </form>
            </div>
            </div>
            </div>

          {/* Footer pinned bottom */}
          <div className="w-full flex justify-between items-center">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <span className="text-[#1F2A44] text-2xl font-bold">Luxeli</span>
                <div className="w-8 h-8 bg-[#60D5FA] rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-sm" />
                </div>
              </div>

              {/* Copyright */}
              <p className="text-[#6B7280] text-sm">© 2025 Luxeli</p>
          </div>
        </div>
      </div>
    </div>
  )
}
