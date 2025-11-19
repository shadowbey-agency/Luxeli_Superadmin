import mongoose, { Schema, Document } from "mongoose";

export interface IHousekeepingItem extends Document {
  partnerId: string; // Reference to Partner
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const housekeepingItemSchema = new Schema<IHousekeepingItem>(
  {
    partnerId: {
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
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Bathroom", "Bedroom", "Kitchen", "Electronics", "Other"],
      default: "Other",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Indexes for better query performance
housekeepingItemSchema.index({ partnerId: 1 });
housekeepingItemSchema.index({ category: 1 });
housekeepingItemSchema.index({ isActive: 1 });

// ✅ Avoid re-compiling model in dev (hot reload)
if (process.env.NODE_ENV !== "production" && mongoose.models.HousekeepingItem) {
  delete mongoose.models.HousekeepingItem;
}

export const HousekeepingItem = mongoose.model<IHousekeepingItem>(
  "HousekeepingItem",
  housekeepingItemSchema
);

export default HousekeepingItem;