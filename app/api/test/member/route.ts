import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Member from '@/models/Member';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      name,
      email,
      phone,
      username,
      password,
      permissions,
    } = body;

    console.log('Received member data:', { 
      name, 
      email, 
      username, 
      permissions,
      password: '***' 
    });

    // Basic validation
    if (!name || !email || !phone || !username || !password) {
      return Response.json(
        { error: 'Name, email, phone, username, and password are required' },
        { status: 400 }
      );
    }

    // Check if member already exists
    const existingMember = await Member.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { username: username }
      ]
    });
    if (existingMember) {
      return Response.json(
        { error: 'Member already exists with this email or username' },
        { status: 409 }
      );
    }

    // Create member data
    const memberData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      username: username.trim(),
      password: password,
      permissions: permissions || [],
    };

    console.log('Creating Member with data:', memberData);

    const member = new Member(memberData);
    await member.save();

    console.log('Member saved successfully:', member.toObject());

    return Response.json({
      success: true,
      message: 'Member created successfully',
      data: {
        id: member._id,
        name: member.name,
        email: member.email,
        phone: member.phone,
        username: member.username,
        permissions: member.permissions,
        createdAt: member.createdAt,
      },
    });
  } catch (error) {
    console.error('Create Member Error:', error);
    return Response.json(
      { 
        success: false,
        error: 'Failed to create member',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const members = await Member.find({}).select('-password').sort({ createdAt: -1 });

    return Response.json({
      success: true,
      data: {
        members,
        count: members.length,
      },
    });
  } catch (error) {
    console.error('Get Members Error:', error);
    return Response.json(
      { 
        success: false,
        error: 'Failed to get members',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}














