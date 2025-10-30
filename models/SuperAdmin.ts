import mongoose, { Document, Schema } from 'mongoose';

export interface ISuperAdmin extends Document {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  profileImage?: string;
  role: 'superadmin';
  createdAt: Date;
  updatedAt: Date;
}

const SuperAdminSchema = new Schema<ISuperAdmin>({
  fullName: {
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
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String, // store image URL (e.g., Cloudinary or local path)
    default: null,
  },
  role: {
    type: String,
    default: 'superadmin',
    enum: ['superadmin'],
  },
}, {
  timestamps: true,
});

// Index for better query performance
SuperAdminSchema.index({ email: 1 });
SuperAdminSchema.index({ phoneNumber: 1 });

// Transform the output to remove sensitive data
SuperAdminSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.models.SuperAdmin || mongoose.model<ISuperAdmin>('SuperAdmin', SuperAdminSchema);
