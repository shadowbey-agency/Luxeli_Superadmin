import mongoose, { Schema, Document } from "mongoose";

export interface ICustomizedServiceRequest extends Document {
  customId: string; // CSR0001, CSR0002, ...
  roomName: string;
  residentEmail: string;
  title: string;
  description?: string;
  status: "new" | "accepted" | "completed" | "no-show" | "canceled";
  assignee?: {
    name: string;
    staffId: string;
    profilePic?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const customizedServiceRequestSchema = new Schema<ICustomizedServiceRequest>(
  {
    customId: { type: String, unique: true },
    roomName: { type: String, required: true },
    residentEmail: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, trim: true },

    status: {
      type: String,
      enum: ["new", "accepted", "completed", "no-show", "canceled"],
      default: "new",
    },

    assignee: {
      name: String,
      staffId: String,
      profilePic: String,
    },
  },
  { timestamps: true }
);

// 🔢 Auto-generate customId like CSR0001, CSR0002, ...
customizedServiceRequestSchema.pre("save", async function (next) {
  if (this.isNew && !this.customId) {
    try {
      const model = mongoose.model<ICustomizedServiceRequest>(
        "CustomizedServiceRequest"
      );
      const lastDoc = await model.findOne().sort({ createdAt: -1 });

      let nextNumber = 1;
      if (lastDoc && lastDoc.customId) {
        const match = lastDoc.customId.match(/\d+$/);
        if (match) nextNumber = parseInt(match[0], 10) + 1;
      }

      // Decide padding based on number size (e.g., CSR0001 → CSR00001 after 9999)
      const padding = nextNumber > 9999 ? 5 : 4;
      this.customId = `CSR${String(nextNumber).padStart(padding, "0")}`;
    } catch (error) {
      return next(error as Error);
    }
  }
  next();
});

// Avoid model overwrite error in dev
if (
  process.env.NODE_ENV !== "production" &&
  mongoose.models.CustomizedServiceRequest
) {
  delete mongoose.models.CustomizedServiceRequest;
}

export const CustomizedServiceRequest = mongoose.model<ICustomizedServiceRequest>(
  "CustomizedServiceRequest",
  customizedServiceRequestSchema
);

export default CustomizedServiceRequest;

