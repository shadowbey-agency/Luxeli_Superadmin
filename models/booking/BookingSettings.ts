import mongoose, { Schema, Document } from "mongoose";

export interface IBookingSettings extends Document {
  serviceName: string;
  category: string;
  serviceDescription: string;
  serviceLocation: string;
  servicePrice: number;
  startDate: Date;
  endDate: Date;
  status: "published" | "unpublished";
  bookDate: boolean; // true = booked, false = not booked
  serviceImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSettingsSchema = new Schema<IBookingSettings>(
  {
    serviceName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    serviceDescription: {
      type: String,
      required: true,
    },
    serviceLocation: {
      type: String,
      required: true,
    },
    servicePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["published", "unpublished"],
      default: "unpublished",
    },
    bookDate: {
      type: Boolean,
      default: false,
    },
    serviceImage: {
      type: String, // store URL (Cloudinary or local)
    },
  },
  { timestamps: true }
);

// 🕒 Update updatedAt before saving
bookingSettingsSchema.pre("save", function (next) {
  if (this.isModified()) {
    this.updatedAt = new Date();
  }
  next();
});

// Avoid model overwrite error in dev
if (
  process.env.NODE_ENV !== "production" &&
  mongoose.models.BookingSettings
) {
  delete mongoose.models.BookingSettings;
}

export const BookingSettings = mongoose.model<IBookingSettings>(
  "BookingSettings",
  bookingSettingsSchema
);

export default BookingSettings;































