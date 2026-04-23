import express from "express";

import * as cartController from "../controllers/cartController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/cart", authenticateToken, cartController.getMyCart);
router.post("/cart/items", authenticateToken, cartController.addCartItem);
router.put("/cart/items/:cartKey", authenticateToken, cartController.updateCartItem);
router.delete(
  "/cart/items/:cartKey",
  authenticateToken,
  cartController.removeCartItemByKey
);

export default router;
