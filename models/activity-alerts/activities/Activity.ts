import mongoose, { Schema, Document } from "mongoose";

export interface IActivity extends Document {
  activityTitle: string;
  status: "published" | "unpublished";
  activityDescription: string;
  activityImage?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    activityTitle: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["published", "unpublished"],
      default: "unpublished",
    },
    activityDescription: {
      type: String,
      required: true,
    },
    activityImage: {
      type: String, // Store image URL (Cloudinary/local)
    },
    createdBy: {
      type: String,
      required: true, // Could be login userId or admin name
    },
  },
  { timestamps: true } // Auto adds createdAt & updatedAt
);

// 🔁 Update updatedAt on modification
activitySchema.pre("save", function (next) {
  if (this.isModified()) {
    this.updatedAt = new Date();
  }
  next();
});

// Fix model overwrite error in dev
if (process.env.NODE_ENV !== "production" && mongoose.models.Activity) {
  delete mongoose.models.Activity;
}

export const Activity = mongoose.model<IActivity>("Activity", activitySchema);

export default Activity;









































