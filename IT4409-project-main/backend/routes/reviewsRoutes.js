import express from "express";
import { optionalAuth } from "../middleware/optionalAuth.js";
import {
  createReview,
  getReviewsByProduct,
} from "../controllers/reviewController.js";

const router = express.Router();

router.get("/product/:productId", getReviewsByProduct);
router.post("/product/:productId", optionalAuth, createReview);

export default router;
