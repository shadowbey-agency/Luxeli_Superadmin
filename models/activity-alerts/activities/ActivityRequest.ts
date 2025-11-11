import mongoose, { Schema, Document, models } from "mongoose";

export interface IActivityRequest extends Document {
  roomName: string;
  residentName: string;
  service: string;
  status: "new" | "accepted" | "completed" | "no-show" | "canceled";
  notes?: string;
  assignee?: {
    name: string;
    staffId: string;
    profilePic?: string;
  };
}

const ActivityRequestSchema = new Schema<IActivityRequest>(
  {
    roomName: { type: String, required: true },
    residentName: { type: String, required: true },
    service: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "accepted", "completed", "no-show", "canceled"],
      default: "new",
    },
    notes: { type: String },
    assignee: {
      name: String,
      staffId: String,
      profilePic: String,
    },
  },
  { timestamps: true }
);

export const ActivityRequest =
  models.ActivityRequest || mongoose.model<IActivityRequest>("ActivityRequest", ActivityRequestSchema);


