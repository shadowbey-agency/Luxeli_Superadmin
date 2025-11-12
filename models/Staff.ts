import mongoose, { Schema, Document } from "mongoose";

export interface IStaff extends Document {
  partnerId: string; // Reference to Partner
  staffName: string;
  email: string;
  phoneNumber: string;
  role: string;
  staffImage?: string;
  username: string;
  password: string;
  status: "active" | "disabled";
  createdAt: Date;
  updatedAt: Date;
}

const StaffSchema = new Schema<IStaff>(
  {
    partnerId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    staffName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    staffImage: {
      type: String, // Cloudinary or local image URL
      default: "",
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    status: {
      type: String,
      enum: ["active", "disabled"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Indexes for better query performance
StaffSchema.index({ partnerId: 1 });
StaffSchema.index({ email: 1 });
StaffSchema.index({ username: 1 });
StaffSchema.index({ status: 1 });
StaffSchema.index({ role: 1 });

// Force model recompilation to avoid overwrite issues
if (mongoose.models.Staff) {
  delete mongoose.models.Staff;
}

const Staff = mongoose.model<IStaff>("Staff", StaffSchema);

export default Staff;

