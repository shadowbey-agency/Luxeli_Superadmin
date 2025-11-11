import mongoose, { Schema, Document } from "mongoose";

export interface IInRoomDeliveryRequest extends Document {
  requestId: string; // Auto-generated like IRD0001
  roomName: string;
  residentialName: string;
  items: string[];
  restaurant: string;
  pickup: string;
  status: "new" | "accepted" | "completed" | "no-show" | "canceled";
  assignee?: {
    name: string;
    staffId: string;
    profilePic?: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const inRoomDeliverySchema = new Schema<IInRoomDeliveryRequest>(
  {
    requestId: {
      type: String,
      unique: true,
    },
    roomName: {
      type: String,
      required: true,
      trim: true,
    },
    residentialName: {
      type: String,
      required: true,
      trim: true,
    },
    items: {
      type: [String],
      required: true,
    },
    restaurant: {
      type: String,
      required: true,
      trim: true,
    },
    pickup: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["new", "accepted", "completed", "no-show", "canceled"],
      default: "new",
    },
    assignee: {
      name: { type: String },
      staffId: { type: String },
      profilePic: { type: String },
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Auto-generate ID like IRD0001, IRD0002, etc.
inRoomDeliverySchema.pre<IInRoomDeliveryRequest>("save", async function (next) {
  if (!this.isNew || this.requestId) return next();

  const lastRequest = await mongoose
    .model<IInRoomDeliveryRequest>("InRoomDeliveryRequest")
    .findOne({})
    .sort({ createdAt: -1 });

  let newId = "IRD0001";
  if (lastRequest && lastRequest.requestId) {
    const num = parseInt(lastRequest.requestId.replace("IRD", ""), 10) + 1;
    newId = "IRD" + num.toString().padStart(4, "0");
  }

  this.requestId = newId;
  next();
});

export const InRoomDeliveryRequest =
  mongoose.models.InRoomDeliveryRequest ||
  mongoose.model<IInRoomDeliveryRequest>(
    "InRoomDeliveryRequest",
    inRoomDeliverySchema
  );

