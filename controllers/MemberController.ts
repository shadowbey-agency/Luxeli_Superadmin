import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Member from '@/models/Member';
import { handleApiError } from '@/lib/middleware';

export class MemberController {
  /**
   * Get all members with pagination and filtering
   */
  static async getMembers(query: {
    page?: string;
    limit?: string;
    search?: string;
    permissions?: string;
  }) {
    try {
      await connectDB();

      const page = parseInt(query.page || '1');
      const limit = parseInt(query.limit || '10');
      const skip = (page - 1) * limit;

      // Build filter object
      const filter: any = {};
      
      if (query.search) {
        filter.$or = [
          { name: { $regex: query.search, $options: 'i' } },
          { email: { $regex: query.search, $options: 'i' } },
          { username: { $regex: query.search, $options: 'i' } },
        ];
      }

      if (query.permissions) {
        filter.permissions = { $in: [query.permissions] };
      }

      // Get members with pagination
      const members = await Member.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Member.countDocuments(filter);

      return NextResponse.json({
        success: true,
        data: {
          members,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to get members');
    }
  }

  /**
   * Get member by ID
   */
  static async getMemberById(memberId: string) {
    try {
      await connectDB();

      const member = await Member.findById(memberId).select('-password');
      if (!member) {
        return NextResponse.json(
          { error: 'Member not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: { member },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to get member');
    }
  }

  /**
   * Create new member
   */
  static async createMember(data: {
    name: string;
    email: string;
    phone: string;
    username: string;
    password: string;
    permissions: string[];
  }) {
    try {
      await connectDB();

      // Check if member already exists (less strict validation)
      try {
        const existingEmail = await Member.findOne({ email: data.email });
        if (existingEmail) {
          console.log(`Email conflict: ${data.email} already exists`);
          return NextResponse.json(
            { error: `Email '${data.email}' is already registered. Please use a different email.` },
            { status: 409 }
          );
        }

        const existingUsername = await Member.findOne({ username: data.username });
        if (existingUsername) {
          console.log(`Username conflict: ${data.username} already exists`);
          return NextResponse.json(
            { error: `Username '${data.username}' is already taken. Please choose a different username.` },
            { status: 409 }
          );
        }
      } catch (validationError: any) {
        console.log('Validation error (continuing anyway):', validationError?.message || validationError);
        // Continue with creation even if validation fails
      }

      // Add role field automatically
      const memberData = {
        ...data,
        role: 'member'
      };

      console.log('Creating member with data:', memberData);
      console.log('Member schema fields:', Object.keys(Member.schema.paths));
      
      const member = new Member(memberData);
      console.log('Member instance before save:', member.toObject());
      await member.save();
      console.log('Member saved successfully:', member.toJSON());

      return NextResponse.json({
        success: true,
        message: 'Member created successfully',
        data: { member: member.toJSON() },
      });
    } catch (error) {
      console.log('Member creation error:', error);
      
      // Handle specific MongoDB duplicate key errors
      if ((error as any).code === 11000) {
        const field = Object.keys((error as any).keyPattern)[0];
        const value = (error as any).keyValue[field];
        
        if (field === 'email') {
          return NextResponse.json(
            { error: `Email '${value}' is already registered. Please use a different email.` },
            { status: 409 }
          );
        } else if (field === 'username') {
          return NextResponse.json(
            { error: `Username '${value}' is already taken. Please choose a different username.` },
            { status: 409 }
          );
        } else {
          return NextResponse.json(
            { error: `Duplicate entry found for ${field}: ${value}` },
            { status: 409 }
          );
        }
      }
      
      return handleApiError(error, 'Failed to create member');
    }
  }

  /**
   * Update member
   */
  static async updateMember(memberId: string, data: Partial<{
    name: string;
    email: string;
    phone: string;
    username: string;
    password: string;
    permissions: string[];
  }>) {
    try {
      await connectDB();

      const member = await Member.findById(memberId);
      if (!member) {
        return NextResponse.json(
          { error: 'Member not found' },
          { status: 404 }
        );
      }

      // Check for email/username conflicts if updating
      if (data.email || data.username) {
        const conflictFilter: any = { _id: { $ne: memberId } };
        if (data.email) conflictFilter.email = data.email;
        if (data.username) conflictFilter.username = data.username;

        const existingMember = await Member.findOne(conflictFilter);
        if (existingMember) {
          return NextResponse.json(
            { error: 'Email or username already exists' },
            { status: 409 }
          );
        }
      }

      Object.assign(member, data);
      await member.save();

      return NextResponse.json({
        success: true,
        message: 'Member updated successfully',
        data: { member: member.toJSON() },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to update member');
    }
  }

  /**
   * Change member password
   */
  static async changeMemberPassword(memberId: string, data: {
    currentPassword: string;
    newPassword: string;
  }) {
    try {
      await connectDB();

      const member = await Member.findById(memberId);
      if (!member) {
        return NextResponse.json(
          { error: 'Member not found' },
          { status: 404 }
        );
      }

      // Verify current password using the member's comparePassword method
      const isCurrentPasswordValid = await member.comparePassword(data.currentPassword);
      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      // Update password (the pre-save hook will hash it)
      member.password = data.newPassword;
      await member.save();

      return NextResponse.json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      return handleApiError(error, 'Failed to change password');
    }
  }

  /**
   * Delete member
   */
  static async deleteMember(memberId: string) {
    try {
      await connectDB();

      const member = await Member.findByIdAndDelete(memberId);
      if (!member) {
        return NextResponse.json(
          { error: 'Member not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Member deleted successfully',
      });
    } catch (error) {
      return handleApiError(error, 'Failed to delete member');
    }
  }

  /**
   * Get member statistics
   */
  static async getMemberStats() {
    try {
      await connectDB();

      const totalMembers = await Member.countDocuments();
      const membersWithPermissions = await Member.countDocuments({ 
        permissions: { $exists: true, $ne: [] } 
      });

      // Count members by permission
      const permissionStats = await Member.aggregate([
        { $unwind: '$permissions' },
        { $group: { _id: '$permissions', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      return NextResponse.json({
        success: true,
        data: {
          totalMembers,
          membersWithPermissions,
          permissionStats,
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to get member statistics');
    }
  }
}
