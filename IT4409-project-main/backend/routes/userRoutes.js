import { Router } from "express";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";
import { getMe, updateMe, changePassword } from "../controllers/userController.js";

const router = Router();

// Chỉ dành cho user (customer) xem/cập nhật thông tin của chính mình
router.get("/user/me", authenticateToken, authorizeRoles("customer"), getMe);
router.put("/user/me", authenticateToken, authorizeRoles("customer"), updateMe);
router.put("/user/change-password", authenticateToken, authorizeRoles("customer"), changePassword);

export default router;
