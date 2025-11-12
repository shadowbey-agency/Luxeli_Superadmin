import mongoose, { Schema, Document } from "mongoose";

export interface IHousekeepingRequest extends Document {
  partnerId: string; // Reference to Partner
  roomId: string;
  roomName: string;
  guest: {
    name: string;
    email?: string;
  };
  type: "custom cleaning" | "item needed";

  // Custom Cleaning
  cleaningType?: "full room" | "quick refresh" | "custom";

  // Item Needed
  itemQuantity?: number;
  deliveryDetail?: {
    deliveryMethod: string;
    deliveryWindow: string; // "12:00 PM - 12:30 PM"
  };

  // Shared
  requestedFor: string; // for cleaning -> time info, for items -> item info
  status: "new" | "accepted" | "completed" | "no-show" | "canceled";
  priority: "urgent" | "medium" | "low";
  assignee?: {
    name: string;
    staffId: string;
    profilePic?: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const housekeepingRequestSchema = new Schema<IHousekeepingRequest>(
  {
    partnerId: {
      type: String,
      required: true,
      trim: true,
    },
    roomId: { type: String, required: true },
    roomName: { type: String, required: true },
    guest: {
      name: { type: String, required: true },
      email: String,
    },
    type: {
      type: String,
      enum: ["custom cleaning", "item needed"],
      required: true,
    },
    cleaningType: {
      type: String,
      enum: ["full room", "quick refresh", "custom"],
    },
    itemQuantity: Number,
    deliveryDetail: {
      deliveryMethod: String,
      deliveryWindow: String,
    },
    requestedFor: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["new", "accepted", "completed", "no-show", "canceled"],
      default: "new",
    },
    priority: {
      type: String,
      enum: ["urgent", "medium", "low"],
      default: "medium",
    },
    assignee: {
      name: String,
      staffId: String,
      profilePic: String,
    },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

// Indexes for better query performance
housekeepingRequestSchema.index({ partnerId: 1 });
housekeepingRequestSchema.index({ status: 1 });
housekeepingRequestSchema.index({ createdAt: -1 });

// ✅ Avoid re-compiling model in dev (hot reload)
if (process.env.NODE_ENV !== "production" && mongoose.models.HousekeepingRequest) {
  delete mongoose.models.HousekeepingRequest;
}

export const HousekeepingRequest = mongoose.model<IHousekeepingRequest>(
  "HousekeepingRequest",
  housekeepingRequestSchema
);

export default HousekeepingRequest;

