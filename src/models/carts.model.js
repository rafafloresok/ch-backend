import { Schema, model } from "mongoose";

const cartsCollection = "carts";

const cartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

const cartsSchema = new Schema(
  {
    products: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

export const cartsModel = model(cartsCollection, cartsSchema);
