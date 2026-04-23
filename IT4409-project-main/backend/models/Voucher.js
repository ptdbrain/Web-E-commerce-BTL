import mongoose from "mongoose";

export const EVoucherDiscountType = {
  Percent: "percent",
  Amount: "amount",
  FreeShipping: "free_shipping",
};

const VoucherSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    discountType: {
      type: String,
      enum: Object.values(EVoucherDiscountType),
      required: true,
    },
    discountValue: { type: Number, required: true, min: 0 },
    maxDiscountAmount: { type: Number, default: 0, min: 0 },
    minOrderValue: { type: Number, default: 0, min: 0 },
    maxUsage: { type: Number, default: 0, min: 0 },
    usedCount: { type: Number, default: 0, min: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    isActive: { type: Boolean, default: true },
    appliesToAllUsers: { type: Boolean, default: false },
    appliesToAllProducts: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  },
  { timestamps: true }
);

export default mongoose.model("Voucher", VoucherSchema);
