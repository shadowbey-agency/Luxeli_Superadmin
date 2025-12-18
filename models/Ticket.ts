import mongoose, { Schema, Document } from "mongoose";

export interface ITicket extends Document {
  partnerId: string; // Reference to Partner
  ticketId: string; // Original ticket ID for partner use (e.g., TCKT-1234567890)
  superadminTicketId?: string; // Sequential ticket ID for superadmin display (e.g., #00001)
  title: string;
  priority: "low" | "medium" | "urgent";
  description: string;
  image?: string;
  status: "open" | "new" | "reopened" | "pending" | "resolved" | "canceled";
  assignee?: {
    name: string;
    profilePic?: string;
  };
  markasticket?: boolean; // Mark as ticket flag (superadmin can mark/unmark)
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new Schema<ITicket>(
  {
    partnerId: {
      type: String,
      required: true,
      trim: true,
    },
    ticketId: {
      type: String,
      default: () => `TCKT-${Date.now()}`, // Original ticket ID for partner use
      trim: true,
    },
    superadminTicketId: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "urgent"],
      default: "low",
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String, // store image URL (e.g., Cloudinary)
    },
    status: {
      type: String,
      enum: ["open", "new", "reopened", "pending", "resolved", "canceled"],
      default: "new", // default when new ticket is created
    },
    assignee: {
      name: { type: String },
      profilePic: { type: String },
    },
    markasticket: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // auto adds createdAt and updatedAt
);

// Indexes for better query performance
ticketSchema.index({ partnerId: 1 });
ticketSchema.index({ partnerId: 1, ticketId: 1 }, { unique: true }); // Unique ticketId per partner
ticketSchema.index({ superadminTicketId: 1 }, { unique: true, sparse: true }); // Unique superadminTicketId globally

// Auto-generate sequential superadmin ticket ID in format #00001, #00002, etc.
ticketSchema.pre("save", async function (next) {
  // Only generate superadminTicketId if it doesn't exist and this is a new document
  if (!this.superadminTicketId && this.isNew) {
    try {
      // Find all tickets with superadminTicketId
      const ticketsWithSuperadminId = await mongoose.model<ITicket>("Ticket")
        .find({ superadminTicketId: { $exists: true, $regex: /^#\d+$/ } })
        .select('superadminTicketId')
        .lean();

      let nextNumber = 1;
      if (ticketsWithSuperadminId.length > 0) {
        // Extract numbers from all superadminTicketIds and find the maximum
        const numbers = ticketsWithSuperadminId
          .map(t => {
            const match = t.superadminTicketId?.match(/#(\d+)/);
            return match ? parseInt(match[1], 10) : 0;
          })
          .filter(n => !isNaN(n));
        
        if (numbers.length > 0) {
          const maxNumber = Math.max(...numbers);
          nextNumber = maxNumber + 1;
        }
      }

      // Generate superadminTicketId in format #00001, #00002, etc. (5 digits)
      this.superadminTicketId = `#${String(nextNumber).padStart(5, "0")}`;
    } catch (err) {
      return next(err as any);
    }
  }

  // Update "updatedAt" whenever the document is modified
  if (this.isModified()) {
    this.updatedAt = new Date();
  }
  next();
});

// Ensure schema updates are applied during dev by resetting existing model
if (process.env.NODE_ENV !== 'production' && mongoose.models.Ticket) {
  delete mongoose.models.Ticket;
}

export const Ticket = mongoose.model<ITicket>("Ticket", ticketSchema);

export default Ticket;









