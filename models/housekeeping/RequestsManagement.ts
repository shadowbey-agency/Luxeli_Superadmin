import mongoose, { Schema, Document } from "mongoose";

export interface IRequestsManagement extends Document {
  name: string;
  category: string;
  status: "published" | "unpublished";
  description: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const requestsManagementSchema = new Schema<IRequestsManagement>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["published", "unpublished"],
      default: "unpublished",
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String, // store image URL (Cloudinary or local)
    },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

// 🕒 Update "updatedAt" whenever the document is modified
requestsManagementSchema.pre("save", function (next) {
  if (this.isModified()) {
    this.updatedAt = new Date();
  }
  next();
});

// Ensure schema updates are applied during dev by resetting existing model
if (process.env.NODE_ENV !== 'production' && mongoose.models.RequestsManagement) {
  delete mongoose.models.RequestsManagement;
}

export const RequestsManagement = mongoose.model<IRequestsManagement>("RequestsManagement", requestsManagementSchema);

export default RequestsManagement;

