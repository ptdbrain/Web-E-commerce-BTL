import mongoose from "mongoose";

export const EOrderStatus = {
  WaitingForPayment: "waiting_for_payment",
  Pending: "pending",
  Confirmed: "confirmed",
  Shipping: "shipping",
  Cancelled: "cancelled",
  Refunded: "refunded",
};

export const EPaymentMethod = {
  Card: "card",
  Cash: "cash",
  Zalopay: "zalopay",
  Vnpay: "vnpay",
};

export const EFulfillmentType = {
  Delivery: "delivery",
  Pickup: "pickup",
  DineIn: "dine_in",
};

const OrderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String },
    items: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          default: () => new mongoose.Types.ObjectId(),
        },
        shipmentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Shipment",
        },
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productName: { type: String },
        productImage: { type: String },
        quantity: { type: Number, required: true },
        selectedSize: {
          label: { type: String },
          priceModifier: { type: Number, default: 0 },
        },
        selectedAddons: [
          {
            label: { type: String },
            price: { type: Number, default: 0 },
            quantity: { type: Number, default: 1 },
          },
        ],
        itemNote: { type: String },
        productDiscountCode: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "DiscountCode",
        },
        shippingDiscountCode: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "DiscountCode",
        },
        price: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        lineTotal: { type: Number, required: true },
        shippingPrice: { type: Number, required: true },
      },
    ],
    orderStatus: {
      type: String,
      enum: Object.values(EOrderStatus),
      default: EOrderStatus.Pending,
    },
    zaloPayAppTransId: { type: String },
    paymentMethod: {
      type: String,
      enum: Object.values(EPaymentMethod),
      required: true,
    },
    fulfillmentType: {
      type: String,
      enum: Object.values(EFulfillmentType),
      default: EFulfillmentType.Delivery,
    },
    shippingAddress: { type: String },
    pickupTime: { type: String },
    tableBooking: {
      guestCount: { type: Number },
      bookingTime: { type: String },
      contactNote: { type: String },
    },
    note: { type: String },
    deliveryFee: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    originalTotalPrice: { type: Number },
    discountAmount: { type: Number, default: 0 },
    voucherCode: { type: String },
    voucherId: { type: mongoose.Schema.Types.ObjectId, ref: "Voucher" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
