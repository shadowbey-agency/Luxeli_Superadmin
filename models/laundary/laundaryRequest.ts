import mongoose, { Schema, Document, model, models } from "mongoose";

export interface ILaundryRequest extends Document {
  service: string;
  roomName: string;
  residentialName: string;
  services: string[];
  piece: number;
  pickup: Date;
  status: "new" | "accepted" | "completed" | "no-show" | "canceled";
  priority: "low" | "medium" | "urgent";
  notes?: string;
  assigne?: {
    name: string;
    staffId: string;
    profilePic?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const LaundryRequestSchema: Schema = new Schema(
  {
    service: { type: String, default: "laundry" },
    roomName: { type: String, required: true },
    residentialName: { type: String, required: true },
    services: [
      {
        type: String,
        enum: ["wash", "wash&iron", "dry cleaning", "duvets", "shoes", "others"],
        required: true,
      },
    ],
    piece: { type: Number, required: true },
    pickup: { type: Date, required: true },
    status: {
      type: String,
      enum: ["new", "accepted", "completed", "no-show", "canceled"],
      default: "new",
    },
    priority: { type: String, enum: ["low", "medium", "urgent"], default: "medium" },
    notes: { type: String },
    assigne: {
      name: { type: String },
      staffId: { type: String },
      profilePic: { type: String },
    },
  },
  { timestamps: true }
);

// 🔹 Use existing model if it exists
const LaundryRequest =
  models.LaundryRequest || model<ILaundryRequest>("LaundryRequest", LaundryRequestSchema);

export default LaundryRequest;
