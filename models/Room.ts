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

// ✅ Auto-generate sequential roomId (#01, #02, #03...)
RoomSchema.pre("save", async function (next) {
  // if roomId already set, skip auto-generation
  if (this.roomId) return next();

  try {
    const lastRoom = await mongoose
      .model<IRoom>("Room")
      .findOne()
      .sort({ _id: -1 })
      .lean();

    let nextNumber = 1;
    if (lastRoom && lastRoom.roomId) {
      const lastNumber = parseInt(String(lastRoom.roomId).replace("#", ""), 10);
      if (!Number.isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }

    this.roomId = `#${String(nextNumber).padStart(2, "0")}`;
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
