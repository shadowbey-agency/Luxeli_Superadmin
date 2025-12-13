import { NextRequest, NextResponse } from 'next/server'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware'
import connectDB from '@/lib/db'
import Partner from '@/models/Partner'
import { comparePassword, hashPassword } from '@/lib/auth'

// POST /api/partner/account/change-password - change partner password
export const POST = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const userId = request.user?.userId
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { currentPassword, newPassword, confirmPassword } = body

    // Validate required fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Current password, new password, and confirm password are required' },
        { status: 400 }
      )
    }

    // Validate password match
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'New password and confirm password do not match' },
        { status: 400 }
      )
    }

    // Validate password length
    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    await connectDB()

    // Get partner
    const partner = await Partner.findById(userId)
    if (!partner) {
      return NextResponse.json(
        { success: false, error: 'Partner not found' },
        { status: 404 }
      )
    }

    // Verify current password
    const isPasswordValid = await comparePassword(currentPassword, partner.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect' },
        { status: 400 }
      )
    }

    // Hash and update password
    const hashedPassword = await hashPassword(newPassword)
    partner.password = hashedPassword
    await partner.save()

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully',
    })
  } catch (error: any) {
    console.error('Change Password API Error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to change password' },
      { status: 500 }
    )
  }
})






















