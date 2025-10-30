import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SuperAdmin from '@/models/SuperAdmin';
import { hashPassword, comparePassword } from '@/lib/auth';
import { handleApiError } from '@/lib/middleware';

export class SuperAdminController {
  /**
   * Get all superadmins with pagination and filtering
   */
  static async getSuperAdmins(query: {
    page?: string;
    limit?: string;
    search?: string;
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
          { fullName: { $regex: query.search, $options: 'i' } },
          { email: { $regex: query.search, $options: 'i' } },
          { phoneNumber: { $regex: query.search, $options: 'i' } },
        ];
      }

      // Get superadmins with pagination
      const superAdmins = await SuperAdmin.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      // Get total count
      const total = await SuperAdmin.countDocuments(filter);

      return NextResponse.json({
        superAdmins,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to get superadmins');
    }
  }

  /**
   * Get superadmin by ID
   */
  static async getSuperAdminById(superAdminId: string) {
    try {
      await connectDB();

      const superAdmin = await SuperAdmin.findById(superAdminId);
      if (!superAdmin) {
        return NextResponse.json(
          { error: 'SuperAdmin not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        superAdmin: superAdmin.toJSON(),
      });
    } catch (error) {
      return handleApiError(error, 'Failed to get superadmin');
    }
  }

  /**
   * Create new superadmin
   */
  static async createSuperAdmin(data: {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
    profileImage?: string;
  }) {
    try {
      await connectDB();

      // Check if superadmin already exists
      const existingSuperAdmin = await SuperAdmin.findOne({ email: data.email });
      if (existingSuperAdmin) {
        return NextResponse.json(
          { error: 'SuperAdmin already exists with this email' },
          { status: 409 }
        );
      }

      // Check if phone number already exists
      const existingPhone = await SuperAdmin.findOne({ phoneNumber: data.phoneNumber });
      if (existingPhone) {
        return NextResponse.json(
          { error: 'SuperAdmin already exists with this phone number' },
          { status: 409 }
        );
      }

      // Hash password
      const hashedPassword = await hashPassword(data.password);

      const superAdmin = new SuperAdmin({
        ...data,
        password: hashedPassword,
        role: 'superadmin', // Always set to superadmin
      });

      await superAdmin.save();

      return NextResponse.json({
        message: 'SuperAdmin created successfully',
        superAdmin: superAdmin.toJSON(),
      });
    } catch (error) {
      return handleApiError(error, 'Failed to create superadmin');
    }
  }

  /**
   * Update superadmin
   */
  static async updateSuperAdmin(superAdminId: string, data: Partial<{
    fullName: string;
    email: string;
    phoneNumber: string;
    profileImage: string;
  }>) {
    try {
      await connectDB();

      const superAdmin = await SuperAdmin.findById(superAdminId);
      if (!superAdmin) {
        return NextResponse.json(
          { error: 'SuperAdmin not found' },
          { status: 404 }
        );
      }

      // Check if email is being changed and if it's already taken
      if (data.email && data.email !== superAdmin.email) {
        const existingSuperAdmin = await SuperAdmin.findOne({ email: data.email });
        if (existingSuperAdmin) {
          return NextResponse.json(
            { error: 'Email already taken' },
            { status: 409 }
          );
        }
      }

      // Check if phone number is being changed and if it's already taken
      if (data.phoneNumber && data.phoneNumber !== superAdmin.phoneNumber) {
        const existingPhone = await SuperAdmin.findOne({ phoneNumber: data.phoneNumber });
        if (existingPhone) {
          return NextResponse.json(
            { error: 'Phone number already taken' },
            { status: 409 }
          );
        }
      }

      Object.assign(superAdmin, data);
      await superAdmin.save();

      return NextResponse.json({
        message: 'SuperAdmin updated successfully',
        superAdmin: superAdmin.toJSON(),
      });
    } catch (error) {
      return handleApiError(error, 'Failed to update superadmin');
    }
  }

  /**
   * Change superadmin password
   */
  static async changeSuperAdminPassword(superAdminId: string, data: {
    currentPassword: string;
    newPassword: string;
  }) {
    try {
      await connectDB();

      const superAdmin = await SuperAdmin.findById(superAdminId);
      if (!superAdmin) {
        return NextResponse.json(
          { error: 'SuperAdmin not found' },
          { status: 404 }
        );
      }

      // Verify current password
      const isCurrentPasswordValid = await comparePassword(data.currentPassword, superAdmin.password);
      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      // Hash new password
      const hashedNewPassword = await hashPassword(data.newPassword);
      superAdmin.password = hashedNewPassword;
      await superAdmin.save();

      return NextResponse.json({
        message: 'Password changed successfully',
      });
    } catch (error) {
      return handleApiError(error, 'Failed to change password');
    }
  }

  /**
   * Delete superadmin
   */
  static async deleteSuperAdmin(superAdminId: string) {
    try {
      await connectDB();

      const superAdmin = await SuperAdmin.findById(superAdminId);
      if (!superAdmin) {
        return NextResponse.json(
          { error: 'SuperAdmin not found' },
          { status: 404 }
        );
      }

      await SuperAdmin.findByIdAndDelete(superAdminId);

      return NextResponse.json({
        message: 'SuperAdmin deleted successfully',
      });
    } catch (error) {
      return handleApiError(error, 'Failed to delete superadmin');
    }
  }

  /**
   * Get superadmin statistics
   */
  static async getSuperAdminStats() {
    try {
      await connectDB();

      const stats = await SuperAdmin.aggregate([
        {
          $group: {
            _id: null,
            totalSuperAdmins: { $sum: 1 },
            withProfileImage: {
              $sum: { $cond: [{ $ne: ['$profileImage', null] }, 1, 0] }
            },
            withoutProfileImage: {
              $sum: { $cond: [{ $eq: ['$profileImage', null] }, 1, 0] }
            },
            recentRegistrations: {
              $sum: {
                $cond: [
                  { $gte: ['$createdAt', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)] },
                  1,
                  0
                ]
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            totalSuperAdmins: 1,
            withProfileImage: 1,
            withoutProfileImage: 1,
            recentRegistrations: 1,
            profileImagePercentage: {
              $multiply: [
                { $divide: ['$withProfileImage', '$totalSuperAdmins'] },
                100
              ]
            }
          }
        }
      ]);

      return NextResponse.json({
        stats: stats[0] || {
          totalSuperAdmins: 0,
          withProfileImage: 0,
          withoutProfileImage: 0,
          recentRegistrations: 0,
          profileImagePercentage: 0
        }
      });
    } catch (error) {
      return handleApiError(error, 'Failed to get superadmin statistics');
    }
  }
}
