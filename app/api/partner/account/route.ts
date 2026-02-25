import { NextRequest, NextResponse } from 'next/server'
import { withAuth, AuthenticatedRequest, getPartnerId } from '@/lib/middleware'
import { PartnerController } from '@/controllers/PartnerController'

// GET /api/partner/account - get current partner's account data (works for partner, partnermember, partnerstaff)
export const GET = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const partnerId = getPartnerId(request)
    if (!partnerId) {
      return NextResponse.json(
        { success: false, error: 'Partner context required' },
        { status: 401 }
      )
    }

    return await PartnerController.getPartnerById(partnerId)
  } catch (error: any) {
    console.error('Get Partner Account API Error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to get partner account' },
      { status: 500 }
    )
  }
})

// PATCH /api/partner/account - update current partner's account data (partner only; staff/member use partnerId for GET only)
export const PATCH = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const partnerId = getPartnerId(request)
    if (!partnerId) {
      return NextResponse.json(
        { success: false, error: 'Partner context required' },
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
      services,
    } = body

    return await PartnerController.updatePartner(partnerId, {
      hotelName,
      hotelCity,
      hotelAddressEmail,
      phoneNumber,
      RC,
      ICE,
      identifiantFiscal,
      taxeProfessionnelle,
      hotelImage,
      services,
    })
  } catch (error: any) {
    console.error('Update Partner Account API Error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update partner account' },
      { status: 500 }
    )
  }
})

