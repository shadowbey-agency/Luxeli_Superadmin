import { NextRequest, NextResponse } from 'next/server';
import { PartnerController } from '@/controllers/PartnerController';
import { withSuperAdminAuth } from '@/lib/middleware';
import { hashPassword } from '@/lib/auth';

export const GET = withSuperAdminAuth(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const query = {
    page: searchParams.get('page') || undefined,
    limit: searchParams.get('limit') || undefined,
    search: searchParams.get('search') || undefined,
    hotelCity: searchParams.get('hotelCity') || undefined,
    plan: searchParams.get('plan') || undefined,
    isActive: searchParams.get('isActive') || undefined,
  };

  return await PartnerController.getPartners(query);
});

export const POST = withSuperAdminAuth(async (request: NextRequest) => {
  try {
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
    } = body;

    // Validate required fields with detailed list
    const requiredMap: Record<string, any> = {
      hotelName,
      hotelCity,
      hotelAddressEmail,
      phoneNumber,
      RC,
      ICE,
      identifiantFiscal,
      taxeProfessionnelle,
      username,
      password,
      startDate,
      endDate,
      plan,
    };

    const missingFields = Object.keys(requiredMap).filter((k) => !requiredMap[k]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(hotelAddressEmail)) {
      return NextResponse.json(
        { success: false, error: 'Invalid hotel address email format' },
        { status: 400 }
      );
    }

    // Validate plan
    const validPlans = ['starter pack', 'gold pack'];
    if (!validPlans.includes(plan)) {
      return NextResponse.json(
        { success: false, error: 'Invalid plan. Must be starter pack or gold pack' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Default services object if not provided
    const defaultServices = {
      housekeeping: false,
      bookingInterns: false,
      customizedServices: false,
      activityAlerts: false,
      laundry: false,
      roomDelivery: false,
    };

    // Merge provided services with defaults
    const servicesData = services && typeof services === 'object' 
      ? { ...defaultServices, ...services }
      : defaultServices;

    return await PartnerController.createPartner({
      hotelName: hotelName.trim(),
      hotelCity: hotelCity.trim(),
      hotelAddressEmail: hotelAddressEmail.toLowerCase().trim(),
      phoneNumber: phoneNumber.trim(),
      RC: RC.trim(),
      ICE: ICE.trim(),
      identifiantFiscal: identifiantFiscal.trim(),
      taxeProfessionnelle: taxeProfessionnelle.trim(),
      hotelImage: hotelImage && typeof hotelImage === 'string' && hotelImage.trim() ? hotelImage.trim() : undefined,
      username: username.trim(),
      password: hashedPassword,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      plan: plan as 'starter pack' | 'gold pack',
      services: servicesData,
    });
  } catch (error) {
    console.error('Create Partner API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
});
