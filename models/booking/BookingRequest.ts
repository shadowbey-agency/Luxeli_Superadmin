import mongoose, { Schema, Document } from "mongoose";

export interface IBookingRequest extends Document {
  userId: string; // Reference to the user who made the booking
  serviceId: string; // Reference to the booking service
  serviceName: string;
  serviceImage: string;
  serviceDescription: string;
  price: number;
  bookingDate: Date;
  timeSlot: string;
  customerNotes: string;
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed";
  createdAt: Date;
  updatedAt: Date;
}

const bookingRequestSchema = new Schema<IBookingRequest>(
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
      default: "",
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
bookingRequestSchema.index({ userId: 1 });
bookingRequestSchema.index({ status: 1 });
bookingRequestSchema.index({ createdAt: -1 });

// Avoid model overwrite error in dev
if (
  process.env.NODE_ENV !== "production" &&
  mongoose.models.BookingRequest
) {
  delete mongoose.models.BookingRequest;
}

export const BookingRequest = mongoose.model<IBookingRequest>(
  "BookingRequest",
  bookingRequestSchema
);

export default BookingRequest;