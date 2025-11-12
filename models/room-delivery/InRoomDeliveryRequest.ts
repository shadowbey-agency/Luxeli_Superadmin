import mongoose, { Schema, Document } from "mongoose";

export interface IInRoomDeliveryRequest extends Document {
  partnerId: string; // Reference to Partner
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
    partnerId: {
      type: String,
      required: true,
      trim: true,
    },
    requestId: {
      type: String,
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

// Indexes for better query performance
inRoomDeliverySchema.index({ partnerId: 1 });
inRoomDeliverySchema.index({ partnerId: 1, requestId: 1 }, { unique: true }); // Unique requestId per partner
inRoomDeliverySchema.index({ status: 1 });
inRoomDeliverySchema.index({ createdAt: -1 });

export const InRoomDeliveryRequest =
  mongoose.models.InRoomDeliveryRequest ||
  mongoose.model<IInRoomDeliveryRequest>(
    "InRoomDeliveryRequest",
    inRoomDeliverySchema
  );

