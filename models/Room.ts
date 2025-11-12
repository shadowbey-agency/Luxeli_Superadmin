import mongoose, { Document, Schema } from "mongoose";

export interface IRoom extends Document {
  _id: string;
  partnerId: string; // Reference to Partner
  roomId: string; // e.g. "#01", "#02"
  roomName: string;
  roomStatus: "full" | "empty";
  resident: string | null;
  residentEmail: string | null;
  residentPhoneNo: string | null;
  checkInDate: Date | null;
  checkInTime: string | null; // e.g. "10:30"
  checkOutDate: Date | null;
  checkOutTime: string | null; // e.g. "12:00"
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema = new Schema<IRoom>(
  {
    partnerId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    roomId: {
      type: String,
      required: false, // ✅ changed to false (auto-generated)
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
    resident: {
      type: String,
      default: null,  
      trim: true,
    },
    residentEmail: {
      type: String,
      default: null,
      trim: true,
    },
    residentPhoneNo: {
      type: String,
      default: null,
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
