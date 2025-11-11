import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Ticket from '@/models/Ticket';
import { handleApiError } from '@/lib/middleware';

export class TicketController {
  /**
   * Get all tickets with pagination and filtering
   */
  static async getTickets(query: {
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
  }) {
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
  }) {
    try {
      await connectDB();

      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
        return NextResponse.json(
          { success: false, error: 'Ticket not found' },
          { status: 404 }
        );
      }

      // Update fields
      if (data.title) ticket.title = data.title.trim();
      if (data.description) ticket.description = data.description.trim();
      if (data.priority) ticket.priority = data.priority;
      if (data.image !== undefined) ticket.image = data.image;
      if (data.status) ticket.status = data.status;
      if (data.assignee !== undefined) ticket.assignee = data.assignee;

      await ticket.save();

      return NextResponse.json({
        success: true,
        data: {
          ticket: ticket.toJSON(),
        },
      });
    } catch (error) {
      return handleApiError(error, 'Failed to update ticket');
    }
  }

  /**
   * Delete ticket
   */
  static async deleteTicket(ticketId: string) {
    try {
      await connectDB();

      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
        return NextResponse.json(
          { success: false, error: 'Ticket not found' },
          { status: 404 }
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
}

