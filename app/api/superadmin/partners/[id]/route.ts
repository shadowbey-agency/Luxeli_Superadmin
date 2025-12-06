import { NextResponse } from 'next/server';
import { PartnerController } from '@/controllers/PartnerController';
import { withSuperAdminAuth } from '@/lib/middleware';

export const GET = withSuperAdminAuth(async (request: any) => {
  const url = new URL(request.url);
  const segments = url.pathname.split('/');
  const id = segments[segments.length - 1];
  return await PartnerController.getPartnerById(id);
});

export const PATCH = withSuperAdminAuth(async (request: any) => {
  try {
    const url = new URL(request.url);
    const segments = url.pathname.split('/');
    const id = segments[segments.length - 1];
    const body = await request.json();
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
      username,
      password,
      startDate,
      endDate,
      plan,
      services,
      status,
    } = body;

    // Validate plan if provided
    if (plan) {
      const validPlans = ['starter pack', 'gold pack'];
      if (!validPlans.includes(plan)) {
        return NextResponse.json(
          { success: false, error: 'Invalid plan. Must be starter pack or gold pack' },
          { status: 400 }
        );
      }
    }

    // Validate status if provided
    if (status && !['active', 'disable'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status. Must be "active" or "disable"' },
        { status: 400 }
      );
    }

    return await PartnerController.updatePartner(id, {
      hotelName: hotelName?.trim(),
      hotelCity: hotelCity?.trim(),
      hotelAddressEmail: hotelAddressEmail?.toLowerCase().trim(),
      phoneNumber: phoneNumber?.trim(),
      RC: RC?.trim(),
      ICE: ICE?.trim(),
      identifiantFiscal: identifiantFiscal?.trim(),
      taxeProfessionnelle: taxeProfessionnelle?.trim(),
      hotelImage: hotelImage && typeof hotelImage === 'string' && hotelImage.trim() ? hotelImage.trim() : undefined,
      username: username?.trim(),
      password: password?.trim(),
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      plan: plan as 'starter pack' | 'gold pack',
      services: services,
      status: status,
    });
  } catch (error) {
    console.error('Update Partner API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
});

export const DELETE = withSuperAdminAuth(async (request: any) => {
  const url = new URL(request.url);
  const segments = url.pathname.split('/');
  const id = segments[segments.length - 1];
  return await PartnerController.deletePartner(id);
});
