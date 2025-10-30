import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Partner from '@/models/Partner';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

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

    console.log('Received partner data:', { 
      hotelName, 
      hotelCity, 
      hotelAddressEmail, 
      username, 
      plan,
      password: '***' 
    });

    // Basic validation
    if (!hotelName || !hotelCity || !hotelAddressEmail || !phoneNumber || !RC || !ICE || !identifiantFiscal || !taxeProfessionnelle || !username || !password || !startDate || !endDate || !plan) {
      return Response.json(
        { error: 'All required fields are missing' },
        { status: 400 }
      );
    }

    // Check if partner already exists
    const existingPartner = await Partner.findOne({ 
      $or: [
        { hotelAddressEmail: hotelAddressEmail.toLowerCase() },
        { username: username }
      ]
    });
    if (existingPartner) {
      return Response.json(
        { error: 'Partner already exists with this hotel address email or username' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create partner data
    const partnerData = {
      hotelName: hotelName.trim(),
      hotelCity: hotelCity.trim(),
      hotelAddressEmail: hotelAddressEmail.toLowerCase().trim(),
      phoneNumber: phoneNumber.trim(),
      RC: RC.trim(),
      ICE: ICE.trim(),
      identifiantFiscal: identifiantFiscal.trim(),
      taxeProfessionnelle: taxeProfessionnelle.trim(),
      hotelImage: hotelImage || null,
      username: username.trim(),
      password: hashedPassword,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      plan: plan || 'basic',
      services: services || [],
      isActive: true,
    };

    console.log('Creating Partner with data:', partnerData);

    const partner = new Partner(partnerData);
    await partner.save();

    console.log('Partner saved successfully:', partner.toObject());

    return Response.json({
      success: true,
      message: 'Partner created successfully',
      data: {
        id: partner._id,
        hotelName: partner.hotelName,
        hotelCity: partner.hotelCity,
        hotelAddressEmail: partner.hotelAddressEmail,
        phoneNumber: partner.phoneNumber,
        RC: partner.RC,
        ICE: partner.ICE,
        identifiantFiscal: partner.identifiantFiscal,
        taxeProfessionnelle: partner.taxeProfessionnelle,
        hotelImage: partner.hotelImage,
        username: partner.username,
        startDate: partner.startDate,
        endDate: partner.endDate,
        plan: partner.plan,
        services: partner.services,
        isActive: partner.isActive,
        createdAt: partner.createdAt,
      },
    });
  } catch (error) {
    console.error('Create Partner Error:', error);
    return Response.json(
      { 
        success: false,
        error: 'Failed to create partner',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const partners = await Partner.find({})
      .sort({ createdAt: -1 })
      .lean();

    console.log('Retrieved Partners:', partners);

    return Response.json({
      success: true,
      data: partners,
      count: partners.length,
    });
  } catch (error) {
    console.error('Get Partners Error:', error);
    return Response.json(
      { 
        success: false,
        error: 'Failed to get partners',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}


