import mongoose, { Document, Schema } from "mongoose";

export interface IRoomRequest extends Document {
  partnerId: string;        // Which hotel/partner
  roomId: string;           // Auto from QR
  roomName: string;         // Auto from QR

  guestName: string;        // User input
  guestPhone: string;       // User input

  requestStatus: "pending" | "approved" | "rejected";

  requestedAt: Date;
  approvedAt?: Date;
}

const RoomRequestSchema = new Schema<IRoomRequest>(
  {
    partnerId: {
      type: String,
      required: true,
      trim: true,
    },

    roomId: {
      type: String,
      required: true,
      trim: true,
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

    guestPhone: {
      type: String,
      required: true,
      trim: true,
    },

    requestStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    requestedAt: {
      type: Date,
      default: Date.now,
    },

    approvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// ✅ Indexes
RoomRequestSchema.index({ partnerId: 1 });
RoomRequestSchema.index({ partnerId: 1, roomId: 1 });
RoomRequestSchema.index({ requestStatus: 1 });

// ✅ Prevent duplicate pending requests for same room
RoomRequestSchema.index(
  { partnerId: 1, roomId: 1, requestStatus: 1 },
  { unique: true, partialFilterExpression: { requestStatus: "pending" } }
);

// Avoid model overwrite in dev
if (process.env.NODE_ENV !== "production" && mongoose.models.RoomRequest) {
  delete mongoose.models.RoomRequest;
}

const RoomRequest = mongoose.model<IRoomRequest>(
  "RoomRequest",
  RoomRequestSchema
);

export default RoomRequest;
