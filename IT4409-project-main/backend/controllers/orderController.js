import mongoose from "mongoose";
import Order, {
  EOrderStatus,
  EPaymentMethod,
  EPaymentStatus,
} from "../models/Order.js";
import Product from "../models/Product.js";
import Voucher from "../models/Voucher.js";
import { createZaloPayOrder } from "../config/zalopay.js";
import { calculateVoucherForItems } from "./voucherController.js";
import { normalizeFulfillmentPayload } from "../utils/menuDomain.js";
import {
  buildVoucherPricingItems,
  priceOrderItemsFromProducts,
} from "../utils/orderPricing.js";
import {
  getAdminOrderActionLabel,
  getAdminOrderAdvance,
} from "../utils/orderWorkflow.js";

const getProductIdsFromItems = (items = []) =>
  [
    ...new Set(
      (Array.isArray(items) ? items : [])
        .map((item) => String(item.productId || item.id || item._id || ""))
        .filter((productId) => mongoose.isValidObjectId(productId))
    ),
  ];

const loadProductsForOrderItems = async (items = []) => {
  const productIds = getProductIdsFromItems(items);
  if (productIds.length === 0) return [];
  return Product.find({ _id: { $in: productIds } }).lean();
};

const releaseInventoryForItems = async (items = []) => {
  const writes = (Array.isArray(items) ? items : [])
    .map((item) => ({
      productId: item.productId,
      quantity: Number(item.quantity || 0),
    }))
    .filter(
      (item) => mongoose.isValidObjectId(item.productId) && item.quantity > 0
    )
    .map((item) => ({
      updateOne: {
        filter: { _id: item.productId },
        update: {
          $inc: {
            stock: item.quantity,
            soldCount: -item.quantity,
          },
        },
      },
    }));

  if (writes.length > 0) {
    await Product.bulkWrite(writes);
  }
};

const reserveInventoryForItems = async (items = []) => {
  const reservedItems = [];

  for (const item of items) {
    const result = await Product.updateOne(
      {
        _id: item.productId,
        stock: { $gte: item.quantity },
        isActive: { $ne: false },
        isAvailable: { $ne: false },
      },
      {
        $inc: {
          stock: -item.quantity,
          soldCount: item.quantity,
        },
      }
    );

    if (result.modifiedCount !== 1) {
      await releaseInventoryForItems(reservedItems);
      throw new Error(
        `Product ${item.productName || item.productId} has not enough stock`
      );
    }

    reservedItems.push(item);
  }
};

const countVoucherUsage = async (order) => {
  if (!order?.voucherId || order.voucherUsageCounted) return;
  await Voucher.findByIdAndUpdate(order.voucherId, { $inc: { usedCount: 1 } });
  order.voucherUsageCounted = true;
};

const releaseVoucherUsage = async (order) => {
  if (!order?.voucherId || !order.voucherUsageCounted) return;
  await Voucher.findByIdAndUpdate(order.voucherId, {
    $inc: { usedCount: -1 },
  });
  order.voucherUsageCounted = false;
};

const releaseOrderReservations = async (order) => {
  if (!order || !order.stockReserved || order.stockReleased) return;
  await releaseInventoryForItems(order.items || []);
  order.stockReleased = true;
};

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

    const products = await loadProductsForOrderItems(items);
    const normalizedItems = priceOrderItemsFromProducts(items, products);

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
        items: buildVoucherPricingItems(normalizedItems),
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
    const paymentStatus =
      resolvedPaymentMethod === EPaymentMethod.Zalopay
        ? EPaymentStatus.Waiting
        : EPaymentStatus.Unpaid;

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

    await reserveInventoryForItems(normalizedItems);

    let order;
    try {
      order = await Order.create({
        customerId,
        customerName,
        customerPhone,
        customerEmail,
        items: normalizedItems,
        orderStatus,
        paymentStatus,
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
        stockReserved: true,
      });
    } catch (createErr) {
      await releaseInventoryForItems(normalizedItems);
      throw createErr;
    }

    if (appliedVoucherId && resolvedPaymentMethod !== EPaymentMethod.Zalopay) {
      try {
        await countVoucherUsage(order);
        await order.save();
      } catch (usageErr) {
        console.error("Failed to increment voucher usedCount", usageErr);
      }
    }

    return res.status(201).json({ order, paymentData });
  } catch (err) {
    const message = err?.message || "Server error";
    if (
      message.includes("Invalid") ||
      message.includes("not found") ||
      message.includes("not available") ||
      message.includes("stock") ||
      message.includes("exceeds") ||
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

    await releaseOrderReservations(order);
    await releaseVoucherUsage(order);
    order.orderStatus = EOrderStatus.Cancelled;
    if (order.paymentStatus === EPaymentStatus.Waiting) {
      order.paymentStatus = EPaymentStatus.Failed;
    } else if (order.paymentStatus === EPaymentStatus.Paid) {
      order.paymentStatus = EPaymentStatus.Refunded;
    }
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

    const nextStatus = getAdminOrderAdvance(
      order.orderStatus,
      order.fulfillmentType
    );
    const actionLabel = getAdminOrderActionLabel(
      order.orderStatus,
      order.fulfillmentType
    );

    if (!nextStatus) {
      return res
        .status(400)
        .json({ message: "Khong the xac nhan don hang o trang thai nay" });
    }

    order.orderStatus = nextStatus;
    if (
      nextStatus === EOrderStatus.Confirmed &&
      order.paymentMethod === EPaymentMethod.Cash
    ) {
      order.paymentStatus = EPaymentStatus.Paid;
    }
    await order.save();

    return res.json({
      order,
      message: actionLabel
        ? `${actionLabel} thanh cong`
        : "Da cap nhat trang thai don hang",
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

    await releaseOrderReservations(order);
    await releaseVoucherUsage(order);
    order.orderStatus = EOrderStatus.Cancelled;
    if (order.paymentStatus === EPaymentStatus.Paid) {
      order.paymentStatus = EPaymentStatus.Refunded;
    } else if (order.paymentStatus === EPaymentStatus.Waiting) {
      order.paymentStatus = EPaymentStatus.Failed;
    }
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
    if (order.paymentMethod === EPaymentMethod.Cash) {
      order.paymentStatus = EPaymentStatus.Paid;
    }
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

    await releaseOrderReservations(order);
    await releaseVoucherUsage(order);
    order.orderStatus = EOrderStatus.Refunded;
    order.paymentStatus = EPaymentStatus.Refunded;
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
