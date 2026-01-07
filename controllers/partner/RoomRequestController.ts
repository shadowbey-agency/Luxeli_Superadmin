import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import RoomRequest from '@/models/Roomrequest';

export class RoomRequestController {
  /**
   * Get all room requests for a partner with pagination and filters
   */
  static async getRoomRequests(
    query: {
      page?: string;
      limit?: string;
      status?: string;
      roomId?: string;
    },
    partnerId: string
  ) {
    try {
      await connectDB();

      const page = parseInt(query.page || '1', 10);
      const limit = parseInt(query.limit || '20', 10);
      const skip = (page - 1) * limit;

      // Build filter
      const filter: any = { partnerId };
      if (query.status) {
        filter.requestStatus = query.status;
      }
      if (query.roomId) {
        filter.roomId = query.roomId;
      }

      const [requests, total] = await Promise.all([
        RoomRequest.find(filter)
          .sort({ requestedAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        RoomRequest.countDocuments(filter),
      ]);

      return NextResponse.json({
        success: true,
        data: requests,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      console.error('Get Room Requests Error:', error);
      return NextResponse.json(
        { success: false, error: error?.message || 'Internal server error' },
        { status: 500 }
      );
    }
  }

  /**
   * Get single room request by ID
   */
  static async getRoomRequestById(
    requestId: string,
    partnerId: string
  ) {
    try {
      await connectDB();

      const request = await RoomRequest.findOne({
        _id: requestId,
        partnerId,
      }).lean();

      if (!request) {
        return NextResponse.json(
          { success: false, error: 'Room request not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: request,
      });
    } catch (error: any) {
      console.error('Get Room Request By ID Error:', error);
      return NextResponse.json(
        { success: false, error: error?.message || 'Internal server error' },
        { status: 500 }
      );
    }
  }

  /**
   * Create new room request - Simple insert
   */
  static async createRoomRequest(
    partnerId: string,
    body: {
      roomId: string;
      roomName: string;
      guestName: string;
      guestPhone: string;
    }
  ) {
    try {
      await connectDB();

      const newRequest = await RoomRequest.create({
        partnerId,
        roomId: body.roomId,
        roomName: body.roomName,
        guestName: body.guestName,
        guestPhone: body.guestPhone,
        requestStatus: 'pending',
        requestedAt: new Date(),
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Room request created successfully',
          data: newRequest,
        },
        { status: 201 }
      );
    } catch (error: any) {
      console.error('Create Room Request Error:', error);
      return NextResponse.json(
        { success: false, error: error?.message || 'Internal server error' },
        { status: 500 }
      );
    }
  }

  /**
   * Update room request status - Simple update
   */
  static async updateRoomRequestStatus(
    requestId: string,
    partnerId: string,
    body: {
      requestStatus: 'pending' | 'approved' | 'rejected';
    }
  ) {
    try {
      await connectDB();

      const request = await RoomRequest.findOneAndUpdate(
        { _id: requestId, partnerId },
        {
          requestStatus: body.requestStatus,
          approvedAt: body.requestStatus === 'approved' ? new Date() : undefined,
        },
        { new: true }
      );

      if (!request) {
        return NextResponse.json(
          { success: false, error: 'Room request not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Room request updated successfully',
        data: request,
      });
    } catch (error: any) {
      console.error('Update Room Request Status Error:', error);
      return NextResponse.json(
        { success: false, error: error?.message || 'Internal server error' },
        { status: 500 }
      );
    }
  }

  /**
   * Approve room request
   */
  static async approveRoomRequest(
    requestId: string,
    partnerId: string
  ) {
    try {
      await connectDB();

      const request = await RoomRequest.findOneAndUpdate(
        { _id: requestId, partnerId },
        {
          requestStatus: 'approved',
          approvedAt: new Date(),
        },
        { new: true }
      );

      if (!request) {
        return NextResponse.json(
          { success: false, error: 'Room request not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Room request approved successfully',
        data: request,
      });
    } catch (error: any) {
      console.error('Approve Room Request Error:', error);
      return NextResponse.json(
        { success: false, error: error?.message || 'Internal server error' },
        { status: 500 }
      );
    }
  }

  /**
   * Reject room request
   */
  static async rejectRoomRequest(
    requestId: string,
    partnerId: string
  ) {
    try {
      await connectDB();

      const request = await RoomRequest.findOneAndUpdate(
        { _id: requestId, partnerId },
        {
          requestStatus: 'rejected',
        },
        { new: true }
      );

      if (!request) {
        return NextResponse.json(
          { success: false, error: 'Room request not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Room request rejected successfully',
        data: request,
      });
    } catch (error: any) {
      console.error('Reject Room Request Error:', error);
      return NextResponse.json(
        { success: false, error: error?.message || 'Internal server error' },
        { status: 500 }
      );
    }
  }

  /**
   * Delete room request
   */
  static async deleteRoomRequest(
    requestId: string,
    partnerId: string
  ) {
    try {
      await connectDB();

      const request = await RoomRequest.findOneAndDelete({
        _id: requestId,
        partnerId,
      });

      if (!request) {
        return NextResponse.json(
          { success: false, error: 'Room request not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Room request deleted successfully',
      });
    } catch (error: any) {
      console.error('Delete Room Request Error:', error);
      return NextResponse.json(
        { success: false, error: error?.message || 'Internal server error' },
        { status: 500 }
      );
    }
  }

  /**
   * Get room request statistics
   */
  static async getRequestStats(partnerId: string) {
    try {
      await connectDB();

      const stats = await RoomRequest.aggregate([
        { $match: { partnerId } },
        {
          $group: {
            _id: '$requestStatus',
            count: { $sum: 1 },
          },
        },
      ]);

      const formattedStats = {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
      };

      stats.forEach((stat: any) => {
        formattedStats[stat._id as keyof typeof formattedStats] = stat.count;
        formattedStats.total += stat.count;
      });

      return NextResponse.json({
        success: true,
        data: formattedStats,
      });
    } catch (error: any) {
      console.error('Get Request Stats Error:', error);
      return NextResponse.json(
        { success: false, error: error?.message || 'Internal server error' },
        { status: 500 }
      );
    }
  }
}
