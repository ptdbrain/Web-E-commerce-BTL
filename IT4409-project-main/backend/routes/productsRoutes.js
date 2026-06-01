import express from "express";
import upload from "../middleware/upload.js";
import * as productController from "../controllers/productController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.get("/products", productController.getProducts);
router.get("/products/featured", productController.getFeaturedProducts);
router.get("/products/bestsellers", productController.getBestSellerProducts);
router.get(
  "/admin/products",
  authenticateToken,
  authorizeRoles("admin"),
  productController.getAdminProducts
);
router.get("/products/:id", productController.getProductById);

router.post(
  "/products",
  authenticateToken,
  authorizeRoles("admin"),
  upload.array("images", 6),
  productController.createProduct
);

router.put(
  "/products/:id",
  authenticateToken,
  authorizeRoles("admin"),
  upload.array("images", 6),
  productController.updateProduct
);

router.delete(
  "/products/:id",
  authenticateToken,
  authorizeRoles("admin"),
  productController.deleteProduct
);

export default router;
