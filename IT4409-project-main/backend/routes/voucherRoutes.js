import express from "express";
import rateLimit from "express-rate-limit";

import {
  applyVoucher,
  createVoucher,
  deleteVoucher,
  getAvailableVouchersForUser,
  getVoucherById,
  getVouchers,
  searchCategoriesForVoucher,
  searchProductsForVoucher,
  searchUsersForVoucher,
  updateVoucher,
} from "../controllers/voucherController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

const adminVoucherLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

router.get(
  "/vouchers",
  authenticateToken,
  authorizeRoles("admin"),
  adminVoucherLimiter,
  getVouchers
);
router.post(
  "/vouchers",
  authenticateToken,
  authorizeRoles("admin"),
  adminVoucherLimiter,
  createVoucher
);
router.get(
  "/vouchers/search-users",
  authenticateToken,
  authorizeRoles("admin"),
  adminVoucherLimiter,
  searchUsersForVoucher
);
router.get(
  "/vouchers/search-products",
  authenticateToken,
  authorizeRoles("admin"),
  adminVoucherLimiter,
  searchProductsForVoucher
);
router.get(
  "/vouchers/search-categories",
  authenticateToken,
  authorizeRoles("admin"),
  adminVoucherLimiter,
  searchCategoriesForVoucher
);
router.get("/vouchers/available", authenticateToken, getAvailableVouchersForUser);
router.get(
  "/vouchers/:id",
  authenticateToken,
  authorizeRoles("admin"),
  adminVoucherLimiter,
  getVoucherById
);
router.put(
  "/vouchers/:id",
  authenticateToken,
  authorizeRoles("admin"),
  adminVoucherLimiter,
  updateVoucher
);
router.delete(
  "/vouchers/:id",
  authenticateToken,
  authorizeRoles("admin"),
  adminVoucherLimiter,
  deleteVoucher
);
router.post("/vouchers/apply", authenticateToken, applyVoucher);

export default router;
