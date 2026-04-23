import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        cartKey: {
          type: String,
          required: true,
        },
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productName: {
          type: String,
          required: true,
        },
        productImage: {
          type: String,
          default: "",
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
          min: 1,
        },
        selectedSize: {
          label: { type: String, default: "" },
          priceModifier: { type: Number, default: 0 },
        },
        selectedAddons: [
          {
            label: { type: String, required: true },
            price: { type: Number, default: 0 },
            quantity: { type: Number, default: 1 },
          },
        ],
        itemNote: {
          type: String,
          default: "",
        },
        basePrice: {
          type: Number,
          required: true,
          default: 0,
        },
        unitPrice: {
          type: Number,
          required: true,
          default: 0,
        },
        lineTotal: {
          type: Number,
          required: true,
          default: 0,
        },
        addedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Cart", CartSchema);
