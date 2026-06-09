import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  createReview,
  getReviewsByProduct,
} from "../controllers/reviewController.js";

const router = express.Router();

router.get("/product/:productId", getReviewsByProduct);
router.post("/product/:productId", authenticateToken, createReview);

export default router;
