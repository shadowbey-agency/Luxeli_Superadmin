import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Minimal JWT payload decode without verification (for routing decisions only)
function decodeJwtPayload(token: string): any | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = parts[1]
    const padded = payload.padEnd(payload.length + (4 - (payload.length % 4)) % 4, '=')
    const json = Buffer.from(padded.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8')
    return JSON.parse(json)
  } catch {
    return null
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('auth_token')?.value

  const isProtected = pathname.startsWith('/superadmin') || pathname.startsWith('/partner')
  const isLogin = pathname === '/login'

  // Redirect unauthenticated users away from protected areas
  if (isProtected && !token) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  // Prevent authenticated users from visiting login page
  if (isLogin && token) {
    const payload = decodeJwtPayload(token)
    const url = req.nextUrl.clone()
    if (payload?.userType === 'partner') {
      url.pathname = '/partner/pages/dashboard'
    } else {
      url.pathname = '/superadmin/pages/dashboard'
    }
    return NextResponse.redirect(url)
  }

  // Member permission guard for dashboard (block if missing)
  if (pathname === '/superadmin/pages/dashboard' && token) {
    const payload = decodeJwtPayload(token)
    if (payload?.userType === 'member') {
      const permissions: string[] = Array.isArray(payload?.permissions) ? payload.permissions : []
      if (!permissions.includes('dashboard')) {
        const url = req.nextUrl.clone()
        url.pathname = '/superadmin/pages/settings'
        return NextResponse.redirect(url)
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/login',
    '/superadmin/:path*',
    '/partner/:path*',
  ],
}


