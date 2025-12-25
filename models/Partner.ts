import mongoose, { Document, Schema } from "mongoose";

export interface IPartner extends Document {
  _id: string;
  hotelName: string;
  hotelCity: string;
  hotelAddressEmail: string;
  phoneNumber: string;
  RC: string;
  ICE: string;
  identifiantFiscal: string;
  taxeProfessionnelle: string;
  hotelImage?: string;
  username: string;
  password: string;
  startDate: Date;
  endDate: Date;
  plan: "starter pack" | "gold pack";
  services: {
    housekeeping: {
      assigned: boolean;
      isActive: boolean;
    };
    bookingInterns: {
      assigned: boolean;
      isActive: boolean;
    };
    customizedServices: {
      assigned: boolean;
      isActive: boolean;
    };
    activityAlerts: {
      assigned: boolean;
      isActive: boolean;
    };
    laundry: {
      assigned: boolean;
      isActive: boolean;
    };
    roomDelivery: {
      assigned: boolean;
      isActive: boolean;
    };
  };
  status: "active" | "disable";
  createdAt: Date;
  updatedAt: Date;
}

const PartnerSchema = new Schema<IPartner>(
  {
    // Step 1: Hotel Info
    hotelName: { type: String, required: true, trim: true },
    hotelCity: { type: String, required: true, trim: true },
    hotelAddressEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
  
    phoneNumber: { type: String, required: true, trim: true },

    // Step 2: Legal Info
    RC: { type: String, required: true, trim: true },
    ICE: { type: String, required: true, trim: true },
    identifiantFiscal: { type: String, required: true, trim: true },
    taxeProfessionnelle: { type: String, required: true, trim: true },
    hotelImage: { type: String, default: null },

    // Step 3: Credentials
    username: { type: String, required: true, trim: true },
    password: { type: String, required: true, minlength: 6 },

    // Step 4: Subscription Info
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    plan: {
      type: String,
      enum: ["starter pack", "gold pack"],
      default: "starter pack",
    },
    services: {
      housekeeping: {
        assigned: { type: Boolean, default: false }, // SuperAdmin assigns/unassigns
        isActive: { type: Boolean, default: false }  // Partner enables/disables in settings
      },
      bookingInterns: {
        assigned: { type: Boolean, default: false },
        isActive: { type: Boolean, default: false }
      },
      customizedServices: {
        assigned: { type: Boolean, default: false },
        isActive: { type: Boolean, default: false }
      },
      activityAlerts: {
        assigned: { type: Boolean, default: false },
        isActive: { type: Boolean, default: false }
      },
      laundry: {
        assigned: { type: Boolean, default: false },
        isActive: { type: Boolean, default: false }
      },
      roomDelivery: {
        assigned: { type: Boolean, default: false },
        isActive: { type: Boolean, default: false }
      }
    },

    // Status
    status: {
      type: String,
      enum: ["active", "disable"],
      default: "active",
    },
  },
  { timestamps: true }
);

// ✅ Keep only non-unique indexes for faster lookups
PartnerSchema.index({ hotelCity: 1 });
PartnerSchema.index({ plan: 1 });
PartnerSchema.index({ status: 1 });

// 🔒 Hide sensitive data
PartnerSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Ensure schema updates are applied during dev by resetting existing model
if (process.env.NODE_ENV !== 'production' && mongoose.models.Partner) {
  delete mongoose.models.Partner;
}

const Partner = mongoose.model<IPartner>("Partner", PartnerSchema);

export default Partner;
