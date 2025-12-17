import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Ticket from '@/models/Ticket';
import Partner from '@/models/Partner';
import { handleApiError } from '@/lib/middleware';

export class TicketController {
  /**
   * Get all tickets with pagination and filtering
   */
  static async getTickets(
    query: {
      page?: string;
      limit?: string;
      search?: string;
      status?: string;
      priority?: string;
    },
    partnerId: string
  ) {
    try {
      await connectDB();

      const page = parseInt(query.page || '1');
      const limit = parseInt(query.limit || '10');
      const skip = (page - 1) * limit;

      // Build filter object
      // Partner scope is mandatory for partner endpoints
      const filter: any = { partnerId };

      if (query.search) {
        filter.$or = [
          { title: { $regex: query.search, $options: 'i' } },
          { description: { $regex: query.search, $options: 'i' } },
          { ticketId: { $regex: query.search, $options: 'i' } },
        ];
      }

      if (query.status) {
        filter.status = query.status;
      }

      if (query.priority) {
        filter.priority = query.priority;
      }

      // Get tickets with pagination
      const tickets = await Ticket.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      // Get total count
      const total = await Ticket.countDocuments(filter);

      return NextResponse.json({
        success: true,
        data: {
          tickets,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to get tickets');
    }
  }

  /**
   * Get ticket by ID
   */
  static async getTicketById(ticketId: string) {
    try {
      await connectDB();

      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
        return NextResponse.json(
          { success: false, error: 'Ticket not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          ticket: ticket.toJSON(),
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to get ticket');
    }
  }

  /**
   * Create new ticket
   */
  static async createTicket(data: {
    title: string;
    description: string;
    priority?: "low" | "medium" | "urgent";
    image?: string;
    status?: "open" | "new" | "reopened" | "pending" | "resolved" | "canceled";
    assignee?: {
      name: string;
      profilePic?: string;
    };
  }, partnerId: string) {
    try {
      await connectDB();

      if (!data.title || !data.description) {
        return NextResponse.json(
          { success: false, error: 'Title and description are required' },
          { status: 400 }
        );
      }

      // Create new ticket
      const ticket = new Ticket({
        partnerId,
        title: data.title.trim(),
        description: data.description.trim(),
        priority: data.priority || 'low',
        image: data.image || undefined,
        status: data.status || 'open',
        assignee: data.assignee || undefined,
      });

      await ticket.save();

      return NextResponse.json({
        success: true,
        data: {
          ticket: ticket.toJSON(),
        },
      }, { status: 201 });
    } catch (error) {
      return handleApiError(error, 'Failed to create ticket');
    }
  }

  /**
   * Update ticket
   * @param ticketId - Ticket ID to update
   * @param data - Update data
   * @param partnerId - Partner ID for ownership check (null for superadmin)
   */
  static async updateTicket(ticketId: string, data: {
    title?: string;
    description?: string;
    priority?: "low" | "medium" | "urgent";
    image?: string;
    status?: "open" | "new" | "reopened" | "pending" | "resolved" | "canceled";
    assignee?: {
      name: string;
      profilePic?: string;
    };
  }, partnerId: string | null = null) {
    try {
      await connectDB();

      // Validate ticketId format (MongoDB ObjectId)
      if (!ticketId || ticketId.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(ticketId)) {
        return NextResponse.json(
          { success: false, error: 'Invalid ticket ID format' },
          { status: 400 }
        );
      }

      // First check if ticket exists and verify ownership
      const existingTicket = await Ticket.findById(ticketId).lean();
      if (!existingTicket) {
        return NextResponse.json(
          { success: false, error: 'Ticket not found' },
          { status: 404 }
        );
      }

      // If partnerId is provided (not superadmin), verify ownership
      if (partnerId !== null && existingTicket.partnerId !== partnerId) {
        return NextResponse.json(
          { success: false, error: 'You do not have permission to update this ticket' },
          { status: 403 }
        );
      }

      // Build update object with only the fields that are provided
      const updateData: any = {};
      if (data.title !== undefined) {
        updateData.title = data.title.trim();
      }
      if (data.description !== undefined) {
        updateData.description = data.description.trim();
      }
      if (data.priority !== undefined) {
        updateData.priority = data.priority;
      }
      if (data.image !== undefined) {
        updateData.image = data.image;
      }
      if (data.status !== undefined) {
        // Validate status against enum
        const validStatuses = ["open", "new", "reopened", "pending", "resolved", "canceled"];
        if (!validStatuses.includes(data.status)) {
          return NextResponse.json(
            { success: false, error: `Invalid status "${data.status}". Must be one of: ${validStatuses.join(', ')}` },
            { status: 400 }
          );
        }
        updateData.status = data.status;
      }
      if (data.assignee !== undefined) {
        updateData.assignee = data.assignee;
      }

      // Use findByIdAndUpdate to update only specified fields
      // This avoids validation issues with required fields that aren't being updated
      const ticket = await Ticket.findByIdAndUpdate(
        ticketId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!ticket) {
        return NextResponse.json(
          { success: false, error: 'Ticket not found after update' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          ticket: ticket.toJSON(),
        },
      });
    } catch (error: any) {
      console.error('Update ticket error:', error);
      // Check if it's a validation error
      if (error?.name === 'ValidationError') {
        const errorMessage = error?.errors
          ? Object.values(error.errors).map((e: any) => e.message).join(', ')
          : error?.message || 'Validation error';
        return NextResponse.json(
          { success: false, error: errorMessage },
          { status: 400 }
        );
      }
      return handleApiError(error, 'Failed to update ticket');
    }
  }

  /**
   * Delete ticket
   * @param ticketId - Ticket ID to delete
   * @param partnerId - Partner ID for ownership check (null for superadmin)
   */
  static async deleteTicket(ticketId: string, partnerId: string | null = null) {
    try {
      await connectDB();

      // Validate ticketId format (MongoDB ObjectId)
      if (!ticketId || ticketId.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(ticketId)) {
        return NextResponse.json(
          { success: false, error: 'Invalid ticket ID format' },
          { status: 400 }
        );
      }

      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
        return NextResponse.json(
          { success: false, error: 'Ticket not found' },
          { status: 404 }
        );
      }

      // If partnerId is provided (not superadmin), verify ownership
      if (partnerId !== null && ticket.partnerId !== partnerId) {
        return NextResponse.json(
          { success: false, error: 'You do not have permission to delete this ticket' },
          { status: 403 }
        );
      }

      await Ticket.findByIdAndDelete(ticketId);

      return NextResponse.json({
        success: true,
        message: 'Ticket deleted successfully',
      });
    } catch (error) {
      return handleApiError(error, 'Failed to delete ticket');
    }
  }

  /**
   * Update ticket status
   */
  static async updateTicketStatus(ticketId: string, status: "open" | "new" | "reopened" | "pending" | "resolved" | "canceled") {
    try {
      await connectDB();

      const ticket = await Ticket.findByIdAndUpdate(
        ticketId,
        { status },
        { new: true }
      );

      if (!ticket) {
        return NextResponse.json(
          { success: false, error: 'Ticket not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          ticket: ticket.toJSON(),
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to update ticket status');
    }
  }

  /**
   * Get all tickets from all partners (for superadmin)
   * Sorted by priority: urgent first, then medium, then low
   */
  static async getAllTicketsForSuperAdmin(query: {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    priority?: string;
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
          { title: { $regex: query.search, $options: 'i' } },
          { description: { $regex: query.search, $options: 'i' } },
          { ticketId: { $regex: query.search, $options: 'i' } },
          { superadminTicketId: { $regex: query.search, $options: 'i' } },
        ];
      }

      if (query.status) {
        filter.status = query.status;
      }

      if (query.priority) {
        filter.priority = query.priority;
      }

      // Get all tickets with pagination - simple queue order (by creation date, oldest first)
      const allTickets = await Ticket.find(filter)
        .sort({ createdAt: 1 }) // Oldest first (simple queue)
        .lean();

      // Ensure all tickets have superadminTicketId (for existing tickets that don't have one)
      const ticketsNeedingId = allTickets.filter(t => !t.superadminTicketId);
      if (ticketsNeedingId.length > 0) {
        // Find the highest existing superadminTicketId
        const ticketsWithId = await Ticket.find({
          superadminTicketId: { $exists: true, $regex: /^#\d+$/ }
        })
          .select('superadminTicketId')
          .lean();

        let nextNumber = 1;
        if (ticketsWithId.length > 0) {
          const numbers = ticketsWithId
            .map(t => {
              const match = t.superadminTicketId?.match(/#(\d+)/);
              return match ? parseInt(match[1], 10) : 0;
            })
            .filter(n => !isNaN(n));

          if (numbers.length > 0) {
            nextNumber = Math.max(...numbers) + 1;
          }
        }

        // Assign superadminTicketId to tickets that don't have one
        for (const ticket of ticketsNeedingId) {
          const superadminTicketId = `#${String(nextNumber).padStart(5, "0")}`;
          await Ticket.findByIdAndUpdate(ticket._id, { superadminTicketId });
          ticket.superadminTicketId = superadminTicketId;
          nextNumber++;
        }
      }

      // Apply pagination
      const tickets = allTickets.slice(skip, skip + limit);

      // Get total count
      const total = await Ticket.countDocuments(filter);

      // Get all partner IDs to fetch partner info
      const partnerIds = [...new Set(tickets.map(t => t.partnerId))];
      const partners = await Partner.find({ _id: { $in: partnerIds } })
        .select('_id hotelName hotelAddressEmail')
        .lean();

      // Create a map of partnerId to partner info
      const partnerMap = new Map(
        partners.map(p => [String(p._id), { hotelName: p.hotelName, hotelEmail: p.hotelAddressEmail }])
      );

      // Enrich tickets with partner information
      const enrichedTickets = tickets.map(ticket => ({
        ...ticket,
        partner: partnerMap.get(ticket.partnerId) || { hotelName: 'Unknown', hotelEmail: '' }
      }));

      return NextResponse.json({
        success: true,
        data: {
          tickets: enrichedTickets,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to get tickets');
    }
  }

  /**
   * Get ticket statistics for superadmin dashboard
   */
  static async getTicketStats() {
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

      // Count tickets by status (all time)
      const [
        totalTickets,
        newTickets,
        openTickets,
        reopenedTickets,
        pendingTickets,
        resolvedTickets,
        canceledTickets,
        lowPriorityTickets,
        mediumPriorityTickets,
        urgentPriorityTickets
      ] = await Promise.all([
        Ticket.countDocuments({}),
        Ticket.countDocuments({ status: 'new' }),
        Ticket.countDocuments({ status: 'open' }),
        Ticket.countDocuments({ status: 'reopened' }),
        Ticket.countDocuments({ status: 'pending' }),
        Ticket.countDocuments({ status: 'resolved' }),
        Ticket.countDocuments({ status: 'canceled' }),
        Ticket.countDocuments({ priority: 'low' }),
        Ticket.countDocuments({ priority: 'medium' }),
        Ticket.countDocuments({ priority: 'urgent' })
      ]);

      // Count tickets by status as of end of yesterday
      const [
        totalTicketsYesterday,
        newTicketsYesterday,
        openTicketsYesterday,
        reopenedTicketsYesterday,
        pendingTicketsYesterday,
        resolvedTicketsYesterday,
        canceledTicketsYesterday
      ] = await Promise.all([
        Ticket.countDocuments({ createdAt: { $lte: yesterdayEnd } }),
        Ticket.countDocuments({ status: 'new', createdAt: { $lte: yesterdayEnd } }),
        Ticket.countDocuments({ status: 'open', createdAt: { $lte: yesterdayEnd } }),
        Ticket.countDocuments({ status: 'reopened', createdAt: { $lte: yesterdayEnd } }),
        Ticket.countDocuments({ status: 'pending', createdAt: { $lte: yesterdayEnd } }),
        Ticket.countDocuments({ status: 'resolved', createdAt: { $lte: yesterdayEnd } }),
        Ticket.countDocuments({ status: 'canceled', createdAt: { $lte: yesterdayEnd } })
      ]);

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
          totalTickets,
          newTickets,
          openTickets,
          reopenedTickets,
          pendingTickets,
          resolvedTickets,
          canceledTickets,
          // Priority counts
          lowPriorityTickets,
          mediumPriorityTickets,
          urgentPriorityTickets,
          // Yesterday's counts for comparison
          yesterday: {
            totalTickets: totalTicketsYesterday,
            newTickets: newTicketsYesterday,
            openTickets: openTicketsYesterday,
            reopenedTickets: reopenedTicketsYesterday,
            pendingTickets: pendingTicketsYesterday,
            resolvedTickets: resolvedTicketsYesterday,
            canceledTickets: canceledTicketsYesterday
          },
          // Percentage changes
          changes: {
            totalTickets: calculateChange(totalTickets, totalTicketsYesterday),
            newTickets: calculateChange(newTickets, newTicketsYesterday),
            openTickets: calculateChange(openTickets, openTicketsYesterday),
            reopenedTickets: calculateChange(reopenedTickets, reopenedTicketsYesterday),
            pendingTickets: calculateChange(pendingTickets, pendingTicketsYesterday),
            resolvedTickets: calculateChange(resolvedTickets, resolvedTicketsYesterday),
            canceledTickets: calculateChange(canceledTickets, canceledTicketsYesterday)
          }
        }
      });
    } catch (error) {
      return handleApiError(error, 'Failed to get ticket statistics');
    }
  }
}

