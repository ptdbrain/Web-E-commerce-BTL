import CryptoJS from "crypto-js";

import Order, { EOrderStatus, EPaymentStatus } from "../models/Order.js";
import Product from "../models/Product.js";
import Voucher from "../models/Voucher.js";
import { queryZaloPayStatus, zaloPayConfig } from "../config/zalopay.js";
import { consumeOrderCartItems } from "../services/orderCartSync.js";

const markOrderPaid = async (order) => {
  if (!order) return null;
  if ([EOrderStatus.Cancelled, EOrderStatus.Refunded].includes(order.orderStatus)) {
    return order;
  }

  if (order.orderStatus === EOrderStatus.WaitingForPayment) {
    order.orderStatus = EOrderStatus.Pending;
  }

  order.paymentStatus = EPaymentStatus.Paid;

  if (order.voucherId && !order.voucherUsageCounted) {
    await Voucher.findByIdAndUpdate(order.voucherId, { $inc: { usedCount: 1 } });
    order.voucherUsageCounted = true;
  }

  await order.save();
  await consumeOrderCartItems(order);
  return order;
};

const releaseInventoryForOrder = async (order) => {
  if (!order || !order.stockReserved || order.stockReleased) return;

  const writes = (Array.isArray(order.items) ? order.items : [])
    .map((item) => ({
      productId: item.productId,
      quantity: Number(item.quantity || 0),
    }))
    .filter((item) => item.productId && item.quantity > 0)
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

  order.stockReleased = true;
};

export const zaloPayCallback = async (req, res) => {
  const result = {};

  try {
    const dataStr = req.body?.data;
    const reqMac = req.body?.mac;

    if (!dataStr || !reqMac) {
      result.return_code = -1;
      result.return_message = "missing data or mac";
      return res.json(result);
    }

    const mac = CryptoJS.HmacSHA256(dataStr, zaloPayConfig.key2).toString();

    if (reqMac !== mac) {
      result.return_code = -1;
      result.return_message = "mac not equal";
      return res.json(result);
    }

    const dataJson = JSON.parse(dataStr);
    const appTransId = dataJson.app_trans_id;

    if (appTransId) {
      const order = await Order.findOne({ zaloPayAppTransId: appTransId });
      await markOrderPaid(order);
    }

    result.return_code = 1;
    result.return_message = "success";
  } catch (ex) {
    console.error("[ZaloPay] callback error:", ex);
    result.return_code = 0;
    result.return_message = ex.message;
  }

  return res.json(result);
};

export const checkZaloPayStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const customerId = req.user?.id;

    if (!customerId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const order = await Order.findOne({ _id: orderId, customerId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.orderStatus !== EOrderStatus.WaitingForPayment) {
      if (order.paymentStatus === EPaymentStatus.Paid) {
        await consumeOrderCartItems(order);
      }
      return res.json({
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        message: "Order is not waiting for payment",
      });
    }

    if (!order.zaloPayAppTransId) {
      return res.status(400).json({ message: "No ZaloPay transaction found" });
    }

    const zaloPayResult = await queryZaloPayStatus(order.zaloPayAppTransId);

    if (zaloPayResult.return_code === 1) {
      await markOrderPaid(order);

      return res.json({
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        zaloPayStatus: zaloPayResult,
        message: "Payment confirmed",
      });
    }

    if (zaloPayResult.return_code === 2) {
      return res.json({
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        zaloPayStatus: zaloPayResult,
        message: "Payment is processing",
      });
    }

    await releaseInventoryForOrder(order);
    order.paymentStatus = EPaymentStatus.Failed;
    await order.save();

    return res.json({
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      zaloPayStatus: zaloPayResult,
      message: "Payment failed or not completed",
    });
  } catch (err) {
    console.error("[ZaloPay] checkZaloPayStatus error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const confirmZaloPayOrder = async (req, res) =>
  res.status(410).json({
    message: "Manual ZaloPay confirmation is disabled. Use callback or status check.",
  });

export default { zaloPayCallback, checkZaloPayStatus, confirmZaloPayOrder };
