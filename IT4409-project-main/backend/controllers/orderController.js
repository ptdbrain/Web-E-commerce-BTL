import mongoose from "mongoose";
import Order, {
  EOrderStatus,
  EPaymentMethod,
} from "../models/Order.js";
import Voucher from "../models/Voucher.js";
import { createZaloPayOrder } from "../config/zalopay.js";
import { calculateVoucherForItems } from "./voucherController.js";
import {
  normalizeFulfillmentPayload,
  normalizeOrderItem,
} from "../utils/menuDomain.js";

export const createOrder = async (req, res) => {
  try {
    const customerId = req.user?.id;
    if (!customerId || !mongoose.isValidObjectId(customerId)) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const {
      customerName,
      customerPhone,
      customerEmail,
      note,
      paymentMethod,
      voucherCode,
      items,
    } = req.body || {};

    if (!customerName || !customerPhone) {
      return res.status(400).json({
        message: "Missing required fields (customerName, customerPhone)",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    const fulfillment = normalizeFulfillmentPayload(req.body || {});

    const normalizedItems = items.map((item) => {
      const normalized = normalizeOrderItem(item);
      if (!normalized.productId || !mongoose.isValidObjectId(normalized.productId)) {
        throw new Error("Invalid productId in items");
      }
      if (!normalized.productName) {
        throw new Error("productName is required in items");
      }
      return normalized;
    });

    const itemsSubtotal = normalizedItems.reduce(
      (sum, item) => sum + item.lineTotal,
      0
    );
    const originalTotalPrice = itemsSubtotal + fulfillment.deliveryFee;

    let finalTotalPrice = originalTotalPrice;
    let discountAmount = 0;
    let appliedVoucherId = null;
    let appliedVoucherCode = undefined;

    if (voucherCode && typeof voucherCode === "string") {
      const voucherResult = await calculateVoucherForItems({
        userId: customerId,
        code: voucherCode,
        items: normalizedItems.map((item) => ({
          productId: item.productId,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          lineTotal: item.lineTotal,
        })),
        orderTotal: originalTotalPrice,
        deliveryFee: fulfillment.deliveryFee,
        fulfillmentType: fulfillment.fulfillmentType,
      });

      if (voucherResult.errorMessage) {
        return res.status(400).json({ message: voucherResult.errorMessage });
      }

      discountAmount = voucherResult.discountAmount || 0;
      finalTotalPrice = voucherResult.finalTotal;
      appliedVoucherId = voucherResult.voucher?._id || null;
      appliedVoucherCode = voucherResult.voucher?.code || voucherCode;
    }

    const resolvedPaymentMethod = Object.values(EPaymentMethod).includes(
      paymentMethod
    )
      ? paymentMethod
      : EPaymentMethod.Cash;

    let paymentData = null;
    let zaloPayAppTransId = null;
    const orderStatus =
      resolvedPaymentMethod === EPaymentMethod.Zalopay
        ? EOrderStatus.WaitingForPayment
        : EOrderStatus.Pending;

    if (resolvedPaymentMethod === EPaymentMethod.Zalopay) {
      try {
        const clientUrl = process.env.CLIENT_URL?.split(",")[0] || "";
        const embedData = clientUrl ? { redirecturl: clientUrl } : {};

        const { data, appTransId } = await createZaloPayOrder({
          amount: finalTotalPrice,
          appUser: customerEmail || customerPhone || String(customerId),
          description: `Payment for fast-food order by ${customerName}`,
          embedData,
          items: normalizedItems.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            price: item.unitPrice,
          })),
          bankCode: undefined,
          callbackUrl: undefined,
        });
        paymentData = data;
        zaloPayAppTransId = appTransId;
      } catch (paymentErr) {
        console.error("createOrder ZaloPay error:", paymentErr);
        return res.status(502).json({
          message: "Failed to create ZaloPay payment",
        });
      }
    }

    const order = await Order.create({
      customerId,
      customerName,
      customerPhone,
      customerEmail,
      items: normalizedItems,
      orderStatus,
      paymentMethod: resolvedPaymentMethod,
      fulfillmentType: fulfillment.fulfillmentType,
      shippingAddress: fulfillment.shippingAddress,
      pickupTime: fulfillment.pickupTime,
      tableBooking: fulfillment.tableBooking,
      note,
      deliveryFee: fulfillment.deliveryFee,
      totalPrice: finalTotalPrice,
      originalTotalPrice,
      discountAmount,
      voucherCode: appliedVoucherCode,
      voucherId: appliedVoucherId,
      zaloPayAppTransId,
    });

    if (appliedVoucherId) {
      try {
        await Voucher.findByIdAndUpdate(appliedVoucherId, {
          $inc: { usedCount: 1 },
        });
      } catch (usageErr) {
        console.error("Failed to increment voucher usedCount", usageErr);
      }
    }

    return res.status(201).json({ order, paymentData });
  } catch (err) {
    const message = err?.message || "Server error";
    if (
      message.includes("Invalid") ||
      message.includes("required") ||
      message.includes("Missing") ||
      message.includes("Unsupported")
    ) {
      return res.status(400).json({ message });
    }
    console.error("createOrder error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const customerId = req.user?.id;
    if (!customerId || !mongoose.isValidObjectId(customerId)) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const orders = await Order.find({ customerId })
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ orders });
  } catch (err) {
    console.error("getMyOrders error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
    return res.json({ orders });
  } catch (err) {
    console.error("getAllOrders error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getOrderStats = async (req, res) => {
  try {
    let { granularity = "month", from, to } = req.query;

    if (!["month", "day"].includes(granularity)) {
      granularity = "month";
    }

    const minStart = new Date("2025-01-01T00:00:00.000Z");
    let startDate = from ? new Date(from) : minStart;
    let endDate = to ? new Date(to) : new Date();

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ message: "Tham so thoi gian khong hop le." });
    }

    if (startDate < minStart) startDate = minStart;

    const matchStage = {
      createdAt: { $gte: startDate, $lte: endDate },
    };

    const groupId =
      granularity === "day"
        ? {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          }
        : {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          };

    const raw = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: groupId,
          soldOrders: {
            $sum: {
              $cond: [{ $eq: ["$orderStatus", EOrderStatus.Confirmed] }, 1, 0],
            },
          },
          returnedOrders: {
            $sum: {
              $cond: [{ $eq: ["$orderStatus", EOrderStatus.Cancelled] }, 1, 0],
            },
          },
          revenue: {
            $sum: {
              $cond: [
                { $eq: ["$orderStatus", EOrderStatus.Confirmed] },
                "$totalPrice",
                0,
              ],
            },
          },
        },
      },
      {
        $sort:
          granularity === "day"
            ? { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
            : { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    const points = raw.map((item) => {
      const { _id, soldOrders, returnedOrders, revenue } = item;
      const label =
        granularity === "day"
          ? `${String(_id.day).padStart(2, "0")}/${String(_id.month).padStart(
              2,
              "0"
            )}`
          : `${String(_id.month).padStart(2, "0")}/${_id.year}`;

      return {
        label,
        year: _id.year,
        month: _id.month,
        day: _id.day,
        soldOrders,
        returnedOrders,
        revenue,
      };
    });

    return res.json({ granularity, from: startDate, to: endDate, points });
  } catch (err) {
    console.error("getOrderStats error", err);
    return res
      .status(500)
      .json({ message: "Loi server khi lay thong ke don hang." });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const customerId = req.user?.id;
    const orderId = req.params.id;

    if (!customerId || !mongoose.isValidObjectId(customerId)) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    if (!mongoose.isValidObjectId(orderId)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const order = await Order.findOne({ _id: orderId, customerId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.orderStatus === EOrderStatus.Cancelled) {
      return res.status(400).json({ message: "Order already cancelled" });
    }

    order.orderStatus = EOrderStatus.Cancelled;
    await order.save();

    return res.json({ order });
  } catch (err) {
    console.error("cancelOrder error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const confirmOrderByAdmin = async (req, res) => {
  try {
    const orderId = req.params.id;

    if (!mongoose.isValidObjectId(orderId)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (
      ![EOrderStatus.Pending, EOrderStatus.Confirmed].includes(order.orderStatus)
    ) {
      return res
        .status(400)
        .json({ message: "Khong the xac nhan don hang o trang thai nay" });
    }

    order.orderStatus = EOrderStatus.Shipping;
    await order.save();

    return res.json({
      order,
      message: "Don hang da duoc xac nhan va dang duoc xu ly",
    });
  } catch (err) {
    console.error("confirmOrderByAdmin error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const cancelOrderByAdmin = async (req, res) => {
  try {
    const orderId = req.params.id;

    if (!mongoose.isValidObjectId(orderId)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.orderStatus === EOrderStatus.Cancelled) {
      return res.status(400).json({ message: "Don hang da bi huy roi" });
    }

    order.orderStatus = EOrderStatus.Cancelled;
    await order.save();

    return res.json({ order, message: "Don hang da duoc huy" });
  } catch (err) {
    console.error("cancelOrderByAdmin error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const receiveOrder = async (req, res) => {
  try {
    const customerId = req.user?.id;
    const orderId = req.params.id;

    if (!customerId || !mongoose.isValidObjectId(customerId)) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    if (!mongoose.isValidObjectId(orderId)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const order = await Order.findOne({ _id: orderId, customerId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.orderStatus !== EOrderStatus.Shipping) {
      return res
        .status(400)
        .json({ message: "Chi co the hoan tat khi don dang duoc xu ly" });
    }

    order.orderStatus = EOrderStatus.Confirmed;
    await order.save();

    return res.json({ order, message: "Da xac nhan hoan tat don hang" });
  } catch (err) {
    console.error("receiveOrder error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const refundOrder = async (req, res) => {
  try {
    const customerId = req.user?.id;
    const orderId = req.params.id;

    if (!customerId || !mongoose.isValidObjectId(customerId)) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    if (!mongoose.isValidObjectId(orderId)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const order = await Order.findOne({ _id: orderId, customerId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.orderStatus !== EOrderStatus.Shipping) {
      return res
        .status(400)
        .json({ message: "Chi co the yeu cau hoan tien khi don dang xu ly" });
    }

    order.orderStatus = EOrderStatus.Refunded;
    await order.save();

    return res.json({ order, message: "Da yeu cau hoan tien thanh cong" });
  } catch (err) {
    console.error("refundOrder error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export default {
  createOrder,
  getMyOrders,
  getAllOrders,
  cancelOrder,
  getOrderStats,
  confirmOrderByAdmin,
  cancelOrderByAdmin,
  receiveOrder,
  refundOrder,
};
