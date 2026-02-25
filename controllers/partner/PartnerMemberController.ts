import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import PartnerMember from '@/models/PartnerMember';
import { handleApiError } from '@/lib/middleware';

export class PartnerMemberController {
  /**
   * Get all partner members with pagination and filtering
   */
  static async getPartnerMembers(query: {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    partnerId?: string;
  }) {
    try {
      await connectDB();

      const page = parseInt(query.page || '1');
      const limit = parseInt(query.limit || '10');
      const skip = (page - 1) * limit;

      // Build filter object - always require partnerId so we never return all members across partners
      const filter: any = {};
      if (!query.partnerId) {
        return NextResponse.json(
          { success: false, error: 'Partner ID is required to list members' },
          { status: 400 }
        );
      }
      filter.partnerId = query.partnerId;
      
      if (query.search) {
        filter.$or = [
          { memberName: { $regex: query.search, $options: 'i' } },
          { email: { $regex: query.search, $options: 'i' } },
          { phoneNumber: { $regex: query.search, $options: 'i' } },
          { username: { $regex: query.search, $options: 'i' } },
        ];
      }

      if (query.status) {
        filter.status = query.status;
      }

      // Get partner members with pagination
      const members = await PartnerMember.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      // Get total count
      const total = await PartnerMember.countDocuments(filter);

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
      return handleApiError(error, 'Failed to get partner members');
    }
  }

