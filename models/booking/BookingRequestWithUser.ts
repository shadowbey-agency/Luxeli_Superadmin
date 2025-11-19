import mongoose, { Schema, Document, models } from "mongoose";

export interface IBookingRequestWithUser extends Document {
  userId: string; // Reference to the user who made the booking
  serviceId: string; // Reference to the booking service
  serviceName: string;
  serviceImage: string;
  serviceDescription: string;
  price: number;
  bookingDate: Date;
  timeSlot: string;
  customerNotes?: string; // Make this optional
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed";
  createdAt: Date;
  updatedAt: Date;
}

const bookingRequestWithUserSchema = new Schema<IBookingRequestWithUser>(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    serviceId: {
      type: String,
      required: true,
      trim: true,
    },
    serviceName: {
      type: String,
      required: true,
      trim: true,
    },
    serviceImage: {
      type: String,
      required: true,
    },
    serviceDescription: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    customerNotes: {
      type: String,
      default: "", // Make this optional with a default empty string
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

// Indexes for better query performance
bookingRequestWithUserSchema.index({ userId: 1 });
bookingRequestWithUserSchema.index({ status: 1 });
bookingRequestWithUserSchema.index({ createdAt: -1 });

export const BookingRequestWithUser =
  models.BookingRequestWithUser || mongoose.model<IBookingRequestWithUser>("BookingRequestWithUser", bookingRequestWithUserSchema);

export default BookingRequestWithUser;