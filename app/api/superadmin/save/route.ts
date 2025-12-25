import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import SuperAdmin from '@/models/SuperAdmin';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { fullName, email, phoneNumber, password, profileImage } = body;

    console.log('Received request body:', { fullName, email, phoneNumber, password: '***', profileImage });

    // Basic validation
    if (!fullName || !email || !phoneNumber || !password) {
      return Response.json(
        { error: 'fullName, email, phoneNumber, and password are required' },
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

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new superadmin
    const superAdminData = {
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phoneNumber: phoneNumber.trim(),
      password: hashedPassword,
      profileImage: profileImage || null,
      role: 'superadmin', // Always set to superadmin by default
    };

    console.log('Creating SuperAdmin with data:', superAdminData);

    const superAdmin = new SuperAdmin(superAdminData);
    await superAdmin.save();

    console.log('SuperAdmin saved successfully:', superAdmin.toObject());

    return Response.json({
      success: true,
      message: 'SuperAdmin saved successfully',
      data: {
        id: superAdmin._id,
        fullName: superAdmin.fullName,
        email: superAdmin.email,
        phoneNumber: superAdmin.phoneNumber,
        profileImage: superAdmin.profileImage,
        role: superAdmin.role,
        createdAt: superAdmin.createdAt,
      },
    });
  } catch (error) {
    console.error('Save SuperAdmin Error:', error);
    return Response.json(
      { 
        success: false,
        error: 'Failed to save superadmin',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const superAdmins = await SuperAdmin.find({})
      .sort({ createdAt: -1 })
      .lean();

    return Response.json({
      success: true,
      data: superAdmins,
      count: superAdmins.length,
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
