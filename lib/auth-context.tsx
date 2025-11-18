"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserData, getAuthToken, getUserData, clearAuthData } from '@/lib/auth-utils'

interface AuthContextType {
  isAuthenticated: boolean
  user: UserData | null
  token: string | null
  logout: () => void
  loading: boolean
  userType: 'superadmin' | 'member' | 'partner' | 'partnermember' | 'partnerstaff' | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [userType, setUserType] = useState<'superadmin' | 'member' | 'partner' | 'partnermember' | 'partnerstaff' | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check for existing authentication on mount
    const storedToken = getAuthToken()
    const storedUser = getUserData()

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(storedUser)
      // Get userType from stored user data (set during login) or fallback to role
      const userTypeValue = (storedUser as any).userType || storedUser.role
      setUserType(userTypeValue)
      setIsAuthenticated(true)
      
      // Debug logging
      if (userTypeValue === 'member') {
        console.log('Member logged in, permissions:', (storedUser as any).permissions)
      }
    }

    setLoading(false)
  }, [])

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (e) {
      // ignore
    } finally {
      clearAuthData()
      setToken(null)
      setUser(null)
      setUserType(null)
      setIsAuthenticated(false)
      router.push('/login')
    }
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      token,
      logout,
      loading,
      userType
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}


