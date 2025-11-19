import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SpecialRequest from '@/models/specials/SpecialRequest';
import Guest from '@/models/Guest';
import { handleApiError } from '@/lib/middleware';

export class UserSpecialController {
  /**
   * Get available specials for guests
   * GET /api/specials
   * Auth: Guest JWT
   */
  static async getSpecials(
    userId: string,
    partnerId: string,
    query: {
      page?: string;
      limit?: string;
    }
  ) {
    try {
      await connectDB();

      // Verify guest exists and is active
      const guest = await Guest.findById(userId);
      if (!guest) {
        return NextResponse.json(
          { success: false, error: 'Guest not found' },
          { status: 404 }
        );
      }

      if (!guest.isActive) {
        return NextResponse.json(
          { success: false, error: 'Guest has been checked out' },
          { status: 403 }
        );
      }

      // For now, we'll return a static list of specials
      // In a real implementation, this would fetch from a specials collection
      const specials = [
        {
          id: '1',
          title: '20% Off Spa Services',
          description: 'Enjoy 20% off any spa treatment',
          type: 'discount',
          discount: 20,
          startDate: new Date(),
          endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
          status: 'active',
          imageUrl: 'https://picsum.photos/200/200?random=1',
        },
        {
          id: '2',
          title: 'Free Room Upgrade',
          description: 'Complimentary upgrade to the next room category',
          type: 'service',
          discount: 0,
          startDate: new Date(),
          endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
          status: 'active',
          imageUrl: 'https://picsum.photos/200/200?random=2',
        },
        {
          id: '3',
          title: 'Dinner for Two',
          description: 'Complimentary dinner for two at our signature restaurant',
          type: 'service',
          discount: 0,
          startDate: new Date(),
          endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
          status: 'active',
          imageUrl: 'https://picsum.photos/200/200?random=3',
        }
      ];

      return NextResponse.json({
        success: true,
        data: {
          specials,
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to fetch specials');
    }
  }

  /**
   * Redeem a special offer
   * POST /api/specials/:id/redeem
   * Auth: Guest JWT
   */
  static async redeemSpecial(
    userId: string,
    partnerId: string,
    specialId: string,
    data: {
      title: string;
      description: string;
      type: string;
      discount: number;
    }
  ) {
    try {
      await connectDB();

      // Verify guest exists and is active
      const guest = await Guest.findById(userId);
      if (!guest) {
        return NextResponse.json(
          { success: false, error: 'Guest not found' },
          { status: 404 }
        );
      }

      if (!guest.isActive) {
        return NextResponse.json(
          { success: false, error: 'Guest has been checked out' },
          { status: 403 }
        );
      }

      // Validate required fields
      if (!data.title || !data.type) {
        return NextResponse.json(
          { success: false, error: 'title and type are required fields' },
          { status: 400 }
        );
      }

      // Create special request record
      const specialRequest = new SpecialRequest({
        userId,
        specialId,
        title: data.title,
        description: data.description,
        type: data.type,
        discount: data.discount || 0,
        redemptionDate: new Date(),
        status: 'Redeemed',
      });

      await specialRequest.save();

      return NextResponse.json({
        success: true,
        message: 'Special redeemed successfully',
        data: { special: specialRequest.toJSON() },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to redeem special');
    }
  }

  /**
   * Get guest's redeemed specials
   * GET /api/specials/my
   * Auth: Guest JWT
   */
  static async getMySpecials(
    userId: string,
    query: {
      page?: string;
      limit?: string;
      status?: string;
    }
  ) {
    try {
      await connectDB();

      // Verify guest exists and is active
      const guest = await Guest.findById(userId);
      if (!guest) {
        return NextResponse.json(
          { success: false, error: 'Guest not found' },
          { status: 404 }
        );
      }

      if (!guest.isActive) {
        return NextResponse.json(
          { success: false, error: 'Guest has been checked out' },
          { status: 403 }
        );
      }

      // Pagination
      const page = parseInt(query.page || '1', 10);
      const limit = parseInt(query.limit || '20', 10);
      const skip = (page - 1) * limit;

      // Build filter
      const filter: any = {
        userId,
      };

      if (query.status) {
        filter.status = query.status;
      }

      // Fetch redeemed specials
      const specials = await SpecialRequest.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await SpecialRequest.countDocuments(filter);

      return NextResponse.json({
        success: true,
        data: {
          specials,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to fetch redeemed specials');
    }
  }
}