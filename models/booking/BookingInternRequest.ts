import mongoose, { Schema, Document } from "mongoose";

export interface IBookingInternRequest extends Document {
  partnerId: string; // Reference to Partner
  roomName: string;
  residentEmail: string;
  category: "spa/clubs" | "restaurant";
  status: "new" | "accepted" | "completed" | "no-show" | "canceled";
  assignee?: {
    name: string;
    staffId: string;
    profilePic?: string;
  };
  reservation: {
    date: string; // e.g. "Jan 12, 2025"
    time: string; // e.g. "12:30 PM"
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingInternRequestSchema = new Schema<IBookingInternRequest>(
  {
    partnerId: {
      type: String,
      required: true,
      trim: true,
    },
    roomName: { type: String, required: true },
    residentEmail: { type: String, required: true },

    category: {
      type: String,
      enum: ["spa/clubs", "restaurant"],
      required: true,
    },

    status: {
      type: String,
      enum: ["new", "accepted", "completed", "no-show", "canceled"],
      default: "new",
    },

    assignee: {
      name: String,
      staffId: String,
      profilePic: String,
    },

    reservation: {
      date: { type: String, required: true }, // e.g. "Jan 12, 2025"
      time: { type: String, required: true }, // e.g. "12:30 PM"
    },

    notes: { type: String, trim: true },
  },
  { timestamps: true } // auto adds createdAt and updatedAt
);

// Indexes for better query performance
bookingInternRequestSchema.index({ partnerId: 1 });
bookingInternRequestSchema.index({ status: 1 });
bookingInternRequestSchema.index({ createdAt: -1 });

// Avoid model overwrite error in dev
if (
  process.env.NODE_ENV !== "production" &&
  mongoose.models.BookingInternRequest
) {
  delete mongoose.models.BookingInternRequest;
}

export const BookingInternRequest = mongoose.model<IBookingInternRequest>(
  "BookingInternRequest",
  bookingInternRequestSchema
);

export default BookingInternRequest;

