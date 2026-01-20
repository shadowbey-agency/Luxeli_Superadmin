import mongoose, { Schema, Document } from "mongoose";

export interface IRestaurant extends Document {
  partnerId: string; // Reference to Partner
  restaurantName: string;
  status: "open" | "closed";
  startWork: string;
  endWork: string;
  restaurantImage?: string;
  items: {
    itemName: string;
    status: "published" | "unpublished";
    category: string;
    itemPrice: number;
    itemDescription: string;
    itemImage?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const RestaurantSchema = new Schema<IRestaurant>(
  {
    partnerId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    restaurantName: { type: String, required: true, trim: true },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    startWork: { type: String, required: true },
    endWork: { type: String, required: true },
    restaurantImage: { type: String },

    // 👇 items array directly inside same schema
    items: [
      {
        itemName: { type: String, required: true, trim: true },
        status: {
          type: String,
          enum: ["published", "unpublished"],
          default: "unpublished",
        },
        category: { type: String, required: true, trim: true },
        itemPrice: { type: Number, required: true },
        itemDescription: { type: String, required: true },
        itemImage: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// 🧩 Fix model overwrite issue in dev
if (process.env.NODE_ENV !== "production" && mongoose.models.Restaurant) {
  delete mongoose.models.Restaurant;
}

export const Restaurant = mongoose.model<IRestaurant>(
  "Restaurant",
  RestaurantSchema
);

export default Restaurant;

