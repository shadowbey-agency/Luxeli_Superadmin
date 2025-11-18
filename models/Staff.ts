import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IStaff extends Document {
  comparePassword(enteredPassword: string): Promise<boolean>;
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
// Compound unique index: email and username should be unique per partner
StaffSchema.index({ partnerId: 1, email: 1 }, { unique: true });
StaffSchema.index({ partnerId: 1, username: 1 }, { unique: true });
StaffSchema.index({ status: 1 });
StaffSchema.index({ role: 1 });

// 🔐 Hash password before saving
StaffSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔍 Compare passwords for login
StaffSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hide sensitive fields
StaffSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Force model recompilation to avoid overwrite issues
if (mongoose.models.Staff) {
  delete mongoose.models.Staff;
}

const Staff = mongoose.model<IStaff>("Staff", StaffSchema);

export default Staff;

