import mongoose, { Document, Schema } from "mongoose";

export interface IGuest extends Document {
  _id: string;
  partnerId: string; // Reference to Partner (hotel)
  roomId: string; // Reference to Room
  roomName: string; // Cached for quick access
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  isActive: boolean; // false when checked out
  checkInDate: Date;
  checkOutDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const guestSchema = new Schema<IGuest>(
  {
    partnerId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    roomId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    roomName: {
      type: String,
      required: true,
      trim: true,
    },
    guestName: {
      type: String,
      required: true,
      trim: true,
    },
    guestEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    guestPhone: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    checkInDate: {
      type: Date,
      default: Date.now,
    },
    checkOutDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Indexes for better query performance
guestSchema.index({ partnerId: 1, isActive: 1 });
guestSchema.index({ roomId: 1, isActive: 1 });
guestSchema.index({ guestEmail: 1 });

// Avoid re-compiling model in dev (hot reload)
if (process.env.NODE_ENV !== "production" && mongoose.models.Guest) {
  delete mongoose.models.Guest;
}

const Guest = mongoose.model<IGuest>("Guest", guestSchema);

export default Guest;

