import mongoose, { Schema, Document, models } from "mongoose";

export interface ISpecialRequest extends Document {
  userId: string; // Reference to the user who redeemed the special
  specialId: string; // Reference to the special
  title: string;
  description: string;
  type: string;
  discount: number;
  redemptionDate: Date;
  status: "Redeemed" | "Used" | "Expired";
  createdAt: Date;
  updatedAt: Date;
}

const specialRequestSchema = new Schema<ISpecialRequest>(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    specialId: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      min: 0,
    },
    redemptionDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Redeemed", "Used", "Expired"],
      default: "Redeemed",
    },
  },
  { timestamps: true }
);

// Indexes for better query performance
specialRequestSchema.index({ userId: 1 });
specialRequestSchema.index({ status: 1 });
specialRequestSchema.index({ createdAt: -1 });

export const SpecialRequest =
  models.SpecialRequest || mongoose.model<ISpecialRequest>("SpecialRequest", specialRequestSchema);

export default SpecialRequest;