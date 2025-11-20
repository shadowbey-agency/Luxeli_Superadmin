import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Partner from '@/models/Partner';
import Staff from '@/models/Staff';
import Room from '@/models/Room';
import Guest from '@/models/Guest';
import { handleApiError } from '@/lib/middleware';

export class PartnerController {
  /**
   * Get all partners with pagination and filtering
   */
  static async getPartners(query: {
    page?: string;
    limit?: string;
    search?: string;
    hotelCity?: string;
    plan?: string;
    isActive?: string;
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
          { hotelName: { $regex: query.search, $options: 'i' } },
          { hotelCity: { $regex: query.search, $options: 'i' } },
          { hotelAddressEmail: { $regex: query.search, $options: 'i' } },
          { username: { $regex: query.search, $options: 'i' } },
        ];
      }

      if (query.hotelCity) {
        filter.hotelCity = query.hotelCity;
      }

      if (query.plan) {
        filter.plan = query.plan;
      }

      if (query.isActive !== undefined) {
        filter.status = query.isActive === 'true' ? 'active' : 'disable';
      }

      // Get partners with pagination
      const partners = await Partner.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      // Get total count
      const total = await Partner.countDocuments(filter);

      return NextResponse.json({
        partners,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to get partners');
    }
  }

  /**
   * Get partner by ID
   */
  static async getPartnerById(partnerId: string) {
    try {
      await connectDB();

      const partner = await Partner.findById(partnerId);
      if (!partner) {
        return NextResponse.json(
          { error: 'Partner not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        partner: partner.toJSON(),
      });
    } catch (error) {
      return handleApiError(error, 'Failed to get partner');
    }
  }

  /**
   * Create new partner
   */
  static async createPartner(data: {
    hotelName: string;
    hotelCity: string;
    hotelAddressEmail: string;
    phoneNumber: string;
    RC: string;
    ICE: string;
    identifiantFiscal: string;
    taxeProfessionnelle: string;
    hotelImage?: string;
    username: string;
    password: string;
    startDate: Date;
    endDate: Date;
    plan: 'starter pack' | 'gold pack';
    services: string[];
  }) {
    try {
      await connectDB();

      // Check if partner already exists (less strict validation)
      try {
        const existingEmail = await Partner.findOne({ hotelAddressEmail: data.hotelAddressEmail });
        if (existingEmail) {
          console.log(`Email conflict: ${data.hotelAddressEmail} already exists`);
          return NextResponse.json(
            { error: `Email '${data.hotelAddressEmail}' is already registered. Please use a different email.` },
            { status: 409 }
          );
        }

        const existingUsername = await Partner.findOne({ username: data.username });
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

      const partner = new Partner(data);
      await partner.save();

      return NextResponse.json({
        success: true,
        message: 'Partner created successfully',
        data: partner.toJSON(),
        partner: partner.toJSON(),
      });
    } catch (error) {
      console.log('Partner creation error:', error);
      
      // Handle specific MongoDB duplicate key errors
      if ((error as any).code === 11000) {
        const field = Object.keys((error as any).keyPattern)[0];
        const value = (error as any).keyValue[field];
        
        console.log('MongoDB duplicate key error:', { field, value, keyPattern: (error as any).keyPattern });
        
        if (field === 'hotelAddressEmail') {
          return NextResponse.json(
            { success: false, error: `Email '${value}' is already registered. Please use a different email.` },
            { status: 409 }
          );
        } else if (field === 'username') {
          return NextResponse.json(
            { success: false, error: `Username '${value}' is already taken. Please choose a different username.` },
            { status: 409 }
          );
        } else if (field === 'email') {
          // Handle old email field conflicts
          return NextResponse.json(
            { success: false, error: `Email '${value || 'null'}' conflicts with existing data. Please use a different email.` },
            { status: 409 }
          );
        } else {
          return NextResponse.json(
            { success: false, error: `Duplicate entry found for ${field}: ${value || 'null'}` },
            { status: 409 }
          );
        }
      }
      
      return handleApiError(error, 'Failed to create partner');
    }
  }

  /**
   * Update partner
   */
  static async updatePartner(partnerId: string, data: Partial<{
    hotelName: string;
    hotelCity: string;
    hotelAddressEmail: string;
    phoneNumber: string;
    RC: string;
    ICE: string;
    identifiantFiscal: string;
    taxeProfessionnelle: string;
    hotelImage: string;
    username: string;
    startDate: Date;
    endDate: Date;
    plan: 'starter pack' | 'gold pack';
    services: string[];
    status: string;
  }>) {
    try {
      await connectDB();

      const partner = await Partner.findById(partnerId);
      if (!partner) {
        return NextResponse.json(
          { error: 'Partner not found' },
          { status: 404 }
        );
      }

      // Check if hotelAddressEmail is being changed and if it's already taken
      if (data.hotelAddressEmail && data.hotelAddressEmail !== partner.hotelAddressEmail) {
        const existingPartner = await Partner.findOne({ hotelAddressEmail: data.hotelAddressEmail });
        if (existingPartner) {
          return NextResponse.json(
            { success: false, error: 'Hotel address email already taken' },
            { status: 409 }
          );
        }
      }

      // Check if username is being changed and if it's already taken
      if (data.username && data.username !== partner.username) {
        const existingUsername = await Partner.findOne({ username: data.username });
        if (existingUsername) {
          return NextResponse.json(
            { success: false, error: 'Username already taken' },
            { status: 409 }
          );
        }
      }

      // Only apply fields that are explicitly provided (not undefined)
      const updates = Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== undefined)
      );
      Object.assign(partner, updates);
      await partner.save();

      return NextResponse.json({
        success: true,
        message: 'Partner updated successfully',
        data: partner.toJSON(),
        partner: partner.toJSON(),
      });
    } catch (error) {
      return handleApiError(error, 'Failed to update partner');
    }
  }

