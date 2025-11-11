import { NextRequest, NextResponse } from 'next/server'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware'
import { PartnerController } from '@/controllers/PartnerController'

// GET /api/partner/account - get current partner's account data
export const GET = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const userId = request.user?.userId
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    return await PartnerController.getPartnerById(userId)
  } catch (error: any) {
    console.error('Get Partner Account API Error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to get partner account' },
      { status: 500 }
    )
  }
})

// PATCH /api/partner/account - update current partner's account data
export const PATCH = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const userId = request.user?.userId
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      hotelName,
      hotelCity,
      hotelAddressEmail,
      phoneNumber,
      RC,
      ICE,
      identifiantFiscal,
      taxeProfessionnelle,
      hotelImage,
    } = body

    return await PartnerController.updatePartner(userId, {
      hotelName,
      hotelCity,
      hotelAddressEmail,
      phoneNumber,
      RC,
      ICE,
      identifiantFiscal,
      taxeProfessionnelle,
      hotelImage,
    })
  } catch (error: any) {
    console.error('Update Partner Account API Error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update partner account' },
      { status: 500 }
    )
  }
})

