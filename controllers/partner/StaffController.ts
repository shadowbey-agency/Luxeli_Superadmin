import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Staff from '@/models/Staff';
import { handleApiError } from '@/lib/middleware';

export class StaffController {
  /**
   * Get all staff for a partner with pagination and filtering
   * Only returns staff belonging to the given partnerId
   */
  static async getStaff(partnerId: string, query: {
    page?: string;
    limit?: string;
    search?: string;
    role?: string;
    status?: string;
  }) {
    try {
      await connectDB();

      const page = parseInt(query.page || '1');
      const limit = parseInt(query.limit || '10');
      const skip = (page - 1) * limit;  

      // Build filter object - always filter by partnerId so partner only sees their staff
      const filter: any = { partnerId };
      
      if (query.search) {
        filter.$or = [
          { staffName: { $regex: query.search, $options: 'i' } },
          { email: { $regex: query.search, $options: 'i' } },
          { phoneNumber: { $regex: query.search, $options: 'i' } },
          { username: { $regex: query.search, $options: 'i' } },
        ];
      }

      if (query.role) {
        filter.role = query.role;
      }

      if (query.status) {
        filter.status = query.status;
      }

      // Get staff with pagination
      const staff = await Staff.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      // Get total count
      const total = await Staff.countDocuments(filter);

      return NextResponse.json({
        success: true,
        data: {
          staff,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to get staff');
    }
  }

  /**
   * Get staff by ID
   */
  static async getStaffById(staffId: string) {
    try {
      await connectDB();

      const staff = await Staff.findById(staffId);
      if (!staff) {
        return NextResponse.json(
          { success: false, error: 'Staff not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          staff: staff.toJSON(),
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to get staff');
    }
  }

  /**
   * Create new staff
   */
  static async createStaff(data: {
    partnerId: string;
    staffName: string;
    email: string;
    phoneNumber: string;
    role: string;
    staffImage?: string;
    username: string;
    password: string;
    status?: "active" | "disabled";
  }) {
    try {
      await connectDB();

      // Check if staff with email or username already exists for this partner
      const existingStaff = await Staff.findOne({
        partnerId: data.partnerId,
        $or: [
          { email: data.email.toLowerCase() },
          { username: data.username }
        ]
      });

      if (existingStaff) {
        return NextResponse.json(
          { success: false, error: 'Staff with this email or username already exists for this partner' },
          { status: 409 }
        );
      }

      // Create new staff (password will be hashed by pre-save hook in model)
      const staff = new Staff({
        partnerId: data.partnerId,
        staffName: data.staffName.trim(),
        email: data.email.toLowerCase().trim(),
        phoneNumber: data.phoneNumber.trim(),
        role: data.role.trim(), // Role comes from UI
        staffImage: data.staffImage || '',
        username: data.username.trim(),
        password: data.password, // Don't hash here - model will hash it
        status: data.status || 'active',
      });

      await staff.save();

      return NextResponse.json({
        success: true,
        data: {
          staff: staff.toJSON(),
        },
      }, { status: 201 });
    } catch (error: any) {
      // Check for duplicate key error (MongoDB error code 11000)
      if (error.code === 11000) {
        // Determine which field caused the duplicate from the keyPattern
        let duplicateField = 'email or username';
        if (error.keyPattern) {
          if (error.keyPattern.email) {
            duplicateField = 'email';
          } else if (error.keyPattern.username) {
            duplicateField = 'username';
          }
        }
        return NextResponse.json(
          { success: false, error: `Staff with this ${duplicateField} already exists for this partner` },
          { status: 409 }
        );
      }
      return handleApiError(error, 'Failed to create staff');
    }
  }

  /**
   * Update staff
   */
  static async updateStaff(staffId: string, data: {
    staffName?: string;
    email?: string;
    phoneNumber?: string;
    role?: string;
    staffImage?: string;
    username?: string;
    password?: string;
    status?: "active" | "disabled";
  }) {
    try {
      await connectDB();

      const staff = await Staff.findById(staffId);
      if (!staff) {
        return NextResponse.json(
          { success: false, error: 'Staff not found' },
          { status: 404 }
        );
      }

      // Check if email or username is being changed and if it conflicts
      if (data.email || data.username) {
        const existingStaff = await Staff.findOne({
          _id: { $ne: staffId },
          $or: [
            ...(data.email ? [{ email: data.email.toLowerCase() }] : []),
            ...(data.username ? [{ username: data.username }] : []),
          ]
        });

        if (existingStaff) {
          return NextResponse.json(
            { success: false, error: 'Staff with this email or username already exists' },
            { status: 409 }
          );
        }
      }

      // Update fields
      if (data.staffName) staff.staffName = data.staffName.trim();
      if (data.email) staff.email = data.email.toLowerCase().trim();
      if (data.phoneNumber) staff.phoneNumber = data.phoneNumber.trim();
      if (data.role) staff.role = data.role.trim(); // Role can be updated from UI
      if (data.staffImage !== undefined) staff.staffImage = data.staffImage;
      if (data.username) staff.username = data.username.trim();
      // Update status if provided (must be 'active' or 'disabled')
      if (data.status !== undefined && (data.status === 'active' || data.status === 'disabled')) {
        staff.status = data.status;
      }

      // Update password if provided (will be hashed by pre-save hook)
      if (data.password) {
        if (data.password.length < 6) {
          return NextResponse.json(
            { success: false, error: 'Password must be at least 6 characters long' },
            { status: 400 }
          );
        }
        staff.password = data.password; // Don't hash here - model will hash it
      }

      await staff.save();

      return NextResponse.json({
        success: true,
        data: {
          staff: staff.toJSON(),
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to update staff');
    }
  }

  /**
   * Delete staff
   */
  static async deleteStaff(staffId: string) {
    try {
      await connectDB();

      const staff = await Staff.findById(staffId);
      if (!staff) {
        return NextResponse.json(
          { success: false, error: 'Staff not found' },
          { status: 404 }
        );
      }

      await Staff.findByIdAndDelete(staffId);

      return NextResponse.json({
        success: true,
        message: 'Staff deleted successfully',
      });
    } catch (error) {
      return handleApiError(error, 'Failed to delete staff');
    }
  }

  /**
   * Update staff status (toggle active/disabled)
   */
  static async updateStaffStatus(staffId: string, status: "active" | "disabled") {
    try {
      await connectDB();

      const staff = await Staff.findByIdAndUpdate(
        staffId,
        { status },
        { new: true }
      );

      if (!staff) {
        return NextResponse.json(
          { success: false, error: 'Staff not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          staff: staff.toJSON(),
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to update staff status');
    }
  }
}



