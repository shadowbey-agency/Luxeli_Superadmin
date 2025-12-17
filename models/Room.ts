import mongoose, { Document, Schema } from "mongoose";

export interface IRoom extends Document {
  _id: string;
  partnerId: string; // Reference to Partner
  roomId: string; // e.g. "#01", "#02"
  roomName: string;
  roomStatus: "full" | "empty";
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema = new Schema<IRoom>(
  {
    partnerId: {
      type: String,
      required: true,
      trim: true,
    },
    roomId: {
      type: String,
      required: false, // ✅ Auto-generated
      trim: true,
    },
    roomName: {
      type: String,
      required: true,
      trim: true,
    },
    roomStatus: {
      type: String,
      enum: ["full", "empty"],
      default: "empty",
    },
  },
  { timestamps: true }
);

// ✅ Indexes for better query performance
RoomSchema.index({ partnerId: 1 });
RoomSchema.index({ partnerId: 1, roomId: 1 }, { unique: true }); // Unique roomId per partner
RoomSchema.index({ partnerId: 1, roomName: 1 }, { unique: true }); // Unique roomName per partner

// ✅ Auto-generate sequential roomId (#01, #02, #03...) per partner
RoomSchema.pre("save", async function (next) {
  // if roomId already set, skip auto-generation
  if (this.roomId) return next();

  try {
    // Find the last room for THIS partner only
    const lastRoom = await mongoose
      .model<IRoom>("Room")
      .findOne({ partnerId: this.partnerId })
      .sort({ roomId: -1 })
      .lean();

    let nextNumber = 1;
    if (lastRoom && lastRoom.roomId) {
      // Extract numeric portion from legacy formats (e.g., "#01", "R-01", "01")
      const lastNumber = parseInt(String(lastRoom.roomId).replace(/[^0-9]/g, ""), 10);
      if (!Number.isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }

    // Generate roomId and check for uniqueness
    let attempts = 0;
    // New format: numeric string without "#" (e.g., "01", "02", "10")
    let roomId = `${String(nextNumber).padStart(2, "0")}`;
    
    // Check if this roomId already exists for this partner
    while (attempts < 100) {
      const existingRoom = await mongoose
        .model<IRoom>("Room")
        .findOne({ partnerId: this.partnerId, roomId: roomId })
        .lean();
      
      if (!existingRoom) {
        // roomId is available
        break;
      }
      
      // roomId exists, try next number
      nextNumber++;
      roomId = `${String(nextNumber).padStart(2, "0")}`;
      attempts++;
    }

    this.roomId = roomId;
    next();
  } catch (err) {
    next(err as any);
  }
});

// ✅ Avoid re-compiling model in dev (hot reload)
if (process.env.NODE_ENV !== "production" && mongoose.models.Room) {
  delete mongoose.models.Room;
}

const Room = mongoose.model<IRoom>("Room", RoomSchema);

export default Room;
