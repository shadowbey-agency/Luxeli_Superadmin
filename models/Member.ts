 import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IMember extends Document {
  _id: string;
  name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  permissions: string[];
  role: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

const memberSchema = new Schema<IMember>(
  {
    name: {
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
    phone: {
      type: String,
      required: true,
      trim: true,
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
    // Permissions entered as an array of strings
    // Example from UI: ["dashboard", "partner", "billingFinance"]
    permissions: {
      type: [String],
      enum: ["dashboard", "partner", "subscription", "billingFinance", "support"],
      default: [],
    },
    role: {
      type: String,
      default: "member",
      enum: ["member"],
    },
    status: {
      type: String,
      default: "active",
      enum: ["active", "disable"],
    },
  },
  { timestamps: true }
);

// Indexes for better performance
memberSchema.index({ email: 1 });
memberSchema.index({ username: 1 });
memberSchema.index({ status: 1 });

// 🔐 Hash password before saving
memberSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔍 Compare passwords for login
memberSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hide sensitive fields
memberSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Force model recompilation to include new role field
if (mongoose.models.Member) {
  delete mongoose.models.Member;
}

const Member = mongoose.model<IMember>("Member", memberSchema);

export default Member;
