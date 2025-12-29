import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  ticketId: string; // Reference to Ticket
  senderId: string; // User ID (superadmin, member, or partner)
  senderRole: "superadmin" | "member" | "partner";
  senderName: string; // Display name
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    ticketId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    senderId: {
      type: String,
      required: true,
      trim: true,
    },
    senderRole: {
      type: String,
      enum: ["superadmin", "member", "partner"],
      required: true,
    },
    senderName: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
  },
  { timestamps: true }
);

// Indexes for better query performance
messageSchema.index({ ticketId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1 });

// Ensure schema updates are applied during dev
if (process.env.NODE_ENV !== "production" && mongoose.models.Message) {
  delete mongoose.models.Message;
}

export const Message = mongoose.model<IMessage>("Message", messageSchema);
export default Message;

