import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IPartnerMember extends Document {
  comparePassword(enteredPassword: string): Promise<boolean>;
  partnerId: string; // Reference to Partner
  memberName: string;
  email: string;
  phoneNumber: string;
  memberImage?: string;
  username: string;
  password: string;
  role: string;
  status: "active" | "disable";
  permissions: {
    dashboard: boolean;
    room: {
      rooms: boolean;
      requests: boolean;
    };
    support: {
      myTickets: boolean;
      ticketSaved: boolean;
    };
    team: {
      members: boolean;
      staff: boolean;
    };
    housekeeping: {
      requests: boolean;
      houseCleaning: boolean;
      requestManagement: boolean;
    };
    booking: {
      internalRequests: {
        allCategories: boolean;
        categoryName: boolean;
      };
      bookingSetting: boolean;
    };
    activityAlert: {
      requests: boolean;
      activities: boolean;
    };
    laundry: {
      requests: boolean;
      setting: boolean;
    };
    inRoomDelivery: {
      requests: boolean;
      restaurantName: boolean;
      restaurantSetting: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const PartnerMemberSchema = new Schema<IPartnerMember>(
  {
    partnerId: {
      type: String,
      required: true,
      trim: true,
    },
    memberName: {
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
    memberImage: {
      type: String, // Cloudinary or image URL
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
    role: {
      type: String,
      default: "partnermember",
      enum: ["partnermember"],
    },
    status: {
      type: String,
      enum: ["active", "disable"],
      default: "active",
    },
    permissions: {
      dashboard: { type: Boolean, default: false },
      room: {
        rooms: { type: Boolean, default: false },
        requests: { type: Boolean, default: false },
      },
      support: {
        myTickets: { type: Boolean, default: false },
        ticketSaved: { type: Boolean, default: false },
      },
      team: {
        members: { type: Boolean, default: false },
        staff: { type: Boolean, default: false },
      },
      housekeeping: {
        requests: { type: Boolean, default: false },
        houseCleaning: { type: Boolean, default: false },
        requestManagement: { type: Boolean, default: false },
      },
      booking: {
        internalRequests: {
          allCategories: { type: Boolean, default: false },
          categoryName: { type: Boolean, default: false },
        },
        bookingSetting: { type: Boolean, default: false },
      },
      activityAlert: {
        requests: { type: Boolean, default: false },
        activities: { type: Boolean, default: false },
      },
      laundry: {
        requests: { type: Boolean, default: false },
        setting: { type: Boolean, default: false },
      },
      inRoomDelivery: {
        requests: { type: Boolean, default: false },
        restaurantName: { type: Boolean, default: false },
        restaurantSetting: { type: Boolean, default: false },
      },
    },
  },
  { timestamps: true }
);

// Indexes for better query performance
PartnerMemberSchema.index({ partnerId: 1 });
// Compound unique index: email and username should be unique per partner
PartnerMemberSchema.index({ partnerId: 1, email: 1 }, { unique: true });
PartnerMemberSchema.index({ partnerId: 1, username: 1 }, { unique: true });
PartnerMemberSchema.index({ status: 1 });

// 🔐 Hash password before saving
PartnerMemberSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔍 Compare passwords for login
PartnerMemberSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hide sensitive fields
PartnerMemberSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Force model recompilation to avoid overwrite issues
if (mongoose.models.PartnerMember) {
  delete mongoose.models.PartnerMember;
}

const PartnerMember = mongoose.model<IPartnerMember>("PartnerMember", PartnerMemberSchema);

export default PartnerMember;

