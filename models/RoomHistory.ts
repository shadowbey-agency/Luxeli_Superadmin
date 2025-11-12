import mongoose, { Document, Schema } from "mongoose";

export interface IRoomHistory extends Document {
  _id: string;
  partnerId: string; // Reference to Partner
  roomId: string; // Reference to the room
  roomName: string; // Room name at time of assignment
  resident: string;
  checkInDate: Date | null;
  checkInTime: string | null;
  checkOutDate: Date | null;
  checkOutTime: string | null;
  unassignedAt: Date; // When the room was unassigned
  createdAt: Date;
  updatedAt: Date;
}

const RoomHistorySchema = new Schema<IRoomHistory>(
  {
    partnerId: {
      type: String,
      required: true,
      index: true,
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
    resident: {
      type: String,
      required: true,
      trim: true,
    },
    checkInDate: {
      type: Date,
      default: null,
    },
    checkInTime: {
      type: String,
      default: null,
      trim: true,
    },
    checkOutDate: {
      type: Date,
      default: null,
    },
    checkOutTime: {
      type: String,
      default: null,
      trim: true,
    },
    unassignedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Indexes for faster queries
RoomHistorySchema.index({ partnerId: 1 });
RoomHistorySchema.index({ roomId: 1 });
RoomHistorySchema.index({ createdAt: -1 });

// ✅ Avoid re-compiling model in dev (hot reload)
if (process.env.NODE_ENV !== "production" && mongoose.models.RoomHistory) {
  delete mongoose.models.RoomHistory;
}

const RoomHistory = mongoose.model<IRoomHistory>("RoomHistory", RoomHistorySchema);

export default RoomHistory;