  /**
   * Delete partner
   */
  static async deletePartner(partnerId: string) {
    try {
      await connectDB();

      const partner = await Partner.findById(partnerId);
      if (!partner) {
        return NextResponse.json(
          { error: 'Partner not found' },
          { status: 404 }
        );
      }

      await Partner.findByIdAndDelete(partnerId);

      return NextResponse.json({
        message: 'Partner deleted successfully',
      });
    } catch (error) {
      return handleApiError(error, 'Failed to delete partner');
    }
  }

  /**
   * Get partner statistics
   */
  static async getPartnerStats() {
    try {
      await connectDB();

      const stats = await Partner.aggregate([
        {
          $group: {
            _id: null,
            totalPartners: { $sum: 1 },
            activePartners: {
              $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
            },
            verifiedPartners: {
              $sum: { $cond: [{ $eq: ['$isVerified', true] }, 1, 0] }
            },
            byBusinessType: {
              $push: {
                type: '$businessType',
                status: '$status'
              }
            },
            bySubscriptionPlan: {
              $push: {
                plan: '$subscriptionPlan',
                status: '$subscriptionStatus'
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            totalPartners: 1,
            activePartners: 1,
            verifiedPartners: 1,
            businessTypeStats: {
              $reduce: {
                input: '$byBusinessType',
                initialValue: {},
                in: {
                  $mergeObjects: [
                    '$$value',
                    {
                      $let: {
                        vars: {
                          type: '$$this.type',
                          status: '$$this.status'
                        },
                        in: {
                          $mergeObjects: [
                            { $ifNull: [{ $getField: { field: '$$type', input: '$$value' } }, { total: 0, active: 0 }] },
                            {
                              total: { $add: [{ $ifNull: [{ $getField: { field: 'total', input: { $getField: { field: '$$type', input: '$$value' } } } }, 0] }, 1] },
                              active: { $add: [{ $ifNull: [{ $getField: { field: 'active', input: { $getField: { field: '$$type', input: '$$value' } } } }, 0] }, { $cond: [{ $eq: ['$$status', 'active'] }, 1, 0] }] }
                            }
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            },
            subscriptionStats: {
              $reduce: {
                input: '$bySubscriptionPlan',
                initialValue: {},
                in: {
                  $mergeObjects: [
                    '$$value',
                    {
                      $let: {
                        vars: {
                          plan: '$$this.plan',
                          status: '$$this.status'
                        },
                        in: {
                          $mergeObjects: [
                            { $ifNull: [{ $getField: { field: '$$plan', input: '$$value' } }, { total: 0, active: 0 }] },
                            {
                              total: { $add: [{ $ifNull: [{ $getField: { field: 'total', input: { $getField: { field: '$$plan', input: '$$value' } } } }, 0] }, 1] },
                              active: { $add: [{ $ifNull: [{ $getField: { field: 'active', input: { $getField: { field: '$$plan', input: '$$value' } } } }, 0] }, { $cond: [{ $eq: ['$$status', 'active'] }, 1, 0] }] }
                            }
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      ]);

      return NextResponse.json({
        stats: stats[0] || {
          totalPartners: 0,
          activePartners: 0,
          verifiedPartners: 0,
          businessTypeStats: {},
          subscriptionStats: {}
        }
      });
    } catch (error) {
      return handleApiError(error, 'Failed to get partner statistics');
    }
  }

  /**
   * Get partner services statistics (total staff, rooms, and clients across all partners)
   */
  static async getPartnerServicesStats() {
    try {
      await connectDB();

      // Calculate date ranges
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      todayStart.setHours(0, 0, 0, 0);
      const yesterdayStart = new Date(todayStart);
      yesterdayStart.setDate(yesterdayStart.getDate() - 1);
      const yesterdayEnd = new Date(todayStart);
      yesterdayEnd.setMilliseconds(yesterdayEnd.getMilliseconds() - 1);

      // Get all partner IDs (convert ObjectId to string for matching)
      const partners = await Partner.find({}).select('_id').lean();
      const partnerIds = partners.map(p => String(p._id));

      // Count all staff across all partners (current)
      const totalStaff = partnerIds.length > 0 
        ? await Staff.countDocuments({
            partnerId: { $in: partnerIds }
          })
        : 0;

      // Count all rooms across all partners (current)
      const totalRooms = partnerIds.length > 0
        ? await Room.countDocuments({
            partnerId: { $in: partnerIds }
          })
        : 0;

      // Count all guests/clients assigned to rooms across all partners (current)
      const totalClients = partnerIds.length > 0
        ? await Guest.countDocuments({
            partnerId: { $in: partnerIds }
          })
        : 0;

      // Count as of end of yesterday
      const totalStaffYesterday = partnerIds.length > 0
        ? await Staff.countDocuments({
            partnerId: { $in: partnerIds },
            createdAt: { $lte: yesterdayEnd }
          })
        : 0;

      const totalRoomsYesterday = partnerIds.length > 0
        ? await Room.countDocuments({
            partnerId: { $in: partnerIds },
            createdAt: { $lte: yesterdayEnd }
          })
        : 0;

      const totalClientsYesterday = partnerIds.length > 0
        ? await Guest.countDocuments({
            partnerId: { $in: partnerIds },
            createdAt: { $lte: yesterdayEnd }
          })
        : 0;

      // Helper function to calculate percentage change
      const calculateChange = (current: number, previous: number): { change: string; changeType: "positive" | "negative" | "neutral" } => {
        if (previous === 0) {
          return current > 0 
            ? { change: "+100%", changeType: "positive" }
            : { change: "0%", changeType: "neutral" };
        }
        const percentChange = ((current - previous) / previous) * 100;
        const rounded = Math.round(percentChange * 10) / 10;
        const sign = rounded >= 0 ? "+" : "";
        return {
          change: `${sign}${rounded}%`,
          changeType: rounded > 0 ? "positive" : rounded < 0 ? "negative" : "neutral"
        };
      };

      return NextResponse.json({
        success: true,
        stats: {
          totalStaff,
          totalRooms,
          totalClients,
          // Yesterday's counts for comparison
          yesterday: {
            totalStaff: totalStaffYesterday,
            totalRooms: totalRoomsYesterday,
            totalClients: totalClientsYesterday
          },
          // Percentage changes
          changes: {
            totalStaff: calculateChange(totalStaff, totalStaffYesterday),
            totalRooms: calculateChange(totalRooms, totalRoomsYesterday),
            totalClients: calculateChange(totalClients, totalClientsYesterday)
          }
        }
      });
    } catch (error) {
      return handleApiError(error, 'Failed to get partner services statistics');
    }
  }

  /**
   * Get client/guest statistics for superadmin dashboard (Total Requests graph)
   */
  static async getClientStats() {
    try {
      await connectDB();

      // Calculate date ranges
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      todayStart.setHours(0, 0, 0, 0);
      const yesterdayStart = new Date(todayStart);
      yesterdayStart.setDate(yesterdayStart.getDate() - 1);
      const yesterdayEnd = new Date(todayStart);
      yesterdayEnd.setMilliseconds(yesterdayEnd.getMilliseconds() - 1);

      // Get all partner IDs
      const partners = await Partner.find({}).select('_id').lean();
      const partnerIds = partners.map(p => String(p._id));

      // Count all clients (current)
      const totalClients = partnerIds.length > 0
        ? await Guest.countDocuments({
            partnerId: { $in: partnerIds }
          })
        : 0;

      // Count active clients (current)
      const activeClients = partnerIds.length > 0
        ? await Guest.countDocuments({
            partnerId: { $in: partnerIds },
            isActive: true
          })
        : 0;

      // Count inactive clients (current)
      const inactiveClients = totalClients - activeClients;

      // Count clients as of end of yesterday
      const totalClientsYesterday = partnerIds.length > 0
        ? await Guest.countDocuments({
            partnerId: { $in: partnerIds },
            createdAt: { $lte: yesterdayEnd }
          })
        : 0;

      // Calculate percentage change
      const calculateChange = (current: number, previous: number): { change: string; changeType: "positive" | "negative" | "neutral" } => {
        if (previous === 0) {
          return current > 0 
            ? { change: "+100%", changeType: "positive" }
            : { change: "0%", changeType: "neutral" };
        }
        const percentChange = ((current - previous) / previous) * 100;
        const rounded = Math.round(percentChange * 10) / 10;
        const sign = rounded >= 0 ? "+" : "";
        return {
          change: `${sign}${rounded}%`,
          changeType: rounded > 0 ? "positive" : rounded < 0 ? "negative" : "neutral"
        };
      };

      const percentageChange = calculateChange(totalClients, totalClientsYesterday);

      return NextResponse.json({
        success: true,
        stats: {
          totalClients,
          activeClients,
          inactiveClients,
          totalClientsYesterday,
          percentageChange: percentageChange.change,
          isIncrease: percentageChange.changeType === "positive"
        }
      });
    } catch (error) {
      return handleApiError(error, 'Failed to get client statistics');
    }
  }
}
