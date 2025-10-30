import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import SuperAdmin from '@/models/SuperAdmin';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { fullName, email, phoneNumber, password, profileImage } = body;

    // Validate required fields
    if (!fullName || !email || !phoneNumber || !password) {
      return Response.json(
        { error: 'fullName, email, phoneNumber, and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return Response.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Validate phone number format
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,20}$/;
    const cleanPhone = phoneNumber.replace(/\s/g, '').replace(/[\(\)\-]/g, '');
    if (!phoneRegex.test(phoneNumber) || cleanPhone.length < 7 || cleanPhone.length > 15) {
      return Response.json(
        { error: 'Invalid phone number format. Please enter a valid phone number (7-15 digits)' },
        { status: 400 }
      );
    }

    // Validate full name
    if (fullName.trim().length < 2) {
      return Response.json(
        { error: 'Full name must be at least 2 characters long' },
        { status: 400 }
      );
    }

    // Check if superadmin already exists
    const existingSuperAdmin = await SuperAdmin.findOne({ email: email.toLowerCase() });
    if (existingSuperAdmin) {
      return Response.json(
        { error: 'SuperAdmin already exists with this email' },
        { status: 409 }
      );
    }

    // Check if phone number already exists
    const existingPhone = await SuperAdmin.findOne({ phoneNumber: phoneNumber.trim() });
    if (existingPhone) {
      return Response.json(
        { error: 'SuperAdmin already exists with this phone number' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new superadmin
    const superAdmin = new SuperAdmin({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phoneNumber: phoneNumber.trim(),
      password: hashedPassword,
      profileImage: profileImage || null,
    });

    await superAdmin.save();

    return Response.json({
      success: true,
      message: 'SuperAdmin created successfully and saved to database',
      data: {
        id: superAdmin._id,
        fullName: superAdmin.fullName,
        email: superAdmin.email,
        phoneNumber: superAdmin.phoneNumber,
        profileImage: superAdmin.profileImage,
        createdAt: superAdmin.createdAt,
        updatedAt: superAdmin.updatedAt,
      },
    });
  } catch (error) {
    console.error('Create SuperAdmin Error:', error);
    return Response.json(
      { 
        success: false,
        error: 'Failed to create superadmin',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Get superadmins with pagination
    const superAdmins = await SuperAdmin.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const total = await SuperAdmin.countDocuments({});

    return Response.json({
      success: true,
      data: {
        superAdmins,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get SuperAdmins Error:', error);
    return Response.json(
      { 
        success: false,
        error: 'Failed to get superadmins',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}


