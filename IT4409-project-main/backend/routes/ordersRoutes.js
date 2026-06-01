import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/auth.js";
import * as orderController from "../controllers/orderController.js";

const router = express.Router();

router.post("/orders", authenticateToken, orderController.createOrder);
router.get("/orders/my", authenticateToken, orderController.getMyOrders);
router.get(
  "/orders",
  authenticateToken,
  authorizeRoles("admin"),
  orderController.getAllOrders
);
router.put(
  "/orders/:id/cancel",
  authenticateToken,
  orderController.cancelOrder
);
router.get(
  "/orders/stats",
  authenticateToken,
  authorizeRoles("admin"),
  orderController.getOrderStats
);

// Admin routes
router.put(
  "/orders/:id/confirm",
  authenticateToken,
  authorizeRoles("admin"),
  orderController.confirmOrderByAdmin
);
router.put(
  "/orders/:id/admin-cancel",
  authenticateToken,
  authorizeRoles("admin"),
  orderController.cancelOrderByAdmin
);

// User routes for shipping orders
router.put(
  "/orders/:id/receive",
  authenticateToken,
  orderController.receiveOrder
);
router.put(
  "/orders/:id/refund",
  authenticateToken,
  orderController.refundOrder
);

export default router;