  /**
   * Get partner member by ID
   */
  static async getPartnerMemberById(memberId: string, partnerId?: string) {
    try {
      await connectDB();

      const filter: any = { _id: memberId };
      if (partnerId) {
        filter.partnerId = partnerId;
      }

      const member = await PartnerMember.findOne(filter);
      if (!member) {
        return NextResponse.json(
          { success: false, error: 'Partner member not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          member: member.toJSON(),
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to get partner member');
    }
  }

  /**
   * Create new partner member
   */
  static async createPartnerMember(data: {
    partnerId: string;
    memberName: string;
    email: string;
    phoneNumber: string;
    memberImage?: string;
    username: string;
    password: string;
    status?: "active" | "disable";
    permissions: {
      dashboard: boolean;
      room: {
        rooms: boolean;
        requests: boolean;
      };
      support: {
        myTickets: boolean;
        ticketSaved: boolean;
      };
      team: {
        members: boolean;
        staff: boolean;
      };
      housekeeping: {
        requests: boolean;
        houseCleaning: boolean;
        requestManagement: boolean;
      };
      booking: {
        internalRequests: {
          allCategories: boolean;
          categoryName: boolean;
        };
        bookingSetting: boolean;
      };
      customizedServices: {
        requests: boolean;
      };
      activityAlert: {
        requests: boolean;
        activities: boolean;
      };
      laundry: {
        requests: boolean;
        setting: boolean;
      };
      inRoomDelivery: {
        requests: boolean;
        restaurantName: boolean;
        restaurantSetting: boolean;
      };
    };
  }) {
    try {
      await connectDB();

      // Check if member with email already exists for THIS specific partner only
      const existingMemberByEmail = await PartnerMember.findOne({
        partnerId: data.partnerId,
        email: data.email.toLowerCase().trim()
      });

      if (existingMemberByEmail) {
        return NextResponse.json(
          { success: false, error: 'A member with this email already exists for your partner account' },
          { status: 409 }
        );
      }

      // Check if member with username already exists for THIS specific partner only
      const existingMemberByUsername = await PartnerMember.findOne({
        partnerId: data.partnerId,
        username: data.username.trim()
      });

      if (existingMemberByUsername) {
        return NextResponse.json(
          { success: false, error: 'A member with this username already exists for your partner account' },
          { status: 409 }
        );
      }

      // Create new partner member (password will be hashed by pre-save hook in model)
      const member = new PartnerMember({
        partnerId: data.partnerId,
        memberName: data.memberName.trim(),
        email: data.email.toLowerCase().trim(),
        phoneNumber: data.phoneNumber.trim(),
        memberImage: data.memberImage || '',
        username: data.username.trim(),
        password: data.password, // Don't hash here - model will hash it
        role: "partnermember", // Automatically set role as partnermember
        status: data.status || 'active',
        permissions: data.permissions,
      });

      await member.save();

      return NextResponse.json({
        success: true,
        data: {
          member: member.toJSON(),
        },
      }, { status: 201 });
    } catch (error: any) {
      // Check for duplicate key error (MongoDB error code 11000)
      // This should not happen if our manual check above works, but handle it as a fallback
      if (error.code === 11000) {
        // Determine which field caused the duplicate from the keyPattern
        let duplicateField = 'email or username';
        let errorMessage = 'A member with this email or username already exists for your partner account';
        
        if (error.keyPattern) {
          if (error.keyPattern.email && error.keyPattern.partnerId) {
            duplicateField = 'email';
            errorMessage = 'A member with this email already exists for your partner account';
          } else if (error.keyPattern.username && error.keyPattern.partnerId) {
            duplicateField = 'username';
            errorMessage = 'A member with this username already exists for your partner account';
          }
        }
        return NextResponse.json(
          { success: false, error: errorMessage },
          { status: 409 }
        );
      }
      return handleApiError(error, 'Failed to create partner member');
    }
  }

  /**
   * Update partner member
   */
  static async updatePartnerMember(memberId: string, data: {
    partnerId?: string;
    memberName?: string;
    email?: string;
    phoneNumber?: string;
    memberImage?: string;
    username?: string;
    password?: string;
    status?: "active" | "disable";
    permissions?: {
      dashboard?: boolean;
      room?: {
        rooms?: boolean;
        requests?: boolean;
      };
      support?: {
        myTickets?: boolean;
        ticketSaved?: boolean;
      };
      team?: {
        members?: boolean;
        staff?: boolean;
      };
      housekeeping?: {
        requests?: boolean;
        houseCleaning?: boolean;
        requestManagement?: boolean;
      };
      booking?: {
        internalRequests?: {
          allCategories?: boolean;
          categoryName?: boolean;
        };
        bookingSetting?: boolean;
      };
      customizedServices?: {
        requests?: boolean;
      };
      activityAlert?: {
        requests?: boolean;
        activities?: boolean;
      };
      laundry?: {
        requests?: boolean;
        setting?: boolean;
      };
      inRoomDelivery?: {
        requests?: boolean;
        restaurantName?: boolean;
        restaurantSetting?: boolean;
      };
    };
  }) {
    try {
      await connectDB();

      const filter: any = { _id: memberId };
      if (data.partnerId) {
        filter.partnerId = data.partnerId;
      }

      const member = await PartnerMember.findOne(filter);
      if (!member) {
        return NextResponse.json(
          { success: false, error: 'Partner member not found' },
          { status: 404 }
        );
      }

      // Check if email or username is being changed and if it conflicts
      if (data.email || data.username) {
        const conflictFilter: any = {
          _id: { $ne: memberId },
          partnerId: data.partnerId || member.partnerId,
          $or: [
            ...(data.email ? [{ email: data.email.toLowerCase() }] : []),
            ...(data.username ? [{ username: data.username }] : []),
          ]
        };
        const existingMember = await PartnerMember.findOne(conflictFilter);

        if (existingMember) {
          return NextResponse.json(
            { success: false, error: 'Partner member with this email or username already exists' },
            { status: 409 }
          );
        }
      }

      // Update fields
      if (data.memberName) member.memberName = data.memberName.trim();
      if (data.email) member.email = data.email.toLowerCase().trim();
      if (data.phoneNumber) member.phoneNumber = data.phoneNumber.trim();
      if (data.memberImage !== undefined) member.memberImage = data.memberImage;
      if (data.username) member.username = data.username.trim();
      // Ensure role always remains "partnermember" for partner members
      member.role = "partnermember";
      if (data.status) member.status = data.status;

      // Update permissions if provided
      if (data.permissions) {
        if (data.permissions.dashboard !== undefined) {
          member.permissions.dashboard = data.permissions.dashboard;
        }
        if (data.permissions.room) {
          if (data.permissions.room.rooms !== undefined) {
            member.permissions.room.rooms = data.permissions.room.rooms;
          }
          if (data.permissions.room.requests !== undefined) {
            member.permissions.room.requests = data.permissions.room.requests;
          }
        }
        if (data.permissions.support) {
          if (data.permissions.support.myTickets !== undefined) {
            member.permissions.support.myTickets = data.permissions.support.myTickets;
          }
          if (data.permissions.support.ticketSaved !== undefined) {
            member.permissions.support.ticketSaved = data.permissions.support.ticketSaved;
          }
        }
        if (data.permissions.team) {
          if (data.permissions.team.members !== undefined) {
            member.permissions.team.members = data.permissions.team.members;
          }
          if (data.permissions.team.staff !== undefined) {
            member.permissions.team.staff = data.permissions.team.staff;
          }
        }
        if (data.permissions.housekeeping) {
          if (data.permissions.housekeeping.requests !== undefined) {
            member.permissions.housekeeping.requests = data.permissions.housekeeping.requests;
          }
          if (data.permissions.housekeeping.houseCleaning !== undefined) {
            member.permissions.housekeeping.houseCleaning = data.permissions.housekeeping.houseCleaning;
          }
          if (data.permissions.housekeeping.requestManagement !== undefined) {
            member.permissions.housekeeping.requestManagement = data.permissions.housekeeping.requestManagement;
          }
        }
        if (data.permissions.booking) {
          if (data.permissions.booking.internalRequests) {
            if (data.permissions.booking.internalRequests.allCategories !== undefined) {
              member.permissions.booking.internalRequests.allCategories = data.permissions.booking.internalRequests.allCategories;
            }
            if (data.permissions.booking.internalRequests.categoryName !== undefined) {
              member.permissions.booking.internalRequests.categoryName = data.permissions.booking.internalRequests.categoryName;
            }
          }
          if (data.permissions.booking.bookingSetting !== undefined) {
            member.permissions.booking.bookingSetting = data.permissions.booking.bookingSetting;
          }
        }
        if (data.permissions.customizedServices) {
          if (!member.permissions.customizedServices) {
            member.permissions.customizedServices = { requests: false };
          }
          if (data.permissions.customizedServices.requests !== undefined) {
            member.permissions.customizedServices.requests = data.permissions.customizedServices.requests;
          }
        }
        if (data.permissions.activityAlert) {
          if (data.permissions.activityAlert.requests !== undefined) {
            member.permissions.activityAlert.requests = data.permissions.activityAlert.requests;
          }
          if (data.permissions.activityAlert.activities !== undefined) {
            member.permissions.activityAlert.activities = data.permissions.activityAlert.activities;
          }
        }
        if (data.permissions.laundry) {
          if (data.permissions.laundry.requests !== undefined) {
            member.permissions.laundry.requests = data.permissions.laundry.requests;
          }
          if (data.permissions.laundry.setting !== undefined) {
            member.permissions.laundry.setting = data.permissions.laundry.setting;
          }
        }
        if (data.permissions.inRoomDelivery) {
          if (data.permissions.inRoomDelivery.requests !== undefined) {
            member.permissions.inRoomDelivery.requests = data.permissions.inRoomDelivery.requests;
          }
          if (data.permissions.inRoomDelivery.restaurantName !== undefined) {
            member.permissions.inRoomDelivery.restaurantName = data.permissions.inRoomDelivery.restaurantName;
          }
          if (data.permissions.inRoomDelivery.restaurantSetting !== undefined) {
            member.permissions.inRoomDelivery.restaurantSetting = data.permissions.inRoomDelivery.restaurantSetting;
          }
        }
      }

      // Update password if provided (will be hashed by pre-save hook)
      if (data.password) {
        if (data.password.length < 6) {
          return NextResponse.json(
            { success: false, error: 'Password must be at least 6 characters long' },
            { status: 400 }
          );
        }
        member.password = data.password; // Don't hash here - model will hash it
      }

      await member.save();

      return NextResponse.json({
        success: true,
        data: {
          member: member.toJSON(),
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to update partner member');
    }
  }

  /**
   * Delete partner member
   */
  static async deletePartnerMember(memberId: string, partnerId?: string) {
    try {
      await connectDB();

      const filter: any = { _id: memberId };
      if (partnerId) {
        filter.partnerId = partnerId;
      }

      const member = await PartnerMember.findOne(filter);
      if (!member) {
        return NextResponse.json(
          { success: false, error: 'Partner member not found' },
          { status: 404 }
        );
      }

      await PartnerMember.findOneAndDelete(filter);

      return NextResponse.json({
        success: true,
        message: 'Partner member deleted successfully',
      });
    } catch (error) {
      return handleApiError(error, 'Failed to delete partner member');
    }
  }

  /**
   * Update partner member status (toggle active/disable)
   */
  static async updatePartnerMemberStatus(memberId: string, status: "active" | "disable", partnerId?: string) {
    try {
      await connectDB();

      const filter: any = { _id: memberId };
      if (partnerId) {
        filter.partnerId = partnerId;
      }

      const member = await PartnerMember.findOneAndUpdate(
        filter,
        { status },
        { new: true }
      );

      if (!member) {
        return NextResponse.json(
          { success: false, error: 'Partner member not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          member: member.toJSON(),
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to update partner member status');
    }
  }
}












