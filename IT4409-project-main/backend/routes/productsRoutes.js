import express from "express";
import upload from "../middleware/upload.js";
import * as productController from "../controllers/productController.js";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/products", productController.getProducts);
router.get("/products/featured", productController.getFeaturedProducts);
router.get("/products/bestsellers", productController.getBestSellerProducts);
router.get("/products/:id", productController.getProductById);

router.post(
  "/products",
  authenticateToken,
  authorizeRole("admin"),
  upload.array("images", 6),
  productController.createProduct
);

router.put(
  "/products/:id",
  authenticateToken,
  authorizeRole("admin"),
  upload.array("images", 6),
  productController.updateProduct
);

router.delete(
  "/products/:id",
  authenticateToken,
  authorizeRole("admin"),
  productController.deleteProduct
);

export default router;
