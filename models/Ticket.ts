import mongoose, { Schema, Document } from "mongoose";

export interface ITicket extends Document {
  partnerId: string; // Reference to Partner
  ticketId: string;
  title: string;
  priority: "low" | "medium" | "urgent";
  description: string;
  image?: string;
  status: "open" | "new" | "reopened" | "pending" | "resolved" | "canceled";
  assignee?: {
    name: string;
    profilePic?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new Schema<ITicket>(
  {
    partnerId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    ticketId: {
      type: String,
      default: () => `TCKT-${Date.now()}`, // auto-generate unique ticketId
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
      default: "open", // default when new ticket is created
    },
    assignee: {
      name: { type: String },
      profilePic: { type: String },
    },
  },
  { timestamps: true } // auto adds createdAt and updatedAt
);

// Indexes for better query performance
ticketSchema.index({ partnerId: 1 });
ticketSchema.index({ partnerId: 1, ticketId: 1 }, { unique: true }); // Unique ticketId per partner

// 🕒 Update "updatedAt" whenever the document is modified
ticketSchema.pre("save", function (next) {
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









