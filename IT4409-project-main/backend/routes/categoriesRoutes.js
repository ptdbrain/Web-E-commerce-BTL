import express from "express";
import {
  createCategory,
  deleteCategory,
  getAdminCategories,
  getCategories,
  updateCategory,
} from "../controllers/categoryController.js";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";

const router = express.Router();

const requireAdmin = [authenticateToken, authorizeRole("admin")];

router.get("/categories", getCategories);
router.get("/admin/categories", ...requireAdmin, getAdminCategories);
router.post("/categories", ...requireAdmin, createCategory);
router.put("/categories/:id", ...requireAdmin, updateCategory);
router.delete("/categories/:id", ...requireAdmin, deleteCategory);

export default router;
